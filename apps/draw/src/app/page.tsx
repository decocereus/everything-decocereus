import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LocalTime } from "@/components/local-time.tsx";
import { createBoard, deleteBoard, listBoards } from "@/lib/boards.ts";

export const dynamic = "force-dynamic";

async function create(formData: FormData) {
  "use server";
  const doc = await createBoard(
    String(formData.get("name") ?? "").trim() || "Untitled"
  );
  redirect(`/b/${doc.id}`);
}

async function remove(formData: FormData) {
  "use server";
  await deleteBoard(String(formData.get("id")));
  revalidatePath("/");
}

export default async function Home() {
  const boards = await listBoards();
  return (
    <main className="page">
      <header className="page-head">
        <h1>Boards</h1>
        <Link className="quiet-link" href="/connect">
          Connect an agent
        </Link>
      </header>
      <form action={create} className="row">
        <input
          aria-label="New board name"
          className="input"
          name="name"
          placeholder="New board name"
        />
        <button className="btn" type="submit">
          New board
        </button>
      </form>
      {boards.length ? (
        <ul className="list">
          {boards.map((b) => (
            <li key={b.id}>
              <Link className="name" href={`/b/${b.id}`}>
                {b.name}
              </Link>
              <span className="meta">
                <LocalTime iso={b.updatedAt ?? b.createdAt} />
              </span>
              <form action={remove}>
                <input name="id" type="hidden" value={b.id} />
                <button
                  aria-label={`Delete ${b.name}`}
                  className="btn ghost danger"
                  type="submit"
                >
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">
          No boards yet. Create one above, or ask an agent to.
        </p>
      )}
    </main>
  );
}
