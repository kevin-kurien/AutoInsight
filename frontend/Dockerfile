FROM node:18-alpine as build

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

# Production environment
FROM nginx:alpine

# Copy built files
COPY --from=build /app/build /usr/share/nginx/html

# Create Nginx config
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 5000

CMD ["nginx", "-g", "daemon off;"]