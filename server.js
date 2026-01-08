const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from current directory

// Contact Route
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: '全ての項目を入力してください。' });
    }

    // SMTP Transporter Configuration
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    // Email Options
    const mailOptions = {
        from: `"${name}" <${email}>`, // sender address
        to: 'info@camoufla.com', // list of receivers
        subject: `[CAMOUFLA Site] Contact from ${name}`, // Subject line
        text: `
Name: ${name}
Email: ${email}

Message:
${message}
        `, // plain text body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Message sent successfully');
        res.status(200).json({ success: true, message: 'お問い合わせを受け付けました。' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: '送信に失敗しました。後ほど再度お試しください。' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
