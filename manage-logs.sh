#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Default values
LOG_DIR="./logs"
RETENTION_DAYS=7
MAX_SIZE_MB=100
COMPRESS_LOGS=0

# Function to display script usage
usage() {
    echo "Usage: $0 [OPTIONS] COMMAND"
    echo "Commands:"
    echo "  rotate     Rotate logs based on size and age"
    echo "  clean      Clean old logs"
    echo "  compress   Compress old logs"
    echo "  stats      Show log statistics"
    echo
    echo "Options:"
    echo "  -d, --directory     Log directory (default: ./logs)"
    echo "  -r, --retention     Days to keep logs (default: 7)"
    echo "  -s, --size         Maximum log size in MB (default: 100)"
    echo "  -c, --compress     Compress logs older than 1 day"
    echo "  -h, --help         Display this help message"
    exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -d|--directory)
            LOG_DIR="$2"
            shift
            shift
            ;;
        -r|--retention)
            RETENTION_DAYS="$2"
            shift
            shift
            ;;
        -s|--size)
            MAX_SIZE_MB="$2"
            shift
            shift
            ;;
        -c|--compress)
            COMPRESS_LOGS=1
            shift
            ;;
        -h|--help)
            usage
            ;;
        rotate|clean|compress|stats)
            COMMAND="$1"
            shift
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Check if command is provided
if [ -z "$COMMAND" ]; then
    echo "Error: No command specified"
    usage
fi

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Function to rotate logs
rotate_logs() {
    echo "Rotating logs..."
    
    # Find log files larger than MAX_SIZE_MB
    find "$LOG_DIR" -type f -name "*.log" -size +"$MAX_SIZE_MB"M | while read -r log_file; do
        echo "Rotating $log_file"
        mv "$log_file" "$log_file.$(date +%Y%m%d_%H%M%S)"
        touch "$log_file"
    done
}

# Function to clean old logs
clean_logs() {
    echo "Cleaning logs older than $RETENTION_DAYS days..."
    
    # Find and delete old log files
    find "$LOG_DIR" -type f -name "*.log.*" -mtime +"$RETENTION_DAYS" -delete
    
    # Find and delete old compressed logs
    find "$LOG_DIR" -type f -name "*.log.*.gz" -mtime +"$RETENTION_DAYS" -delete
}

# Function to compress logs
compress_logs() {
    echo "Compressing logs..."
    
    # Find rotated logs older than 1 day and not already compressed
    find "$LOG_DIR" -type f -name "*.log.*" ! -name "*.gz" -mtime +1 | while read -r log_file; do
        echo "Compressing $log_file"
        gzip -9 "$log_file"
    done
}

# Function to show log statistics
show_stats() {
    echo "Log Statistics"
    echo "=============="
    echo
    echo "Log Directory: $LOG_DIR"
    echo "Total Size: $(du -sh "$LOG_DIR" | cut -f1)"
    echo
    echo "File Count:"
    echo "- Active logs: $(find "$LOG_DIR" -type f -name "*.log" | wc -l)"
    echo "- Rotated logs: $(find "$LOG_DIR" -type f -name "*.log.*" ! -name "*.gz" | wc -l)"
    echo "- Compressed logs: $(find "$LOG_DIR" -type f -name "*.log.*.gz" | wc -l)"
    echo
    echo "Largest Files:"
    find "$LOG_DIR" -type f -name "*.log*" -exec ls -lh {} + | sort -rh -k5 | head -n 5
    echo
    echo "Recent Activity:"
    find "$LOG_DIR" -type f -name "*.log*" -mtime -1 -ls | tail -n 5
}

# Execute command
case $COMMAND in
    rotate)
        rotate_logs
        ;;
    clean)
        clean_logs
        ;;
    compress)
        compress_logs
        ;;
    stats)
        show_stats
        ;;
    *)
        echo "Error: Invalid command"
        usage
        ;;
esac

# Compress logs if enabled
if [ $COMPRESS_LOGS -eq 1 ]; then
    compress_logs
fi

echo "Log management completed successfully!" 