"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { rememberUtm } from "@/lib/utm";

// Remember a campaign link as the visitor moves between pages in this tab.
export function CaptureUtm() {
  const search = useSearchParams();
  useEffect(() => {
    const query = search.toString();
    rememberUtm(query ? `?${query}` : "");
  }, [search]);
  return null;
}
