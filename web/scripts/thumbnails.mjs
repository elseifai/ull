// Screenshots each block from /editor/blocks/ into public/blocks (page builder) and ../cms/public/blocks
// (CMS block picker). Needs the dev server running and Playwright: npm i -D playwright && npm run thumbnails
import { mkdirSync, copyFileSync } from "node:fs";
import { chromium } from "playwright";

const base = process.env.SITE_URL ?? "http://localhost:4100";
const out = new URL("../public/blocks/", import.meta.url).pathname;
const cms = new URL("../../cms/public/blocks/", import.meta.url).pathname;
mkdirSync(out, { recursive: true });
mkdirSync(cms, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 760, height: 900 }, deviceScaleFactor: 0.5 });
await page.goto(`${base}/editor/blocks/`, { waitUntil: "networkidle" });
for (const el of await page.$$("[data-block]")) {
  const name = await el.getAttribute("data-block");
  const box = await el.boundingBox();
  await page.screenshot({ path: `${out}${name}.png`, clip: { x: box.x, y: box.y, width: box.width, height: Math.min(box.height, 480) }, fullPage: true });
  copyFileSync(`${out}${name}.png`, `${cms}${name}.png`);
  console.log(`blocks/${name}.png`);
}
await browser.close();
