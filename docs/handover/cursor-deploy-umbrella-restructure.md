# Cursor task: deploy the ULL India umbrella restructure (uat, then prod)

You are deploying a change that is already written and tested locally but **not committed**. Do not redesign it. Your job: commit it, deploy it to uat, verify, deploy to prod, verify, then finish the two domain tasks at the end. Stop and report if any check fails.

AWS profile `ull-aws-cursor-vaibhav`, region `ap-south-1`. Deploys run through `deploy/rollout-stage.sh <uat|prod>` (also run by `.github/workflows/deploy.yml` on pushes to the `uat` and `prod` branches).

## What changed (context)

ULL India is now the umbrella site at `/`. The Auremont site moved under `/auremont/`, each campus lives at `/<brand>/<city>/<locality>/`, and ULL Global has a launching page.

| URL | Page |
|---|---|
| `/` | ULL India group home (new: `web/src/app/(site)/page.tsx`) |
| `/auremont/` | Auremont home (moved from `/`: `web/src/app/(site)/auremont/page.tsx`) |
| `/auremont/bengaluru/` | Auremont campuses in Bengaluru (`web/src/content/pages-group.ts`) |
| `/auremont/bengaluru/nagarbhavi/` | Campus page (`web/src/app/(site)/auremont/bengaluru/nagarbhavi/page.tsx`) |
| `/auremont/bengaluru/nagarbhavi/facilities/` | The old `/campus/` page |
| `/auremont/about/`, `/academics/…`, `/student-life/…`, `/admissions/…`, `/parents/` | Moved from the root |
| `/global/` | ULL Global, launching soon, waitlist form (enquiry mode `interest`) |
| `/contact/`, `/privacy/`, `/portal/` | Unchanged, group level |

Main files:
- `web/src/content/brands.ts`: group, brands, campuses, per-brand navigation. Header, footer, mobile bar and enquiry form read the brand from the URL.
- `web/src/lib/seo.ts`: Organization JSON-LD for the group, School JSON-LD on the campus page, brand breadcrumbs, brand page titles.
- `deploy/cloudfront-function.js`: 301s the old paths to the new ones, keeping the query string (UTM, gclid).
- `cms/src/migrations/20261028_120000_umbrella_paths.ts`: renames stored page slugs (pages and `_pages_v`), rewrites every `*href` column in the page tables, adds the `interest` enquiry mode enum value. It was tested on a scratch Postgres 16 database, both up and down.
- `cms/src/collections/Enquiries.ts`: confirmation messages say "ULL Global" for forms submitted on `/global/`.
- `cms/src/blocks/index.ts`, `web/src/editor/config.tsx`: the enquiry block gets the `interest` mode.
- Plans in `.cursor/plans/` (05, 16, 20, 23 and others) and staff documents in `docs/handover/`.

## How the CMS migration runs (read before deploying)

`cms/src/payload.config.ts` sets `prodMigrations: migrations`, so **the CMS applies pending migrations itself when the new container starts**. You do not run `payload migrate` by hand.

Order inside `rollout-stage.sh` (full deploy): build and push the CMS image → build the static site **from local content files** (`CMS_URL` is unset, so it does not pull from the CMS) → upload the site → restart the CMS on EC2 (the migration runs here).

The risk window: a **site-only** rebuild (`SITE_ONLY=true`, triggered when an editor publishes in the CMS) that runs after the new site is live but before the new CMS container is up would pull the old slugs (`about`, `academics/…`) and publish every Auremont page twice, at the old and the new path. So:
- Tell editors not to publish in the CMS during the deploy.
- After the deploy, confirm the migration ran (check below) **before** any site-only rebuild.

Do **not** run `npm run seed` on uat or prod. It overwrites CMS pages with the local content.
Do **not** run `payload migrate:down` on uat or prod. An older migration's `down` (`20261026_155548_cdn_media_and_private_files`) fails, so a batch rollback breaks partway.

## Step 1 · Pre-flight (local)

```bash
cd web && npx tsc --noEmit && CMS_URL= npm run build
cd ../cms && npx tsc --noEmit   # one known, unrelated error in tests/media-prefix.test.ts (.ts import extension) is expected
node -e "const f=require('fs').readFileSync('deploy/cloudfront-function.js','utf8');const h=new Function(f+';return handler')();for(const u of ['/about','/admissions/visit/','/campus/','/contact/','/global'])console.log(u,JSON.stringify(h({request:{uri:u,querystring:{utm_source:{value:'x'}}}})).slice(0,140))"
```

Expected from the last command: `/about` → 301 `/auremont/about/?utm_source=x`, `/admissions/visit/` → 301 `/auremont/admissions/visit/?utm_source=x`, `/campus/` → 301 `/auremont/bengaluru/nagarbhavi/facilities/?utm_source=x`, `/contact/` → served from `/contact/index.html`, `/global` → 301 `/global/?utm_source=x`.

## Step 2 · Commit

Branch from `main`, commit everything in the working tree, and open a PR to `main`. Include `web/next-env.d.ts` and `web/tsconfig.tsbuildinfo` only if they changed for real; otherwise restore them. Do not commit `.claude/`. Suggested message:

```
Make ULL India the umbrella site; move Auremont under /auremont/ with a Nagarbhavi campus page
```

