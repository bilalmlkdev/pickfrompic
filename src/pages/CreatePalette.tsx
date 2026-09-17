import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Check, Copy, Heart, Pipette, LayoutGrid, Paintbrush, CreditCard, Plus, Shuffle } from "lucide-react";
import ExportPaletteModal from "../components/modals/ExportPaletteModal";
import SaveItemModal from "../components/modals/SaveItemModal";
import Button from "../components/atoms/Button";
import ToolCard from "../components/templates/ToolCard";

const colorNames: Record<string, string> = {
  "#e59f71": "Peach", "#ba5a31": "Rust", "#0c0c0c": "Jet Black", "#69dc9e": "Mint",
  "#ff0000": "Red", "#00ff00": "Green", "#0000ff": "Blue", "#ffff00": "Yellow",
  "#ff00ff": "Magenta", "#00ffff": "Cyan", "#ffffff": "White", "#000000": "Black",
  "#2596be": "Fjord Signal", "#f59e0b": "Amber", "#8b5cf6": "Violet",
};

const getColorName = (hex: string): string => {
  const lower = hex.toLowerCase();
  if (colorNames[lower]) return colorNames[lower];
  return "Custom";
};

const defaultColors = ["#2596be", "#f59e0b", "#8b5cf6", "#10b981", "#ef4444"];

const colorPresets = [
  ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3"],
  ["#00d2d3", "#ff9f43", "#ee5a24", "#0abde3"],
  ["#10ac84", "#1dd1a1", "#10ac84", "#01a3a4"],
  ["#5f27cd", "#341f97", "#c44dff", "#6c5ce7"],
  ["#ff6348", "#ffa502", "#eccc68", "#a4b0be"],
  ["#2ed573", "#7bed9f", "#70a1ff", "#1e90ff"],
];

const PRESET_PALETTES: Record<string, string[]> = {
  "Warm Sunset": ["#ff6b35", "#f7931a", "#ffd700", "#ff4500"],
  "Cool Ocean": ["#0077be", "#00a9ce", "#00d4ff", "#005f73"],
  "Forest": ["#228b22", "#32cd32", "#90ee90", "#2e8b57"],
  "Royal Purple": ["#8b008b", "#9370db", "#dda0dd", "#4b0082"],
  "Hot Pink": ["#ff1493", "#ff69b4", "#ffb6c1", "#c71585"],
  "Neon": ["#00ff00", "#ff00ff", "#00ffff", "#ffff00"],
};

const randomHex = () => {
  const h = Math.floor(Math.random() * 16777215).toString(16);
  return `#${"0".repeat(6 - h.length)}${h}`;
};

