import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

// The verified MSG91 access token is stored only in an httpOnly cookie, sealed
// with the CMS secret. The browser cannot read it, and a forged cookie fails to open.

export const OTP_COOKIE = 'ull_lead_otp'
const COOKIE_PATH = '/api'

export type SealedSession = {
  token: string
  exp: number | null
}

export function sealSession(session: SealedSession, secret: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', cookieKey(secret), iv)
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(session), 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [iv, tag, ciphertext].map((part) => part.toString('base64url')).join('.')
}

export function openSession(sealed: string, secret: string): SealedSession | null {
  const parts = sealed.split('.')
  if (parts.length !== 3 || !secret) return null
  try {
    const [iv, tag, ciphertext] = parts.map((part) => Buffer.from(part, 'base64url'))
    const decipher = createDecipheriv('aes-256-gcm', cookieKey(secret), iv)
    decipher.setAuthTag(tag)
    const json = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8')
    const parsed = JSON.parse(json) as Partial<SealedSession>
    if (!parsed || typeof parsed.token !== 'string' || !parsed.token) return null
    if (parsed.exp !== null && parsed.exp !== undefined && typeof parsed.exp !== 'number') return null
    return { token: parsed.token, exp: typeof parsed.exp === 'number' ? parsed.exp : null }
  } catch {
    return null
  }
}

export function sessionCookie(sealed: string, options: { secure: boolean; maxAgeSec: number }): string {
  const parts = [
    `${OTP_COOKIE}=${encodeURIComponent(sealed)}`,
    `Path=${COOKIE_PATH}`,
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${Math.max(0, Math.floor(options.maxAgeSec))}`,
  ]
  if (options.secure) parts.push('Secure')
  return parts.join('; ')
}

export function clearSessionCookie(secure: boolean): string {
  const parts = [`${OTP_COOKIE}=`, `Path=${COOKIE_PATH}`, 'HttpOnly', 'SameSite=Lax', 'Max-Age=0']
  if (secure) parts.push('Secure')
  return parts.join('; ')
}

export function readCookie(header: string | null, name: string): string | null {
  if (!header) return null
  for (const part of header.split(';')) {
    const separator = part.indexOf('=')
    if (separator === -1) continue
    const key = part.slice(0, separator).trim()
    if (key !== name) continue
    const value = part.slice(separator + 1).trim()
    try {
      return decodeURIComponent(value)
    } catch {
      return value
    }
  }
  return null
}

/** exp is the JWT NumericDate (seconds). Missing exp means the server must ask MSG91. */
export function jwtExpiry(token: string): number | null {
  const parts = token.split('.')
  if (parts.length < 2) return null
  try {
    const json = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')) as { exp?: unknown }
    return typeof json.exp === 'number' && Number.isFinite(json.exp) ? json.exp : null
  } catch {
    return null
  }
}

export function tokenExpired(exp: number | null, nowMs: number): boolean {
  if (exp === null) return false
  return exp * 1000 <= nowMs
}

export function sessionMaxAgeSec(exp: number | null, nowMs: number): number {
  const twelveHours = 12 * 60 * 60
  const oneDay = 24 * 60 * 60
  if (exp === null) return twelveHours
  const remaining = Math.floor(exp - nowMs / 1000)
  if (remaining < 60) return 60
  return Math.min(remaining, oneDay)
}

function cookieKey(secret: string): Buffer {
  return createHash('sha256').update(secret).digest()
}
