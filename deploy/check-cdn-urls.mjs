// Fails the deploy if any built page points at media outside the stage CDN: CMS uploads served by
// the API (/api/media/file/...), hashed media or docs on another host, or brand files on /assets/.
// Usage: NEXT_PUBLIC_CDN_URL=https://cdn-uat.ullindia.com node deploy/check-cdn-urls.mjs web/out
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const outDir = path.resolve(process.argv[2] || 'web/out')
const cdn = (process.env.NEXT_PUBLIC_CDN_URL || process.env.CDN_URL || '').replace(/\/$/, '')

if (!cdn) {
  console.log('[cdn-check] NEXT_PUBLIC_CDN_URL not set; skipping')
  process.exit(0)
}

// Any media reference, with or without a host in front of it.
const media = /(?:https?:\/\/[^\s"'<>(),\\]+?)?\/(?:api\/media\/file\/|(?:media|docs)\/[0-9a-f]{8}\/|assets\/)[^\s"'<>(),\\]*/g

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* htmlFiles(full)
    else if (entry.name.endsWith('.html')) yield full
  }
}

let pages = 0
const bad = new Map()
for await (const file of htmlFiles(outDir)) {
  pages++
  const html = await readFile(file, 'utf8')
  for (const [url] of html.matchAll(media)) {
    if (url.startsWith(`${cdn}/`)) continue
    const rel = path.relative(outDir, file)
    bad.set(rel, new Set([...(bad.get(rel) ?? []), url]))
  }
}

if (bad.size) {
  console.error(`[cdn-check] ${bad.size} of ${pages} page(s) reference media outside ${cdn}:`)
  for (const [file, urls] of bad) for (const url of urls) console.error(`  ${file}: ${url}`)
  process.exit(1)
}
console.log(`[cdn-check] ${pages} page(s): every media reference is on ${cdn}`)
