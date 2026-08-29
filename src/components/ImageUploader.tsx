import React, { useRef } from "react";

interface Props {
  imageSrc: string | null;
  loading: boolean;
  setSelectedColor: (hex: string) => void; // Pass this down to update the picker!
}

const ImageUploader: React.FC<Props> = ({
  imageSrc,
  loading,
  setSelectedColor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageSrc || !imgRef.current || !canvasRef.current) return;

    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (!ctx) return;

    // Get click coordinates relative to the image container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Match canvas size to image size
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    // Scale click coordinates to image's natural size (handles object-cover)
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    const pixelX = Math.floor(x * scaleX);
    const pixelY = Math.floor(y * scaleY);

    try {
      const pixelData = ctx.getImageData(pixelX, pixelY, 1, 1).data;
      const hex =
        "#" +
        ((1 << 24) + (pixelData[0] << 16) + (pixelData[1] << 8) + pixelData[2])
          .toString(16)
          .slice(1);
      setSelectedColor(hex); // Update the main color!
    } catch (error) {
      // This throws if the image is from another domain without CORS headers.
      console.error(
        "Could not read pixel data due to CORS restrictions",
        error,
      );
    }
  };

  return (
    <div>
      <h2 className="font-semibold text-gray-800 mb-3">Image</h2>
      <div
        className="relative w-full h-80 bg-gray-100 border rounded-2xl overflow-hidden mb-4 cursor-crosshair"
        onClick={handleImageClick}
      >
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Extracting colors...
          </div>
        ) : imageSrc ? (
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Preview"
            crossOrigin="anonymous" // Important for Canvas CORS on Unsplash
            className="w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Hidden canvas for pixel reading */}
      <canvas ref={canvasRef} className="hidden" />

      <p className="text-xs text-gray-400 text-center mt-2">
        Tip: Click anywhere on the image to pick that exact color!
      </p>
    </div>
  );
};

export default ImageUploader;
