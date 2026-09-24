import { useState, useCallback, useRef, useMemo } from "react";
import {
  Plus,
  Trash2,
  ArrowLeftRight,
  Download,
  Heart,
  Shuffle,
  Repeat,
  Copy,
  Check,
  Layers,
} from "lucide-react";
import ExportPaletteModal from "../components/modals/ExportPaletteModal";
import SaveItemModal from "../components/modals/SaveItemModal";
import Button from "../components/atoms/Button";
import IconButton from "../components/atoms/IconButton";
import ToolCard from "../components/templates/ToolCard";
import CodeBlock from "../components/atoms/CodeBlock";
import SectionLabel from "../components/atoms/SectionLabel";
import { hexToRgb } from "../utils/ColorMath";

interface Stop {
  color: string;
  position: number;
}

const presetCategories = [
  {
    name: "Warm",
    presets: [
      { name: "Sunset", colors: ["#ff6b35", "#f7931a", "#ffd700"] },
      { name: "Fire", colors: ["#ff0000", "#ff4500", "#ff8c00"] },
      { name: "Peach", colors: ["#ff9a76", "#ffeaa7", "#fdcb6e"] },
      { name: "Amber", colors: ["#f59e0b", "#d97706", "#b45309"] },
      { name: "Rose", colors: ["#f43f5e", "#fb7185", "#fda4af"] },
    ],
  },
  {
    name: "Cool",
    presets: [
      { name: "Ocean", colors: ["#0077be", "#00a9ce", "#00d4ff"] },
      { name: "Ice", colors: ["#a8edea", "#fed6e3", "#d4fc79"] },
      { name: "Frost", colors: ["#667eea", "#764ba2", "#6B73FF"] },
      { name: "Arctic", colors: ["#00d2ff", "#3a7bd5", "#00d2ff"] },
      { name: "Steel", colors: ["#636e72", "#b2bec3", "#dfe6e9"] },
    ],
  },
  {
    name: "Nature",
    presets: [
      { name: "Forest", colors: ["#228b22", "#32cd32", "#90ee90"] },
      { name: "Earth", colors: ["#8B4513", "#D2691E", "#DEB887"] },
      { name: "Sky", colors: ["#87ceeb", "#add8e6", "#e0ffff"] },
      { name: "Moss", colors: ["#8fbc8f", "#3cb371", "#2e8b57"] },
      { name: "Sand", colors: ["#f4d03f", "#f5b041", "#eb984e"] },
    ],
  },
  {
    name: "Neon",
    presets: [
      { name: "Electric", colors: ["#f02fc2", "#6053ff", "#60efff"] },
      { name: "Toxic", colors: ["#00ff87", "#60efff", "#00ff87"] },
      { name: "Synthwave", colors: ["#ff00ff", "#00ffff", "#ff00ff"] },
      { name: "Cyber", colors: ["#00f5ff", "#0080ff", "#8000ff"] },
      { name: "Pulse", colors: ["#ff006e", "#8338ec", "#3a86ff"] },
    ],
  },
  {
    name: "Pastel",
    presets: [
      { name: "Dream", colors: ["#a18cd1", "#fbc2eb", "#a6c1ee"] },
      { name: "Candy", colors: ["#ff9a9e", "#fecfef", "#fdfcfb"] },
      { name: "Lavender", colors: ["#e6e6fa", "#d8bfd8", "#dda0dd"] },
      { name: "Mint", colors: ["#98fb98", "#90ee90", "#b0e0e6"] },
      { name: "Blush", colors: ["#ffcccc", "#ffe0cc", "#fff0cc"] },
    ],
  },
  {
    name: "Mono",
    presets: [
      { name: "Charcoal", colors: ["#2c3e50", "#4ca1af", "#c4e0e5"] },
      { name: "Silver", colors: ["#bdc3c7", "#ecf0f1", "#bdc3c7"] },
      { name: "Graphite", colors: ["#333333", "#555555", "#777777"] },
      { name: "Pearl", colors: ["#f0f0f0", "#e0e0e0", "#d0d0d0"] },
      { name: "Slate", colors: ["#708090", "#2f4f4f", "#000000"] },
    ],
  },
];

