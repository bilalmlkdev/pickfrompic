import { useState } from "react";
import { useExtractColors } from "react-extract-colors";
import { Maximize2 } from "lucide-react";
import ImageUploader from "../components/organisms/ImageUploader";
import ColorDetailsPanel from "../components/organisms/ColorDetailsPanel";
import ColorPalette from "../components/organisms/ColorPalette";
import ToolCard from "../components/templates/ToolCard";


const MainPicker = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop",
  );
  const [selectedColor, setSelectedColor] = useState<string>("#2596be");
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [maxColors, setMaxColors] = useState<number>(10);
  const [topPicks, setTopPicks] = useState<string[]>([]);

  const { colors, loading } = useExtractColors(imageSrc ?? "", {
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
    <div className="flex-1 flex flex-col">
      <div className="text-center mt-20 mb-8 px-4">
        <h1 className="text-[28px] md:text-[50px] font-medium text-foreground tracking-tight leading-tight">
          Free Color Picker:
          <br />
          Extract colors from any image instantly.
        </h1>
        <p className="mt-3 text-muted-foreground text-xl">
          Upload, paste, or enter a URL to get HEX, RGB, HSL and more, no signup
          needed.
        </p>
      </div>

      <div className="relative">
        <ToolCard>
          <button
            className="absolute -top-3.5 -right-3.5 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
            title="Expand"
          >
            <Maximize2 size={20} />
          </button>

          {/* Left side: ImageUploader + ColorPalette */}
          <div className="grid grid-cols-1 lg:grid-cols-[67%_30%] gap-10 pr-6">
            {/* Left Column - 75% */}
            <div className="flex flex-col gap-5">
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

            {/* Right Column - 25% */}
            <div>
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
        </ToolCard>
      </div>
    </div>
  );
};

export default MainPicker;
