import React, { useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";
import CreatePalette from "./CreatePalette";
import GradientMaker from "./GradientMaker";
import ColorConversion from "./ColorConversion";
import { downloadFile, convertToCss } from "../utils/exportUtils";

const Dashboard: React.FC = () => {
  const { tab = "palette" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { palettes, deletePalette, updatePalette } = useDashboard();

  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(
    null,
  );
  const [newCollectionName, setNewCollectionName] = useState("");

  // FIX: Correctly check if the URL ends with /create
  const isCreatePage = location.pathname.endsWith("/create");

  const activeTab = tab.charAt(0).toUpperCase() + tab.slice(1);

  // FIX: Render creation pages based on the isCreatePage check
  if (isCreatePage) {
    if (tab === "palette") return <CreatePalette />;
    if (tab === "gradient") return <GradientMaker />;
    if (tab === "color") return <ColorConversion />;
  }

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

  const handlePlusClick = () => {
    navigate(`/dashboard/${tab}/create`);
  };

  const displayTab =
    tab === "color" ? "Colors" : tab === "gradient" ? "Gradients" : "Palettes";

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-cyan-200">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-12 relative">
          <Link
            to="/"
            className="absolute left-0 top-2 text-blue-600 underline hover:text-blue-800"
          >
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">
            Manage your saved palettes and gradients
          </p>
        </div>

        <div className="flex gap-8">
          <div className="w-64 shrink-0 bg-white rounded-2xl shadow-lg p-4 h-fit">
            {tabs.map((t) => {
              const tabPath = t.toLowerCase().replace(/s$/, "");
              return (
                <button
                  key={t}
                  onClick={() => navigate(`/dashboard/${tabPath}`)}
                  className={`w-full text-left px-4 py-3 rounded-xl mb-1 flex items-center gap-3 text-sm font-medium ${
                    displayTab === t
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span>
                    {t === "Palettes" ? "🎨" : t === "Colors" ? "🌈" : "🌀"}
                  </span>{" "}
                  {t}
                </button>
              );
            })}
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex items-center gap-4">
              <div className="relative flex-1">
                <div className="absolute left-3 top-3 text-gray-400">🔍</div>
                <input
                  type="text"
                  placeholder={`Search ${displayTab.toLowerCase()}...`}
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

            {displayTab === "Palettes" && (
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

            {displayTab !== "Palettes" && (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
                No saved {displayTab.toLowerCase()} yet.
              </div>
            )}
          </div>
        </div>

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
