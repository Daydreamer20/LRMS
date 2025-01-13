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

# Verify build output
RUN if [ ! -d "build" ]; then echo "Build directory is missing!" && exit 1; fi
RUN if [ ! -f "build/index.html" ]; then echo "index.html is missing!" && exit 1; fi
RUN echo "Build directory contents:" && ls -la build/

# Expose the port
EXPOSE 10000

# Start the server
CMD ["npm", "run", "server"] 