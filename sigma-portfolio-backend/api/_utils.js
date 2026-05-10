import nodemailer from 'nodemailer';

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8'
};

export const SYSTEM_PROMPT = `You are Suraj Prajapati's AI assistant on his developer portfolio website. Your job is to help visitors learn about Suraj, answer their questions, and connect them with him.

PERSONALITY: Be concise (2-3 sentences max per response), professional, confident, and human-like. Never say "As an AI". Use at most 1 emoji per response. Be warm but not overly casual.

SURAJ'S PROFILE:
- Name: Suraj Prajapati
- Brand: The Sigma Developers
- Title: MERN Full Stack Developer & AI Integration Engineer
- Location: Lucknow, UP, India
- Education: Diploma in IT with AI - Government Polytechnic, Lucknow
- Current Role: Web Developer at Seek Unique Productions (Sep 2025 - Present)

TECH STACK:
- Frontend: React.js, JavaScript ES6+, HTML5, CSS3, Tailwind CSS, Bootstrap 5
- Backend: Node.js, Express.js, ASP.NET Core, C#, REST APIs
- Databases: MongoDB, SQL Server, Firestore
- Cloud: Google Cloud, AWS, Firebase, Supabase
- AI: Vertex AI, Generative AI, Amazon Q, Gemini API
- Tools: Git, GitHub, Docker, Postman, Stripe

KEY PROJECTS:
1. AI Image Generator - Text-to-image platform using AI APIs (React.js, AI API, CSS3)
2. Developer Portfolio - Premium animated site with glassmorphism, 95+ Lighthouse (HTML5, CSS3, JS)
3. MERN Full Stack App - Enterprise-grade with JWT auth, RESTful APIs (React, Node.js, MongoDB, Express)
4. Real-time Chat Platform - Firebase-powered messaging (React, Firebase, Firestore)

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

export function applyCors(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Vary', 'Origin');
}

export function handleOptions(req, res) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }

  return false;
}

export function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  for (const [key, value] of Object.entries(JSON_HEADERS)) {
    res.setHeader(key, value);
  }
  res.end(JSON.stringify(payload));
}

export async function readJsonBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  const bodyText = Buffer.concat(chunks).toString('utf8');
  return JSON.parse(bodyText);
}

export function createFeedbackTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });
}

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
