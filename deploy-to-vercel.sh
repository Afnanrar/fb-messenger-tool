#!/bin/bash

echo "🚀 Vercel + Supabase Deployment Script"
echo "======================================"
echo ""

# Check if git remote is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Git remote not set. Please run:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/fb-messenger-tool.git"
    echo ""
    echo "Replace YOUR_USERNAME with your actual GitHub username"
    exit 1
fi

echo "✅ Git remote is configured"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
else
    echo "✅ Vercel CLI is installed"
fi

echo ""
echo "🔧 Next steps:"
echo "1. Run: vercel login"
echo "2. Run: vercel"
echo "3. Follow the prompts to deploy"
echo ""
echo "📚 For detailed instructions, see VERCEL_SUPABASE_SETUP.md"
echo ""
echo "🚀 Ready to deploy? Run: vercel"
