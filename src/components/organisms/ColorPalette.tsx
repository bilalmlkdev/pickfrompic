import React, { useState } from "react";
import { Download, Minus, Plus, Save } from "lucide-react";
import ExportPaletteModal from "../modals/ExportPaletteModal";
import SaveItemModal from "../modals/SaveItemModal";
import Swatch from "../atoms/Swatch";
import IconButton from "../atoms/IconButton";
import SectionLabel from "../atoms/SectionLabel";

interface Props {
  colors: string[];
  selectedColor: string;
  setSelectedColor: (hex: string) => void;
  maxColors: number;
  setMaxColors: (num: number) => void;
}

const ColorPalette: React.FC<Props> = ({
  colors,
  selectedColor,
  setSelectedColor,
  maxColors,
  setMaxColors,
}) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const allColors = (colors || []).slice(0, maxColors);

  return (
    <div>
      <SectionLabel>Color Palette</SectionLabel>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <IconButton
            size="md"
            onClick={() => setMaxColors(Math.max(2, maxColors - 1))}
          >
            <Minus size={16} />
          </IconButton>
          <IconButton
            size="md"
            onClick={() => setMaxColors(Math.min(20, maxColors + 1))}
          >
            <Plus size={16} />
          </IconButton>
        </div>

        <div className="flex flex-1 overflow-x-auto scrollbar-hidden h-10 scrollbar-thin rounded-md overflow-hidden border border-border">
          {allColors.length > 0 ? (
            allColors.map((color, idx) => (
              <Swatch
                key={idx}
                color={color}
                selected={selectedColor === color}
                onClick={() => setSelectedColor(color)}
                className="h-10 flex-1 min-w-[24px] shrink-0"
              />
            ))
          ) : (
            <div className="flex-1 bg-transparent" />
          )}
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <IconButton
            size="md"
            onClick={() => setIsExportOpen(true)}
            title="Download Palette"
          >
            <Download size={16} />
          </IconButton>
          <IconButton
            size="md"
            onClick={() => setIsSaveOpen(true)}
            title="Save Palette"
          >
            <Save size={16} />
          </IconButton>
        </div>
      </div>

      <ExportPaletteModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        colors={allColors}
      />
      <SaveItemModal
        isOpen={isSaveOpen}
        onClose={() => setIsSaveOpen(false)}
        type="palette"
        data={allColors}
      />
    </div>
  );
};

export default ColorPalette;
