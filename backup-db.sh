#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Default values
BACKUP_DIR="./backups"
BACKUP_RETENTION_DAYS=30
MONGODB_CONTAINER="mongodb"

# Function to display script usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  -d, --directory     Backup directory (default: ./backups)"
    echo "  -r, --retention     Number of days to keep backups (default: 30)"
    echo "  -c, --container     MongoDB container name (default: mongodb)"
    echo "  -h, --help         Display this help message"
    exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -d|--directory)
            BACKUP_DIR="$2"
            shift
            shift
            ;;
        -r|--retention)
            BACKUP_RETENTION_DAYS="$2"
            shift
            shift
            ;;
        -c|--container)
            MONGODB_CONTAINER="$2"
            shift
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate backup filename with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/mongodb_backup_$TIMESTAMP.gz"

echo "Starting MongoDB backup..."
echo "Backup file: $BACKUP_FILE"

# Check if MongoDB container is running
if ! docker ps | grep -q "$MONGODB_CONTAINER"; then
    echo "Error: MongoDB container '$MONGODB_CONTAINER' is not running"
    exit 1
fi

# Create backup
echo "Creating backup..."
docker exec -t "$MONGODB_CONTAINER" mongodump --archive --gzip > "$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ] && [ -f "$BACKUP_FILE" ]; then
    echo "Backup completed successfully"
    echo "Backup size: $(du -h "$BACKUP_FILE" | cut -f1)"
else
    echo "Error: Backup failed"
    rm -f "$BACKUP_FILE"
    exit 1
fi

# Clean up old backups
echo "Cleaning up backups older than $BACKUP_RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "mongodb_backup_*.gz" -type f -mtime +$BACKUP_RETENTION_DAYS -delete

# List remaining backups
echo "Current backups:"
ls -lh "$BACKUP_DIR"

# Verify backup integrity
echo "Verifying backup integrity..."
if gzip -t "$BACKUP_FILE"; then
    echo "Backup integrity verified"
else
    echo "Error: Backup file may be corrupted"
    exit 1
fi

# Create backup report
REPORT_FILE="$BACKUP_DIR/backup_report_$TIMESTAMP.txt"
{
    echo "Backup Report"
    echo "============="
    echo "Timestamp: $(date)"
    echo "Backup File: $BACKUP_FILE"
    echo "File Size: $(du -h "$BACKUP_FILE" | cut -f1)"
    echo "MD5 Hash: $(md5sum "$BACKUP_FILE" | cut -d' ' -f1)"
    echo "Retention Days: $BACKUP_RETENTION_DAYS"
    echo "Status: Success"
} > "$REPORT_FILE"

echo "Backup report created: $REPORT_FILE"

# Optional: Upload backup to remote storage
if [ -n "$BACKUP_REMOTE_PATH" ]; then
    echo "Uploading backup to remote storage..."
    # Add your upload logic here (e.g., aws s3 cp, rsync, etc.)
    # Example for AWS S3:
    # aws s3 cp "$BACKUP_FILE" "s3://$BACKUP_REMOTE_PATH/"
fi

echo "Backup process completed successfully!" 