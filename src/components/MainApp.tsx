import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { PromptInput } from "@/components/PromptInput";
import { RightPanel } from "@/components/RightPanel";
import { HomeView } from "@/components/views/HomeView";
import { GenerateView } from "@/components/views/GenerateView";
import { HistoryView } from "@/components/views/HistoryView";
import { User } from "@supabase/supabase-js";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client directly
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://eokwdajkgbqvvekuvyup.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVva3dkYWprZ2JxdnZla3V2eXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MTgzMjIsImV4cCI6MjA3ODA5NDMyMn0.fg2R4_Fd2I3gxIRFachjF8RwfizigGpwBI29iS3FLqQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
import { firestoreService, GeneratedImage as FirestoreImage } from "@/lib/firestore";

interface UserData {
  name: string;
  email: string;
  role: string;
  industry: string;
  niche: string;
  useCases: string[];
  platforms: string[];
  imageTypes: string[];
  brandStyle: string[];
  brandColors: string[];
  goals: string[];
  frequency: string;
}

interface GeneratedImage {
  id: number;
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

interface MainAppProps {
  user: User | null;
  userData: UserData | null;
  onResetOnboarding: () => void;
}

export function MainApp({ user, userData: initialUserData, onResetOnboarding }: MainAppProps) {
  const [currentView, setCurrentView] = useState('home');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [settings, setSettings] = useState({
    temperature: 1,
    outputType: 'General',
    aspectRatio: 'Auto'
  });
  const [userData, setUserData] = useState<UserData | null>(initialUserData || JSON.parse(localStorage.getItem('userData') || 'null'));

  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [userData]);

  // Load images from Firestore when user logs in
  useEffect(() => {
    if (user) {
      firestoreService.setUserId(user.id);
      loadImagesFromFirestore();
    }
  }, [user]);

  const loadImagesFromFirestore = async () => {
    try {
      const firestoreImages = await firestoreService.getGeneratedImages();
      // Convert Firestore images to local format
      const localImages: GeneratedImage[] = firestoreImages.map(img => ({
        id: parseInt(img.id) || Date.now(), // Use timestamp as fallback
        prompt: img.prompt,
        imageUrl: img.imageUrl,
        textContent: img.textContent,
        timestamp: img.timestamp,
        settings: img.settings
      }));
      setGeneratedImages(localImages);
    } catch (error) {
      console.error('Error loading images from Firestore:', error);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setCurrentView('generate');

    try {
      // Use Supabase function to call Google AI Studio Imagen API (avoids CORS issues)
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt },
      });

      if (error) {
        throw new Error(`Error generating image: ${error.message}`);
      }

      // The Supabase function returns the image as base64 data URL
      const newImage = {
        id: Date.now(),
        prompt,
        imageUrl: data.imageUrl, // Base64 data URL from Supabase function
        textContent: data.textContent || prompt,
        timestamp: new Date().toISOString(),
        settings: { ...settings },
      };

      // Add the newly generated image to the list
      setGeneratedImages([newImage, ...generatedImages]);

      // Save to Firestore
      try {
        await firestoreService.saveGeneratedImage({
          prompt: newImage.prompt,
          imageUrl: newImage.imageUrl,
          textContent: newImage.textContent,
          timestamp: newImage.timestamp,
          settings: newImage.settings
        });
      } catch (firestoreError) {
        console.error('Error saving to Firestore:', firestoreError);
        // Don't show error to user as the image was generated successfully
      }

      setPrompt('');
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} user={user} onResetOnboarding={onResetOnboarding} />
      
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto py-12 px-6">
            {currentView === 'home' && (
              <HomeView user={user} generatedImages={generatedImages} />
            )}
            {currentView === 'generate' && (
              <GenerateView
                isGenerating={isGenerating}
                generatedImages={generatedImages}
                onDeleteImage={async (imageId) => {
                  // Remove from local state
                  setGeneratedImages(generatedImages.filter(img => img.id !== imageId));

                  // Remove from Firestore
                  try {
                    // Find the Firestore document ID for this image
                    const firestoreImages = await firestoreService.getGeneratedImages();
                    const firestoreImage = firestoreImages.find(img => parseInt(img.id) === imageId || img.id === imageId.toString());
                    if (firestoreImage) {
                      await firestoreService.deleteGeneratedImage(firestoreImage.id);
                    }
                  } catch (error) {
                    console.error('Error deleting from Firestore:', error);
                    // Reload images to sync state
                    loadImagesFromFirestore();
                  }
                }}
              />
            )}
            {currentView === 'history' && (
              <HistoryView generatedImages={generatedImages} />
            )}
          </div>
        </div>

        <PromptInput 
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      </div>

      <RightPanel settings={settings} setSettings={setSettings} />
    </div>
  );
}
