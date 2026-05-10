import { SYSTEM_PROMPT } from '../../api/_utils.js';

const CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { messages } = JSON.parse(event.body || '{}');

    if (!Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Messages array is required' })
      };
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'OPENROUTER_API_KEY is not configured' })
      };
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
        return {
          statusCode: 502,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            error: 'OpenRouter request failed',
            status: response.status,
            details
          })
        };
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content;

      if (!reply) {
        return {
          statusCode: 502,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: 'OpenRouter returned an empty reply' })
        };
      }

      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ reply })
      };
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Request body must be valid JSON' })
      };
    }

    if (error?.name === 'AbortError') {
      return {
        statusCode: 504,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'OpenRouter request timed out' })
      };
    }

    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}
