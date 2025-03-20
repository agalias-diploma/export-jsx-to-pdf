#!/bin/bash

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${RED}Starting destruction process of nginx sservice${NC}"

# Stopping and disabling Nginx
echo -e "${YELLOW}Stopping Nginx...${NC}"
sudo systemctl stop nginx || echo -e "${RED}Failed to stop Nginx${NC}"

echo -e "${YELLOW}Disabling Nginx...${NC}"
sudo systemctl disable nginx || echo -e "${RED}Failed to disable Nginx${NC}"

# Removing Nginx site configuration
echo -e "${YELLOW}Removing Nginx site configuration...${NC}"
sudo rm -f /etc/nginx/sites-available/frontend
sudo rm -f /etc/nginx/sites-enabled/frontend
sudo nginx -t || echo -e "${RED}Warning: Nginx configuration test failed${NC}"

# Restarting Nginx to apply changes
echo -e "${YELLOW}Restarting Nginx to apply changes...${NC}"
sudo systemctl restart nginx || echo -e "${RED}Failed to restart Nginx${NC}"

# Removing frontend build directory
FRONTEND_BUILD_DIR="/home/ubuntu/frontend/build"
if [ -d "$FRONTEND_BUILD_DIR" ]; then
    echo -e "${YELLOW}Removing frontend build directory: $FRONTEND_BUILD_DIR${NC}"
    sudo rm -rf "$FRONTEND_BUILD_DIR"
    echo -e "${GREEN}Frontend build directory removed successfully.${NC}"
else
    echo -e "${YELLOW}Frontend build directory does not exist. Skipping...${NC}"
fi

echo -e "${GREEN}Destruction process completed!${NC}"
