# ULL India — IT support and developer guide

Technical source of truth for the website, the Admissions & Visitor Desk, and the AWS stacks. Facts below were checked against this repository on 2026-11-13. Where a plan file describes a target that the code does not implement, this guide follows the code.

Update this file in every pull request, or say in the PR why it did not change. Sister document for non-technical staff: `docs/business-ops.md`. Session brief for the assistant: `docs/ullindia-agent-summary.md`.

## Architecture

```
                         CloudFront (site distribution)
                        /                              \
   /*  (default)        S3 site bucket                  /api/*  /admin*  /_next/*
   viewer-request       private, OAC                    EC2 :3000  HTTP
   pretty-URL function                                  Payload CMS + Postgres 16
                                                        media and private files → S3
                         CloudFront (CDN distribution)
                        /
                        S3 media bucket (public images only)
```

| Path | What it is |
|---|---|
| `web/` | Public site. Next.js 16 App Router, `output: "export"`, `trailingSlash: true`, `assetPrefix: "/_site"`. Visual editing uses Puck (`@puckeditor/core`). Local dev server is port 4100. |
| `cms/` | Payload CMS 3.91 on Next.js 16. Admissions & Visitor Desk and staff login are the Payload admin at `/admin` (admin title suffix `· ULL Admissions Desk`). PostgreSQL via `@payloadcms/db-postgres`. Local dev server is port 3000. The image built for EC2 is `cms/Dockerfile`: `node:22.17.0-alpine`, Next.js `output: 'standalone'`, process listens on port 3000. |
| `infra/` | AWS CDK app (`infra/bin/ull.ts`). Account `862330373376`. |
| `deploy/` | Publish, EC2 boot, Compose, and database backup scripts. |
| `content/` | Reference copy used while pages are still seeded from the repo. |

The public site build (`web` `npm run build`) lists public files, pulls published pages when `CMS_URL` is set (`web/scripts/pull-cms.mjs`), runs `next build`, then injects the Google tag (`web/scripts/inject-gtag.mjs`). Container id in that script: `GTM-5LD9P9KD`.

Puck editor route: `/editor/` (`web/src/app/(tools)/editor/page.tsx`). It is client-only and uses the staff CMS session. Payload Live Preview for pages points at `/preview/?id=`. Both write the same `pages` document. Page blocks in `cms/src/blocks/index.ts`: `text`, `cards`, `table`, `steps`, `faq`, `quote`, `gallery`, `cta`, `subnav`, `enquiry`.

CMS collections (`cms/src/payload.config.ts`): `enquiries`, `pages`, `media`, `private-files`, `users`. One global: `site-settings`. Custom routes: `/api/otp/config`, `/api/otp/session`, `/api/otp/submit`. Migrations in `cms/src/migrations` run on production boot (`prodMigrations`).

Postgres is not RDS. On AWS it is `postgres:16-alpine` in Docker on the CMS instance, database `ull_cms`, user `ull`, data directory `/opt/ull/pgdata` (`deploy/docker-compose.aws.yml`). Locally, `npm run db` in `cms/` starts the same image via `deploy/docker-compose.dev.yml` on `localhost:5432`.

`README.md` still says the CMS instance is a `t3.small` and that AWS is "once the account is ready". The CDK stack creates a `t3.medium`. Trust this file and `infra/` over that paragraph.

## CDK stacks

Defined in `infra/bin/ull.ts` and `infra/lib/`. Region for shared and stage stacks is `ap-south-1`. `cdk.json` sets context `attachDomains` to `true`.

| Stack | Region | When | What the code creates |
|---|---|---|---|
| `UllShared` | ap-south-1 | always | Public Route 53 zone `ullindia.com`, Google Workspace MX (`smtp.google.com`), SPF, DKIM, DMARC, Search Console and Zoho verification TXT records, GitHub Actions OIDC provider. |
| `UllUat` | ap-south-1 | always | UAT stage. See below. |
| `UllProd` | ap-south-1 | always | Production stage. See below. |
| `UllUatCert` | us-east-1 | only when `attachDomains` is true | ACM certificate for `uat.ullindia.com` and `cdn-uat.ullindia.com`, DNS validation in the shared zone. |
| `UllProdCert` | us-east-1 | only when `attachDomains` is true | ACM certificate for `ullindia.com`, `www.ullindia.com`, and `cdn.ullindia.com`. |

Stage resources (`infra/lib/stage-stack.ts`), one set per stage:

