import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { APIError } from 'payload'
import { Enquiries } from '../src/collections/Enquiries'
import { acceptWebsiteLead, readLeadSession, retryAfterSeconds } from '../src/lib/otp/gate'
import { MSG91_VERIFY_URL, widgetClientConfig } from '../src/lib/otp/msg91'
import { SlidingRateLimiter } from '../src/lib/otp/rate-limit'
import { openSession, readCookie, sealSession, OTP_COOKIE } from '../src/lib/otp/session'

const SECRET = 'test-payload-secret'
const AUTH = 'test-authkey-not-a-real-key'
const ORIGIN = 'http://localhost:4100'

function jwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${header}.${body}.signature-value-not-checked`
}

function futureExp(seconds = 3600): number {
  return Math.floor(Date.now() / 1000) + seconds
}

const lead = {
  parentName: 'Ada',
  phone: '9845000000',
  email: 'ada@example.com',
  childName: 'Anu',
  grade: 'Grade 1',
  consent: true,
  type: 'enquiry',
  utmSource: 'parking',
  utmContent: 'parking_gate_1',
}

function msg91Fetch(decide: (token: string) => { status?: number; json: unknown } | 'timeout') {
  const calls: { url: string; authkey: string; token: string; contentType: string | null }[] = []
  const fetchImpl: typeof fetch = (url, init) => {
    const body = JSON.parse(String(init?.body)) as { authkey: string; 'access-token': string }
    const headers = new Headers(init?.headers)
    calls.push({
      url: String(url),
      authkey: body.authkey,
      token: body['access-token'],
      contentType: headers.get('content-type'),
    })
    const result = decide(body['access-token'])
    if (result === 'timeout') {
      return new Promise((_resolve, reject) => {
        const signal = init?.signal
        if (!signal) {
          reject(new Error('expected a timeout signal'))
          return
        }
        if (signal.aborted) reject(new Error('aborted'))
        signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })))
      })
    }
    return Promise.resolve(new Response(JSON.stringify(result.json), { status: result.status ?? 200 }))
  }
  return { fetchImpl, calls }
}

function harness(extra?: Partial<Parameters<typeof acceptWebsiteLead>[0]>) {
  const created: Record<string, unknown>[] = []
  const { fetchImpl, calls } = msg91Fetch(() => ({ json: { type: 'success', message: '919845000000' } }))
  const input: Parameters<typeof acceptWebsiteLead>[0] = {
    data: { ...lead },
    cookieHeader: null,
    ip: '203.0.113.5',
    origin: ORIGIN,
    allowedOrigins: [ORIGIN],
    authkey: AUTH,
    secret: SECRET,
    secureCookie: true,
    limiter: new SlidingRateLimiter(),
    fetchImpl,
    create: async (data) => {
      created.push(data)
      return { id: created.length }
    },
    ...extra,
  }
  return { input, created, calls, fetchImpl }
}

function cookieHeader(setCookie: string | undefined): string {
  assert.ok(setCookie, 'expected a session cookie')
  return setCookie.split(';')[0]
}

describe('MSG91 lead gate', () => {
  it('verifies the widget token and only then creates the CRM lead', async () => {
    const token = jwt({ exp: futureExp() })
    const { input, created, calls } = harness()
    input.data = { ...lead, accessToken: token, website: '' }
    const result = await acceptWebsiteLead(input)
    assert.equal(result.status, 200)
    assert.deepEqual(result.body, { ok: true })
    assert.equal(created.length, 1)
    assert.equal(created[0].parentName, 'Ada')
    assert.equal(created[0].utmSource, 'parking')
    assert.equal(created[0].accessToken, undefined)
    assert.equal(JSON.stringify(created).includes(token), false)
    assert.equal(JSON.stringify(result.body).includes(AUTH), false)
    assert.equal(calls.length, 1)
    assert.equal(calls[0].url, MSG91_VERIFY_URL)
    assert.equal(calls[0].authkey, AUTH)
    assert.equal(calls[0].token, token)
    assert.equal(calls[0].contentType, 'application/json')
    const sealed = readCookie(cookieHeader(result.setCookie), OTP_COOKIE)
    assert.equal(openSession(sealed ?? '', SECRET)?.token, token)
  })

  it('does not create a lead when the token is missing', async () => {
    const { input, created, calls } = harness()
    const result = await acceptWebsiteLead(input)
    assert.equal(result.status, 401)
    assert.equal(result.body.code, 'otp_required')
    assert.equal(created.length, 0)
    assert.equal(calls.length, 0)
  })

  it('does not create a lead when MSG91 rejects the token', async () => {
    const token = jwt({ exp: futureExp() })
    const seen = msg91Fetch(() => ({ status: 200, json: { type: 'error', message: 'invalid' } }))
    const { input, created } = harness({ fetchImpl: seen.fetchImpl, data: { ...lead, accessToken: token } })
    const result = await acceptWebsiteLead(input)
    assert.equal(result.status, 401)
    assert.equal(result.body.code, 'otp_invalid')
    assert.match(String(result.body.error), /didn’t work/)
    assert.equal(created.length, 0)
    assert.equal(seen.calls.length, 1)
    assert.match(result.setCookie ?? '', /Max-Age=0/)
  })

  it('does not create a lead when verification times out', async () => {
    const token = jwt({ exp: futureExp() })
    const seen = msg91Fetch(() => 'timeout')
    const { input, created } = harness({ fetchImpl: seen.fetchImpl, data: { ...lead, accessToken: token }, timeoutMs: 20 })
    const result = await acceptWebsiteLead(input)
    assert.equal(result.status, 503)
    assert.equal(result.body.code, 'otp_unavailable')
    assert.equal(created.length, 0)
  })

  it('rejects an expired token without calling MSG91 or the CRM', async () => {
    const token = jwt({ exp: Math.floor(Date.now() / 1000) - 30 })
    const { input, created, calls } = harness({ data: { ...lead, accessToken: token } })
    const result = await acceptWebsiteLead(input)
    assert.equal(result.status, 401)
    assert.equal(result.body.code, 'otp_expired')
    assert.equal(created.length, 0)
    assert.equal(calls.length, 0)
  })

  it('reuses a still-valid token for another form and still checks it with MSG91', async () => {
    const token = jwt({ exp: futureExp() })
    const seen = msg91Fetch(() => ({ json: { type: 'success', message: '919845000000' } }))
    const { input, created } = harness({ fetchImpl: seen.fetchImpl, limits: { successPerPhone: 2 } })
    const first = await acceptWebsiteLead({ ...input, data: { ...lead, accessToken: token, type: 'enquiry' } })
    assert.equal(first.status, 200)
    const second = await acceptWebsiteLead({
      ...input,
      data: { ...lead, type: 'visit', childName: 'Bea' },
      cookieHeader: cookieHeader(first.setCookie),
    })
    assert.equal(second.status, 200)
    assert.equal(second.body.ok, true)
    assert.equal(created.length, 2)
    assert.equal(created[1].type, 'visit')
    assert.equal(created[1].childName, 'Bea')
    assert.equal(created[1].accessToken, undefined)
    assert.equal(seen.calls.length, 2)
    assert.equal(seen.calls[0].token, token)
    assert.equal(seen.calls[1].token, token)
    const third = await acceptWebsiteLead({
      ...input,
      data: { ...lead, type: 'enquiry' },
      cookieHeader: cookieHeader(second.setCookie),
    })
    assert.equal(third.status, 429)
    assert.equal(third.body.code, 'rate_limited')
    assert.equal(third.body.error, 'Too many attempts. Please wait a few minutes and try again.')
    assert.ok((retryAfterSeconds(third) ?? 0) > 0)
    assert.equal(created.length, 2)
    assert.equal(seen.calls.length, 2)
  })

  it('rate limits invalid tokens per IP before they can reach the CRM', async () => {
    const seen = msg91Fetch(() => ({ status: 401, json: { type: 'error' } }))
    const { input, created } = harness({ fetchImpl: seen.fetchImpl, limits: { failurePerIp: 2 } })
    for (let i = 0; i < 2; i++) {
      const result = await acceptWebsiteLead({ ...input, data: { ...lead, accessToken: jwt({ exp: futureExp(), n: i }) } })
      assert.equal(result.status, 401)
    }
    const blocked = await acceptWebsiteLead({ ...input, data: { ...lead, accessToken: jwt({ exp: futureExp(), n: 3 }) } })
    assert.equal(blocked.status, 429)
    assert.equal(blocked.body.error, 'Too many attempts. Please wait a few minutes and try again.')
    assert.equal(created.length, 0)
    assert.equal(seen.calls.length, 2)
  })

  it('limits each phone separately from the shared IP budget', async () => {
    const seen = msg91Fetch(() => ({ json: { type: 'success', message: 'verified' } }))
    const { input, created } = harness({ fetchImpl: seen.fetchImpl, limits: { successPerPhone: 1, successPerIp: 5 } })
    const first = await acceptWebsiteLead({ ...input, data: { ...lead, accessToken: jwt({ exp: futureExp(), who: 'ada' }) } })
    const again = await acceptWebsiteLead({ ...input, data: { ...lead, accessToken: jwt({ exp: futureExp(), who: 'ada2' }) } })
    const other = await acceptWebsiteLead({
      ...input,
      data: { ...lead, phone: '9999999999', accessToken: jwt({ exp: futureExp(), who: 'other' }) },
    })
    assert.equal(first.status, 200)
    assert.equal(again.status, 429)
    assert.equal(other.status, 200)
    assert.equal(created.length, 2)
  })

  it('rejects a token that belongs to a different number', async () => {
    const seen = msg91Fetch(() => ({ json: { type: 'success', message: '919999999999' } }))
    const { input, created } = harness({ fetchImpl: seen.fetchImpl, data: { ...lead, accessToken: jwt({ exp: futureExp() }) } })
    const result = await acceptWebsiteLead(input)
    assert.equal(result.status, 401)
    assert.equal(result.body.code, 'otp_mismatch')
    assert.equal(created.length, 0)
  })

  it('refuses to run when the AuthKey is not configured', async () => {
    const { input, created, calls } = harness({ authkey: '  ', data: { ...lead, accessToken: jwt({ exp: futureExp() }) } })
    const result = await acceptWebsiteLead(input)
    assert.equal(result.status, 503)
    assert.equal(result.body.code, 'otp_unavailable')
    assert.equal(created.length, 0)
    assert.equal(calls.length, 0)
  })

  it('ignores a filled honeypot and a foreign origin', async () => {
    const { input, created, calls } = harness()
    const honeypot = await acceptWebsiteLead({ ...input, data: { ...lead, website: 'https://spam.example' } })
    assert.equal(honeypot.status, 200)
    const foreign = await acceptWebsiteLead({ ...input, data: { ...lead, accessToken: jwt({ exp: futureExp() }) }, origin: 'https://evil.example' })
    assert.equal(foreign.status, 403)
    assert.equal(foreign.body.code, 'forbidden')
    assert.equal(created.length, 0)
    assert.equal(calls.length, 0)
  })

  it('exposes only the widget id and tokenAuth to the browser', () => {
    const config = widgetClientConfig({ widgetId: 'widget-1', tokenAuth: 'token-auth-1' })
    assert.deepEqual(config, { widgetId: 'widget-1', tokenAuth: 'token-auth-1' })
    assert.equal(widgetClientConfig({ widgetId: '', tokenAuth: 'x' }), null)
    assert.equal(JSON.stringify(config).includes('authkey'), false)
  })

  it('treats a sealed session as verified until the token expires', async () => {
    const token = jwt({ exp: futureExp() })
    const { input } = harness({ data: { ...lead, accessToken: token } })
    const result = await acceptWebsiteLead(input)
    assert.deepEqual(readLeadSession(cookieHeader(result.setCookie), SECRET), { verified: true, clear: false })
    const expiredAt = Math.floor(Date.now() / 1000) - 5
    const sealed = sealSession({ token: jwt({ exp: expiredAt }), exp: expiredAt }, SECRET)
    assert.deepEqual(readLeadSession(`${OTP_COOKIE}=${encodeURIComponent(sealed)}`, SECRET), { verified: false, clear: true })
  })
})

describe('public enquiry hook', () => {
  const hook = Enquiries.hooks?.beforeValidate?.[0]
  if (typeof hook !== 'function') throw new Error('enquiry beforeValidate hook missing')

  const form = {
    type: 'visit',
    stage: 'enrolled',
    notes: [{ note: 'injected' }],
    parentName: 'Test Parent',
    phone: '+91 98450 00000',
    childName: 'Test Child',
    grade: 'Grade 3',
    consent: true,
    pageUrl: '/reimagining-education/?utm_source=parking&utm_content=parking_gate_1',
    utmSource: 'parking',
    utmMedium: 'qr',
    utmCampaign: 'auremont_202611_reimagining',
    utmContent: 'parking_gate_1',
    utmTerm: 'nagarbhavi',
    accessToken: 'should-not-be-stored',
  }

  it('rejects an anonymous lead that has not passed OTP', () => {
    assert.throws(
      () => hook({ data: { ...form }, operation: 'create', req: { user: null, context: {} } } as never),
      (err: unknown) => err instanceof APIError && err.status === 401,
    )
  })

  it('keeps the public fields, campaign, and visit pass after OTP', () => {
    const data = hook({
      data: { ...form },
      operation: 'create',
      req: { user: null, context: { leadOtpVerified: true } },
    } as never) as Record<string, unknown>
    assert.equal(data.stage, 'visitBooked')
    assert.equal(data.notes, undefined)
    assert.equal(data.accessToken, undefined)
    assert.equal(data.utmSource, 'parking')
    assert.equal(data.utmContent, 'parking_gate_1')
    assert.equal(data.utmCampaign, 'auremont_202611_reimagining')
    assert.equal(data.phone, '+919845000000')
    assert.equal(data.type, 'visit')
    const visit = data.visit as { passCode?: string }
    assert.match(visit.passCode ?? '', /^[A-Z0-9]{1,6}$/)
  })

  it('still lets staff record a walk-in without OTP', () => {
    const data = hook({
      data: { type: 'walkIn', stage: 'enrolled', parentName: 'Desk', phone: '9845000001', childName: 'Kid', grade: 'LKG', consent: true },
      operation: 'create',
      req: { user: { id: 1 }, context: {} },
    } as never) as Record<string, unknown>
    assert.equal(data.stage, 'enrolled')
    assert.equal(data.type, 'walkIn')
  })
})
