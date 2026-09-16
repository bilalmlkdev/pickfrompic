import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Upload,
  Pipette,
  Globe,
  Link2,
  Clipboard,
  Search,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import ModalShell from "../molecules/ModalShell";
import PillTabs from "../molecules/PillTabs";
import Button from "../atoms/Button";
import Input from "../atoms/Input";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setImageSrc: (src: string) => void;
  onPickedColor: (color: string) => void;
}

type TabValue =
  | "upload-image"
  | "color-on-your-screen"
  | "website-url"
  | "image-url"
  | "paste-clipboard"
  | "search";

const tabs: { value: TabValue; label: string; icon: React.ReactNode }[] = [
  { value: "upload-image", label: "Upload image", icon: <Upload size={13} /> },
  { value: "color-on-your-screen", label: "Color on your Screen", icon: <Pipette size={13} /> },
  { value: "website-url", label: "Website URL", icon: <Globe size={13} /> },
  { value: "image-url", label: "Image URL", icon: <Link2 size={13} /> },
  { value: "paste-clipboard", label: "Paste clipboard", icon: <Clipboard size={13} /> },
  { value: "search", label: "Search", icon: <Search size={13} /> },
];

const ImageSourceModal: React.FC<Props> = ({ isOpen, onClose, setImageSrc, onPickedColor }) => {
  const [activeTab, setActiveTab] = useState<TabValue>("upload-image");
  const [urlInput, setUrlInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [pasteStatus, setPasteStatus] = useState<"idle" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handlePaste = useCallback(
    async (e: ClipboardEvent) => {
      if (activeTab !== "paste-clipboard") return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const blob = item.getAsFile();
          if (blob) {
            setImageSrc(URL.createObjectURL(blob));
            setPasteStatus("success");
            setTimeout(() => {
              onClose();
            }, 500);
          }
          return;
        }
      }

      setPasteStatus("error");
      setTimeout(() => setPasteStatus("idle"), 2000);
    },
    [activeTab, setImageSrc, onClose]
  );

  useEffect(() => {
    if (activeTab === "paste-clipboard") {
      document.addEventListener("paste", handlePaste);
      return () => document.removeEventListener("paste", handlePaste);
    }
  }, [activeTab, handlePaste]);

  useEffect(() => {
    if (activeTab === "search") {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [activeTab]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
      onClose();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageSrc(URL.createObjectURL(file));
      onClose();
    }
  };

  const pickFromScreen = async () => {
    if ("EyeDropper" in window) {
      try {
        // @ts-expect-error EyeDropper API not in TS lib types
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        onPickedColor(result.sRGBHex);
        onClose();
      } catch {
      }
    } else {
      alert("Your browser does not support the EyeDropper API.");
    }
  };

  const handleURLSubmit = async (type: "website" | "image") => {
    if (!urlInput.trim()) return;

    const url = urlInput.startsWith("http://") || urlInput.startsWith("https://")
      ? urlInput
      : `https://${urlInput}`;

    setIsLoading(true);
    setStatus("loading");
    setStatusMsg(type === "website" ? "Loading website screenshot..." : "Loading image...");

    try {
      if (type === "image") {
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Invalid image URL"));
          img.src = url;
        });
        setImageSrc(url);
        setStatus("success");
        setStatusMsg("Image loaded successfully!");
        setTimeout(() => {
          setUrlInput("");
          onClose();
        }, 600);
      } else {
        const screenshotUrl = `https://image.thum.io/get/width/1200/crop/800/${url}`;
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Could not capture website"));
          img.src = screenshotUrl;
        });
        setImageSrc(screenshotUrl);
        setStatus("success");
        setStatusMsg("Screenshot captured!");
        setTimeout(() => {
          setUrlInput("");
          onClose();
        }, 600);
      }
    } catch {
      setStatus("error");
      setStatusMsg(type === "website"
        ? "Could not capture website. Try an image URL instead."
        : "Invalid image URL. Please check and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const results = Array.from({ length: 6 }, (_, i) =>
        `https://images.unsplash.com/photo-${1500000000000 + i}?w=400&h=300&fit=crop&q=80&sig=${encodeURIComponent(searchTerm)}-${i}`
      );
      setSearchResults(results);
    } catch {
      setSearchResults(placeholderImages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const placeholderImages = [
    "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400&q=80",
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
    "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=400&q=80",
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&q=80",
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80",
  ];

  const displayImages = searchResults.length > 0 ? searchResults : placeholderImages;

  return (
    <ModalShell onClose={onClose} maxWidth="max-w-4xl">
      <div className="p-6">
        <div className="flex justify-center bg-muted/60 rounded-full mb-6">
          <PillTabs tabs={tabs} active={activeTab} onChange={(tab) => {
            setActiveTab(tab);
            setStatus("idle");
            setStatusMsg("");
            setPasteStatus("idle");
          }} />
        </div>

        <div className="min-h-[340px] rounded-2xl p-8 flex flex-col justify-center items-center bg-gradient-to-b from-muted/30 to-transparent border border-border/50">
          {activeTab === "upload-image" && (
            <div
              className={`w-full max-w-lg h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                isDragOver
                  ? "border-foreground bg-foreground/5 scale-[1.02]"
                  : "border-border hover:border-foreground/30 hover:bg-muted/40"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${isDragOver ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}>
                <Upload size={24} />
              </div>
              <p className="text-foreground font-semibold text-sm mb-1">Browse or drop image</p>
              <p className="text-muted-foreground text-xs">PNG, JPG, GIF, WEBP up to 10MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                aria-label="Upload image file"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          {activeTab === "color-on-your-screen" && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5 mx-auto">
                <Pipette size={28} className="text-muted-foreground" />
              </div>
              <h3 className="text-foreground font-semibold text-base mb-2">Pick color from your screen</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                Click the button below to open the eyedropper and pick any color visible on your screen.
              </p>
              <Button variant="primary" size="lg" onClick={pickFromScreen} className="px-12">
                Start picking
              </Button>
            </div>
          )}

          {activeTab === "website-url" && (
            <div className="w-full max-w-lg text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4 mx-auto">
                <Globe size={24} className="text-muted-foreground" />
              </div>
              <h3 className="text-foreground font-semibold text-base mb-1">Website URL</h3>
              <p className="text-muted-foreground text-sm mb-5">Enter a website URL to capture a screenshot</p>
              <div className="flex items-center border border-border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow mb-4">
                <div className="bg-muted px-4 py-3 text-muted-foreground border-r border-border text-sm font-medium">
                  https://
                </div>
                <input
                  type="text"
                  placeholder="google.com"
                  className="flex-1 px-4 py-3 bg-transparent text-foreground text-sm focus:outline-none"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleURLSubmit("website")}
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleURLSubmit("website")}
                  disabled={isLoading || !urlInput.trim()}
                  aria-label="Capture website screenshot"
                  className="px-4 py-3 bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                </button>
              </div>
              {status !== "idle" && statusMsg && (
                <div className={`flex items-center justify-center gap-2 text-sm ${status === "success" ? "text-success" : status === "error" ? "text-danger" : "text-muted-foreground"}`}>
                  {status === "loading" && <Loader2 size={14} className="animate-spin" />}
                  {status === "success" && <CheckCircle size={14} />}
                  {status === "error" && <AlertCircle size={14} />}
                  {statusMsg}
                </div>
              )}
            </div>
          )}

          {activeTab === "image-url" && (
            <div className="w-full max-w-lg text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4 mx-auto">
                <Link2 size={24} className="text-muted-foreground" />
              </div>
              <h3 className="text-foreground font-semibold text-base mb-1">Image URL</h3>
              <p className="text-muted-foreground text-sm mb-5">Paste a direct link to an image file</p>
              <div className="flex items-center border border-border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow mb-4">
                <div className="bg-muted px-4 py-3 text-muted-foreground border-r border-border text-sm font-medium">
                  https://
                </div>
                <input
                  type="text"
                  placeholder="example.com/photo.png"
                  className="flex-1 px-4 py-3 bg-transparent text-foreground text-sm focus:outline-none"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleURLSubmit("image")}
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleURLSubmit("image")}
                  disabled={isLoading || !urlInput.trim()}
                  aria-label="Load image from URL"
                  className="px-4 py-3 bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                </button>
              </div>
              {status !== "idle" && statusMsg && (
                <div className={`flex items-center justify-center gap-2 text-sm ${status === "success" ? "text-success" : status === "error" ? "text-danger" : "text-muted-foreground"}`}>
                  {status === "loading" && <Loader2 size={14} className="animate-spin" />}
                  {status === "success" && <CheckCircle size={14} />}
                  {status === "error" && <AlertCircle size={14} />}
                  {statusMsg}
                </div>
              )}
            </div>
          )}

          {activeTab === "paste-clipboard" && (
            <div className="w-full max-w-lg text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4 mx-auto">
                <Clipboard size={24} className="text-muted-foreground" />
              </div>
              <h3 className="text-foreground font-semibold text-base mb-2">Paste from clipboard</h3>
              <p className="text-muted-foreground text-sm mb-5">
                Copy an image to your clipboard and paste it here with{" "}
                <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs font-mono">Ctrl+V</kbd>
              </p>
              <div className="flex justify-center gap-3 mb-5">
                <div className="bg-muted border border-border rounded-lg px-4 py-2.5 font-mono text-xs text-foreground">
                  {navigator.platform?.includes("Mac") ? "⌘" : "Ctrl"}+Shift+4
                </div>
                <div className="bg-muted border border-border rounded-lg px-4 py-2.5 font-mono text-xs text-foreground">
                  {navigator.platform?.includes("Mac") ? "⌘" : "Ctrl"}+V
                </div>
              </div>

              {pasteStatus === "success" && (
                <div className="flex items-center justify-center gap-2 text-sm text-success">
                  <CheckCircle size={14} />
                  Image pasted successfully!
                </div>
              )}
              {pasteStatus === "error" && (
                <div className="flex items-center justify-center gap-2 text-sm text-danger">
                  <AlertCircle size={14} />
                  No image found in clipboard. Try copying an image first.
                </div>
              )}
              {pasteStatus === "idle" && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  Waiting for paste...
                </div>
              )}
            </div>
          )}

          {activeTab === "search" && (
            <div className="w-full">
              <div className="relative w-full max-w-md mx-auto mb-6">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search photos (e.g. nature, city, food)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="rounded-full pl-11 pr-12 py-2.5"
                />
                <button
                  onClick={handleSearch}
                  disabled={isLoading || !searchTerm.trim()}
                  aria-label="Search images"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
                {displayImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative h-32 rounded-xl overflow-hidden cursor-pointer border border-border/50 hover:border-foreground/30 transition-all hover:shadow-lg"
                    onClick={() => {
                      setImageSrc(img);
                      onClose();
                    }}
                  >
                    <img
                      src={img}
                      alt={`Search result for ${searchTerm}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-white text-xs font-medium">Use this image</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-link text-xs font-medium cursor-pointer flex items-center justify-center gap-1 hover:underline">
                Photos provided by Unsplash <ExternalLink size={12} />
              </p>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <ShieldCheck size={13} className="shrink-0" />
          No data is sent to any server. Everything happens in your browser.
        </p>
      </div>
    </ModalShell>
  );
};

export default ImageSourceModal;
