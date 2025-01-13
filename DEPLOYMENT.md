# Deployment Guide

This guide provides instructions for deploying the Evaluation Event Management System to production.

## Prerequisites

1. Node.js v18 or higher
2. MongoDB Atlas account
3. Domain name (for SSL/TLS)
4. Email service account (e.g., Gmail)
5. SSL certificate (if not using a reverse proxy)

## Production Checklist

### 1. MongoDB Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create a database user with appropriate permissions
4. Whitelist your production server's IP address
5. Get your MongoDB connection string
6. Replace the placeholder in your production .env file

### 2. Environment Configuration

1. Copy `.env.example` to `.env`
2. Update all configuration values:
   ```bash
   # Generate a strong JWT secret
   node generate-secret.js
   
   # Update MongoDB URI
   MONGODB_URI=your_actual_mongodb_uri
   
   # Set production environment
   NODE_ENV=production
   
   # Configure email service
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_actual_email
   EMAIL_PASSWORD=your_app_specific_password
   
   # Set frontend URL
   FRONTEND_URL=https://your-domain.com
   
   # Configure CORS
   CORS_ALLOWED_ORIGINS=https://your-domain.com
   
   # Configure rate limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

### 3. SSL/TLS Configuration

#### Option 1: Using a Reverse Proxy (Recommended)
1. Set up Nginx or Apache as a reverse proxy
2. Configure SSL/TLS termination at the proxy level
3. Set `SSL_ENABLED=false` in .env

#### Option 2: Direct SSL
1. Obtain SSL certificate
2. Update SSL configuration in .env:
   ```bash
   SSL_ENABLED=true
   SSL_KEY_PATH=/path/to/private.key
   SSL_CERT_PATH=/path/to/certificate.crt
   ```

### 4. Production Build

1. Install dependencies:
   ```bash
   npm ci
   ```

2. Ensure all files are in place:
   ```
   ├── server.js
   ├── package.json
   ├── .env
   ├── src/
   │   ├── config/
   │   ├── controllers/
   │   ├── middleware/
   │   ├── models/
   │   └── routes/
   └── logs/
   ```

### 5. Process Management

1. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```

2. Create ecosystem.config.js:
   ```javascript
   module.exports = {
     apps: [{
       name: 'evaluation-events',
       script: 'server.js',
       instances: 'max',
       exec_mode: 'cluster',
       env_production: {
         NODE_ENV: 'production'
       },
       error_file: 'logs/error.log',
       out_file: 'logs/output.log',
       merge_logs: true,
       log_date_format: 'YYYY-MM-DD HH:mm:ss'
     }]
   };
   ```

3. Start the application:
   ```bash
   pm2 start ecosystem.config.js --env production
   ```

4. Save PM2 process list:
   ```bash
   pm2 save
   ```

5. Setup PM2 startup script:
   ```bash
   pm2 startup
   ```

### 6. Monitoring

1. Basic monitoring with PM2:
   ```bash
   pm2 monit
   ```

2. View logs:
   ```bash
   # Application logs
   pm2 logs evaluation-events
   
   # Access logs
   tail -f access.log
   
   # Error logs
   tail -f error.log
   ```

### 7. Security Considerations

1. Ensure firewall is properly configured
2. Only open necessary ports (80, 443)
3. Set up DDoS protection
4. Configure regular backups
5. Set up monitoring and alerting
6. Implement proper logging rotation

### 8. Maintenance

1. Set up log rotation:
   ```bash
   sudo nano /etc/logrotate.d/evaluation-events
   ```
   Add:
   ```
   /path/to/app/logs/*.log {
       daily
       rotate 14
       compress
       delaycompress
       notifempty
       create 0640 node node
       sharedscripts
       postrotate
           pm2 reloadLogs
       endscript
   }
   ```

2. Regular updates:
   ```bash
   # Update dependencies
   npm audit
   npm update
   
   # Restart application
   pm2 reload evaluation-events
   ```

### 9. Backup Strategy

1. Database backups:
   - Enable MongoDB Atlas backups
   - Configure regular snapshots
   - Test restore procedures

2. Application backups:
   - Back up .env file
   - Back up SSL certificates
   - Back up custom configurations

### 10. Troubleshooting

1. Check application status:
   ```bash
   pm2 status
   ```

2. View recent logs:
   ```bash
   pm2 logs evaluation-events --lines 100
   ```

3. Monitor resources:
   ```bash
   pm2 monit
   ```

4. Check MongoDB connection:
   ```bash
   curl http://localhost:8080/health
   ```

## Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Environment variables properly set
- [ ] SSL/TLS certificates installed
- [ ] Dependencies installed with `npm ci`
- [ ] PM2 installed and configured
- [ ] Logging setup completed
- [ ] Firewall rules configured
- [ ] Monitoring tools installed
- [ ] Backup strategy implemented
- [ ] DNS records updated
- [ ] Health check endpoint verified
- [ ] Email service configured and tested 