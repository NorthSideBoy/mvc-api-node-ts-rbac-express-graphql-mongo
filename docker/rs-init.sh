#!/bin/bash
set -e

: "${DB_PORT:?DB_PORT is required}"
: "${DB_USER:?DB_USER is required}"
: "${DB_PASSWORD:?DB_PASSWORD is required}"

mongosh --host mongodb --port "$DB_PORT" -u "$DB_USER" -p "$DB_PASSWORD" <<EOF2
rs.initiate({
  _id: 'rs0',
  members: [
    { _id: 0, host: 'mongodb:$DB_PORT' }
  ]
});
EOF2
