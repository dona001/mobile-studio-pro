# OCBC Mobile Pro - Simple Dockerfile
FROM nexus.ocbc.com:8443/node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies using OCBC Nexus registry
RUN npm ci --registry=https://nexus.ocbc.com:8443/repository/OCBC_NPM/ --strict-ssl=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 8080

# Start preview server (serves built files)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8080"]
