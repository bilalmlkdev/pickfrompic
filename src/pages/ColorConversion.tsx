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
  rgbToHsb,
  hsbToHex,
  hslToHex,
} from "../utils/ColorMath";
import SaveItemModal from "../components/modals/SaveItemModal";

const ColorConversion = () => {
  const { hex } = useParams();
  const isDetailsPage = !!hex;
  const initialHex = hex ? `#${hex.replace('#', '')}` : "#2596be";

  const [currentHex, setCurrentHex] = useState(initialHex);
  const [format, setFormat] = useState("picker");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const { copied, copy } = useCopy();

  // Derived values
  const rgb = hexToRgb(currentHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsb = rgbToHsb(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const xyz = rgbToXyz(rgb.r, rgb.g, rgb.b);
  const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
  const luv = rgbToLuv(rgb.r, rgb.g, rgb.b);
  const hwb = rgbToHwb(rgb.r, rgb.g, rgb.b);

  // Grid Formats
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

  // Pick from Screen logic
  const pickFromScreen = async () => {
    if ("EyeDropper" in window) {
      try {
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) setCurrentHex(result.sRGBHex);
      } catch (e) {
        console.log("EyeDropper cancelled");
      }
    } else {
      alert("Your browser does not support the EyeDropper API.");
    }
  };

  // Dynamic Slider Handlers
  const handleHsbChange = (key: 'h' | 's' | 'v', value: number) => {
    const newHsb = { ...hsb, [key]: value };
    setCurrentHex(hsbToHex(newHsb.h, newHsb.s, newHsb.v));
  };

  const handleHslChange = (key: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...hsl, [key]: value };
    setCurrentHex(hslToHex(newHsl.h, newHsl.s, newHsl.l));
  };

  const handleRgbChange = (key: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgb, [key]: value };
    const toHex = (c: number) => {
      const hex = Math.max(0, Math.min(255, c)).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    setCurrentHex(`#${toHex(newRgb.r)}${toHex(newRgb.g)}${toHex(newRgb.b)}`);
  };

  // Gradient backgrounds for sliders
  const hueGradient = "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)";
  const hsbSGradient = `linear-gradient(to right, #888888, ${currentHex})`;
  const hsbVGradient = `linear-gradient(to right, #000000, ${currentHex})`;
  const hslSGradient = `linear-gradient(to right, #888888, ${currentHex})`;
  const hslLGradient = "linear-gradient(to right, #000000, #ffffff)";
  const rgbGradient = `linear-gradient(to right, #000000, ${currentHex})`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-cyan-200 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">#{currentHex.replace('#', '').toUpperCase()} Fjord Signal</h1>
        <p className="text-gray-600 mb-8">Generate color codes, variations, harmonies, and check contrast ratios.</p>

        {isDetailsPage ? (
          <Link to="/" className="text-blue-600 underline mb-6 block">← Back to Home</Link>
        ) : (
          <Link to="/dashboard/color" className="text-blue-600 underline mb-6 block">← Back to Dashboard</Link>
        )}

        <div className="bg-white rounded-3xl p-8 shadow-xl flex gap-8">

          {/* Left Panel */}
          <div className="w-1/3 relative">
            <h2 className="text-xl font-semibold mb-4">Color Conversion</h2>

            {/* Main Picker */}
            <HexColorPicker color={currentHex} onChange={setCurrentHex} className="w-full h-48!" />

            {/* Divider and Controls */}
            <div className="mt-4 border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-4">

              {/* Picker Input / Dynamic Sliders */}
              {format === 'picker' && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentHex}
                    onChange={(e) => setCurrentHex(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg p-2 bg-white text-sm font-mono focus:outline-none"
                  />
                  <div className="w-8 h-8 rounded-lg border border-gray-200" style={{ backgroundColor: currentHex }}></div>
                </div>
              )}

              {format === 'hsb' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">H</span>
                    <input type="number" value={hsb.h} onChange={(e) => handleHsbChange('h', parseInt(e.target.value))} className="w-16 border border-gray-200 rounded px-2 py-1 text-right text-sm bg-white" />
                  </div>
                  <input type="range" min={0} max={360} value={hsb.h} onChange={(e) => handleHsbChange('h', parseInt(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: hueGradient }} />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">S</span>
                    <input type="number" value={hsb.s} onChange={(e) => handleHsbChange('s', parseInt(e.target.value))} className="w-16 border border-gray-200 rounded px-2 py-1 text-right text-sm bg-white" />
                  </div>
                  <input type="range" min={0} max={100} value={hsb.s} onChange={(e) => handleHsbChange('s', parseInt(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: hsbSGradient }} />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">B</span>
                    <input type="number" value={hsb.v} onChange={(e) => handleHsbChange('v', parseInt(e.target.value))} className="w-16 border border-gray-200 rounded px-2 py-1 text-right text-sm bg-white" />
                  </div>
                  <input type="range" min={0} max={100} value={hsb.v} onChange={(e) => handleHsbChange('v', parseInt(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: hsbVGradient }} />
                </div>
              )}

              {format === 'hsl' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">H</span>
                    <input type="number" value={hsl.h} onChange={(e) => handleHslChange('h', parseInt(e.target.value))} className="w-16 border border-gray-200 rounded px-2 py-1 text-right text-sm bg-white" />
                  </div>
                  <input type="range" min={0} max={360} value={hsl.h} onChange={(e) => handleHslChange('h', parseInt(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: hueGradient }} />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">S</span>
                    <input type="number" value={hsl.s} onChange={(e) => handleHslChange('s', parseInt(e.target.value))} className="w-16 border border-gray-200 rounded px-2 py-1 text-right text-sm bg-white" />
                  </div>
                  <input type="range" min={0} max={100} value={hsl.s} onChange={(e) => handleHslChange('s', parseInt(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: hslSGradient }} />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">L</span>
                    <input type="number" value={hsl.l} onChange={(e) => handleHslChange('l', parseInt(e.target.value))} className="w-16 border border-gray-200 rounded px-2 py-1 text-right text-sm bg-white" />
                  </div>
                  <input type="range" min={0} max={100} value={hsl.l} onChange={(e) => handleHslChange('l', parseInt(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: hslLGradient }} />
                </div>
              )}

              {format === 'rgb' && (
                <div className="space-y-3">
                  {(['r', 'g', 'b'] as const).map((key) => (
                    <div key={key}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 uppercase">{key}</span>
                        <input type="number" value={rgb[key]} onChange={(e) => handleRgbChange(key, parseInt(e.target.value))} className="w-16 border border-gray-200 rounded px-2 py-1 text-right text-sm bg-white" />
                      </div>
                      <input type="range" min={0} max={255} value={rgb[key]} onChange={(e) => handleRgbChange(key, parseInt(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: rgbGradient }} />
                    </div>
                  ))}
                </div>
              )}

              {format === 'cmyk' && (
                <div className="grid grid-cols-2 gap-3">
                  {(['c', 'm', 'y', 'k'] as const).map((key) => (
                    <div key={key}>
                      <label className="text-xs text-gray-500 uppercase">{key}</label>
                      <input type="number" value={cmyk[key]} onChange={(e) => setCurrentHex(currentHex)} className="w-full border border-gray-200 rounded px-2 py-1 text-sm bg-white" />
                    </div>
                  ))}
                </div>
              )}

              {format === 'lab' && (
                <div className="grid grid-cols-3 gap-3">
                  {(['L', 'a', 'b'] as const).map((key) => (
                    <div key={key}>
                      <label className="text-xs text-gray-500">{key}</label>
                      <input type="number" value={lab[key]} onChange={(e) => setCurrentHex(currentHex)} className="w-full border border-gray-200 rounded px-2 py-1 text-sm bg-white" />
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Row: Dropdown / Pencil / Copy */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg p-2 bg-white focus:outline-none cursor-pointer"
                >
                  <option value="picker">Picker</option>
                  <option value="hsb">HSB</option>
                  <option value="hsl">HSL</option>
                  <option value="rgb">RGB</option>
                  <option value="cmyk">CMYK</option>
                  <option value="lab">LAB</option>
                </select>
                <div className="flex items-center gap-2">
                  <button className="text-gray-400 hover:text-gray-600" title="Edit">✏️</button>
                  <button onClick={() => copy(currentHex)} className="text-gray-400 hover:text-gray-600" title="Copy">
                    {copied ? "✓" : "⧉"}
                  </button>
                </div>
              </div>
            </div>

            {/* Pick from Screen Button */}
            <button
              onClick={pickFromScreen}
              className="w-full bg-gray-900 text-white py-3 rounded-xl mt-4 hover:bg-gray-800 transition flex items-center justify-center gap-2"
            >
              <span>⌖</span> Pick from Screen
            </button>
          </div>

          {/* Right Panel: Banner & Grid */}
          <div className="flex-1">
            {/* Top Banner (Heart is Save) */}
            <div className="bg-blue-600 rounded-2xl p-8 mb-6 flex items-center justify-between" style={{ backgroundColor: currentHex }}>
              <h2 className="text-2xl font-bold text-white">{currentHex} Fjord Signal</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsSaveModalOpen(true)}
                  className="bg-white/20 rounded-full p-2 text-white hover:bg-white/40 transition"
                  title="Save Color"
                >
                  ♥
                </button>
                <button className="bg-white/20 rounded-full p-2 text-white hover:bg-white/40 transition">
                  ...
                </button>
              </div>
            </div>

            {/* Conversion Grid */}
            <div className="grid grid-cols-2 gap-4">
              {formats.map((f) => (
                <div key={f.label} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                  <span className="text-sm text-gray-500 w-12">{f.label}</span>
                  <span className="font-mono text-sm text-gray-800 flex-1 ml-2">{f.value}</span>
                  <button onClick={() => copy(f.value)} className="text-gray-400 hover:text-gray-700">{copied ? "✓" : "⧉"}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Modal (Triggered by Heart) */}
      <SaveItemModal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} type="color" data={currentHex} />
    </div>
  );
};

export default ColorConversion;
