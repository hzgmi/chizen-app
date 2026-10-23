const fs = require('fs');
const path = require('path');
const file = path.join('.github', 'workflows', 'android.yml');

if (!fs.existsSync(file)) {
  console.log('❌ لم يتم العثور على android.yml');
  process.exit(1);
}

let content = fs.readFileSync(file, 'utf8');
const original = content;

// تحديث إصدار Node.js إلى 22
content = content.replace(/node-version:\s*['"]?[0-9.x]+['"]?/g, "node-version: '22'");

// إذا لم يكن هناك إعداد Node.js، نضيفه
if (!content.includes('setup-node')) {
  content = content.replace(/(steps:\s*\n)/, "$1      - name: Setup Node.js\n        uses: actions/setup-node@v4\n        with:\n          node-version: '22'\n          cache: 'npm'\n");
}

if (content !== original) {
  fs.writeFileSync(file, content);
  console.log('✅ تم تحديث android.yml لاستخدام Node.js 22');
} else {
  console.log('ℹ️ لا تغييرات مطلوبة أو الإصدار محدث مسبقاً');
}
