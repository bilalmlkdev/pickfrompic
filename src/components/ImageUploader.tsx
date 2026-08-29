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
    if (file) {
      setImageSrc(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold">Image</h2>

      {/* URL Input */}
      <input
        type="text"
        placeholder="Paste an image URL here..."
        className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
        onChange={(e) => setImageSrc(e.target.value)}
      />

      {/* Upload Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-black text-white rounded-lg py-3 font-medium hover:bg-gray-800 transition"
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

      {/* Image Preview */}
      <div className="mt-4 border rounded-xl overflow-hidden h-80 flex items-center justify-center bg-gray-100">
        {loading ? (
          <p className="text-gray-500">Extracting colors...</p>
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt="Uploaded Preview"
            className="w-full h-full object-contain"
          />
        ) : (
          <p className="text-gray-400">No image selected</p>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
