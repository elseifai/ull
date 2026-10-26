---
name: 13 CDN for all media uploads and references
overview: Every upload and every media reference is stored in that stage's S3 bucket and served from its CloudFront CDN (cdn.ullindia.com / cdn-uat.ullindia.com) under content-hashed, immutable URLs. Private files (documents, recordings, reports) go to a separate private bucket with signed URLs. Most of this is already built but uncommitted on main. 26 Oct – 6 Nov 2026.
todos:
  - id: commit
    content: Commit storage.ts, media-prefix.ts, the two media migrations, publish-assets.mjs and cdn-assets.json, with the media-prefix test
    status: pending
  - id: backfill
    content: Backfill existing local uploads to S3 under hashed prefixes and rewrite stored URLs
    status: pending
  - id: references
    content: Make every media reference (blocks, rich text, SEO OG image, News, Faculty) resolve through publicMediaUrl
    status: pending
  - id: image-pipeline
    content: Generate AVIF/WebP sizes on upload, enforce size limits, and strip EXIF location data
    status: pending
  - id: video
    content: Decide video hosting (YouTube embed by default; S3 + CloudFront for short loops)
    status: pending
  - id: private
    content: Route private uploads (applicant documents, recordings, reports, portfolios) to the private bucket with presigned URLs
    status: pending
  - id: checks
    content: Add a build check that fails if any page references a non-CDN media URL
    status: pending
isProject: false
---

# 13 · CDN for all uploads

## Status today (from the working tree)

| Piece | File | State |
|---|---|---|
| S3 upload adapter that writes to the stage media bucket and returns CDN URLs | `cms/src/lib/storage.ts` | written, uncommitted |
| Content-hash prefix `media/<8 hex>/` | `cms/src/lib/media-prefix.ts` + `cms/tests/media-prefix.test.ts` | written, uncommitted |
| DB migrations for the prefix and object key | `cms/src/migrations/20261023_*` | written, uncommitted |
| Site assets (`web/public/assets`) uploaded as `assets/<hash>/<name>` with a manifest | `deploy/publish-assets.mjs`, `web/src/content/cdn-assets.json` | written, uncommitted |
| CDN distribution with 1-year immutable caching | `infra/lib/stage-stack.ts` | deployed |
| Local dev falls back to disk when `S3_BUCKET`/`CDN_HOST` are unset | `storage.ts` | written |

Design (from `.cursor/plans/aws_three_environments_fc853ca1.plan.md`): replacing a photo writes a new hash and a new URL; old objects stay so pages still pointing at them keep working; S3 versioning is on.

## Remaining work

### 1. Commit and roll out

- Commit the files above, run migrations on UAT, upload a test image, and confirm the URL is `https://cdn-uat.ullindia.com/media/<hash>/<file>` and that the response has `Cache-Control: public, max-age=31536000, immutable`.
- Promote to prod.

### 2. Backfill

One-time script `deploy/backfill-media.mjs`: for each `media` doc whose file is on local disk, hash it, upload all sizes under the prefix, update `prefix`/object key, and verify with a HEAD request. Dry-run mode first. Then `web` is rebuilt so pages point at the CDN.

### 3. Every reference goes through one function

All places that render media must call `publicMediaUrl()` (or read the stored `url`, which already holds the CDN URL):

- Page hero, `text`, `gallery`, `cta`, `cards` blocks.
- Rich text (Lexical) upload nodes.
- SEO OG image and JSON-LD `image`/`logo`.
- New collections in plans 07, 10, 16 (News, Events, Faculty, Testimonials, Downloads).
- `web/src/content/assets.ts` for brand files via `cdn-assets.json`.

**Build check:** after `next build`, scan `web/out/**/*.html` for `src=`/`href=` pointing at `/media/` or the EC2 origin and fail the deploy if any are found.

### 4. Image pipeline

- On upload (Payload `imageSizes` + sharp): `thumb 400`, `card 800`, `hero 1600`, `og 1200×630`, each as WebP and AVIF; original kept.
- Limits: images ≤ 10 MB upload, auto-compressed; reject < 800 px wide for hero use.
- Strip EXIF (especially GPS) for privacy, keep orientation.
- `<picture>` with AVIF → WebP → JPEG fallback and `width`/`height` to avoid layout shift.
- Alt text required (plan 07).

### 5. Documents and downloads (public)

Brochures and fee sheets (PDF) go to the media bucket under `docs/<hash>/<name>.pdf` and are served from the CDN. If they are gated behind a form (plan 07 `downloads`), the page shows the form first and then reveals the CDN link; the link is not secret, which is acceptable for brochures.

### 6. Video

| Type | Where |
|---|---|
| Walkthrough, brand film, stories, aftermovies | YouTube (free hosting, reach, SEO); embed with a lightweight facade (thumbnail first, player on click) to protect LCP |
| Short silent loops (hero background, 5–10 s) | MP4/WebM in the media bucket via CDN, ≤ 3 MB, `preload="none"` on mobile |

### 7. Private files (never on the public CDN)

| File | Bucket | Access |
|---|---|---|
| Applicant documents (birth certificate, TC, report cards) | Private documents bucket (plan 02) | Presigned GET, 5 min, after a role check |
| Counselling recordings and transcripts (plans 06, 21) | Private | Counsellor, School admin |
| Psychometric reports (plan 20) | Private | Family + counsellor |
| Student portfolio uploads (plan 10) | Private | Student, parents, teachers |

A separate Payload upload collection `privateFiles` with `disablePayloadAccessControl: false`, so every download passes access checks.

## Acceptance

- No HTML page in `web/out` references media outside the CDN host.
- Replacing an image changes its URL, and the old URL still returns 200.
- Images are served as AVIF/WebP with long cache headers.
- Private files return 403 without a valid presigned URL.
