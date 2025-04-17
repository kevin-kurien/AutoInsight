FROM node:18-alpine 

# Set working directory
WORKDIR /app

# Copy package files
COPY app/package.json ./
COPY app/package-lock.json* ./
RUN npm install

# Copy all files
COPY app/ .

# For debugging
RUN ls -la

# Build the application
RUN npm run build

# For debugging and verifying next was created
RUN ls -la .next || echo "No .next  directory found"

# Expose port
EXPOSE 3000

CMD ["npm", "run", "dev"]