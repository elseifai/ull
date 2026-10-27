import type { Accent } from "@/content/types";
import { alts } from "@/content/assets";
import publicFiles from "@/content/public-files.json";
import { mediaVariant } from "@/content/media";
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
export function Img({ src, alt, accent = "navy", className = "", priority, sizes = "100vw" }: Props) {
  if (!hasImage(src)) return <BrandArt accent={accent} className={className} />;
  const v = mediaVariant(src);
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? v?.alt ?? alts[src] ?? ""}
      width={v?.width}
      height={v?.height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  );
  if (!v?.avif && !v?.webp) return img;
  return (
    <picture>
      {v.avif && <source type="image/avif" srcSet={v.avif} sizes={sizes} />}
      {v.webp && <source type="image/webp" srcSet={v.webp} sizes={sizes} />}
      {img}
    </picture>
  );
}
