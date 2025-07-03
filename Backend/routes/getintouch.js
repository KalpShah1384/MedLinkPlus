import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Create a transporter for Get in Touch (separate email)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GETINTOUCH_EMAIL_USER, // new email for Get in Touch
        pass: process.env.GETINTOUCH_EMAIL_PASSWORD // app password for Get in Touch
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Failed to verify Get in Touch transporter:', error);
    } else {
        console.log('Get in Touch email server is ready');
    }
});

// Get in Touch form submission route
router.post('/submit', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Email template
        const mailOptions = {
            from: `${name} <${email}>`,
            to: process.env.GETINTOUCH_CONTACT_EMAIL, // recipient for Get in Touch
            subject: `New Get in Touch Submission from ${name}`,
            html: `
                <h3>Get in Touch Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Get in Touch message sent: %s', info.messageId);

        res.status(200).json({ 
            message: 'Message sent successfully',
            response: 'Your message has been sent successfully. We will get back to you soon.'
        });
    } catch (error) {
        console.error('Error sending Get in Touch email:', error);
        res.status(500).json({ 
            error: 'Failed to send message. Please try again later.',
            details: error.message,
            response: error.response
        });
    }
});

export default router;
