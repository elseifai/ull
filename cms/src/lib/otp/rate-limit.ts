// Sliding-window counters for OTP verification and website lead submission.
// Keys are per IP and per phone/email. A still-valid token may be reused across
// forms until these limits are reached.

export type LimitRule = { limit: number; windowMs: number }

export const OTP_LIMITS = {
  // Successful CRM submits. A parent can send the enquiry and the visit form,
  // and retry a couple of times, without being blocked.
  successPerIp: 30,
  successPerPhone: 8,
  successPerEmail: 8,
  successWindowMs: 60 * 60 * 1000,
  // Missing, expired, or rejected tokens.
  failurePerIp: 10,
  failurePerPhone: 8,
  failurePerEmail: 8,
  failureWindowMs: 15 * 60 * 1000,
  sessionPerIp: 120,
  sessionWindowMs: 10 * 60 * 1000,
  configPerIp: 60,
  configWindowMs: 10 * 60 * 1000,
}

export class SlidingRateLimiter {
  private buckets = new Map<string, number[]>()

  constructor(private now: () => number = Date.now) {}

  private live(key: string, windowMs: number): number[] {
    const now = this.now()
    const hits = (this.buckets.get(key) ?? []).filter((at) => now - at < windowMs)
    if (hits.length) this.buckets.set(key, hits)
    else this.buckets.delete(key)
    return hits
  }

  count(key: string, windowMs: number): number {
    return this.live(key, windowMs).length
  }

  hit(key: string, windowMs: number): void {
    const hits = this.live(key, windowMs)
    hits.push(this.now())
    this.buckets.set(key, hits)
  }

  retryAfter(key: string, windowMs: number): number {
    const hits = this.live(key, windowMs)
    if (!hits.length) return 1
    return Math.max(1, Math.ceil((hits[0] + windowMs - this.now()) / 1000))
  }
}

export function phoneRateKey(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 15) return null
  return digits.slice(-10)
}

export function emailRateKey(email: string): string | null {
  const value = email.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return null
  return value.slice(0, 200)
}

export type RateDecision =
  | { ok: true }
  | { ok: false; retryAfterSec: number }

/** Read-only check. Callers record a hit only after the attempt's outcome is known. */
export function overLimit(
  limiter: SlidingRateLimiter,
  checks: { key: string; rule: LimitRule }[],
): RateDecision {
  let retryAfterSec = 0
  for (const { key, rule } of checks) {
    if (limiter.count(key, rule.windowMs) >= rule.limit) {
      retryAfterSec = Math.max(retryAfterSec, limiter.retryAfter(key, rule.windowMs))
    }
  }
  return retryAfterSec > 0 ? { ok: false, retryAfterSec } : { ok: true }
}
