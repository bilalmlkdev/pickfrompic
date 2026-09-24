import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Pipette,
  Image as ImageIcon,
  Pencil,
  Sparkles,
  Spline,
  LayoutGrid,
  FolderOpen,
  FolderClosed,
} from "lucide-react";
import Logo from "../molecules/Logo";
import { LuGithub } from "react-icons/lu";
import { SiBuymeacoffee, SiProducthunt } from "react-icons/si";

const tools = [
  { to: "/", icon: ImageIcon, label: "Image picker", desc: "Extract from image" },
  { to: "/color/2596be", icon: Pencil, label: "Color picker", desc: "Explore any color" },
  { to: "/dashboard/palette/create", icon: Sparkles, label: "Palette generator", desc: "Auto-generate palettes" },
  { to: "/dashboard/gradient/create", icon: Spline, label: "Gradient maker", desc: "Build CSS gradients" },
];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const isMainPage = location.pathname === "/";
  const [prevPath, setPrevPath] = useState(location.pathname);

  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    if (pendingPath && location.pathname === pendingPath) {
      setPendingPath(null);
    }
  }

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
    const target = isMainPage ? "/color/2596be" : "/";
    setPendingPath(target);
    navigate(target);
  };

  const displayAsMainPage = pendingPath
    ? pendingPath === "/color/2596be"
    : isMainPage;

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsToolsOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setIsToolsOpen(false), 150);
  };

  return (
    <header className="w-full max-w-[1120px] mx-auto flex items-center justify-between py-3 px-4 lg:px-0 relative z-50">
      <Logo />

      <div className="flex items-center gap-1.5 sm:gap-2">
        <div
          className="relative"
          ref={dropdownRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={() => setIsToolsOpen(!isToolsOpen)}
            aria-label="Open tools menu"
            aria-expanded={isToolsOpen}
            className={`flex items-center gap-1 rounded-full px-3 h-8 text-xs sm:text-sm font-medium transition-colors ${
              isToolsOpen
                ? "bg-white text-foreground shadow-sm"
                : "bg-white/80 backdrop-blur-md text-foreground hover:bg-gray-100"
            }`}
          >
            Tools
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${isToolsOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isToolsOpen && (
            <div className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-2 w-64 bg-card border border-border rounded-2xl shadow-2xl p-2 text-left z-50">
              {tools.map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  onClick={() => setIsToolsOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-muted group-hover:bg-card flex items-center justify-center shrink-0 transition-colors">
                    <tool.icon
                      size={15}
                      className="text-muted-foreground group-hover:text-foreground"
                    />
                  </div>
                  <div>
                    <span className="block text-[13px] font-medium text-foreground leading-tight">
                      {tool.label}
                    </span>
                    <span className="block text-[11px] text-muted-foreground leading-tight">
                      {tool.desc}
                    </span>
                  </div>
                </Link>
              ))}

              <div className="my-1.5 border-t border-border" />

              <div className="px-2.5 pb-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Library
                </span>
              </div>
              <div className="flex flex-col">
                <Link
                  to="/dashboard"
                  onClick={() => setIsToolsOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-muted transition-colors text-[13px] text-foreground/80 hover:text-foreground"
                >
                  <LayoutGrid size={13} /> Dashboard
                </Link>
                <Link
                  to="/dashboard/palette"
                  onClick={() => setIsToolsOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-muted transition-colors text-[13px] text-foreground/80 hover:text-foreground"
                >
                  <FolderOpen size={13} /> Palettes
                </Link>
                <Link
                  to="/dashboard/gradient"
                  onClick={() => setIsToolsOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-muted transition-colors text-[13px] text-foreground/80 hover:text-foreground"
                >
                  <FolderClosed size={13} /> Gradients
                </Link>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handlePickerToggle}
          aria-label={
            displayAsMainPage ? "Switch to color picker" : "Switch to image picker"
          }
          className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md rounded-full pl-2.5 pr-3 h-8  text-xs sm:text-sm font-medium text-foreground hover:bg-gray-100 shadow-sm transition-colors"
        >
          <Pipette size={13} />
          <span className="hidden sm:inline">
            {displayAsMainPage ? "Color picker" : "Image picker"}
          </span>
        </button>

        <a
          href="https://www.producthunt.com/products/pickfrompic?utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-pickfrompic"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Featured on Product Hunt"
          className="flex items-center gap-1 bg-white/80 backdrop-blur-md rounded-full pl-2.5 pr-3 h-8 text-xs sm:text-sm font-medium text-foreground hover:bg-gray-100 shadow-sm transition-colors"
        >
          <SiProducthunt size={14} />
          <span className="hidden sm:inline">Product Hunt</span>
        </a>

        <a
          href="https://ko-fi.com/bilalmlkdev"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Support on Ko-fi"
          className="flex items-center gap-1 bg-black text-white rounded-full px-3 h-8 text-xs sm:text-sm font-medium hover:bg-gray-800 shadow-sm transition-colors"
        >
          <SiBuymeacoffee size={14} />
          <span className="hidden sm:inline">Support</span>
        </a>

        <a
          href="https://github.com/bilalmlkdev/pickfrompic"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
          className="flex items-center gap-1 bg-white/80 backdrop-blur-md rounded-full pl-2.5 pr-3 h-8  text-xs sm:text-sm font-medium text-foreground hover:bg-gray-100 shadow-sm transition-colors"
        >
          <LuGithub size={14.5} />
          <span className="hidden sm:inline">Star on Github</span>
        </a>
      </div>
    </header>
  );
};

export default Header;

