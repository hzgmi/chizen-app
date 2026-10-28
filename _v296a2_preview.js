const fs = require('fs');
let h = fs.readFileSync('client/chizen.html', 'utf8');

if (h.includes('/* v296-preview */')) { console.log('already'); process.exit(0); }

const previewScript = `
<script>
/* v296-preview */
(function(){
  function setup(){
    var input=document.getElementById('co-receipt');
    if(!input || input.__v296Ready) return;
    input.__v296Ready=true;
    var img=document.getElementById('receipt-preview-img');
    var icon=document.getElementById('receipt-preview-icon');
    var text=document.getElementById('receipt-preview-text');
    if(!img) return;
    input.addEventListener('change', function(e){
      var f=e.target.files[0];
      if(!f){
        img.style.display='none';
        if(icon) icon.style.display='block';
        if(text) text.style.display='block';
        return;
      }
      if(!f.type.startsWith('image/')){alert('يجب رفع صورة');e.target.value='';return;}
      if(f.size > 5*1024*1024){alert('الصورة كبيرة (5MB كحد أقصى)');e.target.value='';return;}
      var r=new FileReader();
      r.onload=function(ev){
        img.src=ev.target.result;
        img.style.display='block';
        img.style.maxWidth='100%';
        img.style.maxHeight='200px';
        img.style.borderRadius='8px';
        img.style.marginTop='8px';
        if(icon) icon.style.display='none';
        if(text) text.style.display='none';
      };
      r.readAsDataURL(f);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',setup);
  else setup();
  setInterval(setup,1500);
})();
</script>`;

const bodyEnd = h.lastIndexOf('</body>');
h = h.slice(0, bodyEnd) + previewScript + '\n' + h.slice(bodyEnd);

fs.writeFileSync('client/chizen.html', h);
console.log('✅ v296a2: preview added');
