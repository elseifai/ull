// Lists the image files in public/ so <Img> can show brand artwork for photos that are not added yet.
// Runs before dev and build; the list works on the server and in the browser (visual editor).
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../public/", import.meta.url));
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [`/${relative(root, p)}`];
  });
const files = walk(root).filter((f) => /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(f)).sort();
writeFileSync(new URL("../src/content/public-files.json", import.meta.url), JSON.stringify(files, null, 2) + "\n");
