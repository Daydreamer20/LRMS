#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Function to display script usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  -e, --environment   Deployment environment (development|staging|production)"
    echo "  -h, --help         Display this help message"
    exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -e|--environment)
            DEPLOY_ENV="$2"
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

# Validate environment
if [[ ! "$DEPLOY_ENV" =~ ^(development|staging|production)$ ]]; then
    echo "Invalid environment. Please specify development, staging, or production."
    exit 1
fi

echo "Starting deployment for $DEPLOY_ENV environment..."

# Create necessary directories
mkdir -p logs/nginx
mkdir -p logs/app

# Build and deploy based on environment
case $DEPLOY_ENV in
    development)
        echo "Building for development..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml build
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
        ;;
    staging)
        echo "Building for staging..."
        docker-compose -f docker-compose.yml -f docker-compose.staging.yml build
        docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d
        ;;
    production)
        echo "Building for production..."
        # Backup database before deployment
        echo "Creating database backup..."
        BACKUP_FILE="backup-$(date +%Y%m%d_%H%M%S).gz"
        docker-compose exec -T mongodb mongodump --archive --gzip > "backups/$BACKUP_FILE"
        
        # Build and deploy
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
        
        # Verify deployment
        echo "Verifying deployment..."
        sleep 10
        if ! curl -s http://localhost/health | grep -q "healthy"; then
            echo "Deployment verification failed. Rolling back..."
            docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
            exit 1
        fi
        ;;
esac

# Check container status
echo "Checking container status..."
docker-compose ps

# Display logs
echo "Displaying recent logs..."
docker-compose logs --tail=100

echo "Deployment completed successfully!"

# Additional steps for production
if [ "$DEPLOY_ENV" = "production" ]; then
    echo "Running post-deployment tasks..."
    
    # Cleanup old images and volumes
    echo "Cleaning up old Docker images and volumes..."
    docker image prune -f
    docker volume prune -f
    
    # Check SSL certificate expiry
    echo "Checking SSL certificate expiry..."
    if command -v certbot &> /dev/null; then
        certbot certificates
    fi
    
    # Verify MongoDB backup
    echo "Verifying database backup..."
    if [ -f "backups/$BACKUP_FILE" ]; then
        echo "Database backup successful: backups/$BACKUP_FILE"
    else
        echo "Warning: Database backup may have failed"
    fi
fi

# Print deployment info
echo "
Deployment Summary:
------------------
Environment: $DEPLOY_ENV
Timestamp: $(date)
Status: Success
"

# Monitor deployment for a few minutes
if [ "$DEPLOY_ENV" = "production" ]; then
    echo "Monitoring deployment for 5 minutes..."
    end=$((SECONDS+300))
    
    while [ $SECONDS -lt $end ]; do
        if ! docker-compose ps | grep -q "Up"; then
            echo "Warning: Some containers are not running!"
            docker-compose ps
            exit 1
        fi
        sleep 30
    done
    
    echo "Deployment stable after 5 minutes monitoring."
fi 