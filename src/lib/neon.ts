import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for Neon Console
const SUPABASE_URL = import.meta.env.VITE_NEON_SUPABASE_URL || 'https://yasedtunkmdxyziojxqh.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_NEON_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhc2VkdHVua21keHl6aW9qeHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMDM4MjEsImV4cCI6MjA3ODU3OTgyMX0.EbL40iawPJHlXG6UCfwe4v7UONOmwVX5UpRCGhIj8jg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Export auth from supabase (Neon auth)
export const auth = supabase.auth;

// Export User type from supabase
export type User = import('@supabase/supabase-js').User;

// Google OAuth provider setup for Neon
export const googleProvider = {
  provider: 'google' as const,
  options: {
    redirectTo: `${window.location.origin}/`,
    queryParams: {
      access_type: 'offline',
      prompt: 'consent'
    }
  }
};
