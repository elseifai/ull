import type { MetadataRoute } from "next";
import { ownRoutes, pages } from "@/content";
import { pageUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...ownRoutes.map((slug) => ({ url: pageUrl(slug), lastModified: now, changeFrequency: "weekly" as const, priority: slug.split("/").length < 3 ? 1 : 0.9 })),
    ...pages
      .filter((p) => p.slug !== "portal" && !ownRoutes.includes(p.slug))
      .map((p) => ({
        url: pageUrl(p.slug),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: p.slug.includes("/admissions") ? 0.9 : p.slug.split("/").length > 2 ? 0.6 : 0.8,
      })),
  ];
}