- S3 `ull-<stage>-site-<account>` (block public access, SSL only). Not versioned. This is the static site.
- S3 `ull-<stage>-media-<account>`, versioned. Public images. Served by the CDN distribution, not by the site distribution.
- S3 `ull-<stage>-private-<account>`, versioned, removal policy retain. Applicant documents, recordings, reports. No CloudFront. Payload checks access, then a presigned URL that expires in 300 seconds.
- S3 `ull-<stage>-backup-<account>`, versioned, current objects expire after 30 days. No separate noncurrent-version expiry rule.
- ECR repository `ull-<stage>`, scan on push, keep the last 10 images, retain the repository.
- Secrets Manager: `ull/<stage>/payload-secret`, `ull/<stage>/postgres-password`, `ull/<stage>/deploy-hook-token`, `ull/<stage>/msg91`.
- EC2 `ull-<stage>`: Amazon Linux 2023 x86_64, `t3.medium`, IMDSv2 required, SSM core, no inbound SSH. Ingress is TCP 3000 from the CloudFront origin-facing prefix list `pl-9aa247f3` only. Elastic IP. Root volume 20 GB encrypted gp3. Data volume 30 GB encrypted gp3 on `/dev/sdf` with `deleteOnTermination: false`, mounted at `/opt/ull` by `deploy/ec2-init.sh` and used for Postgres.
- The instance is placed in existing VPC `vpc-0a0e05eb9d140c429` (subnets in `ap-south-1a`, `ap-south-1b`, `ap-south-1c`).
- Two CloudFront distributions, price class 200. Site distribution and CDN distribution, described below.
- Route 53 A and AAAA aliases for the stage hosts and the CDN host.
- IAM role `ull-<stage>-github`. The OIDC trust requires `token.actions.githubusercontent.com:sub` to equal `repo:elseifai@229399365/ull@1429253445:ref:refs/heads/<stage>` (`infra/lib/stage-stack.ts`). That is the subject string in the template, not the shorter `repo:elseifai/ull:ref:...` form. The role can push the stage ECR repo, read/write the site and media buckets, invalidate the two distributions, describe this stack, and run SSM shell on this instance.

Deploy the stacks from `infra/` with the CDK app. `npm run deploy` is `cdk deploy --all --require-approval never`. The CDK CLI profile in `cdk.json` is `ull-aws-cursor-vaibhav`. Do not put secret values in git.

## CloudFront routing

Site distribution (`SiteDistribution`):

| Behaviour | Origin | Cache | Notes |
|---|---|---|---|
| Default `/*` | S3 site bucket via origin access control | CachingOptimized | Viewer-request function `deploy/cloudfront-function.js`: `/path/` is rewritten to `/path/index.html`; a path with no file extension 301s to the trailing-slash URL and keeps the query string. `defaultRootObject` is `index.html`. |
| `/api/*` | EC2 public DNS, HTTP port 3000, header `X-Forwarded-Proto: https` | CachingDisabled, all viewer headers, all methods | Payload API. Read timeout 60 seconds. |
| `/admin*` | same EC2 origin | same as `/api/*` | Staff admin. Matches `/admin` and anything under it. |
| `/_next/*` | same EC2 origin | same as `/api/*` | Payload admin's own Next.js assets. The public site must not use this prefix. |

Static export assets are uploaded under `_site/_next` (`deploy/deploy-web.sh`) because `/_next` on the hostname belongs to the CMS. HTML and other site files are synced to the bucket root with `max-age=300`. Hashed assets under `_site/_next` use `max-age=31536000, immutable`. The sync deletes objects that are no longer in the build, and then deletes any leftover `s3://<site-bucket>/_next` prefix. The site bucket is not versioned, so the previous HTML is not kept in S3.

Custom errors: origin 403 and 404 both return `/404.html` with HTTP 404, cached for one minute.

Viewer policy redirects HTTP to HTTPS. When a certificate is attached, the minimum protocol is TLS 1.2 (`TLS_V1_2_2021`) and the aliases are the stage hosts.

CDN distribution (`CdnDistribution`): default behaviour only, media bucket via OAC, CachingOptimized, response header `Cache-Control: public, max-age=31536000, immutable`. Alias is the stage CDN hostname when a certificate is attached. Private objects are never on this distribution.

## Environments and hosts

| Stage | Site hosts | CDN host | CloudFormation stack | Git branch that deploys it |
|---|---|---|---|---|
| UAT | `uat.ullindia.com` | `cdn-uat.ullindia.com` | `UllUat` | `uat` |
| Production | `ullindia.com`, `www.ullindia.com` | `cdn.ullindia.com` | `UllProd` | `prod` |

