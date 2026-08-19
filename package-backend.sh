#!/bin/bash
# Exit on error
set -e

echo "=== 1. Building Backend ==="
npm run build --workspace=Backend

echo "=== 2. Packaging Backend for HostAfrica ==="
# Clean old files
rm -f Backend/backend_deployment.zip

# Create a temporary staging directory
STAGING_DIR="temp_backend_deploy"
rm -rf "$STAGING_DIR"
mkdir -p "$STAGING_DIR"

# Copy required production files to the staging folder
cp -r Backend/dist "$STAGING_DIR/dist"
cp Backend/app.cjs "$STAGING_DIR/app.cjs"
cp Backend/package.json "$STAGING_DIR/package.json"
cp Backend/package-lock.json "$STAGING_DIR/package-lock.json"
cp Backend/.env "$STAGING_DIR/.env"

# Zip the contents of the staging folder
cd "$STAGING_DIR"
zip -r ../Backend/backend_deployment.zip .
cd ..

# Clean up staging directory
rm -rf "$STAGING_DIR"

echo "========================================================="
echo " SUCCESS: Backend/backend_deployment.zip has been generated!"
echo " Please upload this zip to your HostAfrica 'backend' folder"
echo "========================================================="
