import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface RightPanelProps {
  settings: {
    temperature: number;
    outputType: string;
    aspectRatio: string;
  };
  setSettings: (settings: unknown) => void;
}
export function RightPanel({ settings, setSettings }: RightPanelProps) {
  const handleOutputTypeChange = (value: string) => {
    let newAspectRatio = settings.aspectRatio;
    
    switch (value) {
      case "General":
        newAspectRatio = "Auto";
        break;
      case "Image Ads":
        newAspectRatio = "1:1";
        break;
      case "Banner Image":
        newAspectRatio = "16:9";
        break;
      case "Product Image":
        newAspectRatio = "1:1";
        break;
      case "Social Media Square":
        newAspectRatio = "1:1";
        break;
      case "Social Media Story":
        newAspectRatio = "9:16";
        break;
    }
    
    setSettings({ ...settings, outputType: value, aspectRatio: newAspectRatio });
  };

  return (
    <div className="w-80 border-l border-border overflow-y-auto bg-background">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="font-semibold text-lg mb-2">Generation Settings</h2>
          <p className="text-sm text-muted-foreground">
            Customize your image generation parameters
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Temperature</Label>
              <span className="text-sm text-muted-foreground">{settings.temperature}</span>
            </div>
            <Slider
              value={[settings.temperature]}
              onValueChange={([value]) => setSettings({ ...settings, temperature: value })}
              max={2}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Higher values create more creative results
            </p>
          </div>
          <div>
            <Label className="mb-2 block">Output Type</Label>
            <Select
              value={settings.outputType}
              onValueChange={handleOutputTypeChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Image Ads">Image Ads (1:1)</SelectItem>
                <SelectItem value="Banner Image">Banner Image (16:9)</SelectItem>
                <SelectItem value="Product Image">Product Image (1:1)</SelectItem>
                <SelectItem value="Social Media Square">Social Media Square (1:1)</SelectItem>
                <SelectItem value="Social Media Story">Social Media Story (9:16)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block">Aspect Ratio</Label>
            <Select
              value={settings.aspectRatio}
              onValueChange={(value) => setSettings({ ...settings, aspectRatio: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Auto">Auto</SelectItem>
                <SelectItem value="1:1">1:1 Square</SelectItem>
                <SelectItem value="16:9">16:9 Landscape</SelectItem>
                <SelectItem value="9:16">9:16 Portrait</SelectItem>
                <SelectItem value="4:3">4:3</SelectItem>
                <SelectItem value="3:4">3:4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="pt-6 border-t border-border">
          <h3 className="font-medium mb-2">Quick Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Be specific about colors, style, and mood</li>
            <li>• Mention your brand or industry for better results</li>
            <li>• Use descriptive adjectives</li>
            <li>• Reference the image type you need</li>
          </ul>
        </div>
      </div>
    </div>
  );
}