#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Default values
BACKUP_DIR="./backups"
MONGODB_CONTAINER="mongodb"

# Function to display script usage
usage() {
    echo "Usage: $0 [OPTIONS] BACKUP_FILE"
    echo "Options:"
    echo "  -d, --directory     Backup directory (default: ./backups)"
    echo "  -c, --container     MongoDB container name (default: mongodb)"
    echo "  -f, --force        Force restore without confirmation"
    echo "  -h, --help         Display this help message"
    exit 1
}

# Parse command line arguments
FORCE=0
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -d|--directory)
            BACKUP_DIR="$2"
            shift
            shift
            ;;
        -c|--container)
            MONGODB_CONTAINER="$2"
            shift
            shift
            ;;
        -f|--force)
            FORCE=1
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            BACKUP_FILE="$1"
            shift
            ;;
    esac
done

# Check if backup file is provided
if [ -z "$BACKUP_FILE" ]; then
    echo "Error: No backup file specified"
    usage
fi

# If backup file doesn't include path, prepend backup directory
if [[ "$BACKUP_FILE" != *"/"* ]]; then
    BACKUP_FILE="$BACKUP_DIR/$BACKUP_FILE"
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    echo "Available backups:"
    ls -lh "$BACKUP_DIR"
    exit 1
fi

# Check if MongoDB container is running
if ! docker ps | grep -q "$MONGODB_CONTAINER"; then
    echo "Error: MongoDB container '$MONGODB_CONTAINER' is not running"
    exit 1
fi

# Verify backup file integrity
echo "Verifying backup integrity..."
if ! gzip -t "$BACKUP_FILE"; then
    echo "Error: Backup file is corrupted"
    exit 1
fi

# Show backup information
echo "Backup file: $BACKUP_FILE"
echo "File size: $(du -h "$BACKUP_FILE" | cut -f1)"
echo "Last modified: $(stat -c %y "$BACKUP_FILE")"

# Confirm restore unless force flag is set
if [ $FORCE -eq 0 ]; then
    echo
    echo "WARNING: This will overwrite the current database!"
    echo "Press CTRL+C to cancel or ENTER to continue..."
    read
fi

# Create temporary backup of current data
echo "Creating temporary backup of current data..."
TEMP_BACKUP="$BACKUP_DIR/pre_restore_$(date +%Y%m%d_%H%M%S).gz"
docker exec -t "$MONGODB_CONTAINER" mongodump --archive --gzip > "$TEMP_BACKUP"

# Perform restore
echo "Starting database restore..."
if docker exec -i "$MONGODB_CONTAINER" mongorestore --drop --archive --gzip < "$BACKUP_FILE"; then
    echo "Restore completed successfully"
else
    echo "Error: Restore failed"
    echo "Rolling back to previous state..."
    docker exec -i "$MONGODB_CONTAINER" mongorestore --drop --archive --gzip < "$TEMP_BACKUP"
    echo "Rollback completed"
    rm -f "$TEMP_BACKUP"
    exit 1
fi

# Create restore report
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_FILE="$BACKUP_DIR/restore_report_$TIMESTAMP.txt"
{
    echo "Restore Report"
    echo "=============="
    echo "Timestamp: $(date)"
    echo "Backup File: $BACKUP_FILE"
    echo "File Size: $(du -h "$BACKUP_FILE" | cut -f1)"
    echo "MD5 Hash: $(md5sum "$BACKUP_FILE" | cut -d' ' -f1)"
    echo "Temporary Backup: $TEMP_BACKUP"
    echo "Status: Success"
} > "$REPORT_FILE"

echo "Restore report created: $REPORT_FILE"

# Keep temporary backup for safety
echo "Temporary backup saved as: $TEMP_BACKUP"
echo "You can delete it manually once you verify the restore was successful"

echo "Restore process completed successfully!" 