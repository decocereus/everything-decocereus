import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createBoard, deleteBoard, listBoards } from "@/lib/boards";

export const dynamic = "force-dynamic";

async function create(formData: FormData) {
  "use server";
  const doc = await createBoard(String(formData.get("name") ?? "").trim() || "Untitled");
  redirect(`/b/${doc.id}`);
}

async function remove(formData: FormData) {
  "use server";
  await deleteBoard(String(formData.get("id")));
  revalidatePath("/");
}

const fmt = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

export default async function Home() {
  const boards = await listBoards();
  return (
    <main className="page">
      <h1>Boards</h1>
      <form action={create} className="row">
        <input className="input" name="name" placeholder="New board name" aria-label="New board name" />
        <button className="btn" type="submit">New board</button>
      </form>
      {boards.length ? (
        <ul className="list">
          {boards.map((b) => (
            <li key={b.id}>
              <Link className="name" href={`/b/${b.id}`}>{b.name}</Link>
              <span className="meta">{fmt.format(new Date(b.updatedAt ?? b.createdAt))}</span>
              <form action={remove}>
                <input type="hidden" name="id" value={b.id} />
                <button className="btn ghost danger" type="submit" aria-label={`Delete ${b.name}`}>Delete</button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">No boards yet. Create one above, or ask an agent to.</p>
      )}
    </main>
  );
}
