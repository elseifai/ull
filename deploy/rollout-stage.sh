#!/usr/bin/env bash
# Publish one stage: CMS image to that stage's EC2, static site to its buckets.
# Uses AWS profile ull-aws-cursor-vaibhav unless the caller already has session credentials.
set -euo pipefail
STAGE="${1:?usage: rollout-stage.sh uat|prod}"
case "$STAGE" in
  uat) STACK=UllUat ;;
  prod) STACK=UllProd ;;
  *) echo "stage must be uat or prod" >&2; exit 1 ;;
esac

if [[ -z "${AWS_SESSION_TOKEN:-}${AWS_ACCESS_KEY_ID:-}" ]]; then
  export AWS_PROFILE="${AWS_PROFILE:-ull-aws-cursor-vaibhav}"
fi
export AWS_REGION=ap-south-1
export AWS_DEFAULT_REGION=ap-south-1
export AWS_PAGER=""

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

eval "$(python3 - "$STACK" << 'PY'
import json, shlex, subprocess, sys
stack = sys.argv[1]
raw = subprocess.check_output([
    "aws", "cloudformation", "describe-stacks",
    "--stack-name", stack, "--region", "ap-south-1",
    "--query", "Stacks[0].Outputs", "--output", "json",
])
for item in json.loads(raw):
    print(f"export {item['OutputKey']}={shlex.quote(item['OutputValue'])}")
PY
)"

: "${SiteBucketName:?}" "${MediaBucketName:?}" "${SiteDistributionId:?}" "${CdnDistributionId:?}"
: "${SiteUrl:?}" "${CdnHost:?}" "${EcrRepositoryUri:?}"

export NEXT_PUBLIC_SITE_URL="$SiteUrl"
export NEXT_PUBLIC_API_URL="${SiteUrl}/api"
export NEXT_PUBLIC_CMS_URL="$SiteUrl"
export NEXT_PUBLIC_CDN_URL="https://${CdnHost}"
export CDN_URL="$NEXT_PUBLIC_CDN_URL"
export CDN_BUCKET="$MediaBucketName"
export S3_BUCKET="$SiteBucketName"
export CLOUDFRONT_ID="$SiteDistributionId"

if [[ "${SITE_ONLY:-}" == "true" ]]; then
  export CMS_URL="$SiteUrl"
else
  unset CMS_URL || true
  SHA="$(git rev-parse --short HEAD)"
  IMAGE="${EcrRepositoryUri}:${SHA}"
  aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin "${EcrRepositoryUri%%/*}"
  docker build --platform linux/amd64 -t "$IMAGE" -t "${EcrRepositoryUri}:current" cms
  docker push "$IMAGE"
  docker push "${EcrRepositoryUri}:current"
fi

bash "$ROOT/deploy/deploy-web.sh"
aws cloudfront create-invalidation --distribution-id "$CdnDistributionId" --paths "/*" >/dev/null || true

if [[ "${SITE_ONLY:-}" == "true" ]]; then
  echo "Published site for $STAGE at $SiteUrl"
  exit 0
fi

: "${InstanceId:?}" "${PayloadSecretArn:?}" "${PostgresSecretArn:?}" "${HookSecretArn:?}" "${BackupBucketName:?}"
: "${PrivateBucketName:?missing: run 'cd infra && npx cdk deploy $STACK' first (adds the private documents bucket)}"

python3 - "$ROOT" "$InstanceId" "$IMAGE" "$SiteUrl" "${AltOrigin:-}" "$MediaBucketName" "$CdnHost" "$BackupBucketName" "$PrivateBucketName" "$STAGE" "$PayloadSecretArn" "$PostgresSecretArn" "$HookSecretArn" << 'PY'
import json, subprocess, sys, time, pathlib, base64
root, instance, image, site, alt, bucket, cdn, backup, private, stage, payload_arn, postgres_arn, hook_arn = sys.argv[1:]
compose = pathlib.Path(root, "deploy/docker-compose.aws.yml").read_bytes()
remote = pathlib.Path(root, "deploy/remote-up.sh").read_bytes()
script = f"""
set -euo pipefail
mkdir -p /opt/ull
echo {base64.b64encode(compose).decode()} | base64 -d > /opt/ull/docker-compose.yml
echo {base64.b64encode(remote).decode()} | base64 -d > /opt/ull/remote-up.sh
chmod +x /opt/ull/remote-up.sh
export CMS_IMAGE={image}
export SITE_URL={site}
export ALT_ORIGIN={alt}
export S3_BUCKET={bucket}
export CDN_HOST={cdn}
export BACKUP_BUCKET={backup}
export PRIVATE_BUCKET={private}
export STAGE={stage}
export PAYLOAD_SECRET_ARN={payload_arn}
export POSTGRES_SECRET_ARN={postgres_arn}
export HOOK_SECRET_ARN={hook_arn}
export AWS_REGION=ap-south-1
/opt/ull/remote-up.sh
"""
params = pathlib.Path("/tmp/ull-ssm-params.json")
params.write_text(json.dumps({"commands": [script]}))
for _ in range(40):
    info = subprocess.run([
        "aws", "ssm", "describe-instance-information", "--region", "ap-south-1",
        "--filters", f"Key=InstanceIds,Values={instance}",
        "--query", "InstanceInformationList[0].PingStatus", "--output", "text",
    ], capture_output=True, text=True)
    if info.stdout.strip() == "Online":
        break
    time.sleep(15)
else:
    sys.exit("instance never registered with Systems Manager")
sent = subprocess.check_output([
    "aws", "ssm", "send-command", "--region", "ap-south-1",
    "--instance-ids", instance, "--document-name", "AWS-RunShellScript",
    "--timeout-seconds", "900", "--parameters", f"file://{params}",
    "--query", "Command.CommandId", "--output", "text",
], text=True).strip()
while True:
    time.sleep(10)
    inv = subprocess.run([
        "aws", "ssm", "get-command-invocation", "--region", "ap-south-1",
        "--command-id", sent, "--instance-id", instance, "--output", "json",
    ], capture_output=True, text=True)
    if inv.returncode != 0:
        continue
    body = json.loads(inv.stdout)
    status = body.get("Status")
    if status in ("Pending", "InProgress", "Delayed"):
        continue
    print(body.get("StandardOutputContent", ""))
    print(body.get("StandardErrorContent", ""), file=sys.stderr)
    if status != "Success":
        sys.exit(f"remote start {status}")
    break
PY

echo "Deployed $STAGE at $SiteUrl (CDN https://${CdnHost})"
