import type { CollectionConfig } from 'payload'
import { canEditContent, hideUnless } from '../access/roles'
import { blocks } from '../blocks'
import { rebuildOnPublish } from '../lib/rebuild'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Website',
    hidden: hideUnless('schoolAdmin', 'editor'),
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    preview: (doc) => `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/${doc.slug ? `${doc.slug}/` : ''}`,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  access: {
    // The public site build reads published pages only.
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: canEditContent,
    update: canEditContent,
    delete: canEditContent,
  },
  hooks: { afterChange: [rebuildOnPublish] },
  fields: [
    {
      name: 'pageBuilder',
      type: 'ui',
      admin: { position: 'sidebar', components: { Field: '/components/OpenBuilder#OpenBuilder' } },
    },
    { type: 'row', fields: [
      { name: 'title', type: 'text', required: true, admin: { description: 'Used as the browser/Google title.' } },
      { name: 'slug', type: 'text', required: true, unique: true, index: true, admin: { description: 'URL path without slashes, e.g. academics/foundational' } },
    ] },
    { name: 'description', type: 'textarea', required: true, maxLength: 170, admin: { description: 'Google snippet, 150–160 characters.' } },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { type: 'row', fields: [
          { name: 'eyebrow', type: 'text' },
          { name: 'accent', type: 'select', options: ['navy', 'orange', 'teal', 'gold'], defaultValue: 'navy' },
        ] },
        { name: 'heading', type: 'text', required: true },
        { name: 'lead', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'actions', type: 'array', maxRows: 2, fields: [{ type: 'row', fields: [{ name: 'label', type: 'text', required: true }, { name: 'href', type: 'text', required: true }] }] },
      ],
    },
    { name: 'breadcrumb', type: 'array', admin: { position: 'sidebar' }, fields: [{ name: 'label', type: 'text', required: true }, { name: 'href', type: 'text', required: true }] },
    { name: 'blocks', type: 'blocks', blocks },
  ],
}
