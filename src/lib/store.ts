import { AwsClient } from "aws4fetch";
import { mkdir, readFile, rm, stat, writeFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

export type StoredObject = { body: Uint8Array; etag: string; contentType: string };

export type PutOptions = {
  contentType?: string;
  /** Write only if the current object has this ETag. */
  ifMatch?: string;
  /** Write only if no object exists at the key. */
  ifNoneMatch?: boolean;
};

export interface ObjectStore {
  get(key: string): Promise<StoredObject | null>;
  /** Returns the new ETag, or null when a conditional write lost. */
  put(key: string, body: Uint8Array | string, opts?: PutOptions): Promise<string | null>;
  delete(key: string): Promise<void>;
  list(prefix: string): Promise<{ key: string; lastModified: string }[]>;
  /** A short-lived URL the browser can GET or PUT directly, or null if unsupported. */
  presign(key: string, method: "GET" | "PUT", expiresSeconds: number): Promise<string | null>;
}

const enc = new TextEncoder();
const toBytes = (b: Uint8Array | string) => (typeof b === "string" ? enc.encode(b) : b);

class R2Store implements ObjectStore {
  private client: AwsClient;
  private base: string;

  constructor(accountId: string, accessKeyId: string, secretAccessKey: string, bucket: string) {
    this.client = new AwsClient({ accessKeyId, secretAccessKey, service: "s3", region: "auto" });
    this.base = `https://${accountId}.r2.cloudflarestorage.com/${bucket}`;
  }

  private url(key: string) {
    return `${this.base}/${key.split("/").map(encodeURIComponent).join("/")}`;
  }

  async get(key: string) {
    const res = await this.client.fetch(this.url(key), { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`R2 GET ${key} failed: ${res.status} ${await res.text()}`);
    return {
      body: new Uint8Array(await res.arrayBuffer()),
      etag: res.headers.get("etag") ?? "",
      contentType: res.headers.get("content-type") ?? "application/octet-stream",
    };
  }

  async put(key: string, body: Uint8Array | string, opts: PutOptions = {}) {
    const headers: Record<string, string> = {
      "content-type": opts.contentType ?? "application/octet-stream",
    };
    if (opts.ifMatch) headers["if-match"] = opts.ifMatch;
    if (opts.ifNoneMatch) headers["if-none-match"] = "*";
    const res = await this.client.fetch(this.url(key), {
      method: "PUT",
      headers,
      body: toBytes(body) as BodyInit,
    });
    if (res.status === 412) return null;
    if (!res.ok) throw new Error(`R2 PUT ${key} failed: ${res.status} ${await res.text()}`);
    return res.headers.get("etag") ?? "";
  }

  async delete(key: string) {
    const res = await this.client.fetch(this.url(key), { method: "DELETE" });
    if (!res.ok && res.status !== 404) throw new Error(`R2 DELETE ${key} failed: ${res.status}`);
  }

  async list(prefix: string) {
    const out: { key: string; lastModified: string }[] = [];
    let token: string | undefined;
    do {
      const q = new URLSearchParams({ "list-type": "2", prefix });
      if (token) q.set("continuation-token", token);
      const res = await this.client.fetch(`${this.base}?${q}`);
      if (!res.ok) throw new Error(`R2 LIST ${prefix} failed: ${res.status}`);
      const xml = await res.text();
      for (const m of xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)) {
        const key = /<Key>([\s\S]*?)<\/Key>/.exec(m[1])?.[1];
        const lastModified = /<LastModified>([\s\S]*?)<\/LastModified>/.exec(m[1])?.[1];
        if (key) out.push({ key: decodeXml(key), lastModified: lastModified ?? "" });
      }
      token = /<NextContinuationToken>([\s\S]*?)<\/NextContinuationToken>/.exec(xml)?.[1];
    } while (token);
    return out;
  }

  async presign(key: string, method: "GET" | "PUT", expiresSeconds: number) {
    const signed = await this.client.sign(
      new Request(`${this.url(key)}?X-Amz-Expires=${expiresSeconds}`, { method }),
      { aws: { signQuery: true } },
    );
    return signed.url;
  }
}

const decodeXml = (s: string) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");

/** Local-disk store for development without R2 credentials. */
class FsStore implements ObjectStore {
  constructor(private root: string) {}

  private file(key: string) {
    return path.join(this.root, key);
  }

  async get(key: string) {
    try {
      const body = new Uint8Array(await readFile(this.file(key)));
      let contentType = "application/octet-stream";
      try {
        contentType = (await readFile(this.file(key) + ".ct", "utf8")).trim();
      } catch {}
      return { body, etag: etagOf(body), contentType };
    } catch {
      return null;
    }
  }

  async put(key: string, body: Uint8Array | string, opts: PutOptions = {}) {
    const bytes = toBytes(body);
    const current = await this.get(key);
    if (opts.ifNoneMatch && current) return null;
    if (opts.ifMatch && current?.etag !== opts.ifMatch) return null;
    await mkdir(path.dirname(this.file(key)), { recursive: true });
    await writeFile(this.file(key), bytes);
    if (opts.contentType) await writeFile(this.file(key) + ".ct", opts.contentType);
    return etagOf(bytes);
  }

  async delete(key: string) {
    await rm(this.file(key), { force: true });
    await rm(this.file(key) + ".ct", { force: true });
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
    const out = [];
    for (const name of names) {
      if (name.endsWith(".ct")) continue;
      const key = base ? `${base}/${name}` : name;
      if (!key.startsWith(prefix)) continue;
      const s = await stat(path.join(dir, name));
      out.push({ key, lastModified: s.mtime.toISOString() });
    }
    return out;
  }

  async presign() {
    return null;
  }
}

/** In-memory store for tests. */
export class MemoryStore implements ObjectStore {
  objects = new Map<string, StoredObject & { lastModified: string }>();

  async get(key: string) {
    return this.objects.get(key) ?? null;
  }

  async put(key: string, body: Uint8Array | string, opts: PutOptions = {}) {
    const current = this.objects.get(key);
    if (opts.ifNoneMatch && current) return null;
    if (opts.ifMatch && current?.etag !== opts.ifMatch) return null;
    const bytes = toBytes(body);
    const etag = etagOf(bytes);
    this.objects.set(key, {
      body: bytes,
      etag,
      contentType: opts.contentType ?? "application/octet-stream",
      lastModified: new Date().toISOString(),
    });
    return etag;
  }

  async delete(key: string) {
    this.objects.delete(key);
  }

  async list(prefix: string) {
    return [...this.objects.entries()]
      .filter(([k]) => k.startsWith(prefix))
      .map(([key, o]) => ({ key, lastModified: o.lastModified }));
  }

  async presign() {
    return null;
  }
}

const etagOf = (b: Uint8Array) => `"${createHash("md5").update(b).digest("hex")}"`;

let store: ObjectStore | undefined;

export function getStore(): ObjectStore {
  if (store) return store;
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;
  if (R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET) {
    store = new R2Store(R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET);
  } else if (process.env.VERCEL) {
    throw new Error("R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET must be set");
  } else {
    store = new FsStore(path.join(process.cwd(), ".data"));
  }
  return store;
}

export function setStoreForTests(s: ObjectStore) {
  store = s;
}
