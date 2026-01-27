#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

# Read SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from env or .env
SUPABASE_URL="${VITE_SUPABASE_URL}"
SUPABASE_SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
  echo "❌ Error: Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment"
  echo "Please ensure your .env file contains:"
  echo "  VITE_SUPABASE_URL=your_supabase_url"
  echo "  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
  exit 1
fi

echo "🚀 Setting up Supabase storage buckets..."
echo "📍 Using Supabase URL: ${SUPABASE_URL}"

# Create tour-images bucket using service role key
echo "Creating tour-images bucket..."
RESPONSE=$(curl -s -X POST \
  "${SUPABASE_URL}/storage/v1/b" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "tour-images",
    "public": true,
    "file_size_limit": 5242880
  }')

if echo "$RESPONSE" | grep -q "already exists"; then
  echo "✓ tour-images bucket already exists"
elif echo "$RESPONSE" | grep -q "tour-images"; then
  echo "✓ tour-images bucket created successfully"
else
  echo "⚠️  Bucket creation returned: $RESPONSE"
  echo ""
  echo "📝 To fix this, ensure SUPABASE_SERVICE_KEY is set in your .env file"
  echo "Or create the bucket manually:"
  echo "  1. Go to https://supabase.com/dashboard"
  echo "  2. Select your project"
  echo "  3. Click 'Storage' in the sidebar"
  echo "  4. Click 'Create a new bucket'"
  echo "  5. Name: 'tour-images', set to Public"
fi

echo ""
echo "✅ Storage setup script complete!"

