import { readFileSync } from 'node:fs'
import { APIError, type CollectionConfig, type ImageSize } from 'payload'
import { anyone, canEditContent, hideUnless } from '../access/roles'
import { env } from '../lib/env'
import { mediaPrefix } from '../lib/media-prefix'

const MB = 1024 * 1024
export const MAX_UPLOAD = 10 * MB
// Short silent loops only; longer films go on YouTube.
export const MAX_VIDEO = 3 * MB

// Each width is made as WebP and AVIF; the site serves AVIF → WebP → original via <picture>.
const widths = { thumb: 400, card: 800, hero: 1600 }
const sizeList: ImageSize[] = Object.entries(widths).flatMap(([name, width]) => [
  { name, width, withoutEnlargement: true, formatOptions: { format: 'webp', options: { quality: 80 } } },
  { name: `${name}Avif`, width, withoutEnlargement: true, formatOptions: { format: 'avif', options: { quality: 55 } } },
])

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Website', hidden: hideUnless('schoolAdmin', 'editor') },
  access: { read: anyone, create: canEditContent, update: canEditContent, delete: canEditContent },
  hooks: {
    // Runs on the upload as sent; by beforeChange, req.file is already the resized image.
    beforeOperation: [
      ({ args, operation }) => {
        const file = (operation === 'create' || operation === 'update') && args.req?.file
        if (!file) return args
        if (file.size > MAX_UPLOAD) throw new APIError('Files must be 10 MB or smaller.', 413, null, true)
        if (file.mimetype.startsWith('video/') && file.size > MAX_VIDEO)
          throw new APIError('Videos must be 3 MB or smaller. Put longer videos on YouTube.', 413, null, true)
        return args
      },
    ],
    beforeChange: [
      ({ data, req }) => {
        const file = req.file
        if (!env('S3_BUCKET') || !file) return data
        const contents = file.data?.length ? file.data : file.tempFilePath ? readFileSync(file.tempFilePath) : undefined
        if (!contents?.length) return data
        return { ...data, prefix: mediaPrefix(contents, file.mimetype) }
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describe the image (or name the document) for Google and screen readers.' },
    },
  ],
  upload: {
    disableLocalStorage: Boolean(env('S3_BUCKET')),
    mimeTypes: ['image/*', 'application/pdf', 'video/mp4', 'video/webm'],
    // Re-encoding the original applies the EXIF rotation and drops all metadata (including GPS).
    resizeOptions: { width: 2400, withoutEnlargement: true },
    imageSizes: [
      ...sizeList,
      { name: 'og', width: 1200, height: 630, position: 'centre', formatOptions: { format: 'jpeg', options: { quality: 82 } } },
    ],
  },
}
