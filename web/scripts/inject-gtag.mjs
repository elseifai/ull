// Next places its own tags at the start of <head> and rewrites next/script. Google asked for this
// snippet immediately after <head> on every page, so the export is patched after the build.
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const outDir = path.resolve(fileURLToPath(new URL("..", import.meta.url)), process.argv[2] || "out");
const snippet =
  '<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-5LD9P9KD"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag(\'js\', new Date());</script>';

function strip(html) {
  return html
    .replace(/<link rel="preload" href="https:\/\/www\.googletagmanager\.com\/gtm\.js\?id=GTM-5LD9P9KD"[^>]*>/g, "")
    .replace(/<script[^>]*src="https:\/\/www\.googletagmanager\.com\/gtm\.js\?id=GTM-5LD9P9KD"[^>]*>\s*<\/script>/g, "")
    .replace(/<script[^>]*>[^<]*GTM-5LD9P9KD[^<]*<\/script>/g, "")
    .replace(/<script[^>]*>[^<]*function gtag\(\)\{dataLayer\.push\(arguments\);\}[^<]*<\/script>/g, "");
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
  const next = strip(html).replace(/<head([^>]*)>/, `<head$1>${snippet}`);
  if (next === html) continue;
  await writeFile(file, next);
  changed += 1;
}
console.log(`[gtag] pasted after <head> on ${changed} page(s)`);
