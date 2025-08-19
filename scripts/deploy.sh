#!/bin/bash

# Nexus Encryption - Deployment Script
# This script handles deployment for all platforms

set -e

echo "🚀 Nexus Encryption - Deployment Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
print_status "Node.js version: $NODE_VERSION"

# Check if all dependencies are installed
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found. Installing dependencies..."
    npm install
fi

# Run tests first
print_status "Running tests..."
npm run test:all

if [ $? -eq 0 ]; then
    print_success "All tests passed!"
else
    print_error "Tests failed. Please fix issues before deploying."
    exit 1
fi

# Type check
print_status "Running TypeScript check..."
npm run typecheck

if [ $? -eq 0 ]; then
    print_success "TypeScript check passed!"
else
    print_error "TypeScript check failed. Please fix issues before deploying."
    exit 1
fi

# Build the application
print_status "Building application..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Build completed successfully!"
else
    print_error "Build failed. Please fix issues before deploying."
    exit 1
fi

# Export static files
print_status "Exporting static files..."
npm run export

if [ $? -eq 0 ]; then
    print_success "Static export completed!"
else
    print_error "Static export failed."
    exit 1
fi

# Function to deploy web version
deploy_web() {
    print_status "Deploying web version..."
    
    if [ -d "out" ]; then
        print_success "Web build ready in 'out' directory"
        print_status "You can deploy the 'out' directory to any static hosting service:"
        echo "  - Vercel: vercel --prod"
        echo "  - Netlify: netlify deploy --prod --dir=out"
        echo "  - GitHub Pages: Copy 'out' contents to gh-pages branch"
        echo "  - AWS S3: aws s3 sync out/ s3://your-bucket-name"
    else
        print_error "Web build directory 'out' not found"
        exit 1
    fi
}

# Function to build desktop version
build_desktop() {
    print_status "Building desktop application..."
    
    # Check if Electron is available
    if ! command -v electron &> /dev/null; then
        print_warning "Electron not found globally. Using local installation..."
    fi
    
    npm run electron:build
    
    if [ $? -eq 0 ]; then
        print_success "Desktop build completed!"
        print_status "Desktop builds available in 'dist-electron' directory"
    else
        print_error "Desktop build failed."
        exit 1
    fi
}

# Function to build Docker image
build_docker() {
    print_status "Building Docker image..."
    
    # Check if Docker is available
    if ! command -v docker &> /dev/null; then
        print_error "Docker not found. Please install Docker to build container image."
        return 1
    fi
    
    docker build -t nexus-encryption:latest .
    
    if [ $? -eq 0 ]; then
        print_success "Docker image built successfully!"
        print_status "To run the container:"
        echo "  docker run -p 8080:80 nexus-encryption:latest"
    else
        print_error "Docker build failed."
        return 1
    fi
}

# Main deployment logic
case "${1:-all}" in
    "web")
        deploy_web
        ;;
    "desktop")
        build_desktop
        ;;
    "docker")
        build_docker
        ;;
    "all")
        deploy_web
        echo ""
        build_desktop
        echo ""
        build_docker
        ;;
    *)
        echo "Usage: $0 [web|desktop|docker|all]"
        echo ""
        echo "Options:"
        echo "  web     - Deploy web version only"
        echo "  desktop - Build desktop version only"
        echo "  docker  - Build Docker image only"
        echo "  all     - Deploy all versions (default)"
        exit 1
        ;;
esac

echo ""
print_success "Deployment completed successfully!"
echo ""
echo "🎉 Nexus Encryption is ready for production!"
echo ""
echo "📋 Next steps:"
echo "  1. Web: Deploy 'out' directory to your hosting service"
echo "  2. Desktop: Distribute files from 'dist-electron' directory"
echo "  3. Docker: Push image to your container registry"
echo ""
echo "🔐 Security reminder: Ensure all production secrets are properly configured."
