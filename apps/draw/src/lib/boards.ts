import { getStore } from "./store";
import {
  assignIndices,
  bounds,
  buildElements,
  bump,
  deleteElements,
  mergeElements,
  patchElements,
  type El,
  type ElementPatch,
  type Skeleton,
} from "./elements";

export type BoardDoc = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  elements: El[];
  appState: { viewBackgroundColor?: string };
};

export type BoardMeta = { id: string; name: string; createdAt: string; updatedAt?: string };

const INDEX_KEY = "index.json";
export const boardKey = (id: string) => `boards/${id}.json`;
export const fileKey = (id: string) => `files/${id}`;

const dec = new TextDecoder();

export class NotFoundError extends Error {}

function newBoardId() {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  let s = "";
  for (let i = 0; i < 10; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

async function readIndex() {
  const obj = await getStore().get(INDEX_KEY);
  const boards: Record<string, BoardMeta> = obj ? JSON.parse(dec.decode(obj.body)).boards : {};
  return { boards, etag: obj?.etag };
}

/** Read-modify-write the board index with optimistic concurrency. */
async function updateIndex(fn: (boards: Record<string, BoardMeta>) => void) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const { boards, etag } = await readIndex();
    fn(boards);
    const ok = await getStore().put(INDEX_KEY, JSON.stringify({ boards }), {
      contentType: "application/json",
      ...(etag ? { ifMatch: etag } : { ifNoneMatch: true }),
    });
    if (ok !== null) return;
  }
  throw new Error("Board index is busy, try again");
}

export async function listBoards(): Promise<BoardMeta[]> {
  const [{ boards }, objects] = await Promise.all([readIndex(), getStore().list("boards/")]);
  const modified = new Map(objects.map((o) => [o.key, o.lastModified]));
  return Object.values(boards)
    .map((b) => ({ ...b, updatedAt: modified.get(boardKey(b.id)) ?? b.createdAt }))
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function createBoard(name: string): Promise<BoardDoc> {
  const now = new Date().toISOString();
  const doc: BoardDoc = { id: newBoardId(), name, createdAt: now, updatedAt: now, elements: [], appState: {} };
  await getStore().put(boardKey(doc.id), JSON.stringify(doc), { contentType: "application/json", ifNoneMatch: true });
  await updateIndex((b) => {
    b[doc.id] = { id: doc.id, name, createdAt: now };
  });
  return doc;
}

export async function getBoard(id: string): Promise<{ doc: BoardDoc; etag: string }> {
  const obj = await getStore().get(boardKey(id));
  if (!obj) throw new NotFoundError(`No board with id "${id}"`);
  return { doc: JSON.parse(dec.decode(obj.body)), etag: obj.etag };
}

/**
 * Apply a change to a board with optimistic concurrency: re-read and retry if
 * someone else (the browser or another agent) wrote in between.
 */
export async function mutateBoard<T>(id: string, fn: (doc: BoardDoc) => T): Promise<{ doc: BoardDoc; result: T; etag: string }> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const { doc, etag } = await getBoard(id);
    const result = fn(doc);
    doc.updatedAt = new Date().toISOString();
    const newEtag = await getStore().put(boardKey(id), JSON.stringify(doc), { contentType: "application/json", ifMatch: etag });
    if (newEtag !== null) return { doc, result, etag: newEtag };
    await new Promise((r) => setTimeout(r, 30 + Math.random() * 120));
  }
  throw new Error("Board is busy, try again");
}

export async function saveElements(id: string, incoming: El[], appState?: BoardDoc["appState"]) {
  return mutateBoard(id, (doc) => {
    const { elements, changed } = mergeElements(doc.elements, incoming);
    doc.elements = elements;
    if (appState) doc.appState = { ...doc.appState, ...appState };
    return changed;
  });
}

/** Put new content to the right of whatever is already on the board. */
export function nextFreeOrigin(elements: El[]) {
  const b = bounds(elements);
  return b ? { x: Math.round(b.maxX + 120), y: Math.round(b.minY) } : { x: 0, y: 0 };
}

export async function addSkeletons(id: string, skeletons: Skeleton[] | ((doc: BoardDoc) => Skeleton[])) {
  return mutateBoard(id, (doc) => {
    const skels = typeof skeletons === "function" ? skeletons(doc) : skeletons;
    const working = structuredClone(doc.elements);
    const { created, touched, idMap } = buildElements(skels, working);
    for (const el of touched) bump(el);
    assignIndices(doc.elements, created);
    doc.elements = mergeElements(doc.elements, [...touched, ...created]).elements;
    return { created, idMap };
  });
}

export async function updateBoardElements(id: string, patches: ElementPatch[]) {
  return mutateBoard(id, (doc) => {
    const { changed, created } = patchElements(doc.elements, patches);
    assignIndices(doc.elements, created);
    doc.elements = mergeElements(doc.elements, [...changed, ...created]).elements;
    return changed.length + created.length;
  });
}

export async function removeElements(id: string, ids: string[] | "all") {
  return mutateBoard(id, (doc) => {
    const targets = ids === "all" ? doc.elements.filter((e) => !e.isDeleted && !e.containerId).map((e) => e.id) : ids;
    const changed = deleteElements(doc.elements, targets);
    doc.elements = mergeElements(doc.elements, changed).elements;
    return changed.length;
  });
}

export async function renameBoard(id: string, name: string) {
  await mutateBoard(id, (doc) => {
    doc.name = name;
  });
  await updateIndex((b) => {
    if (b[id]) b[id].name = name;
  });
}

export async function deleteBoard(id: string) {
  await getBoard(id);
  await getStore().delete(boardKey(id));
  await updateIndex((b) => {
    delete b[id];
  });
}
