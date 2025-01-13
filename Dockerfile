FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the app
RUN npm run build

# Expose the port
EXPOSE 10000

# The port will be provided by Railway's environment variable
ENV PORT=10000

# Start the production server
CMD ["npm", "run", "server"] 