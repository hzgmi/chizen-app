const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// إزالة أي تعديل سابق
html = html.replace(/<style id="brand-shrink">[\s\S]*?<\/style>/g, '');

const shrinkCSS = `
<style id="brand-shrink">
  /* تصغير الشعار من 28 إلى 26 */
  .chz-logo {
    width: 26px !important;
    height: 26px !important;
  }
  
  /* تصغير كلمة CHIZEN من 22 إلى 21 */
  .chz-en {
    font-size: 21px !important;
  }
</style>
`;
html = html.replace('</head>', shrinkCSS + '\n</head>');

fs.writeFileSync(file + '.bak_shrink_' + Date.now(), original);
fs.writeFileSync(file, html);
console.log('✅ تم تصغير الشعار (28→26px) والكلمة (22→21px).');
