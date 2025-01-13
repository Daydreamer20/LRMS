#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Default values
DOMAIN=""
EMAIL=""
SSL_DIR="./nginx/ssl"
STAGING=0
FORCE_RENEWAL=0

# Function to display script usage
usage() {
    echo "Usage: $0 [OPTIONS] COMMAND"
    echo "Commands:"
    echo "  create      Create new SSL certificate"
    echo "  renew       Renew existing certificate"
    echo "  check       Check certificate status"
    echo "  backup      Backup certificates"
    echo "  restore     Restore certificates from backup"
    echo
    echo "Options:"
    echo "  -d, --domain      Domain name"
    echo "  -e, --email      Email address for Let's Encrypt notifications"
    echo "  -s, --staging     Use Let's Encrypt staging environment"
    echo "  -f, --force      Force certificate renewal"
    echo "  -h, --help       Display this help message"
    exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -d|--domain)
            DOMAIN="$2"
            shift
            shift
            ;;
        -e|--email)
            EMAIL="$2"
            shift
            shift
            ;;
        -s|--staging)
            STAGING=1
            shift
            ;;
        -f|--force)
            FORCE_RENEWAL=1
            shift
            ;;
        -h|--help)
            usage
            ;;
        create|renew|check|backup|restore)
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

# Create SSL directory if it doesn't exist
mkdir -p "$SSL_DIR"

# Function to check if certbot is installed
check_certbot() {
    if ! command -v certbot &> /dev/null; then
        echo "Error: certbot is not installed"
        echo "Please install certbot first:"
        echo "  Ubuntu/Debian: sudo apt-get install certbot"
        echo "  CentOS/RHEL: sudo yum install certbot"
        exit 1
    fi
}

# Function to create new certificate
create_certificate() {
    if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
        echo "Error: Domain and email are required for certificate creation"
        usage
    fi
    
    echo "Creating SSL certificate for $DOMAIN..."
    
    # Build certbot command
    cmd="certbot certonly --webroot"
    cmd="$cmd -w /var/www/html"
    cmd="$cmd -d $DOMAIN"
    cmd="$cmd --email $EMAIL"
    cmd="$cmd --agree-tos --non-interactive"
    
    if [ $STAGING -eq 1 ]; then
        cmd="$cmd --staging"
    fi
    
    # Run certbot
    if ! eval "$cmd"; then
        echo "Error: Failed to create certificate"
        exit 1
    fi
    
    # Copy certificates to nginx ssl directory
    cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem "$SSL_DIR/"
    cp /etc/letsencrypt/live/$DOMAIN/privkey.pem "$SSL_DIR/"
    
    echo "Certificate created successfully"
}

# Function to renew certificate
renew_certificate() {
    echo "Renewing SSL certificate..."
    
    cmd="certbot renew"
    if [ $FORCE_RENEWAL -eq 1 ]; then
        cmd="$cmd --force-renewal"
    fi
    
    if [ $STAGING -eq 1 ]; then
        cmd="$cmd --staging"
    fi
    
    # Run certbot
    if ! eval "$cmd"; then
        echo "Error: Failed to renew certificate"
        exit 1
    fi
    
    # Reload nginx if certificate was renewed
    if [ -f "/var/run/nginx.pid" ]; then
        nginx -s reload
    fi
    
    echo "Certificate renewal completed"
}

# Function to check certificate status
check_certificate() {
    if [ -z "$DOMAIN" ]; then
        echo "Checking all certificates..."
        certbot certificates
    else
        echo "Checking certificate for $DOMAIN..."
        certbot certificates --domain "$DOMAIN"
    fi
}

# Function to backup certificates
backup_certificates() {
    local backup_dir="$SSL_DIR/backup"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$backup_dir/ssl_backup_$timestamp.tar.gz"
    
    echo "Backing up SSL certificates..."
    
    # Create backup directory
    mkdir -p "$backup_dir"
    
    # Create backup
    tar -czf "$backup_file" -C "$SSL_DIR" $(ls "$SSL_DIR" | grep -v backup)
    
    echo "Backup created: $backup_file"
}

# Function to restore certificates
restore_certificates() {
    local backup_dir="$SSL_DIR/backup"
    
    if [ ! -d "$backup_dir" ]; then
        echo "Error: No backups found"
        exit 1
    fi
    
    # List available backups
    echo "Available backups:"
    ls -1 "$backup_dir"
    
    # Ask for backup file
    echo
    read -p "Enter backup file name to restore: " backup_file
    
    if [ ! -f "$backup_dir/$backup_file" ]; then
        echo "Error: Backup file not found"
        exit 1
    fi
    
    echo "Restoring from backup: $backup_file"
    
    # Create temporary directory
    local temp_dir=$(mktemp -d)
    
    # Extract backup
    tar -xzf "$backup_dir/$backup_file" -C "$temp_dir"
    
    # Copy files to SSL directory
    cp -r "$temp_dir"/* "$SSL_DIR/"
    
    # Cleanup
    rm -rf "$temp_dir"
    
    echo "Certificates restored successfully"
}

# Check certbot installation
check_certbot

# Execute command
case $COMMAND in
    create)
        create_certificate
        ;;
    renew)
        renew_certificate
        ;;
    check)
        check_certificate
        ;;
    backup)
        backup_certificates
        ;;
    restore)
        restore_certificates
        ;;
    *)
        echo "Error: Invalid command"
        usage
        ;;
esac

echo "SSL certificate management completed successfully!" 