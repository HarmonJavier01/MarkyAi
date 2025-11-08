interface User {
  name?: string;
  email?: string;
  displayName?: string;
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

interface HomeViewProps {
  user: User;
  generatedImages: GeneratedImage[];
}

export function HomeView({ user, generatedImages }: HomeViewProps) {
  return (
    <div className="text-center space-y-8">
      <div className="inline-block w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg">
        M
      </div>
      
      <div className="space-y-3">
        <h1 className="text-5xl font-bold">Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'there'}! </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Ready to create stunning marketing content? Start by describing what you need below.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
        <div className="p-6 bg-gradient-to-br from-surface-purple to-purple-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-3xl mb-3 emoji-bounce">📱</div>
          <h3 className="font-semibold mb-2">Social Media</h3>
          <p className="text-sm text-muted-foreground">Instagram, Facebook, and more</p>
        </div>

        <div className="p-6 bg-gradient-to-br from-surface-pink to-pink-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-3xl mb-3 emoji-bounce">📢</div>
          <h3 className="font-semibold mb-2">Advertising</h3>
          <p className="text-sm text-muted-foreground">Banners and ad creatives</p>
        </div>

        <div className="p-6 bg-gradient-to-br from-surface-blue to-blue-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-3xl mb-3 emoji-bounce">📦</div>
          <h3 className="font-semibold mb-2">Product Photos</h3>
          <p className="text-sm text-muted-foreground">Showcase your products</p>
        </div>
      </div>

      {generatedImages.length > 0 && (
        <div className="mt-12 p-8 bg-surface-purple rounded-2xl">
          <h3 className="text-xl font-semibold mb-4">Recent Generations</h3>
          <div className="grid grid-cols-2 gap-4">
            {generatedImages.slice(0, 4).map((img) => (
              <div key={img.id} className="bg-background rounded-xl p-4 shadow-sm">
                <div className="w-full h-48 rounded-lg overflow-hidden mb-3">
                  {img.imageUrl ? (
                    <img 
                      src={img.imageUrl} 
                      alt={img.prompt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-muted-foreground">Generated Image</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{img.prompt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}