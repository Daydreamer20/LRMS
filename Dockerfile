FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Expose the port
EXPOSE 10000

# Start the server
CMD ["node", "server.js"] 