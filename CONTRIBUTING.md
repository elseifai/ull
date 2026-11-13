# Contributing

## Update the team docs

Every pull request updates both team documents:

- `docs/it-support.md` for IT support and developers
- `docs/business-ops.md` for leadership, admissions, marketing, content, and operations

If a change truly touches neither audience, the pull request description must say why both files were left as they are. Do not leave the checklist blank.

Also update `docs/ullindia-agent-summary.md` when the change affects how the assistant should see the project: repo layout, conventions, labels, milestones, open decisions, or roadmap status.

## Flow

1. Start from a GitHub issue. Keep the issue small enough to ship on its own.
2. Branch from `main`. Open a pull request back into `main`.
3. Merge to `main` does not deploy.
4. Promote by merging `main` into `uat` and pushing `uat`. That push runs `.github/workflows/deploy.yml` and updates `uat.ullindia.com`.
5. When UAT is accepted, merge `uat` into `prod` and push `prod`. That updates `ullindia.com` and `www.ullindia.com`.

A docs-only pull request merges to `main` and stops there. Do not push it to `uat` or `prod`, and do not run a deploy, to publish documentation.

## Content

The content team never publishes directly. Submissions are validated before they are entered: phone numbers, email addresses, campus addresses, fees, and names (ULL India, ULL Auremont, ULL Global).

- Contact and lead data goes into the Admissions & Visitor Desk.
- Page copy and media go into the CMS as a draft for review.
- Anything unclear goes to the WhatsApp group `353 ULL CRM`. Do not guess, and do not publish it while it is unclear.

The CMS still allows a content editor to press publish. Follow this rule until that check is built. See `docs/business-ops.md`.
