'use strict';

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME = {
  '.html' : 'text/html; charset=utf-8',
  '.css'  : 'text/css; charset=utf-8',
  '.js'   : 'application/javascript; charset=utf-8',
  '.json' : 'application/json; charset=utf-8',
  '.ico'  : 'image/x-icon',
  '.png'  : 'image/png',
  '.jpg'  : 'image/jpeg',
  '.gif'  : 'image/gif',
  '.svg'  : 'image/svg+xml',
};

http.createServer((req, res) => {
  // Normalize URL
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') {
    urlPath = '/index.html';
  }

  // Handle favicon silently
  if (urlPath === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Build file path
  const filePath = path.join(__dirname, urlPath);

  // Prevent directory traversal attacks
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  // Get file extension
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'text/html; charset=utf-8';

  // Try to read the requested file
  fs.stat(filePath, (statErr, stats) => {
    if (!statErr && stats.isFile()) {
      // File exists, serve it
      fs.readFile(filePath, (readErr, data) => {
        if (readErr) {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('500 Internal Server Error');
          return;
        }
        res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'public, max-age=3600' });
        res.end(data);
      });
      return;
    }

    // File doesn't exist or is not a file: serve index.html (SPA fallback)
    const indexPath = path.join(__dirname, 'index.html');
    fs.readFile(indexPath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  });

}).listen(PORT, '0.0.0.0', () => {
  console.log(`\n  ██████  FORMKUNST  ██████`);
  console.log(`  Process Art Manifesto Server`);
  console.log(`  Running at http://localhost:${PORT}\n`);
});
