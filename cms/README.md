# ULL CMS, API and Admissions & Visitor Desk

Payload 3 (Next.js) + PostgreSQL. Staff sign in at `/admin`.

- **Admissions & Visitors**: every website enquiry, visit request, walk-in and call; pipeline stages, follow-ups, notes, visit pass codes.
- **Pages**: the website's content as blocks (same shapes as `web/src/content`). Publishing triggers a site rebuild.
- **Site settings**: phone, WhatsApp, email, address, affiliation, social links.
- **Users**: staff with roles (Group admin, School admin, Content editor, Admissions counsellor, Front desk).

## Run locally

```bash
cp .env.example .env        # set PAYLOAD_SECRET and SEED_ADMIN_PASSWORD
npm install
npm run db                  # Postgres on localhost:5432 (needs Docker Desktop)
npm run dev                 # http://localhost:3000/admin
npm run seed                # first admin + all website pages (run once, with dev running or stopped)
```

`DATABASE_URL` must point at a Postgres you can reach. The `db` host only exists inside
`deploy/docker-compose.yml` on the server; locally it causes "cannot connect to Postgres:
ENOTFOUND db" and an `unhandledRejection` in the admin.
```

## Tests

With the CMS running (`npm run dev`) and seeded, `npm test` registers one staff account per role, checks what each role can and cannot do (admissions, pages, settings, staff accounts), checks the website form cannot set staff-only fields, then removes its test data.

| Role | Admissions & Visitors | Website pages, media, settings | Staff accounts |
|---|---|---|---|
| Group admin | everything, incl. delete | yes | create and edit |
| School admin | add, edit | yes | own profile |
| Content editor | add only (no list) | yes | own profile |
| Admissions counsellor | add, edit | hidden | own profile |
| Front desk | add, edit | hidden | own profile |

Messaging (SES email, Gupshup SMS, WATI WhatsApp) is in `src/lib/notify.ts`. Without keys it logs instead of sending.

After changing collections, create a migration: `npx payload migrate:create <name>`. Production runs pending migrations on start.
