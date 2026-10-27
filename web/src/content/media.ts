// AVIF/WebP sizes and share images of CMS photos, keyed by the photo's URL (written by scripts/pull-cms.mjs).
import cms from "./cms.json";
import type { MediaVariant } from "@/lib/cms-shape.mjs";

const variants = ((cms as { media?: Record<string, MediaVariant> }).media ?? {}) as Record<string, MediaVariant>;

export const mediaVariant = (src?: string): MediaVariant | undefined => (src ? variants[src] : undefined);
