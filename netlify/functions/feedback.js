// netlify/functions/feedback.js
// Netlify Serverless Function — Feedback Email Handler
// Endpoint: /api/send-feedback (via redirect in netlify.toml)

const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, rating, message, timestamp } = JSON.parse(event.body || '{}');

    if (!name || !rating || !message) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const emailUser = process.env.EMAIL_USER || 'sigmadeveloper.in@gmail.com';
    const emailPass = process.env.EMAIL_PASS;

    if (!emailPass) {
      console.warn('⚠️ EMAIL_PASS missing. Logging feedback to console:');
      console.log(`Feedback from ${name}: ${rating}/5 - ${message}`);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ 
          success: true, 
          warning: 'EMAIL_PASS_MISSING',
          message: 'Feedback received but email not sent (check environment variables).' 
        })
      };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    const starRating = '⭐'.repeat(Math.min(Math.max(rating, 1), 5));
    const mailOptions = {
      from: `"Sigma Portfolio" <${emailUser}>`,
      to: 'sigmadeveloper.in@gmail.com',
      subject: `New Portfolio Feedback ${starRating}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #a855f7;">New Feedback Received</h2>
          <hr>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email || 'Not Provided'}</p>
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

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, message: 'Feedback sent successfully!' })
    };

  } catch (err) {
    console.error('Feedback function error:', err.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