`www` is a separate alias on the production site distribution. It is not redirected to the apex by the CDK app. Production CORS, written by `deploy/remote-up.sh`, allows the site URL, `https://www.ullindia.com`, and the CloudFront domain name (`AltOrigin`) when that output exists.

Stack outputs used by the deploy script: `SiteBucketName`, `MediaBucketName`, `PrivateBucketName`, `BackupBucketName`, `SiteDistributionId`, `CdnDistributionId`, `SiteUrl`, `AltOrigin`, `CdnHost`, `InstanceId`, `EcrRepositoryUri`, `PayloadSecretArn`, `PostgresSecretArn`, `HookSecretArn`, `Msg91SecretArn`, `GithubRoleArn`.

Local development is not a stage. CMS `http://localhost:3000/admin`, website `http://localhost:4100`, page builder `http://localhost:4100/editor/`.

## CI/CD

Workflow: `.github/workflows/deploy.yml`. Name: Deploy.

Triggers:

- `push` to branch `uat` or `prod`. `main` does not deploy.
- `workflow_dispatch` with input `stage` (`uat` or `prod`) and `site_only` (boolean, default false).

The job checks out the workflow ref, uses Node 22, and assumes `arn:aws:iam::862330373376:role/ull-<stage>-github` in `ap-south-1`. The role trust allows only `refs/heads/uat` or `refs/heads/prod`, so a dispatch whose ref is `main` cannot assume the role. The CMS publish hook dispatches with `ref` set to the stage branch for that reason.

Concurrency group `deploy-<stage>`, `cancel-in-progress: false`.

The job runs `bash deploy/rollout-stage.sh <stage>`.

What `deploy/rollout-stage.sh` does:

1. Maps `uat` → stack `UllUat`, `prod` → stack `UllProd`.
2. Uses profile `ull-aws-cursor-vaibhav` only when `AWS_SESSION_TOKEN` and `AWS_ACCESS_KEY_ID` are both unset. GitHub Actions already has session credentials, so CI does not use that profile.
3. Reads the stack outputs in `ap-south-1`.
4. Sets `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL` (`<SiteUrl>/api`), `NEXT_PUBLIC_CMS_URL`, `NEXT_PUBLIC_CDN_URL` (`https://<CdnHost>`), `CMS_URL` (`SiteUrl`).
5. Unless `SITE_ONLY=true`: builds `cms/` as `linux/amd64`, tags the ECR image with the short git SHA and `current`, and pushes both tags.
6. Runs `deploy/deploy-web.sh` (publish brand assets, `npm ci` and build in `web/`, fail if a page points at media outside the stage CDN, sync to the site bucket, invalidate the site distribution).
7. Invalidates the CDN distribution path `/*`. A failure of that invalidation is ignored (`|| true`).
8. Unless `SITE_ONLY=true`: sends `deploy/docker-compose.aws.yml` and `deploy/remote-up.sh` to the instance with SSM `AWS-RunShellScript` and starts the containers. `remote-up.sh` reads the four secrets, writes `/opt/ull/.env`, installs the nightly backup cron, pulls the image, and runs `docker compose up -d`.

Publishing a CMS page does not deploy new code. `cms/src/lib/rebuild.ts` debounces 30 seconds and POSTs `DEPLOY_HOOK_URL`. On the instance, `remote-up.sh` sets that URL to `https://api.github.com/repos/elseifai/ull/actions/workflows/deploy.yml/dispatches` only when `ull/<stage>/deploy-hook-token` starts with `ghp_` or `github_pat_`. The body is `{"ref":"<stage>","inputs":{"stage":"<stage>","site_only":true}}`. Any other secret value leaves the hook unset, and the CMS logs a dry run. A generated placeholder in Secrets Manager does not publish the site.

### Local deploy scripts

