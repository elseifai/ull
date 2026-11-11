import type { Endpoint, PayloadRequest } from 'payload'
import { env } from '../lib/env'
import { acceptWebsiteLead, allowedOriginList, readLeadSession, retryAfterSeconds } from '../lib/otp/gate'
import { clientIp, widgetClientConfig } from '../lib/otp/msg91'
import { OTP_LIMITS, SlidingRateLimiter, overLimit } from '../lib/otp/rate-limit'
import { clearSessionCookie } from '../lib/otp/session'

// Shared by every website form. The widget asks MSG91 for a code; this endpoint
// checks the resulting token and only then creates the admissions lead.

const limiter = new SlidingRateLimiter()

const noStore = { 'Cache-Control': 'no-store' }

function json(body: unknown, status: number, extra?: HeadersInit): Response {
  const headers = new Headers({ 'Content-Type': 'application/json', ...noStore })
  if (extra) new Headers(extra).forEach((value, key) => headers.append(key, value))
  return new Response(JSON.stringify(body), { status, headers })
}

export const leadOtpEndpoints: Endpoint[] = [
  { path: '/otp/config', method: 'get', handler: configHandler },
  { path: '/otp/session', method: 'get', handler: sessionHandler },
  { path: '/otp/submit', method: 'post', handler: submitHandler },
]

async function configHandler(req: PayloadRequest): Promise<Response> {
  const ip = clientIp(req.headers)
  const limited = hitReadLimit(ip, 'config', OTP_LIMITS.configPerIp, OTP_LIMITS.configWindowMs)
  if (limited) return limited
  const config = widgetClientConfig({ widgetId: env('MSG91_WIDGET_ID'), tokenAuth: env('MSG91_TOKEN_AUTH') })
  if (!config) {
    return json({ error: 'We couldn’t verify your number just now. Please try again in a moment.', code: 'otp_unavailable' }, 503)
  }
  return json(config, 200)
}

async function sessionHandler(req: PayloadRequest): Promise<Response> {
  const ip = clientIp(req.headers)
  const limited = hitReadLimit(ip, 'session', OTP_LIMITS.sessionPerIp, OTP_LIMITS.sessionWindowMs)
  if (limited) return limited
  const secret = env('PAYLOAD_SECRET') ?? ''
  const secure = isSecure(req)
  const session = readLeadSession(req.headers.get('cookie'), secret)
  const headers = new Headers()
  if (session.clear) headers.set('Set-Cookie', clearSessionCookie(secure))
  return json({ verified: session.verified }, 200, headers)
}

async function submitHandler(req: PayloadRequest): Promise<Response> {
  let data: Record<string, unknown> = {}
  if (typeof req.json !== 'function') {
    return json({ error: 'Sorry, we couldn’t read that form. Please try again.', code: 'invalid' }, 400)
  }
  try {
    const parsed = await req.json()
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return json({ error: 'Sorry, we couldn’t read that form. Please try again.', code: 'invalid' }, 400)
    }
    data = parsed as Record<string, unknown>
  } catch {
    return json({ error: 'Sorry, we couldn’t read that form. Please try again.', code: 'invalid' }, 400)
  }

  const secure = isSecure(req)
  const result = await acceptWebsiteLead({
    data,
    cookieHeader: req.headers.get('cookie'),
    ip: clientIp(req.headers),
    origin: req.headers.get('origin'),
    allowedOrigins: allowedOriginList(req.payload.config.cors),
    authkey: env('MSG91_AUTHKEY'),
    secret: env('PAYLOAD_SECRET') ?? '',
    secureCookie: secure,
    limiter,
    create: async (lead) => {
      const previous = req.user
      req.user = null
      req.context.leadOtpVerified = true
      try {
        return await req.payload.create({
          collection: 'enquiries',
          // The enquiry hook keeps only the public form fields and checks the rest.
          data: lead as never,
          overrideAccess: true,
          req,
        })
      } finally {
        req.user = previous
        req.context.leadOtpVerified = false
      }
    },
  })

  const headers = new Headers()
  if (result.setCookie) headers.set('Set-Cookie', result.setCookie)
  const retryAfter = retryAfterSeconds(result)
  if (retryAfter) headers.set('Retry-After', String(retryAfter))
  const body = { ...result.body }
  delete (body as { retryAfterSec?: number }).retryAfterSec
  return json(body, result.status, headers)
}

function hitReadLimit(ip: string, kind: string, limit: number, windowMs: number): Response | null {
  const key = `${kind}:ip:${ip}`
  const decision = overLimit(limiter, [{ key, rule: { limit, windowMs } }])
  if (!decision.ok) {
    return json(
      { error: 'Too many attempts. Please wait a few minutes and try again.', code: 'rate_limited' },
      429,
      { 'Retry-After': String(decision.retryAfterSec) },
    )
  }
  limiter.hit(key, windowMs)
  return null
}

function isSecure(req: PayloadRequest): boolean {
  const proto = req.headers.get('x-forwarded-proto')?.split(',')[0]?.trim()
  return proto === 'https'
}
