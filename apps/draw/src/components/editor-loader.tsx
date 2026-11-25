"use client";
import dynamic from "next/dynamic";

// Excalidraw touches `window` on import, so the editor only ever loads in the browser.
const Editor = dynamic(() => import("./editor.tsx"), { ssr: false });
export default Editor;