| Script | Role |
|---|---|
| `deploy/rollout-stage.sh uat\|prod` | Same publish path as CI, using the AWS profile above when there is no session. |
| `deploy/deploy-web.sh` | Static site only. Requires `S3_BUCKET` (the site bucket) and `CLOUDFRONT_ID`. Optional `CMS_URL`, `CDN_BUCKET`, `NEXT_PUBLIC_CDN_URL`. |
| `deploy/remote-up.sh` | Runs on the instance. Not a laptop command. |
| `deploy/ec2-init.sh` | First boot user data. Docker, Compose v2.32.4, format and mount the data disk. |
| `deploy/publish-assets.mjs` | Uploads versioned brand images before the site build. |
| `deploy/check-cdn-urls.mjs` | Fails the build if published HTML points outside the stage CDN. |
| `deploy/backfill-media.mjs` | One-off media repair. `--apply` writes. |
| `deploy/backup-db.sh` | Laptop/compose-directory dump. The instance cron uses a different script written by `remote-up.sh` (see Backup). |

Promotion is a git operation. This repo has no promote script.

1. Open a pull request into `main` and merge it. That does not deploy.
2. Merge `main` into `uat` and push `uat`. The workflow deploys UAT.
3. After UAT is accepted, merge `uat` into `prod` and push `prod`. The workflow deploys production.

Do not push docs-only commits to `uat` or `prod` just to publish them. Those branches deploy the application.

## Secrets and environment variables

Names only. Values stay in Secrets Manager, the instance `.env` (mode 0600, written on the server), or a developer's uncommitted `.env`. Never commit them and never paste them into docs, issues, or logs.

### Secrets Manager

| Name | Contents |
|---|---|
| `ull/<stage>/payload-secret` | `PAYLOAD_SECRET` |
| `ull/<stage>/postgres-password` | Postgres password for user `ull` |
| `ull/<stage>/deploy-hook-token` | GitHub token used as `DEPLOY_HOOK_TOKEN`. Must be replaced with a token that can dispatch workflows. A generated placeholder does not. |
| `ull/<stage>/msg91` | JSON object with keys `MSG91_WIDGET_ID`, `MSG91_TOKEN_AUTH`, `MSG91_AUTHKEY`. `remote-up.sh` refuses to rewrite `.env` if this is missing, empty, or not a single-line JSON object. |

`MSG91_AUTHKEY` stays on the server. The widget id and token auth are read by the CMS and passed to the MSG91 browser widget. They are still secrets: do not copy them into source.

### CMS process environment

From `cms/.env.example` and the file `remote-up.sh` writes:

`DATABASE_URL`, `PAYLOAD_SECRET`, `PAYLOAD_PUBLIC_SERVER_URL`, `NEXT_PUBLIC_SITE_URL`, `DEPLOY_HOOK_URL`, `DEPLOY_HOOK_TOKEN`, `DEPLOY_HOOK_BODY`, `S3_BUCKET`, `CDN_HOST`, `PRIVATE_BUCKET`, `AWS_REGION`, `SES_REGION`, `SES_FROM`, `GUPSHUP_API_KEY`, `GUPSHUP_SENDER`, `WATI_API_URL`, `WATI_TOKEN`, `MSG91_WIDGET_ID`, `MSG91_TOKEN_AUTH`, `MSG91_AUTHKEY`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `CORS_ORIGINS`, `STAGE`, `POSTGRES_PASSWORD`, `CMS_IMAGE`.

On AWS, `S3_BUCKET` in the CMS environment is the **media** bucket (`MediaBucketName`). In `deploy/deploy-web.sh`, `S3_BUCKET` is the **site** bucket. Do not mix them.

`SEED_ADMIN_EMAIL` defaults to `admin@ullindia.com` in the example file. `SEED_ADMIN_PASSWORD` is required for `npm run seed` and has no default. Local Compose uses a development database password in `deploy/docker-compose.dev.yml`. Do not reuse local passwords on AWS.

`cms/src/lib/notify.ts` is the only outbound sender. WhatsApp calls WATI when `WATI_API_URL` and `WATI_TOKEN` are both set, otherwise it logs `[whatsapp:dry-run]`. SMS calls Gupshup when `GUPSHUP_API_KEY` and `GUPSHUP_SENDER` are both set, otherwise `[sms:dry-run]`. Email logs `[email:dry-run]` unless `SES_FROM` is set, in which case it calls `payload.sendEmail`. `cms/src/payload.config.ts` does not register an email adapter, and the repo has no SES client. The instance role is allowed `ses:SendEmail` and `ses:SendRawEmail`; that permission does not by itself send mail. Template names in code: `enquiry_received`, `visit_requested`, `visit_confirmed`, `visitor_arrived`. A new enquiry asks for WhatsApp and email. SMS is implemented and is not in that default channel list.

### Website build environment

From `web/.env.example` and `rollout-stage.sh`:

