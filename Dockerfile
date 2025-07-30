# Use Node.js 18 as the base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Define build arguments for version information
ARG REACT_APP_VERSION=1.0.0
ARG REACT_APP_GITHUB_VERSION
ARG REACT_APP_GITHUB_TAG

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci

# Copy source code (excluding test files via .dockerignore)
COPY . .

# Build the application with version information
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built application from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 