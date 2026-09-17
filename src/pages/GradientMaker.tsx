import { useState, useCallback, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
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
  RotateCw,
  Layers,
} from "lucide-react";
import { isValidHex } from "../utils/ColorMath";
import ExportPaletteModal from "../components/modals/ExportPaletteModal";
import SaveItemModal from "../components/modals/SaveItemModal";
import Button from "../components/atoms/Button";
import ToolCard from "../components/templates/ToolCard";
import CodeBlock from "../components/atoms/CodeBlock";

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

const GradientMaker = () => {
  const { id } = useParams();

  const initialStops: Stop[] = id
    ? decodeURIComponent(id)
        .split("-")
        .map((c, i, arr) => ({
          color: c.startsWith("#") ? c : `#${c}`,
          position: Math.round((i / (arr.length - 1)) * 100),
        }))
    : [
        { color: "#667eea", position: 0 },
        { color: "#764ba2", position: 100 },
      ];

  const [stops, setStops] = useState<Stop[]>(initialStops);
  const [gradientType, setGradientType] = useState<"linear" | "radial" | "conic">("linear");
  const [angle, setAngle] = useState(135);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [repeat, setRepeat] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [activeStop, setActiveStop] = useState<number | null>(null);
  const [copiedCss, setCopiedCss] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const gradientBarRef = useRef<HTMLDivElement>(null);

  const gradientCSS = useMemo(() => {
    const stopsStr = stops.map((s) => `${s.color} ${s.position}%`).join(", ");
    const prefix = repeat ? "repeating-" : "";
    if (gradientType === "linear") return `${prefix}linear-gradient(${angle}deg, ${stopsStr})`;
    if (gradientType === "radial")
      return `${prefix}radial-gradient(circle at ${position.x}% ${position.y}%, ${stopsStr})`;
    return `${prefix}conic-gradient(from ${angle}deg at ${position.x}% ${position.y}%, ${stopsStr})`;
  }, [stops, gradientType, angle, position, repeat]);

  const exportColors = stops.map((s) => s.color);

  const addStop = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!gradientBarRef.current) return;
      const rect = gradientBarRef.current.getBoundingClientRect();
      const pos = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      const newStops = [...stops, { color: "#888888", position: pos }];
      newStops.sort((a, b) => a.position - b.position);
      setStops(newStops);
      setActiveStop(newStops.findIndex((s) => s.position === pos && s.color === "#888888"));
    },
    [stops]
  );

  const removeStop = (index: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, i) => i !== index));
    if (activeStop === index) setActiveStop(null);
  };

  const updateStopColor = (index: number, color: string) => {
    const newStops = [...stops];
    newStops[index].color = color;
    setStops(newStops);
  };

  const updateStopPosition = (index: number, position: number) => {
    const newStops = [...stops];
    newStops[index].position = Math.max(0, Math.min(100, position));
    setStops(newStops);
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
    setActiveStop(null);
  };

  const loadPreset = (colors: string[]) => {
    setStops(
      colors.map((color, i) => ({
        color,
        position: Math.round((i / (colors.length - 1)) * 100),
      }))
    );
    setActiveStop(null);
  };

  const handleHexInput = (index: number, value: string) => {
    if (isValidHex(value)) {
      updateStopColor(index, value);
    }
  };

  const copyCss = () => {
    navigator.clipboard.writeText(`background: ${gradientCSS};`);
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 1500);
  };

  const cssCode = `background: ${gradientCSS};`;

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

      <ToolCard noMaximize className="max-w-[1050px]">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Left Column - Controls */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            {/* Gradient Type + Actions Row */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex gap-1 bg-muted/60 rounded-xl p-1">
                {(["linear", "radial", "conic"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setGradientType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      gradientType === type
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-border" />

              <button
                onClick={() => setRepeat(!repeat)}
                className={`flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-xs font-medium transition-colors ${
                  repeat
                    ? "bg-foreground text-card"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground"
                }`}
                title="Toggle repeat gradient"
              >
                <Repeat size={12} />
                <span className="hidden sm:inline">Repeat</span>
              </button>

              <button
                onClick={reverseStops}
                className="flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-xs font-medium bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                title="Reverse stops"
              >
                <ArrowLeftRight size={12} />
                <span className="hidden sm:inline">Reverse</span>
              </button>

              <button
                onClick={randomize}
                className="flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-xs font-medium bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                title="Random gradient"
              >
                <Shuffle size={12} />
                <span className="hidden sm:inline">Random</span>
              </button>
            </div>

            {/* Gradient Bar */}
            <div className="relative">
              <div
                ref={gradientBarRef}
                className="relative w-full h-[160px] rounded-2xl cursor-crosshair overflow-hidden border border-border shadow-sm"
                onClick={addStop}
              >
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: gradientCSS }}
                />
                {/* Checkerboard pattern behind for transparency visualization */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                    backgroundSize: "16px 16px",
                    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                    opacity: 0,
                  }}
                />
                {stops.map((stop, index) => (
                  <div
                    key={index}
                    className="absolute w-5 h-5 rounded-full border-[2.5px] border-white cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
                    style={{
                      left: `calc(${stop.position}% - 10px)`,
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: stop.color,
                      boxShadow:
                        "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveStop(activeStop === index ? null : index);
                    }}
                  >
                    {activeStop === index && (
                      <div className="absolute -top-28 left-1/2 -translate-x-1/2 bg-card border border-border rounded-xl p-3 shadow-xl w-48 z-30">
                        <input
                          type="color"
                          value={stop.color}
                          onChange={(e) => updateStopColor(index, e.target.value)}
                          className="w-full h-8 rounded-lg cursor-pointer border border-border mb-2"
                        />
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={stop.color}
                            onChange={(e) => handleHexInput(index, e.target.value)}
                            className="flex-1 border border-border rounded-lg px-2 py-1 text-xs font-mono bg-card text-foreground"
                          />
                          <span className="text-xs text-muted-foreground flex items-center">
                            {stop.position}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={stop.position}
                          onChange={(e) =>
                            updateStopPosition(index, parseInt(e.target.value))
                          }
                          className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Angle / Position Controls */}
            <div className="bg-muted/50 rounded-xl p-3 border border-border">
              {gradientType === "linear" ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-12">Angle</span>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background:
                        "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                    }}
                  />
                  <span className="text-xs font-mono text-foreground w-12 text-right">
                    {angle}deg
                  </span>
                  <button
                    onClick={() => setAngle(0)}
                    className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    title="Reset to 0"
                  >
                    <RotateCw size={12} />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-12">
                      {gradientType === "conic" ? "Rotation" : "Angle"}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={angle}
                      onChange={(e) => setAngle(Number(e.target.value))}
                      className="flex-1 h-2 rounded-full appearance-none cursor-pointer bg-border"
                    />
                    <span className="text-xs font-mono text-foreground w-12 text-right">
                      {angle}deg
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-12">Center X</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={position.x}
                      onChange={(e) =>
                        setPosition({ ...position, x: Number(e.target.value) })
                      }
                      className="flex-1 h-2 rounded-full appearance-none cursor-pointer bg-border"
                    />
                    <span className="text-xs font-mono text-foreground w-12 text-right">
                      {position.x}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-12">Center Y</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={position.y}
                      onChange={(e) =>
                        setPosition({ ...position, y: Number(e.target.value) })
                      }
                      className="flex-1 h-2 rounded-full appearance-none cursor-pointer bg-border"
                    />
                    <span className="text-xs font-mono text-foreground w-12 text-right">
                      {position.y}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Color Stops */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground">
                  Color Stops
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Click bar to add
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {stops.map((stop, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors ${
                      activeStop === index ? "bg-muted" : "hover:bg-muted/50"
                    }`}
                  >
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) => updateStopColor(index, e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-border shrink-0"
                    />
                    <input
                      type="text"
                      value={stop.color}
                      onChange={(e) => handleHexInput(index, e.target.value)}
                      className="w-20 border border-border rounded-lg px-2.5 py-1.5 text-xs font-mono bg-card text-foreground"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={stop.position}
                        onChange={(e) =>
                          updateStopPosition(index, parseInt(e.target.value))
                        }
                        className="w-12 border border-border rounded-lg px-2 py-1.5 text-xs text-center bg-card text-foreground"
                      />
                      <span className="text-[10px] text-muted-foreground">%</span>
                    </div>
                    <button
                      onClick={() => removeStop(index)}
                      disabled={stops.length <= 2}
                      className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-muted"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const avg = Math.round(
                    stops.reduce((a, s) => a + s.position, 0) / stops.length
                  );
                  setStops([...stops, { color: "#888888", position: avg }]);
                }}
                icon={<Plus size={12} />}
                className="mt-1.5"
              >
                Add Stop
              </Button>
            </div>
          </div>

          {/* Right Column - Presets + Code + Actions */}
          <div className="flex-1 flex flex-col gap-4 min-w-0 lg:max-w-[420px]">
            {/* Presets */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Layers size={13} className="text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">Presets</span>
              </div>
              <div className="flex gap-1 mb-3 flex-wrap">
                {presetCategories.map((cat, i) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(i)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      activeCategory === i
                        ? "bg-foreground text-card"
                        : "bg-muted/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {presetCategories[activeCategory].presets.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => loadPreset(preset.colors)}
                    className="group flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full h-8 rounded-lg overflow-hidden border border-border group-hover:scale-105 transition-transform shadow-sm"
                      style={{
                        background: `linear-gradient(to right, ${preset.colors.join(", ")})`,
                      }}
                    />
                    <span className="text-[9px] text-muted-foreground group-hover:text-foreground transition-colors truncate w-full text-center">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* CSS Code Preview */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground">CSS Code</span>
                <button
                  onClick={copyCss}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedCss ? <Check size={11} /> : <Copy size={11} />}
                  {copiedCss ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl border border-border overflow-hidden">
                <CodeBlock code={cssCode} language="css" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-0.5">
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
      </ToolCard>

      <ExportPaletteModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        colors={exportColors}
      />

      <SaveItemModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        type="palette"
        data={stops.map((s) => s.color)}
      />
    </div>
  );
};

export default GradientMaker;
