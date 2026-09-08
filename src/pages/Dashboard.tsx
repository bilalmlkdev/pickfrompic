import React, { useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
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
  const { palettes, colors, gradients, deletePalette, deleteColor, deleteGradient, updatePalette } =
    useDashboard();

  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [newCollectionName, setNewCollectionName] = useState("");

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

  const handleCopyURL = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/item/${id}`);
    setOpenMenuId(null);
  };

  const handleDownload = (item: Palette | Color | Gradient) => {
    if (displayTab === "Palettes") {
      const p = item as Palette;
      downloadFile(`${p.name}.css`, convertToCss(p.colors), "text/css");
    } else if (displayTab === "Colors") {
      navigator.clipboard.writeText((item as Color).hex);
    } else if (displayTab === "Gradients") {
      const g = item as Gradient;
      const a = document.createElement("a");
      a.href = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='${g.colors[0]}'/><stop offset='100%' stop-color='${g.colors[1] || g.colors[0]}'/></linearGradient></defs><rect width='400' height='400' fill='url(%23g)'/></svg>`;
      a.download = `${g.name}.svg`;
      a.click();
    }
    setOpenMenuId(null);
  };

  const handlePlusClick = () => navigate(`/dashboard/${tab}/create`);

  const filteredPalettes = palettes.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  const filteredColors = colors.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const filteredGradients = gradients.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));

  void editingCollectionId;
  void newCollectionName;
  void setEditingCollectionId;
  void setNewCollectionName;
  void updatePalette;

  const DropdownMenu = ({ id, item }: { id: string; item: Palette | Color | Gradient }) => (
    <div className="relative">
      <button
        onClick={() => setOpenMenuId(openMenuId === id ? null : id)}
        className="text-muted-foreground hover:text-foreground transition-colors p-1 -m-1"
      >
        <MoreHorizontal size={18} />
      </button>
      {openMenuId === id && (
        <div className="absolute right-0 top-8 w-52 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border font-semibold text-xs text-foreground">
            Item Settings
          </div>
          <div className="py-1">
            <button
              onClick={() => handleCopyURL(id)}
              className="w-full text-left px-4 py-2 text-[13px] text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2.5"
            >
              <Link2 size={14} /> Copy share URL
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

  return (
    <div className="flex-1 w-full mt-15">
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <div className="text-center mb-8 relative">
          <Link
            to="/"
            className="absolute left-0 top-2 text-link text-sm font-medium hover:underline flex items-center gap-1.5"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
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
                <IconButton active={view === "grid"} onClick={() => setView("grid")}>
                  <LayoutGrid size={14} />
                </IconButton>
                <IconButton active={view === "list"} onClick={() => setView("list")}>
                  <List size={14} />
                </IconButton>
              </div>
            </div>

            {displayTab === "Palettes" && (
              <div
                className={
                  view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" : "flex flex-col gap-3"
                }
              >
                {filteredPalettes.length > 0 ? (
                  filteredPalettes.map((palette) => (
                    <div
                      key={palette.id}
                      className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-[15px] text-foreground truncate">{palette.name}</h3>
                        <DropdownMenu id={palette.id} item={palette} />
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
            )}

            {displayTab === "Colors" && (
              <div
                className={
                  view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" : "flex flex-col gap-3"
                }
              >
                {filteredColors.length > 0 ? (
                  filteredColors.map((color) => (
                    <div
                      key={color.id}
                      className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-[15px] text-foreground truncate">{color.name}</h3>
                        <DropdownMenu id={color.id} item={color} />
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
            )}

            {displayTab === "Gradients" && (
              <div
                className={
                  view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" : "flex flex-col gap-3"
                }
              >
                {filteredGradients.length > 0 ? (
                  filteredGradients.map((gradient) => (
                    <div
                      key={gradient.id}
                      className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-[15px] text-foreground truncate">{gradient.name}</h3>
                        <DropdownMenu id={gradient.id} item={gradient} />
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
            )}
          </div>
        </div>

        <button
          onClick={handlePlusClick}
          className="fixed bottom-7 right-7 w-13 h-13 rounded-full bg-foreground text-background shadow-xl hover:opacity-90 transition flex items-center justify-center"
          style={{ width: 52, height: 52 }}
        >
          <Plus size={22} />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
