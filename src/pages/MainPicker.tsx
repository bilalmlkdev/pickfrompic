import { useState } from "react";
import { useExtractColors } from "react-extract-colors";
import { Link } from "react-router-dom";
import ImageUploader from "../components/ImageUploader";
import ColorDetailsPanel from "../components/ColorDetailsPanel";
import ColorPalette from "../components/ColorPalette";

const MainPicker = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop",
  );
  const [selectedColor, setSelectedColor] = useState<string>("#2596be");
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [maxColors, setMaxColors] = useState<number>(10);
  const [topPicks, setTopPicks] = useState<string[]>([]);

  const { colors, loading } = useExtractColors(imageSrc || undefined, {
    maxColors: maxColors,
    format: "hex",
  });

  const safeColors = Array.isArray(colors) ? colors : [];
  const extractedColors = imageSrc ? safeColors : [];
  const paletteColors = imageSrc
    ? safeColors
    : topPicks.length > 0
      ? [topPicks[0]]
      : [];

  const handlePickedColor = (color: string) => {
    setSelectedColor(color);
    setImageSrc(null);
    setHoveredColor(null);
    setTopPicks([color, color]);
  };

  const handleImagePick = (color: string) => {
    setSelectedColor(color);
    setHoveredColor(null);
    setTopPicks((prev) => [color, prev[0] || color]);
  };

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="text-center mt-10 mb-8 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          Free Color Picker: Extract colors from any image instantly.
        </h1>
        <p className="mt-4 text-muted-foreground text-lg">
          Upload, paste, or enter a URL to get HEX, RGB, HSL and more, no signup
          needed.
        </p>
        <Link
          to="/dashboard"
          className="mt-4 inline-block text-blue-600 underline hover:text-blue-800 transition"
        >
          Go to Dashboard
        </Link>
      </div>

      <div className="flex-1 flex justify-center pb-12 px-4 w-full">
        <div className="bg-background dark:bg-neutral-900 border border-border/50 dark:border-neutral-800 rounded-3xl shadow-2xl p-6 md:p-8 max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="flex flex-col gap-6">
              <ImageUploader
                imageSrc={imageSrc}
                loading={loading}
                selectedColor={selectedColor}
                setHoveredColor={setHoveredColor}
                onImagePick={handleImagePick}
              />
              <ColorPalette
                colors={paletteColors}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                maxColors={maxColors}
                setMaxColors={setMaxColors}
              />
            </div>
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
};

export default MainPicker;
