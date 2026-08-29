import React, { useRef, useState, useEffect } from "react";

interface Props {
  imageSrc: string | null;
  loading: boolean;
  selectedColor: string;
  setImageSrc: (src: string) => void;
  setSelectedColor: (hex: string) => void;
}

const ImageUploader: React.FC<Props> = ({
  imageSrc,
  loading,
  selectedColor,
  setImageSrc,
  setSelectedColor,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

  // Lens state
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [lensGrid, setLensGrid] = useState<string[]>([]);
  const [isLensEnabled, setIsLensEnabled] = useState<boolean>(true);

  // Draw the image to hidden canvas when it loads
  useEffect(() => {
    if (imageSrc && imgRef.current && hiddenCanvasRef.current) {
      const img = imgRef.current;
      const canvas = hiddenCanvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
      }
    }
  }, [imageSrc]);

  // Get color at specific canvas coordinates
  const getColorAtPixel = (x: number, y: number): string => {
    if (!hiddenCanvasRef.current) return "#000000";
    const ctx = hiddenCanvasRef.current.getContext("2d", {
      willReadFrequently: true,
    });
    if (!ctx) return "#000000";
    try {
      const pixelData = ctx.getImageData(x, y, 1, 1).data;
      return (
        "#" +
        ((1 << 24) + (pixelData[0] << 16) + (pixelData[1] << 8) + pixelData[2])
          .toString(16)
          .slice(1)
      );
    } catch (error) {
      // CORS error handling
      return selectedColor;
    }
  };

  // Handle mouse move to update lens
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      !imageSrc ||
      !imgRef.current ||
      !hiddenCanvasRef.current ||
      !isLensEnabled
    )
      return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Scale coordinates to natural image size
    const scaleX = imgRef.current.naturalWidth / rect.width;
    const scaleY = imgRef.current.naturalHeight / rect.height;
    const pixelX = Math.floor(x * scaleX);
    const pixelY = Math.floor(y * scaleY);

    // Get 5x5 pixel grid
    const grid: string[] = [];
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        grid.push(getColorAtPixel(pixelX + dx, pixelY + dy));
      }
    }
    setLensGrid(grid);
    setMousePos({ x, y });
  };

  // Handle click to pick exact center pixel
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageSrc || !imgRef.current || !hiddenCanvasRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = imgRef.current.naturalWidth / rect.width;
    const scaleY = imgRef.current.naturalHeight / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    setSelectedColor(getColorAtPixel(x, y));
  };

  return (
    <div>
      <h2 className="font-semibold text-gray-800 mb-3">Image</h2>
      <div
        className="relative w-full h-80 border rounded-2xl overflow-hidden mb-4 transition-colors duration-300"
        style={{ backgroundColor: selectedColor }}
        onClick={handleImageClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePos(null)}
      >
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-100">
            Extracting colors...
          </div>
        ) : imageSrc ? (
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Preview"
            crossOrigin="anonymous"
            className="w-full h-full object-cover pointer-events-none cursor-crosshair"
          />
        ) : // Removed "No image" text so the solid color fills the space
        null}

        {/* THE MAGNIFIER LENS */}
        {isLensEnabled && mousePos && imageSrc && (
          <div
            className="absolute pointer-events-none z-50 w-28 h-28 rounded-full border-2 border-white shadow-2xl overflow-hidden flex flex-col items-center justify-center"
            style={{ left: mousePos.x - 56, top: mousePos.y - 56 }}
          >
            {/* 5x5 Pixel Grid */}
            <div className="grid grid-cols-5 w-full h-full">
              {lensGrid.map((color, idx) => (
                <div key={idx} style={{ backgroundColor: color }} />
              ))}
            </div>

            {/* Center Crosshair (+) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="absolute w-6 h-0.5 bg-white mix-blend-difference"></div>
                <div className="absolute h-6 w-0.5 bg-white mix-blend-difference"></div>
              </div>
            </div>
          </div>
        )}

        {/* PLUS ICON TOGGLE (Bottom Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent picking color when toggling
            setIsLensEnabled(!isLensEnabled);
          }}
          className={`absolute bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center border shadow-md transition z-40 ${
            isLensEnabled
              ? "bg-black text-white border-black"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
          }`}
          title="Toggle Magnifier Lens"
        >
          {/* Plus Icon */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </button>
      </div>

      <canvas ref={hiddenCanvasRef} className="hidden" />
      <p className="text-xs text-gray-400 text-center mt-2">
        Tip: Hover to magnify, click to pick, and use the "+" button to toggle
        the lens!
      </p>
    </div>
  );
};

export default ImageUploader;
