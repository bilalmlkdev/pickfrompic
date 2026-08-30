import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { HexColorPicker } from "react-colorful";
import { useCopy } from "react-use-copy";
import {
  hexToRgb,
  rgbToHsl,
  rgbToCmyk,
  rgbToXyz,
  rgbToLab,
  rgbToLuv,
  rgbToHwb,
} from "../utils/ColorMath";

const ColorDetailPage = () => {
  const { hex } = useParams();
  const initialHex = `#${hex?.replace("#", "")}`;
  const [currentHex, setCurrentHex] = useState(initialHex);
  const { copied, copy } = useCopy();

  const rgb = hexToRgb(currentHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const xyz = rgbToXyz(rgb.r, rgb.g, rgb.b);
  const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
  const luv = rgbToLuv(rgb.r, rgb.g, rgb.b);
  const hwb = rgbToHwb(rgb.r, rgb.g, rgb.b);

  const formats = [
    { label: "HEX", value: currentHex },
    { label: "HSL", value: `${hsl.h}, ${hsl.s}, ${hsl.l}` },
    { label: "RGB", value: `${rgb.r}, ${rgb.g}, ${rgb.b}` },
    { label: "XYZ", value: `${xyz.x}, ${xyz.y}, ${xyz.z}` },
    { label: "CMYK", value: `${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}` },
    { label: "LUV", value: `${luv.L}, ${luv.U}, ${luv.V}` },
    { label: "LAB", value: `${lab.L}, ${lab.a}, ${lab.b}` },
    { label: "HWB", value: `${hwb.h}, ${hwb.w}, ${hwb.b}` },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-cyan-200 p-8">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="text-blue-600 underline mb-4 block">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {currentHex.toUpperCase()} Color Details
        </h1>
        <p className="text-gray-600 mb-8">
          Generate color codes, variations, harmonies, and check contrast
          ratios.
        </p>

        <div className="bg-white rounded-3xl p-8 shadow-xl flex gap-8">
          <div className="w-1/3">
            <h2 className="text-xl font-semibold mb-4">Fine-tune Color</h2>
            <HexColorPicker
              color={currentHex}
              onChange={setCurrentHex}
              className="w-full h-48!"
            />
          </div>
          <div className="flex-1">
            <div
              className="bg-blue-600 rounded-2xl p-8 mb-6 flex items-center justify-between"
              style={{ backgroundColor: currentHex }}
            >
              <h2 className="text-2xl font-bold text-white">{currentHex}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {formats.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center justify-between border border-gray-200 rounded-lg p-3"
                >
                  <span className="text-sm text-gray-500 w-12">{f.label}</span>
                  <span className="font-mono text-sm text-gray-800 flex-1 ml-2">
                    {f.value}
                  </span>
                  <button
                    onClick={() => copy(f.value)}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    {copied ? "✓" : "⧉"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorDetailPage;
