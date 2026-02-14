#!/bin/bash
set -e

# Wait for MongoDB to be ready
until mongosh --host mongodb --port "$DB_PORT" -u "$DB_USER" -p "$DB_PASSWORD" --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
  echo "Waiting for MongoDB to be ready..."
  sleep 2
done

mongosh --host mongodb --port "$DB_PORT" -u "$DB_USER" -p "$DB_PASSWORD" <<EOF2
rs.initiate({
  _id: 'rs0',
  members: [
    { _id: 0, host: 'mongodb:$DB_PORT' }
  ]
});
EOF2

