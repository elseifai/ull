import type { GlobalConfig } from 'payload'
import { anyone, canEditContent, hideUnless } from '../access/roles'
import { rebuildGlobal } from '../lib/rebuild'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Website', hidden: hideUnless('schoolAdmin', 'editor') },
  access: { read: anyone, update: canEditContent },
  hooks: { afterChange: [rebuildGlobal] },
  fields: [
    { name: 'admissionsYear', type: 'text', admin: { description: 'e.g. 2027–28' } },
    { type: 'row', fields: [
      { name: 'phone', type: 'text' },
      { name: 'whatsapp', type: 'text', admin: { description: 'Digits with country code, e.g. 918000000000' } },
      { name: 'email', type: 'email' },
    ] },
    { name: 'address', type: 'group', fields: [
      { name: 'street', type: 'text' },
      { type: 'row', fields: [{ name: 'postalCode', label: 'PIN', type: 'text' }] },
    ] },
    { name: 'hours', type: 'text' },
    { name: 'affiliation', type: 'text', admin: { description: 'CBSE Affiliation No. ____ · School Code ____' } },
    { name: 'social', type: 'group', fields: [
      { type: 'row', fields: [{ name: 'instagram', type: 'text' }, { name: 'facebook', type: 'text' }] },
      { type: 'row', fields: [{ name: 'youtube', type: 'text' }, { name: 'linkedin', type: 'text' }] },
    ] },
  ],
}
