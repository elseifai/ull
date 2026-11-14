import { OTP_LIMITS, type SlidingRateLimiter, emailRateKey, overLimit, phoneRateKey } from './rate-limit'
import {
  clearSessionCookie,
  jwtExpiry,
  openSession,
  readCookie,
  sealSession,
  sessionCookie,
  sessionMaxAgeSec,
  tokenExpired,
  OTP_COOKIE,
} from './session'
import { identifierMatchesForm, verifyAccessToken } from './msg91'

// One gate for every website form: rate limit, reuse a still-valid MSG91 token,
// re-check that token with MSG91, and only then call the CRM create.

export type LeadFailureCode =
  | 'otp_required'
  | 'otp_invalid'
  | 'otp_expired'
  | 'otp_mismatch'
  | 'rate_limited'
  | 'otp_unavailable'
  | 'forbidden'
  | 'invalid'

export type AcceptLeadResult = {
  status: number
  body: { ok?: true; error?: string; code?: string }
  setCookie?: string
}

export type AcceptLeadInput = {
  data: Record<string, unknown>
  cookieHeader: string | null
  ip: string
  origin: string | null
  allowedOrigins: string[]
  authkey: string | undefined
  secret: string
  secureCookie: boolean
  now?: number
  limiter: SlidingRateLimiter
  fetchImpl?: typeof fetch
  timeoutMs?: number
  limits?: Partial<typeof OTP_LIMITS>
  create: (data: Record<string, unknown>) => Promise<unknown>
}

const RATE_LIMIT_MESSAGE = 'Too many attempts. Please wait a few minutes and try again.'

export async function acceptWebsiteLead(input: AcceptLeadInput): Promise<AcceptLeadResult> {
  const now = input.now ?? Date.now()
  const limits = { ...OTP_LIMITS, ...input.limits }
  const secure = input.secureCookie

  if (nonEmptyString(input.data.website)) {
    // Same honeypot as the form: pretend it worked and do not create a lead.
    return { status: 200, body: { ok: true } }
  }

  if (!originAllowed(input.origin, input.allowedOrigins)) {
    return fail(403, 'forbidden', 'This form can only be sent from the school website.', secure, false)
  }

  const phone = stringField(input.data.phone)
  const email = stringField(input.data.email)
  const phoneKey = phone ? phoneRateKey(phone) : null
  const emailKey = email ? emailRateKey(email) : null

  const blocked = submissionBlocked(input.limiter, input.ip, phoneKey, emailKey, limits)
  if (!blocked.ok) return rateLimited(blocked.retryAfterSec)

  if (!input.authkey?.trim()) {
    return fail(503, 'otp_unavailable', 'We couldn’t verify your number just now. Please try again in a moment.', secure, false)
  }

  const presented = stringField(input.data.accessToken)
  const sealed = readCookie(input.cookieHeader, OTP_COOKIE)
  const stored = sealed && input.secret ? openSession(sealed, input.secret) : null
  const brokenCookie = Boolean(sealed && input.secret && !stored)
  const token = presented && presented.length < 8192 ? presented : stored?.token ?? null
  const fromSession = !presented && Boolean(stored?.token)

  if (!token) {
    noteFailure(input.limiter, input.ip, phoneKey, emailKey, limits)
    return fail(401, 'otp_required', 'Please verify your mobile number to continue.', secure, brokenCookie)
  }

  const exp = jwtExpiry(token)
  if (tokenExpired(exp, now) || (fromSession && stored && tokenExpired(stored.exp, now))) {
    noteFailure(input.limiter, input.ip, phoneKey, emailKey, limits)
    return fail(401, 'otp_expired', 'Your verification has expired. Please verify your mobile number again.', secure, true)
  }

  const verified = await verifyAccessToken(token, {
    authkey: input.authkey,
    fetchImpl: input.fetchImpl,
    timeoutMs: input.timeoutMs,
  })

  if (!verified.ok) {
    noteFailure(input.limiter, input.ip, phoneKey, emailKey, limits)
    if (verified.reason === 'unavailable') {
      return fail(503, 'otp_unavailable', 'We couldn’t verify your number just now. Please try again in a moment.', secure, false)
    }
    return fail(401, 'otp_invalid', 'That verification didn’t work. Please request a new code.', secure, true)
  }

  if (!identifierMatchesForm(verified.identifier, { phone, email })) {
    noteFailure(input.limiter, input.ip, phoneKey, emailKey, limits)
    return fail(401, 'otp_mismatch', 'Verify the mobile number on this form to continue.', secure, false)
  }

  const lead = leadFields(input.data)
  try {
    await input.create(lead)
  } catch (err) {
    const status = errorStatus(err)
    const cookie = input.secret ? sealCookie(token, exp, input.secret, secure, now) : undefined
    return {
      status: status >= 500 ? 500 : 400,
      body: {
        error: status >= 500 ? 'Sorry, we couldn’t send that just now. Please try again.' : publicErrorMessage(err),
        code: 'invalid',
      },
      setCookie: cookie,
    }
  }

  noteSuccess(input.limiter, input.ip, phoneKey, emailKey, limits)
  const setCookie = input.secret ? sealCookie(token, exp, input.secret, secure, now) : undefined
  return { status: 200, body: { ok: true }, setCookie }
}

