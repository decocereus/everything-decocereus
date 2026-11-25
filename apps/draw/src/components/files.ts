import type { BinaryFileData, BinaryFiles, ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

const blobToDataURL = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

/** Fetch image files the scene references but the editor doesn't have yet. */
export async function loadMissingFiles(api: Pick<ExcalidrawImperativeAPI, "getFiles" | "addFiles">, elements: readonly any[], query = "") {
  const have = api.getFiles();
  const missing = new Set<string>();
  for (const el of elements) if (el.type === "image" && !el.isDeleted && el.fileId && !have[el.fileId]) missing.add(el.fileId);
  const loaded: BinaryFileData[] = [];
  await Promise.all(
    [...missing].map(async (id) => {
      const res = await fetch(`/api/files/${id}${query}`);
      if (!res.ok) return;
      const blob = await res.blob();
      loaded.push({ id, mimeType: blob.type as BinaryFileData["mimeType"], dataURL: (await blobToDataURL(blob)) as BinaryFileData["dataURL"], created: Date.now() } as BinaryFileData);
    }),
  );
  if (loaded.length) api.addFiles(loaded);
  return loaded.length;
}

/** Upload image files that live elements use and that haven't been uploaded yet. */
export async function uploadNewFiles(files: BinaryFiles, elements: readonly any[], uploaded: Set<string>) {
  const used = new Set(elements.filter((e) => e.type === "image" && !e.isDeleted && e.fileId).map((e) => e.fileId));
  for (const id of used) {
    if (uploaded.has(id) || !files[id]) continue;
    const blob = await (await fetch(files[id].dataURL)).blob();
    const res = await fetch(`/api/files/${id}`, { method: "PUT", headers: { "content-type": files[id].mimeType }, body: blob });
    if (res.ok) uploaded.add(id);
  }
}
