#!/bin/bash
# Database Backup Script
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups"
DB_NAME="qrgate"
DB_USER="user"

mkdir -p $BACKUP_DIR

echo "Starting backup of $DB_NAME..."
docker exec qr-gate-db pg_dump -U $DB_USER $DB_NAME > $BACKUP_DIR/backup_$TIMESTAMP.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -type f -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/backup_$TIMESTAMP.sql"
