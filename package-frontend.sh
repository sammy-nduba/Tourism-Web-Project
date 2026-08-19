#!/bin/bash
# Exit on error
set -e

echo "=== 1. Building Admin Panel ==="
npm run build --workspace=Admin

echo "=== 2. Building Frontend Website ==="
npm run build --workspace=Frontend

echo "=== 3. Packaging Frontend Server for HostAfrica ==="
# Clean old files
rm -f frontend_deployment.zip

# Create a temporary staging directory
STAGING_DIR="temp_frontend_deploy"
rm -rf "$STAGING_DIR"
mkdir -p "$STAGING_DIR"

# Copy builds to the staging folder
cp -r Frontend/dist "$STAGING_DIR/dist"
cp -r Admin/dist "$STAGING_DIR/admin"

# Copy Express server, Passenger wrapper, and package.json
cp Frontend/server.js "$STAGING_DIR/server.js"
cp Frontend/app.cjs "$STAGING_DIR/app.cjs"
cp Frontend/server-package.json "$STAGING_DIR/package.json"

# Zip the contents of the staging folder
cd "$STAGING_DIR"
zip -r ../frontend_deployment.zip .
cd ..

# Clean up staging directory
rm -rf "$STAGING_DIR"

echo "========================================================="
echo " SUCCESS: frontend_deployment.zip has been generated!"
echo " Please upload this zip to 'domains/davikithtours.com/public_html'"
echo "========================================================="
