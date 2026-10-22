// Seeds the CMS with the website content from ../web/src/content and creates the first admin.
// Run: npm run seed   (SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD set the first login)
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'
import { pages } from '../../web/src/content'
import type { Block } from '../../web/src/content/types'

const wrap = (xs?: string[]) => xs?.map((text) => ({ text }))

function toCms(b: Block): Record<string, unknown> {
  switch (b.type) {
    case 'text':
      return { ...b, blockType: 'text', body: wrap(b.body), bullets: wrap(b.bullets) }
    case 'cards':
    case 'subnav':
      return {
        ...b,
        blockType: b.type,
        ...('columns' in b && b.columns ? { columns: String(b.columns) } : {}),
        items: b.items.map((c) => ({ ...c, bullets: wrap(c.bullets) })),
      }
    case 'table':
      return { ...b, blockType: 'table', col1: b.columns[0], col2: b.columns[1], rows: b.rows.map(([label, value]) => ({ label, value })) }
    default:
      return { ...b, blockType: b.type }
  }
}

const payload = await getPayload({ config })

// Image paths like "/assets/x.png" become Media uploads when the file exists in web/public.
const publicDir = path.resolve(process.cwd(), '../web/public')
const mediaIds = new Map<string, number | string | null>()
async function mediaFor(src: string) {
  if (mediaIds.has(src)) return mediaIds.get(src)
  const file = path.join(publicDir, src)
  let id: number | string | null = null
  if (fs.existsSync(file)) {
    const found = await payload.find({ collection: 'media', where: { filename: { equals: path.basename(file) } }, limit: 1 })
    id = found.docs[0]?.id ?? (await payload.create({ collection: 'media', data: { alt: path.basename(file) }, filePath: file })).id
  }
  mediaIds.set(src, id)
  return id
}
async function withMedia(v: unknown): Promise<unknown> {
  if (Array.isArray(v)) return Promise.all(v.map(withMedia))
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, x] of Object.entries(v)) {
      if (k === 'image' && typeof x === 'string') {
        const id = await mediaFor(x)
        if (id) out[k] = id
      } else out[k] = await withMedia(x)
    }
    return out
  }
  return v
}

const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@ullindia.com'
const { totalDocs } = await payload.count({ collection: 'users', where: { email: { equals: email } } })
if (!totalDocs) {
  await payload.create({
    collection: 'users',
    data: { email, password: process.env.SEED_ADMIN_PASSWORD ?? 'change-me-now', name: 'ULL Admin', roles: ['admin'] },
  })
  payload.logger.info(`Created admin ${email}`)
}

for (const p of pages) {
  try {
  const data = (await withMedia({ ...p, blocks: p.blocks.map(toCms) })) as Record<string, unknown>
  data._status = 'published'
  const existing = await payload.find({ collection: 'pages', where: { slug: { equals: p.slug } }, limit: 1 })
  if (existing.docs[0]) await payload.update({ collection: 'pages', id: existing.docs[0].id, data: data as never })
  else await payload.create({ collection: 'pages', data: data as never })
  payload.logger.info(`Seeded /${p.slug}/`)
  } catch (e) { console.error(p.slug, JSON.stringify((e as { data?: unknown }).data ?? String(e))) }
}
process.exit(0)
