#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Default values
CHECK_INTERVAL=60  # seconds
ALERT_THRESHOLD=90 # percent
MONGODB_CONTAINER="mongodb"
API_CONTAINER="api"
NGINX_CONTAINER="nginx"
ALERT_EMAIL=""

# Function to display script usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  -i, --interval     Check interval in seconds (default: 60)"
    echo "  -t, --threshold    Alert threshold percentage (default: 90)"
    echo "  -e, --email       Email address for alerts"
    echo "  -h, --help        Display this help message"
    exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -i|--interval)
            CHECK_INTERVAL="$2"
            shift
            shift
            ;;
        -t|--threshold)
            ALERT_THRESHOLD="$2"
            shift
            shift
            ;;
        -e|--email)
            ALERT_EMAIL="$2"
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

# Function to check container health
check_container_health() {
    local container="$1"
    if ! docker ps | grep -q "$container"; then
        return 1
    fi
    
    local status=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null)
    if [ "$status" = "healthy" ]; then
        return 0
    else
        return 1
    fi
}

# Function to check container resource usage
check_container_resources() {
    local container="$1"
    local stats=$(docker stats "$container" --no-stream --format "{{.CPUPerc}}\t{{.MemPerc}}")
    local cpu_usage=$(echo "$stats" | cut -f1 | sed 's/%//')
    local mem_usage=$(echo "$stats" | cut -f2 | sed 's/%//')
    
    if (( $(echo "$cpu_usage > $ALERT_THRESHOLD" | bc -l) )) || \
       (( $(echo "$mem_usage > $ALERT_THRESHOLD" | bc -l) )); then
        return 1
    fi
    return 0
}

# Function to check MongoDB status
check_mongodb() {
    if ! check_container_health "$MONGODB_CONTAINER"; then
        echo "MongoDB container is not healthy"
        return 1
    fi
    
    # Check MongoDB connection
    if ! docker exec "$MONGODB_CONTAINER" mongosh --eval "db.runCommand({ping: 1})" | grep -q "ok"; then
        echo "MongoDB is not responding"
        return 1
    fi
    
    return 0
}

# Function to check API status
check_api() {
    if ! check_container_health "$API_CONTAINER"; then
        echo "API container is not healthy"
        return 1
    fi
    
    # Check API health endpoint
    if ! curl -s "http://localhost:8080/health" | grep -q "ok"; then
        echo "API health check failed"
        return 1
    fi
    
    return 0
}

# Function to check Nginx status
check_nginx() {
    if ! check_container_health "$NGINX_CONTAINER"; then
        echo "Nginx container is not healthy"
        return 1
    fi
    
    # Check Nginx status
    if ! curl -s "http://localhost/health" | grep -q "healthy"; then
        echo "Nginx health check failed"
        return 1
    fi
    
    return 0
}

# Function to send alert
send_alert() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo "[$timestamp] ALERT: $message"
    
    if [ -n "$ALERT_EMAIL" ]; then
        echo "$message" | mail -s "Application Alert" "$ALERT_EMAIL"
    fi
}

# Function to collect metrics
collect_metrics() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local metrics_file="logs/metrics_$(date +%Y%m%d).log"
    
    # Create metrics directory if it doesn't exist
    mkdir -p logs
    
    # Collect container stats
    {
        echo "[$timestamp] System Metrics"
        echo "-------------------"
        docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
        echo ""
        
        # Collect MongoDB metrics
        if check_container_health "$MONGODB_CONTAINER"; then
            echo "MongoDB Metrics"
            echo "--------------"
            docker exec "$MONGODB_CONTAINER" mongosh --eval "db.serverStatus()"
            echo ""
        fi
        
        # Collect API metrics
        if check_container_health "$API_CONTAINER"; then
            echo "API Metrics"
            echo "-----------"
            curl -s "http://localhost:8080/health"
            echo ""
        fi
        
        # Collect Nginx metrics
        if check_container_health "$NGINX_CONTAINER"; then
            echo "Nginx Metrics"
            echo "-------------"
            curl -s "http://localhost/nginx_status"
            echo ""
        fi
    } >> "$metrics_file"
}

# Main monitoring loop
echo "Starting application monitoring..."
echo "Check interval: $CHECK_INTERVAL seconds"
echo "Alert threshold: $ALERT_THRESHOLD%"
if [ -n "$ALERT_EMAIL" ]; then
    echo "Alert email: $ALERT_EMAIL"
fi
echo

while true; do
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] Running health checks..."
    
    # Check MongoDB
    if ! check_mongodb; then
        send_alert "MongoDB health check failed"
    fi
    
    # Check API
    if ! check_api; then
        send_alert "API health check failed"
    fi
    
    # Check Nginx
    if ! check_nginx; then
        send_alert "Nginx health check failed"
    fi
    
    # Check resource usage
    for container in "$MONGODB_CONTAINER" "$API_CONTAINER" "$NGINX_CONTAINER"; do
        if ! check_container_resources "$container"; then
            send_alert "High resource usage detected in $container"
        fi
    done
    
    # Collect metrics
    collect_metrics
    
    # Wait for next check
    sleep "$CHECK_INTERVAL"
done 