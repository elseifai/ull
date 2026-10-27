#!/bin/bash
# Pull the CMS image and start it next to Postgres. Reads secrets from Secrets Manager.
set -euo pipefail
cd /opt/ull

for _ in $(seq 1 60); do
  if mountpoint -q /opt/ull && docker info >/dev/null 2>&1; then
    break
  fi
  sleep 5
done
mountpoint -q /opt/ull
docker info >/dev/null

REGION="${AWS_REGION:-ap-south-1}"
payload=$(aws secretsmanager get-secret-value --secret-id "$PAYLOAD_SECRET_ARN" --query SecretString --output text --region "$REGION")
postgres=$(aws secretsmanager get-secret-value --secret-id "$POSTGRES_SECRET_ARN" --query SecretString --output text --region "$REGION")
hook=$(aws secretsmanager get-secret-value --secret-id "$HOOK_SECRET_ARN" --query SecretString --output text --region "$REGION")

umask 077
cat > .env << EOF
CMS_IMAGE=${CMS_IMAGE}
POSTGRES_PASSWORD=${postgres}
DATABASE_URL=postgres://ull:${postgres}@db:5432/ull_cms
PAYLOAD_SECRET=${payload}
PAYLOAD_PUBLIC_SERVER_URL=${SITE_URL}
NEXT_PUBLIC_SITE_URL=${SITE_URL}
CORS_ORIGINS=${SITE_URL}$([[ "$STAGE" == "prod" ]] && echo -n ",https://www.ullindia.com")${ALT_ORIGIN:+,${ALT_ORIGIN}}
S3_BUCKET=${S3_BUCKET}
CDN_HOST=${CDN_HOST}
PRIVATE_BUCKET=${PRIVATE_BUCKET}
AWS_REGION=${REGION}
SES_REGION=${REGION}
STAGE=${STAGE}
EOF

if [[ "$hook" == ghp_* || "$hook" == github_pat_* ]]; then
  cat >> .env << EOF
DEPLOY_HOOK_URL=https://api.github.com/repos/elseifai/ull/actions/workflows/deploy.yml/dispatches
DEPLOY_HOOK_TOKEN=${hook}
DEPLOY_HOOK_BODY={"ref":"${STAGE}","inputs":{"stage":"${STAGE}","site_only":"true"}}
EOF
fi

cat > /opt/ull/backup-db.sh << 'EOF'
#!/bin/bash
set -euo pipefail
file="ull_cms_$(date +%F).sql.gz"
docker compose -f /opt/ull/docker-compose.yml --project-directory /opt/ull exec -T db pg_dump -U ull ull_cms | gzip > "/tmp/$file"
aws s3 cp "/tmp/$file" "s3://${BACKUP_BUCKET}/db/$file" --region "${AWS_REGION:-ap-south-1}"
rm -f "/tmp/$file"
EOF
# The backup script needs the bucket name expanded now; the heredoc above is quoted.
sed -i "s|\${BACKUP_BUCKET}|${BACKUP_BUCKET}|g" /opt/ull/backup-db.sh
chmod +x /opt/ull/backup-db.sh
dnf install -y cronie
systemctl enable --now crond
cat > /etc/cron.d/ull-backup << EOF
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin
0 2 * * * root AWS_REGION=${REGION} /opt/ull/backup-db.sh
EOF

registry="${CMS_IMAGE%%/*}"
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$registry"
docker compose pull
docker compose up -d
docker image prune -f
echo "cms is up"
