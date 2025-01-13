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

# The port will be provided by Railway's environment variable
ENV PORT=10000

# Start the Express server
CMD ["npm", "run", "server"] 