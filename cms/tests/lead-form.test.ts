import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { LeadSubmitError } from '../../web/src/lib/lead-submit-error'
import { OTP_PROVIDER_SCRIPTS, ensureOtpProvider, launchMsg91Otp, widgetConfiguration, widgetIdentifier } from '../../web/src/lib/msg91-widget'
import { submitLead } from '../../web/src/lib/submit-lead'

function jwt(payload: Record<string, unknown> = { exp: 4_000_000_000 }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${header}.${body}.signature-value-not-checked`
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

const form = { parentName: 'Ada', phone: '98450 00000', childName: 'Anu', grade: 'Grade 1', consent: true, type: 'enquiry' }

describe('shared form submit', () => {
  it('skips a new OTP when the session is already verified and still posts with the cookie', async () => {
    const launches: unknown[] = []
    const posts: { url: string; credentials?: RequestCredentials; body: Record<string, unknown> }[] = []
    const fetchImpl: typeof fetch = async (url, init) => {
      const href = String(url)
      if (href.endsWith('/otp/session')) {
        assert.equal(init?.credentials, 'include')
        return jsonResponse({ verified: true })
      }
      posts.push({ url: href, credentials: init?.credentials, body: JSON.parse(String(init?.body)) })
      return jsonResponse({ ok: true })
    }
    await submitLead(form, {
      apiUrl: 'http://cms.test/api',
      fetch: fetchImpl,
      launchOtp: async (identifier) => {
        launches.push(identifier)
        return jwt()
      },
    })
    assert.deepEqual(launches, [])
    assert.equal(posts.length, 1)
    assert.equal(posts[0].url, 'http://cms.test/api/otp/submit')
    assert.equal(posts[0].credentials, 'include')
    assert.equal(posts[0].body.accessToken, undefined)
    assert.equal(posts[0].body.phone, form.phone)
    assert.equal(posts[0].body.parentName, 'Ada')
  })

  it('runs OTP once when there is no session and sends that token with the form', async () => {
    const token = jwt()
    const posts: Record<string, unknown>[] = []
    const fetchImpl: typeof fetch = async (url, init) => {
      if (String(url).endsWith('/otp/session')) return jsonResponse({ verified: false })
      posts.push(JSON.parse(String(init?.body)))
      return jsonResponse({ ok: true })
    }
    await submitLead(form, {
      apiUrl: 'http://cms.test/api/',
      fetch: fetchImpl,
      launchOtp: async (identifier) => {
        assert.equal(identifier, '919845000000')
        return token
      },
    })
    assert.equal(posts.length, 1)
    assert.equal(posts[0].accessToken, token)
    assert.equal(posts[0].website, undefined)
  })

  it('asks for OTP again when the server rejects the stored token, then submits the new one', async () => {
    const token = jwt({ exp: 4_000_000_000, fresh: true })
    let submits = 0
    const bodies: Record<string, unknown>[] = []
    const fetchImpl: typeof fetch = async (url, init) => {
      if (String(url).endsWith('/otp/session')) return jsonResponse({ verified: true })
      submits += 1
      const body = JSON.parse(String(init?.body)) as Record<string, unknown>
      bodies.push(body)
      if (submits === 1) return jsonResponse({ error: 'Your verification has expired. Please verify your mobile number again.', code: 'otp_expired' }, 401)
      return jsonResponse({ ok: true })
    }
    let launches = 0
    await submitLead(form, {
      apiUrl: 'http://cms.test/api',
      fetch: fetchImpl,
      launchOtp: async () => {
        launches += 1
        return token
      },
    })
    assert.equal(launches, 1)
    assert.equal(bodies[0].accessToken, undefined)
    assert.equal(bodies[1].accessToken, token)
  })

  it('surfaces the rate-limit error and does not start another OTP', async () => {
    let launches = 0
    const fetchImpl: typeof fetch = async (url) => {
      if (String(url).endsWith('/otp/session')) return jsonResponse({ verified: true })
      return jsonResponse({ error: 'Too many attempts. Please wait a few minutes and try again.', code: 'rate_limited' }, 429)
    }
    await assert.rejects(
      () =>
        submitLead(form, {
          apiUrl: 'http://cms.test/api',
          fetch: fetchImpl,
          launchOtp: async () => {
            launches += 1
            return jwt()
          },
        }),
      (err: unknown) => {
        assert.ok(err instanceof LeadSubmitError)
        assert.equal(err.code, 'rate_limited')
        assert.equal(err.message, 'Too many attempts. Please wait a few minutes and try again.')
        return true
      },
    )
    assert.equal(launches, 0)
  })
})

describe('MSG91 widget', () => {
  it('loads the official script and falls back to phone91', async () => {
    const loaded: string[] = []
    let started = false
    await ensureOtpProvider(async (src) => {
      loaded.push(src)
      if (src.includes('phone91')) started = true
      else throw new Error('blocked')
    }, () => started)
    assert.deepEqual(loaded, [...OTP_PROVIDER_SCRIPTS])
  })

  it('does not load the fallback when the first script starts', async () => {
    const loaded: string[] = []
    await ensureOtpProvider(async (src) => {
      loaded.push(src)
    }, () => loaded.length > 0)
    assert.deepEqual(loaded, [OTP_PROVIDER_SCRIPTS[0]])
  })

  it('builds the widget configuration from widgetId and tokenAuth only', () => {
    const token = jwt()
    let received = ''
    const config = widgetConfiguration({
      widgetId: 'widget-1',
      tokenAuth: 'token-auth-1',
      identifier: '919845000000',
      onSuccess: (value) => {
        received = value
      },
      onFailure: () => {},
    })
    assert.equal(config.widgetId, 'widget-1')
    assert.equal(config.tokenAuth, 'token-auth-1')
    assert.equal(config.identifier, '919845000000')
    assert.equal('authkey' in config, false)
    assert.equal(config.exposeMethods, undefined)
    config.success({ token })
    assert.equal(received, token)
    config.success({ message: token })
    config.success({ data: { 'access-token': token } })
    assert.equal(widgetIdentifier({ phone: '+91 98450 00000' }), '919845000000')
  })

  it('calls initSendOTP with the server config and returns the callback token', async () => {
    const token = jwt()
    let seen: { widgetId?: string; tokenAuth?: string; identifier?: string; authkey?: string } | undefined
    const value = await launchMsg91Otp('919845000000', {
      apiUrl: 'http://cms.test/api',
      fetch: async (url, init) => {
        assert.equal(String(url), 'http://cms.test/api/otp/config')
        assert.equal(init?.credentials, 'include')
        return jsonResponse({ widgetId: 'widget-1', tokenAuth: 'token-auth-1' })
      },
      ensureProvider: async () => {},
      initSendOTP: (config) => {
        seen = config
        config.success({ token })
      },
    })
    assert.equal(value, token)
    assert.equal(seen?.widgetId, 'widget-1')
    assert.equal(seen?.tokenAuth, 'token-auth-1')
    assert.equal(seen?.identifier, '919845000000')
    assert.equal(seen?.authkey, undefined)
  })

  it('does not pass widget failure details that might contain a token', async () => {
    const token = jwt()
    await assert.rejects(
      () =>
        launchMsg91Otp(undefined, {
          apiUrl: 'http://cms.test/api',
          fetch: async () => jsonResponse({ widgetId: 'widget-1', tokenAuth: 'token-auth-1' }),
          ensureProvider: async () => {},
          initSendOTP: (config) => config.failure({ accessToken: token, message: token }),
        }),
      (err: unknown) => {
        assert.ok(err instanceof LeadSubmitError)
        assert.equal(err.message, 'Verification was cancelled. Please try again.')
        assert.equal(err.message.includes(token), false)
        return true
      },
    )
  })
})
