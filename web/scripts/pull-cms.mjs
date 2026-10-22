// Pulls published pages and site settings from the CMS into src/content/cms.json before a build.
// Without CMS_URL the site builds from the content files in src/content.
import { writeFileSync } from "node:fs";
import { clean, toWebPage } from "../src/lib/cms-shape.mjs";

const out = new URL("../src/content/cms.json", import.meta.url);
const base = process.env.CMS_URL?.replace(/\/$/, "");

if (!base) {
  writeFileSync(out, JSON.stringify({ pages: null, settings: null }, null, 2) + "\n");
  console.log("[cms] CMS_URL not set: building from local content files");
  process.exit(0);
}

const get = async (path) => {
  const res = await fetch(`${base}/api/${path}`);
  if (!res.ok) throw new Error(`[cms] ${path}: ${res.status}`);
  return res.json();
};

const { docs } = await get("pages?limit=200&depth=1&where[_status][equals]=published");
const pages = docs.map((d) => toWebPage(d, base));
const settings = clean(await get("globals/site-settings"), base);

writeFileSync(out, JSON.stringify({ pages, settings }, null, 2) + "\n");
console.log(`[cms] pulled ${pages.length} pages from ${base}`);
