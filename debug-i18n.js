const fs = require('fs');
const html = fs.readFileSync('client/chizen.html', 'utf8');

console.log('🔍 فحص تفصيلي:\n');

// 1) هل toast معرّفة؟
console.log('📍 window.toast: ' + (html.includes('window.toast') ? '✅' : '❌'));
console.log('📍 APP.toast: ' + (html.includes('toast:function') || html.includes('toast: function') ? '✅' : '❌'));

// 2) أين I18N بالنسبة لـ setLanguage؟
const i18nPos = html.indexOf('window.I18N =');
const setLangPos = html.indexOf('window.setLanguage =');
console.log('\n📍 موقع I18N: ' + i18nPos);
console.log('📍 موقع setLanguage: ' + setLangPos);
console.log('📍 الترتيب: ' + (i18nPos < setLangPos ? '✅ I18N قبل setLanguage' : '⚠️ I18N بعد setLanguage'));

// 3) هل هناك دالة apply تعمل؟
const hasApply = html.includes('apply: function()');
console.log('\n📍 apply() موجودة: ' + (hasApply ? '✅' : '❌'));

// 4) هل I18N داخل IIFE (قد لا يكون عالمياً)؟
const i18nBlock = html.slice(i18nPos, i18nPos + 200);
console.log('\n📋 بداية I18N:');
console.log(i18nBlock.replace(/\n/g, '\n  '));

// 5) هل toast يُستدعى داخل I18N؟
const i18nSection = html.slice(i18nPos, html.indexOf('</script>', i18nPos));
const toastCalls = (i18nSection.match(/toast\(/g) || []).length;
console.log('\n📍 toast() داخل I18N: ' + toastCalls + ' مرة');
