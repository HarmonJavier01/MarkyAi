import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client directly
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://yasedtunkmdxyziojxqh.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_N-_nJVqMJRS-AxR3lFCi6A_ZuLBN8G';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});

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

export class FirestoreService {
  private static instance: FirestoreService;
  private userId: string | null = null;

  static getInstance(): FirestoreService {
    if (!FirestoreService.instance) {
      FirestoreService.instance = new FirestoreService();
    }
    return FirestoreService.instance;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  async saveGeneratedImage(image: Omit<GeneratedImage, 'id'>): Promise<string> {
    if (!this.userId) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('generated_images')
        .insert({
          ...image,
          user_id: this.userId,
        })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  }

  async getGeneratedImages(): Promise<GeneratedImage[]> {
    if (!this.userId) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', this.userId)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data.map(item => ({
        id: item.id,
        prompt: item.prompt,
        imageUrl: item.image_url,
        textContent: item.text_content,
        timestamp: item.timestamp,
        settings: item.settings
      }));
    } catch (error) {
      console.error('Error fetching images:', error);
      throw error;
    }
  }

  async deleteGeneratedImage(imageId: string): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('generated_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
}

export const firestoreService = FirestoreService.getInstance();
