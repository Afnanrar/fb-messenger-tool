#!/bin/bash

echo "�� Setting up Facebook Messenger SaaS Tool..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.local.example .env.local 2>/dev/null || echo "Please configure your .env.local file with your credentials"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. Configure your .env.local file with:"
echo "   - Facebook App credentials"
echo "   - Supabase credentials"
echo "   - App URL"
echo ""
echo "2. Set up your Supabase database using the migration file:"
echo "   lib/supabase/migrations/001_initial_schema.sql"
echo ""
echo "3. Configure your Facebook app with:"
echo "   - OAuth redirect URIs"
echo "   - Webhook endpoint"
echo "   - Required permissions"
echo ""
echo "4. Run the development server:"
echo "   npm run dev"
echo ""
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For detailed setup instructions, see README.md"
