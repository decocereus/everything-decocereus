import { isAuthorized, unauthorized } from "@/lib/auth";
import { createBoard, listBoards } from "@/lib/boards";

export async function GET(req: Request) {
  if (!(await isAuthorized(req))) return unauthorized();
  return Response.json({ boards: await listBoards() });
}

export async function POST(req: Request) {
  if (!(await isAuthorized(req))) return unauthorized();
  const { name } = (await req.json().catch(() => ({}))) as { name?: string };
  const doc = await createBoard(name?.trim() || "Untitled");
  return Response.json({ id: doc.id });
}
