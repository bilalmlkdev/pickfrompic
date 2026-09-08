import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Pipette,
  Star,
  Image as ImageIcon,
  Pencil,
  Search as SearchIcon,
  Eye,
  Palette as PaletteIcon,
  Sparkles,
  Spline,
  FolderOpen,
  LayoutGrid,
  FolderClosed,
  GitBranchPlus,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import Logo from "../molecules/Logo";
import ThemeToggle from "../molecules/ThemeToggle";
import Button from "../atoms/Button";

const extractLinks = [
  {
    to: "/color/2596be",
    icon: Pencil,
    title: "Color picker",
    desc: "Explore any color: variations, harmony, accessibility",
  },
  {
    to: "/contrast-checker",
    icon: Eye,
    title: "Contrast checker",
    desc: "Check WCAG AA/AAA ratios for any color pair",
  },
  {
    to: "#",
    icon: SearchIcon,
    title: "Blindness simulator",
    desc: "Preview how your colors look to color-blind users",
  },
  {
    to: "#",
    icon: PaletteIcon,
    title: "Browse colors",
    desc: "A catalog of named colors with codes",
  },
];

const createLinks = [
  {
    to: "/dashboard/palette/create",
    icon: Sparkles,
    title: "Palette generator",
    desc: "Auto-generate balanced palettes",
  },
  {
    to: "/dashboard/gradient/create",
    icon: Spline,
    title: "Gradient maker",
    desc: "Build CSS gradients with live preview",
  },
  {
    to: "/dashboard/palette/create",
    icon: FolderClosed,
    title: "Palette creator",
    desc: "Build a palette from scratch",
  },
];

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isColorPage = location.pathname.startsWith("/color/");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePickerToggle = () => {
    if (isColorPage) navigate("/");
    else navigate("/color/2596be");
  };

  return (
    <header className="w-full max-w-[1120px] mx-auto flex items-center justify-between py-3 px-4 lg:px-0 relative z-50">
      <Logo />

      <div className="flex items-center gap-2">
        {/* Tools Dropdown */}
        <div className="relative hidden md:block" ref={dropdownRef}>
          <button
            onClick={() => setIsToolsOpen(!isToolsOpen)}
            className={`flex items-center gap-1 rounded-full px-3.5 h-9 text-sm font-medium shadow-xs ${
              isToolsOpen
                ? "bg-card text-foreground"
                : " bg-card/50 backdrop-blur-md text-foreground hover:bg-card"
            }`}
          >
            Tools
            <ChevronDown
              size={14}
              className={`transition-transform ${isToolsOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isToolsOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[640px] bg-card border border-border rounded-2xl shadow-2xl p-5 text-left z-50">
              <Link
                to="/"
                onClick={() => setIsToolsOpen(false)}
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-muted/60 hover:bg-muted transition mb-4"
              >
                <div className="w-10 h-10 bg-card rounded-lg shadow-sm flex items-center justify-center shrink-0">
                  <ImageIcon size={18} className="text-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-[13px] text-foreground">
                    Pick color from image
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Upload, paste or link an image: get HEX, RGB, HSL
                  </p>
                </div>
              </Link>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Extract
                  </h4>
                  <ul className="space-y-0.5">
                    {extractLinks.map((item) => (
                      <li key={item.title}>
                        <Link
                          to={item.to}
                          onClick={(e) => {
                            if (item.to === "#") e.preventDefault();
                            setIsToolsOpen(false);
                          }}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted"
                        >
                          <item.icon size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                          <span>
                            <span className="block text-[13px] font-medium text-foreground">
                              {item.title}
                            </span>
                            <span className="block text-xs text-muted-foreground">{item.desc}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Create
                  </h4>
                  <ul className="space-y-0.5">
                    {createLinks.map((item) => (
                      <li key={item.title}>
                        <Link
                          to={item.to}
                          onClick={() => setIsToolsOpen(false)}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted"
                        >
                          <item.icon size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                          <span>
                            <span className="block text-[13px] font-medium text-foreground">
                              {item.title}
                            </span>
                            <span className="block text-xs text-muted-foreground">{item.desc}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-border">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
                  Your Library
                </h4>
                <div className="flex gap-5">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsToolsOpen(false)}
                    className="flex items-center gap-1.5 text-[13px] text-foreground/80 hover:text-foreground"
                  >
                    <LayoutGrid size={14} /> Dashboard
                  </Link>
                  <Link
                    to="/dashboard/palette"
                    onClick={() => setIsToolsOpen(false)}
                    className="flex items-center gap-1.5 text-[13px] text-foreground/80 hover:text-foreground"
                  >
                    <FolderOpen size={14} /> Saved palettes
                  </Link>
                  <Link
                    to="/dashboard/gradient"
                    onClick={() => setIsToolsOpen(false)}
                    className="flex items-center gap-1.5 text-[13px] text-foreground/80 hover:text-foreground"
                  >
                    <FolderClosed size={14} /> Saved gradients
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Color / Image Picker toggle */}
        <button
          onClick={handlePickerToggle}
          className="hidden sm:flex items-center gap-1.5 bg-card/50 backdrop-blur-md rounded-full pl-3 pr-3.5 h-9 text-sm font-medium text-foreground hover:bg-card shadow-sm"
        >
          <Pipette size={14} />
          {isColorPage ? "Image picker" : "Color picker"}
        </button>

        {/* Support us */}
        <Button variant="accent" size="sm" icon={<GitBranchPlus size={13} fill="currentColor" />} className="hidden lg:inline-flex">
          Star on Github
        </Button>

        <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
      </div>
    </header>
  );
};

export default Header;
