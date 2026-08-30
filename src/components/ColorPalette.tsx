import React, { useState } from "react";
import ExportPaletteModal from "./ExportPaletteModal";

interface Props {
  colors: string[];
  selectedColor: string;
  setSelectedColor: (hex: string) => void;
  maxColors: number;
  setMaxColors: (num: number) => void;
}

const ColorPalette: React.FC<Props> = ({
  colors,
  selectedColor,
  setSelectedColor,
  maxColors,
  setMaxColors,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const allColors = colors.slice(0, maxColors);

  return (
    <div>
      <h2 className="font-semibold text-gray-800 mb-3">Color Palette</h2>
      <div className="flex items-center gap-3">
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
            <div className="flex-1 bg-transparent" />
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* UPDATED: Download Button Opens Modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
            title="Download Palette"
          >
            ⬇
          </button>
          <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
            ⧉
          </button>
        </div>
      </div>

      {/* The Export Modal */}
      <ExportPaletteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        colors={allColors}
      />
    </div>
  );
};

export default ColorPalette;
