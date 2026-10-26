import { createHash } from 'node:crypto'

// First 8 hex chars of the file bytes. A new photo is a new folder, so the CDN URL changes.
export function mediaPrefix(contents: Buffer): string {
  return `media/${createHash('sha256').update(contents).digest('hex').slice(0, 8)}`
}
