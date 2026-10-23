const fs = require('fs');
const html = fs.readFileSync('client/chizen.html', 'utf8');

console.log('════════════════════════════════════════');
console.log('  🔍 التحقق من محتوى دوال الإعدادات');
console.log('════════════════════════════════════════\n');

const fns = ['openLang', 'openTheme', 'openFont', 'togBio', 'changePass', 'editProfile', 'deleteAccount', 'clearCache', 'backup', 'togT'];

fns.forEach(fn => {
  // البحث عن الدالة
  const patterns = [
    new RegExp(fn + '\\s*:\\s*(?:async\\s+)?function\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*?)\\n\\s{2,4}\\}', 'g'),
    new RegExp('window\\.' + fn + '\\s*=\\s*(?:async\\s+)?function\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*?)\\n\\s*\\}', 'g'),
    new RegExp(fn + '\\s*:\\s*(?:async\\s*)?\\([^)]*\\)\\s*=>\\s*\\{([\\s\\S]*?)\\n\\s{2,4}\\}', 'g'),
  ];
  
  let match = null;
  let body = '';
  for (const p of patterns) {
    p.lastIndex = 0;
    match = p.exec(html);
    if (match) { body = match[1]; break; }
  }
  
  console.log('═══ ' + fn + ' ═══');
  if (!match) {
    console.log('  ❌ الدالة غير موجودة أو بصيغة غير قياسية.');
  } else {
    const lines = body.split('\n').filter(l => l.trim());
    const lineCount = lines.length;
    const isEmpty = lineCount < 2 || body.replace(/\s/g, '').length < 20;
    const hasToast = body.includes('toast');
    const hasModal = body.includes('openModal') || body.includes('showModal');
    const hasFirebase = body.includes('FB.') || body.includes('firebase');
    
    console.log('  ' + (isEmpty ? '⚠️ فارغة (وهمية)' : '✅ حقيقية') + ' (' + lineCount + ' سطر)');
    console.log('  توست: ' + (hasToast ? 'نعم' : 'لا') + ' | مودال: ' + (hasModal ? 'نعم' : 'لا') + ' | Firebase: ' + (hasFirebase ? 'نعم' : 'لا'));
    console.log('  ' + body.trim().slice(0, 200).replace(/\n/g, '\n    '));
  }
  console.log('');
});
