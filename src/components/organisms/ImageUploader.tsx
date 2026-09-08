import React, { useRef, useState } from "react";
import { Minus } from "lucide-react";
import SectionLabel from "../atoms/SectionLabel";

interface Props {
  imageSrc: string | null;
  loading: boolean;
  selectedColor: string;
  setHoveredColor: (color: string | null) => void;
  onImagePick: (color: string) => void;
}

const ImageUploader: React.FC<Props> = ({
  imageSrc,
  loading,
  selectedColor,
  setHoveredColor,
  onImagePick,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [lensGrid, setLensGrid] = useState<string[]>([]);
  const [isLensEnabled, setIsLensEnabled] = useState<boolean>(true);

  const handleImageLoad = () => {
    const img = imgRef.current;
    const canvas = hiddenCanvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });

    if (img && canvas && ctx) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
    }
  };

  const getColorAtPixel = (x: number, y: number): string => {
    if (!hiddenCanvasRef.current) return "#000000";
    const ctx = hiddenCanvasRef.current.getContext("2d", { willReadFrequently: true });
    if (!ctx) return "#000000";
    try {
      const pixelData = ctx.getImageData(x, y, 1, 1).data;
      return (
        "#" +
        ((1 << 24) + (pixelData[0] << 16) + (pixelData[1] << 8) + pixelData[2])
          .toString(16)
          .slice(1)
      );
    } catch {
      return "#000000";
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageSrc || !imgRef.current || !hiddenCanvasRef.current || !isLensEnabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scaleX = imgRef.current.naturalWidth / rect.width;
    const scaleY = imgRef.current.naturalHeight / rect.height;
    const pixelX = Math.floor(x * scaleX);
    const pixelY = Math.floor(y * scaleY);

    const color = getColorAtPixel(pixelX, pixelY);
    setHoveredColor(color);

    const grid: string[] = [];
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        grid.push(getColorAtPixel(pixelX + dx, pixelY + dy));
      }
    }
    setLensGrid(grid);
    setMousePos({ x, y });
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageSrc || !imgRef.current || !hiddenCanvasRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = imgRef.current.naturalWidth / rect.width;
    const scaleY = imgRef.current.naturalHeight / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const color = getColorAtPixel(x, y);
    onImagePick(color);
    setHoveredColor(null);
  };

  return (
    <div>
      <SectionLabel>Image</SectionLabel>
      <div
        className="relative w-full h-[360px] rounded-lg overflow-hidden mb-3 transition-colors duration-300 cursor-crosshair bg-muted"
        style={{ backgroundColor: imageSrc ? undefined : selectedColor }}
        onClick={handleImageClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setMousePos(null);
          setHoveredColor(null);
        }}
      >
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground bg-muted">
            Extracting colors...
          </div>
        ) : imageSrc ? (
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Preview"
            crossOrigin="anonymous"
            onLoad={handleImageLoad}
            className="w-full h-full object-cover pointer-events-none"
          />
        ) : null}

        {isLensEnabled && mousePos && imageSrc && (
          <div
            className="absolute pointer-events-none z-50 w-20 h-20 rounded-lg border-2 border-white shadow-2xl overflow-hidden flex flex-col items-center justify-center"
            style={{ left: mousePos.x - 40, top: mousePos.y + 15 }}
          >
            <div className="grid grid-cols-5 w-full h-full">
              {lensGrid.map((color, idx) => (
                <div key={idx} style={{ backgroundColor: color }} />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="absolute w-6 h-0.5 bg-white mix-blend-difference"></div>
                <div className="absolute h-6 w-0.5 bg-white mix-blend-difference"></div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLensEnabled(!isLensEnabled);
          }}
          className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center border shadow-md transition-colors z-40 ${
            isLensEnabled
              ? "bg-foreground text-background border-foreground"
              : "bg-card text-muted-foreground border-border hover:bg-muted"
          }`}
          title="Toggle Magnifier Lens"
        >
          <Minus size={14} strokeWidth={3} />
        </button>
      </div>

      <canvas ref={hiddenCanvasRef} className="hidden" />
    </div>
  );
};

export default ImageUploader;
