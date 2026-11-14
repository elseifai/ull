import type { Access, FieldAccess } from 'payload'

export const ROLES = [
  { label: 'Group admin', value: 'admin' },
  { label: 'School admin', value: 'schoolAdmin' },
  { label: 'Content editor', value: 'editor' },
  { label: 'Admissions counsellor', value: 'counsellor' },
  { label: 'Front desk', value: 'frontDesk' },
] as const

export type Role = (typeof ROLES)[number]['value']

type UserLike = { roles?: Role[] | null } | null | undefined

export const hasRole = (user: UserLike, ...roles: Role[]) =>
  Boolean(user?.roles?.some((r) => r === 'admin' || roles.includes(r)))

export const anyone: Access = () => true
export const isAdmin: Access = ({ req }) => hasRole(req.user as UserLike, 'admin')
export const isStaff: Access = ({ req }) => Boolean(req.user)
export const canEditContent: Access = ({ req }) => hasRole(req.user as UserLike, 'schoolAdmin', 'editor')
export const canWorkAdmissions: Access = ({ req }) =>
  hasRole(req.user as UserLike, 'schoolAdmin', 'counsellor', 'frontDesk')
// Applicant documents, recordings and reports: counsellors and school admins, not the front desk.
export const canReadPrivateFiles: Access = ({ req }) => hasRole(req.user as UserLike, 'schoolAdmin', 'counsellor')
// Hide admin sections a role cannot change, so each person's dashboard shows only their own work.
export const hideUnless =
  (...roles: Role[]) =>
  ({ user }: { user: unknown }) =>
    !hasRole(user as UserLike, ...roles)
export const adminFieldOnly: FieldAccess = ({ req }) => hasRole(req.user as UserLike, 'admin')
