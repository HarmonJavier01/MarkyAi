// backend/server.js or api/send-email.js
import express from 'express';
import sgMail from '@sendgrid/mail';

const app = express();
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html, templateId, dynamicTemplateData } = req.body;
    
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject,
      html,
      // Or use templates:
      templateId,
      dynamicTemplateData
    };

    await sgMail.send(msg);
    res.json({ success: true });
  } catch (error) {
    console.error('SendGrid error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log('API running on port 3001'));