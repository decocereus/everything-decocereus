import { isAuthorized, unauthorized, verifyRenderToken } from "@/lib/auth.ts";
import {
  boardKey,
  deleteBoard,
  getBoard,
  NotFoundError,
  renameBoard,
} from "@/lib/boards.ts";
import { getStore } from "@/lib/store.ts";

interface Ctx {
  params: Promise<{ id: string }>;
}

const POLL_URL_TTL = 3600;

export async function GET(req: Request, { params }: Ctx) {
  const { id } = await params;
  const rt = new URL(req.url).searchParams.get("rt") ?? undefined;
  if (!((await isAuthorized(req)) || (await verifyRenderToken(rt, id)))) {
    return unauthorized();
  }
  try {
    const { doc, etag } = await getBoard(id);
    // The browser watches the board by sending HEAD requests straight to R2
    // and GETs the board only when the ETag changes, so watching costs no
    // function invocations. (Conditional GETs don't work: R2 leaves CORS
    // headers off 304 responses.) Without R2 it falls back to the poll route.
    const store = getStore();
    const [headUrl, getUrl] = await Promise.all([
      store.presign(boardKey(id), "HEAD", POLL_URL_TTL),
      store.presign(boardKey(id), "GET", POLL_URL_TTL),
    ]);
    const fallback = `/api/boards/${id}/poll`;
    return Response.json({
      doc,
      etag,
      getUrl: getUrl ?? fallback,
      headUrl: headUrl ?? fallback,
      pollExpiresAt: Date.now() + POLL_URL_TTL * 1000,
    });
  } catch (e) {
    if (e instanceof NotFoundError) {
      return Response.json({ error: e.message }, { status: 404 });
    }
    throw e;
  }
}

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await isAuthorized(req))) {
    return unauthorized();
  }
  const { id } = await params;
  const { name } = (await req.json()) as { name?: string };
  if (!name?.trim()) {
    return Response.json({ error: "name required" }, { status: 400 });
  }
  await renameBoard(id, name.trim());
  return Response.json({ ok: true });
}

export async function DELETE(req: Request, { params }: Ctx) {
  if (!(await isAuthorized(req))) {
    return unauthorized();
  }
  const { id } = await params;
  await deleteBoard(id);
  return Response.json({ ok: true });
}
