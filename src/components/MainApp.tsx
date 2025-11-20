import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { PromptInput } from "@/components/PromptInput";
import { RightPanel } from "@/components/RightPanel";
import { HomeView } from "@/components/views/HomeView";
import { GenerateView } from "@/components/views/GenerateView";
import { HistoryView } from "@/components/views/HistoryView";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/neon";
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
  sessionId: string;
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
  const [prompt, setPrompt] = useState(() => localStorage.getItem('currentPrompt') || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState(() => crypto.randomUUID());
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
        sessionId: img.sessionId,
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
    console.log('🍌 Calling Nano Banana Edge Function...');

    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { prompt },
    });

    if (error) {
      console.error('❌ Edge Function Error:', error);
      throw new Error(error.message || 'Failed to generate image');
    }

    if (!data || !data.imageUrl) {
      console.error('❌ No image URL in response:', data);
      throw new Error('No image returned from API');
    }

    console.log('✅ Nano Banana image generated successfully 🍌');

    const newImage = {
      id: Date.now(),
      sessionId: currentSessionId,
      prompt,
      imageUrl: data.imageUrl,
      textContent: prompt,
      timestamp: new Date().toISOString(),
      settings: { ...settings },
    };

    setGeneratedImages([newImage, ...generatedImages]);
    
    await firestoreService.saveGeneratedImage({
      sessionId: newImage.sessionId,
      prompt: newImage.prompt,
      imageUrl: newImage.imageUrl,
      textContent: newImage.textContent,
      timestamp: newImage.timestamp,
      settings: newImage.settings
    });

    // Clear the prompt after successful generation
    setPrompt('');
    localStorage.removeItem('currentPrompt');
  } catch (error) {
    console.error('❌ Failed to generate image:', error);
    alert(`Failed to generate image: ${error.message}`);
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
