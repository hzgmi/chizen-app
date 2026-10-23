const fs = require('fs');
const os = require('os');
const path = require('path');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

const oldRender = /renderBanners\s*:\s*function\s*\([^)]*\)\s*\{[\s\S]*?\n\s{2,4}\},/;
const newRender = `renderBanners: function() {
    var s = document.getElementById('slides');
    var d = document.getElementById('dots');
    if (!s) return;
    if (!this.banners || !this.banners.length) { s.innerHTML = ''; if (d) d.innerHTML = ''; return; }
    s.innerHTML = this.banners.map(function(b) {
      var fit = b.fit || 'cover';
      var position = b.position || 'center';
      var height = parseInt(b.height) || 200;
      var align = b.align || 'right';
      var overlay = (b.overlay !== undefined && b.overlay !== null) ? parseInt(b.overlay) : 50;
      var ta = align === 'center' ? 'center' : (align === 'left' ? 'left' : 'right');
      var ai = align === 'center' ? 'center' : (align === 'left' ? 'flex-start' : 'flex-end');
      var dir = align === 'left' ? '270deg' : (align === 'center' ? '180deg' : '90deg');
      var img = b.img ? '<img class="sl-img" src="' + esc(b.img) + '" style="width:100%;height:100%;object-fit:' + fit + ';object-position:' + position + ';display:block;">' : '';
      var content = '<div class="sl-c" style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 25px;text-align:' + ta + ';align-items:' + ai + ';background:linear-gradient(' + dir + ', rgba(0,0,0,' + (overlay/100) + ') 0%, transparent 80%);">' +
        (b.tag ? '<div class="sl-tag" style="color:#ff27c9;font-weight:900;font-size:11px;text-shadow:0 2px 4px rgba(0,0,0,0.5);">' + esc(b.tag) + '</div>' : '') +
        '<div class="sl-title" style="color:#fff;font-weight:900;font-size:22px;margin:6px 0;text-shadow:0 2px 8px rgba(0,0,0,0.6);">' + esc(b.title || '') + '</div>' +
        (b.sub ? '<div class="sl-sub" style="color:#f8f9ff;font-size:13px;margin-bottom:12px;text-shadow:0 2px 6px rgba(0,0,0,0.6);">' + esc(b.sub) + '</div>' : '') +
        (b.btn ? '<button class="sl-btn" style="background:linear-gradient(135deg,#ff27c9,#8d24ff);color:#fff;border:none;border-radius:10px;padding:10px 22px;font-weight:900;font-size:13px;cursor:pointer;box-shadow:0 4px 15px rgba(255,39,201,0.4);">' + esc(b.btn) + '</button>' : '') +
        '</div>';
      var bg = b.img ? '' : 'background:' + (b.bg || 'linear-gradient(135deg,#6A1B9A,#D81B60)');
      return '<div class="slide" style="' + bg + ';position:relative;height:' + height + 'px;">' + img + content + '</div>';
    }).join('');
    if (d) d.innerHTML = this.banners.map(function(_, i) {
      return '<div class="dot' + (i === 0 ? ' active' : '') + '" onclick="APP.goSlide(' + i + ')"></div>';
    }).join('');
    if (this.startSlideAutoplay) this.startSlideAutoplay();
  },`;

if (oldRender.test(html)) {
  html = html.replace(oldRender, newRender);
  console.log('✅ تم تحديث renderBanners لتطبيق height/align/overlay');
} else {
  console.log('⚠️ لم يجد renderBanners');
}

fs.writeFileSync(file + '.bak_fullapply_' + Date.now(), original);
fs.writeFileSync(file, html);

const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'fa_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
