import { useState } from "react";
import { useExtractColors } from "react-extract-colors";
import Header from "./components/Header";
import ImageUploader from "./components/ImageUploader";
import ColorDetailsPanel from "./components/ColorDetailsPanel";
import ColorPalette from "./components/ColorPalette";

function App() {
  // Initial Desert Image always shown
  const [imageSrc, setImageSrc] = useState<string | null>(
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop",
  );
  const [selectedColor, setSelectedColor] = useState<string>("#2596be");
  const [maxColors, setMaxColors] = useState<number>(10); // Controls +/- buttons

  const { colors, loading } = useExtractColors(imageSrc || undefined, {
    maxColors: maxColors,
    format: "hex",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-cyan-200 flex flex-col">
      <Header />

      <div className="text-center mt-10 mb-8 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          Free Color Picker:
          <br />
          Extract colors from any image instantly.
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Upload, paste, or enter a URL to get HEX, RGB, HSL and more, no signup
          needed.
        </p>
      </div>

      <div className="flex-1 flex justify-center pb-12 px-4">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Side: Image & Palette */}
            <div className="flex flex-col gap-6">
              <ImageUploader
                imageSrc={imageSrc}
                setImageSrc={setImageSrc}
                loading={loading}
                setSelectedColor={setSelectedColor} // Add this!
              />
              <ColorPalette
                colors={colors}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                maxColors={maxColors}
                setMaxColors={setMaxColors}
              />
            </div>

            {/* Right Side: Most Used & Values */}
            <ColorDetailsPanel
              colors={colors}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              setImageSrc={setImageSrc} // Add this line
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
