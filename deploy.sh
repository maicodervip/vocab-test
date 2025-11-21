#!/bin/bash

echo "🚀 Deploying Vocab Tester to Vercel..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI chưa được cài đặt!"
    echo "📦 Cài đặt ngay bây giờ..."
    npm install -g vercel
fi

# Build project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build thành công!"
    echo ""
    
    # Deploy to production
    echo "🚀 Deploying to production..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Deploy thành công! 🎉"
        echo "📱 Bạn có thể chia sẻ link cho người khác!"
    else
        echo "❌ Deploy thất bại!"
        exit 1
    fi
else
    echo "❌ Build thất bại! Vui lòng kiểm tra lỗi."
    exit 1
fi
