// Upload web/public/assets to the stage media bucket as assets/{hash}/{filename}
// and write the map the site build reads.
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const assetsDir = path.join(root, 'web/public/assets')
const manifestPath = path.join(root, 'web/src/content/cdn-assets.json')
const bucket = process.env.CDN_BUCKET
const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'ap-south-1'

if (!bucket) {
  console.log('[assets] CDN_BUCKET not set; the site will use /assets/')
  process.exit(0)
}

const image = /\.(avif|gif|jpe?g|png|svg|webp)$/i
const names = (await readdir(assetsDir)).filter((name) => image.test(name)).sort()
const manifest = {}
for (const name of names) {
  const file = path.join(assetsDir, name)
  const bytes = await readFile(file)
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 8)
  manifest[name] = `${hash}/${name}`
  const result = spawnSync(
    'aws',
    [
      's3', 'cp', file, `s3://${bucket}/assets/${hash}/${name}`,
      '--region', region,
      '--cache-control', 'public,max-age=31536000,immutable',
      '--only-show-errors',
    ],
    { stdio: 'inherit' },
  )
  if (result.status !== 0) process.exit(result.status ?? 1)
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(`[assets] published ${names.length} file(s) to s3://${bucket}`)
