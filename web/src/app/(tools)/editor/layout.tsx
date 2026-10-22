import type { Metadata } from "next";
import "@puckeditor/core/puck.css";
import "@/editor/editor.css";

export const metadata: Metadata = { title: "Page builder", robots: { index: false, follow: false } };

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