`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_CMS_URL`, `CMS_URL`, `NEXT_PUBLIC_CDN_URL`, `CDN_URL`, `CDN_BUCKET`.

MSG91 keys are not website build variables.

### Deploy-time variables

`AWS_PROFILE`, `AWS_REGION`, `AWS_DEFAULT_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SESSION_TOKEN`, `SITE_ONLY`, `S3_BUCKET`, `CLOUDFRONT_ID`, `BACKUP_BUCKET`, plus the secret ARNs `PAYLOAD_SECRET_ARN`, `POSTGRES_SECRET_ARN`, `HOOK_SECRET_ARN`, `MSG91_SECRET_ARN`.

## Staff roles

Source: `cms/src/access/roles.ts`. A user with role `admin` passes every `hasRole` check. The access matrix is what `cms/tests/access.test.mjs` asserts, plus private-file rules from `cms/src/collections/PrivateFiles.ts`.

| Label | Value | Admissions & Visitors | Private files | Pages, media, site settings | Staff accounts |
|---|---|---|---|---|---|
| Group admin | `admin` | create, read, update, delete | create, read, update, delete | edit | create, delete, edit roles |
| School admin | `schoolAdmin` | create, read, update | create, read, update | edit | own profile only |
| Content editor | `editor` | create only; cannot read the list | no | edit | own profile only |
| Admissions counsellor | `counsellor` | create, read, update | create, read, update | hidden | own profile only |
| Front desk | `frontDesk` | create, read, update | create only; cannot read or update | hidden | own profile only |

Only a group admin can create or delete users, or change the `roles` field. There is no Security role in code. `Users.ts` says parent accounts are a later collection; they do not exist yet.

Anonymous `POST /api/enquiries` is rejected with 401 unless the MSG91 OTP gate has set `leadOtpVerified` on the request. Staff can still create walk-ins and other records while signed in. Public creates may only set the form fields; stage, notes, and visit details are stripped. A visit request starts at stage `visitBooked`; other public forms start at `enquired`. A pass code is generated on create.

Pipeline (`STAGES` in `cms/src/collections/Enquiries.ts`): Enquired, Visit booked, Visited, Child interaction, Documents pending, Admission confirmed, Orientation done, Enrolled, Lost / not now.

Grades: Nursery, LKG, UKG, Grade 1 through Grade 10.

The content-team rule in `docs/business-ops.md` (they do not publish directly) is an operating rule. The `editor` role can still update and publish pages in Payload today. Issue `#66` (block publish on failed SEO checks) and issue `#195` (content validation) are open. Do not describe the CMS as enforcing that rule.

## Runbooks

### Deploy

Normal path:

1. Merge the pull request into `main`.
2. Merge `main` into `uat` and push `origin uat`. Watch the Deploy workflow. It must finish Success. `rollout-stage.sh` prints `Deployed uat at <SiteUrl>`.
3. Check `https://uat.ullindia.com` and `https://uat.ullindia.com/admin`.
4. Merge `uat` into `prod` and push `origin prod`. Check `https://ullindia.com` and `https://www.ullindia.com`.

Site-only republish (no CMS image), after the hook token is a real GitHub token:

- Actions → Deploy → Run workflow, ref `uat` or `prod`, stage matching that ref, `site_only` checked.
- Or publish a page in `/admin`. That dispatches `site_only: true` on the stage ref, 30 seconds after the last publish.

A full code deploy still rebuilds the site from `CMS_URL`, so published pages are included. A build with `CMS_URL` empty ships only the files in `web/src/content`.

First boot is user data (`deploy/ec2-init.sh`). Later deploys do not re-run user data; they SSM `remote-up.sh`. If SSM never reports the instance Online, `rollout-stage.sh` exits with `instance never registered with Systems Manager` after about 10 minutes.

CMS container health is "compose up succeeded". There is no `/api/health` route in the repo.

### Rollback

There is no rollback script.

Application rollback is a new deploy of a known-good commit:

1. On the stage branch (`uat` or `prod`), `git revert` the bad merge (or check out the last good commit onto that branch without rewriting history other people are using).
2. Push the stage branch. The workflow builds that tree, pushes a new ECR tag for that SHA, syncs the site bucket, and restarts the CMS with `CMS_IMAGE` set to that tag.

The site bucket sync uses `--delete` and the bucket is not versioned. You cannot restore the previous HTML from S3 version history. Rebuild it from git.

