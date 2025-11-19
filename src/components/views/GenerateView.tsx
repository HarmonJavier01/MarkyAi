import { useState, useRef } from "react";
import { Loader2, ThumbsUp, ThumbsDown, Download, Maximize2, X, Trash2 } from "lucide-react";
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

interface GenerateViewProps {
  isGenerating: boolean;
  generatedImages: GeneratedImage[];
  onDeleteImage?: (imageId: number) => void;
}

export function GenerateView({ isGenerating, generatedImages, onDeleteImage }: GenerateViewProps) {
  const latestImage = generatedImages[0];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isImageHovered, setIsImageHovered] = useState(false);
  
  // Drag state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleDownload = () => {
    if (!latestImage?.imageUrl) return;
    
    const link = document.createElement('a');
    link.href = latestImage.imageUrl;
    link.download = `Generated Image ${new Date().toLocaleString('en-US', { 
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
    setIsModalOpen(false);
    setZoomLevel(100);
    setPosition({ x: 0, y: 0 });
  };

  const handleImageDoubleClick = () => {
    if (zoomLevel === 100) {
      setZoomLevel(200); // Zoom in to 200%
    } else {
      setZoomLevel(100); // Zoom out to 100%
      setPosition({ x: 0, y: 0 }); // Reset position when zooming out
    }
  };

  // Drag handlers
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

  // Get cursor style based on zoom and drag state
  const getCursorStyle = () => {
    if (zoomLevel === 100) return 'zoom-in';
    if (isDragging) return 'grabbing';
    return 'grab';
  };

  return (
    <div className="space-y-6">
      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-16 h-16 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Creating your image...</p>
        </div>
      )}

      {!isGenerating && latestImage && (
        <div className="space-y-8">
          {/* User Prompt */}
          <div>
            <div className="text-sm text-muted-foreground mb-3">User</div>
            <div className="text-foreground">
              {latestImage.prompt}
            </div>
          </div>

          {/* Model Response */}
          <div>
            <div className="text-sm text-muted-foreground mb-3">Model</div>
            <div className="space-y-4">
              <p className="text-foreground">Here you go!</p>
              
              {/* Generated Image with Hover Controls */}
              <div className="inline-block">
                <div 
                  className="relative rounded-xl overflow-hidden group cursor-pointer"
                  onMouseEnter={() => setIsImageHovered(true)}
                  onMouseLeave={() => setIsImageHovered(false)}
                  onClick={() => setIsModalOpen(true)}
                >
                  {latestImage.imageUrl ? (
                    <>
                      <img 
                        src={latestImage.imageUrl} 
                        alt={latestImage.prompt}
                        className="w-full max-w-md rounded-xl"
                      />
                      
                      {/* Hover Controls */}
                      <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 transition-opacity duration-200 ${isImageHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload();
                          }}
                          size="icon"
                          className="rounded-full w-9 h-9 bg-gray-900/80 hover:bg-gray-900 text-white border-0"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsModalOpen(true);
                          }}
                          size="icon"
                          className="rounded-full w-9 h-9 bg-gray-900/80 hover:bg-gray-900 text-white border-0"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full aspect-square max-w-sm flex items-center justify-center p-8 bg-gray-100 rounded-xl">
                      <span className="text-muted-foreground text-center">Your generated image will appear here</span>
                    </div>
                  )}
                </div>
                
                {/* Feedback Buttons */}
                <div className="flex gap-3 mt-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-gray-100"
                  >
                    <ThumbsUp className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-gray-100"
                  >
                    <ThumbsDown className="w-5 h-5" />
                  </Button>
                  {onDeleteImage && (
                    <Button
                      onClick={() => onDeleteImage(latestImage.id)}
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isGenerating && !latestImage && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Enter a prompt below to generate your first image</p>
        </div>
      )}

      {/* Full Image Modal - With Padding on All Sides */}
      {isModalOpen && latestImage?.imageUrl && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/60 flex flex-col p-10">
          {/* Header - Simple with just title and buttons */}
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-white text-base font-normal">
              Generated Image {new Date().toLocaleString('en-US', { 
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
                onClick={handleDownload}
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
                ref={imageRef}
                src={latestImage.imageUrl} 
                alt={latestImage.prompt}
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