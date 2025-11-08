# Marky AI Studio

An AI-powered image generation platform built with React, TypeScript, Firebase, and Supabase. Generate stunning images using Google Gemini 2.5 Flash with an intuitive web interface.

## 🚀 Features

- **AI Image Generation**: Create images using Google Gemini 2.5 Flash
- **User Authentication**: Secure login/signup with Firebase Authentication
- **Password Recovery**: Forgot password functionality
- **Responsive Design**: Modern, clean UI that works on all devices
- **Image History**: View and manage your generated images
- **Real-time Generation**: Instant image creation with progress feedback
- **Serverless Backend**: Supabase Edge Functions for scalable API calls

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Backend & Services

- **Firebase** - Authentication and user management
- **Supabase** - Database and Edge Functions
- **Google Gemini 2.5 Flash** - AI image generation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd MarkyAi
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env.local` file in the root directory and add your environment variables:

   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Supabase Setup**

   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Set up environment variables in Supabase:

     ```bash
     GEMINI_API_KEY=your_google_gemini_api_key
     ```

   - Deploy the Edge Function:
     ```bash
     npx supabase login
     npx supabase functions deploy generate-image
     ```

## 🏃‍♂️ Running the Application

1. **Start the development server**

   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage

### Getting Started

1. **Sign Up**: Create a new account or log in with existing credentials
2. **Enter Prompt**: Type your image description in the prompt input
3. **Generate**: Click the generate button to create your image
4. **View Results**: See your generated images in the main view
5. **Browse History**: Switch to the history view to see all your previous generations

### Features Overview

#### Authentication

- Secure user registration and login
- Password reset via email
- Protected routes and user sessions

#### Image Generation

- Text-to-image generation using Gemini 2.5 Flash
- Real-time progress feedback
- High-quality image output
- Base64 encoded images for instant display

#### User Interface

- Clean, modern design
- Responsive layout for mobile and desktop
- Intuitive navigation with sidebar
- Dark/light theme support

## 🏗️ Project Structure

```
MarkyAi/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── MainApp.tsx     # Main application component
│   │   ├── Sidebar.tsx     # Navigation sidebar
│   │   ├── PromptInput.tsx # Image generation input
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Login.tsx       # Login page
│   │   ├── Signup.tsx      # Registration page
│   │   └── ForgotPassword.tsx
│   ├── integrations/       # External service integrations
│   │   └── supabase/       # Supabase client setup
│   └── ...
├── supabase/
│   └── functions/          # Edge Functions
│       └── generate-image/ # Image generation function
├── public/                 # Static assets
├── package.json
├── vite.config.ts
└── README.md
```

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication with Email/Password provider
3. Copy your Firebase config to `.env.local`

### Supabase Setup

1. Create a Supabase project
2. Get your project URL and anon key
3. Add `GEMINI_API_KEY` to Supabase environment variables
4. Deploy the `generate-image` function

### Google Gemini API

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your Supabase environment variables

## 🚀 Deployment

### Frontend Deployment

The app can be deployed to any static hosting service:

**Vercel:**

```bash
npm install -g vercel
vercel
```

**Netlify:**

```bash
npm install -g netlify-cli
netlify deploy
```

### Backend Deployment

Supabase Edge Functions are automatically deployed when you run:

```bash
npx supabase functions deploy generate-image
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/HarmonJavier01/MarkyAi.git) page
2. Create a new issue with detailed information
3. Include error messages, browser console logs, and steps to reproduce

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) for AI image generation
- [Firebase](https://firebase.google.com/) for authentication
- [Supabase](https://supabase.com/) for backend services
- [React](https://reactjs.org/) for the UI framework
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Made with ❤️ using modern web technologies**
