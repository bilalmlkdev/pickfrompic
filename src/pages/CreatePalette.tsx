import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Copy, Plus } from "lucide-react";
import { useCopy } from "react-use-copy";
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
  const { copied, copy } = useCopy();

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
    <div className="flex-1 w-full py-8 px-4 mt-35">
      <div className="max-w-[780px] mx-auto mb-4">
        <h1 className="text-3xl font-bold text-center text-foreground mb-6">
          Create Your Palette
        </h1>
        <Link
          to="/dashboard/palette"
          className="text-link text-sm font-medium hover:underline mb-5 flex items-center gap-1.5 w-fit"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
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
              {colors.map((color, idx) => (
                <div key={idx}>
                  <button
                    onClick={() => setSelectedIndex(idx)}
                    className={`w-full h-14 rounded-xl flex items-center px-4 text-white shadow-sm transition-colors border-2 ${
                      selectedIndex === idx
                        ? "border-foreground"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    <span className="bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-mono">
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
              ))}
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
                onClick={() => copy(colors[selectedIndex])}
                className="bg-muted hover:bg-border px-3 rounded-lg text-foreground transition-colors shrink-0"
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
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
      />
    </div>
  );
};

export default CreatePalette;
