import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mediaPrefix } from '../src/lib/media-prefix.ts'

const hello = Buffer.from('hello')
const expected = `media/${createHash('sha256').update(hello).digest('hex').slice(0, 8)}`
assert.equal(mediaPrefix(hello), expected)
assert.notEqual(mediaPrefix(Buffer.from('other')), expected)
console.log('media prefix ok')
