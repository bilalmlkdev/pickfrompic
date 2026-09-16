import React, { useRef, useState, useEffect } from "react";
import { Minus } from "lucide-react";
import SectionLabel from "../atoms/SectionLabel";

interface Props {
  imageSrc: string | null;
  loading: boolean;
  selectedColor: string;
  setHoveredColor: (color: string | null) => void;
  onImagePick: (color: string) => void;
  highlightColor?: string | null;
}

const ImageUploader: React.FC<Props> = ({
  imageSrc,
  loading,
  selectedColor,
  setHoveredColor,
  onImagePick,
  highlightColor,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [lensGrid, setLensGrid] = useState<string[]>([]);
  const [isLensEnabled, setIsLensEnabled] = useState<boolean>(true);
  const [containerWidth, setContainerWidth] = useState<number>(400);
  const [dotPositions, setDotPositions] = useState<{ x: number; y: number }[]>([]);

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

  useEffect(() => {
    if (!highlightColor || !hiddenCanvasRef.current) {
      setDotPositions([]);
      return;
    }

    const canvas = hiddenCanvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const hex = highlightColor.replace("#", "");
    const tr = parseInt(hex.substring(0, 2), 16);
    const tg = parseInt(hex.substring(2, 4), 16);
    const tb = parseInt(hex.substring(4, 6), 16);
    const tolerance = 40;
    const maxDots = 120;

    const w = canvas.width;
    const h = canvas.height;
    const step = Math.max(1, Math.floor(Math.sqrt((w * h) / (maxDots * 4))));

    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    const found: { x: number; y: number }[] = [];

    for (let y = 0; y < h && found.length < maxDots; y += step) {
      for (let x = 0; x < w && found.length < maxDots; x += step) {
        const idx = (y * w + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        if (
          Math.abs(r - tr) <= tolerance &&
          Math.abs(g - tg) <= tolerance &&
          Math.abs(b - tb) <= tolerance
        ) {
          found.push({ x: (x + 0.5) / w, y: (y + 0.5) / h });
        }
      }
    }

    setDotPositions(found);
  }, [highlightColor]);

  const getColorAtPixel = (x: number, y: number): string => {
    if (!hiddenCanvasRef.current) return "#000000";
    const ctx = hiddenCanvasRef.current.getContext("2d", { willReadFrequently: true });
    if (!ctx) return "#000000";
    const w = hiddenCanvasRef.current.width;
    const h = hiddenCanvasRef.current.height;
    const cx = Math.max(0, Math.min(w - 1, x));
    const cy = Math.max(0, Math.min(h - 1, y));
    try {
      const pixelData = ctx.getImageData(cx, cy, 1, 1).data;
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

    setContainerWidth(rect.width);

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
        role="img"
        aria-label="Image for color picking. Click to pick a color."
      >
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground bg-muted">
            Extracting colors...
          </div>
        ) : imageSrc ? (
          <>
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Uploaded image for color extraction"
              crossOrigin="anonymous"
              onLoad={handleImageLoad}
              className="w-full h-full object-cover pointer-events-none"
            />
            {highlightColor && dotPositions.length > 0 && (
              <div className="absolute inset-0 pointer-events-none">
                {dotPositions.map((pos, idx) => (
                  <div
                    key={idx}
                    className="absolute w-2.5 h-2.5 rounded-full border-2 border-white shadow-md"
                    style={{
                      left: `${pos.x * 100}%`,
                      top: `${pos.y * 100}%`,
                      transform: "translate(-50%, -50%)",
                      backgroundColor: highlightColor,
                      boxShadow: `0 0 6px 2px ${highlightColor}60`,
                    }}
                  />
                ))}
              </div>
            )}
          </>
        ) : null}

        {isLensEnabled && mousePos && imageSrc && (
          <div
            className="absolute pointer-events-none z-50 w-20 h-20 rounded-lg border-2 border-white shadow-2xl overflow-hidden flex flex-col items-center justify-center"
            style={{
              left: Math.max(0, Math.min(mousePos.x - 40, containerWidth - 80)),
              top: Math.max(0, mousePos.y + 15),
            }}
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
          aria-label="Toggle Magnifier Lens"
        >
          <Minus size={14} strokeWidth={3} />
        </button>
      </div>

      <canvas ref={hiddenCanvasRef} className="hidden" />
    </div>
  );
};

export default ImageUploader;
