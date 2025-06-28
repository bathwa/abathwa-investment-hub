#!/bin/bash

# =====================================================
# PRODUCTION SETUP SCRIPT
# =====================================================
# This script prepares the application for production use

echo "🚀 Starting production setup for Abathwa Investment Hub..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building the application..."
npm run build

# Build the server
echo "🔨 Building the server..."
npm run build:server

# Run type checking
echo "🔍 Running type checks..."
npm run type-check
npm run type-check:server

# Run linting
echo "🔍 Running linting..."
npm run lint:fix

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p scripts
mkdir -p logs

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📄 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please update the .env file with your production credentials"
fi

# Create production configuration
echo "⚙️  Creating production configuration..."

# Create a production database cleanup script
cat > scripts/production-cleanup.sql << 'EOF'
-- Production Database Cleanup
-- Run this script to clean any test/mock data

-- Delete any test users (excluding admin users)
DELETE FROM users 
WHERE email NOT IN ('abathwabiz@gmail.com', 'admin@abathwa.com')
AND (
  full_name ILIKE '%test%' 
  OR full_name ILIKE '%mock%' 
  OR full_name ILIKE '%demo%'
  OR email ILIKE '%test%'
  OR email ILIKE '%mock%'
  OR email ILIKE '%demo%'
);

-- Delete any test opportunities
DELETE FROM opportunities 
WHERE title ILIKE '%test%' 
   OR title ILIKE '%mock%' 
   OR title ILIKE '%demo%';

-- Delete any test transactions
DELETE FROM transactions 
WHERE reference_number ILIKE '%TEST%'
   OR reference_number ILIKE '%MOCK%'
   OR reference_number ILIKE '%DEMO%';

-- Delete any test pools
DELETE FROM investment_pools 
WHERE name ILIKE '%test%' 
   OR name ILIKE '%mock%' 
   OR name ILIKE '%demo%';

-- Verify cleanup
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Opportunities', COUNT(*) FROM opportunities
UNION ALL
SELECT 'Transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'Investment Pools', COUNT(*) FROM investment_pools;
EOF

echo "✅ Production setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update your .env file with production credentials"
echo "2. Run the database cleanup script: scripts/production-cleanup.sql"
echo "3. Start the production server: npm start"
echo "4. Monitor the application logs"
echo ""
echo "🔧 For development: npm run dev:full"
echo "🚀 For production: npm start" 