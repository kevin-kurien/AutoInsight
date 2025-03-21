FROM node:18-alpine 

# Set working directory
WORKDIR /app

# Copy package files
COPY app/package.json ./
COPY app/package-lock.json* ./
RUN npm install

# Copy all files
COPY app/ .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

CMD ["npm", "start"]