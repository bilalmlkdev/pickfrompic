import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { getContrastRatio, hexToRgb, rgbToHsl } from "../utils/ColorMath";
import { useCopy } from "react-use-copy";

const ContrastChecker = () => {
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#2596be");
  const { copied, copy } = useCopy();

  const ratio = getContrastRatio(textColor, bgColor);

  // Ratings
  const normalAARatio = 4.5;
  const normalAAARatio = 7;
  const largeAARatio = 3;
  const largeAAARatio = 4.5;

  const isNormalAA = ratio >= normalAARatio;
  const isNormalAAA = ratio >= normalAAARatio;
  const isLargeAA = ratio >= largeAARatio;
  const isLargeAAA = ratio >= largeAAARatio;

  // Overall rating
  let rating = "Poor";
  let ratingColor = "text-red-500";
  let ratingBg = "bg-red-50 border-red-200";
  let stars = "★☆☆☆☆";

  if (ratio >= 7) {
    rating = "Excellent";
    ratingColor = "text-green-600";
    ratingBg = "bg-green-50 border-green-200";
    stars = "★★★★★";
  } else if (ratio >= 4.5) {
    rating = "Good";
    ratingColor = "text-yellow-600";
    ratingBg = "bg-yellow-50 border-yellow-200";
    stars = "★★★★☆";
  } else if (ratio >= 3) {
    rating = "Moderate";
    ratingColor = "text-orange-500";
    ratingBg = "bg-orange-50 border-orange-200";
    stars = "★★★☆☆";
  }

  // Convert to RGB and HSL for display
  const textRgb = hexToRgb(textColor);
  const bgRgb = hexToRgb(bgColor);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-cyan-200 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Color Contrast Checker
          </h1>
          <p className="text-lg text-gray-600">
            Test the contrast ratio between foreground and background colors to
            ensure accessibility.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Top Ratio Section */}
          <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50/50">
            <div className="text-center md:text-left">
              <div className="text-6xl font-bold text-gray-900">
                {ratio.toFixed(2)}
                <span className="text-2xl text-gray-500">:1</span>
              </div>
              <p className="text-gray-500 mt-2">Contrast</p>
            </div>

            <div
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl border ${ratingBg}`}
            >
              <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center font-bold text-lg">
                AA
              </div>
              <div>
                <div className={`text-xl font-bold ${ratingColor}`}>
                  {rating}
                </div>
                <div className="text-yellow-400 text-xl tracking-widest">
                  {stars}
                </div>
              </div>
            </div>
          </div>

          {/* Normal & Large Text Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-100">
            <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100">
              <h3 className="font-semibold mb-3 text-center">Normal Text</h3>
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <div className="font-bold text-xl">AA (4.5:1)</div>
                  <div
                    className={`text-2xl mt-1 ${isNormalAA ? "text-green-500" : "text-red-500"}`}
                  >
                    {isNormalAA ? "✓" : "✗"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl">AAA (7:1)</div>
                  <div
                    className={`text-2xl mt-1 ${isNormalAAA ? "text-green-500" : "text-red-500"}`}
                  >
                    {isNormalAAA ? "✓" : "✗"}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-semibold mb-3 text-center">Large Text</h3>
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <div className="font-bold text-xl">AA (3:1)</div>
                  <div
                    className={`text-2xl mt-1 ${isLargeAA ? "text-green-500" : "text-red-500"}`}
                  >
                    {isLargeAA ? "✓" : "✗"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl">AAA (4.5:1)</div>
                  <div
                    className={`text-2xl mt-1 ${isLargeAAA ? "text-green-500" : "text-red-500"}`}
                  >
                    {isLargeAAA ? "✓" : "✗"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Layout: Inputs & Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 p-8">
            {/* Left: Colors */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
              <div className="flex gap-2 border-b border-gray-100 pb-4">
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-sm font-medium">
                  🎨 Colors
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-500 text-sm">
                  📏 Adjust
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-500 text-sm">
                  💡 Suggestions
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mb-2">
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1 p-3 focus:outline-none font-mono text-sm"
                  />
                  <div
                    className="w-10 h-10 border-l border-gray-200"
                    style={{ backgroundColor: textColor }}
                  ></div>
                </div>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-10 cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  #{textColor.replace("#", "")}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mb-2">
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 p-3 focus:outline-none font-mono text-sm"
                  />
                  <div
                    className="w-10 h-10 border-l border-gray-200"
                    style={{ backgroundColor: bgColor }}
                  ></div>
                </div>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-10 cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  #{bgColor.replace("#", "")}
                </p>
              </div>
            </div>

            {/* Right: Preview */}
            <div
              className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[400px]"
              style={{ backgroundColor: bgColor }}
            >
              <div className="text-center" style={{ color: textColor }}>
                <div className="text-8xl font-bold mb-4">Aa</div>
                <h2 className="text-3xl font-bold mb-2">Preview Title</h2>
                <p className="text-xl mb-4">
                  The quick brown fox jumps over the lazy dog
                </p>
                <p className="text-xs mb-8">Small text example (12px)</p>

                <div className="flex justify-center gap-8 pt-4 border-t border-current/20 text-sm">
                  <div>
                    <p className="font-semibold">Text</p>
                    <p className="flex items-center gap-1 text-xs opacity-80">
                      ■ {textColor}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Background</p>
                    <p className="flex items-center gap-1 text-xs opacity-80">
                      ■ {bgColor}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* WCAG Standards */}
          <div className="bg-gray-50 p-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Level AA</h4>
              <p className="text-sm text-gray-600">
                Minimum contrast ratio of 4.5:1 for normal text and 3:1 for
                large text. Required for most websites.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Level AAA</h4>
              <p className="text-sm text-gray-600">
                Enhanced contrast ratio of 7:1 for normal text and 4.5:1 for
                large text. Recommended for optimal accessibility.
              </p>
            </div>
            <p className="text-sm text-gray-500 col-span-full mt-4">
              Good contrast (AA) for normal text, excellent contrast (AAA) for
              large text.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContrastChecker;
