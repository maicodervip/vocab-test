#!/bin/bash

echo "🚀 Deploy to GitHub Pages"
echo "=========================="
echo ""

# Build project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Initialize git if needed
if [ ! -d ".git" ]; then
    echo "📦 Initializing git..."
    git init
    git add .
    git commit -m "Initial commit"
fi

# Check if gh-pages branch exists
if git show-ref --verify --quiet refs/heads/gh-pages; then
    echo "🗑️  Removing old gh-pages branch..."
    git branch -D gh-pages
fi

# Create orphan gh-pages branch
echo "🌿 Creating gh-pages branch..."
git checkout --orphan gh-pages

# Remove all files except dist
git rm -rf .
git clean -fxd

# Move dist contents to root
cp -r dist/* .
rm -rf dist

# Create .nojekyll to bypass Jekyll processing
touch .nojekyll

# Add and commit
git add .
git commit -m "Deploy to GitHub Pages"

echo ""
echo "✅ Prepared for GitHub Pages!"
echo ""
echo "📝 Next steps:"
echo "=============="
echo ""
echo "1. Create a new repository on GitHub:"
echo "   https://github.com/new"
echo "   Name: vocab-tester"
echo ""
echo "2. Push to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/vocab-tester.git"
echo "   git push -f origin gh-pages"
echo ""
echo "3. Enable GitHub Pages:"
echo "   Go to: Settings → Pages"
echo "   Source: Deploy from branch"
echo "   Branch: gh-pages"
echo "   Click Save"
echo ""
echo "4. Your site will be at:"
echo "   https://YOUR_USERNAME.github.io/vocab-tester/"
echo ""
echo "⚠️  NOTE: To return to main branch:"
echo "   git checkout main"
