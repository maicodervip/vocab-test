#!/bin/bash

echo "🚀 Setup GitHub Pages - Chuyên Nghiệp"
echo "======================================"
echo ""

# Check git status
if [ ! -d ".git" ]; then
    echo "❌ Git chưa được khởi tạo!"
    exit 1
fi

echo "✅ Git đã sẵn sàng!"
echo ""
echo "📝 Làm theo các bước sau:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "BƯỚC 1: Tạo Repository trên GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Mở: https://github.com/new"
echo "2. Repository name: vocab-tester"
echo "3. Description: Ứng dụng học từ vựng tiếng Nhật"
echo "4. Public (khuyên dùng cho GitHub Pages free)"
echo "5. Không tích: Add README, .gitignore, license"
echo "6. Click: Create repository"
echo ""
read -p "👉 Đã tạo xong? Nhấn Enter để tiếp tục..."
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "BƯỚC 2: Nhập GitHub Username"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "GitHub Username của bạn: " github_username

if [ -z "$github_username" ]; then
    echo "❌ Cần nhập username!"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "BƯỚC 3: Push Code lên GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Add remote
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/$github_username/vocab-tester.git"

echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Push thành công!"
else
    echo ""
    echo "❌ Push thất bại! Có thể cần xác thực."
    echo ""
    echo "💡 Nếu cần token, tạo tại:"
    echo "   https://github.com/settings/tokens"
    echo "   → Generate new token (classic)"
    echo "   → Tick: repo"
    echo "   → Generate token"
    echo ""
    echo "   Sau đó chạy lại:"
    echo "   git push -u origin main"
    echo ""
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "BƯỚC 4: Enable GitHub Pages"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Mở: https://github.com/$github_username/vocab-tester/settings/pages"
echo ""
echo "2. Source: GitHub Actions"
echo ""
echo "3. Chờ vài giây, GitHub Actions sẽ tự động build & deploy"
echo ""
echo "4. Kiểm tra process:"
echo "   https://github.com/$github_username/vocab-tester/actions"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ HOÀN TẤT!"
echo ""
echo "🌐 Website của bạn sẽ có tại:"
echo "   https://$github_username.github.io/vocab-tester/"
echo ""
echo "⏰ Chờ 2-3 phút để GitHub Actions build xong"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔄 TỰ ĐỘNG DEPLOY SAU NÀY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Mỗi khi bạn push code:"
echo ""
echo "  git add ."
echo "  git commit -m \"Update features\""
echo "  git push"
echo ""
echo "GitHub Actions sẽ TỰ ĐỘNG build & deploy!"
echo ""
echo "🎉 Xong rồi đó! Giờ share link cho mọi người thôi!"
