"use client";
import dynamic from "next/dynamic";

const Render = dynamic(() => import("./Render"), { ssr: false });
export default Render;
