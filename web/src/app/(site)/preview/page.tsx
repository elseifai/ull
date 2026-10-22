"use client";
import dynamic from "next/dynamic";

// Shown inside the CMS's Live Preview pane; updates as staff type in the page form.
const LivePreview = dynamic(() => import("@/editor/LivePreview").then((m) => m.LivePreview), { ssr: false });

export default function PreviewPage() {
  return <LivePreview />;
}
