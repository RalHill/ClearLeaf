#!/bin/bash
# Bundle Analysis Script - Analyzes Next.js bundle size

echo "🔍 Starting Bundle Analysis..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "❌ node_modules not found. Running npm install..."
  npm install
fi

# Build with analysis
echo "📦 Building with bundle analysis..."
ANALYZE=true npm run build

echo ""
echo "✅ Bundle analysis complete!"
echo ""
echo "📊 Key Metrics:"
echo "  - Check .next/static/chunks/ for chunk sizes"
echo "  - Bundles over 100KB should be code-split"
echo "  - Target: < 150KB gzipped for main bundle"
echo ""

# Display bundle size info
echo "📁 Build Output Size:"
du -sh .next

echo ""
echo "🎯 Optimization Tips:"
echo "  1. Use dynamic imports for heavy components"
echo "  2. Lazy load routes with next/dynamic"
echo "  3. Tree-shake unused dependencies"
echo "  4. Use Tailwind's purge CSS"
echo "  5. Compress images with sharp"
echo ""
