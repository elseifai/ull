import { APIError, type CollectionConfig } from 'payload'
import { anyone, canWorkAdmissions, hideUnless, isAdmin } from '../access/roles'

// Website Parent Expectation Form. Each answer is the array of options the parent selected.
// Option text must stay identical to web/src/content/parent-expectations.ts.

const GRADES = ['Nursery', 'LKG', 'UKG', ...Array.from({ length: 10 }, (_, i) => `Grade ${i + 1}`)]

export const PARENT_EXPECTATION_QUESTIONS = [
  {
    name: 'priority',
    label: 'What is your biggest priority while choosing a school?',
    options: [
      'Quality of education',
      'Communication skills',
      'Overall personality development',
      'Sports and extracurricular activities',
      'Safety and security',
      'Discipline and values',
    ],
  },
  {
    name: 'learningEnvironment',
    label: 'What kind of learning environment are you looking for?',
    options: ['Play-based learning', 'Activity-based learning', 'Academic-focused learning', 'Balanced learning approach'],
  },
  {
    name: 'teachers',
    label: 'What matters most to you about teachers?',
    options: ['Experienced teachers', 'Individual attention', 'Friendly and caring teachers', 'Regular parent communication'],
  },
  {
    name: 'skills',
    label: 'Which skills would you like your child to develop?',
    options: ['English communication', 'Confidence', 'Creativity', 'Social skills', 'Leadership'],
  },
  {
    name: 'concern',
    label: "What is your biggest concern about your child's schooling?",
    options: ['Difficulty adjusting', 'Lack of individual attention', 'Academic pressure', 'Safety concerns', 'Communication development'],
  },
  {
    name: 'longTerm',
    label: 'What are your long-term expectations from the school?',
    options: [
      'Strong academic foundation',
      'Confidence and independence',
      'Good communication skills',
      'Well-rounded personality',
      'Preparation for future grades',
    ],
  },
] as const

const QUESTION_NAMES = PARENT_EXPECTATION_QUESTIONS.map((question) => question.name)

const PUBLIC_FIELDS = [
  'parentName',
  'phone',
  'email',
  'childName',
  'grade',
  'consent',
  'pageUrl',
  'utmSource',
  'utmMedium',
  'utmCampaign',
  'utmContent',
  'utmTerm',
  ...QUESTION_NAMES,
]

const chosen = (value: unknown, allowed: readonly string[]) => {
  const list = Array.isArray(value) ? value : value == null || value === '' ? [] : [value]
  return [...new Set(list.map((item) => String(item)).filter((item) => allowed.includes(item)))]
}

const validPhone = (value: unknown) => /^\+?\d{10,15}$/.test(String(value ?? '').replace(/[^\d+]/g, ''))

export const ParentExpectations: CollectionConfig = {
  slug: 'parent-expectations',
  labels: { singular: 'Parent expectation', plural: 'Parent expectations' },
  admin: {
    useAsTitle: 'parentName',
    group: 'Admissions',
    hidden: hideUnless('schoolAdmin', 'counsellor', 'frontDesk'),
    defaultColumns: ['parentName', 'phone', 'childName', 'grade', 'createdAt'],
    listSearchableFields: ['parentName', 'childName', 'phone', 'email'],
  },
  access: {
    create: anyone,
    read: canWorkAdmissions,
    update: canWorkAdmissions,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation, req }) => {
        if (!data) return data
        if (operation === 'create' && !req.user) {
          const incoming = data as Record<string, unknown>
          if (typeof incoming.website === 'string' && incoming.website.trim()) {
            throw new APIError('Unable to save this submission.', 400)
          }
          const clean: Record<string, unknown> = {}
          for (const key of PUBLIC_FIELDS) {
            const value = incoming[key]
            if (value !== undefined && value !== '') clean[key] = value
          }
          for (const question of PARENT_EXPECTATION_QUESTIONS) {
            clean[question.name] = chosen(incoming[question.name], question.options)
          }
          if (clean.consent !== true) throw new APIError('Please agree to be contacted.', 400)
          data = clean
        }
        if (data.phone) data.phone = String(data.phone).replace(/[^\d+]/g, '')
        if (data.email === '') delete data.email
        if (data.childName === '') delete data.childName
        if (data.grade === '') delete data.grade
        return data
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'parentName', label: 'Parent / guardian', type: 'text', required: true, maxLength: 120 },
        {
          name: 'phone',
          label: 'Mobile number',
          type: 'text',
          required: true,
          index: true,
          maxLength: 20,
          validate: (value: unknown) => (validPhone(value) ? true : 'Enter a valid mobile number'),
        },
        { name: 'email', type: 'email' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'childName', label: 'Child’s name', type: 'text', maxLength: 120 },
        { name: 'grade', label: 'Grade applying for', type: 'select', options: GRADES },
      ],
    },
    ...PARENT_EXPECTATION_QUESTIONS.map((question) => ({
      name: question.name,
      label: question.label,
      type: 'select' as const,
      hasMany: true,
      required: true,
      options: [...question.options],
    })),
    {
      type: 'row',
      fields: [
        { name: 'consent', type: 'checkbox', label: 'Consented to be contacted' },
        { name: 'pageUrl', type: 'text', maxLength: 2000, admin: { readOnly: true, description: 'Page they submitted from, including the query string.' } },
      ],
    },
    {
      type: 'collapsible',
      label: 'Campaign link (from the URL they opened)',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'utmSource', label: 'UTM source', type: 'text', maxLength: 120, admin: { readOnly: true } },
            { name: 'utmMedium', label: 'UTM medium', type: 'text', maxLength: 120, admin: { readOnly: true } },
            { name: 'utmCampaign', label: 'UTM campaign', type: 'text', maxLength: 120, admin: { readOnly: true } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'utmContent', label: 'UTM content', type: 'text', maxLength: 120, admin: { readOnly: true } },
            { name: 'utmTerm', label: 'UTM term', type: 'text', maxLength: 120, admin: { readOnly: true } },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
