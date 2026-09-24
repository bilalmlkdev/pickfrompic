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
  const routeHex = hex ? `#${hex.replace("#", "")}` : "#2596be";

  const [currentHex, setCurrentHex] = useState(routeHex);
  const [hexDraft, setHexDraft] = useState(routeHex);
  const [prevRouteHex, setPrevRouteHex] = useState(routeHex);
  const [format, setFormat] = useState("picker");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [harmonyTab, setHarmonyTab] = useState("complementary");

  if (routeHex !== prevRouteHex) {
    setPrevRouteHex(routeHex);
    if (isValidHex(routeHex)) {
      setCurrentHex(routeHex);
      setHexDraft(routeHex);
    }
  }

  const applyHex = (val: string) => {
    setCurrentHex(val);
    setHexDraft(val);
  };

  const handleHexDraft = (val: string) => {
    setHexDraft(val);
    if (isValidHex(val)) setCurrentHex(val);
  };

  const handleCopy = useCallback((id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }, []);

  const addToRecent = (color: string) => {
    setRecentColors((prev) => {
      const filtered = prev.filter((c) => c !== color);
      return [color, ...filtered].slice(0, 8);
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

  const pickFromScreen = async () => {
    if ("EyeDropper" in window) {
      try {
        // @ts-expect-error EyeDropper API not in TS lib types
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) {
          applyHex(result.sRGBHex);
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
    applyHex(hsbToHex(newHsb.h, newHsb.s, newHsb.v));
  };

  const handleHslChange = (key: "h" | "s" | "l", value: number) => {
    if (isNaN(value)) return;
    const newHsl = { ...hsl, [key]: value };
    applyHex(hslToHex(newHsl.h, newHsl.s, newHsl.l));
  };

  const handleRgbChange = (key: "r" | "g" | "b", value: number) => {
    if (isNaN(value)) return;
    const newRgb = { ...rgb, [key]: value };
    const toHex = (c: number) => {
      const h = Math.max(0, Math.min(255, c)).toString(16);
      return h.length === 1 ? "0" + h : h;
    };
    applyHex(`#${toHex(newRgb.r)}${toHex(newRgb.g)}${toHex(newRgb.b)}`);
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
    <div className="flex-1 flex flex-col">
      <div className="text-center mt-8 mb-4 md:mb-6 px-4">
        <h1 className="text-[28px] md:text-[42px] font-medium text-foreground tracking-tight leading-tight">
          Color Converter
        </h1>
        <p className="mt-2 text-muted-foreground text-lg">
          Pick any color and explore its HEX, RGB, HSL, CMYK, LAB, LUV, HWB values, harmonies, shades, and contrast.
        </p>
      </div>

      <div className="relative flex-1 px-4 pb-4">
        <ToolCard noMaximize className="max-w-[1100px] mx-auto px-6 pb-6 pt-4">
          <div
            className="rounded-2xl p-6 mb-5 flex items-center justify-between relative overflow-hidden"
            style={{ backgroundColor: currentHex }}
          >
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, ${textColor} 1px, transparent 1px), radial-gradient(circle at 80% 20%, ${textColor} 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />
            <div className="relative flex items-baseline gap-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: textColor }}>
                {currentHex.toUpperCase()}
              </h2>
              <span className="text-lg font-medium hidden sm:block" style={{ color: textColor, opacity: 0.75 }}>
                {colorName}
              </span>
            </div>
            <div className="relative flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3 text-sm" style={{ color: textColor, opacity: 0.7 }}>
                <span className="font-mono">RGB {rgb.r}, {rgb.g}, {rgb.b}</span>
                <span className="w-px h-4" style={{ backgroundColor: textColor, opacity: 0.3 }} />
                <span className="font-mono">HSL {hsl.h}, {hsl.s}%, {hsl.l}%</span>
              </div>
              <button
                onClick={() => { setIsSaveModalOpen(true); addToRecent(currentHex); }}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: `${textColor}20`, color: textColor }}
                title="Save Color"
              >
                <Heart size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-5 min-h-0">
            <div className="flex flex-col min-h-0">
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

              <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
                {format === "picker" && (
                  <>
                    <div className="rounded-xl overflow-hidden border border-border shadow-sm">
                      <HexColorPicker
                        color={currentHex}
                        onChange={(c) => { applyHex(c); addToRecent(c); }}
                        className="w-full h-44!"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={hexDraft}
                        onChange={(e) => handleHexDraft(e.target.value)}
                        className="flex-1 border border-border rounded-lg px-3 py-2 bg-card text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-foreground/10"
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
                  <div className="border border-border rounded-xl p-3 bg-muted/50 space-y-3">
                    {(["h", "s", "v"] as const).map((key) => (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground uppercase font-medium">{key}</span>
                          <input
                            type="number"
                            value={hsb[key]}
                            onChange={(e) => handleHsbChange(key, parseInt(e.target.value))}
                            className="w-14 border border-border rounded px-2 py-1 text-right text-xs bg-card text-foreground"
                          />
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={key === "h" ? 360 : 100}
                          value={hsb[key]}
                          onChange={(e) => handleHsbChange(key, parseInt(e.target.value))}
                          className="w-full h-2 rounded-full appearance-none cursor-pointer"
                          style={{ background: key === "h" ? hueGradient : key === "s" ? hsbSGradient : hsbVGradient }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {format === "hsl" && (
                  <div className="border border-border rounded-xl p-3 bg-muted/50 space-y-3">
                    {(["h", "s", "l"] as const).map((key) => (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground uppercase font-medium">{key}</span>
                          <input
                            type="number"
                            value={hsl[key]}
                            onChange={(e) => handleHslChange(key, parseInt(e.target.value))}
                            className="w-14 border border-border rounded px-2 py-1 text-right text-xs bg-card text-foreground"
                          />
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={key === "h" ? 360 : 100}
                          value={hsl[key]}
                          onChange={(e) => handleHslChange(key, parseInt(e.target.value))}
                          className="w-full h-2 rounded-full appearance-none cursor-pointer"
                          style={{ background: key === "h" ? hueGradient : key === "s" ? hslSGradient : hslLGradient }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {format === "rgb" && (
                  <div className="border border-border rounded-xl p-3 bg-muted/50 space-y-3">
                    {(["r", "g", "b"] as const).map((key) => {
                      const ch = key === "r"
                        ? `linear-gradient(to right, rgb(0,${rgb.g},${rgb.b}), rgb(255,${rgb.g},${rgb.b}))`
                        : key === "g"
                          ? `linear-gradient(to right, rgb(${rgb.r},0,${rgb.b}), rgb(${rgb.r},255,${rgb.b}))`
                          : `linear-gradient(to right, rgb(${rgb.r},${rgb.g},0), rgb(${rgb.r},${rgb.g},255))`;
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground uppercase font-medium">{key}</span>
                            <input
                              type="number"
                              value={rgb[key]}
                              onChange={(e) => handleRgbChange(key, parseInt(e.target.value))}
                              className="w-14 border border-border rounded px-2 py-1 text-right text-xs bg-card text-foreground"
                            />
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={255}
                            value={rgb[key]}
                            onChange={(e) => handleRgbChange(key, parseInt(e.target.value))}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer"
                            style={{ background: ch }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {format === "cmyk" && (
                  <div className="border border-border rounded-xl p-3 bg-muted/50 grid grid-cols-2 gap-3">
                    {(["c", "m", "y", "k"] as const).map((key) => (
                      <div key={key}>
                        <label className="text-[10px] text-muted-foreground uppercase font-medium">{key}</label>
                        <input type="number" value={cmyk[key]} readOnly className="w-full border border-border rounded px-2 py-1 text-xs bg-card text-foreground mt-0.5" />
                      </div>
                    ))}
                  </div>
                )}

                {format === "lab" && (
                  <div className="border border-border rounded-xl p-3 bg-muted/50 grid grid-cols-3 gap-3">
                    {(["L", "a", "b"] as const).map((key) => (
                      <div key={key}>
                        <label className="text-[10px] text-muted-foreground font-medium">{key}</label>
                        <input type="number" value={lab[key]} readOnly className="w-full border border-border rounded px-2 py-1 text-xs bg-card text-foreground mt-0.5" />
                      </div>
                    ))}
                  </div>
                )}

                {recentColors.length > 0 && (
                  <div>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase mb-1.5 block">Recent</span>
                    <div className="flex flex-wrap gap-1.5">
                      {recentColors.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => applyHex(c)}
                          className="w-7 h-7 rounded-lg border border-border hover:scale-110 transition-transform shrink-0"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button variant="primary" fullWidth size="sm" icon={<Pipette size={13} />} onClick={pickFromScreen} className="mt-3 shrink-0">
                Pick from screen
              </Button>
            </div>

            <div className="flex flex-col min-h-0 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 mb-5">
                {allFormats.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center justify-between border border-border rounded-xl p-3 bg-card/50 hover:bg-card transition-colors group"
                  >
                    <span className="text-[11px] font-semibold text-muted-foreground w-10 shrink-0 uppercase">{f.label}</span>
                    <span className="font-mono text-xs text-foreground flex-1 ml-2 truncate">{f.value}</span>
                    <button
                      onClick={() => handleCopy(`format-${f.label}`, f.value)}
                      className="text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-2 opacity-0 group-hover:opacity-100"
                    >
                      {copiedId === `format-${f.label}` ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2.5">
                  <Palette size={14} className="text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">Color Harmonies</span>
                </div>
                <div className="flex gap-1 mb-2.5">
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
                      {tab === "split" ? "Split" : tab.charAt(0).toUpperCase() + tab.slice(1, 5)}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  {harmonyColors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => { applyHex(c); addToRecent(c); }}
                      className="flex-1 h-11 rounded-xl border-2 border-transparent hover:border-foreground/30 transition-all relative group shadow-sm"
                      style={{ backgroundColor: c }}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 text-white rounded-xl">
                        {c.toUpperCase()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mb-5">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Droplets size={13} className="text-muted-foreground" />
                    <span className="text-xs font-semibold text-foreground">Shades</span>
                  </div>
                  <div className="flex gap-1">
                    {shades.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => { applyHex(c); addToRecent(c); }}
                        className="flex-1 h-8 rounded-lg hover:scale-110 transition-transform shadow-sm"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Droplets size={13} className="text-muted-foreground" />
                    <span className="text-xs font-semibold text-foreground">Tints</span>
                  </div>
                  <div className="flex gap-1">
                    {tints.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => { applyHex(c); addToRecent(c); }}
                        className="flex-1 h-8 rounded-lg hover:scale-110 transition-transform shadow-sm"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col min-h-0 overflow-y-auto">
              <span className="text-[10px] font-medium text-muted-foreground uppercase mb-2">Palette</span>
              <div
                className="flex gap-0 rounded-xl overflow-hidden border border-border mb-4 shadow-sm"
                style={{ height: "56px" }}
              >
                {[currentHex, ...harmonyColors].slice(0, 5).map((c, i) => {
                  const tLum = hexToRgb(c);
                  const tBri = tLum.r * 0.299 + tLum.g * 0.587 + tLum.b * 0.114;
                  const tColor = tBri > 150 ? "#000" : "#fff";
                  return (
                    <button
                      key={i}
                      onClick={() => { applyHex(c); addToRecent(c); }}
                      className="flex-1 relative group flex flex-col items-center justify-center hover:flex-[1.5] transition-all min-w-0"
                      style={{ backgroundColor: c }}
                    >
                      <span className="text-[9px] font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity px-1 truncate" style={{ color: tColor }}>
                        {c.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
              </div>

              <span className="text-[10px] font-medium text-muted-foreground uppercase mb-2">Shades to Tints</span>
              <div className="flex gap-0 rounded-xl overflow-hidden border border-border mb-4 shadow-sm" style={{ height: "40px" }}>
                {[...shades, currentHex, ...tints].map((c, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentHex(c); addToRecent(c); }}
                    className="flex-1 hover:flex-[2] transition-all"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              <span className="text-[10px] font-medium text-muted-foreground uppercase mb-2">Full Spectrum</span>
              <div className="flex-1 min-h-[120px] rounded-xl overflow-hidden border border-border shadow-sm" style={{
                background: `conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)`,
              }} />
            </div>
          </div>
        </ToolCard>
      </div>

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
