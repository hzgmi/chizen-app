const fs = require('fs');
const html = fs.readFileSync('client/chizen.html', 'utf8');

console.log('════════════════════════════════════════════════════');
console.log('  🔍 فحص جميع الأزرار في التطبيق');
console.log('════════════════════════════════════════════════════\n');

// 1) استخراج كل الأزرار
const btnRegex = /<button([^>]*)>([\s\S]*?)<\/button>/g;
const buttons = [];
let m;
let total = 0;

while ((m = btnRegex.exec(html)) !== null) {
  total++;
  const attrs = m[1];
  const content = m[2].replace(/<[^>]+>/g, '').trim().slice(0, 40);
  const style = (attrs.match(/style="([^"]*)"/) || [])[1] || '';
  const cls = (attrs.match(/class="([^"]*)"/) || [])[1] || '';
  const onclick = (attrs.match(/onclick="([^"]*)"/) || [])[1] || '';
  
  buttons.push({
    index: total,
    text: content || '(بدون نص)',
    style: style,
    cls: cls,
    onclick: onclick,
    hasBg: /background/i.test(style) || /btn-|bp-|primary/i.test(cls),
    hasPadding: /padding/i.test(style) || /btn-|bp-|primary/i.test(cls),
    hasRadius: /border-radius/i.test(style) || /btn-|bp-|primary/i.test(cls)
  });
}

console.log('📊 إجمالي الأزرار: ' + total + '\n');

// 2) الأزرار التي قد تكون "قبيحة" (بدون تصميم)
const uglyButtons = buttons.filter(b => !b.hasBg || !b.hasPadding || !b.hasRadius);

console.log('🎨 الأزرار القبيحة (بدون تنسيق كامل): ' + uglyButtons.length + '\n');

if (uglyButtons.length > 0) {
  console.log('قائمة الأزرار التي تحتاج تحسين:');
  uglyButtons.slice(0, 30).forEach(b => {
    console.log('  [' + b.index + '] "' + b.text + '"');
    console.log('      class: ' + (b.cls || '(فارغ)'));
    console.log('      onclick: ' + (b.onclick.slice(0, 50) || '(فارغ)'));
    console.log('      style: ' + (b.style.slice(0, 80) || '(فارغ)'));
    console.log('');
  });
}

// 3) فحص الأزرار المهمة (التي يجب أن تكون مصممة)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 الأزرار المهمة (بحث عن تنسيق):');
const importantButtons = [
  { name: 'إضافة للسلة', search: 'addCart|أضف للسلة' },
  { name: 'شراء الآن', search: 'buyNow|اشترِ الآن' },
  { name: 'تأكيد الطلب', search: 'confirmOrder|تأكيد الطلب' },
  { name: 'تأكيد الحجز', search: 'submitFlight|submitBus|submitHotel|submitHajj' },
  { name: 'إضافة بانر (الأدمن)', search: 'saveBanner|إضافة البانر' },
  { name: 'تسجيل الخروج', search: 'logout|تسجيل خروج' },
  { name: 'تم، فهمت', search: 'تم، فهمت' },
  { name: 'حذف', search: 'delete|حذف' },
  { name: 'حسناً', search: 'حسناً' }
];

importantButtons.forEach(btn => {
  const found = html.includes(btn.search) || new RegExp(btn.search).test(html);
  console.log('  ' + (found ? '✅' : '⚠️') + ' ' + btn.name);
});

// 4) فحص أزرار "قبيحة" الشكل (بدون تنسيق أو بدون كلاسات)
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 أزرار بدون تنسيق (style أو class):');
let badCount = 0;
buttons.forEach(b => {
  const noStyle = !b.style || b.style.length < 10;
  const noClass = !b.cls || b.cls.length < 3;
  if (noStyle && noClass) {
    badCount++;
    console.log('  ⚠️ [' + b.index + '] "' + b.text + '" onclick="' + b.onclick.slice(0, 40) + '"');
  }
});

if (badCount === 0) {
  console.log('  ✅ لا توجد أزرار بدون تنسيق');
}
