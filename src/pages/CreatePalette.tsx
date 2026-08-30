import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Link } from "react-router-dom";
import SaveItemModal from "../components/modals/SaveItemModal";

const CreatePalette = () => {
  const [colors, setColors] = useState<string[]>(["#E59F71", "#BA5A31", "#0C0C0C", "#69DC9E"]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [paletteName, setPaletteName] = useState("New Color Palette");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-cyan-200 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Create Your Palette</h1>
        <Link to="/dashboard/palette" className="text-blue-600 underline mb-6 block">← Back to Dashboard</Link>

        <div className="flex gap-8">
          <div className="flex-1 bg-white rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">{paletteName}</h2>
            <input value={paletteName} onChange={(e) => setPaletteName(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 mb-4" />

            <div className="space-y-3">
              {colors.map((color, idx) => (
                <div key={idx}>
                  <button onClick={() => setSelectedIndex(idx)} className={`w-full h-16 rounded-xl flex items-center px-4 text-white shadow-sm transition border-2 ${selectedIndex === idx ? "border-black" : "border-transparent"}`} style={{ backgroundColor: color }}>
                    <span className="bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-mono">{color}</span>
                  </button>
                  <div className="flex justify-center -mt-2 z-10 relative">
                    <button onClick={() => addColor(idx)} className="bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100">+</button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setIsSaveModalOpen(true)} className="mt-6 w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800">Save Palette</button>
          </div>

          <div className="w-80 bg-white rounded-3xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Fine-tune Color</h2>
            <HexColorPicker color={colors[selectedIndex]} onChange={updateColor} className="w-full h-48!" />
            <div className="mt-4 flex gap-2">
              <input value={colors[selectedIndex]} onChange={(e) => updateColor(e.target.value)} className="flex-1 border border-gray-200 rounded-lg p-2" />
              <button onClick={() => navigator.clipboard.writeText(colors[selectedIndex])} className="bg-gray-100 px-3 rounded-lg">⧉</button>
            </div>
          </div>
        </div>
      </div>

      <SaveItemModal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} type="palette" data={colors} />
    </div>
  );
};

export default CreatePalette;
