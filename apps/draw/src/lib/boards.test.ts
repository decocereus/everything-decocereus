import { beforeEach, describe, expect, it } from "vitest";
import { MemoryStore, setStoreForTests } from "./store";
import { addSkeletons, createBoard, getBoard, listBoards, removeElements, saveElements, updateBoardElements } from "./boards";
import { layoutGraph } from "./layout";
import { summarize, type El } from "./elements";

beforeEach(() => setStoreForTests(new MemoryStore()));

const live = (els: El[]) => els.filter((e) => !e.isDeleted);

describe("boards", () => {
  it("creates and lists boards", async () => {
    const a = await createBoard("First");
    await createBoard("Second");
    const list = await listBoards();
    expect(list.map((b) => b.name).sort()).toEqual(["First", "Second"]);
    expect((await getBoard(a.id)).doc.elements).toEqual([]);
  });

  it("binds arrows and labels when adding skeletons", async () => {
    const b = await createBoard("x");
    const { doc, result } = await addSkeletons(b.id, [
      { id: "api", type: "rectangle", x: 0, y: 0, label: "API" },
      { id: "db", type: "ellipse", x: 400, y: 0, label: "Postgres", color: "blue" },
      { type: "arrow", start: "api", end: "db", label: "SQL" },
    ]);
    const api = doc.elements.find((e) => e.id === "api")!;
    const db = doc.elements.find((e) => e.id === "db")!;
    const arrow = doc.elements.find((e) => e.type === "arrow")!;
    expect(arrow.startBinding.elementId).toBe("api");
    expect(arrow.endBinding.elementId).toBe("db");
    expect(api.boundElements!.map((x) => x.type).sort()).toEqual(["arrow", "text"]);
    expect(db.backgroundColor).toBe("#a5d8ff");
    // The arrow starts at the right edge of the API box, not its center.
    expect(arrow.x).toBeGreaterThanOrEqual(api.x + api.width);
    expect(arrow.x + arrow.points[1][0]).toBeLessThanOrEqual(db.x);
    expect(result.created).toHaveLength(6);
    expect(new Set(doc.elements.map((e) => e.index)).size).toBe(doc.elements.length);

    const lines = summarize(doc.elements);
    expect(lines.some((l) => l.includes('arrow#') && l.includes('"SQL"') && l.includes('rectangle#api "API"') && l.includes('ellipse#db "Postgres"'))).toBe(true);
  });

  it("binds new arrows to shapes already on the board", async () => {
    const b = await createBoard("x");
    await addSkeletons(b.id, [{ id: "a", type: "rectangle", x: 0, y: 0 }]);
    await addSkeletons(b.id, [{ id: "b", type: "rectangle", x: 300, y: 200 }, { type: "arrow", start: "a", end: "b" }]);
    const { doc } = await getBoard(b.id);
    const a = doc.elements.find((e) => e.id === "a")!;
    expect(a.version).toBe(2);
    expect(a.boundElements).toHaveLength(1);
  });

  it("moves labels and reroutes arrows when a shape moves", async () => {
    const b = await createBoard("x");
    await addSkeletons(b.id, [
      { id: "a", type: "rectangle", x: 0, y: 0, label: "A" },
      { id: "b", type: "rectangle", x: 400, y: 0, label: "B" },
      { type: "arrow", start: "a", end: "b" },
    ]);
    const before = (await getBoard(b.id)).doc;
    const arrowBefore = before.elements.find((e) => e.type === "arrow")!;
    await updateBoardElements(b.id, [{ id: "b", y: 300, label: "Bee", color: "green" }]);
    const { doc } = await getBoard(b.id);
    const bEl = doc.elements.find((e) => e.id === "b")!;
    const label = doc.elements.find((e) => e.containerId === "b")!;
    const arrow = doc.elements.find((e) => e.type === "arrow")!;
    expect(label.text).toBe("Bee");
    expect(label.y).toBeGreaterThan(300);
    expect(bEl.backgroundColor).toBe("#b2f2bb");
    expect(arrow.version).toBeGreaterThan(arrowBefore.version);
    expect(arrow.y + arrow.points[1][1]).toBeGreaterThan(250);
  });

  it("deletes shapes with their labels and unbinds arrows", async () => {
    const b = await createBoard("x");
    await addSkeletons(b.id, [
      { id: "a", type: "rectangle", x: 0, y: 0, label: "A" },
      { id: "b", type: "rectangle", x: 400, y: 0 },
      { type: "arrow", start: "a", end: "b" },
    ]);
    await removeElements(b.id, ["a"]);
    const { doc } = await getBoard(b.id);
    expect(live(doc.elements).map((e) => e.type).sort()).toEqual(["arrow", "rectangle"]);
    expect(doc.elements.find((e) => e.type === "arrow")!.startBinding).toBeNull();
    await removeElements(b.id, "all");
    expect(live((await getBoard(b.id)).doc.elements)).toHaveLength(0);
  });

  it("merges browser edits by version and keeps tombstones", async () => {
    const b = await createBoard("x");
    const { doc } = await addSkeletons(b.id, [{ id: "a", type: "rectangle", x: 0, y: 0 }]);
    const stale = { ...doc.elements[0], x: 999 };
    await saveElements(b.id, [stale]);
    expect((await getBoard(b.id)).doc.elements[0].x).toBe(0);
    await saveElements(b.id, [{ ...doc.elements[0], x: 50, version: 5, isDeleted: true }]);
    const after = (await getBoard(b.id)).doc.elements[0];
    expect(after.x).toBe(50);
    expect(after.isDeleted).toBe(true);
  });

  it("lays out graphs without overlapping nodes", () => {
    const skels = layoutGraph(
      [{ id: "a", label: "Client" }, { id: "b", label: "Server" }, { id: "c", label: "Cache", shape: "ellipse" }, { id: "d", label: "DB" }],
      [{ from: "a", to: "b" }, { from: "b", to: "c" }, { from: "b", to: "d", label: "reads" }],
      "LR",
      { x: 100, y: 100 },
    );
    const nodes = skels.filter((s) => s.type !== "arrow");
    for (const p of nodes) for (const q of nodes) {
      if (p === q) continue;
      const overlap = p.x! < q.x! + q.width! && q.x! < p.x! + p.width! && p.y! < q.y! + q.height! && q.y! < p.y! + p.height!;
      expect(overlap).toBe(false);
    }
    expect(skels.filter((s) => s.type === "arrow")).toHaveLength(3);
  });
});
