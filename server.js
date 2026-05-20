'use strict';

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css' : 'text/css; charset=utf-8',
  '.js'  : 'application/javascript; charset=utf-8',
  '.ico' : 'image/x-icon',
  '.png' : 'image/png',
  '.jpg' : 'image/jpeg',
  '.svg' : 'image/svg+xml',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  const safePath = req.url.split('?')[0].replace(/\.\./g, '');
  const filePath = path.join(__dirname, safePath === '/' ? 'index.html' : safePath);
  const ext      = path.extname(filePath).toLowerCase();
  const mime     = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 — Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 — Internal Server Error');
      }
      return;
    }
    res.writeHead(200, {
      'Content-Type'  : mime,
      'Cache-Control' : 'no-cache',
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  ██████╗ ██████╗  ██████╗  ██████╗`);
  console.log(`  ██╔══██╗██╔══██╗██╔═══██╗██╔════╝`);
  console.log(`  ██████╔╝██████╔╝██║   ██║██║     `);
  console.log(`  ██╔═══╝ ██╔══██╗██║   ██║██║     `);
  console.log(`  ██║     ██║  ██║╚██████╔╝╚██████╗`);
  console.log(`  ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚═════╝`);
  console.log(`\n  FORMKUNST — MANIFESTO FOR PROCESS ART`);
  console.log(`  Server running → http://localhost:${PORT}\n`);
});
