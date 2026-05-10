// server.js - Sigma Portfolio Server with AI Chat Proxy
// Keeps API key secure on the server side.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors()); // Enable CORS for ALL origins
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ==========================================
// SURAJ'S SYSTEM PROMPT (kept server-side)
// ==========================================

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

// ==========================================
// FEEDBACK API ENDPOINT
// ==========================================

// Email Transporter (Gmail App Password required)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'sigmadeveloper.in@gmail.com',
    pass: process.env.EMAIL_PASS // User must set this in .env
  }
});

app.post('/api/send-feedback', async (req, res) => {
  try {
    const { name, email, rating, message, timestamp } = req.body;

    console.log(`\n📬 Processing Feedback from ${name}...`);

    const starRating = '⭐'.repeat(Math.min(Math.max(rating, 1), 5));

    const mailOptions = {
      from: `"Sigma Portfolio" <${process.env.EMAIL_USER || 'sigmadeveloper.in@gmail.com'}>`,
      to: 'sigmadeveloper.in@gmail.com',
      subject: `New Portfolio Feedback ${starRating}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #a855f7;">New Feedback Received</h2>
          <hr>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Rating:</strong> ${starRating} (${rating}/5)</p>
          <p><strong>Message:</strong></p>
          <div style="background: #fdf2f8; padding: 15px; border-radius: 5px; border-left: 4px solid #ec4899;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p style="font-size: 0.8rem; color: #999; margin-top: 20px;">
            Submitted on: ${timestamp || new Date().toLocaleString()}
          </p>
        </div>
      `
    };

    // Only send if password is set
    if (process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully!');
      res.json({ success: true, message: 'Feedback sent to your email' });
    } else {
      console.warn('⚠️ EMAIL_PASS missing in .env. Logging to console instead:');
      console.log(`- Rating: ${rating}/5\n- Message: ${message}`);
      // Return success: true but with a warning field so JS can alert the user
      res.json({
        success: true,
        warning: 'EMAIL_PASS_MISSING',
        message: 'Feedback logged locally, but setup EMAIL_PASS in .env to receive emails.'
      });
    }

  } catch (err) {
    console.error('❌ Feedback API error:', err.message);
    res.status(500).json({ error: 'Email service error' });
  }
});

// ==========================================
// OPENROUTER CHAT PROXY
// ==========================================

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Build the request for OpenRouter (OpenAI-compatible format)
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
      return res.status(502).json({ error: 'LLM service error', status: response.status });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(502).json({ error: 'Empty response from LLM' });
    }

    res.json({ reply });

  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'LLM request timed out' });
    }
    console.error('Chat API error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve index.html for all non-file routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n⚡ Sigma Portfolio running on http://localhost:${PORT}`);
  console.log(`🤖 AI Chat proxy active at /api/chat\n`);
});
