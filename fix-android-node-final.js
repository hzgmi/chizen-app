const fs = require('fs');
const path = require('path');
const file = path.join('.github', 'workflows', 'android.yml');
let yml = fs.readFileSync(file, 'utf8');

// 1) استبدال setup-node@v5 بـ v4 (أكثر استقرارًا مع Node 22)
yml = yml.replace(/uses:\s*actions\/setup-node@v5/g, 'uses: actions/setup-node@v4');
yml = yml.replace(/uses:\s*actions\/setup-node@v4\s*\n\s*with:\s*\{\s*node-version:\s*['"]22['"]\s*\}/g, `uses: actions/setup-node@v4
        with:
          node-version: '22'
          check-latest: true`);

// 2) إضافة خطوة "التحقق من الإصدار وتثبيت Capacitor CLI" قبل "Add Android"
const versionCheckStep = `
      - name: Verify Node.js version
        run: |
          node -v
          npm -v
          npm install -g @capacitor/cli@latest
`;
// نضعها قبل خطوة "Add Android & Sync"
yml = yml.replace(/(\s*-\s*name:\s*Add Android\s*&\s*Sync)/, versionCheckStep + '$1');

fs.writeFileSync(file, yml);
console.log('✅ تم تحديث android.yml لفرض Node 22 والتحقق من الإصدار.');
