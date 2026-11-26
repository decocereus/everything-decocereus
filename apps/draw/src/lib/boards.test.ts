import { beforeEach, describe, expect, it } from "vitest";
import {
  addSkeletons,
  createBoard,
  getBoard,
  listBoards,
  removeElements,
  saveElements,
  updateBoardElements,
} from "./boards.ts";
import { type El, type Skeleton, summarize } from "./elements.ts";
import { layoutGraph } from "./layout.ts";
import { MemoryStore, setStoreForTests } from "./store.ts";

beforeEach(() => setStoreForTests(new MemoryStore()));

const live = (els: El[]) => els.filter((e) => !e.isDeleted);

function find(els: El[], pred: (e: El) => boolean): El {
  const el = els.find(pred);
  if (!el) {
    throw new Error("element not found");
  }
  return el;
}

function box({ x, y, width, height }: Skeleton) {
  if (
    x === undefined ||
    y === undefined ||
    width === undefined ||
    height === undefined
  ) {
    throw new Error("node was not laid out");
  }
  return { height, width, x, y };
}

describe("boards", () => {
  it("creates and lists boards", async () => {
    const a = await createBoard("First");
    await createBoard("Second");
    const list = await listBoards();
    expect(list.map((b) => b.name).sort((x, y) => x.localeCompare(y))).toEqual([
      "First",
      "Second",
    ]);
    expect((await getBoard(a.id)).doc.elements).toEqual([]);
  });

  it("binds arrows and labels when adding skeletons", async () => {
    const b = await createBoard("x");
    const { doc, result } = await addSkeletons(b.id, [
      { id: "api", label: "API", type: "rectangle", x: 0, y: 0 },
      {
        color: "blue",
        id: "db",
        label: "Postgres",
        type: "ellipse",
        x: 400,
        y: 0,
      },
      { end: "db", label: "SQL", start: "api", type: "arrow" },
    ]);
    const api = find(doc.elements, (e) => e.id === "api");
    const db = find(doc.elements, (e) => e.id === "db");
    const arrow = find(doc.elements, (e) => e.type === "arrow");
    expect(arrow.startBinding.elementId).toBe("api");
    expect(arrow.endBinding.elementId).toBe("db");
    expect(api.boundElements?.map((x) => x.type).sort()).toEqual([
      "arrow",
      "text",
    ]);
    expect(db.backgroundColor).toBe("#a5d8ff");
    // The arrow starts at the right edge of the API box, not its center.
    expect(arrow.x).toBeGreaterThanOrEqual(api.x + api.width);
    expect(arrow.x + arrow.points[1][0]).toBeLessThanOrEqual(db.x);
    expect(result.created).toHaveLength(6);
    expect(new Set(doc.elements.map((e) => e.index)).size).toBe(
      doc.elements.length
    );

    const lines = summarize(doc.elements);
    expect(
      lines.some(
        (l) =>
          l.includes("arrow#") &&
          l.includes('"SQL"') &&
          l.includes('rectangle#api "API"') &&
          l.includes('ellipse#db "Postgres"')
      )
    ).toBe(true);
  });

  it("binds new arrows to shapes already on the board", async () => {
    const b = await createBoard("x");
    await addSkeletons(b.id, [{ id: "a", type: "rectangle", x: 0, y: 0 }]);
    await addSkeletons(b.id, [
      { id: "b", type: "rectangle", x: 300, y: 200 },
      { end: "b", start: "a", type: "arrow" },
    ]);
    const { doc } = await getBoard(b.id);
    const a = find(doc.elements, (e) => e.id === "a");
    expect(a.version).toBe(2);
    expect(a.boundElements).toHaveLength(1);
  });

  it("moves labels and reroutes arrows when a shape moves", async () => {
    const b = await createBoard("x");
    await addSkeletons(b.id, [
      { id: "a", label: "A", type: "rectangle", x: 0, y: 0 },
      { id: "b", label: "B", type: "rectangle", x: 400, y: 0 },
      { end: "b", start: "a", type: "arrow" },
    ]);
    const before = (await getBoard(b.id)).doc;
    const arrowBefore = find(before.elements, (e) => e.type === "arrow");
    await updateBoardElements(b.id, [
      { color: "green", id: "b", label: "Bee", y: 300 },
    ]);
    const { doc } = await getBoard(b.id);
    const bEl = find(doc.elements, (e) => e.id === "b");
    const label = find(doc.elements, (e) => e.containerId === "b");
    const arrow = find(doc.elements, (e) => e.type === "arrow");
    expect(label.text).toBe("Bee");
    expect(label.y).toBeGreaterThan(300);
    expect(bEl.backgroundColor).toBe("#b2f2bb");
    expect(arrow.version).toBeGreaterThan(arrowBefore.version);
    expect(arrow.y + arrow.points[1][1]).toBeGreaterThan(250);
  });

  it("deletes shapes with their labels and unbinds arrows", async () => {
    const b = await createBoard("x");
    await addSkeletons(b.id, [
      { id: "a", label: "A", type: "rectangle", x: 0, y: 0 },
      { id: "b", type: "rectangle", x: 400, y: 0 },
      { end: "b", start: "a", type: "arrow" },
    ]);
    await removeElements(b.id, ["a"]);
    const { doc } = await getBoard(b.id);
    expect(
      live(doc.elements)
        .map((e) => e.type)
        .sort((x, y) => x.localeCompare(y))
    ).toEqual(["arrow", "rectangle"]);
    expect(
      doc.elements.find((e) => e.type === "arrow")?.startBinding
    ).toBeNull();
    await removeElements(b.id, "all");
    expect(live((await getBoard(b.id)).doc.elements)).toHaveLength(0);
  });

  it("merges browser edits by version and keeps tombstones", async () => {
    const b = await createBoard("x");
    const { doc } = await addSkeletons(b.id, [
      { id: "a", type: "rectangle", x: 0, y: 0 },
    ]);
    const stale = { ...doc.elements[0], x: 999 };
    await saveElements(b.id, [stale]);
    expect((await getBoard(b.id)).doc.elements[0].x).toBe(0);
    await saveElements(b.id, [
      { ...doc.elements[0], isDeleted: true, version: 5, x: 50 },
    ]);
    const [after] = (await getBoard(b.id)).doc.elements;
    expect(after.x).toBe(50);
    expect(after.isDeleted).toBe(true);
  });

  it("lays out graphs without overlapping nodes", () => {
    const skels = layoutGraph(
      [
        { id: "a", label: "Client" },
        { id: "b", label: "Server" },
        { id: "c", label: "Cache", shape: "ellipse" },
        { id: "d", label: "DB" },
      ],
      [
        { from: "a", to: "b" },
        { from: "b", to: "c" },
        { from: "b", label: "reads", to: "d" },
      ],
      "LR",
      { x: 100, y: 100 }
    );
    const nodes = skels.filter((s) => s.type !== "arrow").map(box);
    for (const p of nodes) {
      for (const q of nodes) {
        if (p === q) {
          continue;
        }
        const overlap =
          p.x < q.x + q.width &&
          q.x < p.x + p.width &&
          p.y < q.y + q.height &&
          q.y < p.y + p.height;
        expect(overlap).toBe(false);
      }
    }
    expect(skels.filter((s) => s.type === "arrow")).toHaveLength(3);
  });
});
