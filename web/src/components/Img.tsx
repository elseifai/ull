import type { Accent } from "@/content/types";
import { alts } from "@/content/assets";
import publicFiles from "@/content/public-files.json";
import { BrandArt } from "./BrandArt";

// Pages show brand artwork until the photo file is added (the list is made by scripts/list-public.mjs).
const local = new Set<string>(publicFiles);
export function hasImage(src?: string): src is string {
  if (!src) return false;
  if (/^https?:\/\//.test(src)) return true;
  return local.has(src);
}

type Props = { src?: string; alt?: string; accent?: Accent; className?: string; priority?: boolean; sizes?: string };

// Fills its (relatively positioned) parent.
export function Img({ src, alt, accent = "navy", className = "", priority }: Props) {
  if (!hasImage(src)) return <BrandArt accent={accent} className={className} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? alts[src] ?? ""}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  );
}
