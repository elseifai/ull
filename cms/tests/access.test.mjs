// Role and registration checks against a running CMS: `node tests/access.test.mjs` (CMS_URL defaults to localhost:3000).
// Needs SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD in the environment (or cms/.env) for the group admin.
import fs from 'node:fs'

const env = Object.fromEntries(
  (fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : '').split('\n').filter((l) => /^\w+=/.test(l)).map((l) => [l.split('=')[0], l.slice(l.indexOf('=') + 1)]),
)
const BASE = (process.env.CMS_URL || 'http://localhost:3000') + '/api'
const ADMIN = { email: process.env.SEED_ADMIN_EMAIL || env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD || env.SEED_ADMIN_PASSWORD }
const PW = 'Test-pass-2026!'
const stamp = Date.now()

let pass = 0, fail = 0
const results = []
const check = (name, ok, detail = '') => {
  ok ? pass++ : fail++
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok || !detail ? '' : `  (${detail})`}`)
}

async function api(method, path, { token, body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `JWT ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  let json = null
  try { json = await res.json() } catch {}
  return { status: res.status, json }
}
const ok = (r) => r.status >= 200 && r.status < 300
const login = async (email, password) => (await api('POST', '/users/login', { body: { email, password } })).json?.token

const admin = await login(ADMIN.email, ADMIN.password)
if (!admin) { console.error('Could not sign in as the seed admin. Check SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD and run `npm run seed`.'); process.exit(1) }

// --- Staff registration (only the group admin creates accounts) ---
const roles = ['schoolAdmin', 'editor', 'counsellor', 'frontDesk']
const users = {}
for (const role of roles) {
  const email = `test-${role.toLowerCase()}-${stamp}@example.com`
  const r = await api('POST', '/users', { token: admin, body: { email, password: PW, name: `Test ${role}`, roles: [role] } })
  check(`admin registers a ${role}`, ok(r), r.status)
  users[role] = { id: r.json?.doc?.id, token: await login(email, PW) }
  check(`${role} can sign in`, Boolean(users[role].token))
}
const anonReg = await api('POST', '/users', { body: { email: `anon-${stamp}@example.com`, password: PW, name: 'x', roles: ['admin'] } })
check('public cannot self-register a staff account', !ok(anonReg), anonReg.status)
const counsellorReg = await api('POST', '/users', { token: users.counsellor.token, body: { email: `c-${stamp}@example.com`, password: PW, name: 'x', roles: ['counsellor'] } })
check('counsellor cannot create staff accounts', !ok(counsellorReg), counsellorReg.status)
const escalate = await api('PATCH', `/users/${users.counsellor.id}`, { token: users.counsellor.token, body: { roles: ['admin'] } })
const me = await api('GET', '/users/me', { token: users.counsellor.token })
check('counsellor cannot make themselves admin', !me.json?.user?.roles?.includes('admin'), JSON.stringify(me.json?.user?.roles))
const ownName = await api('PATCH', `/users/${users.counsellor.id}`, { token: users.counsellor.token, body: { name: 'Renamed counsellor' } })
check('staff can update their own profile', ok(ownName), ownName.status)

// --- Website form (public) ---
const pub = await api('POST', '/enquiries', { body: { type: 'visit', parentName: 'Test Parent', phone: '+91 98450 00000', childName: 'Test Child', grade: 'Grade 3', consent: true, stage: 'enrolled', notes: [{ note: 'injected' }] } })
check('website visit request is accepted', ok(pub), pub.status)
const pubId = pub.json?.doc?.id
const pubDoc = (await api('GET', `/enquiries/${pubId}`, { token: admin })).json
check('website cannot set stage or notes', pubDoc?.stage === 'visitBooked' && !(pubDoc?.notes?.length), `${pubDoc?.stage}, notes ${pubDoc?.notes?.length}`)
check('visit gets a pass code', Boolean(pubDoc?.visit?.passCode))
const anonRead = await api('GET', '/enquiries')
check('public cannot read enquiries', !ok(anonRead) || !anonRead.json?.docs?.length, anonRead.status)

// --- Matrix: what each role may do ---
const can = {
  // role:        [enqCreate, enqRead, enqUpdate, enqDelete, pageEdit, settingsEdit]
  admin:       [1, 1, 1, 1, 1, 1],
  schoolAdmin: [1, 1, 1, 0, 1, 1],
  editor:      [1, 0, 0, 0, 1, 1],
  counsellor:  [1, 1, 1, 0, 0, 0],
  frontDesk:   [1, 1, 1, 0, 0, 0],
}
const page = (await api('GET', '/pages?limit=1&where[slug][equals]=contact', { token: admin })).json?.docs?.[0]
const settings = (await api('GET', '/globals/site-settings', { token: admin })).json
for (const [role, [c, r, u, d, p, s]] of Object.entries(can)) {
  const token = role === 'admin' ? admin : users[role].token
  const e = await api('POST', '/enquiries', { token, body: { type: 'walkIn', parentName: `Walk-in by ${role}`, phone: '9845000001', childName: 'Kid', grade: 'LKG', consent: true } })
  check(`${role}: add a walk-in / enquiry`, ok(e) === !!c, e.status)
  const id = e.json?.doc?.id ?? pubId
  const list = await api('GET', '/enquiries?limit=5', { token })
  check(`${role}: ${r ? 'sees' : 'cannot see'} enquiries`, (ok(list) && list.json?.docs?.length > 0) === !!r, `${list.status}, ${list.json?.docs?.length ?? 0} rows`)
  const upd = await api('PATCH', `/enquiries/${pubId}`, {
    token,
    body: { stage: 'visited', followUpOn: new Date().toISOString(), notes: [{ note: `Called by ${role}` }], visit: { checkedInAt: new Date().toISOString(), visitors: 2 } },
  })
  if (u) {
    const after = (await api('GET', `/enquiries/${pubId}`, { token: admin })).json
    check(`${role}: edit stage, follow-up, notes, check-in`, ok(upd) && after?.stage === 'visited' && after?.notes?.some((n) => n.note === `Called by ${role}`) && after?.visit?.visitors === 2, `${upd.status} ${JSON.stringify(upd.json?.errors ?? '')}`)
    await api('PATCH', `/enquiries/${pubId}`, { token: admin, body: { stage: 'visitBooked' } })
  } else check(`${role}: cannot edit enquiries`, !ok(upd), upd.status)
  const del = await api('DELETE', `/enquiries/${id}`, { token })
  check(`${role}: ${d ? 'can' : 'cannot'} delete enquiries`, ok(del) === !!d, del.status)
  if (page) {
    const pe = await api('PATCH', `/pages/${page.id}?draft=true`, { token, body: { title: page.title } })
    check(`${role}: ${p ? 'can' : 'cannot'} edit website pages`, ok(pe) === !!p, pe.status)
  }
  const se = await api('POST', '/globals/site-settings', { token, body: { admissionsYear: settings?.admissionsYear ?? '' } })
  check(`${role}: ${s ? 'can' : 'cannot'} edit site settings`, ok(se) === !!s, se.status)
}

// --- Clean up ---
await api('DELETE', `/enquiries/${pubId}`, { token: admin })
await api('DELETE', `/enquiries?where[parentName][like]=Walk-in by`, { token: admin })
for (const role of roles) if (users[role].id) await api('DELETE', `/users/${users[role].id}`, { token: admin })

console.log(results.join('\n'))
console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
