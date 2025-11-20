import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_NEON_SUPABASE_URL || 'https://yasedtunkmdxyziojxqh.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_NEON_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhc2VkdHVua21keHl6aW9qeHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMDM4MjEsImV4cCI6MjA3ODU3OTgyMX0.EbL40iawPJHlXG6UCfwe4v7UONOmwVX5UpRCGhIj8jg';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  textContent?: string;
  timestamp: string;
  settings: {
    temperature: number;
    outputType: string;
    aspectRatio: string;
  };
}

class FirestoreService {
  private userId: string | null = null;

  setUserId(userId: string) {
    this.userId = userId;
  }

  async saveGeneratedImage(image: Omit<GeneratedImage, 'id'>): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('generated_images')
      .insert({
        userId: this.userId,
        prompt: image.prompt,
        imageUrl: image.imageUrl,
        textContent: image.textContent,
        timestamp: image.timestamp,
        settings: image.settings,
      });

    if (error) throw error;
  }

  async getGeneratedImages(): Promise<GeneratedImage[]> {
    if (!this.userId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('generated_images')
      .select('*')
      .eq('userId', this.userId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async deleteGeneratedImage(id: string): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('generated_images')
      .delete()
      .eq('id', id)
      .eq('userId', this.userId);

    if (error) throw error;
  }
}

export const firestoreService = new FirestoreService();