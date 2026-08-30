import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Dropdown State
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full max-w-[1120px] mx-auto flex items-center justify-between py-3 transition-colors relative z-50">
      {/* UPDATED: Logo now redirects to Main Picker (Home) */}
      <Link to="/" className="flex items-center gap-3 cursor-pointer">
        {/* Floral Logo Icon */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 25"
          className="h-8 w-8 shrink-0"
          aria-label="ImageColorPicker Logo"
          role="img"
        >
          <path
            d="M11.0827 9.43569L11.4154 3.77058C11.5491 1.50338 9.26647 -0.12923 7.16561 0.735151L7.06176 0.778418C4.98493 1.65434 4.55611 4.41574 6.23969 5.91278L10.4828 9.68567C10.5334 9.73054 10.5957 9.76025 10.6624 9.77139C10.7292 9.78254 10.7977 9.77467 10.8602 9.74869C10.9227 9.72271 10.9766 9.67967 11.0158 9.62449C11.055 9.5693 11.0779 9.50421 11.0818 9.43665L11.0827 9.43569ZM8.93668 11.5817C9.00424 11.5778 9.06933 11.555 9.12452 11.5158C9.1797 11.4766 9.22274 11.4227 9.24872 11.3602C9.2747 11.2977 9.28257 11.2292 9.27142 11.1624C9.26028 11.0957 9.23057 11.0334 9.1857 10.9827L5.41376 6.73967C3.91575 5.05513 1.15434 5.48492 0.27938 7.56174L0.235152 7.66654C-0.629232 9.76644 1.00339 12.0481 3.27059 11.9154L8.93668 11.5827V11.5817ZM13.5163 15.3133C13.4656 15.2684 13.4033 15.2387 13.3366 15.2276C13.2698 15.2164 13.2013 15.2243 13.1388 15.2503C13.0763 15.2762 13.0224 15.3193 12.9832 15.3745C12.944 15.4297 12.9212 15.4947 12.9173 15.5623L12.5846 21.2274C12.4509 23.4956 14.7335 25.1272 16.8344 24.2628L16.9382 24.2196C19.0151 23.3446 19.4449 20.5832 17.7603 19.0852L13.5182 15.3123L13.5172 15.3133H13.5163ZM15.0633 13.4172C14.9958 13.4211 14.9307 13.444 14.8755 13.4832C14.8203 13.5224 14.7773 13.5763 14.7513 13.6388C14.7253 13.7013 14.7174 13.7698 14.7286 13.8365C14.7397 13.9033 14.7694 13.9656 14.8143 14.0162L18.5862 18.2583C20.0842 19.9429 22.8457 19.5131 23.7206 17.4363L23.7648 17.3324C24.6292 15.2316 22.9966 12.9499 20.7294 13.0826L15.0643 13.4163L15.0633 13.4172ZM11.0827 15.5623C11.0788 15.4947 11.056 15.4297 11.0168 15.3745C10.9776 15.3193 10.9237 15.2762 10.8612 15.2503C10.7987 15.2243 10.7302 15.2164 10.6634 15.2276C10.5967 15.2387 10.5344 15.2684 10.4837 15.3133L6.23969 19.0862C4.55515 20.5842 4.98493 23.3456 7.06176 24.2215L7.16561 24.2648C9.26647 25.1292 11.5481 23.4975 11.4154 21.2293L11.0827 15.5642L11.0818 15.5633L11.0827 15.5623ZM9.1857 14.0162C9.23057 13.9656 9.26028 13.9033 9.27142 13.8365C9.28257 13.7698 9.2747 13.7013 9.24872 13.6388C9.22274 13.5763 9.1797 13.5224 9.12452 13.4832C9.06933 13.444 9.00424 13.4211 8.93668 13.4172L3.27155 13.0836C1.00339 12.9499 -0.62827 15.2325 0.236113 17.3334L0.27938 17.4372C1.15434 19.514 3.91575 19.9438 5.41376 18.2593L9.18667 14.0172L9.1857 14.0162Z"
            className="fill-(--foreground)"
          ></path>
          <path
            d="M12.695 12.4743C12.268 12.6116 11.877 12.1747 12.037 11.7409L15.075 3.55311C16.291 0.27794 20.382 -0.556405 22.692 2.00427C22.730 2.04682 22.768 2.08974 22.805 2.13303C25.075 4.69589 23.956 8.85678 20.756 9.88419L12.695 12.4743Z"
            className="fill-(--foreground)"
          ></path>
        </svg>
        <span className="font-medium text-[18px] text-foreground tracking-normal">
          ImageColorPicker.com
        </span>
      </Link>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* UPDATED: Tools Dropdown Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsToolsOpen(!isToolsOpen)}
            className={`flex items-center gap-1 border rounded-full px-4 py-2 text-sm font-medium transition shadow-xs ${
              isToolsOpen
                ? "bg-white border-gray-300 text-gray-900"
                : "border-border bg-card/50 backdrop-blur-md text-foreground hover:bg-card"
            }`}
          >
            Tools
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${isToolsOpen ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {isToolsOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[700px] bg-white border border-gray-100 rounded-2xl shadow-2xl p-6 text-left z-50">
              {/* Top Highlighted Item */}
              <Link
                to="/"
                onClick={() => setIsToolsOpen(false)}
                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-cyan-50 hover:from-pink-100 hover:to-cyan-100 transition mb-4"
              >
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl">
                  🖼️
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Pick color from image
                  </h3>
                  <p className="text-xs text-gray-500">
                    Upload, paste or link an image: get HEX, RGB, HSL
                  </p>
                </div>
              </Link>

              <div className="grid grid-cols-2 gap-6">
                {/* EXTRACT Column */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Extract
                  </h4>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="/color/2596be"
                        onClick={() => setIsToolsOpen(false)}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
                      >
                        <span className="text-lg text-gray-600">✏️</span>
                        <span>
                          <span className="block text-sm font-medium text-gray-800">
                            Color picker
                          </span>
                          <span className="block text-xs text-gray-500">
                            Explore any color: variations, harmony,
                            accessibility
                          </span>
                        </span>
                      </Link>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
                      >
                        <span className="text-lg text-gray-600">🔍</span>
                        <span>
                          <span className="block text-sm font-medium text-gray-800">
                            Contrast checker
                          </span>
                          <span className="block text-xs text-gray-500">
                            Check WCAG AA/AAA ratios for any color pair
                          </span>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
                      >
                        <span className="text-lg text-gray-600">👁️</span>
                        <span>
                          <span className="block text-sm font-medium text-gray-800">
                            Blindness simulator
                          </span>
                          <span className="block text-xs text-gray-500">
                            Preview how your colors look to color-blind users
                          </span>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
                      >
                        <span className="text-lg text-gray-600">🎨</span>
                        <span>
                          <span className="block text-sm font-medium text-gray-800">
                            Browse colors
                          </span>
                          <span className="block text-xs text-gray-500">
                            A catalog of named colors with codes
                          </span>
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>

                {/* CREATE Column */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Create
                  </h4>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="/dashboard/palette/create"
                        onClick={() => setIsToolsOpen(false)}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
                      >
                        <span className="text-lg text-gray-600">✨</span>
                        <span>
                          <span className="block text-sm font-medium text-gray-800">
                            Palette generator
                          </span>
                          <span className="block text-xs text-gray-500">
                            Auto-generate balanced palettes
                          </span>
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/gradient/create"
                        onClick={() => setIsToolsOpen(false)}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
                      >
                        <span className="text-lg text-gray-600">🌀</span>
                        <span>
                          <span className="block text-sm font-medium text-gray-800">
                            Gradient maker
                          </span>
                          <span className="block text-xs text-gray-500">
                            Build CSS gradients with live preview
                          </span>
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/palette/create"
                        onClick={() => setIsToolsOpen(false)}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
                      >
                        <span className="text-lg text-gray-600">📁</span>
                        <span>
                          <span className="block text-sm font-medium text-gray-800">
                            Palette creator
                          </span>
                          <span className="block text-xs text-gray-500">
                            Build a palette from scratch
                          </span>
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* YOUR LIBRARY Footer */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Your Library
                </h4>
                <div className="flex gap-6">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsToolsOpen(false)}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    <span>📊</span> Dashboard
                  </Link>
                  <Link
                    to="/dashboard/palette"
                    onClick={() => setIsToolsOpen(false)}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    <span>📂</span> Saved palettes
                  </Link>
                  <Link
                    to="/dashboard/gradient"
                    onClick={() => setIsToolsOpen(false)}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    <span>📁</span> Saved gradients
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Color Picker (Redirects home) */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 border border-border bg-card/50 backdrop-blur-md rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-card transition shadow-xs"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-pipette h-4 w-4"
          >
            <path d="m2 22 1-1h3l9-9"></path>
            <path d="M3 21v-3l9-9"></path>
            <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"></path>
          </svg>
          Color picker
        </button>

        {/* Support Us Button */}
        <button className="bg-accent hover:bg-yellow-300 text-black text-sm font-semibold px-4 py-2 rounded-full transition">
          ⭐ Star on Github
        </button>

        {/* Theme Toggle */}
        <div className="flex items-center justify-center border border-border bg-card/50 backdrop-blur-md rounded-full py-0.5 w-[78px] gap-1">
          <button
            onClick={() => isDark && toggleTheme()}
            className={`p-2 rounded-full transition ${!isDark ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          </button>
          <button
            onClick={() => !isDark && toggleTheme()}
            className={`p-2 rounded-full transition ${isDark ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </button>
        </div>

        {/* Login Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="border border-border bg-card/50 backdrop-blur-md hover:bg-card text-foreground text-sm font-semibold px-5 py-2 rounded-full transition"
        >
          Login
        </button>

        {/* Sign Up Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-foreground hover:opacity-80 text-background text-sm font-semibold px-5 py-2 rounded-full transition"
        >
          Sign up
        </button>
      </div>
    </header>
  );
};

export default Header;
