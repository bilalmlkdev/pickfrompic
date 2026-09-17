import { useState, useCallback } from "react";
import { HexColorPicker } from "react-colorful";
import { useParams } from "react-router-dom";
import {
  Check,
  Copy,
  Heart,
  Pipette,
  Palette,
  Droplets,
  Sun,
  Contrast,
} from "lucide-react";
import {
  hexToRgb,
  rgbToHsl,
  rgbToCmyk,
  rgbToLab,
  rgbToLuv,
  rgbToHwb,
  rgbToHsb,
  hsbToHex,
  hslToHex,
  isValidHex,
  getComplementary,
  getAnalogous,
  getTriadic,
  getSplitComplementary,
  getTetradic,
  getShades,
  getTints,
  getContrastRatio,
} from "../utils/ColorMath";
import SaveItemModal from "../components/modals/SaveItemModal";
import Button from "../components/atoms/Button";
import Dropdown from "../components/atoms/Dropdown";
import ToolCard from "../components/templates/ToolCard";

const colorNames: Record<string, string> = {
  "#e59f71": "Peach", "#ba5a31": "Rust", "#0c0c0c": "Jet Black", "#69dc9e": "Mint",
  "#ff0000": "Red", "#00ff00": "Green", "#0000ff": "Blue", "#ffff00": "Yellow",
  "#ff00ff": "Magenta", "#00ffff": "Cyan", "#ffffff": "White", "#000000": "Black",
  "#2596be": "Fjord Signal", "#f59e0b": "Amber", "#8b5cf6": "Violet",
  "#ef4444": "Crimson", "#10b981": "Emerald", "#3b82f6": "Azure",
};

const getColorName = (hex: string): string => {
  const lower = hex.toLowerCase();
  if (colorNames[lower]) return colorNames[lower];
  const r = parseInt(lower.slice(1, 3), 16);
  const g = parseInt(lower.slice(3, 5), 16);
  const b = parseInt(lower.slice(5, 7), 16);
  if (r > 200 && g < 80 && b < 80) return "Red";
  if (r < 80 && g > 200 && b < 80) return "Green";
  if (r < 80 && g < 80 && b > 200) return "Blue";
  if (r > 200 && g > 200 && b < 80) return "Yellow";
  if (r > 200 && g < 80 && b > 200) return "Pink";
  if (r < 80 && g > 200 && b > 200) return "Cyan";
  if (r > 200 && g > 200 && b > 200) return "White";
  if (r < 50 && g < 50 && b < 50) return "Black";
  if (r > 150 && g > 100 && b < 80) return "Orange";
  if (r > 150 && g < 100 && b < 80) return "Brown";
  if (r < 100 && g > 100 && b > 150) return "Steel Blue";
  return "Custom";
};

