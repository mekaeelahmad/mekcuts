const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public')); // Serve static files from the "public" directory

// Route to handle booking form submission
app.post('/send', (req, res) => {
    const { date, time, phone } = req.body;

    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Use environment variables
            pass: process.env.EMAIL_PASS  // Use environment variables
        }
    });

    // Set up email data
    let mailOptions = {
        from: process.env.EMAIL_USER, // Use environment variables
        to: process.env.RECIPIENT_EMAIL_USER,   // Use environment variables
        subject: 'New Booking Request',
        text: `New booking request received:\n\nDate: ${date}\nTime: ${time}\nPhone: ${phone}`
    };

    // Send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
