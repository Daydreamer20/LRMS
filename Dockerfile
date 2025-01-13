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

# Create logs directory
RUN mkdir -p logs

# Copy app source
COPY . .

# Expose port
EXPOSE 8080

# Use PM2 to run the application
CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"] 