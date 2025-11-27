import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface EmailData {
  to: string;
  from: string;
  subject: string;
  html: string;
}

interface RequestData {
  type: string;
  to?: string;
  name?: string;
  verificationUrl?: string;
  resetUrl?: string;
  expiryTime?: string;
  supportEmail?: string;
  loginUrl?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = 'https://yasedtunkmdxyziojxqh.supabase.co'
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestData: RequestData = await req.json()
    const { type, ...data } = requestData

    if (!supabaseAnonKey || !supabaseServiceRoleKey) {
      throw new Error('SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY environment variables not set')
    }

    let emailData: EmailData

    switch (type) {
      case 'welcome':
        if (!data.to || !data.name) {
          throw new Error('Missing required fields: to, name')
        }
        emailData = {
          to: data.to,
          from: 'noreply@markyai.com',
          subject: 'Welcome to Marky AI!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Welcome ${data.name}!</h1>
              <p>Thank you for joining Marky AI Studio.</p>
              <p>Your account has been created successfully.</p>
              <p>Get started by logging in and exploring our features.</p>
              <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                <p style="margin: 0;"><strong>Next steps:</strong></p>
                <ul>
                  <li>Complete your profile</li>
                  <li>Explore our AI image generation tools</li>
                  <li>Join our community</li>
                </ul>
              </div>
            </div>
          `
        }
        break

      case 'verification':
        if (!data.to || !data.name || !data.verificationUrl) {
          throw new Error('Missing required fields: to, name, verificationUrl')
        }
        emailData = {
          to: data.to,
          from: 'noreply@markyai.com',
          subject: 'Verify your Marky AI account',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Verify Your Email</h1>
              <p>Hello ${data.name},</p>
              <p>Thank you for signing up for Marky AI! Please verify your email address to complete your registration.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email Address</a>
              </div>
              <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666; font-size: 12px;">${data.verificationUrl}</p>
              <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
            </div>
          `
        }
        break

      case 'password-reset':
        if (!data.to || !data.resetUrl) {
          throw new Error('Missing required fields: to, resetUrl')
        }
        emailData = {
          to: data.to,
          from: 'noreply@markyai.com',
          subject: 'Reset your Marky AI password',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Password Reset</h1>
              <p>You requested a password reset for your Marky AI account.</p>
              <p>If you didn't request this, please ignore this email.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.resetUrl}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
              </div>
              <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666; font-size: 12px;">${data.resetUrl}</p>
              <p style="color: #666; font-size: 14px;">This link will expire in ${data.expiryTime || '1 hour'}.</p>
            </div>
          `
        }
        break

      case 'reset-request-notification':
        if (!data.to || !data.supportEmail) {
          throw new Error('Missing required fields: to, supportEmail')
        }
        emailData = {
          to: data.to,
          from: 'noreply@markyai.com',
          subject: 'Password reset requested - Security Alert',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #dc3545;">Security Alert</h1>
              <p>A password reset was requested for your Marky AI account.</p>
              <p><strong>If this wasn't you:</strong></p>
              <ul>
                <li>Change your password immediately</li>
                <li>Contact our support team</li>
                <li>Review your account activity</li>
              </ul>
              <p>If you requested this reset, you can safely ignore this email.</p>
              <p>Support: <a href="mailto:${data.supportEmail}">${data.supportEmail}</a></p>
            </div>
          `
        }
        break

      case 'password-changed':
        if (!data.to || !data.name) {
          throw new Error('Missing required fields: to, name')
        }
        emailData = {
          to: data.to,
          from: 'noreply@markyai.com',
          subject: 'Password changed successfully',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #28a745;">Password Updated</h1>
              <p>Hello ${data.name},</p>
              <p>Your password has been successfully changed.</p>
              <p>If you didn't make this change, please contact support immediately at <a href="mailto:support@markyai.com">support@markyai.com</a>.</p>
              <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                <p style="margin: 0;"><strong>Security Tips:</strong></p>
                <ul>
                  <li>Use a strong, unique password</li>
                  <li>Enable two-factor authentication</li>
                  <li>Never share your password</li>
                </ul>
              </div>
            </div>
          `
        }
        break

      case 'verification-reminder':
        if (!data.to || !data.name || !data.verificationUrl) {
          throw new Error('Missing required fields: to, name, verificationUrl')
        }
        emailData = {
          to: data.to,
          from: 'noreply@markyai.com',
          subject: 'Reminder: Verify your Marky AI account',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Account Verification Reminder</h1>
              <p>Hello ${data.name},</p>
              <p>We noticed you haven't verified your email address yet.</p>
              <p>Please verify your email to complete your registration and start using Marky AI.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email Now</a>
              </div>
            </div>
          `
        }
        break

      case 'welcome-immediate':
        if (!data.to || !data.name || !data.loginUrl) {
          throw new Error('Missing required fields: to, name, loginUrl')
        }
        emailData = {
          to: data.to,
          from: 'noreply@markyai.com',
          subject: 'Welcome to Marky AI!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Welcome ${data.name}!</h1>
              <p>Your Marky AI account is ready to use.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.loginUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Login to Your Account</a>
              </div>
              <p>Start exploring our AI-powered image generation tools and create amazing content!</p>
            </div>
          `
        }
        break

      default:
        throw new Error(`Unknown email type: ${type}`)
    }

    // Send email via Supabase
    const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/send_email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceRoleKey}`,
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
      }),
    })

    if (!supabaseResponse.ok) {
      const errorText = await supabaseResponse.text()
      console.error('Supabase email API error:', supabaseResponse.status, errorText)
      throw new Error(`Supabase email API error: ${supabaseResponse.status} - ${errorText}`)
    }

    console.log(`Email sent successfully to ${emailData.to} for type: ${type}`)

    return new Response(JSON.stringify({
      success: true,
      message: 'Email sent successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in send-email function:', error)
    return new Response(JSON.stringify({
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
