import React, { useState } from "react";
import { useDashboard } from "../context/DashboardContext";

interface Props {
  onBack: () => void;
}

const GradientMaker: React.FC<Props> = ({ onBack }) => {
  const { addGradient } = useDashboard();
  const [colors, setColors] = useState([
    { hex: "#ff0000", pos: 0 },
    { hex: "#0000ff", pos: 100 },
  ]);
  const [angle, setAngle] = useState(90);
  const [type, setType] = useState("Linear");

  const gradientString =
    type === "Linear"
      ? `linear-gradient(${angle}deg, ${colors.map((c) => `${c.hex} ${c.pos}%`).join(", ")})`
      : `radial-gradient(circle, ${colors.map((c) => `${c.hex} ${c.pos}%`).join(", ")})`;

  const randomize = () => {
    const c1 = "#" + Math.floor(Math.random() * 16777215).toString(16);
    const c2 = "#" + Math.floor(Math.random() * 16777215).toString(16);
    setColors([
      { hex: c1, pos: 0 },
      { hex: c2, pos: 100 },
    ]);
  };

  const handleSave = () => {
    addGradient(
      "New Gradient",
      colors.map((c) => c.hex),
    );
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-cyan-200 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Gradient Maker
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Simple, creative, versatile - perfect gradients made easy
        </p>
        <button onClick={onBack} className="text-blue-600 underline mb-6">
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl p-8 shadow-xl flex gap-8">
          {/* Preview */}
          <div
            className="w-1/2 h-96 rounded-2xl border border-gray-200"
            style={{ background: gradientString }}
          ></div>

          {/* Controls */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {/* Color Bar */}
              <div
                className="relative h-6 rounded-full overflow-hidden mb-8"
                style={{ background: gradientString }}
              >
                {colors.map((c, idx) => (
                  <div
                    key={idx}
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white bg-white cursor-pointer"
                    style={{ left: `${c.pos}%` }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: c.hex }}
                    ></div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Color
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-lg p-2">
                    <input
                      type="text"
                      value={colors[0].hex}
                      onChange={(e) =>
                        setColors([
                          { ...colors[0], hex: e.target.value },
                          colors[1],
                        ])
                      }
                      className="flex-1 border-none focus:outline-none"
                    />
                    <input
                      type="color"
                      value={colors[0].hex}
                      onChange={(e) =>
                        setColors([
                          { ...colors[0], hex: e.target.value },
                          colors[1],
                        ])
                      }
                      className="w-6 h-6"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Position
                  </label>
                  <select
                    value={colors[0].pos}
                    onChange={(e) =>
                      setColors([
                        { ...colors[0], pos: Number(e.target.value) },
                        colors[1],
                      ])
                    }
                    className="w-full border border-gray-200 rounded-lg p-2"
                  >
                    {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Rotation
                  </label>
                  <select
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg p-2"
                  >
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2"
                  >
                    <option>Linear</option>
                    <option>Radial</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={randomize}
                className="flex-1 bg-white border border-gray-300 py-3 rounded-xl text-gray-800 hover:bg-gray-50"
              >
                🎲 Random
              </button>
              <button
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='${colors[0].hex}'/><stop offset='100%' stop-color='${colors[1].hex}'/></linearGradient></defs><rect width='400' height='400' fill='url(%23g)'/></svg>`;
                  a.download = "gradient.svg";
                  a.click();
                }}
                className="flex-1 bg-white border border-gray-300 py-3 rounded-xl text-gray-800 hover:bg-gray-50"
              >
                ⬇ Download
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-500 py-3 rounded-xl text-white hover:bg-blue-600"
              >
                💾 Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientMaker;
