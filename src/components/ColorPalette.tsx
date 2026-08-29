import React from "react";

interface Props {
  colors: { hex: string }[];
  selectedColor: string;
  setSelectedColor: (hex: string) => void;
}

const ColorPalette: React.FC<Props> = ({
  colors,
  selectedColor,
  setSelectedColor,
}) => {
  return (
    <div>
      <h2 className="font-semibold mb-3">Color Palette</h2>
      <div className="flex flex-wrap gap-3">
        {colors.map((color, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedColor(color.hex)}
            style={{ backgroundColor: color.hex }}
            className={`w-14 h-14 rounded-lg border-2 transition ${
              selectedColor === color.hex
                ? "border-black scale-110"
                : "border-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;
