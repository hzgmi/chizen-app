const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

if (h.indexOf("v334-auth-fix") !== -1) {
  console.log("⚠️ v334 مطبق مسبقاً");
  process.exit(0);
}

var js = [
'<script id="v334-auth-fix">',
'(function(){',
'  var tries = 0;',
'  function hook(){',
'    tries++;',
'    if (tries > 100) return;',
'    if (!window.FB || !window.FB.auth) return setTimeout(hook, 200);',
'    function syncUI(user){',
'      var body = document.body;',
'      var htmlEl = document.documentElement;',
'      var profileTxt = document.querySelector(".chz-profile-group .chz-prof-txt");',
'      var profileGroup = document.querySelector(".chz-profile-group");',
'      if (user) {',
'        body.classList.remove("chz-is-guest");',
'        htmlEl.classList.remove("chz-guest-instant");',
'        if (profileTxt && profileTxt.querySelector(".v318-login-text")) {',
'          profileTxt.innerHTML = \x27<div class="chz-prof-name" id="chz-prof-name-dynamic">مرحباً</div><div class="chz-prof-welcome">أهلاً بك</div>\x27;',
'        }',
'        var displayName = user.displayName || (user.email ? user.email.split("@")[0] : "مستخدم");',
'        if (window.APP && window.APP.state && window.APP.state.user && window.APP.state.user.name) {',
'          displayName = window.APP.state.user.name;',
'        }',
'        var nameEl = document.getElementById("chz-prof-name-dynamic");',
'        if (nameEl) nameEl.textContent = displayName;',
'        if (profileGroup) {',
'          profileGroup.removeAttribute("data-v318-click");',
'          profileGroup.onclick = function(e){ if (e) e.preventDefault(); if (window.APP && window.APP.goTab) window.APP.goTab("profile"); };',
'        }',
'        var banner = document.querySelector(".v321-guest-banner");',
'        if (banner) banner.remove();',
'        document.querySelectorAll(".v321-hide").forEach(function(el){ el.classList.remove("v321-hide"); });',
'        if (window.APP && typeof window.APP.updateUserUI === "function") { try { window.APP.updateUserUI(); } catch(e){} }',
'        console.log("[v334] logged-in UI:", displayName);',
'      } else {',
'        body.classList.add("chz-is-guest");',
'        console.log("[v334] guest state");',
'      }',
'    }',
'    window.FB.auth.onAuthStateChanged(function(user){',
'      setTimeout(function(){ syncUI(user); }, 500);',
'      setTimeout(function(){ syncUI(user); }, 1500);',
'      setTimeout(function(){ syncUI(user); }, 3000);',
'    });',
'    console.log("[v334] installed");',
'  }',
'  hook();',
'})();',
'</script>'
].join("\n") + "\n";

var bodyEnd = h.lastIndexOf("</body>");
if (bodyEnd === -1) { console.error("❌ </body> not found"); process.exit(1); }
h = h.slice(0, bodyEnd) + js + h.slice(bodyEnd);

fs.writeFileSync(target, h);
console.log("✅ v334 applied | " + before + " → " + h.length + " (+" + (h.length - before) + ")");
