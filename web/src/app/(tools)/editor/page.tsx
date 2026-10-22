"use client";
import dynamic from "next/dynamic";

// The builder runs only in the browser (it reads the signed-in staff session from the CMS).
const Editor = dynamic(() => import("@/editor/Editor").then((m) => m.Editor), { ssr: false });

export default function EditorPage() {
  return <Editor />;
}
