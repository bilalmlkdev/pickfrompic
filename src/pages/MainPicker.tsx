import { useState } from "react";
import { useExtractColors } from "react-extract-colors";
import ImageUploader from "../components/organisms/ImageUploader";
import ColorDetailsPanel from "../components/organisms/ColorDetailsPanel";
import ColorPalette from "../components/organisms/ColorPalette";
import ToolCard from "../components/templates/ToolCard";


const MainPicker = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&q=80",
  );
  const [selectedColor, setSelectedColor] = useState<string>("#2596be");
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [maxColors, setMaxColors] = useState<number>(10);
  const [topPicks, setTopPicks] = useState<string[]>([]);
  const [highlightColor, setHighlightColor] = useState<string | null>(null);

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
    setTopPicks([color]);
  };

  const handleImagePick = (color: string) => {
    setSelectedColor(color);
    setHoveredColor(null);
    setTopPicks((prev) => [color, prev[0] || color]);
  };

  const handlePaletteColorClick = (color: string) => {
    setSelectedColor(color);
    setHighlightColor((prev) => (prev === color ? null : color));
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="text-center mt-8 mb-4 md:mb-6 px-4">
        <h1 className="text-[28px] md:text-[42px] font-medium text-foreground tracking-tight leading-tight">
          Free Color Picker:
          <br />
          Extract colors from any image instantly.
        </h1>
        <p className="mt-2 text-muted-foreground text-lg">
          Upload, paste, or enter a URL to get HEX, RGB, HSL and more, no signup
          needed.
        </p>
      </div>

      <div className="relative">
        <ToolCard>
          <div className="grid grid-cols-1 lg:grid-cols-[67%_30%] gap-10 pr-6">
            <div className="flex flex-col gap-5">
              <ImageUploader
                imageSrc={imageSrc}
                loading={loading}
                selectedColor={selectedColor}
                setHoveredColor={setHoveredColor}
                onImagePick={handleImagePick}
                highlightColor={highlightColor}
              />
              <ColorPalette
                colors={paletteColors}
                setSelectedColor={handlePaletteColorClick}
                maxColors={maxColors}
                setMaxColors={setMaxColors}
              />
            </div>

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
