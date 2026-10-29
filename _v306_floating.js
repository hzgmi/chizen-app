const fs = require('fs');
let h = fs.readFileSync('client/index.html', 'utf8');
const before = h.length;

if (h.includes('v306-floating-guest')) { console.log('already'); process.exit(0); }

// CSS + زر عائم قبل </head>
const inject = [
'<style id="v306-css">',
'.v306-guest-chip{position:fixed;top:14px;left:14px;z-index:999999;background:linear-gradient(135deg,rgba(168,85,247,0.95),rgba(236,72,153,0.95));backdrop-filter:blur(8px);color:#fff;padding:10px 16px;border-radius:24px;font-family:Tajawal,system-ui,sans-serif;font-size:13px;font-weight:900;cursor:pointer;border:2px solid rgba(255,255,255,0.3);box-shadow:0 8px 24px rgba(168,85,247,0.5);display:flex;align-items:center;gap:8px;animation:v306-pulse 2s ease-in-out infinite;text-decoration:none}',
'.v306-guest-chip:active{transform:scale(0.96)}',
'.v306-guest-chip .v306-icon{font-size:18px}',
'@keyframes v306-pulse{0%,100%{box-shadow:0 8px 24px rgba(168,85,247,0.5)}50%{box-shadow:0 8px 32px rgba(236,72,153,0.7)}}',
'</style>',
'<a href="#" id="v306-floating-guest" class="v306-guest-chip" onclick="event.preventDefault();__chzGuestEnter()">',
'  <span class="v306-icon">🎭</span>',
'  <span>تصفح كزائر</span>',
'</a>'
].join('\n');

const headEnd = h.indexOf('</head>');
if (headEnd === -1) { console.log('❌ </head> not found'); process.exit(1); }
h = h.slice(0, headEnd) + inject + '\n' + h.slice(headEnd);

// تأكد أن __chzGuestEnter موجود (v305 أضافه)
if (!h.includes('__chzGuestEnter')) {
  const fn = '\n<script>function __chzGuestEnter(){try{localStorage.setItem("chizen_guest","true")}catch(e){}window.location.href="chizen.html"}</script>\n';
  const bodyEnd = h.lastIndexOf('</body>');
  h = h.slice(0, bodyEnd) + fn + h.slice(bodyEnd);
}

fs.writeFileSync('client/index.html', h);
console.log('✅ v306: floating chip |', before, '->', h.length);
