import { applyCors, handleOptions, sendJson } from './_utils.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) {
    return;
  }

  applyCors(req, res);

  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  sendJson(res, 200, {
    status: 'OK',
    platform: 'Vercel',
    runtime: 'nodejs20.x',
    timestamp: new Date().toISOString()
  });
}
