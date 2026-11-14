// One-time backfill for plan 13: re-uploads every media file that is not yet on the CDN (no prefix)
// or is missing an image size, through the CMS API, so the server runs the full pipeline (content-hash
// prefix, WebP/AVIF/og sizes, EXIF stripped, upload to S3). Old objects stay, so old URLs keep working.
// Pages point at media by id, so rebuild the site afterwards (workflow_dispatch with site_only).
//
//   CMS_URL=https://uat.ullindia.com ADMIN_EMAIL=... ADMIN_PASSWORD=... node deploy/backfill-media.mjs
//   ... node deploy/backfill-media.mjs --apply
//
// Without --apply it only lists what it would change. Files uploaded before S3 (no prefix) are read
// from MEDIA_DIR, a copy of the old cms/media folder; the rest are downloaded from their CDN URL.
// --skip-head skips the final one-byte read from the CDN (for a test bucket with no CDN in front).
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const apply = process.argv.includes('--apply')
const skipHead = process.argv.includes('--skip-head')
const mediaDir = process.env.MEDIA_DIR
const base = (process.env.CMS_URL || 'http://localhost:3000').replace(/\/$/, '')
const { ADMIN_EMAIL: email, ADMIN_PASSWORD: password } = process.env
if (!email || !password) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD (a Group admin account on that CMS).')
  process.exit(1)
}

// Keep in step with cms/src/collections/Media.ts.
const SIZES = ['thumb', 'thumbAvif', 'card', 'cardAvif', 'hero', 'heroAvif']
const OG = { width: 1200, height: 630 }
const RESIZABLE = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/tiff', 'image/avif'])

const abs = (url) => (/^https?:/.test(url) ? url : `${base}${url}`)

function missing(doc) {
  const why = []
  if (!doc.prefix) why.push('not on CDN')
  if (RESIZABLE.has(doc.mimeType)) {
    const absent = SIZES.filter((s) => !doc.sizes?.[s]?.url)
    // Payload skips the og crop for photos smaller than 1200×630.
    if (!doc.sizes?.og?.url && doc.width >= OG.width && doc.height >= OG.height) absent.push('og')
    if (absent.length) why.push(`sizes: ${absent.join(', ')}`)
  }
  return why
}

async function original(doc) {
  if (!doc.prefix) {
    if (!mediaDir) throw new Error('no prefix, so the file is on the old server disk: set MEDIA_DIR')
    return readFile(path.join(mediaDir, doc.filename))
  }
  const res = await fetch(abs(doc.url))
  if (!res.ok) throw new Error(`download ${doc.url}: ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

async function reupload(doc, bytes, filename) {
  const form = new FormData()
  form.append('file', new Blob([bytes], { type: doc.mimeType }), filename)
  form.append('_payload', JSON.stringify({ alt: doc.alt }))
  const res = await fetch(`${base}/api/media/${doc.id}`, { method: 'PATCH', headers: auth, body: form })
  return { res, body: await res.json().catch(() => ({})) }
}

const login = await fetch(`${base}/api/users/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})
const token = (await login.json().catch(() => ({}))).token
if (!token) {
  console.error(`Could not sign in to ${base} (${login.status}).`)
  process.exit(1)
}
const auth = { Authorization: `JWT ${token}` }

const docs = []
for (let page = 1; ; page++) {
  const res = await fetch(`${base}/api/media?limit=100&page=${page}&depth=0&sort=id`, { headers: auth })
  if (!res.ok) throw new Error(`list media: ${res.status}`)
  const body = await res.json()
  docs.push(...body.docs)
  if (!body.hasNextPage) break
}

const todo = docs.map((doc) => ({ doc, why: missing(doc) })).filter((t) => t.why.length)
console.log(`${docs.length} media file(s) on ${base}; ${todo.length} need backfill${apply ? '' : ' (dry run, pass --apply to change them)'}`)
for (const { doc, why } of todo) console.log(`  #${doc.id} ${doc.filename}: ${why.join('; ')}`)
if (!apply || !todo.length) process.exit(0)

let failed = 0
for (const { doc } of todo) {
  try {
    const bytes = await original(doc)
    let { res, body } = await reupload(doc, bytes, doc.filename)
    // Payload picks a free name within the file's old folder, but filenames are unique across all
    // folders, so a renamed copy can clash with another photo. Retry once with the id in the name.
    if (res.status === 400 && /filename/.test(body.errors?.[0]?.message ?? '')) {
      ;({ res, body } = await reupload(doc, bytes, doc.filename.replace(/(\.[^.]+)?$/, `-${doc.id}$1`)))
    }
    if (!res.ok) throw new Error(`upload: ${res.status} ${body.errors?.[0]?.message ?? ''}`)
    const left = missing(body.doc)
    if (left.length) throw new Error(`still ${left.join('; ')}`)
    if (!skipHead) {
      const check = await fetch(abs(body.doc.url), { headers: { Range: 'bytes=0-0' } })
      if (!check.ok) throw new Error(`GET ${body.doc.url}: ${check.status}`)
    }
    console.log(`  ok #${doc.id} → ${body.doc.url}`)
  } catch (err) {
    failed++
    console.error(`  FAILED #${doc.id} ${doc.filename}: ${err.message}`)
  }
}
console.log(`${todo.length - failed} backfilled, ${failed} failed. Rebuild the site so pages use the new URLs.`)
process.exit(failed ? 1 : 0)
