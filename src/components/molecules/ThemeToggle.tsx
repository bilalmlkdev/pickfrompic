import React from "react";
import { Moon, Sun } from "lucide-react";

interface Props {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<Props> = ({ isDark, toggleTheme }) => {
  return (
    <div className="flex items-center justify-center border border-border bg-card/50 backdrop-blur-md rounded-full p-0.5 gap-1.5 shrink-0">
      <button
        onClick={() => isDark && toggleTheme()}
        aria-label="Light mode"
        className={`p-2 rounded-full transition-colors ${!isDark ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
      >
        <Sun size={14} />
      </button>
      <button
        onClick={() => !isDark && toggleTheme()}
        aria-label="Dark mode"
        className={`p-2 rounded-full transition-colors ${isDark ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
      >
        <Moon size={14} />
      </button>
    </div>
  );
};

export default ThemeToggle;
