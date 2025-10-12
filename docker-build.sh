#!/bin/bash

# OCBC Mobile Pro - Docker Build Script

set -e

echo "=========================================="
echo "OCBC Mobile Pro - Docker Build"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="ocbc-mobile-pro"
VERSION=$(node -p "require('./package.json').version")
REGISTRY="nexus.ocbc.com:8443"
FULL_IMAGE_NAME="${REGISTRY}/${IMAGE_NAME}:${VERSION}"
LATEST_IMAGE_NAME="${REGISTRY}/${IMAGE_NAME}:latest"

echo -e "${YELLOW}Building image: ${FULL_IMAGE_NAME}${NC}"

# Build the Docker image
echo -e "${YELLOW}Step 1: Building Docker image...${NC}"
docker build -t ${IMAGE_NAME}:${VERSION} -t ${IMAGE_NAME}:latest .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful!${NC}"
else
    echo -e "${RED}✗ Build failed!${NC}"
    exit 1
fi

# Tag for registry
echo -e "${YELLOW}Step 2: Tagging image for registry...${NC}"
docker tag ${IMAGE_NAME}:${VERSION} ${FULL_IMAGE_NAME}
docker tag ${IMAGE_NAME}:latest ${LATEST_IMAGE_NAME}

echo -e "${GREEN}✓ Tagged successfully!${NC}"
echo -e "${GREEN}Image: ${FULL_IMAGE_NAME}${NC}"
echo -e "${GREEN}Image: ${LATEST_IMAGE_NAME}${NC}"

# Push to registry (optional)
echo ""
echo -e "${YELLOW}Do you want to push to registry? (y/n)${NC}"
read -r push_choice

if [ "$push_choice" = "y" ] || [ "$push_choice" = "Y" ]; then
    echo -e "${YELLOW}Step 3: Pushing to registry...${NC}"
    docker push ${FULL_IMAGE_NAME}
    docker push ${LATEST_IMAGE_NAME}
    echo -e "${GREEN}✓ Pushed successfully!${NC}"
else
    echo -e "${YELLOW}Skipping push to registry${NC}"
fi

# Summary
echo ""
echo "=========================================="
echo -e "${GREEN}Build Summary${NC}"
echo "=========================================="
echo "Image Name: ${IMAGE_NAME}"
echo "Version: ${VERSION}"
echo "Registry: ${REGISTRY}"
echo ""
echo "To run locally:"
echo "  docker run -p 8080:8080 ${IMAGE_NAME}:latest"
echo ""
echo "To run with docker-compose:"
echo "  docker-compose up -d"
echo ""
echo "=========================================="

