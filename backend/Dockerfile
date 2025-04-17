FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose API port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]