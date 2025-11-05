import { useState } from "react";
import { X, Download, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface HistoryViewProps {
  generatedImages: GeneratedImage[];
}

export function HistoryView({ generatedImages }: HistoryViewProps) {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);

  const handleDownload = (image: GeneratedImage, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (!image?.imageUrl) return;
    
    const link = document.createElement('a');
    link.href = image.imageUrl;
    link.download = `Generated Image ${new Date(image.timestamp).toLocaleString('en-US', { 
      month: 'long', 
      day: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true 
    }).replace(/,/g, '')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleModalClose = () => {
    setSelectedImage(null);
    setZoomLevel(100);
    setPosition({ x: 0, y: 0 });
  };

  const handleImageDoubleClick = () => {
    if (zoomLevel === 100) {
      setZoomLevel(200);
    } else {
      setZoomLevel(100);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 100) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 100) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const getCursorStyle = () => {
    if (zoomLevel === 100) return 'zoom-in';
    if (isDragging) return 'grabbing';
    return 'grab';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Generation History</h2>
      
      {generatedImages.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No generations yet. Start creating!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {generatedImages.map((img) => (
            <div 
              key={img.id} 
              className="border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              {/* Image with hover controls */}
              <div 
                className="relative w-full h-64 rounded-lg overflow-hidden mb-3 group cursor-pointer"
                onMouseEnter={() => setHoveredImageId(img.id)}
                onMouseLeave={() => setHoveredImageId(null)}
                onClick={() => setSelectedImage(img)}
              >
                {img.imageUrl ? (
                  <>
                    <img 
                      src={img.imageUrl} 
                      alt={img.prompt}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    
                    {/* Hover Controls */}
                    <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 transition-opacity duration-200 ${hoveredImageId === img.id ? 'opacity-100' : 'opacity-0'}`}>
                      <Button
                        onClick={(e) => handleDownload(img, e)}
                        size="icon"
                        className="rounded-full w-9 h-9 bg-gray-900/80 hover:bg-gray-900 text-white border-0"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(img);
                        }}
                        size="icon"
                        className="rounded-full w-9 h-9 bg-gray-900/80 hover:bg-gray-900 text-white border-0"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Sparkle watermark */}
                    {/* <div className="absolute bottom-3 right-3 pointer-events-none">
                      <svg className="w-6 h-6 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0l2.5 7.5L22 10l-7.5 2.5L12 20l-2.5-7.5L2 10l7.5-2.5L12 0z"/>
                      </svg>
                    </div> */}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
                    <span className="text-muted-foreground">Generated Image</span>
                  </div>
                )}
              </div>

              {/* View full image link */}
              {/* <button 
                onClick={() => setSelectedImage(img)}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline mb-2 cursor-pointer"
              >
                View full image
              </button> */}

              {/* Image details */}
              <div>
                <p className="font-medium mb-2 line-clamp-2">{img.prompt}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{img.settings?.outputType || 'General'}</span>
                  <span>{new Date(img.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Image Modal - EXACT COPY FROM GENERATEVIEW */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/60 flex flex-col p-10">
          {/* Header - Simple with just title and buttons */}
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-white text-base font-normal">
              Generated Image {new Date(selectedImage.timestamp).toLocaleString('en-US', { 
                month: 'long', 
                day: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true 
              }).replace(/,/g, ' -')}.png
            </h2>
            
            {/* Download and Close buttons only */}
            <div className="flex gap-1">
              <Button
                onClick={() => handleDownload(selectedImage)}
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/10 rounded-lg"
              >
                <Download className="w-5 h-5" />
              </Button>
              <Button
                onClick={handleModalClose}
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Image Container - Centered with Padding */}
          <div 
            className="flex-1 flex items-center justify-center p-12 overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative flex items-center justify-center">
              <img 
                src={selectedImage.imageUrl} 
                alt={selectedImage.prompt}
                onDoubleClick={handleImageDoubleClick}
                onMouseDown={handleMouseDown}
                style={{ 
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel / 100})`,
                  maxWidth: 'calc(100vw - 180px)',
                  maxHeight: 'calc(100vh - 220px)',
                  cursor: getCursorStyle(),
                  userSelect: 'none'
                }}
                className="transition-transform duration-200 object-contain rounded-lg"
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}