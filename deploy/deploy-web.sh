#!/usr/bin/env bash
# Build the public site and publish it to S3 + CloudFront.
# Needs: AWS CLI configured, S3_BUCKET and CLOUDFRONT_ID set. CMS_URL to pull published CMS content.
# CDN_BUCKET and NEXT_PUBLIC_CDN_URL publish versioned brand images to the stage CDN first.
set -euo pipefail
: "${S3_BUCKET:?set S3_BUCKET}" "${CLOUDFRONT_ID:?set CLOUDFRONT_ID}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export AWS_REGION="${AWS_REGION:-ap-south-1}"
export AWS_DEFAULT_REGION="${AWS_DEFAULT_REGION:-$AWS_REGION}"
if [[ -n "${CDN_URL:-}" && -z "${NEXT_PUBLIC_CDN_URL:-}" ]]; then
  export NEXT_PUBLIC_CDN_URL="$CDN_URL"
fi
node "$ROOT/deploy/publish-assets.mjs"
cd "$ROOT/web"

npm ci
npm run build

# Hashed site assets live under /_site so /_next can be the CMS on the same hostname.
# Long cache for hashed assets, short cache for HTML and data so edits show quickly.
aws s3 sync out/_next "s3://$S3_BUCKET/_site/_next" --delete --cache-control "public,max-age=31536000,immutable"
aws s3 sync out "s3://$S3_BUCKET" --delete --exclude "_next/*" --exclude "_site/*" --cache-control "public,max-age=300"
aws s3 rm "s3://$S3_BUCKET/_next" --recursive
aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_ID" --paths "/*" >/dev/null
echo "Published to s3://$S3_BUCKET"
