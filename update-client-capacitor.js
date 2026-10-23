const fs = require('fs');

let configPath = 'capacitor.config.json';
let config = {
  appId: "com.cheezan.app",
  appName: "CHIZEN",
  webDir: "client",
  server: {
    url: "https://jolly-parfait-819acf.netlify.app",
    cleartext: true
  }
};

// لو الملف موجود، نقرأه ونعدل عليه
if (fs.existsSync(configPath)) {
    try {
        const existing = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        config = Object.assign(existing, config); // دمج الإعدادات
    } catch(e) {}
}
// لو فيه ملف ts بنستخدمه أو نمسحه
if (fs.existsSync('capacitor.config.ts')) {
    fs.unlinkSync('capacitor.config.ts'); // مسح الـ ts عشان الـ json يشتغل
}

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('✅ تم تحديث إعدادات Capacitor للعميل لتقرأ من Netlify مباشرة');
