// api/feedback.js
// Vercel Serverless Function — Feedback Email Handler

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, rating, message, timestamp } = req.body;

    if (!name || !rating || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailUser = process.env.EMAIL_USER || 'sigmadeveloper.in@gmail.com';
    const emailPass = process.env.EMAIL_PASS;

    if (!emailPass) {
      return res.status(200).json({ 
        success: true, 
        warning: 'EMAIL_PASS_MISSING',
        message: 'Feedback received but email not sent (check environment variables).' 
      });
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

    res.status(200).json({ success: true, message: 'Feedback sent successfully!' });

  } catch (err) {
    console.error('Feedback function error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

