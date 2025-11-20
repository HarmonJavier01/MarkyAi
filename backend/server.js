// server.js
require('dotenv').config(); // To load environment variables
const express = require('express');
const sgMail = require('@sendgrid/mail');
const bodyParser = require('body-parser');

// Initialize SendGrid API
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// Endpoint to send email
app.post('/send-email', async (req, res) => {
  const { email, subject, message } = req.body;

  const msg = {
    to: email,
    from: 'hakdoglang112@gmail.com',  // Use your verified SendGrid email
    subject: subject,
    text: message,
  };

  try {
    await sgMail.send(msg);
    res.status(200).send({ message: 'Email sent successfully!' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
