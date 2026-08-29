import { useState } from "react";
import { useExtractColors } from "react-extract-colors";
import Header from "./components/Header";
import ImageUploader from "./components/ImageUploader";
import ColorDetailsPanel from "./components/ColorDetailsPanel";
import ColorPalette from "./components/ColorPalette";

function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#2596be");

  const { colors, loading } = useExtractColors(imageSrc || undefined, {
    maxColors: 10,
    format: "hex",
  });

  return (
    // Background: Pink/Cyan gradient for light default, dark mode optional
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-cyan-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex flex-col transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <div className="text-center mt-10 mb-8 px-4">
        {/* Hard-coded to gray-900 for light mode default */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Free Color Picker:
          <br />
          Extract colors from any image instantly.
        </h1>
        {/* Hard-coded to gray-600 for light mode default */}
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
          Upload, paste, or enter a URL to get HEX, RGB, HSL and more, no signup
          needed.
        </p>
      </div>

      {/* Main Card */}
      <div className="flex-1 flex justify-center pb-12 px-4">
        {/* Main card is explicitly bg-white in light mode */}
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-3xl shadow-2xl p-6 md:p-8 max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Side: Image Area & Color Palette */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Image
                </h2>
                <ImageUploader
                  imageSrc={imageSrc}
                  setImageSrc={setImageSrc}
                  loading={loading}
                />
              </div>

              {/* Added ColorPalette below the ImageUploader */}
              <ColorPalette
                colors={colors}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
              />
            </div>

            {/* Right Side: Colors & Details */}
            <ColorDetailsPanel
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
