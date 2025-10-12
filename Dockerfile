# Multi-stage build for OCBC Mobile Pro
# Stage 1: Build the application
FROM nexus.ocbc.com:8443/node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies using OCBC Nexus registry
RUN npm ci --registry=https://nexus.ocbc.com:8443/repository/OCBC_NPM/ --strict-ssl=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with nginx
FROM nexus.ocbc.com:8443/nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist-browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