const CreatePalette = () => {
  const { colors: urlColors } = useParams();
  const initialColors = urlColors
    ? urlColors.split("-").map((c) => `#${c}`)
    : defaultColors;

  const [colors, setColors] = useState<string[]>(initialColors);
  const [name, setName] = useState("");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [showAllPresets, setShowAllPresets] = useState(false);
  const [previewTab, setPreviewTab] = useState("strip");

  const handleCopy = useCallback((id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }, []);

  const pickFromScreen = async () => {
    if ("EyeDropper" in window) {
      try {
        // @ts-expect-error EyeDropper API not in TS lib types
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) setColors((prev) => [...prev, result.sRGBHex]);
      } catch {
        // user cancelled eyeDropper
      }
    }
  };

  const removeColor = (index: number) => {
    if (colors.length <= 1) return;
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  const loadPreset = (preset: string[]) => {
    setColors(preset);
    setShowAllPresets(false);
  };

  const lum = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return r * 0.299 + g * 0.587 + b * 0.114;
  };

  const avgColor = () => {
    const r = Math.round(colors.reduce((a, c) => a + parseInt(c.slice(1, 3), 16), 0) / colors.length);
    const g = Math.round(colors.reduce((a, c) => a + parseInt(c.slice(3, 5), 16), 0) / colors.length);
    const b = Math.round(colors.reduce((a, c) => a + parseInt(c.slice(5, 7), 16), 0) / colors.length);
    const toHex = (c: number) => c.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="text-center mt-8 mb-4 md:mb-6 px-4">
        <h1 className="text-[28px] md:text-[42px] font-medium text-foreground tracking-tight leading-tight">
          Palette Generator
        </h1>
        <p className="mt-2 text-muted-foreground text-lg">
          Create custom color palettes with presets, pick from screen, and export as CSS or JSON.
        </p>
      </div>

      <div className="relative w-full max-w-[1050px] mx-auto px-4 mb-8">
        <ToolCard noMaximize className="px-6 pb-6 pt-4">
          <div
            className="rounded-2xl overflow-hidden mb-5 shadow-sm"
            style={{ height: "120px" }}
          >
            <div className="flex h-full">
              {colors.map((color, index) => {
                const textColor = lum(color) > 150 ? "#000000" : "#ffffff";
                return (
                  <div
                    key={index}
                    className="flex-1 relative group flex flex-col items-center justify-center transition-all hover:flex-[1.5] cursor-pointer min-w-0"
                    style={{ backgroundColor: color }}
                  >
                    <span className="text-xs font-bold truncate px-1" style={{ color: textColor }}>
                      {getColorName(color)}
                    </span>
                    <span className="text-[10px] font-mono opacity-80 truncate px-1" style={{ color: textColor }}>
                      {color}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(`color-${index}`, color);
                      }}
                      className="absolute bottom-1.5 right-1.5 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: textColor }}
                    >
                      {copiedId === `color-${index}` ? <Check size={11} /> : <Copy size={11} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Palette name"
                  className="flex-1 border border-border rounded-lg px-3 py-2 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10"
                />
                <button
                  onClick={() => handleCopy("palette-url", `https://pickfrompic.com/palette/${colors.map((c) => c.replace("#", "")).join("-")}`)}
                  className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                  title="Copy link"
                >
                  {copiedId === "palette-url" ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase">Colors</span>
                  <span className="text-[10px] text-muted-foreground">{colors.length} colors</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c, i) => (
                    <div key={i} className="relative group">
                      <label
                        className="block w-11 h-11 rounded-xl border-2 border-border cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        style={{ backgroundColor: c }}
                      >
                        <span
                          className="absolute inset-0 flex items-center justify-center text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: lum(c) > 150 ? "#000" : "#fff" }}
                        >
                          {c.replace("#", "").toUpperCase()}
                        </span>
                        <input
                          type="color"
                          value={c}
                          onChange={(e) => {
                            const newColors = [...colors];
                            newColors[i] = e.target.value;
                            setColors(newColors);
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </label>
                      <button
                        onClick={() => removeColor(i)}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-muted text-muted-foreground border border-border text-[10px] leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-white hover:border-destructive transition-all cursor-pointer"
                      >
                        x
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setColors((prev) => [...prev, randomHex()])}
                    className="w-11 h-11 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={pickFromScreen} icon={<Pipette size={13} />} className="flex-1">
                  Pick from Screen
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setColors(Array.from({ length: 5 }, randomHex))} icon={<Shuffle size={13} />} className="flex-1">
                  Random
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsSaveModalOpen(true)} icon={<Heart size={13} />}>
                  Save
                </Button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase">Presets</span>
                  <button
                    onClick={() => setShowAllPresets(!showAllPresets)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {showAllPresets ? "Less" : "All"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {colorPresets.slice(0, showAllPresets ? colorPresets.length : 6).map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => loadPreset(preset)}
                      className="flex h-6 rounded-md overflow-hidden border border-border hover:scale-105 transition-transform"
                      title="Load preset"
                    >
                      {preset.map((c, j) => (
                        <div key={j} className="w-4 h-full" style={{ backgroundColor: c }} />
                      ))}
                    </button>
                  ))}
                </div>
              </div>

              {showAllPresets && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase block mb-2">Named Palettes</span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(PRESET_PALETTES).map(([paletteName, preset]) => (
                      <button
                        key={paletteName}
                        onClick={() => loadPreset(preset)}
                        className="flex h-6 rounded-md overflow-hidden border border-border hover:scale-105 transition-transform"
                        title={paletteName}
                      >
                        {preset.map((c, j) => (
                          <div key={j} className="w-4 h-full" style={{ backgroundColor: c }} />
                        ))}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                variant="primary"
                fullWidth
                size="md"
                onClick={() => setIsExportOpen(true)}
              >
                Export Palette
              </Button>
            </div>

            <div className="flex flex-col min-h-0">
              <div className="flex gap-1 mb-4">
                {[
                  { label: "Strip", value: "strip", icon: LayoutGrid },
                  { label: "Gradient", value: "gradient", icon: Paintbrush },
                  { label: "Cards", value: "card", icon: CreditCard },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.value}
                      onClick={() => setPreviewTab(tab.value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        previewTab === tab.value
                          ? "bg-foreground text-card"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon size={13} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto">
                {previewTab === "strip" && (
                  <div className="space-y-3">
                    <div className="flex gap-0 rounded-xl overflow-hidden border border-border shadow-sm" style={{ height: "100px" }}>
                      {colors.map((color, index) => (
                        <div
                          key={index}
                          className="flex-1 relative group flex flex-col items-center justify-center transition-all hover:flex-[1.5] cursor-pointer min-w-0"
                          style={{ backgroundColor: color }}
                        >
                          <span className="text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity px-1 truncate" style={{ color: lum(color) > 150 ? "#000" : "#fff" }}>
                            {getColorName(color)}
                          </span>
                          <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity px-1 truncate" style={{ color: lum(color) > 150 ? "#000" : "#fff" }}>
                            {color}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-0 rounded-xl overflow-hidden border border-border shadow-sm" style={{ height: "48px" }}>
                      {colors.map((color, index) => (
                        <div key={index} className="flex-1" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {colors.map((color, index) => (
                        <div key={index} className="rounded-xl border border-border p-3 text-center shadow-sm" style={{ backgroundColor: color }}>
                          <span className="text-[10px] font-mono font-bold block" style={{ color: lum(color) > 150 ? "#000" : "#fff" }}>
                            {color.toUpperCase()}
                          </span>
                          <span className="text-[9px] block mt-0.5" style={{ color: lum(color) > 150 ? "#000" : "#fff", opacity: 0.7 }}>
                            {getColorName(color)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl border border-border p-4 flex items-center gap-4 shadow-sm">
                      <div className="w-16 h-16 rounded-xl shrink-0" style={{ backgroundColor: avgColor() }} />
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block mb-0.5">Average Color</span>
                        <span className="text-sm font-mono font-bold text-foreground">{avgColor().toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {previewTab === "gradient" && (
                  <div className="space-y-3">
                    <div className="rounded-xl overflow-hidden border border-border shadow-sm h-28" style={{
                      background: `linear-gradient(to right, ${colors.join(", ")})`,
                    }} />
                    <div className="rounded-xl overflow-hidden border border-border shadow-sm h-28" style={{
                      background: `linear-gradient(135deg, ${colors.join(", ")})`,
                    }} />
                    <div className="rounded-xl overflow-hidden border border-border shadow-sm h-28" style={{
                      background: `radial-gradient(circle, ${colors.join(", ")})`,
                    }} />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl overflow-hidden border border-border shadow-sm h-24" style={{
                        background: `linear-gradient(to bottom, ${colors.join(", ")})`,
                      }} />
                      <div className="rounded-xl overflow-hidden border border-border shadow-sm h-24" style={{
                        background: `conic-gradient(from 0deg, ${colors.join(", ")})`,
                      }} />
                    </div>
                  </div>
                )}

                {previewTab === "card" && (
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-border overflow-hidden shadow-sm">
                      <div className="h-24 flex" style={{
                        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1] || colors[0]})`,
                      }} />
                      <div className="p-4 bg-card">
                        <div className="h-3 rounded-full mb-2" style={{ backgroundColor: colors[0], width: "60%" }} />
                        <div className="h-2 rounded-full bg-muted mb-1" style={{ width: "90%" }} />
                        <div className="h-2 rounded-full bg-muted" style={{ width: "70%" }} />
                        <div className="flex gap-2 mt-3">
                          {colors.slice(0, 4).map((c, i) => (
                            <div key={i} className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border overflow-hidden shadow-sm p-5" style={{
                      background: `linear-gradient(135deg, ${colors[0]}, ${colors[colors.length - 1]})`,
                    }}>
                      <div className="h-4 rounded-full mb-3" style={{ backgroundColor: `${lum(colors[0]) > 150 ? "#000" : "#fff"}30`, width: "50%" }} />
                      <div className="h-2 rounded-full mb-1.5" style={{ backgroundColor: `${lum(colors[0]) > 150 ? "#000" : "#fff"}20`, width: "80%" }} />
                      <div className="h-2 rounded-full" style={{ backgroundColor: `${lum(colors[0]) > 150 ? "#000" : "#fff"}20`, width: "60%" }} />
                      <div className="flex gap-2 mt-4">
                        <div className="px-4 py-1.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: colors[1] || colors[0], color: lum(colors[1] || colors[0]) > 150 ? "#000" : "#fff" }}>
                          Button
                        </div>
                        <div className="px-4 py-1.5 rounded-full text-[10px] font-medium border" style={{ borderColor: `${lum(colors[0]) > 150 ? "#000" : "#fff"}40`, color: lum(colors[0]) > 150 ? "#000" : "#fff" }}>
                          Outline
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border overflow-hidden shadow-sm">
                      <div className="flex">
                        {colors.map((c, i) => (
                          <div key={i} className="flex-1 h-3" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <div className="p-4 bg-card">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: colors[0] }} />
                          <div>
                            <div className="h-2 rounded-full bg-muted" style={{ width: "80px" }} />
                            <div className="h-1.5 rounded-full bg-muted/50 mt-1" style={{ width: "50px" }} />
                          </div>
                        </div>
                        <div className="h-2 rounded-full bg-muted mb-1" style={{ width: "100%" }} />
                        <div className="h-2 rounded-full bg-muted mb-1" style={{ width: "95%" }} />
                        <div className="h-2 rounded-full bg-muted" style={{ width: "40%" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ToolCard>
      </div>

      <ExportPaletteModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        colors={colors}
      />

      <SaveItemModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        type="palette"
        data={colors}
      />
    </div>
  );
};

export default CreatePalette;
