import type { MetadataRoute } from "next";
import { pages } from "@/content";
import { pageUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: pageUrl(""), lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...pages
      .filter((p) => p.slug !== "portal")
      .map((p) => ({
        url: pageUrl(p.slug),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: p.slug.startsWith("admissions") ? 0.9 : p.slug.includes("/") ? 0.6 : 0.8,
      })),
  ];
}
