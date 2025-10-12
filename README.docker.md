# OCBC Mobile Pro - Docker Deployment Guide

## 📦 Docker Files Overview

- **Dockerfile** - Production build with nginx
- **Dockerfile.dev** - Development build with hot reload
- **docker-compose.yml** - Production deployment with optional Appium
- **docker-compose.dev.yml** - Development environment
- **nginx.conf** - Nginx configuration for serving the app
- **docker-build.sh** - Automated build and push script
- **.dockerignore** - Files to exclude from Docker context

## 🚀 Quick Start

### Production Deployment

```bash
# Build and run with docker-compose
docker-compose up -d

# Access the application
open http://localhost:8080
```

### Development with Hot Reload

```bash
# Run development server
docker-compose -f docker-compose.dev.yml up

# Access the application
open http://localhost:5174
```

## 🔨 Building the Image

### Option 1: Using Build Script (Recommended)

```bash
# Make script executable (if not already)
chmod +x docker-build.sh

# Run the build script
./docker-build.sh
```

### Option 2: Manual Build

```bash
# Build the image
docker build -t ocbc-mobile-pro:latest .

# Tag for registry
docker tag ocbc-mobile-pro:latest nexus.ocbc.com:8443/ocbc-mobile-pro:latest

# Push to registry
docker push nexus.ocbc.com:8443/ocbc-mobile-pro:latest
```

## 📝 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| NODE_ENV | production | Environment mode |
| FRONTEND_PORT | 8080 | Port for nginx server |

### Using OCBC Nexus Registry

All base images are pulled from OCBC Nexus registry:
- `nexus.ocbc.com:8443/node:20-alpine`
- `nexus.ocbc.com:8443/nginx:alpine`

NPM packages are installed from:
- `https://nexus.ocbc.com:8443/repository/OCBC_NPM/`

## 🎯 Running Options

### 1. Frontend Only (Connect to External Appium)

```bash
docker-compose up frontend
```

Then connect to your external Appium server (e.g., `http://host.docker.internal:4723`)

### 2. Frontend + Appium Server

```bash
# Run both services
docker-compose up -d

# Frontend: http://localhost:8080
# Appium: http://localhost:4723
```

### 3. Development Mode

```bash
docker-compose -f docker-compose.dev.yml up

# Hot reload enabled
# Frontend: http://localhost:5174
```

## 🔧 Advanced Usage

### Running Appium Only (Optional Profile)

```bash
# If you want Appium as optional
docker-compose --profile with-appium up
```

### Custom Port Mapping

```bash
docker run -p 3000:8080 ocbc-mobile-pro:latest
```

### With Environment Variables

```bash
docker run -p 8080:8080 \
  -e NODE_ENV=production \
  ocbc-mobile-pro:latest
```

## 📊 Health Checks

The container includes health checks:

```bash
# Check container health
docker ps

# Check health endpoint
curl http://localhost:8080/health
```

## 🐛 Troubleshooting

### Container won't start

```bash
# Check logs
docker logs ocbc-mobile-pro-frontend

# Check if port is already in use
lsof -i :8080
```

### Cannot connect to Appium

If running Appium on host machine:
- Use `http://host.docker.internal:4723` (Mac/Windows)
- Use `http://172.17.0.1:4723` (Linux)

### NPM install fails

Ensure you have access to OCBC Nexus registry:

```bash
# Test connection
curl -k https://nexus.ocbc.com:8443/repository/OCBC_NPM/
```

## 📦 Image Details

### Production Image Layers

1. **Builder Stage**: Builds the application
   - Base: node:20-alpine
   - Installs dependencies
   - Builds production bundle

2. **Runtime Stage**: Serves with nginx
   - Base: nginx:alpine
   - Copies built assets
   - Configured for SPA routing
   - Gzip compression enabled

### Image Size

- Production image: ~50-60 MB (nginx + built assets)
- Development image: ~500 MB (includes node_modules)

## 🔐 Security

- Runs as non-root user in nginx
- Security headers configured
- No sensitive data in image
- Health checks enabled
- SSL verification disabled for internal Nexus (as per OCBC policy)

## 📝 Maintenance

### Updating the Image

```bash
# Rebuild with latest changes
docker-compose build --no-cache

# Restart services
docker-compose up -d
```

### Cleaning Up

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (if any)
docker-compose down -v

# Remove old images
docker image prune -a
```

## 🌐 Network Configuration

### Docker Network

- Network name: `ocbc-mobile-pro-network`
- Type: Bridge network
- Allows frontend and Appium to communicate

### Accessing from Host

- Frontend: `http://localhost:8080`
- Appium: `http://localhost:4723`

### Accessing between containers

- Frontend can reach Appium at: `http://appium:4723`

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Appium Documentation](https://appium.io/docs/)

## 🆘 Support

For issues related to:
- Docker deployment: Contact DevOps team
- OCBC Nexus registry: Contact Infrastructure team
- Application bugs: Create issue in repository

