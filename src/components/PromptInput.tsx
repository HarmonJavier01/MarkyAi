import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PromptInputProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function PromptInput({ prompt, setPrompt, onGenerate, isGenerating }: PromptInputProps) {
  return (
    <div className="border-t border-border p-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3">
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onGenerate()}
            className="flex-1"
            placeholder="Describe the image you want to create..."
            disabled={isGenerating}
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
