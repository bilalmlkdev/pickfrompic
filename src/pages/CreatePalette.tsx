import { useState, useCallback, useEffect, useMemo } from "react";
import {
  Check,
  Copy,
  Heart,
  Pipette,
  LayoutGrid,
  Paintbrush,
  CreditCard,
  Plus,
  Shuffle,
  Lock,
  Unlock,
  X,
  Download,
} from "lucide-react";
import ExportPaletteModal from "../components/modals/ExportPaletteModal";
import SaveItemModal from "../components/modals/SaveItemModal";
import Button from "../components/atoms/Button";
import ToolCard from "../components/templates/ToolCard";
import SectionLabel from "../components/atoms/SectionLabel";
import ColorField from "../components/molecules/ColorField";
import { hexToRgb, rgbToHsl } from "../utils/ColorMath";

const colorNames: Record<string, string> = {
  "#e59f71": "Peach",
  "#ba5a31": "Rust",
  "#0c0c0c": "Jet Black",
  "#69dc9e": "Mint",
  "#ff0000": "Red",
  "#00ff00": "Green",
  "#0000ff": "Blue",
  "#ffff00": "Yellow",
  "#ff00ff": "Magenta",
  "#00ffff": "Cyan",
  "#ffffff": "White",
  "#000000": "Black",
  "#2596be": "Fjord Signal",
  "#f59e0b": "Amber",
  "#8b5cf6": "Violet",
};

const getColorName = (hex: string): string => colorNames[hex.toLowerCase()] || "Custom";

const defaultColors = ["#2596be", "#f59e0b", "#8b5cf6", "#10b981", "#ef4444"];

const colorPresets: string[][] = [
  ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3"],
  ["#00d2d3", "#ff9f43", "#ee5a24", "#0abde3"],
  ["#10ac84", "#1dd1a1", "#01a3a4", "#0be881"],
  ["#5f27cd", "#341f97", "#c44dff", "#6c5ce7"],
  ["#ff6348", "#ffa502", "#eccc68", "#a4b0be"],
  ["#2ed573", "#7bed9f", "#70a1ff", "#1e90ff"],
];

const PRESET_PALETTES: Record<string, string[]> = {
  "Warm Sunset": ["#ff6b35", "#f7931a", "#ffd700", "#ff4500"],
  "Cool Ocean": ["#0077be", "#00a9ce", "#00d4ff", "#005f73"],
  Forest: ["#228b22", "#32cd32", "#90ee90", "#2e8b57"],
  "Royal Purple": ["#8b008b", "#9370db", "#dda0dd", "#4b0082"],
  "Hot Pink": ["#ff1493", "#ff69b4", "#ffb6c1", "#c71585"],
  Neon: ["#00ff00", "#ff00ff", "#00ffff", "#ffff00"],
};

const randomHex = () => {
  const h = Math.floor(Math.random() * 16777215).toString(16);
  return `#${"0".repeat(6 - h.length)}${h}`;
};

const lum = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  return r * 0.299 + g * 0.587 + b * 0.114;
};

const onColor = (hex: string) => (lum(hex) > 150 ? "#000000" : "#ffffff");

