import React from "react";
import { useTheme } from "../hooks/useTheme";

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="w-full max-w-7xl mx-auto flex items-center justify-between py-4 px-6 bg-background transition-colors">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer">
        {/* Floral Logo Icon (uses currentColor) */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-foreground"
        >
          <path
            d="M12 2C13.5 2 14.7 3.2 14.7 4.7V12C14.7 13.5 13.5 14.7 12 14.7C10.5 14.7 9.3 13.5 9.3 12V4.7C9.3 3.2 10.5 2 12 2Z"
            fill="currentColor"
          />
          <path
            d="M2 12C2 10.5 3.2 9.3 4.7 9.3H12C13.5 9.3 14.7 10.5 14.7 12C14.7 13.5 13.5 14.7 12 14.7H4.7C3.2 14.7 2 13.5 2 12Z"
            fill="currentColor"
          />
          <path
            d="M12 22C10.5 22 9.3 20.8 9.3 19.3V12C9.3 10.5 10.5 9.3 12 9.3C13.5 9.3 14.7 10.5 14.7 12V19.3C14.7 20.8 13.5 22 12 22Z"
            fill="currentColor"
          />
          <path
            d="M22 12C22 13.5 20.8 14.7 19.3 14.7H12C10.5 14.7 9.3 13.5 9.3 12C9.3 10.5 10.5 9.3 12 9.3H19.3C20.8 9.3 22 10.5 22 12Z"
            fill="currentColor"
          />
        </svg>
        <span className="font-bold text-xl text-foreground tracking-tight">
          ImageColorPicker.com
        </span>
      </div>

      {/* Center Navigation */}
      <nav className="hidden lg:flex items-center gap-2">
        <button className="flex items-center gap-2 border border-border bg-card/50 backdrop-blur-md rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-card transition">
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
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <button className="flex items-center gap-2 border border-border bg-card/50 backdrop-blur-md rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-card transition">
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
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
          </svg>
          Color picker
        </button>
        <button className="px-4 py-2 text-sm font-medium text-foreground hover:opacity-70 transition">
          Pricing
        </button>
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Support Us Button */}
        <button className="bg-accent hover:bg-yellow-300 text-black text-sm font-semibold px-4 py-2 rounded-full transition">
          ⭐ Support us
        </button>

        {/* Theme Toggle */}
        <div className="flex items-center border border-border bg-card/50 backdrop-blur-md rounded-full p-1.5 gap-1">
          {/* Sun (Light) */}
          <button
            onClick={() => isDark && toggleTheme()}
            className={`p-1 rounded-full transition ${!isDark ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
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
          {/* Moon (Dark) */}
          <button
            onClick={() => !isDark && toggleTheme()}
            className={`p-1 rounded-full transition ${isDark ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
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
        <button className="border border-border bg-card/50 backdrop-blur-md hover:bg-card text-foreground text-sm font-semibold px-5 py-2 rounded-full transition">
          Login
        </button>

        {/* Sign Up Button */}
        <button className="bg-foreground hover:opacity-80 text-background text-sm font-semibold px-5 py-2 rounded-full transition">
          Sign up
        </button>
      </div>
    </header>
  );
};

export default Header;
