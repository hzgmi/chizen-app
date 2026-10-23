const Jimp = require('./node_modules/jimp');
const fs = require('fs');
const path = require('path');

const RES = './android/app/src/main/res';
const LOGO = './logo-original.png';

const sizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

const splashSizes = {
  'drawable': [2732, 2732],
  'drawable-land-mdpi': [480, 320],
  'drawable-land-hdpi': [800, 480],
  'drawable-land-xhdpi': [1280, 720],
  'drawable-land-xxhdpi': [1600, 960],
  'drawable-land-xxxhdpi': [1920, 1280],
  'drawable-port-mdpi': [320, 480],
  'drawable-port-hdpi': [480, 800],
  'drawable-port-xhdpi': [720, 1280],
  'drawable-port-xxhdpi': [960, 1600],
  'drawable-port-xxxhdpi': [1280, 1920]
};

(async () => {
  const logo = await Jimp.read(LOGO);
  console.log('📐 الشعار الأصلي: ' + logo.bitmap.width + '×' + logo.bitmap.height);
  
  console.log('\n🎨 توليد الأيقونات:');
  for (const [folder, size] of Object.entries(sizes)) {
    const dir = path.join(RES, folder);
    fs.mkdirSync(dir, { recursive: true });
    
    const icon = logo.clone().resize(size, size);
    await icon.writeAsync(path.join(dir, 'ic_launcher.png'));
    await icon.clone().writeAsync(path.join(dir, 'ic_launcher_round.png'));
    
    const fgSize = Math.round(size * 1.5);
    const fg = new Jimp(fgSize, fgSize, 0x0a0a15ff);
    const centeredLogo = logo.clone().resize(Math.round(fgSize * 0.66), Math.round(fgSize * 0.66));
    fg.composite(
      centeredLogo,
      Math.round((fgSize - centeredLogo.bitmap.width) / 2),
      Math.round((fgSize - centeredLogo.bitmap.height) / 2)
    );
    await fg.writeAsync(path.join(dir, 'ic_launcher_foreground.png'));
    console.log('  ✅ ' + folder + ' (' + size + '×' + size + ')');
  }
  
  console.log('\n🎨 Adaptive Icons:');
  const anyDpi = path.join(RES, 'mipmap-anydpi-v26');
  fs.mkdirSync(anyDpi, { recursive: true });
  
  const adaptiveXml = '<?xml version="1.0" encoding="utf-8"?>\n' +
    '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n' +
    '    <background android:drawable="@color/ic_launcher_background"/>\n' +
    '    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>\n' +
    '</adaptive-icon>';
  
  fs.writeFileSync(path.join(anyDpi, 'ic_launcher.xml'), adaptiveXml);
  fs.writeFileSync(path.join(anyDpi, 'ic_launcher_round.xml'), adaptiveXml);
  console.log('  ✅ mipmap-anydpi-v26/ic_launcher.xml');
  
  const valuesDir = path.join(RES, 'values');
  fs.mkdirSync(valuesDir, { recursive: true });
  const colorsPath = path.join(valuesDir, 'ic_launcher_background.xml');
  fs.writeFileSync(colorsPath, '<?xml version="1.0" encoding="utf-8"?>\n' +
    '<resources>\n    <color name="ic_launcher_background">#0a0a15</color>\n</resources>');
  console.log('  ✅ values/ic_launcher_background.xml');
  
  console.log('\n🎬 توليد شاشات البداية:');
  for (const [folder, [w, h]] of Object.entries(splashSizes)) {
    const dir = path.join(RES, folder);
    fs.mkdirSync(dir, { recursive: true });
    
    const splash = new Jimp(w, h, 0x0a0a15ff);
    const logoSize = Math.round(Math.min(w, h) * 0.4);
    const resized = logo.clone().resize(logoSize, logoSize);
    splash.composite(
      resized,
      Math.round((w - logoSize) / 2),
      Math.round((h - logoSize) / 2)
    );
    await splash.writeAsync(path.join(dir, 'splash.png'));
    console.log('  ✅ ' + folder + ' (' + w + '×' + h + ')');
  }
  
  console.log('\n📦 تجهيز resources/:');
  const resourcesDir = './resources';
  fs.mkdirSync(resourcesDir, { recursive: true });
  
  const icon1024 = logo.clone().resize(1024, 1024);
  await icon1024.writeAsync(path.join(resourcesDir, 'icon.png'));
  
  const splashMain = new Jimp(2732, 2732, 0x0a0a15ff);
  const logoSplash = logo.clone().resize(1100, 1100);
  splashMain.composite(
    logoSplash,
    Math.round((2732 - 1100) / 2),
    Math.round((2732 - 1100) / 2)
  );
  await splashMain.writeAsync(path.join(resourcesDir, 'splash.png'));
  await splashMain.writeAsync(path.join(resourcesDir, 'splash-dark.png'));
  
  console.log('  ✅ icon.png (1024×1024)');
  console.log('  ✅ splash.png (2732×2732)');
  console.log('  ✅ splash-dark.png (2732×2732)');
  
  console.log('\n════════════════════════════════════════');
  console.log('  ✅ اكتمل توليد جميع الأصول');
  console.log('════════════════════════════════════════');
})().catch(e => { console.error('❌', e.message); process.exit(1); });
