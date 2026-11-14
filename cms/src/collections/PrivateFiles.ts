import type { CollectionConfig } from 'payload'
import { canReadPrivateFiles, canWorkAdmissions, isAdmin } from '../access/roles'
import { env } from '../lib/env'

// A one-hour counselling recording at 64 kbps is about 30 MB.
export const MAX_PRIVATE_UPLOAD = 50 * 1024 * 1024

// Files that must never be on the public CDN: applicant documents, counselling recordings,
// psychometric reports and student portfolios. Every download goes through Payload's access check,
// then (in AWS) a 5-minute presigned link to the private bucket.
export const PrivateFiles: CollectionConfig = {
  slug: 'private-files',
  labels: { singular: 'Private file', plural: 'Private files' },
  admin: { group: 'Admissions', useAsTitle: 'filename', defaultColumns: ['filename', 'kind', 'enquiry', 'createdAt'] },
  access: {
    read: canReadPrivateFiles,
    create: canWorkAdmissions,
    update: canReadPrivateFiles,
    delete: isAdmin,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'kind',
          type: 'select',
          required: true,
          defaultValue: 'applicantDocument',
          options: [
            { label: 'Applicant document', value: 'applicantDocument' },
            { label: 'Counselling recording', value: 'recording' },
            { label: 'Assessment report', value: 'report' },
            { label: 'Student portfolio', value: 'portfolio' },
          ],
        },
        { name: 'enquiry', type: 'relationship', relationTo: 'enquiries', index: true },
      ],
    },
    { name: 'note', type: 'textarea', maxLength: 500 },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      defaultValue: ({ user }) => user?.id,
      admin: { readOnly: true },
    },
  ],
  upload: {
    // Locally files stay on disk outside public/, still served only through the access check.
    staticDir: 'private-files',
    disableLocalStorage: Boolean(env('PRIVATE_BUCKET')),
    mimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'audio/*'],
  },
}
