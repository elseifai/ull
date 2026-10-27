import { createHash } from 'node:crypto'

// First 8 hex chars of the file bytes. A new photo is a new folder, so the CDN URL changes.
// PDFs (brochures, fee sheets) live under docs/, everything else under media/.
export function mediaPrefix(contents: Buffer, mimeType = ''): string {
  const dir = mimeType === 'application/pdf' ? 'docs' : 'media'
  return `${dir}/${createHash('sha256').update(contents).digest('hex').slice(0, 8)}`
}
