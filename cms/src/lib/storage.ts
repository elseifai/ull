import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { s3Storage } from '@payloadcms/storage-s3'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { readFileSync } from 'node:fs'
import type { Plugin } from 'payload'

import { env } from './env'

function cdnHost() {
  return (env('CDN_HOST') || '').replace(/^https?:\/\//, '').replace(/\/$/, '')
}

export function publicMediaUrl(prefix: string | undefined, filename: string) {
  const key = [prefix?.replace(/^\/+|\/+$/g, ''), filename].filter(Boolean).join('/')
  return `https://${cdnHost()}/${key}`
}

function fileBody(file: { buffer?: Buffer; tempFilePath?: string }) {
  if (file.buffer && file.buffer.length > 0) return file.buffer
  if (file.tempFilePath) return readFileSync(file.tempFilePath)
  throw new Error('Upload had no file body')
}

let client: S3Client | undefined
function s3() {
  client ??= new S3Client({ region: env('AWS_REGION') || 'ap-south-1' })
  return client
}

// Local development keeps files on disk. When S3_BUCKET is set, uploads go to that stage's bucket
// and are served from its CDN. Replacing a file uses a new prefix, and the old object is left in
// place so a page that still points at the previous URL keeps working.
export function storagePlugins(): Plugin[] {
  const bucket = env('S3_BUCKET')
  if (!bucket || !cdnHost()) {
    return [
      s3Storage({
        enabled: false,
        alwaysInsertFields: true,
        bucket: bucket || 'local',
        collections: { media: true },
        config: { region: env('AWS_REGION') || 'ap-south-1' },
      }),
    ]
  }

  return [
    cloudStoragePlugin({
      alwaysInsertFields: true,
      collections: {
        media: {
          prefix: 'media',
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => publicMediaUrl(prefix, filename),
          adapter: () => ({
            name: 's3',
            generateURL: ({ filename, prefix }) => publicMediaUrl(prefix, filename),
            handleDelete: async () => {},
            handleUpload: async ({ file, storageFilePath }) => {
              await s3().send(
                new PutObjectCommand({
                  Bucket: bucket,
                  Key: storageFilePath,
                  Body: fileBody(file),
                  ContentType: file.mimeType,
                  CacheControl: 'public, max-age=31536000, immutable',
                }),
              )
            },
            staticHandler: (_req, { params }) => Response.redirect(publicMediaUrl(params.prefix, params.filename), 302),
          }),
        },
      },
    }),
  ]
}
