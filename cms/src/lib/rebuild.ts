import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'
import { env } from './env'

// When content is published, ask the deploy pipeline to rebuild the static site
// and sync it to S3. Debounced so a burst of edits triggers one build.
let timer: NodeJS.Timeout | undefined

// GitHub rejects workflow_dispatch when a boolean input is the string "true".
// Servers already deployed still have that string in DEPLOY_HOOK_BODY.
export function hookBody(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  try {
    const parsed = JSON.parse(raw) as { inputs?: { site_only?: unknown } }
    if (parsed.inputs && typeof parsed.inputs.site_only === 'string') {
      parsed.inputs.site_only = parsed.inputs.site_only === 'true'
    }
    return JSON.stringify(parsed)
  } catch {
    return raw
  }
}

function trigger(logger: { info: (m: string) => void; error: (m: string) => void }) {
  const url = env('DEPLOY_HOOK_URL')
  if (!url) return logger.info('[rebuild:dry-run] content changed; set DEPLOY_HOOK_URL to publish automatically')
  clearTimeout(timer)
  timer = setTimeout(() => {
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json' }
    const token = env('DEPLOY_HOOK_TOKEN')
    const body = hookBody(env('DEPLOY_HOOK_BODY'))
    if (token) headers.Authorization = `Bearer ${token}`
    if (body) headers['Content-Type'] = 'application/json'
    fetch(url, { method: 'POST', headers, body })
      .then(async (r) => {
        if (r.ok) logger.info(`[rebuild] triggered (${r.status})`)
        else logger.error(`[rebuild] GitHub rejected the rebuild (${r.status}): ${await r.text()}`)
      })
      .catch((e) => logger.error(`[rebuild] failed: ${e}`))
  }, 30_000)
}

export const rebuildOnPublish: CollectionAfterChangeHook = ({ doc, req }) => {
  if (doc?._status !== 'draft') trigger(req.payload.logger)
  return doc
}

export const rebuildGlobal: GlobalAfterChangeHook = ({ doc, req }) => {
  trigger(req.payload.logger)
  return doc
}
