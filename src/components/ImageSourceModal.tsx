import React, { useRef, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setImageSrc: (src: string) => void;
  onPickedColor: (color: string) => void;
}

const ImageSourceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  setImageSrc,
  onPickedColor,
}) => {
  const [activeTab, setActiveTab] = useState("upload");
  const [urlInput, setUrlInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const tabs = [
    "Upload image",
    "Color on your Screen",
    "Website URL",
    "Image URL",
    "Paste clipboard",
    "Search",
  ];

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
        // @ts-ignore
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        onPickedColor(result.sRGBHex);
        onClose();
      } catch (e) {
        console.log("EyeDropper cancelled");
      }
    } else {
      alert("Your browser does not support the EyeDropper API.");
    }
  };

  const handleURLSubmit = (type: "website" | "image") => {
    if (urlInput) {
      if (type === "image") {
        setImageSrc(`https://${urlInput}`);
      } else {
        // Note: True website screenshots need a backend API. For now, we just set the source.
        setImageSrc(`https://${urlInput}`);
      }
      setUrlInput("");
      onClose();
    }
  };

  // Static mock images for Pexels Search placeholder
  const placeholderImages = [
    "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400&q=80",
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
    "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=400&q=80",
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&q=80",
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80",
  ];

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 justify-center bg-gray-100 p-2 rounded-full mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(tab.toLowerCase().replace(/\s+/g, "-"))
              }
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab.toLowerCase().replace(/\s+/g, "-")
                  ? "bg-white text-gray-900 shadow-sm border border-gray-300"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[350px] border border-gray-200 rounded-xl p-8 flex flex-col justify-center items-center">
          {/* 1. Upload Image */}
          {activeTab === "upload-image" && (
            <div
              className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-4xl mb-2 text-gray-400">🖼️</div>
              <p className="text-gray-600 font-medium">Browse or drop image</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-400 mt-4">
                We think data protection is important!{" "}
                <span className="text-pink-500">No data is sent.</span> The
                magic happens in your browser.
              </p>
            </div>
          )}

          {/* 2. Color on your Screen */}
          {activeTab === "color-on-your-screen" && (
            <div className="text-center">
              <button
                onClick={pickFromScreen}
                className="bg-gray-900 text-white px-10 py-3 rounded-full font-medium hover:bg-gray-800 mb-6"
              >
                Start
              </button>
              <p className="text-gray-600">
                We think data protection is important!{" "}
                <span className="text-pink-500">No data is sent.</span> The
                magic happens in your browser.
              </p>
            </div>
          )}

          {/* 3. Website URL */}
          {activeTab === "website-url" && (
            <div className="w-full max-w-2xl text-center">
              <h3 className="text-lg font-medium mb-4">URL to a website</h3>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mb-6">
                <div className="bg-gray-100 px-4 py-3 text-gray-600 border-r border-gray-300">
                  https://
                </div>
                <input
                  type="text"
                  placeholder="google.com"
                  className="flex-1 p-3 focus:outline-none"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
              </div>
              <button
                onClick={() => handleURLSubmit("website")}
                className="bg-gray-900 text-white px-10 py-3 rounded-full font-medium hover:bg-gray-800"
              >
                OK
              </button>
              <p className="mt-4 text-gray-600">
                We'll take a screenshot of the website for you
              </p>
            </div>
          )}

          {/* 4. Image URL */}
          {activeTab === "image-url" && (
            <div className="w-full max-w-2xl text-center">
              <h3 className="text-lg font-medium mb-4">URL to an image</h3>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mb-6">
                <div className="bg-gray-100 px-4 py-3 text-gray-600 border-r border-gray-300">
                  https://
                </div>
                <input
                  type="text"
                  placeholder="url.com/image.png"
                  className="flex-1 p-3 focus:outline-none"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
              </div>
              <button
                onClick={() => handleURLSubmit("image")}
                className="bg-gray-900 text-white px-10 py-3 rounded-full font-medium hover:bg-gray-800"
              >
                OK
              </button>
              <p className="mt-4 text-gray-600">
                We'll download the image for you
              </p>
            </div>
          )}

          {/* 5. Paste clipboard */}
          {activeTab === "paste-clipboard" && (
            <div className="w-full max-w-2xl">
              <div className="flex gap-2 mb-4">
                <div className="bg-gray-100 border border-gray-300 rounded p-2 font-mono text-sm">
                  ⌘ ⇧ 4
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded p-2 font-mono text-sm">
                  ⌘ V
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Copy an image to clipboard (For instance: Mac: cmd+shift+4 and
                Win: Alt+PrtScr), come back to imagecolorpicker.com to paste the
                image into, and paste cmd+v or ctrl+v.
              </p>
              <p className="text-gray-600">
                We think data protection is important!{" "}
                <span className="text-pink-500">No data is sent.</span> The
                magic happens in your browser.
              </p>
            </div>
          )}

          {/* 6. Search (Pexels) */}
          {activeTab === "search" && (
            <div className="w-full">
              <div className="relative w-full max-w-md mx-auto mb-6">
                <input
                  type="text"
                  placeholder="Search photos via pexels"
                  className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute right-4 top-2.5 text-gray-400">🔍</div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {placeholderImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Search result"
                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                    onClick={() => {
                      setImageSrc(img);
                      onClose();
                    }}
                  />
                ))}
              </div>
              <p className="text-center text-blue-500 text-sm font-medium cursor-pointer">
                Photos provided by Pexels ↗
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageSourceModal;
