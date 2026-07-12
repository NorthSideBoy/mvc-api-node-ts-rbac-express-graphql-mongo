#!/bin/bash
set -e
: "${DB_PORT:?DB_PORT is required}"
KEYFILE=/data/db/mongodb-keyfile
openssl rand -base64 756 > "$KEYFILE"
chmod 400 "$KEYFILE"
chown mongodb:mongodb "$KEYFILE"
exec docker-entrypoint.sh mongod --keyFile "$KEYFILE" --replSet rs0 --bind_ip_all --port "${DB_PORT}"
