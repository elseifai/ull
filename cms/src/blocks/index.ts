import type { Block, Field } from 'payload'

// Page blocks. These mirror web/src/content/types.ts one-to-one (blockType ↔ type).

const accent: Field = {
  name: 'accent',
  type: 'select',
  options: ['navy', 'orange', 'teal', 'gold'],
  defaultValue: 'navy',
}
const tone: Field = {
  name: 'tone',
  type: 'select',
  options: ['white', 'cream', 'navy', 'teal', 'gold', 'orange'],
  defaultValue: 'white',
  admin: { description: 'Section background' },
}
const heading: Field[] = [
  { name: 'eyebrow', type: 'text' },
  { name: 'heading', type: 'text' },
  { name: 'lead', type: 'textarea' },
]
const strings = (name: string, label?: string): Field => ({
  name,
  label,
  type: 'array',
  fields: [{ name: 'text', type: 'textarea', required: true }],
})
const link = (name: string): Field => ({
  name,
  type: 'group',
  fields: [
    { type: 'row', fields: [{ name: 'label', type: 'text' }, { name: 'href', type: 'text' }] },
  ],
})
const image = (name = 'image'): Field => ({ name, type: 'upload', relationTo: 'media' })

const card: Field[] = [
  { type: 'row', fields: [{ name: 'title', type: 'text', required: true }, { name: 'tag', type: 'text' }, accent] },
  { name: 'text', type: 'textarea' },
  { name: 'href', type: 'text', admin: { description: 'Link, e.g. /academics/' } },
  image(),
  strings('bullets'),
]

// Each block shows a picture of how it looks on the site (public/blocks/<slug>.png, made by
// `npm run thumbnails` in ../web).
// Same names as the page builder's block list.
const names: Record<string, string> = {
  text: 'Text with photo',
  cards: 'Cards',
  subnav: 'Link cards with photos',
  steps: 'Numbered steps',
  table: 'Two-column table',
  faq: 'Questions and answers',
  quote: 'Quote',
  gallery: 'Photo gallery',
  cta: 'Call to action',
  enquiry: 'Enquiry or visit form',
}
const withThumbnail = (b: Block): Block => ({
  ...b,
  labels: { singular: names[b.slug] ?? b.slug, plural: names[b.slug] ?? b.slug },
  imageURL: `/blocks/${b.slug}.png`,
  imageAltText: `${names[b.slug]} preview`,
})

const blockList: Block[] = [
  {
    slug: 'text',
    labels: { singular: 'Text (with optional image)', plural: 'Text' },
    fields: [
      ...heading,
      strings('body', 'Paragraphs'),
      strings('bullets'),
      { type: 'row', fields: [image(), { name: 'imageSide', type: 'select', options: ['left', 'right'] }] },
      link('link'),
      tone,
    ],
  },
  {
    slug: 'cards',
    fields: [...heading, { name: 'columns', type: 'select', options: ['2', '3', '4'], defaultValue: '3' }, { name: 'items', type: 'array', fields: card }, tone],
  },
  {
    slug: 'table',
    fields: [
      ...heading,
      { type: 'row', fields: [{ name: 'col1', label: 'Column 1 title', type: 'text', required: true }, { name: 'col2', label: 'Column 2 title', type: 'text', required: true }] },
      { name: 'rows', type: 'array', fields: [{ name: 'label', type: 'text', required: true }, { name: 'value', type: 'textarea', required: true }] },
      tone,
    ],
  },
  { slug: 'steps', fields: [...heading, { name: 'items', type: 'array', fields: [{ name: 'title', type: 'text', required: true }, { name: 'text', type: 'textarea' }] }, tone] },
  {
    slug: 'faq',
    labels: { singular: 'FAQ', plural: 'FAQs' },
    fields: [{ name: 'eyebrow', type: 'text' }, { name: 'heading', type: 'text' }, { name: 'items', type: 'array', fields: [{ name: 'q', label: 'Question', type: 'text', required: true }, { name: 'a', label: 'Answer', type: 'textarea', required: true }] }, tone],
  },
  { slug: 'quote', fields: [{ name: 'text', type: 'textarea', required: true }, { name: 'cite', type: 'text' }, tone] },
  {
    slug: 'gallery',
    fields: [...heading, { name: 'items', type: 'array', fields: [image(), { name: 'title', type: 'text', required: true }, { name: 'caption', type: 'text' }] }, { name: 'note', type: 'text' }, tone],
  },
  { slug: 'cta', labels: { singular: 'Call to action', plural: 'Calls to action' }, fields: [{ name: 'heading', type: 'text', required: true }, { name: 'text', type: 'textarea' }, link('primary'), link('secondary'), image()] },
  { slug: 'subnav', labels: { singular: 'Link cards', plural: 'Link cards' }, fields: [...heading, { name: 'items', type: 'array', fields: card }, tone] },
  {
    slug: 'enquiry',
    labels: { singular: 'Enquiry form', plural: 'Enquiry forms' },
    fields: [{ name: 'heading', type: 'text' }, { name: 'lead', type: 'textarea' }, { name: 'mode', type: 'select', options: ['enquiry', 'visit'], defaultValue: 'enquiry' }],
  },
]

export const blocks: Block[] = blockList.map(withThumbnail)
