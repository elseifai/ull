import type { CollectionConfig } from 'payload'
import { ROLES, adminFieldOnly, hideUnless, isAdmin, isStaff } from '../access/roles'

// Staff accounts. Parents get their own collection in the portal phase.
export const Users: CollectionConfig = {
  slug: 'users',
  // Staff reach their own account from the avatar menu; only the group admin manages the list.
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'email', 'roles'], group: 'Settings', hidden: hideUnless() },
  auth: true,
  access: {
    read: isStaff,
    create: isAdmin,
    update: ({ req, id }) => Boolean(req.user && (req.user.roles?.includes('admin') || req.user.id === id)),
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['counsellor'],
      options: [...ROLES],
      access: { update: adminFieldOnly },
      saveToJWT: true,
    },
    { name: 'phone', type: 'text', admin: { description: 'Used for front-desk visitor alerts on WhatsApp.' } },
  ],
}
