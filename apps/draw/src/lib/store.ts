import { createHash } from "node:crypto";
import {
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { AwsClient } from "aws4fetch";

export interface StoredObject {
  body: Uint8Array;
  contentType: string;
  etag: string;
}

export interface PutOptions {
  contentType?: string;
  /** Write only if the current object has this ETag. */
  ifMatch?: string;
  /** Write only if no object exists at the key. */
  ifNoneMatch?: boolean;
}

export interface ObjectStore {
  delete: (key: string) => Promise<void>;
  get: (key: string) => Promise<StoredObject | null>;
  list: (prefix: string) => Promise<{ key: string; lastModified: string }[]>;
  /** A short-lived URL the browser can GET or PUT directly, or null if unsupported. */
  presign: (
    key: string,
    method: "GET" | "HEAD" | "PUT",
    expiresSeconds: number
  ) => Promise<string | null>;
  /** Returns the new ETag, or null when a conditional write lost. */
  put: (
    key: string,
    body: Uint8Array | string,
    opts?: PutOptions
  ) => Promise<string | null>;
}

const enc = new TextEncoder();
const CONTENTS_RE = /<Contents>([\s\S]*?)<\/Contents>/g;
const KEY_RE = /<Key>([\s\S]*?)<\/Key>/;
const LAST_MODIFIED_RE = /<LastModified>([\s\S]*?)<\/LastModified>/;
const NEXT_TOKEN_RE =
  /<NextContinuationToken>([\s\S]*?)<\/NextContinuationToken>/;
const toBytes = (b: Uint8Array | string) =>
  typeof b === "string" ? enc.encode(b) : b;

class R2Store implements ObjectStore {
  private readonly client: AwsClient;
  private readonly base: string;

  constructor(
    accountId: string,
    accessKeyId: string,
    secretAccessKey: string,
    bucket: string
  ) {
    this.client = new AwsClient({
      accessKeyId,
      region: "auto",
      secretAccessKey,
      service: "s3",
    });
    this.base = `https://${accountId}.r2.cloudflarestorage.com/${bucket}`;
  }

  private url(key: string) {
    return `${this.base}/${key.split("/").map(encodeURIComponent).join("/")}`;
  }

  async get(key: string) {
    // Without identity encoding R2 gzips JSON and returns a weak ETag, which
    // If-Match rejects, so every conditional write would fail.
    const res = await this.client.fetch(this.url(key), {
      cache: "no-store",
      headers: { "accept-encoding": "identity" },
    });
    if (res.status === 404) {
      return null;
    }
    if (!res.ok) {
      throw new Error(
        `R2 GET ${key} failed: ${res.status} ${await res.text()}`
      );
    }
    return {
      body: new Uint8Array(await res.arrayBuffer()),
      contentType:
        res.headers.get("content-type") ?? "application/octet-stream",
      etag: res.headers.get("etag") ?? "",
    };
  }

  async put(key: string, body: Uint8Array | string, opts: PutOptions = {}) {
    const headers: Record<string, string> = {
      "content-type": opts.contentType ?? "application/octet-stream",
    };
    if (opts.ifMatch) {
      headers["if-match"] = opts.ifMatch;
    }
    if (opts.ifNoneMatch) {
      headers["if-none-match"] = "*";
    }
    const bytes = toBytes(body);
    // Sign, then send the raw bytes ourselves: a signed Request carries its
    // body as a stream, which goes out without Content-Length, and R2 rejects that.
    const signed = await this.client.sign(this.url(key), {
      body: bytes as BodyInit,
      headers,
      method: "PUT",
    });
    const res = await fetch(signed.url, {
      body: bytes as BodyInit,
      headers: signed.headers,
      method: "PUT",
    });
    if (res.status === 412) {
      return null;
    }
    if (!res.ok) {
      throw new Error(
        `R2 PUT ${key} failed: ${res.status} ${await res.text()}`
      );
    }
    return res.headers.get("etag") ?? "";
  }

  async delete(key: string) {
    const res = await this.client.fetch(this.url(key), { method: "DELETE" });
    if (!res.ok && res.status !== 404) {
      throw new Error(`R2 DELETE ${key} failed: ${res.status}`);
    }
  }

  async list(prefix: string) {
    const out: { key: string; lastModified: string }[] = [];
    let token: string | undefined;
    do {
      const q = new URLSearchParams({ "list-type": "2", prefix });
      if (token) {
        q.set("continuation-token", token);
      }
      // biome-ignore lint/performance/noAwaitInLoops: each page needs the previous page's continuation token
      const res = await this.client.fetch(`${this.base}?${q}`);
      if (!res.ok) {
        throw new Error(`R2 LIST ${prefix} failed: ${res.status}`);
      }
      const xml = await res.text();
      for (const m of xml.matchAll(CONTENTS_RE)) {
        const key = KEY_RE.exec(m[1])?.[1];
        const lastModified = LAST_MODIFIED_RE.exec(m[1])?.[1];
        if (key) {
          out.push({ key: decodeXml(key), lastModified: lastModified ?? "" });
        }
      }
      token = NEXT_TOKEN_RE.exec(xml)?.[1];
    } while (token);
    return out;
  }

  async presign(
    key: string,
    method: "GET" | "HEAD" | "PUT",
    expiresSeconds: number
  ) {
    const signed = await this.client.sign(
      new Request(`${this.url(key)}?X-Amz-Expires=${expiresSeconds}`, {
        method,
      }),
      { aws: { signQuery: true } }
    );
    return signed.url;
  }
}

const decodeXml = (s: string) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");

/** Local-disk store for development without R2 credentials. */
class FsStore implements ObjectStore {
  private readonly root: string;

  constructor(root: string) {
    this.root = root;
  }

  private file(key: string) {
    return path.join(this.root, key);
  }

  async get(key: string) {
    try {
      const body = new Uint8Array(await readFile(this.file(key)));
      let contentType = "application/octet-stream";
      try {
        contentType = (await readFile(`${this.file(key)}.ct`, "utf8")).trim();
      } catch {
        // No content-type sidecar: keep the default.
      }
      return { body, contentType, etag: etagOf(body) };
    } catch {
      return null;
    }
  }

  async put(key: string, body: Uint8Array | string, opts: PutOptions = {}) {
    const bytes = toBytes(body);
    const current = await this.get(key);
    if (opts.ifNoneMatch && current) {
      return null;
    }
    if (opts.ifMatch && current?.etag !== opts.ifMatch) {
      return null;
    }
    await mkdir(path.dirname(this.file(key)), { recursive: true });
    await writeFile(this.file(key), bytes);
    if (opts.contentType) {
      await writeFile(`${this.file(key)}.ct`, opts.contentType);
    }
    return etagOf(bytes);
  }

  async delete(key: string) {
    await rm(this.file(key), { force: true });
    await rm(`${this.file(key)}.ct`, { force: true });
  }

  async list(prefix: string) {
    const dir = path.dirname(this.file(prefix));
    let names: string[] = [];
    try {
      names = await readdir(dir);
    } catch {
      return [];
    }
    const base = path.relative(this.root, dir);
    const matches = names
      .filter((name) => !name.endsWith(".ct"))
      .map((name) => ({ key: base ? `${base}/${name}` : name, name }))
      .filter(({ key }) => key.startsWith(prefix));
    return Promise.all(
      matches.map(async ({ key, name }) => {
        const s = await stat(path.join(dir, name));
        return { key, lastModified: s.mtime.toISOString() };
      })
    );
  }

  presign(): Promise<string | null> {
    return Promise.resolve(null);
  }
}

/** In-memory store for tests. */
export class MemoryStore implements ObjectStore {
  objects = new Map<string, StoredObject & { lastModified: string }>();

  get(key: string): Promise<StoredObject | null> {
    return Promise.resolve(this.objects.get(key) ?? null);
  }

  put(
    key: string,
    body: Uint8Array | string,
    opts: PutOptions = {}
  ): Promise<string | null> {
    const current = this.objects.get(key);
    if (opts.ifNoneMatch && current) {
      return Promise.resolve(null);
    }
    if (opts.ifMatch && current?.etag !== opts.ifMatch) {
      return Promise.resolve(null);
    }
    const bytes = toBytes(body);
    const etag = etagOf(bytes);
    this.objects.set(key, {
      body: bytes,
      contentType: opts.contentType ?? "application/octet-stream",
      etag,
      lastModified: new Date().toISOString(),
    });
    return Promise.resolve(etag);
  }

  delete(key: string): Promise<void> {
    this.objects.delete(key);
    return Promise.resolve();
  }

  list(prefix: string): Promise<{ key: string; lastModified: string }[]> {
    return Promise.resolve(
      [...this.objects.entries()]
        .filter(([k]) => k.startsWith(prefix))
        .map(([key, o]) => ({ key, lastModified: o.lastModified }))
    );
  }

  presign(): Promise<string | null> {
    return Promise.resolve(null);
  }
}

const etagOf = (b: Uint8Array) =>
  `"${createHash("md5").update(b).digest("hex")}"`;

let store: ObjectStore | undefined;

export function getStore(): ObjectStore {
  if (store) {
    return store;
  }
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } =
    process.env;
  if (R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET) {
    store = new R2Store(
      R2_ACCOUNT_ID,
      R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY,
      R2_BUCKET
    );
  } else if (process.env.VERCEL) {
    throw new Error(
      "R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET must be set"
    );
  } else {
    store = new FsStore(path.join(process.cwd(), ".data"));
  }
  return store;
}

export function setStoreForTests(s: ObjectStore) {
  store = s;
}
