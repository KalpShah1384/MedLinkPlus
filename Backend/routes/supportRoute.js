import express from 'express';
import authUser from '../middleware/authUser.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// POST /api/support
router.post('/', authUser, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and message are required.' });
    }

    // Setup nodemailer transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Compose email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.SUPPORT_EMAIL || process.env.EMAIL_USER,
      subject: `Support Request: ${subject}`,
      text: `User ID: ${req.user.id}\nEmail: ${req.user.email || 'N/A'}\n\nMessage:\n${message}`
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Support request sent successfully.' });
  } catch (error) {
    console.error('Support email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send support request.' });
  }
});

export default router;
