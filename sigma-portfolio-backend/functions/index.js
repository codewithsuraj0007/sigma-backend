const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });
const express = require('express');

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors);
app.use(express.json());

// Load credentials from environment variables
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'sigmadeveloper.in@gmail.com';
const SENDER_PASS = process.env.SENDER_PASS; // App Password

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASS
    }
});

app.post('/', async (req, res) => {
    try {
        const { name, email, rating, message, timestamp, userAgent } = req.body;

        // Server-side validation
        if (!name || !rating || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Sanitize and structure data
        const feedbackData = {
            name: String(name).substring(0, 100),
            email: email ? String(email).substring(0, 100) : 'Not Provided',
            rating: Math.min(Math.max(parseInt(rating), 1), 5),
            message: String(message).substring(0, 2000),
            timestamp: timestamp || new Date().toISOString(),
            userAgent: userAgent || 'Unknown',
            ip: req.ip || 'Unknown'
        };

        // 1. Store in Firestore
        await db.collection('portfolioFeedback').add(feedbackData);

        // 2. Format and Send Email
        const starRating = '⭐'.repeat(feedbackData.rating);
        const mailOptions = {
            from: `"Sigma Developers Feedback" <${SENDER_EMAIL}>`,
            to: 'sigmadeveloper.in@gmail.com',
            subject: `New Portfolio Feedback ${starRating}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #a855f7;">New Feedback Received</h2>
                    <hr style="border: 0; border-top: 1px solid #eee;">
                    <p><strong>Name:</strong> ${feedbackData.name}</p>
                    <p><strong>Email:</strong> ${feedbackData.email}</p>
                    <p><strong>Rating:</strong> ${starRating} (${feedbackData.rating}/5)</p>
                    <p><strong>Message:</strong></p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #a855f7;">
                        ${feedbackData.message.replace(/\n/g, '<br>')}
                    </div>
                    <hr style="border: 0; border-top: 1px solid #eee; margin-top: 20px;">
                    <p style="font-size: 0.8rem; color: #888;">
                        Timestamp: ${feedbackData.timestamp}<br>
                        Origin IP: ${feedbackData.ip}<br>
                        Device: ${feedbackData.userAgent}
                    </p>
                </div>
            `
        };

        // Only try to send email if SENDER_PASS is configured
        if (SENDER_PASS) {
            await transporter.sendMail(mailOptions);
        } else {
            console.warn('SENDER_PASS not set. Feedback stored in Firestore but email not sent.');
        }

        return res.status(200).json({ success: true, message: 'Feedback received' });

    } catch (error) {
        console.error('Error processing feedback:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

exports.sendFeedback = functions.https.onRequest(app);
