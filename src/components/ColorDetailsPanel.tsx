import React, { useEffect, useState, useRef } from "react";
import { useCopy } from "react-use-copy";

interface Props {
  colors: string[];
  selectedColor: string;
  setSelectedColor: (hex: string) => void;
  setImageSrc: (src: string) => void; // Passed from App
}

const ColorDetailsPanel: React.FC<Props> = ({
  colors,
  selectedColor,
  setSelectedColor,
  setImageSrc,
}) => {
  const { copied, copy } = useCopy();
  const [rgb, setRgb] = useState("");
  const [hsl, setHsl] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Conversion logic (Hex to RGB and HSL)
  useEffect(() => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
        : "";
    };
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
      return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    };

    setRgb(hexToRgb(selectedColor));
    setHsl(hexToHsl(selectedColor));
  }, [selectedColor]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
    }
  };

  // Real "Pick from Screen" using Native EyeDropper API
  const pickFromScreen = async () => {
    if ("EyeDropper" in window) {
      try {
        // @ts-ignore - EyeDropper is new, TypeScript doesn't have definitions yet
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        setSelectedColor(result.sRGBHex);
      } catch (e) {
        // User cancelled the picker (pressed Esc or clicked away)
        console.log("EyeDropper cancelled");
      }
    } else {
      alert(
        "Your browser does not support the EyeDropper API. Please use Chrome, Edge, or Opera, or use the file upload.",
      );
    }
  };

  const topColors = colors.slice(0, 2);

  return (
    <div className="flex flex-col">
      <h2 className="font-semibold text-gray-800 mb-3">Colors</h2>

      {/* Top Two Most Used Colors */}
      <div className="flex gap-4 mb-6">
        {topColors.length > 0 ? (
          topColors.map((color, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedColor(color)}
              style={{ backgroundColor: color }}
              className={`h-20 w-32 rounded-xl border ${
                selectedColor === color
                  ? "border-2 border-black"
                  : "border-gray-200"
              } transition`}
            />
          ))
        ) : (
          <>
            <div className="h-20 w-32 rounded-xl bg-blue-500 border border-gray-200" />
            <div className="h-20 w-32 rounded-xl bg-blue-800 border border-gray-200" />
          </>
        )}
      </div>

      {/* Values Boxes */}
      <div className="space-y-3 mb-6">
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
            <span className="font-mono text-sm text-gray-800 flex-1 ml-4">
              {item.value}
            </span>
            <button
              onClick={() => copy(item.value)}
              className="text-gray-500 hover:text-gray-800 transition"
            >
              {copied ? "✓" : "⧉"}
            </button>
          </div>
        ))}
      </div>

      {/* View Color Details */}
      <button className="text-left text-sm font-medium text-blue-600 hover:underline mb-8">
        View color details →
      </button>

      {/* Use Your Own Image Section (3 entries) */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Use your own image</h3>

        {/* 1. URL Input */}
        <input
          type="text"
          placeholder="Paste image URL here..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setImageSrc(urlInput);
          }}
          className="w-full border border-gray-300 rounded-xl p-3 text-sm mb-3 focus:outline-none focus:border-blue-500"
        />

        {/* 2. Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-gray-900 text-white font-medium py-3 rounded-xl mb-3 hover:bg-gray-800 transition flex items-center justify-center gap-2"
        >
          <span>⬆</span> Use your image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* 3. Pick from Screen Button (UPDATED) */}
        <button
          onClick={pickFromScreen}
          className="w-full bg-white border border-gray-300 text-gray-800 font-medium py-3 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <span>⌖</span> Pick from Screen
        </button>

        <p className="mt-4 text-xs text-gray-500 leading-relaxed">
          🛡️ We think data protection is important!{" "}
          <span className="text-blue-500">No data is sent.</span> The magic
          happens in your browser.
        </p>
      </div>
    </div>
  );
};

export default ColorDetailsPanel;
