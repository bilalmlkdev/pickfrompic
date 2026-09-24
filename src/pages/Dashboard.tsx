import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  LayoutGrid,
  List,
  MoreHorizontal,
  Link2,
  Download,
  Trash2,
  Palette as PaletteIcon,
  Droplets,
  Spline,
  Plus,
  Check,
  X,
} from "lucide-react";
import { useDashboard, type Palette, type Color, type Gradient } from "../context/DashboardContext";
import CreatePalette from "./CreatePalette";
import GradientMaker from "./GradientMaker";
import ColorConversion from "./ColorConversion";
import { downloadFile, convertToCss } from "../utils/exportUtils";
import Input from "../components/atoms/Input";
import IconButton from "../components/atoms/IconButton";

const Dashboard: React.FC = () => {
  const { tab = "palette" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { palettes, colors, gradients, deletePalette, deleteColor, deleteGradient } =
    useDashboard();

  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isCreatePage = location.pathname.endsWith("/create");

  if (isCreatePage) {
    if (tab === "palette") return <CreatePalette />;
    if (tab === "gradient") return <GradientMaker />;
    if (tab === "color") return <ColorConversion />;
  }

  const displayTab = tab === "color" ? "Colors" : tab === "gradient" ? "Gradients" : "Palettes";
  const tabs: { label: string; icon: React.ReactNode }[] = [
    { label: "Palettes", icon: <PaletteIcon size={15} /> },
    { label: "Colors", icon: <Droplets size={15} /> },
    { label: "Gradients", icon: <Spline size={15} /> },
  ];

  const toggleSelectMode = () => {
    setSelectMode((prev) => !prev);
    setSelectedIds(new Set());
    setOpenMenuId(null);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = (ids: string[]) => {
    setSelectedIds((prev) => {
      if (prev.size === ids.length) return new Set();
      return new Set(ids);
    });
  };

  const deleteSelected = () => {
    selectedIds.forEach((id) => {
      if (displayTab === "Palettes") deletePalette(id);
      else if (displayTab === "Colors") deleteColor(id);
      else if (displayTab === "Gradients") deleteGradient(id);
    });
    setSelectedIds(new Set());
    setSelectMode(false);
  };

  const handleCopyURL = async (item: Palette | Color | Gradient) => {
    try {
      if ("hex" in item) {
        await navigator.clipboard.writeText(
          `${window.location.origin}/color/${String(item.hex).replace("#", "")}`,
        );
      } else if ("colors" in item && displayTab === "Palettes") {
        await navigator.clipboard.writeText(convertToCss(item.colors));
      } else if ("colors" in item) {
        await navigator.clipboard.writeText(
          `background: linear-gradient(90deg, ${item.colors.join(", ")});`,
        );
      }
    } catch {
      // clipboard access denied
    }
    setOpenMenuId(null);
  };

  const handleDownload = async (item: Palette | Color | Gradient) => {
    if (displayTab === "Palettes") {
      const p = item as Palette;
      downloadFile(`${p.name}.css`, convertToCss(p.colors), "text/css");
    } else if (displayTab === "Colors") {
      try {
        await navigator.clipboard.writeText((item as Color).hex);
      } catch {
        // clipboard access denied
      }
    } else if (displayTab === "Gradients") {
      const g = item as Gradient;
      const c0 = encodeURIComponent(g.colors[0]);
      const c1 = encodeURIComponent(g.colors[1] || g.colors[0]);
      const a = document.createElement("a");
      a.href = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='${c0}'/><stop offset='100%' stop-color='${c1}'/></linearGradient></defs><rect width='400' height='400' fill='url(%23g)'/></svg>`;
      a.download = `${g.name}.svg`;
      a.click();
    }
    setOpenMenuId(null);
  };

  const handlePlusClick = () => navigate(`/dashboard/${tab}/create`);

  const filteredPalettes = palettes.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  const filteredColors = colors.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const filteredGradients = gradients.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));

  const currentItems =
    displayTab === "Palettes" ? filteredPalettes :
    displayTab === "Colors" ? filteredColors :
    filteredGradients;
  const hasItems = currentItems.length > 0;

  const DropdownMenu = ({ id, item }: { id: string; item: Palette | Color | Gradient }) => (
    <div className="relative">
      <button
        onClick={() => setOpenMenuId(openMenuId === id ? null : id)}
        aria-label="More options"
        className="text-muted-foreground hover:text-foreground transition-colors p-1 -m-1"
      >
        <MoreHorizontal size={18} />
      </button>
      {openMenuId === id && (
        <div className="absolute right-0 top-8 w-52 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border font-semibold text-xs text-foreground">
            Item Settings
          </div>
          <div className="py-1">
            <button
              onClick={() => handleCopyURL(item)}
              className="w-full text-left px-4 py-2 text-[13px] text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2.5"
            >
              <Link2 size={14} />{" "}
              {"hex" in item ? "Copy color URL" : "Copy CSS"}
            </button>
            <button
              onClick={() => handleDownload(item)}
              className="w-full text-left px-4 py-2 text-[13px] text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2.5"
            >
              <Download size={14} /> Download
            </button>
            <button
              onClick={() => {
                if (displayTab === "Palettes") deletePalette(id);
                else if (displayTab === "Colors") deleteColor(id);
                else if (displayTab === "Gradients") deleteGradient(id);
                setOpenMenuId(null);
              }}
              className="w-full text-left px-4 py-2 text-[13px] text-danger hover:bg-danger/10 flex items-center gap-2.5"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const SelectCheckbox = ({ id }: { id: string }) => (
    <button
      onClick={(e) => { e.stopPropagation(); toggleSelect(id); }}
      className={`absolute top-3 left-3 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors z-10 ${
        selectedIds.has(id)
          ? "bg-foreground border-foreground"
          : "bg-card border-border hover:border-foreground/50"
      }`}
    >
      {selectedIds.has(id) && <Check size={12} className="text-background" />}
    </button>
  );

  return (
    <div className="flex-1 w-full mt-12">
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1.5">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Manage your saved palettes and gradients</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-56 shrink-0 bg-card border border-border rounded-2xl shadow-sm p-3 h-fit">
            {tabs.map((t) => {
              const tabPath = t.label.toLowerCase().replace(/s$/, "");
              return (
                <button
                  key={t.label}
                  onClick={() => navigate(`/dashboard/${tabPath}`)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl mb-1 flex items-center gap-2.5 text-sm font-medium transition-colors ${
                    displayTab === t.label
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/60"
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              );
            })}
          </div>

          <div className="flex-1">
            <div className="bg-card border border-border rounded-2xl shadow-sm p-3.5 mb-5 flex items-center gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={`Search ${displayTab.toLowerCase()}...`}
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-1">
                {!selectMode ? (
                  <>
                    <IconButton active={view === "grid"} onClick={() => setView("grid")} disabled={!hasItems}>
                      <LayoutGrid size={14} />
                    </IconButton>
                    <IconButton active={view === "list"} onClick={() => setView("list")} disabled={!hasItems}>
                      <List size={14} />
                    </IconButton>
                    <IconButton onClick={toggleSelectMode} title="Select items" disabled={!hasItems}>
                      <Check size={14} />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        const allIds = displayTab === "Palettes"
                          ? filteredPalettes.map((p) => p.id)
                          : displayTab === "Colors"
                            ? filteredColors.map((c) => c.id)
                            : filteredGradients.map((g) => g.id);
                        selectAll(allIds);
                      }}
                      disabled={!hasItems}
                      className="px-3 h-8 rounded-lg text-xs font-medium bg-muted text-foreground hover:bg-muted/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {selectedIds.size === (
                        displayTab === "Palettes"
                          ? filteredPalettes.length
                          : displayTab === "Colors"
                            ? filteredColors.length
                            : filteredGradients.length
                      ) ? "Deselect all" : "Select all"}
                    </button>
                    {selectedIds.size > 0 && (
                      <button
                        onClick={deleteSelected}
                        className="px-3 h-8 rounded-lg text-xs font-medium bg-danger/10 text-danger hover:bg-danger/20 transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 size={13} />
                        Delete ({selectedIds.size})
                      </button>
                    )}
                    <button
                      onClick={toggleSelectMode}
                      className="px-3 h-8 rounded-lg text-xs font-medium bg-muted text-foreground hover:bg-muted/80 transition-colors flex items-center gap-1.5"
                    >
                      <X size={13} />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {displayTab === "Palettes" && (
              <>
                <div
                  className={
                    view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" : "flex flex-col gap-3"
                  }
                >
                  {filteredPalettes.length > 0 ? (
                    filteredPalettes.map((palette) => (
                      <div
                        key={palette.id}
                        onClick={() => selectMode && toggleSelect(palette.id)}
                        className={`bg-card border rounded-2xl shadow-sm p-4 relative transition-all ${
                          selectMode ? "cursor-pointer" : ""
                        } ${
                          selectedIds.has(palette.id)
                            ? "border-foreground ring-1 ring-foreground"
                            : "border-border"
                        }`}
                      >
                        {selectMode && <SelectCheckbox id={palette.id} />}
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-[15px] text-foreground truncate">{palette.name}</h3>
                          {!selectMode && <DropdownMenu id={palette.id} item={palette} />}
                        </div>
                        <div className="flex h-7 rounded-full overflow-hidden border border-border">
                          {palette.colors.map((color, idx) => (
                            <div key={idx} style={{ backgroundColor: color }} className="flex-1" />
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground text-sm">
                      No saved palettes yet.
                    </div>
                  )}
                </div>
                <button
                  onClick={handlePlusClick}
                  className="w-full mt-5 h-20  flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center">
                    <Plus size={18} className="text-card" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">New Palette</span>
                </button>
              </>
            )}

            {displayTab === "Colors" && (
              <>
                <div
                  className={
                    view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" : "flex flex-col gap-3"
                  }
                >
                  {filteredColors.length > 0 ? (
                    filteredColors.map((color) => (
                      <div
                        key={color.id}
                        onClick={() => selectMode && toggleSelect(color.id)}
                        className={`bg-card border rounded-2xl shadow-sm p-4 relative transition-all ${
                          selectMode ? "cursor-pointer" : ""
                        } ${
                          selectedIds.has(color.id)
                            ? "border-foreground ring-1 ring-foreground"
                            : "border-border"
                        }`}
                      >
                        {selectMode && <SelectCheckbox id={color.id} />}
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-[15px] text-foreground truncate">{color.name}</h3>
                          {!selectMode && <DropdownMenu id={color.id} item={color} />}
                        </div>
                        <div
                          className="h-11 w-full rounded-xl border border-border"
                          style={{ backgroundColor: color.hex }}
                        ></div>
                        <p className="mt-2 font-mono text-xs text-muted-foreground">{color.hex}</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground text-sm">
                      No saved colors yet.
                    </div>
                  )}
                </div>
                <button
                  onClick={handlePlusClick}
                  className="w-full mt-5 h-20  flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center">
                    <Plus size={18} className="text-card" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">New Color</span>
                </button>
              </>
            )}

            {displayTab === "Gradients" && (
              <>
                <div
                  className={
                    view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" : "flex flex-col gap-3"
                  }
                >
                  {filteredGradients.length > 0 ? (
                    filteredGradients.map((gradient) => (
                      <div
                        key={gradient.id}
                        onClick={() => selectMode && toggleSelect(gradient.id)}
                        className={`bg-card border rounded-2xl shadow-sm p-4 relative transition-all ${
                          selectMode ? "cursor-pointer" : ""
                        } ${
                          selectedIds.has(gradient.id)
                            ? "border-foreground ring-1 ring-foreground"
                            : "border-border"
                        }`}
                      >
                        {selectMode && <SelectCheckbox id={gradient.id} />}
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-[15px] text-foreground truncate">{gradient.name}</h3>
                          {!selectMode && <DropdownMenu id={gradient.id} item={gradient} />}
                        </div>
                        <div
                          className="h-11 w-full rounded-xl border border-border"
                          style={{ background: `linear-gradient(to right, ${gradient.colors.join(", ")})` }}
                        ></div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground text-sm">
                      No saved gradients yet.
                    </div>
                  )}
                </div>
                <button
                  onClick={handlePlusClick}
                  className="w-full mt-5 h-20 flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center">
                    <Plus size={18} className="text-card" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">New Gradient</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
