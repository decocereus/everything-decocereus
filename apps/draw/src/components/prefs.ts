import type { AppState } from "@excalidraw/excalidraw/types";

// Excalidraw's own site keeps these in localStorage. The board document only
// stores elements and background, so without this every reload resets them.

/** How you like to draw, shared by every board. */
const DRAWING_KEYS = [
  "currentItemArrowType",
  "currentItemBackgroundColor",
  "currentItemEndArrowhead",
  "currentItemFillStyle",
  "currentItemFontFamily",
  "currentItemFontSize",
  "currentItemOpacity",
  "currentItemRoughness",
  "currentItemRoundness",
  "currentItemStartArrowhead",
  "currentItemStrokeColor",
  "currentItemStrokeStyle",
  "currentItemStrokeWidth",
  "currentItemTextAlign",
  "gridModeEnabled",
  "objectsSnapModeEnabled",
] as const satisfies readonly (keyof AppState)[];

/** Where you were looking, per board. */
const VIEW_KEYS = [
  "scrollX",
  "scrollY",
  "zoom",
] as const satisfies readonly (keyof AppState)[];

const DRAWING_STORE = "draw:drawing";
const viewStore = (boardId: string) => `draw:view:${boardId}`;

function read(key: string): Partial<AppState> {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "{}");
  } catch {
    return {};
  }
}

function store(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage full or blocked (private mode); preferences just won't stick.
  }
}

const pick = (state: Partial<AppState>, keys: readonly (keyof AppState)[]) =>
  JSON.stringify(Object.fromEntries(keys.map((k) => [k, state[k]])));

/** What this tab last read or wrote, so it doesn't clobber another tab's newer choice. */
let lastDrawing = "";

export function loadDrawingPrefs() {
  const prefs = read(DRAWING_STORE);
  lastDrawing = pick(prefs, DRAWING_KEYS);
  return prefs;
}

/** The saved viewport for this board, or null to fit the content instead. */
export function loadView(boardId: string): Partial<AppState> | null {
  const view = read(viewStore(boardId));
  return typeof view.scrollX === "number" ? view : null;
}

export function savePrefs(boardId: string, state: AppState) {
  const drawing = pick(state, DRAWING_KEYS);
  if (drawing !== lastDrawing) {
    lastDrawing = drawing;
    store(DRAWING_STORE, drawing);
  }
  store(viewStore(boardId), pick(state, VIEW_KEYS));
}
