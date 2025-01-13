FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Make sure build directory exists and has correct permissions
RUN ls -la build || echo "Build directory not found"

# Expose the port
EXPOSE 10000

# Start the server
CMD ["npm", "run", "server"] 