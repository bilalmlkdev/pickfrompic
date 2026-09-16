import { useState, useCallback } from "react";
import { HexColorPicker } from "react-colorful";
import { Check, Copy, Plus } from "lucide-react";
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
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopy = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedColor(value);
    setTimeout(() => setCopiedColor(null), 1500);
  }, []);

  const updateColor = (newColor: string) => {
    const newColors = [...colors];
    newColors[selectedIndex] = newColor;
    setColors(newColors);
  };

  const addColor = (index: number) => {
    const newColors = [...colors];
    newColors.splice(index + 1, 0, "#FFFFFF");
    setColors(newColors);
  };

  return (
    <div className="flex-1 w-full py-6 px-4 mt-14">
      <div className="max-w-[780px] mx-auto mb-4">
        <h1 className="text-3xl font-bold text-center text-foreground mb-6">
          Create Your Palette
        </h1>
      </div>

      <ToolCard>
        {/* Manual Grid Layout - 50/50 split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - 50% */}
          <div>
            <h2 className="text-base font-semibold mb-3.5 text-foreground">
              {paletteName}
            </h2>
            <Input
              value={paletteName}
              onChange={(e) => setPaletteName(e.target.value)}
              className="mb-3.5"
            />

            <div className="space-y-2.5">
              {colors.map((color, idx) => {
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
                const textColor = luminance > 0.5 ? "#000000" : "#ffffff";
                const overlayColor = luminance > 0.5 ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.2)";
                return (
                <div key={idx}>
                  <button
                    onClick={() => setSelectedIndex(idx)}
                    className={`w-full h-14 rounded-xl flex items-center px-4 shadow-sm transition-colors border-2 ${
                      selectedIndex === idx
                        ? "border-foreground"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color, color: textColor }}
                  >
                    <span className="backdrop-blur-sm px-2 py-1 rounded-full text-xs font-mono" style={{ backgroundColor: overlayColor }}>
                      {color}
                    </span>
                  </button>
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

          {/* Right Column - 50% */}
          <div>
            <h2 className="text-sm font-semibold mb-3.5 text-foreground">
              Fine-tune Color
            </h2>
            <HexColorPicker
              color={colors[selectedIndex]}
              onChange={updateColor}
              className="w-full h-44!"
            />
            <div className="mt-3.5 flex gap-2">
              <Input
                value={colors[selectedIndex]}
                onChange={(e) => updateColor(e.target.value)}
                monospace
              />
              <button
                onClick={() => handleCopy(colors[selectedIndex])}
                className="bg-muted hover:bg-border px-3 rounded-lg text-foreground transition-colors shrink-0"
              >
                {copiedColor === colors[selectedIndex] ? <Check size={15} /> : <Copy size={15} />}
              </button>
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
