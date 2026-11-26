import { isAuthorized, unauthorized } from "@/lib/auth.ts";
import { boardKey } from "@/lib/boards.ts";
import { getStore } from "@/lib/store.ts";

// Fallback for local development, where there's no R2 URL to poll directly.
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorized(req))) {
    return unauthorized();
  }
  const { id } = await params;
  const obj = await getStore().get(boardKey(id));
  if (!obj) {
    return new Response(null, { status: 404 });
  }
  return new Response(obj.body as BodyInit, {
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json",
      etag: obj.etag,
    },
  });
}

export async function HEAD(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const res = await GET(req, ctx);
  return new Response(null, { headers: res.headers, status: res.status });
}
