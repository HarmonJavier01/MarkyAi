import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { PromptInput } from "@/components/PromptInput";
import { RightPanel } from "@/components/RightPanel";
import { HomeView } from "@/components/views/HomeView";
import { GenerateView } from "@/components/views/GenerateView";
import { HistoryView } from "@/components/views/HistoryView";
import { User } from "firebase/auth";

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
  onResetOnboarding: () => void;
}

export function MainApp({ user, onResetOnboarding }: MainAppProps) {
  const [currentView, setCurrentView] = useState('home');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [settings, setSettings] = useState({
    temperature: 1,
    outputType: 'General',
    aspectRatio: 'Auto'
  });

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setCurrentView('generate');

    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt }
      });

      if (error) {
        console.error('Error generating image:', error);
        throw error;
      }

      const newImage = {
        id: Date.now(),
        prompt,
        imageUrl: data.imageUrl,
        textContent: data.textContent,
        timestamp: new Date().toISOString(),
        settings: { ...settings }
      };
      
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
      <Sidebar currentView={currentView} onNavigate={setCurrentView} user={user} />
      
      <div className="flex-1 flex flex-col">
        <TopBar onResetOnboarding={onResetOnboarding} />
        
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
