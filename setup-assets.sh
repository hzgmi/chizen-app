#!/data/data/com.termux/files/usr/bin/bash
set -e
echo "════════════════════════════════════════"
echo "  🎨 تجهيز الأيقونة وشاشة البداية"
echo "════════════════════════════════════════"
echo "📦 تثبيت jimp..."
if [ ! -d "node_modules/jimp" ]; then
  npm install jimp --no-audit --no-fund --silent
fi
echo "✅ jimp جاهز"
echo "📥 تحميل الشعار..."
mkdir -p resources
curl -sL -o logo-original.png "https://i.ibb.co/FkvCmDwy/logo.png"
LOGO_SIZE=$(wc -c < logo-original.png)
echo "✅ تم تحميل الشعار ($LOGO_SIZE bytes)"
echo "🎨 توليد الأيقونات..."
node gen-assets.js
echo ""
echo "✅ اكتمل التوليد"
