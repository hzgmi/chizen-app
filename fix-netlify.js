const fs = require('fs');
const file = 'netlify.toml';
let toml = fs.readFileSync(file, 'utf8');
const original = toml;

// إضافة استثناء chizen.html قبل القاعدة العامة (إن لم يكن موجوداً)
if (toml.indexOf('/chizen.html') === -1) {
  const exception = `[[redirects]]
  from = "/chizen.html"
  to = "/chizen.html"
  status = 200
  force = false

`;
  // نضعه قبل قاعدة /*  العامة
  const idx = toml.indexOf('[[redirects]]');
  if (idx !== -1) {
    toml = toml.slice(0, idx) + exception + toml.slice(idx);
    fs.writeFileSync(file, toml);
    console.log('✅ تم إضافة استثناء chizen.html قبل القاعدة العامة');
  } else {
    console.log('⚠️ لم يجد [[redirects]] — لم يتم التعديل');
  }
} else {
  console.log('ℹ️ الاستثناء موجود مسبقاً');
}

// عرض الملف النهائي
console.log('\n════════ netlify.toml النهائي ════════');
console.log(fs.readFileSync(file, 'utf8'));
