// Copies Excalidraw's font files into public/ so the app serves them itself
// instead of loading them from a CDN.
import { cpSync, existsSync } from "node:fs";

const src = "node_modules/@excalidraw/excalidraw/dist/prod/fonts";
if (existsSync(src)) {
  cpSync(src, "public/fonts", { recursive: true });
}
