import React, { useState } from "react";
import { useDashboard } from "../context/DashboardContext";
import CreatePalette from "./CreatePalette";
import GradientMaker from "./GradientMaker";
import ColorConversion from "./ColorConversion";
import { downloadFile, convertToCss } from "../utils/exportUtils";

const Dashboard: React.FC = () => {
  const { palettes, deletePalette, updatePalette } = useDashboard();
  const [activeTab, setActiveTab] = useState("Palettes");
  const [activeView, setActiveView] = useState<
    "list" | "palette" | "gradient" | "color"
  >("list");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(
    null,
  );
  const [newCollectionName, setNewCollectionName] = useState("");

  // Conditionally render creation pages based on the + button
  if (activeView === "palette")
    return <CreatePalette onBack={() => setActiveView("list")} />;
  if (activeView === "gradient")
    return <GradientMaker onBack={() => setActiveView("list")} />;
  if (activeView === "color")
    return <ColorConversion onBack={() => setActiveView("list")} />;

  const filteredPalettes = palettes.filter((palette) =>
    palette.name.toLowerCase().includes(search.toLowerCase()),
  );

  const tabs = ["Palettes", "Colors", "Gradients"];

  const handleDownload = (palette: { name: string; colors: string[] }) => {
    downloadFile(
      `${palette.name}.css`,
      convertToCss(palette.colors),
      "text/css",
    );
  };

  const handleCopyURL = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/palette/${id}`);
    setOpenMenuId(null);
  };

  const handleMoveToCollection = (id: string) => {
    setEditingCollectionId(id);
    setNewCollectionName("");
    setOpenMenuId(null);
  };

  const handleSaveCollection = (id: string) => {
    if (newCollectionName) updatePalette(id, newCollectionName);
    setEditingCollectionId(null);
  };

  // Routes + button to the correct page based on active tab
  const handlePlusClick = () => {
    if (activeTab === "Palettes") setActiveView("palette");
    else if (activeTab === "Gradients") setActiveView("gradient");
    else if (activeTab === "Colors") setActiveView("color");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-cyan-200">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">
            Manage your saved palettes and gradients
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 shrink-0 bg-white rounded-2xl shadow-lg p-4 h-fit">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 rounded-xl mb-1 flex items-center gap-3 text-sm font-medium ${
                  activeTab === tab
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span>
                  {tab === "Palettes" ? "🎨" : tab === "Colors" ? "🌈" : "🌀"}
                </span>{" "}
                {tab}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex items-center gap-4">
              <div className="relative flex-1">
                <div className="absolute left-3 top-3 text-gray-400">🔍</div>
                <input
                  type="text"
                  placeholder={`Search ${activeTab.toLowerCase()}...`}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-lg ${view === "grid" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                >
                  ▦
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 rounded-lg ${view === "list" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                >
                  ☰
                </button>
              </div>
            </div>

            {/* Palettes Grid */}
            {activeTab === "Palettes" && (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {filteredPalettes.length > 0 ? (
                  filteredPalettes.map((palette) => (
                    <div
                      key={palette.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden p-5"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-xl text-gray-900">
                          {palette.name}
                        </h3>

                        {/* Dropdown Menu */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === palette.id ? null : palette.id,
                              )
                            }
                            className="text-2xl text-gray-400 hover:text-gray-600 leading-none pb-2"
                          >
                            ...
                          </button>

                          {openMenuId === palette.id && (
                            <div className="absolute right-0 top-8 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden">
                              <div className="px-4 py-3 border-b border-gray-100 font-semibold text-gray-800">
                                Palette Settings
                              </div>
                              <div className="py-1">
                                <button
                                  onClick={() => handleCopyURL(palette.id)}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-3"
                                >
                                  <span>🔗</span> Copy share URL
                                </button>
                                <button
                                  onClick={() =>
                                    handleMoveToCollection(palette.id)
                                  }
                                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-3"
                                >
                                  <span>➡️</span> Move to collection
                                </button>
                                <button
                                  onClick={() => handleDownload(palette)}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-3"
                                >
                                  <span>⬇️</span> Download
                                </button>
                                <button
                                  onClick={() => deletePalette(palette.id)}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                                >
                                  <span>🗑️</span> Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Collection Edit Input */}
                      {editingCollectionId === palette.id ? (
                        <div className="flex gap-2 mb-4">
                          <input
                            type="text"
                            value={newCollectionName}
                            onChange={(e) =>
                              setNewCollectionName(e.target.value)
                            }
                            placeholder="New Collection Name"
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm"
                          />
                          <button
                            onClick={() => handleSaveCollection(palette.id)}
                            className="bg-gray-900 text-white text-xs px-3 rounded-lg"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            📁 {palette.collection}
                          </span>
                          <span className="flex items-center gap-1">
                            🌐 Untitled Collection
                          </span>
                        </div>
                      )}

                      {/* Rounded Color Strip */}
                      <div className="flex h-8 rounded-full overflow-hidden border border-gray-200">
                        {palette.colors.map((color, idx) => (
                          <div
                            key={idx}
                            style={{ backgroundColor: color }}
                            className="flex-1"
                          />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-white rounded-2xl p-12 text-center text-gray-500">
                    No saved palettes yet.
                  </div>
                )}
              </div>
            )}

            {/* Placeholder for Colors / Gradients */}
            {activeTab !== "Palettes" && (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
                No saved {activeTab.toLowerCase()} yet.
              </div>
            )}
          </div>
        </div>

        {/* Floating + Button (Routes to Creation Pages) */}
        <button
          onClick={handlePlusClick}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gray-900 text-white text-3xl shadow-xl hover:bg-gray-800 transition"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
