import { readFileSync } from 'node:fs'
import type { CollectionConfig } from 'payload'
import { anyone, canEditContent, hideUnless } from '../access/roles'
import { env } from '../lib/env'
import { mediaPrefix } from '../lib/media-prefix'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Website', hidden: hideUnless('schoolAdmin', 'editor') },
  access: { read: anyone, create: canEditContent, update: canEditContent, delete: canEditContent },
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        if (!env('S3_BUCKET') || !req.file) return data
        const file = req.file
        const contents = file.data?.length ? file.data : file.tempFilePath ? readFileSync(file.tempFilePath) : undefined
        if (!contents?.length) return data
        return { ...data, prefix: mediaPrefix(contents) }
      },
    ],
  },
  fields: [
    { name: 'alt', type: 'text', required: true, admin: { description: 'Describe the image for Google and screen readers.' } },
  ],
  upload: {
    disableLocalStorage: Boolean(env('S3_BUCKET')),
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 640 },
      { name: 'hero', width: 1600 },
    ],
    formatOptions: { format: 'webp', options: { quality: 80 } },
  },
}