const randomGradients = [
  ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3"],
  ["#0abde3", "#10ac84", "#ff9f43", "#ee5a24"],
  ["#5f27cd", "#341f97", "#22a6b3", "#7ed6df"],
  ["#f9ca24", "#f0932b", "#eb4d4b", "#6ab04c"],
  ["#6c5ce7", "#a29bfe", "#fd79a8", "#e84393"],
  ["#00b894", "#00cec9", "#0984e3", "#6c5ce7"],
  ["#fdcb6e", "#e17055", "#d63031", "#e84393"],
  ["#55a3f0", "#7b68ee", "#9b59b6", "#8e44ad"],
];

const angleChips = [
  { deg: 0, label: "↑" },
  { deg: 45, label: "↗" },
  { deg: 90, label: "→" },
  { deg: 135, label: "↘" },
  { deg: 180, label: "↓" },
  { deg: 225, label: "↙" },
  { deg: 270, label: "←" },
  { deg: 315, label: "↖" },
];

const toHex = (r: number, g: number, b: number) =>
  `#${[r, g, b]
    .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
    .join("")}`;

const colorAtPosition = (stops: Stop[], pos: number): string => {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  if (sorted.length === 0) return "#888888";
  if (pos <= sorted[0].position) return sorted[0].color;
  const last = sorted[sorted.length - 1];
  if (pos >= last.position) return last.color;
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (pos >= a.position && pos <= b.position) {
      const span = b.position - a.position || 1;
      const t = (pos - a.position) / span;
      const c1 = hexToRgb(a.color);
      const c2 = hexToRgb(b.color);
      return toHex(
        c1.r + (c2.r - c1.r) * t,
        c1.g + (c2.g - c1.g) * t,
        c1.b + (c2.b - c1.b) * t
      );
    }
  }
  return "#888888";
};