const avgColor = (colors: string[]) => {
  if (colors.length === 0) return "#888888";
  const r = Math.round(colors.reduce((a, c) => a + hexToRgb(c).r, 0) / colors.length);
  const g = Math.round(colors.reduce((a, c) => a + hexToRgb(c).g, 0) / colors.length);
  const b = Math.round(colors.reduce((a, c) => a + hexToRgb(c).b, 0) / colors.length);
  const toHex = (c: number) => c.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const previewTabs = [
  { label: "Strip", value: "strip", icon: LayoutGrid },
  { label: "Gradient", value: "gradient", icon: Paintbrush },
  { label: "Cards", value: "card", icon: CreditCard },
] as const;

const CreatePalette = () => {
  const [colors, setColors] = useState<string[]>(defaultColors);
  const [locks, setLocks] = useState<boolean[]>(defaultColors.map(() => false));
  const [selected, setSelected] = useState(0);
  const [name, setName] = useState("");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [showAllPresets, setShowAllPresets] = useState(false);
  const [previewTab, setPreviewTab] = useState<string>("strip");

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
        if (result && result.sRGBHex) {
          setColors((prev) => [...prev, result.sRGBHex]);
          setLocks((prev) => [...prev, false]);
        }
      } catch {
        // user cancelled
      }
    }
  };

  const removeColor = (index: number) => {
    if (colors.length <= 2) return;
    setColors((prev) => prev.filter((_, i) => i !== index));
    setLocks((prev) => prev.filter((_, i) => i !== index));
    setSelected((prev) => Math.min(prev, colors.length - 2));
  };

  const insertColor = (index: number) => {
    if (colors.length >= 10) return;
    const next = [...colors];
    next.splice(index, 0, randomHex());
    setColors(next);
    setLocks((prev) => {
      const l = [...prev];
      l.splice(index, 0, false);
      return l;
    });
    setSelected(index);
  };

  const addColor = () => {
    if (colors.length >= 10) return;
    setColors((prev) => [...prev, randomHex()]);
    setLocks((prev) => [...prev, false]);
    setSelected(colors.length);
  };

  const toggleLock = (index: number) => {
    setLocks((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  const updateColor = (index: number, color: string) => {
    setColors((prev) => prev.map((c, i) => (i === index ? color : c)));
  };

  const randomize = () => {
    setColors((prev) => prev.map((c, i) => (locks[i] ? c : randomHex())));
  };

  const loadPreset = (preset: string[]) => {
    const next = [...preset];
    setColors(next);
    setLocks(next.map(() => false));
    setSelected(0);
    setShowAllPresets(false);
  };

  const selectedColor = colors[selected] ?? colors[0] ?? "#2596be";
  const rgb = hexToRgb(selectedColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const avg = useMemo(() => avgColor(colors), [colors]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (typing) return;
      if (e.code === "Space") {
        e.preventDefault();
        randomize();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="flex-1 flex flex-col">
      <div className="text-center mt-8 mb-4 md:mb-6 px-4">
        <h1 className="text-[28px] md:text-[42px] font-medium text-foreground tracking-tight leading-tight">
          Palette Generator
        </h1>
        <p className="mt-2 text-muted-foreground text-lg">
          Build palettes, lock favorites, and export as CSS or JSON.
        </p>
      </div>

      <div className="relative w-full max-w-[1100px] mx-auto px-4 mb-8">
        <ToolCard noMaximize className="px-5 pb-5 pt-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Palette name"
                className="flex-1 min-w-[160px] border border-border rounded-xl px-3.5 py-2.5 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={randomize}
                icon={<Shuffle size={14} />}
              >
                Generate
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={pickFromScreen}
                icon={<Pipette size={14} />}
              >
                Pick
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsSaveModalOpen(true)}
                icon={<Heart size={14} />}
              >
                Save
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsExportOpen(true)}
                icon={<Download size={14} />}
              >
                Export
              </Button>
              <span className="hidden sm:inline text-[11px] text-muted-foreground border border-border rounded-full px-2.5 py-1 bg-muted/50">
                Space to generate
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-border shadow-sm h-[220px] sm:h-[260px]">
              <div className="flex h-full w-full">
                {colors.map((color, index) => {
                  const tc = onColor(color);
                  const isSel = selected === index;
                  return (
                    <div key={`${color}-${index}`} className="relative flex min-w-0 h-full group/color">
                      <button
                        type="button"
                        onClick={() => setSelected(index)}
                        onDoubleClick={() => handleCopy(`hex-${index}`, color)}
                        className={`flex-1 h-full relative flex flex-col items-center justify-center transition-[flex] duration-200 cursor-pointer min-w-0 ${
                          isSel ? "flex-[1.35]" : "hover:flex-[1.25]"
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color}`}
                      >
                        <span className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-0 group-hover/color:opacity-100 transition-opacity">
                          <span
                            className="p-1.5 rounded-full"
                            style={{ backgroundColor: `${tc}22`, color: tc }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLock(index);
                            }}
                            role="button"
                            title={locks[index] ? "Unlock" : "Lock"}
                          >
                            {locks[index] ? <Lock size={12} /> : <Unlock size={12} />}
                          </span>
                          <span
                            className="p-1.5 rounded-full"
                            style={{ backgroundColor: `${tc}22`, color: tc }}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeColor(index);
                            }}
                            role="button"
                            title="Remove"
                          >
                            <X size={12} />
                          </span>
                        </span>

                        {locks[index] && (
                          <span
                            className="absolute top-3 left-1/2 -translate-x-1/2 group-hover/color:hidden"
                            style={{ color: tc }}
                          >
                            <Lock size={12} />
                          </span>
                        )}

                        <div className="pointer-events-none px-2 text-center max-w-full">
                          <span
                            className="block text-[11px] font-medium opacity-70 truncate"
                            style={{ color: tc }}
                          >
                            {getColorName(color)}
                          </span>
                          <span
                            className="block text-sm sm:text-base font-mono font-semibold tracking-wide truncate"
                            style={{ color: tc }}
                          >
                            {copiedId === `hex-${index}` ? "Copied!" : color.toUpperCase()}
                          </span>
                        </div>

                        <label
                          className="absolute inset-0 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => updateColor(index, e.target.value)}
                            className="opacity-0 w-full h-full cursor-pointer"
                            aria-label={`Edit color ${color}`}
                          />
                        </label>

                        <span
                          className="absolute bottom-3 right-2 opacity-0 group-hover/color:opacity-100 transition-opacity p-1.5 rounded-full pointer-events-none"
                          style={{ backgroundColor: `${tc}22`, color: tc }}
                          title="Copy hex"
                        >
                          {copiedId === `hex-${index}` ? <Check size={12} /> : <Copy size={12} />}
                        </span>
                      </button>

                      {index < colors.length - 1 && (
                        <button
                          type="button"
                          onClick={() => insertColor(index + 1)}
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:scale-110 transition-all opacity-0 group-hover/color:opacity-100"
                          title="Insert color"
                          disabled={colors.length >= 10}
                        >
                          <Plus size={14} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {colors.length < 10 && (
                <button
                  type="button"
                  onClick={addColor}
                  className="absolute right-3 bottom-3 z-10 w-8 h-8 rounded-full bg-card/90 border border-border shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:scale-105 transition-all"
                  title="Add color"
                >
                  <Plus size={15} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
              <div className="flex flex-col gap-4 min-w-0">
                <div className="rounded-xl border border-border bg-muted/40 p-3.5">
                  <div className="flex items-center justify-between mb-2.5">
                    <SectionLabel className="!mb-0 !text-[11px] uppercase tracking-wide">
                      Selected
                    </SectionLabel>
                    <span className="text-[11px] text-muted-foreground">
                      {selected + 1} / {colors.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl border border-border shadow-sm shrink-0"
                      style={{ backgroundColor: selectedColor }}
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {getColorName(selectedColor)}
                      </div>
                      <div className="text-[11px] font-mono text-muted-foreground">
                        {selectedColor.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <ColorField
                      label="HEX"
                      value={selectedColor.toUpperCase()}
                      compact
                      copied={copiedId === "sel-hex"}
                      onCopy={() => handleCopy("sel-hex", selectedColor)}
                    />
                    <ColorField
                      label="RGB"
                      value={rgbStr}
                      compact
                      copied={copiedId === "sel-rgb"}
                      onCopy={() => handleCopy("sel-rgb", rgbStr)}
                    />
                    <ColorField
                      label="HSL"
                      value={hslStr}
                      compact
                      copied={copiedId === "sel-hsl"}
                      onCopy={() => handleCopy("sel-hsl", hslStr)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/40">
                  <div
                    className="w-10 h-10 rounded-xl border border-border shrink-0"
                    style={{ backgroundColor: avg }}
                  />
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
                      Average
                    </div>
                    <div className="text-sm font-mono font-bold text-foreground">
                      {avg.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Presets
                    </span>
                    <button
                      onClick={() => setShowAllPresets(!showAllPresets)}
                      className="text-[11px] text-muted-foreground hover:text-foreground"
                    >
                      {showAllPresets ? "Less" : "All"}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {colorPresets.map((preset, i) => (
                      <button
                        key={i}
                        onClick={() => loadPreset(preset)}
                        className="flex h-8 rounded-lg overflow-hidden border border-border hover:scale-[1.03] hover:border-foreground/30 transition-all"
                        title="Load preset"
                      >
                        {preset.map((c, j) => (
                          <div key={j} className="flex-1 h-full" style={{ backgroundColor: c }} />
                        ))}
                      </button>
                    ))}
                  </div>
                  {showAllPresets && (
                    <div className="mt-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground block mb-1.5">
                        Named
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {Object.entries(PRESET_PALETTES).map(([paletteName, preset]) => (
                          <button
                            key={paletteName}
                            onClick={() => loadPreset(preset)}
                            className="flex h-8 rounded-lg overflow-hidden border border-border hover:scale-[1.03] hover:border-foreground/30 transition-all"
                            title={paletteName}
                          >
                            {preset.map((c, j) => (
                              <div key={j} className="flex-1 h-full" style={{ backgroundColor: c }} />
                            ))}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col min-w-0 min-h-0">
                <div className="flex gap-1 mb-3">
                  {previewTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.value}
                        onClick={() => setPreviewTab(tab.value)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          previewTab === tab.value
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon size={13} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
                  {previewTab === "strip" && (
                    <>
                      <div
                        className="flex gap-0 rounded-xl overflow-hidden border border-border shadow-sm h-24"
                        style={{ background: `linear-gradient(to right, ${colors.join(", ")})` }}
                      />
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {colors.map((color, index) => (
                          <button
                            key={index}
                            onClick={() => setSelected(index)}
                            className={`rounded-xl border p-3 text-left transition-all shadow-sm ${
                              selected === index
                                ? "border-foreground ring-2 ring-foreground/20"
                                : "border-border hover:border-foreground/30"
                            }`}
                            style={{ backgroundColor: color }}
                          >
                            <span
                              className="text-[11px] font-mono font-bold block truncate"
                              style={{ color: onColor(color) }}
                            >
                              {color.toUpperCase()}
                            </span>
                            <span
                              className="text-[10px] block mt-0.5 truncate opacity-75"
                              style={{ color: onColor(color) }}
                            >
                              {getColorName(color)}
                            </span>
                          </button>
                        ))}
                      </div>
                      <div className="rounded-xl border border-border p-4 flex items-center gap-4 shadow-sm bg-card">
                        <div
                          className="w-14 h-14 rounded-xl shrink-0 border border-border"
                          style={{ backgroundColor: avg }}
                        />
                        <div>
                          <span className="text-[10px] text-muted-foreground uppercase block mb-0.5 font-semibold">
                            Average Color
                          </span>
                          <span className="text-sm font-mono font-bold text-foreground">
                            {avg.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {previewTab === "gradient" && (
                    <>
                      <div
                        className="rounded-xl overflow-hidden border border-border shadow-sm h-28"
                        style={{ background: `linear-gradient(to right, ${colors.join(", ")})` }}
                      />
                      <div
                        className="rounded-xl overflow-hidden border border-border shadow-sm h-28"
                        style={{ background: `linear-gradient(135deg, ${colors.join(", ")})` }}
                      />
                      <div
                        className="rounded-xl overflow-hidden border border-border shadow-sm h-28"
                        style={{ background: `radial-gradient(circle, ${colors.join(", ")})` }}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <div
                          className="rounded-xl overflow-hidden border border-border shadow-sm h-24"
                          style={{ background: `linear-gradient(to bottom, ${colors.join(", ")})` }}
                        />
                        <div
                          className="rounded-xl overflow-hidden border border-border shadow-sm h-24"
                          style={{ background: `conic-gradient(from 0deg, ${colors.join(", ")})` }}
                        />
                      </div>
                    </>
                  )}

                  {previewTab === "card" && (
                    <>
                      <div className="rounded-2xl border border-border overflow-hidden shadow-sm">
                        <div
                          className="h-24 flex"
                          style={{
                            background: `linear-gradient(135deg, ${colors[0]}, ${colors[1] || colors[0]})`,
                          }}
                        />
                        <div className="p-4 bg-card">
                          <div
                            className="h-3 rounded-full mb-2"
                            style={{ backgroundColor: colors[0], width: "60%" }}
                          />
                          <div className="h-2 rounded-full bg-muted mb-1" style={{ width: "90%" }} />
                          <div className="h-2 rounded-full bg-muted" style={{ width: "70%" }} />
                          <div className="flex gap-2 mt-3">
                            {colors.slice(0, 4).map((c, i) => (
                              <div
                                key={i}
                                className="w-8 h-8 rounded-lg shadow-sm"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div
                        className="rounded-2xl border border-border overflow-hidden shadow-sm p-5"
                        style={{
                          background: `linear-gradient(135deg, ${colors[0]}, ${colors[colors.length - 1]})`,
                        }}
                      >
                        <div
                          className="h-4 rounded-full mb-3"
                          style={{
                            backgroundColor: `${onColor(colors[0])}30`,
                            width: "50%",
                          }}
                        />
                        <div
                          className="h-2 rounded-full mb-1.5"
                          style={{
                            backgroundColor: `${onColor(colors[0])}20`,
                            width: "80%",
                          }}
                        />
                        <div
                          className="h-2 rounded-full"
                          style={{
                            backgroundColor: `${onColor(colors[0])}20`,
                            width: "60%",
                          }}
                        />
                        <div className="flex gap-2 mt-4">
                          <div
                            className="px-4 py-1.5 rounded-full text-[10px] font-medium"
                            style={{
                              backgroundColor: colors[1] || colors[0],
                              color: onColor(colors[1] || colors[0]),
                            }}
                          >
                            Button
                          </div>
                          <div
                            className="px-4 py-1.5 rounded-full text-[10px] font-medium border"
                            style={{
                              borderColor: `${onColor(colors[0])}40`,
                              color: onColor(colors[0]),
                            }}
                          >
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
                            <div
                              className="w-8 h-8 rounded-full"
                              style={{ backgroundColor: colors[0] }}
                            />
                            <div>
                              <div className="h-2 rounded-full bg-muted" style={{ width: "80px" }} />
                              <div
                                className="h-1.5 rounded-full bg-muted/50 mt-1"
                                style={{ width: "50px" }}
                              />
                            </div>
                          </div>
                          <div className="h-2 rounded-full bg-muted mb-1" style={{ width: "100%" }} />
                          <div className="h-2 rounded-full bg-muted mb-1" style={{ width: "95%" }} />
                          <div className="h-2 rounded-full bg-muted" style={{ width: "40%" }} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
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
        initialName={name}
      />
    </div>
  );
};

export default CreatePalette;
