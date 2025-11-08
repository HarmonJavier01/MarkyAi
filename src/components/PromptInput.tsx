import { HelpCircle, Plus, Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRef, useState, useEffect } from "react";

interface PromptInputProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onPhotoUpload?: (file: File) => void;
  onPhotoRemove?: () => void;
}

export function PromptInput({ 
  prompt, 
  setPrompt, 
  onGenerate, 
  isGenerating,
  onPhotoUpload,
  onPhotoRemove
}: PromptInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [wasGenerating, setWasGenerating] = useState(false);

  const handleRemovePhoto = () => {
    setUploadedPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onPhotoRemove) {
      onPhotoRemove();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setUploadedPhoto(previewUrl);
      
      if (onPhotoUpload) {
        onPhotoUpload(file);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Clear photo preview after generation completes
  useEffect(() => {
    if (wasGenerating && !isGenerating) {
      // Generation just completed
      handleRemovePhoto();
    }
    setWasGenerating(isGenerating);
  }, [isGenerating, wasGenerating]);

  return (
    <div className="border-t border-border p-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            {uploadedPhoto && (
              <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
                <div className="relative">
                  <img 
                    src={uploadedPhoto} 
                    alt="Reference" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-border"
                  />
                  <button
                    onClick={handleRemovePhoto}
                    className="absolute -top-1 -right-1 bg-background border border-border rounded-full p-1 hover:bg-accent transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
            
            <Input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onGenerate()}
              className={`w-full ${uploadedPhoto ? 'pl-16' : ''}`}
              placeholder={uploadedPhoto ? "Start typing a prompt" : "Describe the image you want to create..."}
              disabled={isGenerating}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Plus className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleUploadClick}>
                <Image className="w-4 h-4 mr-2" />
                Upload Photo (Reference)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <Button variant="ghost" size="icon">
            <HelpCircle className="w-5 h-5" />
          </Button>
          <Button
            onClick={onGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </div>
    </div>
  );
}