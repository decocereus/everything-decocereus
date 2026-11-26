"use client";
import dynamic from "next/dynamic";
import { OpeningBoard } from "./opening-board.tsx";

// Excalidraw touches `window` on import, so the editor only ever loads in the browser.
const Editor = dynamic(() => import("./editor.tsx"), {
  loading: OpeningBoard,
  ssr: false,
});
export default Editor;
