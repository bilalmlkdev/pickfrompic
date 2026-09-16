import React, { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Upload, Pipette } from "lucide-react";
import { hexToRgb, rgbToHsl } from "../../utils/ColorMath";
import ImageSourceModal from "../modals/ImageSourceModal";
import ColorField from "../molecules/ColorField";
import SectionLabel from "../atoms/SectionLabel";
import Button from "../atoms/Button";

const hexToRgbString = (hex: string) => {
  if (!hex) return "rgb(0, 0, 0)";
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${r}, ${g}, ${b})`;
};

const hexToHslString = (hex: string) => {
  if (!hex) return "hsl(0, 0%, 0%)";
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  return `hsl(${h}, ${s}%, ${l}%)`;
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
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = useCallback((id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }, []);

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
              className={`h-25 flex-1 rounded-lg border-2 transition-colors ${
                selectedColor === color ? "border-foreground" : "border-transparent"
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
        <ColorField label="HEX" value={displayColor} copied={copiedId === "HEX"} onCopy={() => handleCopy("HEX", displayColor)} compact />
        <ColorField label="RGB" value={rgb} copied={copiedId === "RGB"} onCopy={() => handleCopy("RGB", rgb)} compact />
        <ColorField label="HSL" value={hsl} copied={copiedId === "HSL"} onCopy={() => handleCopy("HSL", hsl)} compact />
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
