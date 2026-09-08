import React, { useRef, useState } from "react";
import {
  Upload,
  Pipette,
  Globe,
  Link2,
  Clipboard,
  Search,
  ShieldCheck,
  ImageOff,
  ExternalLink,
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
        // cancelled
      }
    } else {
      alert("Your browser does not support the EyeDropper API.");
    }
  };

  const handleURLSubmit = (type: "website" | "image") => {
    if (urlInput) {
      setImageSrc(`https://${urlInput}`);
      setUrlInput("");
      onClose();
    }
    void type;
  };

  const placeholderImages = [
    "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400&q=80",
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
    "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=400&q=80",
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&q=80",
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80",
  ];

  const dataNotice = (
    <p className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
      <ShieldCheck size={14} className="shrink-0" />
      We think data protection is important! <span className="text-link">No data is sent.</span> The magic
      happens in your browser.
    </p>
  );

  return (
    <ModalShell onClose={onClose} maxWidth="max-w-4xl">
      <div className="p-6">
        <div className="flex justify-center bg-muted  rounded-full mb-5">
          <PillTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="min-h-[320px] border border-border rounded-xl p-8 flex flex-col justify-center items-center bg-card/40">
          {activeTab === "upload-image" && (
            <div
              className="w-full h-60 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageOff size={32} className="mb-2 text-muted-foreground" />
              <p className="text-foreground font-medium text-sm">Browse or drop image</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {dataNotice}
            </div>
          )}

          {activeTab === "color-on-your-screen" && (
            <div className="text-center">
              <Button variant="primary" size="lg" onClick={pickFromScreen} className="mb-4 px-10">
                Start
              </Button>
              {dataNotice}
            </div>
          )}

          {activeTab === "website-url" && (
            <div className="w-full max-w-2xl text-center">
              <h3 className="text-base font-medium mb-4 text-foreground">URL to a website</h3>
              <div className="flex items-center border border-border rounded-lg overflow-hidden mb-5 bg-card">
                <div className="bg-muted px-4 py-2.5 text-muted-foreground border-r border-border text-sm">
                  https://
                </div>
                <input
                  type="text"
                  placeholder="google.com"
                  className="flex-1 p-2.5 bg-transparent text-foreground text-sm focus:outline-none"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
              </div>
              <Button variant="primary" size="lg" onClick={() => handleURLSubmit("website")} className="px-10">
                OK
              </Button>
              <p className="mt-4 text-sm text-muted-foreground">
                We'll take a screenshot of the website for you
              </p>
            </div>
          )}

          {activeTab === "image-url" && (
            <div className="w-full max-w-2xl text-center">
              <h3 className="text-base font-medium mb-4 text-foreground">URL to an image</h3>
              <div className="flex items-center border border-border rounded-lg overflow-hidden mb-5 bg-card">
                <div className="bg-muted px-4 py-2.5 text-muted-foreground border-r border-border text-sm">
                  https://
                </div>
                <input
                  type="text"
                  placeholder="url.com/image.png"
                  className="flex-1 p-2.5 bg-transparent text-foreground text-sm focus:outline-none"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
              </div>
              <Button variant="primary" size="lg" onClick={() => handleURLSubmit("image")} className="px-10">
                OK
              </Button>
              <p className="mt-4 text-sm text-muted-foreground">We'll download the image for you</p>
            </div>
          )}

          {activeTab === "paste-clipboard" && (
            <div className="w-full max-w-2xl">
              <div className="flex gap-2 mb-4">
                <div className="bg-muted border border-border rounded p-2 font-mono text-xs text-foreground">
                  ⌘ ⇧ 4
                </div>
                <div className="bg-muted border border-border rounded p-2 font-mono text-xs text-foreground">
                  ⌘ V
                </div>
              </div>
              <p className="text-foreground/80 text-sm mb-4">
                Copy an image to clipboard (For instance: Mac: cmd+shift+4 and Win: Alt+PrtScr), come back to
                imagecolorpicker.com to paste the image into, and paste cmd+v or ctrl+v.
              </p>
              {dataNotice}
            </div>
          )}

          {activeTab === "search" && (
            <div className="w-full">
              <div className="relative w-full max-w-md mx-auto mb-5">
                <Input
                  placeholder="Search photos via pexels"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-full pr-10"
                />
                <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {placeholderImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Search result"
                    className="w-full h-28 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => {
                      setImageSrc(img);
                      onClose();
                    }}
                  />
                ))}
              </div>
              <p className="text-center text-link text-sm font-medium cursor-pointer flex items-center justify-center gap-1">
                Photos provided by Pexels <ExternalLink size={13} />
              </p>
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  );
};

export default ImageSourceModal;
