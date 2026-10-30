const http = require('http');
const fs = require('fs');
const path = require('path');
http.createServer((req, res) => {
  let f = path.join(process.cwd(), req.url === '/' ? 'chizen.html' : req.url.split('?')[0]);
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); res.end('Not found'); return; }
    let type = f.endsWith('.html') ? 'text/html; charset=utf-8' : f.endsWith('.js') ? 'text/javascript' : f.endsWith('.css') ? 'text/css' : 'text/plain';
    res.writeHead(200, {'Content-Type': type});
    res.end(d);
  });
}).listen(8080, () => console.log('🚀 السيرفر يعمل الآن على: http://localhost:8080'));
