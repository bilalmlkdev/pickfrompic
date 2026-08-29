import { useState } from "react";
import { useExtractColors } from "react-extract-colors";
import ImageUploader from "./components/ImageUploader";
import ColorDetailsPanel from "./components/ColorDetailsPanel";
import ColorPalette from "./components/ColorPalette";

function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#2596be");

  // Logic: Extract colors from the image reactively
  const { colors, loading } = useExtractColors(imageSrc || undefined, {
    maxColors: 10, // Limit to 10 colors like in the screenshot
    format: "hex", // We can easily convert to rgb/hsl later
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-cyan-200 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-5xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">
          Free Color Picker: Extract colors from any image instantly.
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side: Upload & Preview */}
          <ImageUploader
            imageSrc={imageSrc}
            setImageSrc={setImageSrc}
            loading={loading}
          />

          {/* Right side: Colors, Details & Picker */}
          <div className="flex flex-col gap-6">
            <ColorPalette
              colors={colors}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
            <ColorDetailsPanel
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
          </div>
        </div>

        {/* User Actions Area */}
        <div className="mt-8 p-4 bg-gray-50 rounded-2xl flex flex-col items-center text-center gap-4">
          <h2 className="font-semibold text-lg">Use your own image</h2>
          <p className="text-sm text-gray-500">
            We think data protection is important! No data is sent. The magic
            happens in your browser.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
