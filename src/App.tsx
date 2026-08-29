import { useState } from "react";
import { useExtractColors } from "react-extract-colors";
import Header from "./components/Header";
import ImageUploader from "./components/ImageUploader";
import ColorDetailsPanel from "./components/ColorDetailsPanel";
import ColorPalette from "./components/ColorPalette";

function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop",
  );
  const [selectedColor, setSelectedColor] = useState<string>("#2596be");
  const [maxColors, setMaxColors] = useState<number>(10);
  const [customColors, setCustomColors] = useState<string[]>([]);

  const { colors, loading } = useExtractColors(imageSrc || undefined, {
    maxColors: maxColors,
    format: "hex",
  });

  const handlePickedColor = (color: string) => {
    setSelectedColor(color);
    setCustomColors((prev) => [color, ...prev.slice(0, 9)]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-cyan-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex flex-col transition-colors">
      <Header />
      <div className="text-center mt-10 mb-8 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          Free Color Picker: Extract colors from any image instantly.
        </h1>
        <p className="mt-4 text-muted-foreground text-lg">
          Upload, paste, or enter a URL to get HEX, RGB, HSL and more, no signup
          needed.
        </p>
      </div>
      <div className="flex-1 flex justify-center pb-12 px-4">
        <div className="bg-background dark:bg-neutral-900 border border-border/50 dark:border-neutral-800 rounded-3xl shadow-2xl p-6 md:p-8 max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="flex flex-col gap-6">
              <ImageUploader
                imageSrc={imageSrc}
                setImageSrc={setImageSrc}
                loading={loading}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
              />
              <ColorPalette
                colors={colors}
                customColors={customColors}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                maxColors={maxColors}
                setMaxColors={setMaxColors}
              />
            </div>
            <ColorDetailsPanel
              colors={colors}
              customColors={customColors}
              selectedColor={selectedColor}
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
