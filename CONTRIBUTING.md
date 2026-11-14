# Contributing

## Update the team docs

Every pull request updates both team documents:

- `docs/it-support.md` for IT support and developers
- `docs/business-ops.md` for leadership, admissions, marketing, content, and operations

If a change truly touches neither audience, the pull request description must say why both files were left as they are. Do not leave the checklist blank.

Also update `docs/ullindia-agent-summary.md` when the change affects how the assistant should see the project: repo layout, conventions, labels, milestones, open decisions, or roadmap status.

## Flow

Every fix lands on `dev` first, is tested there, then is promoted to `uat` for operations review, and only then goes to `prod` (live). Do not open the pull request against `main`. GitHub's default branch is still `main`; it is not where this work lands.

1. Start from a GitHub issue. Keep the issue small enough to ship on its own. There is no Jira. GitHub issues and the ULL India Roadmap project are the only tracker.
2. Branch from `dev`. Open a pull request back into `dev`.
3. Merge to `dev` does not deploy. Test the change on `dev`.
4. Promote by merging `dev` into `uat` and pushing `uat`. That push runs `.github/workflows/deploy.yml` and updates `uat.ullindia.com` for operations review.
5. Only after that review, merge `uat` into `prod` and push `prod`. That updates the live site, `ullindia.com` and `www.ullindia.com`.

A docs-only pull request merges to `dev` and stops there. Do not push it to `uat` or `prod`, and do not run a deploy, to publish documentation.

## Content

The content team never publishes directly. Submissions are validated before they are entered: phone numbers, email addresses, campus addresses, fees, and names.

ULL Global is the IB school. Auremont is the correct spelling of the Nagarbhavi CBSE school. Do not write Ormond.

The in-house admissions system is the CMS admin panel at `/admin` in this repo. The third-party CRM is Orggen. Its API document has not arrived; do not invent the connection.

- Contact and lead data goes into the Admissions & Visitor Desk.
- Page copy and media go into the CMS as a draft for review.
- Anything unclear goes to the WhatsApp group `353 ULL CRM`. Do not guess, and do not publish it while it is unclear.

The CMS still allows a content editor to press publish. Follow this rule until that check is built. See `docs/business-ops.md`.
