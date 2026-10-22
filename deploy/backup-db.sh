#!/usr/bin/env bash
# Nightly Postgres backup to S3. Cron: 0 2 * * * /opt/ull/deploy/backup-db.sh
set -euo pipefail
: "${BACKUP_BUCKET:?set BACKUP_BUCKET}"
cd "$(dirname "$0")"
file="ull_cms_$(date +%F).sql.gz"
docker compose exec -T db pg_dump -U ull ull_cms | gzip > "/tmp/$file"
aws s3 cp "/tmp/$file" "s3://$BACKUP_BUCKET/db/$file"
rm "/tmp/$file"
