import {
  applyCors,
  handleOptions,
  readJsonBody,
  sendJson,
  SYSTEM_PROMPT
} from './_utils.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) {
    return;
  }

  applyCors(req, res);

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      sendJson(res, 400, { error: 'Messages array is required' });
      return;
    }

    if (!process.env.OPENROUTER_API_KEY) {
      sendJson(res, 500, { error: 'OPENROUTER_API_KEY is not configured' });
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'X-Title': 'Sigma Portfolio AI Assistant'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages.slice(-10)],
          max_tokens: 300,
          temperature: 0.7
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const details = await response.text();
        sendJson(res, 502, {
          error: 'OpenRouter request failed',
          status: response.status,
          details
        });
        return;
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content;

      if (!reply) {
        sendJson(res, 502, { error: 'OpenRouter returned an empty reply' });
        return;
      }

      sendJson(res, 200, { reply });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      sendJson(res, 400, { error: 'Request body must be valid JSON' });
      return;
    }

    if (error?.name === 'AbortError') {
      sendJson(res, 504, { error: 'OpenRouter request timed out' });
      return;
    }

    sendJson(res, 500, { error: 'Internal server error' });
  }
}
