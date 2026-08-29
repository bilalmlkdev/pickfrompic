import React, { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useCopy } from "react-use-copy";

interface Props {
  selectedColor: string;
  setSelectedColor: (hex: string) => void;
}

const ColorDetailsPanel: React.FC<Props> = ({
  selectedColor,
  setSelectedColor,
}) => {
  const { copied, copy } = useCopy();
  const [rgb, setRgb] = useState("rgb(37, 150, 190)");
  const [hsl, setHsl] = useState("hsl(196, 67%, 45%)");

  // Logic to convert Hex to RGB and HSL on the fly
  useEffect(() => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
        : "";
    };

    // Full accurate HSL conversion (handles 3-digit and 6-digit hex)
    const hexToHsl = (hex: string) => {
      let r = 0,
        g = 0,
        b = 0;
      if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
      } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
      }

      r /= 255;
      g /= 255;
      b /= 255;
      const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      let h = 0,
        s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }

      const hDeg = Math.round(h * 360);
      const sPct = Math.round(s * 100);
      const lPct = Math.round(l * 100);
      return `hsl(${hDeg}, ${sPct}%, ${lPct}%)`;
    };

    setRgb(hexToRgb(selectedColor));
    setHsl(hexToHsl(selectedColor));
  }, [selectedColor]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold">Colors</h2>

      {/* Picker - Removed the broken CSS import, Tailwind handles sizing */}
      <HexColorPicker
        color={selectedColor}
        onChange={setSelectedColor}
        className="w-full h-40!"
      />

      {/* Values */}
      <div className="space-y-3">
        {[
          { label: "HEX", value: selectedColor },
          { label: "RGB", value: rgb },
          { label: "HSL", value: hsl },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between border border-gray-200 rounded-lg p-3"
          >
            <span className="text-gray-500 text-sm w-10">{item.label}</span>
            <span className="font-mono text-sm text-gray-800">
              {item.value}
            </span>
            <button
              onClick={() => copy(item.value)}
              className="text-xs bg-gray-100 hover:bg-gray-200 rounded px-2 py-1 text-gray-600"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorDetailsPanel;
