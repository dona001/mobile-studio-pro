# OCBC Mobile Pro - Docker Setup

## 📋 Files
- `Dockerfile` - Builds the application
- `docker-compose.yml` - Runs the container
- `.dockerignore` - Excludes unnecessary files

## 🚀 Quick Start

### Build and Run
```bash
docker-compose up -d
```

### Access Application
```bash
open http://localhost:8080
```

### View Logs
```bash
docker logs ocbc-mobile-pro
```

### Stop
```bash
docker-compose down
```

## 🔌 Connect to Appium

In the OCBC Mobile Pro app, connect to:
- **Host Appium**: `http://host.docker.internal:4723`
- **Port**: `4723`

## 📱 Using with Your Emulator

1. Start your Android emulator on host machine
2. Start Appium on host machine:
   ```bash
   appium --allow-cors
   ```
3. Start OCBC Mobile Pro:
   ```bash
   docker-compose up -d
   ```
4. Open browser: `http://localhost:8080`
5. Configure connection to `http://host.docker.internal:4723`
6. Use your YouTube capabilities from `youtube-test-capabilities.json`

## 🛠️ Commands

| Command | Description |
|---------|-------------|
| `docker-compose build` | Build the image |
| `docker-compose up -d` | Start in background |
| `docker-compose up` | Start with logs |
| `docker-compose down` | Stop and remove |
| `docker-compose restart` | Restart container |
| `docker logs ocbc-mobile-pro` | View logs |
| `docker exec -it ocbc-mobile-pro sh` | Shell access |

## 📊 Configuration

- **Container name**: `ocbc-mobile-pro`
- **Port**: `8080`
- **Base image**: `nexus.ocbc.com:8443/node:20-alpine`
- **NPM registry**: `https://nexus.ocbc.com:8443/repository/OCBC_NPM/`

## ✅ That's it! Simple and clean.

