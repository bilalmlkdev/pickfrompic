import React from "react";

interface Props {
  imageSrc: string | null;
  loading: boolean;
}

const ImageUploader: React.FC<Props> = ({ imageSrc, loading }) => {
  return (
    <div>
      <h2 className="font-semibold text-gray-800 mb-3">Image</h2>
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
    </div>
  );
};

export default ImageUploader;
