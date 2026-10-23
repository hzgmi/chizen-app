const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// 1) حذف أي نسخة سابقة
html = html.replace(/<style id="chizen-dark-theme">[\s\S]*?<\/style>/g, '');

// 2) كود CSS الشامل
const darkCSS = `
<style id="chizen-dark-theme">
  /* ══════════════════════════════════════════════════
     CHIZEN DARK LUXURY THEME (مستوحاة من صفحة الدخول)
     ══════════════════════════════════════════════════ */
  :root {
    --chz-bg: #02051b;
    --chz-bg-mid: #040b31;
    --chz-bg-deep: #00010a;
    --chz-pink: #ff27c9;
    --chz-purple: #8d24ff;
    --chz-blue: #075cff;
    --chz-cyan: #00dfff;
    --chz-orange: #ff8b45;
    --chz-white: #f8f9ff;
    --chz-muted: #b8c5ee;
    --chz-muted-2: #6b7ba8;
    --chz-error: #ff4d6d;
    --chz-success: #00d4a0;
    --chz-border: rgba(120, 150, 255, 0.16);
    --chz-card-bg: rgba(7, 23, 71, 0.55);
    --chz-glass: rgba(7, 23, 71, 0.45);
    --chz-grad-main: linear-gradient(95deg, #ff9a4e 0%, #ff356f 18%, #ff20c6 39%, #a72bff 59%, #4269ff 78%, #00cfff 100%);
    --chz-grad-pink-purple: linear-gradient(135deg, #ff27c9, #8d24ff);
    --chz-grad-blue-cyan: linear-gradient(135deg, #075cff, #00dfff);
  }

  /* ═══ الخلفية العامة ═══ */
  html, body {
    background: radial-gradient(ellipse at top, #040b31 0%, #02051b 40%, #00010a 100%) !important;
    background-attachment: fixed !important;
    color: var(--chz-white) !important;
  }
  #app, #screens, .screen {
    background: transparent !important;
    color: var(--chz-white) !important;
  }
  /* توهج خلفي */
  body::before {
    content: '';
    position: fixed;
    top: -200px; left: -200px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(255, 39, 201, 0.15) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    animation: chzGlow 8s ease-in-out infinite;
  }
  body::after {
    content: '';
    position: fixed;
    bottom: -200px; right: -200px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(141, 36, 255, 0.15) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    animation: chzGlow 10s ease-in-out infinite reverse;
  }
  @keyframes chzGlow {
    0%, 100% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  }

  /* ═══ الشريط السفلي ═══ */
  #bottom-nav {
    background: rgba(7, 23, 71, 0.85) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border-top: 1px solid var(--chz-border) !important;
    box-shadow: 0 -8px 25px rgba(0, 0, 0, 0.4) !important;
  }
  #bottom-nav .bn-it { color: var(--chz-muted-2) !important; }
  #bottom-nav .bn-it.active { color: var(--chz-pink) !important; }
  #bottom-nav .bn-it.active svg { stroke: var(--chz-pink) !important; filter: drop-shadow(0 0 6px var(--chz-pink)); }

  /* ═══ الهيدر (chz-main) ═══ */
  .chz-main {
    background: linear-gradient(105deg, rgba(4, 11, 49, 0.9), rgba(37, 7, 76, 0.9)) !important;
    border: 1px solid var(--chz-border) !important;
    box-shadow: 0 8px 30px rgba(255, 39, 201, 0.15), 0 4px 15px rgba(0, 0, 0, 0.3) !important;
    backdrop-filter: blur(20px) !important;
  }
  .chz-banner {
    background: var(--chz-grad-main) !important;
    box-shadow: 0 4px 15px rgba(255, 39, 201, 0.3) !important;
  }
  .chz-glass-icon {
    background: rgba(7, 23, 71, 0.55) !important;
    border: 1px solid rgba(120, 150, 255, 0.25) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1) !important;
  }
  .chz-glass-icon svg { stroke: var(--chz-pink) !important; }
  .chz-badge {
    background: linear-gradient(135deg, #ff4d6d, #ff27c9) !important;
    box-shadow: 0 0 10px rgba(255, 39, 201, 0.6) !important;
  }
  .chz-logo {
    background: linear-gradient(135deg, #25074c, #040b31) !important;
    border: 1px solid var(--chz-border) !important;
    box-shadow: 0 4px 15px rgba(141, 36, 255, 0.4) !important;
  }
  .chz-en {
    background: linear-gradient(135deg, #ff27c9, #00dfff, #ff8b45) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    filter: drop-shadow(0 2px 8px rgba(255, 39, 201, 0.4));
  }
  .chz-ar { color: var(--chz-white) !important; }
  .chz-tag { color: var(--chz-muted) !important; }
  .chz-prof-name { color: var(--chz-white) !important; }
  .chz-prof-welcome { color: var(--chz-muted) !important; }
  .chz-prof-avatar {
    background: linear-gradient(135deg, #ff27c9, #8d24ff) !important;
    box-shadow: 0 0 15px rgba(255, 39, 201, 0.5) !important;
    border: 2px solid rgba(255, 255, 255, 0.2) !important;
  }

  /* ═══ الكروت العامة ═══ */
  .loy, .sw, .booking-row-container, .cat-i, 
  .notif-card, .oc, .ch, .cs, .tb, .bank, 
  .booking-form, .cd, .sg, .ph {
    background: var(--chz-card-bg) !important;
    border: 1px solid var(--chz-border) !important;
    backdrop-filter: blur(15px) !important;
    -webkit-backdrop-filter: blur(15px) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
  }
  .loy-t, .search, .ci-n, .det-n, .det-br, .det-d, 
  .fl, .fll, .pt-at, .pt-hn, .sgt, .sit-ti, .stl, 
  .brand-name, .lux-cat-name, .photo-cat-name {
    color: var(--chz-white) !important;
  }
  .loy-p, .ci-p, .det-p, .pt-ap, .buy-btn, .price {
    color: var(--chz-pink) !important;
  }
  .search::placeholder, .fi::placeholder, input::placeholder, textarea::placeholder {
    color: var(--chz-muted-2) !important;
  }

  /* ═══ الحقول ═══ */
  .fi, input[type="text"], input[type="email"], input[type="tel"], 
  input[type="password"], input[type="number"], input[type="date"], 
  input[type="time"], textarea, select {
    background: rgba(7, 23, 71, 0.6) !important;
    border: 1px solid var(--chz-border) !important;
    color: var(--chz-white) !important;
    border-radius: 12px !important;
  }
  .fi:focus, input:focus, textarea:focus, select:focus {
    border-color: var(--chz-pink) !important;
    box-shadow: 0 0 0 3px rgba(255, 39, 201, 0.15) !important;
  }
  select option { background: #040b31 !important; color: var(--chz-white) !important; }

  /* ═══ الأزرار ═══ */
  .btn-p, .btn-b, .booking-form button, .danger-b {
    background: var(--chz-grad-main) !important;
    border: none !important;
    color: #fff !important;
    box-shadow: 0 6px 25px rgba(255, 39, 201, 0.4) !important;
    transition: all 0.3s !important;
  }
  .btn-p:active, .btn-b:active {
    transform: scale(0.97) !important;
    box-shadow: 0 3px 15px rgba(255, 39, 201, 0.5) !important;
  }
  .btn-c {
    background: rgba(7, 23, 71, 0.8) !important;
    border: 1px solid var(--chz-border) !important;
    color: var(--chz-pink) !important;
  }

  /* ═══ العناوين والـ sh2 ═══ */
  .sh2 {
    background: rgba(4, 11, 49, 0.8) !important;
    backdrop-filter: blur(15px) !important;
    border-bottom: 1px solid var(--chz-border) !important;
  }
  .st2 {
    color: var(--chz-white) !important;
    background: linear-gradient(135deg, #ff27c9, #00dfff) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
  }
  .hd {
    background: rgba(4, 11, 49, 0.9) !important;
    backdrop-filter: blur(15px) !important;
    border-bottom: 1px solid var(--chz-border) !important;
  }
  .hd > div[onclick] {
    background: rgba(255, 39, 201, 0.15) !important;
  }
  .hd svg { stroke: var(--chz-pink) !important; }

  /* ═══ النوافذ المنبثقة (السلة، الحجز، إلخ) ═══ */
  #modal .ms, #dlg .dlb, #pts-purchase-modal > div, 
  #ref-modal-box, #ref-error-box, #ref-success-box,
  #universal-success-box {
    background: linear-gradient(135deg, #040b31, #25074c) !important;
    border: 1px solid var(--chz-border) !important;
    color: var(--chz-white) !important;
    box-shadow: 0 25px 70px rgba(255, 39, 201, 0.3) !important;
  }
  #modal .mt2, #universal-success-title, .success-title,
  #ref-modal-box .modal-title, #ref-error-box .err-title,
  #ref-success-box .err-title {
    color: var(--chz-white) !important;
  }
  #universal-success-message, .success-message,
  #ref-modal-box .modal-subtitle, #ref-error-box .err-message,
  #ref-success-box .err-message {
    color: var(--chz-muted) !important;
  }
  #universal-success-overlay, #ref-modal-overlay,
  #ref-error-overlay, #ref-success-overlay, #pts-purchase-modal {
    background: rgba(2, 5, 27, 0.85) !important;
    backdrop-filter: blur(12px) !important;
  }

  /* ═══ Toast ═══ */
  .toast {
    background: linear-gradient(135deg, rgba(255, 39, 201, 0.95), rgba(141, 36, 255, 0.95)) !important;
    color: #fff !important;
    box-shadow: 0 8px 25px rgba(255, 39, 201, 0.5) !important;
  }

  /* ═══ النقاط ═══ */
  .pt-hero {
    background: linear-gradient(135deg, #ff27c9, #8d24ff) !important;
    box-shadow: 0 8px 25px rgba(255, 39, 201, 0.4) !important;
  }
  .pt-btn-card, .pts-package {
    background: rgba(7, 23, 71, 0.6) !important;
    border: 1px solid var(--chz-border) !important;
  }
  .pt-btn-card:hover, .pts-package:hover {
    border-color: var(--chz-pink) !important;
    box-shadow: 0 4px 20px rgba(255, 39, 201, 0.3) !important;
  }

  /* ═══ الحجوزات ═══ */
  .booking-tabs { background: rgba(4, 11, 49, 0.6) !important; }
  .booking-tab {
    background: rgba(7, 23, 71, 0.6) !important;
    border: 1px solid var(--chz-border) !important;
    color: var(--chz-muted) !important;
  }
  .booking-tab.active {
    background: var(--chz-grad-main) !important;
    border-color: transparent !important;
    color: #fff !important;
    box-shadow: 0 4px 15px rgba(255, 39, 201, 0.4) !important;
  }
  .booking-label { color: var(--chz-white) !important; }
  .booking-divider { background: var(--chz-border) !important; }

  /* ═══ الماركات ═══ */
  .lux-cat-img, .photo-cat-circle {
    background: rgba(7, 23, 71, 0.5) !important;
    border-color: var(--chz-border) !important;
  }

  /* ═══ البحث الذكي ═══ */
  .ss-wrapper {
    background: rgba(7, 23, 71, 0.7) !important;
    border: 1px solid var(--chz-border) !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
  }
  .ss-input { color: var(--chz-white) !important; }
  .ss-input::placeholder { color: var(--chz-muted-2) !important; }
  .ss-icon { stroke: var(--chz-pink) !important; }
  .ss-dropdown {
    background: #040b31 !important;
    border: 1px solid var(--chz-border) !important;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6) !important;
  }
  .ss-item { border-bottom: 1px solid var(--chz-border) !important; }
  .ss-item:hover { background: rgba(255, 39, 201, 0.1) !important; }
  .ss-item-name { color: var(--chz-white) !important; }
  .ss-item-cat { color: var(--chz-muted) !important; }
  .ss-item-price { color: var(--chz-pink) !important; }

  /* ═══ السلة والدفع ═══ */
  .cn {
    background: var(--chz-grad-pink-purple) !important;
    color: #fff !important;
  }
  .cst { color: var(--chz-white) !important; }
  .tb .tr { color: var(--chz-muted) !important; }
  .tb .tf { color: var(--chz-pink) !important; border-top: 1px solid var(--chz-border) !important; }
  .bank-n { color: var(--chz-white) !important; }
  .bank-d { color: var(--chz-muted) !important; }

  /* ═══ الحساب والإعدادات ═══ */
  .ph { background: transparent !important; }
  .pn { color: var(--chz-white) !important; }
  .pe { color: var(--chz-muted) !important; }
  .av {
    background: var(--chz-grad-main) !important;
    box-shadow: 0 8px 25px rgba(255, 39, 201, 0.4) !important;
  }
  .sgt { 
    background: rgba(255, 39, 201, 0.1) !important;
    color: var(--chz-pink) !important;
    border-bottom: 1px solid var(--chz-border) !important;
  }
  .sit { border-bottom: 1px solid var(--chz-border) !important; }
  .sii { background: rgba(7, 23, 71, 0.6) !important; }
  .sii svg { stroke: var(--chz-pink) !important; }
  .sit-d, .mi-v { color: var(--chz-muted) !important; }
  .mi-a { color: var(--chz-muted-2) !important; }
  .tog { background: rgba(7, 23, 71, 0.8) !important; border: 1px solid var(--chz-border) !important; }
  .tog.on { background: var(--chz-grad-pink-purple) !important; }

  /* ═══ زر AI ═══ */
  #ai-btn, .ai-fab, [class*="ai-button"] {
    background: var(--chz-grad-main) !important;
    box-shadow: 0 8px 25px rgba(255, 39, 201, 0.5) !important;
  }

  /* ═══ النصوص العامة ═══ */
  h1, h2, h3, h4, h5, h6, p, span, div, label, a {
    color: inherit;
  }

  /* ═══ شريط الخصم ═══ */
  .top-marquee {
    background: var(--chz-grad-main) !important;
    box-shadow: 0 2px 10px rgba(255, 39, 201, 0.3) !important;
  }

  /* ═══ البحث القديم (إذا وُجد) ═══ */
  .sw .sb {
    background: rgba(7, 23, 71, 0.7) !important;
    border: 1px solid var(--chz-border) !important;
  }
  .sw .sb .search { color: var(--chz-white) !important; }

  /* ═══ التقييمات والنجوم ═══ */
  .rating, .stars { color: #FFC107 !important; }

  /* ═══ القوائم الفارغة ═══ */
  .cempty { color: var(--chz-muted) !important; }

  /* ═══ تحسين عام للأيقونات ═══ */
  svg:not([fill]) { stroke: currentColor; }

  /* ═══ حقول الملفات ═══ */
  input[type="file"] {
    background: rgba(7, 23, 71, 0.6) !important;
    color: var(--chz-muted) !important;
    border: 1px dashed var(--chz-border) !important;
  }
</style>
`;
html = html.replace('</head>', darkCSS + '\n</head>');

// 3) حفظ
fs.writeFileSync(file + '.bak_darktheme_' + Date.now(), original);
fs.writeFileSync(file, html);

console.log('✅ تم تطبيق الهوية الداكنة الفاخرة على الرئيسية.');

// 4) فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'dk_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