export function readLeadSession(cookieHeader: string | null, secret: string, now = Date.now()): { verified: boolean; clear: boolean } {
  if (!secret) return { verified: false, clear: false }
  const sealed = readCookie(cookieHeader, OTP_COOKIE)
  if (!sealed) return { verified: false, clear: false }
  const session = openSession(sealed, secret)
  if (!session) return { verified: false, clear: true }
  if (tokenExpired(session.exp, now) || tokenExpired(jwtExpiry(session.token), now)) {
    return { verified: false, clear: true }
  }
  return { verified: true, clear: false }
}

export function originAllowed(origin: string | null, allowed: string[]): boolean {
  if (!origin) return true
  const normalized = origin.replace(/\/$/, '')
  return allowed.some((entry) => entry.replace(/\/$/, '') === normalized)
}

export function allowedOriginList(cors: unknown): string[] {
  if (cors === '*') return []
  if (Array.isArray(cors)) return cors.filter((value): value is string => typeof value === 'string')
  if (cors && typeof cors === 'object' && 'origins' in cors) {
    const origins = (cors as { origins?: unknown }).origins
    if (origins === '*') return []
    if (Array.isArray(origins)) return origins.filter((value): value is string => typeof value === 'string')
  }
  return []
}

function sealCookie(token: string, exp: number | null, secret: string, secure: boolean, now: number): string {
  const sealed = sealSession({ token, exp }, secret)
  return sessionCookie(sealed, { secure, maxAgeSec: sessionMaxAgeSec(exp, now) })
}

function fail(status: number, code: LeadFailureCode, error: string, secure: boolean, clear: boolean): AcceptLeadResult {
  return { status, body: { error, code }, setCookie: clear ? clearSessionCookie(secure) : undefined }
}

function rateLimited(retryAfterSec: number): AcceptLeadResult {
  return {
    status: 429,
    body: { error: RATE_LIMIT_MESSAGE, code: 'rate_limited', retryAfterSec } as AcceptLeadResult['body'],
    setCookie: undefined,
  }
}

function submissionBlocked(
  limiter: SlidingRateLimiter,
  ip: string,
  phoneKey: string | null,
  emailKey: string | null,
  limits: typeof OTP_LIMITS,
) {
  return overLimit(limiter, [
    ...budget(ip, phoneKey, emailKey, 'ok', limits.successPerIp, limits.successPerPhone, limits.successPerEmail, limits.successWindowMs),
    ...budget(ip, phoneKey, emailKey, 'fail', limits.failurePerIp, limits.failurePerPhone, limits.failurePerEmail, limits.failureWindowMs),
  ])
}

function noteSuccess(
  limiter: SlidingRateLimiter,
  ip: string,
  phoneKey: string | null,
  emailKey: string | null,
  limits: typeof OTP_LIMITS,
) {
  for (const check of budget(ip, phoneKey, emailKey, 'ok', limits.successPerIp, limits.successPerPhone, limits.successPerEmail, limits.successWindowMs)) {
    limiter.hit(check.key, check.rule.windowMs)
  }
}

function noteFailure(
  limiter: SlidingRateLimiter,
  ip: string,
  phoneKey: string | null,
  emailKey: string | null,
  limits: typeof OTP_LIMITS,
) {
  for (const check of budget(ip, phoneKey, emailKey, 'fail', limits.failurePerIp, limits.failurePerPhone, limits.failurePerEmail, limits.failureWindowMs)) {
    limiter.hit(check.key, check.rule.windowMs)
  }
}

function budget(
  ip: string,
  phoneKey: string | null,
  emailKey: string | null,
  kind: 'ok' | 'fail',
  perIp: number,
  perPhone: number,
  perEmail: number,
  windowMs: number,
) {
  const checks = [{ key: `${kind}:ip:${ip}`, rule: { limit: perIp, windowMs } }]
  if (phoneKey) checks.push({ key: `${kind}:phone:${phoneKey}`, rule: { limit: perPhone, windowMs } })
  if (emailKey) checks.push({ key: `${kind}:email:${emailKey}`, rule: { limit: perEmail, windowMs } })
  return checks
}

function leadFields(data: Record<string, unknown>): Record<string, unknown> {
  const lead: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    if (key === 'accessToken' || key === 'website') continue
    lead[key] = value
  }
  return lead
}

function stringField(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

function nonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.trim() !== ''
}

function errorStatus(err: unknown): number {
  if (err && typeof err === 'object' && 'status' in err && typeof (err as { status: unknown }).status === 'number') {
    return (err as { status: number }).status
  }
  return 400
}

function publicErrorMessage(err: unknown): string {
  const fallback = 'Sorry, we couldn’t send that just now. Please try again.'
  if (!(err instanceof Error)) return fallback
  const message = err.message.trim()
  if (!message || message.length > 300) return fallback
  if (/authkey|access-token|bearer|eyJ/i.test(message)) return fallback
  return message
}

export function retryAfterSeconds(result: AcceptLeadResult): number | null {
  const value = (result.body as { retryAfterSec?: unknown }).retryAfterSec
  return typeof value === 'number' ? value : null
}
