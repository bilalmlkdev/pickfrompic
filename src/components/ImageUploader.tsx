import React, { useRef } from "react";

interface Props {
  imageSrc: string | null;
  setImageSrc: (src: string) => void;
  loading: boolean;
}

const ImageUploader: React.FC<Props> = ({ imageSrc, setImageSrc, loading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageSrc(URL.createObjectURL(file));
  };

  return (
    <div>
      <h2 className="font-semibold text-gray-800 mb-3">Image</h2>

      {/* Image Preview Area with exact height */}
      <div className="relative w-full h-80 bg-gray-100 border rounded-2xl overflow-hidden mb-4">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Extracting colors...
          </div>
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Inputs */}
      <input
        type="text"
        placeholder="Paste an image URL here..."
        className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-3 focus:outline-none focus:border-blue-500"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setImageSrc(e.target.value);
          }
        }}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full bg-gray-900 text-white rounded-lg py-3 font-medium hover:bg-gray-800 transition"
      >
        Upload Image
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUploader;
