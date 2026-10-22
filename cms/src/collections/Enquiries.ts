import type { CollectionConfig, FieldAccess } from 'payload'
import { anyone, canWorkAdmissions, isAdmin } from '../access/roles'
import { notify } from '../lib/notify'

// The Admissions & Visitor Desk record: one row per family enquiry, visit or walk-in.
// Website forms create these; staff move them through the pipeline.

export const STAGES = [
  { label: 'Enquired', value: 'enquired' },
  { label: 'Visit booked', value: 'visitBooked' },
  { label: 'Visited', value: 'visited' },
  { label: 'Child interaction', value: 'interaction' },
  { label: 'Documents pending', value: 'documents' },
  { label: 'Admission confirmed', value: 'confirmed' },
  { label: 'Orientation done', value: 'orientation' },
  { label: 'Enrolled', value: 'enrolled' },
  { label: 'Lost / not now', value: 'lost' },
]

const GRADES = ['Nursery', 'LKG', 'UKG', ...Array.from({ length: 10 }, (_, i) => `Grade ${i + 1}`)]

const staffOnly: FieldAccess = ({ req }) => Boolean(req.user)

const PUBLIC_FIELDS = ['type', 'parentName', 'phone', 'email', 'childName', 'grade', 'currentSchool', 'preferredDate', 'priority', 'source', 'message', 'consent', 'pageUrl']

const passCode = () => Math.random().toString(36).slice(2, 8).toUpperCase()

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  labels: { singular: 'Enquiry', plural: 'Admissions & Visitors' },
  admin: {
    useAsTitle: 'parentName',
    group: 'Admissions',
    defaultColumns: ['parentName', 'childName', 'grade', 'stage', 'type', 'preferredDate', 'assignedTo', 'createdAt'],
    listSearchableFields: ['parentName', 'childName', 'phone', 'email'],
  },
  access: {
    create: anyone, // website forms
    read: canWorkAdmissions,
    update: canWorkAdmissions,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation, req }) => {
        if (!data) return data
        // Website visitors may only set the form fields; everything else is staff-only.
        if (operation === 'create' && !req.user) {
          const clean: Record<string, unknown> = {}
          for (const k of PUBLIC_FIELDS) if (data[k] !== undefined && data[k] !== '') clean[k] = data[k]
          if (clean.type !== 'visit') clean.type = 'enquiry'
          clean.stage = clean.type === 'visit' ? 'visitBooked' : 'enquired'
          data = clean
        }
        if (operation === 'create') data.visit = { ...(data.visit ?? {}), passCode: passCode() }
        if (data.phone) data.phone = String(data.phone).replace(/[^\d+]/g, '')
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return
        const first = String(doc.parentName ?? '').split(' ')[0]
        const isVisit = doc.type === 'visit'
        // Do not block the form response on message delivery.
        void notify(req.payload, {
          to: { phone: doc.phone, email: doc.email, name: doc.parentName },
          template: isVisit ? 'visit_requested' : 'enquiry_received',
          params: { name: first, child: doc.childName ?? '', date: doc.preferredDate?.slice(0, 10) ?? '' },
          subject: isVisit ? 'Your ULL Auremont campus visit request' : 'Thank you for your enquiry',
          text: isVisit
            ? `Dear ${first}, thank you for requesting a visit to ULL Auremont. We will confirm your slot shortly.`
            : `Dear ${first}, thank you for your enquiry about ${doc.childName} at ULL Auremont. Our admissions team will call you soon.`,
        })
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'enquiry',
          options: [
            { label: 'Website enquiry', value: 'enquiry' },
            { label: 'Visit request', value: 'visit' },
            { label: 'Walk-in', value: 'walkIn' },
            { label: 'Phone call', value: 'call' },
          ],
        },
        {
          name: 'stage',
          type: 'select',
          defaultValue: 'enquired',
          options: STAGES,
          index: true,
          access: { update: staffOnly },
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Family',
          fields: [
            { type: 'row', fields: [
              { name: 'parentName', label: 'Parent / guardian', type: 'text', required: true, maxLength: 120 },
              { name: 'phone', type: 'text', required: true, index: true, maxLength: 20,
                validate: (v: unknown) => (/^\+?\d{10,15}$/.test(String(v ?? '').replace(/[^\d+]/g, '')) ? true : 'Enter a valid mobile number') },
              { name: 'email', type: 'email' },
            ] },
            { type: 'row', fields: [
              { name: 'childName', label: 'Child’s name', type: 'text', required: true, maxLength: 120 },
              { name: 'grade', label: 'Grade sought', type: 'select', required: true, options: GRADES },
              { name: 'currentSchool', type: 'text', maxLength: 160 },
            ] },
            { type: 'row', fields: [
              { name: 'preferredDate', label: 'Preferred visit date', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
              { name: 'priority', label: 'What matters most', type: 'text', maxLength: 60 },
              { name: 'source', label: 'Heard about us via', type: 'text', maxLength: 60 },
            ] },
            { name: 'message', type: 'textarea', maxLength: 2000 },
            { type: 'row', fields: [
              { name: 'consent', type: 'checkbox', label: 'Consented to be contacted' },
              { name: 'pageUrl', type: 'text', admin: { readOnly: true } },
            ] },
          ],
        },
        {
          label: 'Follow-up',
          fields: [
            { type: 'row', fields: [
              { name: 'assignedTo', type: 'relationship', relationTo: 'users', access: { update: staffOnly } },
              { name: 'followUpOn', type: 'date', access: { update: staffOnly } },
            ] },
            {
              name: 'notes',
              type: 'array',
              access: { update: staffOnly },
              fields: [
                { name: 'note', type: 'textarea', required: true },
                { name: 'by', type: 'relationship', relationTo: 'users', defaultValue: ({ user }) => user?.id, admin: { readOnly: true } },
                { name: 'at', type: 'date', defaultValue: () => new Date().toISOString(), admin: { readOnly: true } },
              ],
            },
          ],
        },
        {
          label: 'Visit & gate',
          fields: [
            {
              name: 'visit',
              type: 'group',
              access: { update: staffOnly },
              fields: [
                { type: 'row', fields: [
                  { name: 'confirmedAt', label: 'Confirmed visit slot', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
                  { name: 'host', type: 'relationship', relationTo: 'users' },
                  { name: 'passCode', type: 'text', admin: { readOnly: true, description: 'Shown on the visitor’s QR pass.' } },
                ] },
                { type: 'row', fields: [
                  { name: 'checkedInAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
                  { name: 'checkedOutAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
                  { name: 'visitors', type: 'number', min: 1, defaultValue: 1 },
                ] },
              ],
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
