import { useState, useCallback } from "react";
import { HexColorPicker } from "react-colorful";
import { Check, Copy, Dices, Pipette, Plus, Trash2 } from "lucide-react";
import { hexToRgb, rgbToHsl, rgbToCmyk, isValidHex } from "../utils/ColorMath";
import SaveItemModal from "../components/modals/SaveItemModal";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";
import ToolCard from "../components/templates/ToolCard";

const CreatePalette = () => {
  const [colors, setColors] = useState<string[]>([
    "#E59F71",
    "#BA5A31",
    "#0C0C0C",
    "#69DC9E",
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [paletteName, setPaletteName] = useState("New Color Palette");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = useCallback((id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }, []);

  const currentColor = colors[selectedIndex] || "#000000";
  const rgb = hexToRgb(currentColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  const formatValues = [
    { label: "HEX", value: currentColor.toUpperCase() },
    { label: "RGB", value: `${rgb.r}, ${rgb.g}, ${rgb.b}` },
    { label: "HSL", value: `${hsl.h}, ${hsl.s}, ${hsl.l}` },
    { label: "CMYK", value: `${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}` },
  ];

  const updateColor = (newColor: string) => {
    const newColors = [...colors];
    newColors[selectedIndex] = newColor;
    setColors(newColors);
  };

  const addColor = (index: number) => {
    const newColors = [...colors];
    newColors.splice(index + 1, 0, "#FFFFFF");
    setColors(newColors);
    setSelectedIndex(index + 1);
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

  const randomize = () => {
    const random = () =>
      "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    setColors(Array.from({ length: colors.length }, random));
  };

  const pickFromScreen = async () => {
    if ("EyeDropper" in window) {
      try {
        // @ts-expect-error EyeDropper API not in TS lib types
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) updateColor(result.sRGBHex);
      } catch {
      }
    } else {
      alert("Your browser does not support the EyeDropper API.");
    }
  };

  return (
    <div className="flex-1 w-full py-6 px-4 mt-16">
      <div className="max-w-[780px] mx-auto mb-4">
        <h1 className="text-4xl font-medium text-center text-foreground mb-2">
          Palette Generator
        </h1>
        <p className="text-center text-muted-foreground text-lg mb-4">
          Create, customize, and export beautiful color palettes
        </p>
      </div>

      <ToolCard>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3">
              <Input
                value={paletteName}
                onChange={(e) => setPaletteName(e.target.value)}
                className="flex-1"
              />
              <button
                onClick={randomize}
                className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                title="Randomize"
              >
                <Dices size={15} />
              </button>
            </div>

            <div className="space-y-2.5 flex-1 overflow-y-auto">
              {colors.map((color, idx) => {
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
                const textColor = luminance > 0.5 ? "#000000" : "#ffffff";
                const overlayColor = luminance > 0.5 ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.2)";
                return (
                  <div key={idx}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedIndex(idx)}
                        className={`flex-1 h-14 rounded-xl flex items-center px-4 shadow-sm transition-colors border-2 ${
                          selectedIndex === idx
                            ? "border-foreground"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color, color: textColor }}
                      >
                        <span
                          className="backdrop-blur-sm px-2 py-1 rounded-full text-xs font-mono"
                          style={{ backgroundColor: overlayColor }}
                        >
                          {color}
                        </span>
                      </button>
                      <button
                        onClick={() => removeColor(idx)}
                        disabled={colors.length <= 2}
                        className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Remove color"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex justify-center -mt-2 z-10 relative">
                      <button
                        onClick={() => addColor(idx)}
                        className="bg-card border border-border shadow-md rounded-full w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={() => setIsSaveModalOpen(true)}
              className="mt-4"
            >
              Save Palette
            </Button>
          </div>

          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">
                Fine-tune Color
              </h2>
              <button
                onClick={pickFromScreen}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                title="Pick from screen"
              >
                <Pipette size={13} />
                Pick
              </button>
            </div>

            <div className="flex-1 rounded-xl overflow-hidden mb-3 border border-border">
              <HexColorPicker
                color={currentColor}
                onChange={updateColor}
                className="w-full h-48!"
              />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={currentColor}
                onChange={(e) => {
                  const val = e.target.value;
                  if (isValidHex(val)) updateColor(val);
                  else if (val === "" || val === "#") updateColor(val);
                }}
                className="flex-1 border border-border rounded-lg px-3 py-2 bg-card text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-foreground/10"
              />
              <div
                className="w-9 h-9 rounded-lg border border-border shrink-0"
                style={{ backgroundColor: currentColor }}
              />
              <button
                onClick={() => handleCopy(`picker-hex`, currentColor)}
                className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                title="Copy HEX"
              >
                {copiedId === "picker-hex" ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {formatValues.map((f) => (
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
                    {copiedId === `format-${f.label}` ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ToolCard>

      <SaveItemModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        type="palette"
        data={colors}
        initialName={paletteName}
      />
    </div>
  );
};

export default CreatePalette;