ECR keeps the last 10 images. An emergency CMS-only rollback, if the previous SHA tag is still in the repository: SSM to the instance, set `CMS_IMAGE` in `/opt/ull/.env` to that tag, then `docker compose pull && docker compose up -d` in `/opt/ull`. The static site stays on whatever was last synced until a site deploy of the matching commit. Prefer a full redeploy so the site and the CMS match.

Rolling back code does not roll back the database. A bad migration needs the restore runbook.

### Backup

What actually runs:

- `deploy/remote-up.sh` writes `/opt/ull/backup-db.sh` and `/etc/cron.d/ull-backup`.
- Cron is `0 2 * * *` with no `CRON_TZ`. `ec2-init.sh` does not change the instance timezone. On Amazon Linux that is 02:00 UTC.
- The job runs `pg_dump -U ull ull_cms` inside the `db` container, gzips it, and uploads `s3://<BackupBucketName>/db/ull_cms_<YYYY-MM-DD>.sql.gz`.
- The dump is plain SQL. It is not custom format and it is not `--clean`.
- The backup bucket lifecycle expires current objects after 30 days, both UAT and production. The plan file's 90-day production retention, cross-region copy, and EBS backup plan are not in the CDK app.
- Media and private buckets are versioned. Replacing a media file writes a new prefix and leaves the old object (`cms/src/lib/storage.ts`).
- The Postgres volume is the 30 GB data disk. `deleteOnTermination` is false, so terminating the instance does not delete that volume. The repo has no snapshot schedule.

`deploy/backup-db.sh` is the same dump for a checkout that already has `BACKUP_BUCKET` and a local Compose project. The instance does not call that file; cron calls `/opt/ull/backup-db.sh`.

Confirm a backup by listing `s3://<BackupBucketName>/db/`. There is no success metric or alarm in the stack.

### Restore

There is no restore script and no restore drill recorded in the repo. This is the inverse of the dump the cron job writes. It deletes the current `ull_cms` database on that instance.

1. SSM Session Manager to `ull-<stage>`. Do not expect SSH; the security group does not allow it.
2. Pick the object `s3://<BackupBucketName>/db/ull_cms_<YYYY-MM-DD>.sql.gz` and copy it to `/tmp` on the instance.
3. Stop the CMS so it cannot write during the restore:

```bash
docker compose -f /opt/ull/docker-compose.yml --project-directory /opt/ull stop cms
```

4. Replace the database. `pg_dump` output without `--clean` will not load cleanly over an existing schema.

```bash
docker compose -f /opt/ull/docker-compose.yml --project-directory /opt/ull exec -T db \
  psql -U ull -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'ull_cms' AND pid <> pg_backend_pid();"
docker compose -f /opt/ull/docker-compose.yml --project-directory /opt/ull exec -T db \
  psql -U ull -d postgres -c "DROP DATABASE ull_cms;"
docker compose -f /opt/ull/docker-compose.yml --project-directory /opt/ull exec -T db \
  psql -U ull -d postgres -c "CREATE DATABASE ull_cms OWNER ull;"
gunzip -c /tmp/ull_cms_YYYY-MM-DD.sql.gz | docker compose -f /opt/ull/docker-compose.yml --project-directory /opt/ull exec -T db \
  psql -U ull -d ull_cms
```

5. Start the CMS again. Pending migrations run on boot. If the dump is older than the code, read the migration error before retrying.

```bash
docker compose -f /opt/ull/docker-compose.yml --project-directory /opt/ull start cms
```

Restore a media or private object from S3 versioning only when you have the version id. Do not make the private bucket public to recover a file.

## Change log

| Date | Change | Where it was checked |
|---|---|---|
| 2026-10-22 | First commit of the website, CMS, and deploy scripts. | `821ebac` |
| 2026-10-26 | Stage deploy (S3, CloudFront, EC2, ECR) and CDN media with AVIF/WebP sizes plus private files. | `5a8fd39`, `820c7a0` |
| 2026-11-03 | Deploys build published CMS pages; enquiries store UTM fields; Google tag injected on exported HTML; production deploy role and instance wiring fixes. | `ac80a15` through `77ad1e5` |
| 2026-11-11 | Public enquiry and visit forms require a verified MSG91 OTP. The CMS loads the MSG91 JSON secret on start and will not replace a good `.env` when that secret is invalid. | `#2`, `#3` |
| 2026-11-13 | Added this guide, `docs/business-ops.md`, `docs/ullindia-agent-summary.md`, the PR template, and `CONTRIBUTING.md`. No application or infrastructure code changed. | this PR |
