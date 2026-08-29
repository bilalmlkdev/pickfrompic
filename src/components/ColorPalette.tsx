import React from "react";

interface Props {
  colors: string[];
  customColors: string[];
  selectedColor: string;
  setSelectedColor: (hex: string) => void;
  maxColors: number;
  setMaxColors: (num: number) => void;
}

const ColorPalette: React.FC<Props> = ({
  colors,
  customColors,
  selectedColor,
  setSelectedColor,
  maxColors,
  setMaxColors,
}) => {
  // Merge custom and extracted colors
  const allColors = [...customColors, ...colors].slice(0, maxColors);

  return (
    <div>
      <h2 className="font-semibold text-gray-800 mb-3">Color Palette</h2>
      <div className="flex items-center gap-3">
        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMaxColors(Math.max(2, maxColors - 1))}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            −
          </button>
          <button
            onClick={() => setMaxColors(Math.min(20, maxColors + 1))}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            +
          </button>
        </div>

        {/* Color Swatches (Full width if 1, split if multiple) */}
        <div className="flex flex-1 gap-1 overflow-hidden h-10">
          {allColors.length > 0 ? (
            allColors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColor(color)}
                style={{ backgroundColor: color }}
                className={`h-full flex-1 transition-all duration-200 ${
                  idx === 0 ? "rounded-l-lg" : ""
                } ${idx === allColors.length - 1 ? "rounded-r-lg" : ""} ${
                  selectedColor === color
                    ? "ring-2 ring-black ring-offset-2 z-10 scale-105"
                    : "border border-gray-200"
                }`}
                title={color}
              />
            ))
          ) : (
            // Completely empty if no image and no colors picked
            <div className="flex-1 bg-transparent" />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
            ⬇
          </button>
          <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
            ⧉
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;
