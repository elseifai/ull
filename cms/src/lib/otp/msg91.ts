// Server-side check of the JWT the official MSG91 widget returns after OTP.
// AuthKey stays here. It is never sent to the browser and never logged.

export const MSG91_VERIFY_URL = 'https://control.msg91.com/api/v5/widget/verifyAccessToken'

export type VerifyResult =
  | { ok: true; identifier: string | null }
  | { ok: false; reason: 'invalid' | 'unavailable' }

const JWT_RE = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/

export function looksLikeJwt(value: string): boolean {
  return value.length > 20 && value.length < 8192 && JWT_RE.test(value)
}

/** Pull the access token out of the widget success callback without assuming one property name. */
export function accessTokenFromWidget(data: unknown, depth = 0): string | null {
  if (typeof data === 'string') return looksLikeJwt(data.trim()) ? data.trim() : null
  if (!data || typeof data !== 'object' || depth > 3) return null
  const record = data as Record<string, unknown>
  for (const key of ['access-token', 'accessToken', 'access_token', 'token', 'jwt']) {
    const value = record[key]
    if (typeof value === 'string' && looksLikeJwt(value.trim())) return value.trim()
  }
  if (typeof record.message === 'string' && looksLikeJwt(record.message.trim())) return record.message.trim()
  if ('data' in record) return accessTokenFromWidget(record.data, depth + 1)
  return null
}

export function clientIp(headers: { get(name: string): string | null }): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    const parts = forwarded.split(',').map((part) => part.trim()).filter(Boolean)
    const last = parts[parts.length - 1]
    if (last) return last.slice(0, 64)
  }
  const real = headers.get('x-real-ip')?.trim()
  if (real) return real.slice(0, 64)
  return 'unknown'
}

export function widgetClientConfig(env: { widgetId?: string; tokenAuth?: string }): { widgetId: string; tokenAuth: string } | null {
  const widgetId = env.widgetId?.trim()
  const tokenAuth = env.tokenAuth?.trim()
  if (!widgetId || !tokenAuth) return null
  return { widgetId, tokenAuth }
}

/**
 * POST the widget JWT to MSG91. HTTP 200 with type "error" is a failure.
 * Timeouts and network errors are unavailable, not a reason to accept the lead.
 */
export async function verifyAccessToken(
  token: string,
  options: { authkey: string; fetchImpl?: typeof fetch; timeoutMs?: number },
): Promise<VerifyResult> {
  const authkey = options.authkey.trim()
  if (!authkey || !looksLikeJwt(token)) return { ok: false, reason: 'invalid' }
  const fetchImpl = options.fetchImpl ?? fetch
  const timeoutMs = options.timeoutMs ?? 8000
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetchImpl(MSG91_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ authkey, 'access-token': token }),
      signal: controller.signal,
    })
    const json = (await res.json().catch(() => null)) as { type?: unknown; message?: unknown } | null
    if (!res.ok || !json || json.type !== 'success') return { ok: false, reason: 'invalid' }
    return { ok: true, identifier: boundIdentifier(json.message) }
  } catch {
    return { ok: false, reason: 'unavailable' }
  } finally {
    clearTimeout(timer)
  }
}

/** MSG91 returns the verified mobile or email in `message`. Other success text is not an identifier. */
export function boundIdentifier(message: unknown): string | null {
  if (typeof message !== 'string') return null
  const trimmed = message.trim()
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return trimmed.toLowerCase()
  if (!/^[\d+\s()-]+$/.test(trimmed)) return null
  const digits = trimmed.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 15) return null
  return digits
}

export function identifierMatchesForm(identifier: string | null, data: { phone?: string; email?: string }): boolean {
  if (!identifier) return true
  if (identifier.includes('@')) return (data.email ?? '').trim().toLowerCase() === identifier
  const phone = (data.phone ?? '').replace(/\D/g, '')
  const verified = identifier.replace(/\D/g, '')
  if (phone.length < 10 || verified.length < 10) return false
  return phone.slice(-10) === verified.slice(-10)
}
