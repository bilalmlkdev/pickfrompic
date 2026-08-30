import React, { useState } from "react";
import { useCopy } from "react-use-copy";
import {
  convertToCss,
  convertToCode,
  generateSvg,
  generatePng,
  downloadFile,
} from "../utils/exportUtils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  colors: string[];
}

const ExportPaletteModal: React.FC<Props> = ({ isOpen, onClose, colors }) => {
  const [activeTab, setActiveTab] = useState<"css" | "code" | "svg" | "png">(
    "css",
  );
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
    else if (activeTab === "code")
      downloadFile("palette.txt", content, "text/plain");
    else if (activeTab === "svg")
      downloadFile("palette.svg", content, "image/svg+xml");
    else if (activeTab === "png") {
      const a = document.createElement("a");
      a.href = generatePng(colors);
      a.download = "palette.png";
      a.click();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Export Palette</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition"
          >
            ✕
          </button>
        </div>

        {/* Minimal Segmented Tabs */}
        <div className="flex gap-2 p-4 bg-gray-50 border-b border-gray-100">
          {(["css", "code", "svg", "png"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium uppercase tracking-wider rounded-full transition ${
                activeTab === tab
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6 min-h-[200px]">
          {activeTab === "png" ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <img
                src={generatePng(colors)}
                alt="Palette Preview"
                className="rounded-xl shadow-lg border border-gray-200"
              />
              <p className="text-xs text-gray-400">
                Live preview of your download
              </p>
            </div>
          ) : (
            <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs font-mono text-gray-800 overflow-auto max-h-60 whitespace-pre-wrap">
              {content}
            </pre>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="p-5 pt-0 flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 py-3 rounded-full bg-white border border-gray-300 text-gray-800 font-semibold hover:bg-gray-50 transition"
          >
            Download
          </button>
          <button
            onClick={() => copy(content)}
            className="flex-1 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800 transition"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPaletteModal;
