import React, { useMemo, useState } from "react";
import { useCopy } from "react-use-copy";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Upload, Pipette } from "lucide-react";
import ImageSourceModal from "../modals/ImageSourceModal";
import ColorField from "../molecules/ColorField";
import SectionLabel from "../atoms/SectionLabel";
import Button from "../atoms/Button";

const hexToRgbString = (hex: string) => {
  if (!hex) return "rgb(0, 0, 0)";
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
    : hex;
};

const hexToHslString = (hex: string) => {
  if (!hex) return "hsl(0, 0%, 0%)";
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

interface Props {
  colors: string[];
  topPicks: string[];
  selectedColor: string;
  hoveredColor: string | null;
  setSelectedColor: (hex: string) => void;
  setImageSrc: (src: string) => void;
  onPickedColor: (color: string) => void;
}

const ColorDetailsPanel: React.FC<Props> = ({
  colors,
  topPicks,
  selectedColor,
  hoveredColor,
  setSelectedColor,
  setImageSrc,
  onPickedColor,
}) => {
  const { copied, copy } = useCopy();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayColor = hoveredColor || selectedColor;

  const rgb = useMemo(() => hexToRgbString(displayColor), [displayColor]);
  const hsl = useMemo(() => hexToHslString(displayColor), [displayColor]);

  const pickFromScreen = async () => {
    if ("EyeDropper" in window) {
      try {
        // @ts-expect-error EyeDropper API not in TS lib types
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        onPickedColor(result.sRGBHex);
      } catch {
        // cancelled
      }
    } else {
      alert("Your browser does not support the EyeDropper API.");
    }
  };

  const topColors = topPicks.length > 0 ? topPicks.slice(0, 2) : (colors || []).slice(0, 2);
  const displayTopColors = hoveredColor ? [topColors[0] || "#2596be", hoveredColor] : topColors;

  const handleViewDetails = () => {
    const cleanHex = displayColor.replace("#", "");
    navigate(`/color/${cleanHex}`);
  };

  return (
    <div className="flex flex-col">
      <SectionLabel>Colors</SectionLabel>
      <div className="flex gap-2 mb-3">
        {displayTopColors.length > 0 ? (
          displayTopColors.map((color, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedColor(color)}
              style={{ backgroundColor: color }}
              className={`h-25 flex-1 rounded-lg border transition-colors ${
                selectedColor === color ? "border-none" : "border-none"
              }`}
            />
          ))
        ) : (
          <>
            <div className="h-20 flex-1 rounded-lg bg-blue-500" />
            <div className="h-20 flex-1 rounded-lg bg-blue-800" />
          </>
        )}
      </div>

      <div className="space-y-1.5 mb-3">
        <ColorField label="HEX" value={displayColor} copied={copied} onCopy={() => copy(displayColor)} compact />
        <ColorField label="RGB" value={rgb} copied={copied} onCopy={() => copy(rgb)} compact />
        <ColorField label="HSL" value={hsl} copied={copied} onCopy={() => copy(hsl)} compact />
      </div>

      <button
        onClick={handleViewDetails}
        className="flex items-center gap-1 text-left text-[12px] font-medium text-link hover:underline mb-4 w-fit"
      >
        View color details <ArrowRight size={12} />
      </button>

      <div className="bg-muted/60 rounded-xl p-3.5 border border-border">
        <h3 className="font-semibold text-[12px] text-foreground mb-2.5">Use your own image</h3>
        <Button
          variant="primary"
          fullWidth
          size="sm"
          icon={<Upload size={13} />}
          onClick={() => setIsModalOpen(true)}
          className="mb-2"
        >
          Use your image
        </Button>
        <Button
          variant="secondary"
          fullWidth
          size="sm"
          icon={<Pipette size={13} />}
          onClick={pickFromScreen}
        >
          Pick from Screen
        </Button>
        <p className="mt-3 text-[11px] text-muted-foreground leading-snug flex items-start gap-1">
          <ShieldCheck size={12} className="shrink-0 mt-0.5" />
          <span>
            We think data protection is important! <span className="text-link">No data is sent.</span> The
            magic happens in your browser.
          </span>
        </p>
      </div>

      <ImageSourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setImageSrc={setImageSrc}
        onPickedColor={onPickedColor}
      />
    </div>
  );
};

export default ColorDetailsPanel;
