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
  const { palettes, colors, gradients, deletePalette, deleteColor, deleteGradient, updatePalette } = useDashboard();

  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [newCollectionName, setNewCollectionName] = useState("");

  const isCreatePage = location.pathname.endsWith('/create');

  if (isCreatePage) {
    if (tab === "palette") return <CreatePalette />;
    if (tab === "gradient") return <GradientMaker />;
    if (tab === "color") return <ColorConversion />;
  }

  const displayTab = tab === "color" ? "Colors" : tab === "gradient" ? "Gradients" : "Palettes";
  const tabs = ["Palettes", "Colors", "Gradients"];

  const handleCopyURL = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/item/${id}`);
    setOpenMenuId(null);
  };

  const handleDownload = (item: any) => {
    if (displayTab === "Palettes") downloadFile(`${item.name}.css`, convertToCss(item.colors), "text/css");
    else if (displayTab === "Colors") navigator.clipboard.writeText(item.hex);
    else if (displayTab === "Gradients") {
      const a = document.createElement('a');
      a.href = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='${item.colors[0]}'/><stop offset='100%' stop-color='${item.colors[1] || item.colors[0]}'/></linearGradient></defs><rect width='400' height='400' fill='url(%23g)'/></svg>`;
      a.download = `${item.name}.svg`;
      a.click();
    }
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

  const handlePlusClick = () => navigate(`/dashboard/${tab}/create`);

  const filteredPalettes = palettes.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  const filteredColors = colors.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const filteredGradients = gradients.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));

  const DropdownMenu = ({ id }: { id: string }) => (
    <div className="relative">
      <button onClick={() => setOpenMenuId(openMenuId === id ? null : id)} className="text-2xl text-gray-400 hover:text-gray-600 leading-none pb-2">...</button>
      {openMenuId === id && (
        <div className="absolute right-0 top-8 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 font-semibold text-gray-800">Item Settings</div>
          <div className="py-1">
            <button onClick={() => handleCopyURL(id)} className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-3"><span>🔗</span> Copy share URL</button>
            <button onClick={() => handleDownload(id)} className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-3"><span>⬇️</span> Download</button>
            <button onClick={() => {
              if (displayTab === "Palettes") deletePalette(id);
              else if (displayTab === "Colors") deleteColor(id);
              else if (displayTab === "Gradients") deleteGradient(id);
              setOpenMenuId(null);
            }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"><span>🗑️</span> Delete</button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-cyan-200">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-12 relative">
          <Link to="/" className="absolute left-0 top-2 text-blue-600 underline hover:text-blue-800">← Back to Home</Link>
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">Manage your saved palettes and gradients</p>
        </div>

        <div className="flex gap-8">
          <div className="w-64 shrink-0 bg-white rounded-2xl shadow-lg p-4 h-fit">
            {tabs.map((t) => {
              const tabPath = t.toLowerCase().replace(/s$/, "");
              return (
                <button key={t} onClick={() => navigate(`/dashboard/${tabPath}`)} className={`w-full text-left px-4 py-3 rounded-xl mb-1 flex items-center gap-3 text-sm font-medium ${displayTab === t ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50"}`}>
                  <span>{t === "Palettes" ? "🎨" : t === "Colors" ? "🌈" : "🌀"}</span> {t}
                </button>
              );
            })}
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex items-center gap-4">
              <div className="relative flex-1">
                <div className="absolute left-3 top-3 text-gray-400">🔍</div>
                <input type="text" placeholder={`Search ${displayTab.toLowerCase()}...`} className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="flex gap-1">
                <button onClick={() => setView("grid")} className={`p-2 rounded-lg ${view === "grid" ? "bg-gray-200" : "hover:bg-gray-100"}`}>▦</button>
                <button onClick={() => setView("list")} className={`p-2 rounded-lg ${view === "list" ? "bg-gray-200" : "hover:bg-gray-100"}`}>☰</button>
              </div>
            </div>

            {/* PALETTES TAB */}
            {displayTab === "Palettes" && (
              <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                {filteredPalettes.length > 0 ? filteredPalettes.map((palette) => (
                  <div key={palette.id} className="bg-white rounded-2xl shadow-lg overflow-hidden p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-xl text-gray-900">{palette.name}</h3>
                      <DropdownMenu id={palette.id} />
                    </div>
                    <div className="flex h-8 rounded-full overflow-hidden border border-gray-200">
                      {palette.colors.map((color, idx) => <div key={idx} style={{ backgroundColor: color }} className="flex-1" />)}
                    </div>
                  </div>
                )) : <div className="col-span-full bg-white rounded-2xl p-12 text-center text-gray-500">No saved palettes yet.</div>}
              </div>
            )}

            {/* COLORS TAB */}
            {displayTab === "Colors" && (
              <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                {filteredColors.length > 0 ? filteredColors.map((color) => (
                  <div key={color.id} className="bg-white rounded-2xl shadow-lg overflow-hidden p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-xl text-gray-900">{color.name}</h3>
                      <DropdownMenu id={color.id} />
                    </div>
                    <div className="h-12 w-full rounded-xl border border-gray-200" style={{ backgroundColor: color.hex }}></div>
                    <p className="mt-2 font-mono text-sm text-gray-600">{color.hex}</p>
                  </div>
                )) : <div className="col-span-full bg-white rounded-2xl p-12 text-center text-gray-500">No saved colors yet.</div>}
              </div>
            )}

            {/* GRADIENTS TAB */}
            {displayTab === "Gradients" && (
              <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                {filteredGradients.length > 0 ? filteredGradients.map((gradient) => (
                  <div key={gradient.id} className="bg-white rounded-2xl shadow-lg overflow-hidden p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-xl text-gray-900">{gradient.name}</h3>
                      <DropdownMenu id={gradient.id} />
                    </div>
                    <div className="h-12 w-full rounded-xl border border-gray-200" style={{ background: `linear-gradient(to right, ${gradient.colors.join(', ')})` }}></div>
                  </div>
                )) : <div className="col-span-full bg-white rounded-2xl p-12 text-center text-gray-500">No saved gradients yet.</div>}
              </div>
            )}
          </div>
        </div>

        <button onClick={handlePlusClick} className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gray-900 text-white text-3xl shadow-xl hover:bg-gray-800 transition">+</button>
      </div>
    </div>
  );
};

export default Dashboard;
