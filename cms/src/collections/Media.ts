import type { CollectionConfig } from 'payload'
import { anyone, canEditContent, hideUnless } from '../access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Website', hidden: hideUnless('schoolAdmin', 'editor') },
  access: { read: anyone, create: canEditContent, update: canEditContent, delete: canEditContent },
  fields: [
    { name: 'alt', type: 'text', required: true, admin: { description: 'Describe the image for Google and screen readers.' } },
  ],
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 640 },
      { name: 'hero', width: 1600 },
    ],
    formatOptions: { format: 'webp', options: { quality: 80 } },
  },
}
