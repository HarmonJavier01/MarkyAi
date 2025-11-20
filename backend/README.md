# Marky AI Email Service

A robust email service built with Node.js, Express, and SendGrid for sending various types of emails in the Marky AI application.

## Features

- 📧 Multiple email templates (welcome, verification, password reset, etc.)
- 🎨 Beautiful HTML email templates with responsive design
- 🔒 Secure API with validation
- 🚀 Easy integration with frontend applications
- 📊 Health check endpoint
- 🛡️ CORS support for cross-origin requests

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env` and fill in your values:

   ```bash
   cp .env.example .env
   ```

   Required environment variables:

   - `SENDGRID_API_KEY`: Your SendGrid API key (starts with SG...)
   - `SENDGRID_FROM_EMAIL`: Verified sender email (e.g., noreply@markyai.com)
   - `FRONTEND_URL`: Your frontend URL (default: http://localhost:3000)
   - `PORT`: Server port (default: 5000)

3. **Start the server:**

   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### POST /send-email

Send an email using one of the predefined templates.

**Request Body:**

```json
{
  "type": "welcome",
  "to": "user@example.com",
  "name": "John Doe"
}
```

**Available Email Types:**

- `welcome` - Welcome new users
  - Required: `name`
- `verification` - Email verification
  - Required: `name`, `verificationUrl`
- `password-reset` - Password reset request
  - Required: `resetUrl`
  - Optional: `expiryTime`, `requestTime`
- `password-changed` - Password change confirmation
  - Required: `name`
  - Optional: `changeTime`
- `login-notification` - Login activity notification
  - Required: `name`
  - Optional: `loginTime`, `location`, `userAgent`
- `security-alert` - Security alert for failed logins
  - Optional: `attemptCount`, `timestamp`, `resetPasswordUrl`

**Response:**

```json
{
  "success": true,
  "message": "welcome email sent successfully",
  "emailType": "welcome"
}
```

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "OK",
  "service": "Marky AI Email Service",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Usage Examples

### Welcome Email

```javascript
fetch("http://localhost:5000/send-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "welcome",
    to: "user@example.com",
    name: "John Doe",
  }),
});
```

### Password Reset Email

```javascript
fetch("http://localhost:5000/send-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "password-reset",
    to: "user@example.com",
    resetUrl: "https://yourapp.com/reset-password?token=abc123",
    expiryTime: "1 hour",
    requestTime: Date.now(),
  }),
});
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (missing required fields, unknown template)
- `500` - Internal Server Error (SendGrid issues, server errors)

## Security

- Input validation for all required fields
- CORS protection
- Environment variable configuration
- Error logging without exposing sensitive information

## Development

- Uses `nodemon` for development with auto-restart
- Comprehensive error handling
- Console logging for debugging
- Modular template system for easy maintenance

## License

ISC
