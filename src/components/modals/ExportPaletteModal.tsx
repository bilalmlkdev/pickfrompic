import React, { useMemo, useState, useCallback } from "react";
import { X, Check, Copy, Download, FileCode, FileImage, FileText, Code2 } from "lucide-react";
import {
  convertToCss,
  convertToCode,
  generateSvg,
  generatePng,
  downloadFile,
} from "../../utils/exportUtils";
import ModalShell from "../molecules/ModalShell";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  colors: string[];
}

const tabs = [
  { key: "css" as const, label: "CSS", icon: FileCode },
  { key: "code" as const, label: "Code", icon: Code2 },
  { key: "svg" as const, label: "SVG", icon: FileText },
  { key: "png" as const, label: "PNG", icon: FileImage },
];

const ExportPaletteModal: React.FC<Props> = ({ isOpen, onClose, colors }) => {
  const [activeTab, setActiveTab] = useState<"css" | "code" | "svg" | "png">("css");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const pngDataUrl = useMemo(() => generatePng(colors), [colors]);

  const handleCopy = useCallback((id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }, []);

  if (!isOpen || !colors || colors.length === 0) return null;

  const content =
    activeTab === "css"
      ? convertToCss(colors)
      : activeTab === "code"
        ? convertToCode(colors)
        : activeTab === "svg"
          ? generateSvg(colors)
          : pngDataUrl;

  const handleDownload = () => {
    if (activeTab === "css") downloadFile("palette.css", content, "text/css");
    else if (activeTab === "code") downloadFile("palette.json", content, "text/plain");
    else if (activeTab === "svg") downloadFile("palette.svg", content, "image/svg+xml");
    else if (activeTab === "png") {
      const a = document.createElement("a");
      a.href = pngDataUrl;
      a.download = "palette.png";
      a.click();
    }
  };

  return (
    <ModalShell onClose={onClose} maxWidth="max-w-md">
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Export Palette</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Download or copy your palette</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close export modal"
          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-border transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      <div className="px-5 pb-4">
        <div className="flex h-12 rounded-xl overflow-hidden border border-border">
          {colors.map((color, idx) => (
            <div
              key={idx}
              className="flex-1 relative group cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => handleCopy(`swatch-${idx}`, color)}
            >
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 text-white">
                {copiedId === `swatch-${idx}` ? <Check size={11} /> : color.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="flex gap-1.5 bg-muted/60 rounded-xl p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg transition-all ${
                  activeTab === tab.key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="h-48">
          {activeTab === "png" ? (
            <div className="h-full rounded-xl border border-border overflow-hidden bg-muted/30 flex items-center justify-center">
              <img
                src={pngDataUrl}
                alt="Palette Preview"
                className="max-h-full"
              />
            </div>
          ) : (
            <div className="relative h-full">
              <pre className="h-full bg-muted/60 border border-border rounded-xl p-4 text-xs font-mono text-foreground overflow-auto whitespace-pre-wrap leading-relaxed">
                {content}
              </pre>
              <button
                onClick={() => handleCopy("content", content)}
                aria-label="Copy code to clipboard"
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {copiedId === "content" ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pb-5 flex gap-2.5">
        <button
          onClick={handleDownload}
          aria-label="Download palette"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Download size={14} />
          Download
        </button>
        <button
          onClick={() => handleCopy("all", content)}
          aria-label="Copy all code to clipboard"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-muted text-foreground text-sm font-medium hover:bg-border transition-colors"
        >
          {copiedId === "all" ? <Check size={14} /> : <Copy size={14} />}
          {copiedId === "all" ? "Copied!" : "Copy"}
        </button>
      </div>
    </ModalShell>
  );
};

export default ExportPaletteModal;
