import React from "react";

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
  return (
    <div>
      <h2 className="font-semibold text-gray-800 mb-3">Color Palette</h2>
      <div className="flex items-center gap-3">
        {/* Minus and Plus Buttons */}
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

        {/* Color Swatches */}
        <div className="flex flex-1 gap-1 overflow-hidden">
          {colors.slice(0, maxColors).map((color, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedColor(color)}
              style={{ backgroundColor: color }}
              className={`h-10 flex-1 border ${
                selectedColor === color
                  ? "border-2 border-black scale-110 z-10"
                  : "border-gray-200"
              } transition`}
              title={color}
            />
          ))}
        </div>

        {/* Download and Copy Icons */}
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
