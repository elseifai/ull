#!/bin/bash
# First boot of a UAT or prod CMS instance. Docker, a data disk for Postgres, nothing else.
set -euxo pipefail
exec > /var/log/ull-init.log 2>&1

dnf install -y docker
systemctl enable --now docker

mkdir -p /usr/local/lib/docker/cli-plugins /usr/libexec/docker/cli-plugins
for attempt in 1 2 3 4 5; do
  curl -fsSL -o /usr/local/lib/docker/cli-plugins/docker-compose \
    https://github.com/docker/compose/releases/download/v2.32.4/docker-compose-linux-x86_64 && break
  sleep 5
done
cp /usr/local/lib/docker/cli-plugins/docker-compose /usr/libexec/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose /usr/libexec/docker/cli-plugins/docker-compose
docker compose version

DISK=""
for _ in $(seq 1 60); do
  DISK=$(lsblk -dpn -o NAME,TYPE | awk '$2=="disk" && $1!="/dev/nvme0n1" {print $1; exit}')
  if [ -n "$DISK" ]; then
    break
  fi
  sleep 2
done
if [ -z "$DISK" ]; then
  echo "data disk did not appear" >&2
  exit 1
fi
if ! blkid "$DISK" >/dev/null 2>&1; then
  mkfs.ext4 -F "$DISK"
fi
UUID=$(blkid -s UUID -o value "$DISK")
mkdir -p /opt/ull
grep -q "$UUID" /etc/fstab || echo "UUID=$UUID /opt/ull ext4 defaults,nofail 0 2" >> /etc/fstab
mountpoint -q /opt/ull || mount /opt/ull
mkdir -p /opt/ull/pgdata
echo "ull init done"
