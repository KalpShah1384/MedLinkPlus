import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Create a transporter that works with any email provider
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Test the transporter connection
transporter.verify((error, success) => {
    if (error) {
        console.error('Failed to verify transporter:', error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

// Contact form submission route
router.post('/submit', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        console.log('Attempting to send email...');
        console.log('Email User:', process.env.EMAIL_USER);
        console.log('Contact Email:', process.env.CONTACT_EMAIL);

        // Email template
        const mailOptions = {
            from: `${name} <${email}>`,
            to: process.env.CONTACT_EMAIL,
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <h3>Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);

        res.status(200).json({ 
            message: 'Message sent successfully',
            response: 'Your message has been sent successfully. We will get back to you soon.'
        });
    } catch (error) {
        console.error('Error sending email:', error);
        console.error('Error details:', error.response);
        
        res.status(500).json({ 
            error: 'Failed to send message. Please try again later.',
            details: error.message,
            response: error.response
        });
    }
});

export default router;
