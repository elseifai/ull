# ULL Auremont: website, CMS and Admissions & Visitor Desk

```
web/      Public website. Next.js static export → S3 + CloudFront. Mobile-first, SEO-ready.
cms/      Payload CMS + API + Admissions & Visitor Desk (staff login at /admin). Runs on EC2.
deploy/   Scripts for S3/CloudFront publishing, the EC2 server and database backups.
```

See `../PLAN.md` for the full plan and `../ULL-Auremont-Content-Map.xlsx` for content still to be supplied.

## How it fits together

```
                    ullindia.com (CloudFront)
                   /                         \
   /*  →  S3 bucket (web/out)          /api/*, /admin*  →  EC2: cms (Payload) + Postgres
```

- Parents browse static pages (fast, Google-friendly). Forms post to `/api/enquiries`.
- Staff edit pages in `/admin`. Publishing calls `DEPLOY_HOOK_URL`, which rebuilds `web` (pulling content from the CMS) and syncs it to S3.

## Run locally

```bash
# 1. CMS (needs PostgreSQL; see cms/README.md)
cd cms && cp .env.example .env && npm install
npm run dev            # http://localhost:3000/admin
npm run seed           # first admin + website pages (once)

# 2. Website, in a second terminal
cd web && npm install
npm run dev            # http://localhost:4100  (page builder: http://localhost:4100/editor/)
CMS_URL=http://localhost:3000 npm run build   # static site from published CMS pages
```

## Editing pages

- **Page builder** (`/editor/` on the website, or "Edit visually in page builder" on a page in the CMS):
  drag blocks from the left onto the real page, click a block to edit its text, photos and colours on
  the right, switch between phone, tablet and desktop, then **Save draft** or **Publish**. Staff sign in
  with their CMS account; only Group admin, School admin and Content editor can edit.
- **Forms with Live Preview** (CMS → Website → Pages → a page → eye icon): the same content as forms,
  with the real page beside it updating as you type. The block picker shows a picture of each block.
- Both edit the same CMS record, so either can be used. Drafts stay private until published; publishing
  triggers the site rebuild. Block pictures come from `cd web && npm run thumbnails` (dev server running).

## Deploy (once the AWS account is ready)

1. **S3 + CloudFront (website)**: create a private S3 bucket, a CloudFront distribution with the bucket as default origin (Origin Access Control), attach `deploy/cloudfront-function.js` as a viewer-request function, an ACM certificate for `ullindia.com` (us-east-1), and Route 53 / DNS records.
2. **EC2 (CMS + API)**: a t3.small in ap-south-1 with Docker. Copy the repo, fill `cms/.env`, then `cd deploy && POSTGRES_PASSWORD=... docker compose up -d --build`. Add it to CloudFront as a second origin with behaviours for `/api/*` and `/admin*` (no caching, all headers/cookies forwarded).
3. **Publish the site**: `S3_BUCKET=... CLOUDFRONT_ID=... CMS_URL=https://ullindia.com deploy/deploy-web.sh`. Wire the same command to `DEPLOY_HOOK_URL` (for example a GitHub Actions `workflow_dispatch`) so CMS publishing updates the site.
4. **Backups**: schedule `deploy/backup-db.sh` nightly.
5. **Messaging**: verify the SES sender domain, create Gupshup and WATI templates (`enquiry_received`, `visit_requested`, `visit_confirmed`, `visitor_arrived`) and add the keys to `cms/.env`.
6. **Google**: add the site to Search Console and submit `https://ullindia.com/sitemap.xml`; create the Google Business Profile.
