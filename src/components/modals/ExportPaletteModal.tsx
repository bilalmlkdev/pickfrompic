import React, { useState } from "react";
import { useCopy } from "react-use-copy";
import { X, Check } from "lucide-react";
import {
  convertToCss,
  convertToCode,
  generateSvg,
  generatePng,
  downloadFile,
} from "../../utils/exportUtils";
import ModalShell from "../molecules/ModalShell";
import IconButton from "../atoms/IconButton";
import Button from "../atoms/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  colors: string[];
}

const ExportPaletteModal: React.FC<Props> = ({ isOpen, onClose, colors }) => {
  const [activeTab, setActiveTab] = useState<"css" | "code" | "svg" | "png">("css");
  const { copied, copy } = useCopy();

  if (!isOpen) return null;

  const content =
    activeTab === "css"
      ? convertToCss(colors)
      : activeTab === "code"
        ? convertToCode(colors)
        : activeTab === "svg"
          ? generateSvg(colors)
          : "";

  const handleDownload = () => {
    if (activeTab === "css") downloadFile("palette.css", content, "text/css");
    else if (activeTab === "code") downloadFile("palette.txt", content, "text/plain");
    else if (activeTab === "svg") downloadFile("palette.svg", content, "image/svg+xml");
    else if (activeTab === "png") {
      const a = document.createElement("a");
      a.href = generatePng(colors);
      a.download = "palette.png";
      a.click();
    }
  };

  return (
    <ModalShell onClose={onClose} maxWidth="max-w-lg">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">Export Palette</h2>
        <IconButton size="sm" onClick={onClose} variant="ghost">
          <X size={16} />
        </IconButton>
      </div>

      <div className="flex gap-2 p-3 bg-muted/60 border-b border-border">
        {(["css", "code", "svg", "png"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 text-xs font-medium uppercase tracking-wider rounded-full transition-colors ${
              activeTab === tab
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-5 min-h-[180px]">
        {activeTab === "png" ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <img
              src={generatePng(colors)}
              alt="Palette Preview"
              className="rounded-xl shadow-lg border border-border"
            />
            <p className="text-xs text-muted-foreground">Live preview of your download</p>
          </div>
        ) : (
          <pre className="bg-muted/60 border border-border rounded-xl p-4 text-xs font-mono text-foreground overflow-auto max-h-56 whitespace-pre-wrap">
            {content}
          </pre>
        )}
      </div>

      <div className="p-5 pt-0 flex gap-3">
        <Button variant="secondary" fullWidth onClick={handleDownload}>
          Download
        </Button>
        <Button
          variant="primary"
          fullWidth
          onClick={() => copy(content)}
          icon={copied ? <Check size={14} /> : undefined}
        >
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
    </ModalShell>
  );
};

export default ExportPaletteModal;
