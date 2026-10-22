#!/usr/bin/env bash
# Build the public site and publish it to S3 + CloudFront.
# Needs: AWS CLI configured, S3_BUCKET and CLOUDFRONT_ID set. CMS_URL to pull published CMS content.
set -euo pipefail
: "${S3_BUCKET:?set S3_BUCKET}" "${CLOUDFRONT_ID:?set CLOUDFRONT_ID}"
cd "$(dirname "$0")/../web"

npm ci
npm run build

# Long cache for hashed assets, short cache for HTML and data so edits show quickly.
aws s3 sync out/_next "s3://$S3_BUCKET/_next" --delete --cache-control "public,max-age=31536000,immutable"
aws s3 sync out "s3://$S3_BUCKET" --delete --exclude "_next/*" --cache-control "public,max-age=300"
aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_ID" --paths "/*" >/dev/null
echo "Published to s3://$S3_BUCKET"
