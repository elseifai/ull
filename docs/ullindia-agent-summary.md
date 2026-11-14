# ULL India agent summary

Read this at the start of every session before changing the project. Date: 2026-11-14.

Last weekly report: none. [#199](https://github.com/elseifai/ull/issues/199) (weekly board report to lsave.ai@gmail.com and president@ullindia.com) is still open.

## Repo

GitHub: `elseifai/ull` (`https://github.com/elseifai/ull`). GitHub's default branch is still `main`. Fixes do not land there. Every fix lands on `dev` first, is tested there, then is promoted to `uat` for operations review, and only then to `prod` (live). Pushing `uat` or `prod` runs `.github/workflows/deploy.yml`. Pushing `dev` or `main` does not. There is no `dev` AWS stage. Do not push to `uat` or `prod`, and do not deploy, unless the task is an explicit promotion.

Owner's Mac checkout: `~/Desktop/Client Projects/admissionportal`.

Layout: `web/` public Next.js static export and Puck editor; `cms/` Payload and the Admissions & Visitor Desk at `/admin`; `infra/` CDK stacks `UllShared`, `UllUat`, `UllProd` in `ap-south-1`, plus `UllUatCert` and `UllProdCert` in `us-east-1` when `attachDomains` is true; `deploy/` publish and backup scripts; `docs/` living docs. Hosts: `uat.ullindia.com`, `cdn-uat.ullindia.com`, `ullindia.com`, `www.ullindia.com`, `cdn.ullindia.com`.

Full technical picture: `docs/it-support.md`. Business picture: `docs/business-ops.md`. If this summary disagrees with those files, trust the file that was checked against the code and update this one.

## Conventions

- Keep tickets small and independently shippable. Epics are parents; do the work in a sub-issue.
- Every PR updates `docs/it-support.md` and `docs/business-ops.md`, or the PR body explains why neither changed. Update this summary when the repo layout, conventions, labels, open decisions, or roadmap status change.
- Docs-only PR: documentation and templates only. Merge into `dev`. Do not promote it to `uat` or `prod` and do not deploy.
- Code PR: issue → branch → pull request into `dev` → test on `dev` → merge `dev` into `uat` (deploys UAT for operations review) → merge `uat` into `prod` (deploys the live site). Do not open the pull request against `main`.
- No Jira. GitHub issues and the ULL India Roadmap project are the only tracker. [#198](https://github.com/elseifai/ull/issues/198) is closed.
- The in-house CRM code is the CMS admin panel at `/admin` in this repo. [#200](https://github.com/elseifai/ull/issues/200) is closed. Do not look for a separate CRM repo.
- The third-party CRM is Orggen. Its API document has not arrived. [#150](https://github.com/elseifai/ull/issues/150) and [#153](https://github.com/elseifai/ull/issues/153) stay blocked.
- ULL Global is the IB school. Auremont is the correct spelling of the Nagarbhavi CBSE school. Never write Ormond.
- [#197](https://github.com/elseifai/ull/issues/197) is done. [PR #202](https://github.com/elseifai/ull/pull/202) merged into `dev` with the updated plans and `docs/handover/`. GitHub still shows the issue open because the merge was into `dev`, not the default branch `main`.
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

All 24 epics are open. On 2026-11-14 the only issues GitHub has closed are [#198](https://github.com/elseifai/ull/issues/198) and [#200](https://github.com/elseifai/ull/issues/200). [#197](https://github.com/elseifai/ull/issues/197) is done as well (PR #202 merged), so epic 24 is 3 of 8 done. Every other epic is still 0 closed. The table is in `docs/business-ops.md`.

Decided on 14 Nov 2026:

- No Jira. Tracker is GitHub issues plus the ULL India Roadmap project.
- In-house CRM is `/admin` in this repo.
- Third-party CRM is Orggen. API document not received.
- ULL Global = IB school. Auremont = Nagarbhavi CBSE school. Not Ormond.
- Mac plans and handover docs are on `dev`. #197 is done (PR #202 merged). GitHub has not closed the ticket.

Still blocked:

- [#88](https://github.com/elseifai/ull/issues/88) — Entra ID app and role groups, blocked on the Microsoft 365 purchase (epic 23).
- [#150](https://github.com/elseifai/ull/issues/150) — Orggen API endpoint, auth, payload, and sandbox. The API document has not arrived.
- [#153](https://github.com/elseifai/ull/issues/153) — Orggen adapter, blocked on that same missing document.

Also open, and easy to get wrong: parent login is a holding page, not a portal; the `editor` role can publish even though the content rule says the content team must not; a CMS publish rebuilds the site only after `ull/<stage>/deploy-hook-token` is a GitHub token whose value starts with `ghp_` or `github_pat_`; do not open pull requests against `main`.