const GradientMaker = () => {
  const [stops, setStops] = useState<Stop[]>([
    { color: "#667eea", position: 0 },
    { color: "#764ba2", position: 100 },
  ]);
  const [gradientType, setGradientType] = useState<"linear" | "radial" | "conic">("linear");
  const [angle, setAngle] = useState(135);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [repeat, setRepeat] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [activeStop, setActiveStop] = useState<number | null>(0);
  const [copiedCss, setCopiedCss] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [stage, setStage] = useState<"light" | "dark" | "check">("light");
  const railRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const dragIndexRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);

  const gradientCSS = useMemo(() => {
    const stopsStr = stops.map((s) => `${s.color} ${s.position}%`).join(", ");
    const prefix = repeat ? "repeating-" : "";
    if (gradientType === "linear") return `${prefix}linear-gradient(${angle}deg, ${stopsStr})`;
    if (gradientType === "radial")
      return `${prefix}radial-gradient(circle at ${position.x}% ${position.y}%, ${stopsStr})`;
    return `${prefix}conic-gradient(from ${angle}deg at ${position.x}% ${position.y}%, ${stopsStr})`;
  }, [stops, gradientType, angle, position, repeat]);

  const railCSS = useMemo(() => {
    const stopsStr = [...stops]
      .sort((a, b) => a.position - b.position)
      .map((s) => `${s.color} ${s.position}%`)
      .join(", ");
    return `linear-gradient(to right, ${stopsStr})`;
  }, [stops]);

  const exportColors = stops.map((s) => s.color);
  const cssCode = `background: ${gradientCSS};`;

  const posFromClientX = useCallback((clientX: number) => {
    if (!railRef.current) return 0;
    const rect = railRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)));
  }, []);

  const addStopAt = useCallback(
    (pos: number) => {
      const color = colorAtPosition(stops, pos);
      const next = [...stops, { color, position: pos }].sort((a, b) => a.position - b.position);
      setStops(next);
      setActiveStop(next.findIndex((s) => s.position === pos && s.color === color));
    },
    [stops]
  );

  const removeStop = (index: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, i) => i !== index));
    if (activeStop === index) setActiveStop(null);
    else if (activeStop !== null && activeStop > index) setActiveStop(activeStop - 1);
  };

  const updateStopColor = (index: number, color: string) => {
    setStops(stops.map((s, i) => (i === index ? { ...s, color } : s)));
  };

  const updateStopPosition = (index: number, nextPos: number) => {
    if (!Number.isFinite(nextPos)) return;
    const clamped = Math.max(0, Math.min(100, nextPos));
    setStops(stops.map((s, i) => (i === index ? { ...s, position: clamped } : s)));
  };

  const handleHexInput = (index: number, value: string) => {
    const next = value.startsWith("#") ? value : `#${value}`;
    updateStopColor(index, next);
  };

  const reverseStops = () => {
    setStops(stops.map((s) => ({ ...s, position: 100 - s.position })).reverse());
  };

  const randomize = () => {
    const pool = randomGradients[Math.floor(Math.random() * randomGradients.length)];
    setStops(
      pool.map((color, i) => ({
        color,
        position: Math.round((i / (pool.length - 1)) * 100),
      }))
    );
    setAngle(Math.floor(Math.random() * 360));
    setActiveStop(0);
  };

  const loadPreset = (colors: string[]) => {
    setStops(
      colors.map((color, i) => ({
        color,
        position: Math.round((i / (colors.length - 1)) * 100),
      }))
    );
    setActiveStop(0);
  };

  const addMidStop = () => {
    const avg = Math.round(stops.reduce((a, s) => a + s.position, 0) / stops.length);
    addStopAt(avg);
  };

  const copyCss = () => {
    navigator.clipboard.writeText(cssCode);
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 1500);
  };

  const startDrag = (index: number, e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveStop(index);
    dragIndexRef.current = index;
    suppressClickRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onDragMove = (e: React.PointerEvent) => {
    const index = dragIndexRef.current;
    if (index === null) return;
    updateStopPosition(index, posFromClientX(e.clientX));
  };

  const endDrag = (index: number) => {
    if (dragIndexRef.current === null) return;
    dragIndexRef.current = null;
    const moved = stops[index];
    if (!moved) return;
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    setStops(sorted);
    const newIdx = sorted.findIndex((s) => s.color === moved.color && s.position === moved.position);
    setActiveStop(newIdx >= 0 ? newIdx : null);
    setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  const onRailClick = (e: React.MouseEvent) => {
    if (suppressClickRef.current) return;
    addStopAt(posFromClientX(e.clientX));
  };

  const onPreviewPointerDown = (e: React.PointerEvent) => {
    if (gradientType === "linear") return;
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    setPosition({
      x: Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100))),
      y: Math.max(0, Math.min(100, Math.round(((e.clientY - rect.top) / rect.height) * 100))),
    });
  };

  const stageClass =
    stage === "dark"
      ? "bg-zinc-950"
      : stage === "check"
        ? "bg-[length:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0px] bg-[image:linear-gradient(45deg,#e5e5e5_25%,transparent_25%),linear-gradient(-45deg,#e5e5e5_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e5e5e5_75%),linear-gradient(-45deg,transparent_75%,#e5e5e5_75%)]"
        : "bg-white";

  const selected = activeStop !== null ? stops[activeStop] : null;

  return (
    <div className="flex-1 flex flex-col">
      <div className="text-center mt-8 mb-4 md:mb-6 px-4">
        <h1 className="text-[28px] md:text-[42px] font-medium text-foreground tracking-tight leading-tight">
          Gradient Maker
        </h1>
        <p className="mt-2 text-muted-foreground text-lg">
          Design CSS gradients with multiple stops, presets, and live preview.
        </p>
      </div>

      <ToolCard noMaximize className="max-w-[1100px]">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex gap-1 bg-muted/60 rounded-xl p-1">
              {(["linear", "radial", "conic"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setGradientType(type)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    gradientType === type
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <IconButton
                size="sm"
                onClick={reverseStops}
                title="Reverse stops"
              >
                <ArrowLeftRight size={14} />
              </IconButton>
              <IconButton size="sm" onClick={randomize} title="Random gradient">
                <Shuffle size={14} />
              </IconButton>
              <button
                onClick={() => setRepeat(!repeat)}
                className={`flex items-center gap-1.5 px-2.5 h-8 rounded-full text-xs font-medium transition-colors ${
                  repeat
                    ? "bg-foreground text-background"
                    : "border border-border bg-card/60 text-muted-foreground hover:text-foreground"
                }`}
                title="Toggle repeat gradient"
              >
                <Repeat size={12} />
                Repeat
              </button>
              <div className="flex gap-1 bg-muted/60 rounded-xl p-1 ml-1">
                {(["light", "dark", "check"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStage(s)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      stage === s
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title={`${s} stage`}
                  >
                    {s === "check" ? "Grid" : s === "light" ? "Light" : "Dark"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            ref={previewRef}
            onPointerDown={onPreviewPointerDown}
            className={`relative w-full h-[240px] sm:h-[300px] rounded-2xl overflow-hidden border border-border shadow-sm ${stageClass} ${
              gradientType === "linear" ? "cursor-default" : "cursor-crosshair"
            }`}
          >
            <div className="absolute inset-0" style={{ background: gradientCSS }} />
            {gradientType !== "linear" && (
              <div
                className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  backgroundColor: stops[0]?.color || "#667eea",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                }}
              />
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-foreground">Color stops</span>
              <span className="text-[11px] text-muted-foreground">
                Click rail to add · Drag handles to move
              </span>
            </div>

            <div
              ref={railRef}
              onClick={onRailClick}
              className="relative h-12 rounded-xl cursor-crosshair select-none touch-none"
            >
              <div className="absolute inset-x-0 top-3.5 h-5 rounded-full border border-border shadow-sm overflow-hidden">
                <div className="w-full h-full" style={{ background: railCSS }} />
              </div>

              {stops.map((stop, index) => (
                <div
                  key={`${stop.color}-${index}-${stop.position}`}
                  role="slider"
                  aria-label={`Color stop ${index + 1}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={stop.position}
                  tabIndex={0}
                  onPointerDown={(e) => startDrag(index, e)}
                  onPointerMove={onDragMove}
                  onPointerUp={() => endDrag(index)}
                  onPointerCancel={() => endDrag(index)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                      e.preventDefault();
                      const delta = e.key === "ArrowLeft" ? -1 : 1;
                      const step = e.shiftKey ? 5 : 1;
                      updateStopPosition(index, stop.position + delta * step);
                      setActiveStop(index);
                    }
                    if (e.key === "Delete" || e.key === "Backspace") {
                      e.preventDefault();
                      removeStop(index);
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveStop(index);
                  }}
                  className={`absolute top-1.5 w-9 h-9 -translate-x-1/2 flex items-center justify-center rounded-full cursor-grab active:cursor-grabbing focus:outline-none ${
                    activeStop === index ? "z-20" : "z-10"
                  }`}
                  style={{ left: `${stop.position}%` }}
                >
                  <span
                    className={`block w-6 h-6 rounded-full border-[2.5px] border-white transition-transform ${
                      activeStop === index ? "scale-110 ring-2 ring-foreground/40" : "hover:scale-105"
                    }`}
                    style={{
                      backgroundColor: stop.color,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-muted/50 border border-border min-h-[52px]">
              {selected && activeStop !== null ? (
                <>
                  <label className="relative w-9 h-9 rounded-lg overflow-hidden border border-border shrink-0 cursor-pointer">
                    <span
                      className="absolute inset-0"
                      style={{ backgroundColor: selected.color }}
                    />
                    <input
                      type="color"
                      value={selected.color}
                      onChange={(e) => updateStopColor(activeStop, e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </label>
                  <input
                    type="text"
                    value={selected.color}
                    onChange={(e) => handleHexInput(activeStop, e.target.value)}
                    className="w-24 border border-border rounded-lg px-2.5 py-1.5 text-xs font-mono bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
                    aria-label="Hex color"
                  />
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={selected.position}
                      onChange={(e) => updateStopPosition(activeStop, Number(e.target.value))}
                      className="flex-1 h-1.5 min-w-0 rounded-full appearance-none cursor-pointer bg-border"
                      aria-label="Stop position"
                    />
                    <div className="flex items-center gap-0.5 shrink-0">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={selected.position}
                        onChange={(e) => updateStopPosition(activeStop, parseInt(e.target.value, 10))}
                        className="w-14 border border-border rounded-lg px-2 py-1.5 text-xs text-center bg-card text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-foreground/10"
                        aria-label="Position percent"
                      />
                      <span className="text-[11px] text-muted-foreground">%</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addMidStop}
                    icon={<Plus size={13} />}
                  >
                    Add
                  </Button>
                  <IconButton
                    size="sm"
                    onClick={() => removeStop(activeStop)}
                    disabled={stops.length <= 2}
                    title="Remove stop"
                    className="hover:text-danger"
                  >
                    <Trash2 size={14} />
                  </IconButton>
                </>
              ) : (
                <>
                  <span className="text-xs text-muted-foreground px-1">
                    Select a stop to edit color and position
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addMidStop}
                    icon={<Plus size={13} />}
                    className="ml-auto"
                  >
                    Add stop
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-muted/40 p-3.5">
              <SectionLabel className="!mb-2 !text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
                {gradientType === "linear" ? "Direction" : "Center"}
              </SectionLabel>

              {gradientType === "linear" ? (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {angleChips.map((chip) => (
                      <button
                        key={chip.deg}
                        onClick={() => setAngle(chip.deg)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors border ${
                          angle === chip.deg
                            ? "bg-foreground text-background border-foreground"
                            : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                        }`}
                        title={`${chip.deg}deg`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-10">Angle</span>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={angle}
                      onChange={(e) => setAngle(Number(e.target.value))}
                      className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer bg-border"
                      aria-label="Angle"
                    />
                    <div className="flex items-center gap-0.5">
                      <input
                        type="number"
                        min={0}
                        max={360}
                        value={angle}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          if (Number.isFinite(v)) setAngle(Math.max(0, Math.min(360, v)));
                        }}
                        className="w-14 border border-border rounded-lg px-2 py-1.5 text-xs text-center bg-card text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-foreground/10"
                        aria-label="Angle degrees"
                      />
                      <span className="text-[11px] text-muted-foreground">deg</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="grid grid-cols-3 gap-1.5 shrink-0">
                    {[
                      { x: 0, y: 0 },
                      { x: 50, y: 0 },
                      { x: 100, y: 0 },
                      { x: 0, y: 50 },
                      { x: 50, y: 50 },
                      { x: 100, y: 50 },
                      { x: 0, y: 100 },
                      { x: 50, y: 100 },
                      { x: 100, y: 100 },
                    ].map((cell) => {
                      const active =
                        Math.abs(position.x - cell.x) < 8 &&
                        Math.abs(position.y - cell.y) < 8;
                      return (
                        <button
                          key={`${cell.x}-${cell.y}`}
                          onClick={() => setPosition(cell)}
                          className={`w-8 h-8 rounded-md border transition-colors ${
                            active
                              ? "bg-foreground border-foreground"
                              : "bg-card border-border hover:border-foreground/40"
                          }`}
                          title={`${cell.x}% ${cell.y}%`}
                          aria-label={`Center ${cell.x} ${cell.y}`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex flex-col gap-2 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">X</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={position.x}
                        onChange={(e) => setPosition({ ...position, x: Number(e.target.value) })}
                        className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer bg-border"
                        aria-label="Center X"
                      />
                      <span className="text-[11px] font-mono text-foreground w-8 text-right">
                        {position.x}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">Y</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={position.y}
                        onChange={(e) => setPosition({ ...position, y: Number(e.target.value) })}
                        className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer bg-border"
                        aria-label="Center Y"
                      />
                      <span className="text-[11px] font-mono text-foreground w-8 text-right">
                        {position.y}%
                      </span>
                    </div>
                    {gradientType === "conic" && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-4">R</span>
                        <input
                          type="range"
                          min={0}
                          max={360}
                          value={angle}
                          onChange={(e) => setAngle(Number(e.target.value))}
                          className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer bg-border"
                          aria-label="Rotation"
                        />
                        <span className="text-[11px] font-mono text-foreground w-8 text-right">
                          {angle}°
                        </span>
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground">Click preview to move center</p>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-3.5 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
                  CSS
                </span>
                <button
                  onClick={copyCss}
                  className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedCss ? <Check size={12} /> : <Copy size={12} />}
                  {copiedCss ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl overflow-hidden border border-border flex-1 min-h-[88px]">
                <CodeBlock code={cssCode} language="css" />
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsExportOpen(true)}
                  icon={<Download size={13} />}
                  fullWidth
                >
                  Export
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsSaveModalOpen(true)}
                  icon={<Heart size={13} />}
                  fullWidth
                >
                  Save
                </Button>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers size={13} className="text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">Presets</span>
              <div className="flex gap-1 ml-2 flex-wrap">
                {presetCategories.map((cat, i) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(i)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      activeCategory === i
                        ? "bg-foreground text-background"
                        : "bg-muted/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-0.5 px-0.5">
              {presetCategories[activeCategory].presets.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => loadPreset(preset.colors)}
                  className="group shrink-0 w-[104px] text-left"
                >
                  <div
                    className="h-14 rounded-xl overflow-hidden border border-border group-hover:scale-[1.03] group-hover:border-foreground/30 transition-all shadow-sm"
                    style={{
                      background: `linear-gradient(to right, ${preset.colors.join(", ")})`,
                    }}
                  />
                  <span className="block mt-1 text-[11px] text-muted-foreground group-hover:text-foreground transition-colors truncate">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </ToolCard>

      <ExportPaletteModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        colors={exportColors}
      />

      <SaveItemModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        type="gradient"
        data={stops.map((s) => s.color)}
      />
    </div>
  );
};

export default GradientMaker;
