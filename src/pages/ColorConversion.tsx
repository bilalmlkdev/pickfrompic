import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useCopy } from "react-use-copy";
import { Link, useParams } from "react-router-dom";
import {
  hexToRgb,
  rgbToHsl,
  rgbToCmyk,
  rgbToXyz,
  rgbToLab,
  rgbToLuv,
  rgbToHwb,
} from "../utils/ColorMath";
import SaveItemModal from "../components/modals/SaveItemModal";

const ColorConversion = () => {
  // Detect if we are coming from the Main Picker (/color/:hex) or Dashboard (/dashboard/color/create)
  const { hex } = useParams();
  const isDetailsPage = !!hex;

  const initialHex = hex ? `#${hex.replace("#", "")}` : "#2596be";
  const [currentHex, setCurrentHex] = useState(initialHex);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
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

  // REAL EyeDropper API Implementation
  const pickFromScreen = async () => {
    // Check if the browser supports the EyeDropper API (Chrome, Edge, Opera)
    if ("EyeDropper" in window) {
      try {
        // @ts-ignore - EyeDropper is a newer browser API
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) {
          setCurrentHex(result.sRGBHex);
        }
      } catch (e) {
        console.log("EyeDropper cancelled or failed");
      }
    } else {
      alert(
        "Your browser does not support the EyeDropper API. Please use Chrome, Edge, or Opera.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-cyan-200 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          #{currentHex.replace("#", "").toUpperCase()} Fjord Signal
        </h1>
        <p className="text-gray-600 mb-8">
          Generate color codes, variations, harmonies, and check contrast
          ratios.
        </p>

        {/* Dynamic Back Button */}
        {isDetailsPage ? (
          <Link to="/" className="text-blue-600 underline mb-6 block">
            ← Back to Home
          </Link>
        ) : (
          <Link
            to="/dashboard/color"
            className="text-blue-600 underline mb-6 block"
          >
            ← Back to Dashboard
          </Link>
        )}

        <div className="bg-white rounded-3xl p-8 shadow-xl flex gap-8">
          <div className="w-1/3">
            <h2 className="text-xl font-semibold mb-4">Color Conversion</h2>
            <HexColorPicker
              color={currentHex}
              onChange={setCurrentHex}
              className="w-full h-48!"
            />
            <div className="mt-4 border border-gray-200 rounded-lg p-2 bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Picker</span>
                <span className="text-xs text-gray-500">📝</span>
                <span className="text-xs text-gray-500">⧉</span>
              </div>
            </div>

            {/* Unified Save Button */}
            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="w-full bg-gray-900 text-white py-3 rounded-xl mt-4 hover:bg-gray-800"
            >
              💾 Save Color
            </button>

            {/* REAL Pick from Screen Button */}
            <button
              onClick={pickFromScreen}
              className="w-full bg-white border border-gray-300 text-gray-800 font-medium py-3 rounded-xl mt-3 hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <span>⌖</span> Pick from Screen
            </button>
          </div>

          <div className="flex-1">
            <div
              className="bg-blue-600 rounded-2xl p-8 mb-6 flex items-center justify-between"
              style={{ backgroundColor: currentHex }}
            >
              <h2 className="text-2xl font-bold text-white">
                {currentHex} Fjord Signal
              </h2>
              <div className="flex gap-2">
                <button className="bg-white/20 rounded-full p-2 text-white">
                  ♥
                </button>
                <button className="bg-white/20 rounded-full p-2 text-white">
                  ...
                </button>
              </div>
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

      {/* Saves properly to the Dashboard Colors tab */}
      <SaveItemModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        type="color"
        data={currentHex}
      />
    </div>
  );
};

export default ColorConversion;
