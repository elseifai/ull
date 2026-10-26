import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'
import { env } from './env'

// When content is published, ask the deploy pipeline to rebuild the static site
// and sync it to S3. Debounced so a burst of edits triggers one build.
let timer: NodeJS.Timeout | undefined

function trigger(logger: { info: (m: string) => void; error: (m: string) => void }) {
  const url = env('DEPLOY_HOOK_URL')
  if (!url) return logger.info('[rebuild:dry-run] content changed; set DEPLOY_HOOK_URL to publish automatically')
  clearTimeout(timer)
  timer = setTimeout(() => {
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json' }
    const token = env('DEPLOY_HOOK_TOKEN')
    const body = env('DEPLOY_HOOK_BODY')
    if (token) headers.Authorization = `Bearer ${token}`
    if (body) headers['Content-Type'] = 'application/json'
    fetch(url, { method: 'POST', headers, body })
      .then((r) => logger.info(`[rebuild] triggered (${r.status})`))
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