After the PR is merged to `main`, fast-forward `uat` to `main`.

## Step 3 · Deploy uat

The CloudFront function is part of the CDK stack (`infra/lib/stage-stack.ts`, `PrettyUrls`). `rollout-stage.sh` does **not** run CDK, so the redirects need a CDK deploy:

```bash
cd infra && npx cdk diff UllUat     # expect only the PrettyUrls function code to change
npx cdk deploy UllUat
cd .. && bash deploy/rollout-stage.sh uat   # or push to the uat branch and let the workflow run
```

If `cdk diff` shows anything beyond the function code (for example certificates or distributions being replaced), stop and report.

## Step 4 · Verify uat

Base `https://uat.ullindia.com` (use the uat CloudFront hostname if the domain is not attached yet).

1. **Migration ran.** CMS logs show `Migrated: 20261028_120000_umbrella_paths`, or:
   ```sql
   select name from payload_migrations order by id desc limit 1;               -- 20261028_120000_umbrella_paths
   select slug from pages where slug !~ '^(auremont/|contact$|portal$|privacy$|global$)'; -- expect no rows
   ```
   Run SQL on the instance through SSM (`docker compose exec db psql -U ull ull_cms`); never open port 5432.
2. **Pages return 200** with the right `<title>`: `/` ("ULL India | …"), `/auremont/`, `/auremont/bengaluru/`, `/auremont/bengaluru/nagarbhavi/`, `/auremont/bengaluru/nagarbhavi/facilities/`, `/auremont/academics/foundational/`, `/global/`, `/contact/`.
3. **Redirects:** `curl -sI <base>/about/teachers/` gives 301 to `/auremont/about/teachers/`; same for `/admissions/visit/?utm_source=t` (query kept) and `/campus/`.
4. **No duplicates:** `<base>/sitemap.xml` has no URLs at the old root paths (`/academics/`, `/admissions/`, …).
5. **Site-only rebuild after the migration:** publish any page in the CMS (or run the workflow with "Rebuild the static site only") and repeat checks 2 and 4. This proves the CMS slugs were renamed.
6. **Forms:** submit the enquiry form on `/auremont/bengaluru/nagarbhavi/` and the waitlist form on `/global/`. Both create an Enquiry in `/admin` with the right `pageUrl`, and the Global confirmation says "ULL Global".
7. **Header switcher:** ULL India · ULL Auremont · ULL Global switches the logo, menu and main button. On `/global/` the button reads "Register interest".
8. **CMS editor:** an existing Auremont page opens in `/editor/` under its new slug, and the enquiry block offers "Register interest (not yet open)".

## Step 5 · Deploy and verify prod

Fast-forward `prod` to `uat`, then:

```bash
cd infra && npx cdk diff UllProd && npx cdk deploy UllProd
cd .. && bash deploy/rollout-stage.sh prod   # or push to the prod branch
```

Repeat the Step 4 checks on prod.

## Step 6 · Attach the real domains (DNS is now on Route 53)

The nameservers for `ullindia.com` now point to the `UllShared` Route 53 zone, and the Gmail MX records are kept (done 28 Oct). Plan 02's todo `attach-domains` is next:

```bash
cd infra && npx cdk diff -c attachDomains=true   # review certificates, aliases and the A/AAAA records
npx cdk deploy --all -c attachDomains=true
```

- Before deploying, confirm the zone still has the **MX, SPF, DKIM and Google verification records** for Gmail, and that this CDK change does not remove them. If they exist only in the console, add them to `infra/lib/shared-stack.ts` first so they live in code.
- After deploying, `https://uat.ullindia.com` and `https://ullindia.com` serve the sites with valid certificates, and `cdn.ullindia.com` and `cdn-uat.ullindia.com` serve media.
- Rebuild both stages afterwards (the site URL is read from the stack outputs).

## Step 7 · Canonical host and brand subdomain redirects

Add these 301 redirects, keeping the path and query string:
- `www.ullindia.com/*` → `https://ullindia.com/*`
- `auremont.ullindia.com/*` → `https://ullindia.com/auremont/*`
- `global.ullindia.com/*` → `https://ullindia.com/global/*`

Suggested implementation:
- Add `auremont.ullindia.com` and `global.ullindia.com` to the prod hosts in `infra/bin/ull.ts`. The prod certificate covers them, and the stage stack creates the alias records.
- In `deploy/cloudfront-function.js`, read `event.request.headers.host.value` **before** the path rules, and return the 301 for these three hosts.
- Keep the function under the CloudFront Functions size limit, and extend the Step 1 node check to send a `host` header.
- Deploy with `cdk diff` / `cdk deploy`, then `curl -sI` each host.

Mark plan 05's `url-map` todo `completed` and plan 02's `attach-domains` todo `completed` when done.

## Step 8 · Local dev server

On the developer Mac, a `next dev` server on port 4100 was stuck at 100% CPU (PID 34237 on 28 Oct). If `http://localhost:4100` does not respond, stop that process and run `npm --prefix web run dev` again. Do not change the port.

## Report back

When done, reply with:
- the PR link;
- the uat and prod deploy results;
- the output of each verification check, including the migration row and the sitemap check;
- the `cdk diff` summaries;
- anything you skipped and why.
