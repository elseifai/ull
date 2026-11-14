import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mediaPrefix } from '../src/lib/media-prefix.ts'

const hello = Buffer.from('hello')
const hash = createHash('sha256').update(hello).digest('hex').slice(0, 8)
assert.equal(mediaPrefix(hello), `media/${hash}`)
assert.equal(mediaPrefix(hello, 'image/jpeg'), `media/${hash}`)
assert.equal(mediaPrefix(hello, 'application/pdf'), `docs/${hash}`)
assert.notEqual(mediaPrefix(Buffer.from('other')), `media/${hash}`)
console.log('media prefix ok')
