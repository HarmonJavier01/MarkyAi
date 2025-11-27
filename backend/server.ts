import express, { Request, Response } from 'express';
import sgMail from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/mail';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173'
}));
app.use(express.json());

// Define request body type
interface SendEmailRequest {
  to: string;
  subject?: string;
  html?: string;
  text?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, unknown>;
}

// Define response types
interface SuccessResponse {
  success: true;
  message: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

interface HealthResponse {
  status: string;
  message: string;
}

// Health check endpoint
app.get('/health', (req: Request, res: Response<HealthResponse>) => {
  res.json({ status: 'ok', message: 'Email API is running' });
});

// Send email endpoint
app.post('/api/send-email', async (
  req: Request<object, SuccessResponse | ErrorResponse, SendEmailRequest>,
  res: Response<SuccessResponse | ErrorResponse>
) => {
  try {
    const { to, subject, html, text, templateId, dynamicTemplateData } = req.body;

    // Validate required fields
    if (!to) {
      return res.status(400).json({ error: 'Recipient email is required' });
    }

    // Prepare email message
    const msg: Partial<MailDataRequired> = {
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL!,
        name: 'Marky AI Studio'
      }
    };

    // Use template or custom content
    if (templateId) {
      msg.templateId = templateId;
      msg.dynamicTemplateData = dynamicTemplateData || {};
    } else {
      if (!subject) {
        return res.status(400).json({ error: 'Subject is required when not using template' });
      }
      msg.subject = subject;
      msg.html = html;
      msg.text = text || html?.replace(/<[^>]*>/g, ''); // Strip HTML for text version
    }

    // Send email
    await sgMail.send(msg as MailDataRequired);
    
    console.log(`Email sent successfully to ${to}`);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('SendGrid error:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    
    // Type guard for SendGrid specific errors
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const sgError = error as { response: { body: unknown } };
      console.error('SendGrid response:', sgError.response.body);
    }
    
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Email API server running on http://localhost:${PORT}`);
  console.log(`✅ SendGrid configured with: ${process.env.SENDGRID_FROM_EMAIL}`);
});