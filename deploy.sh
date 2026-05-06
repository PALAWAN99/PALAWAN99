#!/bin/bash

# ==============================================================================
# Deploy Script for QR Gate Access System
# ==============================================================================

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Deployment Process...${NC}"

# 1. Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Initializing git repository...${NC}"
    git init
fi

# 2. Add remote if not exists
REMOTE_URL="https://github.com/Panuwath/qrcode-accesscontrol"
if ! git remote | grep -q "origin"; then
    echo -e "${YELLOW}Adding remote origin: ${REMOTE_URL}${NC}"
    git remote add origin $REMOTE_URL
else
    # Update remote URL just in case
    git remote set-url origin $REMOTE_URL
fi

# 3. Handle commit message
COMMIT_MSG=$1
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="feat: Initial commit for QR Gate Access System (Next.js 16 + Prisma 7 + Mantine v9)"
fi

echo -e "${YELLOW}Stage changes...${NC}"
git add .

# 4. Check if there are changes to commit
if git diff --cached --quiet; then
    echo -e "${BLUE}✨ No changes to commit.${NC}"
else
    echo -e "${YELLOW}Committing changes: ${COMMIT_MSG}${NC}"
    git commit -m "$COMMIT_MSG"
fi

# 5. Push to main
echo -e "${BLUE}📤 Pushing to GitHub...${NC}"
# Use -u on first push or if branch not tracked
git push -u origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully deployed to GitHub!${NC}"
else
    echo -e "\033[0;31m❌ Deployment failed. Please check your git configuration and network.${NC}"
    exit 1
fi
