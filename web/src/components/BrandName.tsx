"use client";

import { usePathname } from "next/navigation";
import { brandOf, group } from "@/content/brands";

/** The name of the brand the current page belongs to, or ULL India on group pages. */
export function BrandName() {
  return <>{brandOf(usePathname())?.name ?? group.name}</>;
}
