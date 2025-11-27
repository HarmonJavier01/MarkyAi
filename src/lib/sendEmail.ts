interface SendEmailParams {
  to: string;
  subject?: string;
  html?: string;
  text?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, unknown>;
}

export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  try {
    // Use the backend API endpoint instead of Supabase Edge Function
    const backendUrl = process.env.NODE_ENV === 'production'
      ? 'https://your-backend-domain.com' // Replace with your production backend URL
      : 'http://localhost:3001';

    const response = await fetch(`${backendUrl}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send email');
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Add template IDs
export const TEMPLATE_IDS = {
  welcome: 'd-f0af2ba389a045e1885ea80b85b36e28', // Replace with your template ID
  passwordReset: 'd-yyyyyyyyyyy',
};


// Pre-defined email templates
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: '🎉 Welcome to Marky AI Studio!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Welcome to Marky AI Studio!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name}! 👋</h2>
              <p>Thank you for joining Marky AI Studio. We're thrilled to have you as part of our community!</p>
              <p>Here's what you can do next:</p>
              <ul>
                <li>Complete your profile</li>
                <li>Explore our AI tools</li>
                <li>Create your first project</li>
              </ul>
              <a href="${typeof window !== 'undefined' ? window.location.origin : ''}" class="button">Get Started</a>
            </div>
            <div class="footer">
              <p>© 2024 Marky AI Studio. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  })
};