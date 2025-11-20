// api/send-email.js (or send-email.ts for TypeScript)
// This can be an Express.js route, Next.js API route, or standalone server

const sgMail = require('@sendgrid/mail');

// Set your SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Email templates
const emailTemplates = {
  welcome: {
    subject: "Welcome to Marky AI Studio! 🎉",
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Marky AI! 🚀</h1>
        </div>
        
        <h2 style="color: #333; margin-bottom: 20px;">Hi ${data.name}! 👋</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Welcome to Marky AI Studio! We're thrilled to have you join our community of creators and innovators.
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">🎯 What's Next?</h3>
          <ul style="color: #666; line-height: 1.8;">
            <li>🍌 Try our Nano Banana image generator</li>
            <li>📸 Upload reference images for editing</li>
            <li>🎨 Explore different creative styles</li>
            <li>📚 Check out our getting started guide</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/dashboard" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: bold;
                    display: inline-block;">
            Get Started Now 🚀
          </a>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; color: #999; font-size: 14px;">
          <p>Need help? Reply to this email or contact us at support@markyai.com</p>
          <p>© 2024 Marky AI Studio. All rights reserved.</p>
        </div>
      </div>
    `
  },

  verification: {
    subject: "Please verify your Marky AI account 📧",
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 12px; margin-bottom: 30px;">
          <h1 style="color: #333; margin: 0;">Verify Your Email 📧</h1>
        </div>
        
        <h2 style="color: #333;">Hi ${data.name}!</h2>
        
        <p style="color: #666; line-height: 1.6;">
          Thanks for signing up with Marky AI Studio! To complete your registration and start creating amazing images, please verify your email address.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationUrl}" 
             style="background: #28a745; 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: bold;
                    display: inline-block;">
            ✅ Verify Email Address
          </a>
        </div>
        
        <p style="color: #999; font-size: 14px;">
          If the button doesn't work, copy and paste this link: ${data.verificationUrl}
        </p>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <p style="margin: 0; color: #856404;">
            <strong>⏰ This verification link expires in 24 hours.</strong>
          </p>
        </div>
      </div>
    `
  },

  "login-notification": {
    subject: "New login to your Marky AI account 🔐",
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #e3f2fd; border-radius: 12px; margin-bottom: 20px;">
          <h1 style="color: #1976d2; margin: 0;">🔐 Login Notification</h1>
        </div>
        
        <h2 style="color: #333;">Hi ${data.name}!</h2>
        
        <p style="color: #666; line-height: 1.6;">
          We're letting you know that someone just signed in to your Marky AI account.
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Login Details:</h3>
          <ul style="color: #666; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li><strong>Time:</strong> ${new Date(data.loginTime).toLocaleString()}</li>
            <li><strong>Location:</strong> ${data.location}</li>
            <li><strong>Device:</strong> ${data.userAgent.substring(0, 50)}...</li>
          </ul>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #856404;">
            <strong>🛡️ Wasn't you?</strong> If you didn't sign in, please 
            <a href="${process.env.FRONTEND_URL}/forgot-password" style="color: #dc3545;">reset your password immediately</a> 
            and contact our support team.
          </p>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          This is an automated security notification. No action is required if this was you.
        </p>
      </div>
    `
  },

  "password-reset": {
    subject: "Reset your Marky AI password 🔑",
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #fff3cd; border-radius: 12px; margin-bottom: 20px;">
          <h1 style="color: #856404; margin: 0;">🔑 Password Reset Request</h1>
        </div>
        
        <p style="color: #666; line-height: 1.6;">
          We received a request to reset the password for your Marky AI account. If you made this request, click the button below to reset your password.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetUrl}" 
             style="background: #dc3545; 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: bold;
                    display: inline-block;">
            🔐 Reset Password
          </a>
        </div>
        
        <div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
          <h3 style="color: #721c24; margin-top: 0;">⚠️ Important Security Information:</h3>
          <ul style="color: #721c24; margin: 0; padding-left: 20px;">
            <li>This link expires in ${data.expiryTime}</li>
            <li>Request made at: ${new Date(data.requestTime).toLocaleString()}</li>
            <li>If you didn't request this, please ignore this email</li>
          </ul>
        </div>
        
        <p style="color: #999; font-size: 14px;">
          If the button doesn't work, copy and paste: ${data.resetUrl}
        </p>
      </div>
    `
  },

  "password-changed": {
    subject: "Your Marky AI password has been changed ✅",
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #d4edda; border-radius: 12px; margin-bottom: 20px;">
          <h1 style="color: #155724; margin: 0;">✅ Password Changed Successfully</h1>
        </div>
        
        <h2 style="color: #333;">Hi ${data.name}!</h2>
        
        <p style="color: #666; line-height: 1.6;">
          Your Marky AI account password has been successfully changed.
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #666;">
            <strong>Changed on:</strong> ${new Date(data.changeTime).toLocaleString()}
          </p>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #856404;">
            <strong>🛡️ Didn't change your password?</strong> 
            If this wasn't you, please contact our support team immediately at support@markyai.com
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/login" 
             style="background: #28a745; 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: bold;
                    display: inline-block;">
            🚀 Continue to Marky AI
          </a>
        </div>
      </div>
    `
  },

  "security-alert": {
    subject: "⚠️ Multiple failed login attempts - Marky AI Security Alert",
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #f8d7da; border-radius: 12px; margin-bottom: 20px;">
          <h1 style="color: #721c24; margin: 0;">⚠️ Security Alert</h1>
        </div>
        
        <p style="color: #666; line-height: 1.6;">
          We've detected ${data.attemptCount} failed login attempts on your Marky AI account.
        </p>
        
        <div style="background: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
          <h3 style="color: #721c24; margin-top: 0;">🔒 Account Security:</h3>
          <ul style="color: #721c24; margin: 0; padding-left: 20px;">
            <li>Last attempt: ${new Date(data.timestamp).toLocaleString()}</li>
            <li>If this was you, consider resetting your password</li>
            <li>If this wasn't you, your account may be under attack</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetPasswordUrl}" 
             style="background: #dc3545; 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: bold;
                    display: inline-block;">
            🔐 Reset Password Now
          </a>
        </div>
        
        <p style="color: #999; font-size: 14px;">
          If you believe your account is compromised, contact support@markyai.com immediately.
        </p>
      </div>
    `
  }
};

// Main email sending function
const sendEmail = async (req, res) => {
  try {
    const { type, to, ...data } = req.body;
    
    if (!type || !to) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email type and recipient are required' 
      });
    }

    const template = emailTemplates[type];
    if (!template) {
      return res.status(400).json({ 
        success: false, 
        error: `Unknown email template: ${type}` 
      });
    }

    const msg = {
      to: to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: 'Marky AI Studio'
      },
      subject: template.subject,
      html: template.html(data),
    };

    // Send email
    await sgMail.send(msg);
    
    console.log(`✅ Email sent successfully: ${type} to ${to}`);
    
    res.json({ 
      success: true, 
      message: `${type} email sent successfully`,
      emailType: type 
    });

  } catch (error) {
    console.error('❌ SendGrid Error:', error);
    
    // Handle specific SendGrid errors
    if (error.response) {
      const { status, body } = error.response;
      return res.status(status).json({ 
        success: false, 
        error: 'Failed to send email',
        details: body 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
};

module.exports = { sendEmail };

// For Express.js app:
// app.post('/api/send-email', sendEmail);

// For Next.js API route:
// export default function handler(req, res) {
//   if (req.method === 'POST') {
//     return sendEmail(req, res);
//   }
//   res.status(405).json({ error: 'Method not allowed' });
// }