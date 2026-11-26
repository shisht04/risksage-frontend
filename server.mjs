import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3000;
const DIR = path.resolve('out');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  const rawPath = decodeURI(req.url.split('?')[0]);
  const cleanPath = rawPath.replace(/\/+$/, ''); // strip trailing slash
  
  let filePath = null;

  // 1. Direct file lookup (e.g. static assets, images, CSS, JS)
  const directPath = path.join(DIR, rawPath);
  if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
    filePath = directPath;
  }
  // 2. Root request "/"
  else if (!cleanPath || cleanPath === '') {
    filePath = path.join(DIR, 'index.html');
  }
  // 3. Named page with .html extension (e.g. /dashboard -> out/dashboard.html)
  else {
    const htmlCandidate = path.join(DIR, `${cleanPath}.html`);
    const indexCandidate = path.join(DIR, cleanPath, 'index.html');

    if (fs.existsSync(htmlCandidate) && fs.statSync(htmlCandidate).isFile()) {
      filePath = htmlCandidate;
    } else if (fs.existsSync(indexCandidate) && fs.statSync(indexCandidate).isFile()) {
      filePath = indexCandidate;
    } else {
      filePath = path.join(DIR, '404.html');
    }
  }

  // Ensure filePath exists
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIR, '404.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const is404 = filePath.endsWith('404.html');
    res.writeHead(is404 ? 404 : 200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`RiskSage server running on http://localhost:${PORT}`);
});
