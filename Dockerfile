# Use Node.js LTS version
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install PM2 globally
RUN npm install pm2 -g

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Create logs directory
RUN mkdir -p logs

# Create volume for logs
VOLUME [ "/usr/src/app/logs" ]

# Expose port
EXPOSE 8080

# Use PM2 to run the application
CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"] 