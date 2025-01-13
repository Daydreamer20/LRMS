# Use Node.js as base
FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the app
RUN npm run build

# Install serve
RUN npm install -g serve

# Expose the required port for Hugging Face Spaces
EXPOSE 7860

# Start the application on port 7860 (required by Hugging Face)
CMD ["serve", "-s", "build", "-l", "7860"] 