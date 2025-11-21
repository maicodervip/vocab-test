#!/bin/bash

echo "🎯 Deploy to Surge.sh (No authentication needed!)"
echo "=================================================="
echo ""

# Check if surge is installed
if ! command -v surge &> /dev/null; then
    echo "📦 Installing Surge..."
    npm install -g surge
fi

# Build project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Deploy to surge
echo "🚀 Deploying to Surge..."
echo ""
echo "📝 You'll be asked for:"
echo "   - Email (first time only)"
echo "   - Domain name (press Enter for random)"
echo ""

cd dist
surge

echo ""
echo "✅ Deployed successfully!"
echo "📱 Share your link with others!"
