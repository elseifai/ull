import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Enquiries } from './collections/Enquiries'
import { SiteSettings } from './globals/SiteSettings'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Origins allowed to call the API from a browser (the public site and local dev).
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4100').replace(/\/$/, '')
const origins = [process.env.NEXT_PUBLIC_SITE_URL, 'http://localhost:3000', 'http://localhost:4100'].filter(Boolean) as string[]

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
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
  collections: [Enquiries, Pages, Media, Users],
  globals: [SiteSettings],
  cors: origins,
  csrf: origins,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  // Migrations run automatically when the production server starts.
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL || '' }, prodMigrations: migrations }),
  sharp,
  plugins: [],
})
