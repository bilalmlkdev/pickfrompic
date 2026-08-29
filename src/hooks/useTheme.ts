import { useEffect, useState } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("pickfrompic-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
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
