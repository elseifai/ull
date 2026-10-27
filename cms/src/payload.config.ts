import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { MAX_PRIVATE_UPLOAD, PrivateFiles } from './collections/PrivateFiles'
import { Pages } from './collections/Pages'
import { Enquiries } from './collections/Enquiries'
import { SiteSettings } from './globals/SiteSettings'
import { migrations } from './migrations'
import { env } from './lib/env'
import { storagePlugins } from './lib/storage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Origins allowed to call the API from a browser (the public site and local dev).
const siteUrl = (env('NEXT_PUBLIC_SITE_URL') || 'http://localhost:4100').replace(/\/$/, '')
const origins = [
  ...new Set(
    [siteUrl, env('PAYLOAD_PUBLIC_SERVER_URL'), ...(env('CORS_ORIGINS') || '').split(','), 'http://localhost:3000', 'http://localhost:4100']
      .map((origin) => origin?.trim())
      .filter((origin): origin is string => Boolean(origin)),
  ),
]

export default buildConfig({
  serverURL: env('PAYLOAD_PUBLIC_SERVER_URL') || siteUrl,
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · ULL Admissions Desk' },
    importMap: { baseDir: path.resolve(dirname) },
    // Page form shows the real website beside it, updating as you type.
    livePreview: {
      collections: ['pages'],
      url: ({ data }) => `${siteUrl}/preview/?id=${data?.id ?? ''}`,
      breakpoints: [
        { label: 'Phone', name: 'phone', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 820, height: 1180 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Enquiries, Pages, Media, PrivateFiles, Users],
  globals: [SiteSettings],
  cors: origins,
  csrf: origins,
  editor: lexicalEditor(),
  secret: env('PAYLOAD_SECRET') || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  // Migrations run automatically when the production server starts.
  db: postgresAdapter({ pool: { connectionString: env('DATABASE_URL') || '' }, prodMigrations: migrations }),
  sharp,
  // Larger uploads are refused before they are read into memory. Media allows 10 MB (see Media.ts);
  // private files allow more for counselling recordings.
  upload: { limits: { fileSize: MAX_PRIVATE_UPLOAD } },
  plugins: storagePlugins(),
})
