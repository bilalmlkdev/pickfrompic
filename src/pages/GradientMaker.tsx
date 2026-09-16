import { useState, useCallback } from "react";
import { Check, Copy, Dices, Download, Pipette, Plus, Save, Trash2 } from "lucide-react";
import { isValidHex } from "../utils/ColorMath";
import SaveItemModal from "../components/modals/SaveItemModal";
import Button from "../components/atoms/Button";
import Dropdown from "../components/atoms/Dropdown";
import ToolCard from "../components/templates/ToolCard";

let colorIdCounter = 0;
const nextColorId = () => `color-${++colorIdCounter}`;

const randomHex = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");

const GradientMaker = () => {
  const [colors, setColors] = useState([
    { id: nextColorId(), hex: "#ff0000", pos: 0 },
    { id: nextColorId(), hex: "#0000ff", pos: 100 },
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [angle, setAngle] = useState(90);
  const [type, setType] = useState("Linear");
  const [paletteName, setPaletteName] = useState("New Gradient");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = useCallback((id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }, []);

  const gradientString =
    type === "Linear"
      ? `linear-gradient(${angle}deg, ${colors.map((c) => `${c.hex} ${c.pos}%`).join(", ")})`
      : `radial-gradient(circle, ${colors.map((c) => `${c.hex} ${c.pos}%`).join(", ")})`;

  const cssCode = `background: ${gradientString};`;
  const svgCode = (() => {
    const stops = colors
      .map((c) => `<stop offset="${c.pos}%" stop-color="${c.hex}"/>`)
      .join("\n    ");
    return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      ${stops}
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#gradient)"/>
</svg>`;
  })();

  const addColor = () => {
    const lastPos = colors[colors.length - 1]?.pos || 0;
    const newPos = Math.min(100, lastPos + 10);
    setColors([...colors, { id: nextColorId(), hex: randomHex(), pos: newPos }]);
    setSelectedIndex(colors.length);
  };

  const removeColor = (index: number) => {
    if (colors.length <= 2) return;
    const newColors = colors.filter((_, i) => i !== index);
    setColors(newColors);
    if (selectedIndex >= newColors.length) {
      setSelectedIndex(newColors.length - 1);
    } else if (selectedIndex > index) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const updateColorHex = (index: number, hex: string) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], hex };
    setColors(newColors);
  };

  const updateColorPos = (index: number, pos: number) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], pos: Math.max(0, Math.min(100, pos)) };
    setColors(newColors);
  };

  const randomize = () => {
    const count = colors.length;
    setColors(
      Array.from({ length: count }, (_, i) => ({
        id: nextColorId(),
        hex: randomHex(),
        pos: Math.round((i / (count - 1)) * 100),
      }))
    );
  };

  const pickFromScreen = async (index: number) => {
    if ("EyeDropper" in window) {
      try {
        // @ts-expect-error EyeDropper API not in TS lib types
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) updateColorHex(index, result.sRGBHex);
      } catch {
      }
    } else {
      alert("Your browser does not support the EyeDropper API.");
    }
  };

  const downloadSvg = () => {
    const blob = new Blob([svgCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gradient.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPng = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const grad =
      type === "Linear"
        ? ctx.createLinearGradient(0, 0, 800, 800)
        : ctx.createRadialGradient(400, 400, 0, 400, 400, 400);
    colors.forEach((c) => grad.addColorStop(c.pos / 100, c.hex));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 800);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "gradient.png";
    a.click();
  };

  return (
    <div className="flex-1 w-full py-6 px-4 mt-16">
      <div className="max-w-[780px] mx-auto mb-4">
        <h1 className="text-4xl font-medium text-center text-foreground mb-2">
          Gradient Maker
        </h1>
        <p className="text-center text-muted-foreground text-lg mb-4">
          Create, customize, and export beautiful gradients
        </p>
      </div>

      <ToolCard>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={paletteName}
                onChange={(e) => setPaletteName(e.target.value)}
                className="flex-1 border border-border rounded-lg px-3 py-2 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10"
              />
              <button
                onClick={randomize}
                className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                title="Randomize"
              >
                <Dices size={15} />
              </button>
            </div>

            <div className="space-y-2 mb-4 flex-1 overflow-y-auto">
              {colors.map((c, idx) => (
                <div
                  key={c.id}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                    selectedIndex === idx
                      ? "border-foreground bg-muted/50"
                      : "border-border bg-card/50"
                  }`}
                  onClick={() => setSelectedIndex(idx)}
                >
                  <div className="relative">
                    <input
                      type="color"
                      value={c.hex}
                      onChange={(e) => updateColorHex(idx, e.target.value)}
                      className="w-9 h-9 rounded-lg cursor-pointer border border-border"
                    />
                  </div>
                  <input
                    type="text"
                    value={c.hex}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (isValidHex(val)) updateColorHex(idx, val);
                      else if (val === "" || val === "#") updateColorHex(idx, val);
                    }}
                    className="w-20 border border-border rounded-lg px-2 py-1.5 bg-card text-foreground text-xs font-mono focus:outline-none"
                  />
                  <div className="flex-1">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={c.pos}
                      onChange={(e) => updateColorPos(idx, parseInt(e.target.value))}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-border"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right font-mono">
                    {c.pos}%
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      pickFromScreen(idx);
                    }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                    title="Pick from screen"
                  >
                    <Pipette size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeColor(idx);
                    }}
                    disabled={colors.length <= 2}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Remove stop"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addColor}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-sm mb-4"
            >
              <Plus size={14} />
              Add Stop
            </button>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Angle
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={angle}
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                    className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer bg-border"
                  />
                  <span className="text-xs text-muted-foreground w-10 text-right font-mono">
                    {angle}°
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Type
                </label>
                <Dropdown
                  options={[
                    { label: "Linear", value: "Linear" },
                    { label: "Radial", value: "Radial" },
                  ]}
                  value={type}
                  onChange={(val) => setType(String(val))}
                />
              </div>
            </div>

            <div className="flex gap-2.5">
              <Button
                variant="secondary"
                fullWidth
                size="lg"
                icon={<Download size={15} />}
                onClick={downloadSvg}
              >
                SVG
              </Button>
              <Button
                variant="secondary"
                fullWidth
                size="lg"
                icon={<Download size={15} />}
                onClick={downloadPng}
              >
                PNG
              </Button>
              <Button
                variant="primary"
                fullWidth
                size="lg"
                icon={<Save size={15} />}
                onClick={() => setIsSaveModalOpen(true)}
              >
                Save
              </Button>
            </div>
          </div>

          <div className="flex flex-col h-full">
            <div
              className="w-full flex-1 min-h-64 rounded-2xl border border-border mb-4"
              style={{ background: gradientString }}
            />

            <div
              className="relative h-5 rounded-full overflow-hidden mb-5 border border-border"
              style={{ background: gradientString }}
            >
              {colors.map((c) => (
                <div
                  key={c.id}
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-card bg-card cursor-pointer shadow"
                  style={{ left: `${c.pos}%` }}
                  onClick={() => setSelectedIndex(colors.indexOf(c))}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full m-auto mt-[1px]"
                    style={{ backgroundColor: c.hex }}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="border border-border rounded-xl p-3 bg-card/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">CSS</span>
                  <button
                    onClick={() => handleCopy("css", cssCode)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copiedId === "css" ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                </div>
                <code className="text-xs font-mono text-foreground break-all leading-relaxed block">
                  {cssCode}
                </code>
              </div>

              <div className="flex gap-2">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleCopy(`swatch-${c.id}`, c.hex)}
                    className="flex-1 h-10 rounded-lg border border-border relative overflow-hidden group"
                    style={{ backgroundColor: c.hex }}
                    title={`Copy ${c.hex}`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 text-white">
                      {copiedId === `swatch-${c.id}` ? (
                        <Check size={12} />
                      ) : (
                        c.hex.toUpperCase()
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ToolCard>

      <SaveItemModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        type="gradient"
        data={colors.map((c) => c.hex)}
        initialName={paletteName}
      />
    </div>
  );
};

export default GradientMaker;
