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

- [ ] Docs-only. Merge to `main`. Do not push `uat` or `prod` and do not deploy.
- [ ] Code change. After merge to `main`, promote `main` → `uat`, then `uat` → `prod` only when UAT is accepted.

Notes for the person promoting (environment, migration, secret name — never a secret value):
