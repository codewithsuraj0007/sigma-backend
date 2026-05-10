import 'dotenv/config';
import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import chatHandler from './api/chat.js';
import feedbackHandler from './api/send-feedback.js';
import healthHandler from './api/health.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.join(__dirname, 'frontend');
const port = Number(process.env.PORT || 3000);

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon'
};

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function getContentType(filePath) {
  return mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

async function serveStaticAsset(res, filePath) {
  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      return false;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', getContentType(filePath));
    createReadStream(filePath).pipe(res);
    return true;
  } catch {
    return false;
  }
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(requestUrl.pathname);

  if (pathname === '/api/chat') {
    await chatHandler(req, res);
    return;
  }

  if (pathname === '/api/send-feedback') {
    await feedbackHandler(req, res);
    return;
  }

  if (pathname === '/api/health') {
    await healthHandler(req, res);
    return;
  }

  if (!existsSync(frontendDir)) {
    sendJson(res, 404, {
      error: 'Frontend directory not found',
      expectedPath: frontendDir
    });
    return;
  }

  const normalizedPath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const requestedPath = path.resolve(frontendDir, normalizedPath);
  const withinFrontend =
    requestedPath === path.join(frontendDir, 'index.html') ||
    requestedPath.startsWith(`${frontendDir}${path.sep}`);

  if (withinFrontend && (await serveStaticAsset(res, requestedPath))) {
    return;
  }

  const indexPath = path.join(frontendDir, 'index.html');
  if (existsSync(indexPath) && (await serveStaticAsset(res, indexPath))) {
    return;
  }

  sendJson(res, 404, { error: 'Frontend entrypoint not found', expectedPath: indexPath });
});

server.listen(port, () => {
  console.log(`Local Sigma server running at http://localhost:${port}`);
});
