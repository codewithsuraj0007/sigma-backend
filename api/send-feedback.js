import {
  applyCors,
  createFeedbackTransporter,
  escapeHtml,
  handleOptions,
  readJsonBody,
  sendJson
} from './_utils.js';

function getStarRating(value) {
  const normalized = Number.parseInt(value, 10);
  const safeRating = Number.isNaN(normalized) ? 0 : Math.min(Math.max(normalized, 1), 5);
  return { safeRating, stars: '*'.repeat(safeRating) };
}

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
    const name = body?.name?.trim();
    const email = body?.email?.trim() || 'Not provided';
    const message = body?.message?.trim();
    const timestamp = body?.timestamp || new Date().toISOString();
    const { safeRating, stars } = getStarRating(body?.rating);

    if (!name || !message || safeRating === 0) {
      sendJson(res, 400, { error: 'name, rating, and message are required' });
      return;
    }

    if (!process.env.EMAIL_USER) {
      sendJson(res, 500, { error: 'EMAIL_USER is not configured' });
      return;
    }

    const transporter = createFeedbackTransporter();
    if (!transporter) {
      sendJson(res, 500, { error: 'EMAIL_PASS is not configured' });
      return;
    }

    await transporter.sendMail({
      from: `"Sigma Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email !== 'Not provided' ? email : undefined,
      subject: `New Portfolio Feedback ${stars}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 16px; color: #111827;">New Portfolio Feedback</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Rating:</strong> ${escapeHtml(stars)} (${safeRating}/5)</p>
          <p><strong>Message:</strong></p>
          <div style="padding: 16px; background: #f9fafb; border-left: 4px solid #111827; white-space: pre-wrap;">${escapeHtml(message)}</div>
          <p style="margin-top: 16px; color: #6b7280; font-size: 12px;">Submitted at: ${escapeHtml(timestamp)}</p>
        </div>
      `
    });

    sendJson(res, 200, { success: true, message: 'Feedback sent successfully' });
  } catch (error) {
    if (error instanceof SyntaxError) {
      sendJson(res, 400, { error: 'Request body must be valid JSON' });
      return;
    }

    sendJson(res, 500, { error: 'Email service error' });
  }
}
