#!/bin/bash

echo "🎯 Setup Git và Deploy Vocab Tester"
echo "===================================="
echo ""

# Initialize git if not exists
if [ ! -d ".git" ]; then
    echo "📦 Khởi tạo Git repository..."
    git init
    echo "✅ Git đã được khởi tạo!"
    echo ""
fi

# Add all files
echo "📝 Thêm files vào Git..."
git add .

# Commit
echo "💾 Commit changes..."
git commit -m "Initial commit - Vocab Tester with user authentication" || true

echo ""
echo "✅ Setup hoàn tất!"
echo ""
echo "🚀 Các bước tiếp theo để deploy:"
echo "================================"
echo ""
echo "CÁCH 1: Deploy qua Vercel CLI"
echo "------------------------------"
echo "1. Cài Vercel CLI:"
echo "   npm install -g vercel"
echo ""
echo "2. Login:"
echo "   vercel login"
echo ""
echo "3. Deploy:"
echo "   vercel --prod"
echo ""
echo ""
echo "CÁCH 2: Deploy qua GitHub + Vercel"
echo "-----------------------------------"
echo "1. Tạo repository trên GitHub:"
echo "   https://github.com/new"
echo ""
echo "2. Push code lên GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/vocab-tester.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Import vào Vercel:"
echo "   https://vercel.com/new"
echo "   → Chọn repository vocab-tester"
echo "   → Click Deploy"
echo ""
echo ""
echo "📖 Chi tiết: Xem file DEPLOY.md"
