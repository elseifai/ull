## What this changes

<!-- One short paragraph. Link the issue. -->

## Docs

Required. Tick each line, or explain in "Why the docs did not change".

- [ ] `docs/it-support.md` updated
- [ ] `docs/business-ops.md` updated
- [ ] `docs/ullindia-agent-summary.md` updated, because this PR changes repo layout, conventions, labels, open decisions, or roadmap status
- [ ] Agent summary left unchanged, and that is still accurate

Why the docs did not change (leave blank if both team docs were updated):

## Testing

- [ ] How this was tested:
- [ ] Not tested, because:

## Deploy

Every fix lands on `dev` first and is tested there. `uat` is for operations review. `prod` is live. Do not target `main`.

- [ ] Docs-only. Merge to `dev`. Do not push `uat` or `prod` and do not deploy.
- [ ] Code change. After it is tested on `dev`, promote `dev` → `uat` for operations review, then `uat` → `prod` (live) only when that review is accepted.

Notes for the person promoting (environment, migration, secret name — never a secret value):

## Standing decisions (14 Nov 2026)

Do not reopen these in this pull request.

- [ ] Tracker is GitHub issues and the ULL India Roadmap project. No Jira (#198 closed).
- [ ] The in-house CRM is the CMS admin panel at `/admin` in this repo (#200 closed).
- [ ] The third-party CRM is Orggen. Its API document has not arrived (#150 and #153 stay blocked).
- [ ] ULL Global is the IB school. Auremont, not Ormond, is the Nagarbhavi CBSE school.
- [ ] Mac plans and other local work belong in PR #202 into `dev`, which closes #197. They are not part of this pull request unless this is #202.
