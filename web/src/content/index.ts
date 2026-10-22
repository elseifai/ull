import { aboutPages } from "./pages-about";
import { academicsPages } from "./pages-academics";
import { lifePages } from "./pages-life";
import { morePages } from "./pages-more";
import cms from "./cms.json";
import type { Page } from "./types";

const local: Page[] = [...aboutPages, ...academicsPages, ...lifePages, ...morePages];

// Pages published in the CMS win; local files fill in anything not yet in the CMS.
const fromCms = (cms.pages ?? []) as unknown as Page[];
export const pages: Page[] = [...fromCms, ...local.filter((p) => !fromCms.some((c) => c.slug === p.slug))];

export function getPage(slug: string): Page | undefined {
  return pages.find((p) => p.slug === slug);
}
