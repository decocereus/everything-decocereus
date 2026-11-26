import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BoardRow, Submit } from "@/components/board-row.tsx";
import { ThemeToggle } from "@/components/theme-toggle.tsx";
import {
  createBoard,
  deleteBoard,
  listBoards,
  renameBoard,
} from "@/lib/boards.ts";

export const dynamic = "force-dynamic";

async function create(formData: FormData) {
  "use server";
  const doc = await createBoard(
    String(formData.get("name") ?? "").trim() || "Untitled"
  );
  redirect(`/b/${doc.id}`);
}

async function rename(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "").trim();
  if (name) {
    await renameBoard(String(formData.get("id")), name);
  }
  revalidatePath("/");
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
        <h1>
          Boards
          {boards.length ? (
            <span className="count">{boards.length}</span>
          ) : null}
        </h1>
        <nav className="head-actions">
          <Link className="quiet-link" href="/connect">
            Connect an agent
          </Link>
          <ThemeToggle />
        </nav>
      </header>
      <form action={create} className="row">
        <input
          aria-label="New board name"
          className="input"
          name="name"
          placeholder="Name a new board"
        />
        <Submit label="New board" pendingLabel="Creating" />
      </form>
      {boards.length ? (
        <ul className="list">
          {boards.map((b) => (
            <BoardRow
              board={{ ...b, updatedAt: b.updatedAt ?? b.createdAt }}
              key={b.id}
              remove={remove}
              rename={rename}
            />
          ))}
        </ul>
      ) : (
        <p className="empty">
          No boards yet. Name one above, or ask a connected agent to draw
          something.
        </p>
      )}
    </main>
  );
}
