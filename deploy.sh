#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Error: .env file not found"
    exit 1
fi

# Create required directories
mkdir -p logs nginx/conf.d nginx/ssl nginx/logs

# Check if SSL certificates exist
if [ ! -f nginx/ssl/server.crt ] || [ ! -f nginx/ssl/server.key ]; then
    echo "Warning: SSL certificates not found in nginx/ssl/"
    echo "You need to add your SSL certificates before deploying"
    echo "Required files:"
    echo "  - nginx/ssl/server.crt"
    echo "  - nginx/ssl/server.key"
    exit 1
fi

# Build and deploy
echo "Starting deployment..."

# Stop existing containers
echo "Stopping existing containers..."
docker-compose down

# Remove old images
echo "Removing old images..."
docker image prune -f

# Build new images
echo "Building new images..."
docker-compose build --no-cache

# Start services
echo "Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Check service health
echo "Checking service health..."
docker-compose ps

# Check application logs
echo "Checking application logs..."
docker-compose logs app --tail 50

echo "Deployment completed successfully!"
echo "You can now access the application at:"
echo "  - HTTP:  http://localhost"
echo "  - HTTPS: https://localhost"
echo ""
echo "To view logs:"
echo "  - Application: docker-compose logs app -f"
echo "  - MongoDB:    docker-compose logs mongodb -f"
echo "  - Nginx:      docker-compose logs nginx -f" 