"use client";
import { exportToBlob, restoreElements } from "@excalidraw/excalidraw";
import type { BinaryFileData, BinaryFiles } from "@excalidraw/excalidraw/types";
// Headless render target for get_board_image. Puppeteer loads this page with
// a short-lived token and reads window.__renderResult.
import { useEffect } from "react";

declare global {
  interface Window {
    __renderResult?: {
      png?: string;
      width?: number;
      height?: number;
      error?: string;
    };
  }
}

const blobToBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1]);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });

async function render(boardId: string) {
  const q = new URLSearchParams(location.search);
  const rt = q.get("rt") ?? "";
  const scale = Number(q.get("scale") ?? 1);
  const max = Number(q.get("max") ?? 1600);
  const ids = q.get("ids")?.split(",").filter(Boolean);
  const dark = q.get("dark") === "1";

  const res = await fetch(
    `/api/boards/${boardId}?rt=${encodeURIComponent(rt)}`
  );
  if (!res.ok) {
    throw new Error(`Couldn't load board: ${res.status}`);
  }
  const { doc } = await res.json();

  let elements = restoreElements(doc.elements, null, {
    refreshDimensions: true,
    repairBindings: true,
  }).filter((e) => !e.isDeleted);
  if (ids?.length) {
    const want = new Set(ids);
    // Include labels of the requested shapes and arrows.
    for (const el of elements) {
      if (el.type === "text" && el.containerId && want.has(el.containerId)) {
        want.add(el.id);
      }
    }
    elements = elements.filter((e) => want.has(e.id));
  }
  if (!elements.length) {
    throw new Error(
      ids?.length
        ? "None of those element ids are on the board"
        : "The board is empty"
    );
  }

  const files: BinaryFiles = {};
  await Promise.all(
    elements
      .flatMap((e) => (e.type === "image" && e.fileId ? [e.fileId] : []))
      .map(async (fileId) => {
        const r = await fetch(
          `/api/files/${fileId}?rt=${encodeURIComponent(rt)}&board=${boardId}`
        );
        if (!r.ok) {
          return;
        }
        const blob = await r.blob();
        files[fileId] = {
          created: Date.now(),
          dataURL: `data:${blob.type};base64,${await blobToBase64(blob)}`,
          id: fileId,
          mimeType: blob.type,
        } as BinaryFileData;
      })
  );

  // Make sure the hand-drawn fonts are in before measuring and drawing text.
  await document.fonts.ready;

  let out = { height: 0, width: 0 };
  const blob = await exportToBlob({
    appState: {
      exportBackground: true,
      exportWithDarkMode: dark,
      viewBackgroundColor: dark
        ? "#121212"
        : (doc.appState?.viewBackgroundColor ?? "#ffffff"),
    },
    elements,
    exportPadding: 24,
    files,
    getDimensions: (w: number, h: number) => {
      const s = Math.min(scale, max / Math.max(w, h));
      out = { height: Math.round(h * s), width: Math.round(w * s) };
      return { ...out, scale: s };
    },
    mimeType: "image/png",
  });
  return { png: await blobToBase64(blob), ...out };
}

export default function Render({ boardId }: { boardId: string }) {
  useEffect(() => {
    render(boardId)
      .then((r) => {
        window.__renderResult = r;
      })
      .catch((e) => {
        window.__renderResult = {
          error: e instanceof Error ? e.message : String(e),
        };
      });
  }, [boardId]);
  return null;
}
