import { useEffect, useState } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // 1. Check saved preference
    const saved = localStorage.getItem("pickfrompic-theme");
    if (saved) return saved === "dark";
    // 2. Fallback to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // Toggle the `.dark` class on the root <html> element
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("pickfrompic-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("pickfrompic-theme", "light");
    }
  }, [isDark]);

  return { isDark, toggleTheme: () => setIsDark(!isDark) };
}
