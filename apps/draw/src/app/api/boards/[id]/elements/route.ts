import { isAuthorized, unauthorized } from "@/lib/auth.ts";
import { saveElements } from "@/lib/boards.ts";
import type { El } from "@/lib/elements.ts";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorized(req))) {
    return unauthorized();
  }
  const { id } = await params;
  const { elements, appState } = (await req.json()) as {
    elements: El[];
    appState?: { viewBackgroundColor?: string };
  };
  if (!Array.isArray(elements)) {
    return Response.json(
      { error: "elements must be an array" },
      { status: 400 }
    );
  }
  const { result, etag } = await saveElements(id, elements, appState);
  return Response.json({ changed: result, etag });
}
