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
    <div className="border-t border-border p-6 bg-background/95 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        {/* Photo Preview Section - Only shown when image is uploaded */}
        {uploadedPhoto && (
          <div className="mb-4 flex items-center justify-between bg-accent/20 rounded-lg p-3 border border-border/50">
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <img 
                  src={uploadedPhoto} 
                  alt="Reference" 
                  className="w-16 h-16 rounded-xl object-cover border-2 border-primary/20 shadow-lg transition-all duration-200 group-hover:shadow-xl"
                />
                <div className="absolute inset-0 rounded-xl bg-primary/5"></div>
              </div>
              <div className="text-sm">
                <p className="font-medium text-foreground">Reference Image</p>
                <p className="text-muted-foreground">Ready to blend with your prompt</p>
              </div>
            </div>
            <Button
              onClick={handleRemovePhoto}
              variant="ghost" 
              size="sm"
              className="hover:bg-destructive/10 hover:text-destructive rounded-full h-8 w-8 p-0 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Input Section */}
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onGenerate()}
              className="w-full h-12 pl-4 pr-4 text-base border-border/50 focus:border-primary/50 bg-background/50 backdrop-blur-sm rounded-xl shadow-sm transition-all duration-200"
              placeholder={uploadedPhoto ? "Describe how to transform your image..." : "Describe the image you want to create..."}
              disabled={isGenerating}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="shrink-0 h-12 w-12 rounded-xl border-border/50 hover:border-primary/50 hover:bg-accent/20 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleUploadClick} className="cursor-pointer">
                <Image className="w-4 h-4 mr-2" />
                Upload Reference Image
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

          <Button
            onClick={onGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 h-12 px-8 rounded-xl font-medium shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Generating...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span></span>
                <span>Generate</span>
              </div>
            )}
          </Button>
        </div>

        {/* Nano Banana Indicator - Only shown when image is uploaded */}
        {uploadedPhoto && (
          <div className="mt-3 flex items-center justify-center">
            <div className="text-xs text-muted-foreground bg-accent/10 px-3 py-1 rounded-full border border-border/30">
              {/* 🍌 Nano Banana will blend your image with your prompt */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}