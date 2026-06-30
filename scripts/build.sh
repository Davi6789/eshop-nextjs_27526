# scripts/build.sh 

#!/bin/bash

echo "🔨 Starting Production Build..."

# Load .env.local
if [ -f .env.local ]; then
  echo "📄 Loading .env.local..."
  set -a
  source .env.local
  set +a
fi

# Prüfe Environment Variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "❌ NEXT_PUBLIC_SUPABASE_URL is not set"
  exit 1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set"
  exit 1
fi

# Clean build
echo "🧹 Cleaning .next folder..."
rm -rf .next

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Run type check
echo "🔍 Running TypeScript check..."
bun run type-check

# Run tests
echo "🧪 Running tests..."
bun run test

# Build
echo "🏗️ Building application..."
bun run build

# Check build size
echo "📊 Build size:"
du -sh .next

echo "✅ Build completed successfully!"
