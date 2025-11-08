import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { PromptInput } from "@/components/PromptInput";
import { RightPanel } from "@/components/RightPanel";
import { HomeView } from "@/components/views/HomeView";
import { GenerateView } from "@/components/views/GenerateView";
import { HistoryView } from "@/components/views/HistoryView";
import { User } from "firebase/auth";
import { supabase } from "@/integrations/supabase/client";

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

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setCurrentView('generate');

    try {
      // Use Supabase function to call Pollination API (avoids CORS issues)
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
