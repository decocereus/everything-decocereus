import { isAuthorized, unauthorized, verifyRenderToken } from "@/lib/auth.ts";
import { fileKey } from "@/lib/boards.ts";
import { getStore } from "@/lib/store.ts";

interface Ctx {
  params: Promise<{ fileId: string }>;
}

const MAX_BYTES = 4 * 1024 * 1024;
const FILE_ID_RE = /^[A-Za-z0-9_-]{8,128}$/;
const validId = (id: string) => FILE_ID_RE.test(id);

// Image files are content-addressed by Excalidraw's file id, so they can be cached forever.
export async function GET(req: Request, { params }: Ctx) {
  const { fileId } = await params;
  const q = new URL(req.url).searchParams;
  // The headless renderer has no session; it passes its board-scoped render token.
  const renderOk = await verifyRenderToken(
    q.get("rt") ?? undefined,
    q.get("board") ?? ""
  );
  if (!(renderOk || (await isAuthorized(req)))) {
    return unauthorized();
  }
  if (!validId(fileId)) {
    return Response.json({ error: "bad file id" }, { status: 400 });
  }
  const obj = await getStore().get(fileKey(fileId));
  if (!obj) {
    return new Response(null, { status: 404 });
  }
  return new Response(obj.body as BodyInit, {
    headers: {
      "cache-control": "private, max-age=31536000, immutable",
      "content-type": obj.contentType,
    },
  });
}

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await isAuthorized(req))) {
    return unauthorized();
  }
  const { fileId } = await params;
  if (!validId(fileId)) {
    return Response.json({ error: "bad file id" }, { status: 400 });
  }
  const contentType =
    req.headers.get("content-type") ?? "application/octet-stream";
  if (!contentType.startsWith("image/")) {
    return Response.json({ error: "images only" }, { status: 415 });
  }
  const body = new Uint8Array(await req.arrayBuffer());
  if (body.byteLength > MAX_BYTES) {
    return Response.json({ error: "file too large" }, { status: 413 });
  }
  await getStore().put(fileKey(fileId), body, {
    contentType,
    ifNoneMatch: true,
  });
  return Response.json({ ok: true });
}