const ColorConversion = () => {
  const { hex } = useParams();
  const initialHex = hex ? `#${hex.replace("#", "")}` : "#2596be";

  const [currentHex, setCurrentHex] = useState(initialHex);
  const [format, setFormat] = useState("picker");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [contrastBg, setContrastBg] = useState("#ffffff");
  const [harmonyTab, setHarmonyTab] = useState("complementary");

  const handleCopy = useCallback((id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }, []);

  const addToRecent = (color: string) => {
    setRecentColors((prev) => {
      const filtered = prev.filter((c) => c !== color);
      return [color, ...filtered].slice(0, 12);
    });
  };

  const rgb = hexToRgb(currentHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsb = rgbToHsb(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
  const luv = rgbToLuv(rgb.r, rgb.g, rgb.b);
  const hwb = rgbToHwb(rgb.r, rgb.g, rgb.b);

  const allFormats = [
    { label: "HEX", value: currentHex },
    { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: "HSB", value: `hsb(${hsb.h}, ${hsb.s}%, ${hsb.v}%)` },
    { label: "CMYK", value: `${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}` },
    { label: "LAB", value: `${lab.L}, ${lab.a}, ${lab.b}` },
    { label: "LUV", value: `${luv.L}, ${luv.U}, ${luv.V}` },
    { label: "HWB", value: `hwb(${hwb.h}, ${hwb.w}%, ${hwb.b}%)` },
  ];

  const harmonyColors = (() => {
    switch (harmonyTab) {
      case "complementary": return getComplementary(currentHex);
      case "analogous": return getAnalogous(currentHex);
      case "triadic": return getTriadic(currentHex);
      case "split": return getSplitComplementary(currentHex);
      case "tetradic": return getTetradic(currentHex);
      default: return getComplementary(currentHex);
    }
  })();

  const shades = getShades(currentHex, 6);
  const tints = getTints(currentHex, 6);

  const contrastRatio = getContrastRatio(currentHex, contrastBg);
  const wcagAA = contrastRatio >= 4.5;
  const wcagAAA = contrastRatio >= 7;

  const pickFromScreen = async () => {
    if ("EyeDropper" in window) {
      try {
        // @ts-expect-error EyeDropper API not in TS lib types
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) {
          setCurrentHex(result.sRGBHex);
          addToRecent(result.sRGBHex);
        }
      } catch {
        // user cancelled eyeDropper
      }
    } else {
      alert("Your browser does not support the EyeDropper API.");
    }
  };

  const handleFormatChange = (val: string | number) => {
    setFormat(String(val));
  };

  const handleHsbChange = (key: "h" | "s" | "v", value: number) => {
    if (isNaN(value)) return;
    const newHsb = { ...hsb, [key]: value };
    setCurrentHex(hsbToHex(newHsb.h, newHsb.s, newHsb.v));
  };

  const handleHslChange = (key: "h" | "s" | "l", value: number) => {
    if (isNaN(value)) return;
    const newHsl = { ...hsl, [key]: value };
    setCurrentHex(hslToHex(newHsl.h, newHsl.s, newHsl.l));
  };

  const handleRgbChange = (key: "r" | "g" | "b", value: number) => {
    if (isNaN(value)) return;
    const newRgb = { ...rgb, [key]: value };
    const toHex = (c: number) => {
      const h = Math.max(0, Math.min(255, c)).toString(16);
      return h.length === 1 ? "0" + h : h;
    };
    setCurrentHex(`#${toHex(newRgb.r)}${toHex(newRgb.g)}${toHex(newRgb.b)}`);
  };

  const hueGradient =
    "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)";
  const hsbSGradient = `linear-gradient(to right, #888888, ${currentHex})`;
  const hsbVGradient = `linear-gradient(to right, #000000, ${currentHex})`;
  const hslSGradient = `linear-gradient(to right, #888888, ${currentHex})`;
  const hslLGradient = "linear-gradient(to right, #000000, #ffffff)";

  const lum = rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114;
  const textColor = lum > 150 ? "#000000" : "#ffffff";
  const colorName = getColorName(currentHex);

  return (
    <div className="flex-1 w-full py-6 px-4 mt-16">
      <div className="text-center mb-6 px-4">
        <h1 className="text-[28px] md:text-[42px] font-medium text-foreground tracking-tight leading-tight">
          Color Conversion
        </h1>
        <p className="mt-2 text-muted-foreground text-lg">
          Convert between formats, explore harmonies, check contrast ratios
        </p>
      </div>

      <ToolCard>
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Dropdown
                options={[
                  { label: "Picker", value: "picker" },
                  { label: "HSB", value: "hsb" },
                  { label: "HSL", value: "hsl" },
                  { label: "RGB", value: "rgb" },
                  { label: "CMYK", value: "cmyk" },
                  { label: "LAB", value: "lab" },
                ]}
                value={format}
                onChange={handleFormatChange}
                className="w-auto min-w-[100px]"
              />
              <button
                onClick={pickFromScreen}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                title="Pick from screen"
              >
                <Pipette size={13} />
                Pick
              </button>
            </div>

            {format === "picker" && (
              <>
                <div className="rounded-xl overflow-hidden mb-3 border border-border">
                  <HexColorPicker
                    color={currentHex}
                    onChange={(c) => { setCurrentHex(c); addToRecent(c); }}
                    className="w-full h-48!"
                  />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    value={currentHex}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (isValidHex(val)) setCurrentHex(val);
                      else if (val === "" || val === "#") setCurrentHex(val);
                    }}
                    className="flex-1 border border-border rounded-lg px-3 py-2 bg-card text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-foreground/10"
                  />
                  <div
                    className="w-9 h-9 rounded-lg border border-border shrink-0"
                    style={{ backgroundColor: currentHex }}
                  />
                  <button
                    onClick={() => handleCopy("hex-copy", currentHex)}
                    className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                    title="Copy HEX"
                  >
                    {copiedId === "hex-copy" ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </>
            )}

            {format === "hsb" && (
              <div className="border border-border rounded-xl p-3 bg-muted/50 space-y-2.5">
                {(["h", "s", "v"] as const).map((key) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground uppercase">{key}</span>
                      <input
                        type="number"
                        value={hsb[key]}
                        onChange={(e) => handleHsbChange(key, parseInt(e.target.value))}
                        className="w-16 border border-border rounded px-2 py-1 text-right text-sm bg-card text-foreground"
                      />
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={key === "h" ? 360 : 100}
                      value={hsb[key]}
                      onChange={(e) => handleHsbChange(key, parseInt(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: key === "h" ? hueGradient : key === "s" ? hsbSGradient : hsbVGradient,
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {format === "hsl" && (
              <div className="border border-border rounded-xl p-3 bg-muted/50 space-y-2.5">
                {(["h", "s", "l"] as const).map((key) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground uppercase">{key}</span>
                      <input
                        type="number"
                        value={hsl[key]}
                        onChange={(e) => handleHslChange(key, parseInt(e.target.value))}
                        className="w-16 border border-border rounded px-2 py-1 text-right text-sm bg-card text-foreground"
                      />
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={key === "h" ? 360 : 100}
                      value={hsl[key]}
                      onChange={(e) => handleHslChange(key, parseInt(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: key === "h" ? hueGradient : key === "s" ? hslSGradient : hslLGradient,
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {format === "rgb" && (
              <div className="border border-border rounded-xl p-3 bg-muted/50 space-y-2.5">
                {(["r", "g", "b"] as const).map((key) => {
                  const channelGradient =
                    key === "r"
                      ? `linear-gradient(to right, rgb(0,${rgb.g},${rgb.b}), rgb(255,${rgb.g},${rgb.b}))`
                      : key === "g"
                        ? `linear-gradient(to right, rgb(${rgb.r},0,${rgb.b}), rgb(${rgb.r},255,${rgb.b}))`
                        : `linear-gradient(to right, rgb(${rgb.r},${rgb.g},0), rgb(${rgb.r},${rgb.g},255))`;
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground uppercase">{key}</span>
                        <input
                          type="number"
                          value={rgb[key]}
                          onChange={(e) => handleRgbChange(key, parseInt(e.target.value))}
                          className="w-16 border border-border rounded px-2 py-1 text-right text-sm bg-card text-foreground"
                        />
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={255}
                        value={rgb[key]}
                        onChange={(e) => handleRgbChange(key, parseInt(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{ background: channelGradient }}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {format === "cmyk" && (
              <div className="border border-border rounded-xl p-3 bg-muted/50 grid grid-cols-2 gap-2.5">
                {(["c", "m", "y", "k"] as const).map((key) => (
                  <div key={key}>
                    <label className="text-xs text-muted-foreground uppercase">{key}</label>
                    <input
                      type="number"
                      value={cmyk[key]}
                      readOnly
                      className="w-full border border-border rounded px-2 py-1 text-sm bg-card text-foreground"
                    />
                  </div>
                ))}
              </div>
            )}

            {format === "lab" && (
              <div className="border border-border rounded-xl p-3 bg-muted/50 grid grid-cols-3 gap-2.5">
                {(["L", "a", "b"] as const).map((key) => (
                  <div key={key}>
                    <label className="text-xs text-muted-foreground">{key}</label>
                    <input
                      type="number"
                      value={lab[key]}
                      readOnly
                      className="w-full border border-border rounded px-2 py-1 text-sm bg-card text-foreground"
                    />
                  </div>
                ))}
              </div>
            )}

            <Button
              variant="primary"
              fullWidth
              size="lg"
              icon={<Pipette size={15} />}
              onClick={pickFromScreen}
              className="mt-3"
            >
              Pick from screen
            </Button>

            {recentColors.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sun size={12} className="text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Recent</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {recentColors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentHex(c)}
                      className="w-7 h-7 rounded-lg border border-border hover:scale-110 transition-transform shrink-0"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div
              className="rounded-2xl p-6 mb-5 flex items-center justify-between"
              style={{ backgroundColor: currentHex }}
            >
              <div className="flex items-baseline gap-3">
                <h2 className="text-2xl font-bold" style={{ color: textColor }}>
                  {currentHex.toUpperCase()}
                </h2>
                <span className="text-base font-medium" style={{ color: textColor, opacity: 0.8 }}>
                  {colorName}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setIsSaveModalOpen(true); addToRecent(currentHex); }}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{ backgroundColor: `${textColor}20`, color: textColor }}
                  title="Save Color"
                >
                  <Heart size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-5">
              {allFormats.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center justify-between border border-border rounded-xl p-3 bg-card/50 hover:bg-card transition-colors"
                >
                  <span className="text-sm font-medium text-muted-foreground w-11 shrink-0">
                    {f.label}
                  </span>
                  <span className="font-mono text-sm text-foreground flex-1 ml-2 truncate">
                    {f.value}
                  </span>
                  <button
                    onClick={() => handleCopy(`format-${f.label}`, f.value)}
                    className="text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-2"
                  >
                    {copiedId === `format-${f.label}` ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              ))}
            </div>

            <div className="mb-5">
              <div className="flex items-center gap-1.5 mb-3">
                <Palette size={14} className="text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Harmonies</span>
              </div>
              <div className="flex gap-1 mb-3">
                {(["complementary", "analogous", "triadic", "split", "tetradic"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setHarmonyTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      harmonyTab === tab
                        ? "bg-foreground text-card"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab === "split" ? "Split" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                {harmonyColors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentHex(c); addToRecent(c); }}
                    className="flex-1 h-12 rounded-xl border-2 border-transparent hover:border-foreground/30 transition-colors relative group"
                    style={{ backgroundColor: c }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 text-white rounded-xl">
                      {c.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <div className="flex items-center gap-1.5 mb-3">
                <Droplets size={14} className="text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Shades</span>
              </div>
              <div className="flex gap-1.5">
                {shades.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentHex(c); addToRecent(c); }}
                    className="flex-1 h-8 rounded-lg hover:scale-110 transition-transform"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="mb-5">
              <div className="flex items-center gap-1.5 mb-3">
                <Droplets size={14} className="text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Tints</span>
              </div>
              <div className="flex gap-1.5">
                {tints.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentHex(c); addToRecent(c); }}
                    className="flex-1 h-8 rounded-lg hover:scale-110 transition-transform"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <Contrast size={14} className="text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Contrast Checker</span>
              </div>
              <div className="border border-border rounded-xl p-4 bg-card/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Background</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={contrastBg}
                        onChange={(e) => setContrastBg(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-border"
                      />
                      <input
                        type="text"
                        value={contrastBg}
                        onChange={(e) => { if (isValidHex(e.target.value)) setContrastBg(e.target.value); }}
                        className="flex-1 border border-border rounded-lg px-2 py-1.5 text-xs font-mono bg-card text-foreground"
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="rounded-xl p-4 mb-3 text-center"
                  style={{ backgroundColor: contrastBg, color: currentHex }}
                >
                  <p className="text-lg font-bold">Sample Text</p>
                  <p className="text-sm">The quick brown fox</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground">Ratio: </span>
                    <span className="text-sm font-mono font-bold text-foreground">{contrastRatio.toFixed(2)}:1</span>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-lg ${wcagAA ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      AA {wcagAA ? "Pass" : "Fail"}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-lg ${wcagAAA ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      AAA {wcagAAA ? "Pass" : "Fail"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ToolCard>

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
