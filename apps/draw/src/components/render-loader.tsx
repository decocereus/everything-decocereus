"use client";
import dynamic from "next/dynamic";

const Render = dynamic(() => import("./render.tsx"), { ssr: false });
export default Render;
