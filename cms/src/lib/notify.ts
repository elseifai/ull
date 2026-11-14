import type { Payload } from 'payload'
import { env } from './env'

// One adapter for every channel. Providers are switched on by environment variables;
// without keys, messages are logged so the flow can be tested end to end.
//   Email:    SES via SES_REGION, SES_FROM (AWS credentials from the instance role)
//   SMS:      Gupshup via GUPSHUP_API_KEY, GUPSHUP_SENDER
//   WhatsApp: WATI via WATI_API_URL, WATI_TOKEN (approved template names below)

export type Message = {
  to: { phone?: string | null; email?: string | null; name?: string | null }
  template: 'enquiry_received' | 'visit_requested' | 'visit_confirmed' | 'visitor_arrived'
  params: Record<string, string>
  subject?: string
  text: string
}

const toE164India = (phone: string) => {
  const digits = phone.replace(/\D/g, '')
  return digits.length === 10 ? `91${digits}` : digits
}

async function sendWhatsApp(m: Message, payload: Payload) {
  const WATI_API_URL = env('WATI_API_URL')
  const WATI_TOKEN = env('WATI_TOKEN')
  if (!m.to.phone) return
  if (!WATI_API_URL || !WATI_TOKEN) return payload.logger.info(`[whatsapp:dry-run] ${m.template} → ${m.to.phone}`)
  const res = await fetch(`${WATI_API_URL}/api/v1/sendTemplateMessage?whatsappNumber=${toE164India(m.to.phone)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${WATI_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      template_name: m.template,
      broadcast_name: m.template,
      parameters: Object.entries(m.params).map(([name, value]) => ({ name, value })),
    }),
  })
  if (!res.ok) payload.logger.error(`WATI ${res.status}: ${await res.text()}`)
}

async function sendSms(m: Message, payload: Payload) {
  const GUPSHUP_API_KEY = env('GUPSHUP_API_KEY')
  const GUPSHUP_SENDER = env('GUPSHUP_SENDER')
  if (!m.to.phone) return
  if (!GUPSHUP_API_KEY || !GUPSHUP_SENDER) return payload.logger.info(`[sms:dry-run] ${m.template} → ${m.to.phone}`)
  const body = new URLSearchParams({ channel: 'sms', source: GUPSHUP_SENDER, destination: toE164India(m.to.phone), message: m.text })
  const res = await fetch('https://api.gupshup.io/sm/api/v1/msg', {
    method: 'POST',
    headers: { apikey: GUPSHUP_API_KEY, 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) payload.logger.error(`Gupshup ${res.status}: ${await res.text()}`)
}

async function sendEmail(m: Message, payload: Payload) {
  if (!m.to.email) return
  if (!env('SES_FROM')) return payload.logger.info(`[email:dry-run] ${m.template} → ${m.to.email}`)
  await payload.sendEmail({ to: m.to.email, subject: m.subject ?? 'ULL Auremont', text: m.text })
}

export async function notify(payload: Payload, m: Message, channels: ('whatsapp' | 'sms' | 'email')[] = ['whatsapp', 'email']) {
  const senders = { whatsapp: sendWhatsApp, sms: sendSms, email: sendEmail }
  await Promise.allSettled(channels.map((c) => senders[c](m, payload)))
}
