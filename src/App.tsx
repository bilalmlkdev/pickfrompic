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
    // Added dark mode gradient classes and transition
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-cyan-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex flex-col transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <div className="text-center mt-10 mb-8 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          Free Color Picker:
          <br />
          Extract colors from any image instantly.
        </h1>
        <p className="mt-4 text-muted-foreground text-lg">
          Upload, paste, or enter a URL to get HEX, RGB, HSL and more, no signup
          needed.
        </p>
      </div>

      {/* Main Card */}
      <div className="flex-1 flex justify-center pb-12 px-4">
        {/* Added dark:bg classes and border for dark mode */}
        <div className="bg-background dark:bg-neutral-900 border border-border/50 dark:border-neutral-800 rounded-3xl shadow-2xl p-6 md:p-8 max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Side: Image Area & Color Palette */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <h2 className="font-semibold text-foreground mb-2">Image</h2>
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
