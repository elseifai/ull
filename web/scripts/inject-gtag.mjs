// Next places its own tags at the start of <head> and rewrites next/script. Google asked for this
// snippet immediately after <head> on every page, so the export is patched after the build.
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const outDir = path.resolve(fileURLToPath(new URL("..", import.meta.url)), process.argv[2] || "out");
const snippet =
  '<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-5LD9P9KD"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag(\'js\', new Date());</script>';

// Only remove the tag's own script/link nodes. The page bootstrap is one big <script> that
// mentions this same snippet inside the React payload. Deleting that script leaves the form as
// plain HTML, so submit reloads the page and never calls the API.
function strip(html) {
  return html
    .replace(/<link rel="preload" href="https:\/\/www\.googletagmanager\.com\/gtm\.js\?id=GTM-5LD9P9KD"[^>]*>/g, "")
    .replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/g, (full, attrs, body) => {
      if (body.includes("__next_f") || body.includes("TURBOPACK")) return full;
      if (/src="https:\/\/www\.googletagmanager\.com\/gtm\.js\?id=GTM-5LD9P9KD"/.test(attrs)) return "";
      if (body.includes("function gtag()") && body.includes("dataLayer") && body.length < 400) return "";
      return full;
    });
}

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

const files = await htmlFiles(outDir);
let changed = 0;
for (const file of files) {
  const html = await readFile(file, "utf8");
  const hadFlight = html.includes("__next_f");
  const next = strip(html).replace(/<head([^>]*)>/, `<head$1>${snippet}`);
  if (hadFlight && !next.includes("__next_f")) {
    throw new Error(`[gtag] refused to remove the page bootstrap from ${file}`);
  }
  if (next === html) continue;
  await writeFile(file, next);
  changed += 1;
}
console.log(`[gtag] pasted after <head> on ${changed} page(s)`);
