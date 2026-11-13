# ULL India agent summary

Read this at the start of every session before changing the project. Date: 2026-11-13.

Last weekly report: none. [#199](https://github.com/elseifai/ull/issues/199) (weekly board report to lsave.ai@gmail.com and president@ullindia.com) is still open.

## Repo

GitHub: `elseifai/ull` (`https://github.com/elseifai/ull`). Default branch `main`. Stage branches `uat` and `prod` deploy; pushing them runs `.github/workflows/deploy.yml`. Do not push to `uat` or `prod`, and do not deploy, unless the task is an explicit promotion.

Owner's Mac checkout: `~/Desktop/Client Projects/admissionportal`.

Layout: `web/` public Next.js static export and Puck editor; `cms/` Payload and the Admissions & Visitor Desk at `/admin`; `infra/` CDK stacks `UllShared`, `UllUat`, `UllProd` in `ap-south-1`, plus `UllUatCert` and `UllProdCert` in `us-east-1` when `attachDomains` is true; `deploy/` publish and backup scripts; `docs/` living docs. Hosts: `uat.ullindia.com`, `cdn-uat.ullindia.com`, `ullindia.com`, `www.ullindia.com`, `cdn.ullindia.com`.

Full technical picture: `docs/it-support.md`. Business picture: `docs/business-ops.md`. If this summary disagrees with those files, trust the file that was checked against the code and update this one.

## Conventions

- Keep tickets small and independently shippable. Epics are parents; do the work in a sub-issue.
- Every PR updates `docs/it-support.md` and `docs/business-ops.md`, or the PR body explains why neither changed. Update this summary when the repo layout, conventions, labels, open decisions, or roadmap status change.
- Docs-only PR: documentation and templates only. Merge into `main`. Do not promote it to `uat` or `prod` and do not deploy.
- Code PR: issue → branch → pull request into `main` → merge `main` into `uat` (deploys UAT) → merge `uat` into `prod` (deploys production). `main` itself does not deploy.
- Content team never publishes directly. Validate phones, emails, addresses, fees, and names first. Contact and lead data goes to the admissions desk. Page copy and media go in as a CMS draft. Anything unclear goes to the WhatsApp group `353 ULL CRM`. The CMS does not enforce this yet ([#195](https://github.com/elseifai/ull/issues/195), [#196](https://github.com/elseifai/ull/issues/196)).
- Do not invent roadmap status. Read `gh issue list` and the epic sub-issues. Do not write secret values into docs or commits.

## Labels and milestones

Labels: `type:epic`, `type:feature`, `type:decision`, `type:task`, `type:chore`; `area:cms`, `area:website`, `area:crm`, `area:infra`, `area:portal`, `area:docs`, `area:business`; `priority:high`, `priority:medium`, `priority:low`; `backlog` (not scheduled for the current phase); `blocked` (waiting on an external answer or dependency).

Milestones:

| Milestone | Window on the milestone | Intent |
|---|---|---|
| P0 Foundation | 26 Oct – 13 Nov 2026 | Prod live, legal and company details, competitor study, metrics agreed |
| P1 Launch | 9 Nov – 18 Dec 2026 | Umbrella site, AI-assisted CMS, CRM v1 with source tracking, marketing live |
| P2 Operate | 4 Jan – 26 Feb 2027 | Visitor desk, external CRM sync, Google Business Profile, social dashboard, family sign-in, assessments, recorder pilot |
| P3 Automate | 1 Feb – 26 Mar 2027 | Voice agents, AI follow-ups, conversation analytics |
| P4 Learn | 1 Feb – 30 Apr 2027 | Student and parent dashboards for 2027–28 |

## Project board

ULL India Roadmap (GitHub Project). Link pending.

## Open items

All 24 epics are open. No issue in the repo is closed. Progress on 2026-11-13 is 0 closed sub-issues on every epic. The table, with issue links, is in `docs/business-ops.md`.

Blocked, waiting on the owner:

- [#88](https://github.com/elseifai/ull/issues/88) — Entra ID app and role groups, blocked on the Microsoft 365 purchase (epic 23).
- [#150](https://github.com/elseifai/ull/issues/150) — Orggen ('Origin') CRM endpoint, auth, payload, and sandbox. Not provided.
- [#153](https://github.com/elseifai/ull/issues/153) — Orggen adapter, blocked on the same missing endpoint and payload.
- [#198](https://github.com/elseifai/ull/issues/198) — Jira or GitHub-only for business requests. Needs Vaibhav's answer.
- [#200](https://github.com/elseifai/ull/issues/200) — First-party CRM in this repo's `/admin`, or a separate repo. Needs Vaibhav's answer. No separate CRM repo was found when the ticket was opened.

Also open, and easy to get wrong: parent login is a holding page, not a portal; the `editor` role can publish even though the content rule says the content team must not; a CMS publish rebuilds the site only after `ull/<stage>/deploy-hook-token` is a GitHub token whose value starts with `ghp_` or `github_pat_`.
