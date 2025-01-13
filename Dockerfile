FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Build the React app
RUN npm run build

# Verify build output and contents
RUN echo "Verifying build directory..." && \
    ls -la && \
    echo "Build directory contents:" && \
    ls -la build/

# Expose the port
EXPOSE 10000

# Start the server
CMD ["npm", "run", "server"] 