import { useState } from "react";
import { useExtractColors } from "react-extract-colors";
import Header from "./components/Header";
import ImageUploader from "./components/ImageUploader";
import ColorDetailsPanel from "./components/ColorDetailsPanel";
import ColorPalette from "./components/ColorPalette";

function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop"
  );
  const [selectedColor, setSelectedColor] = useState<string>("#2596be");
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [maxColors, setMaxColors] = useState<number>(10);

  // FIX: Dedicated state for TOP RIGHT BOXES ONLY (Not passed to bottom palette)
  const [topPicks, setTopPicks] = useState<string[]>([]);

  const { colors, loading } = useExtractColors(imageSrc || undefined, {
    maxColors: maxColors,
    format: "hex",
  });

  const extractedColors = imageSrc ? colors : [];

  // Handle picking from eyeDropper (clears image)
  const handlePickedColor = (color: string) => {
    setSelectedColor(color);
    setImageSrc(null);
    setHoveredColor(null);
    setTopPicks((prev) => [color, ...prev.slice(0, 1)]); // Only keeps top 2
  };

  // Handle clicking on image to commit color (Does NOT clear image)
  const handleImagePick = (color: string) => {
    setSelectedColor(color);
    setHoveredColor(null);
    setTopPicks((prev) => [color, ...prev.slice(0, 1)]); // Only keeps top 2
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-cyan-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex flex-col transition-colors">
      <Header />
      <div className="text-center mt-10 mb-8 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Free Color Picker: Extract colors from any image instantly.</h1>
        <p className="mt-4 text-muted-foreground text-lg">Upload, paste, or enter a URL to get HEX, RGB, HSL and more, no signup needed.</p>
      </div>
      <div className="flex-1 flex justify-center pb-12 px-4">
        <div className="bg-background dark:bg-neutral-900 border border-border/50 dark:border-neutral-800 rounded-3xl shadow-2xl p-6 md:p-8 max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Left Side: Image & Bottom Palette (No custom colors passed!) */}
            <div className="flex flex-col gap-6">
              <ImageUploader
                imageSrc={imageSrc}
                setImageSrc={setImageSrc}
                loading={loading}
                selectedColor={selectedColor}
                setHoveredColor={setHoveredColor}
                onImagePick={handleImagePick}
              />

              <ColorPalette
                colors={extractedColors}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                maxColors={maxColors}
                setMaxColors={setMaxColors}
              />
            </div>

            {/* Right Side: Top Boxes Only (Uses topPicks) */}
            <ColorDetailsPanel
              colors={extractedColors}
              topPicks={topPicks}
              selectedColor={selectedColor}
              hoveredColor={hoveredColor}
              setSelectedColor={setSelectedColor}
              setImageSrc={setImageSrc}
              onPickedColor={handlePickedColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
