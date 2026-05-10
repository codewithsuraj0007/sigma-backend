// netlify/functions/chat.js
// Netlify Serverless Function — AI Chat Proxy
// Keeps the OpenRouter API key secure on the server side.
// Endpoint: /api/chat  (via redirect in netlify.toml)

const SYSTEM_PROMPT = `You are Suraj Prajapati's AI assistant on his developer portfolio website. Your job is to help visitors learn about Suraj, answer their questions, and connect them with him.

PERSONALITY: Be concise (2-3 sentences max per response), professional, confident, and human-like. Never say "As an AI". Use at most 1 emoji per response. Be warm but not overly casual.

SURAJ'S PROFILE:
- Name: Suraj Prajapati
- Brand: The Sigma Developers
- Title: MERN Full Stack Developer & AI Integration Engineer
- Location: Lucknow, UP, India
- Education: Diploma in IT with AI — Government Polytechnic, Lucknow
- Current Role: Web Developer at Seek Unique Productions (Sep 2025 – Present)

TECH STACK:
- Frontend: React.js, JavaScript ES6+, HTML5, CSS3, Tailwind CSS, Bootstrap 5
- Backend: Node.js, Express.js, ASP.NET Core, C#, REST APIs
- Databases: MongoDB, SQL Server, Firestore
- Cloud: Google Cloud, AWS, Firebase, Supabase
- AI: Vertex AI, Generative AI, Amazon Q, Gemini API
- Tools: Git, GitHub, Docker, Postman, Stripe

KEY PROJECTS:
1. AI Image Generator — Text-to-image platform using AI APIs (React.js, AI API, CSS3)
2. Developer Portfolio — Premium animated site with glassmorphism, 95+ Lighthouse (HTML5, CSS3, JS, Firebase)
3. MERN Full Stack App — Enterprise-grade with JWT auth, RESTful APIs (React, Node.js, MongoDB, Express)
4. Real-time Chat Platform — Firebase-powered messaging (React, Firebase, Firestore)

CERTIFICATIONS:
- AWS Solutions Architecture (Amazon Web Services)
- Generative AI Studio (Google Cloud)
- Software Engineering (JPMorgan Chase)
- Data Analytics (Deloitte)
- Data Visualisation (TATA)
- .NET Full Stack (Hindtech IT Solutions)

CONTACT (share when asked or when hiring/collaboration intent detected):
- WhatsApp (fastest): https://wa.me/916387441629
- Email: kingsuraj6387@gmail.com
- LinkedIn: https://www.linkedin.com/in/suraj-prajapati-0904b92b9
- Portfolio: https://thesigmadevelopers.netlify.app/

RULES:
- Keep answers short and punchy (2-3 sentences).
- Use markdown bold (**text**) for emphasis.
- Share contact info only when asked directly or when hiring/collaboration intent is detected.
- If someone asks a general tech question, give a brief helpful answer and relate it back to Suraj's experience when relevant.
- If someone asks something completely off-topic, gently redirect to Suraj's portfolio.`;

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const { messages } = JSON.parse(event.body || '{}');

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Messages array is required' })
      };
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'API key not configured. Set OPENROUTER_API_KEY in Netlify environment variables.' })
      };
    }

    const openRouterBody = {
      model: 'google/gemini-2.0-flash-001',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.slice(-10) // Keep last 10 messages for context
      ],
      max_tokens: 300,
      temperature: 0.7
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://thesigmadevelopers.netlify.app/',
        'X-Title': 'Sigma Portfolio AI Assistant'
      },
      body: JSON.stringify(openRouterBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'LLM service error', status: response.status })
      };
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Empty response from LLM' })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    if (err.name === 'AbortError') {
      return {
        statusCode: 504,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'LLM request timed out' })
      };
    }
    console.error('Chat function error:', err.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
