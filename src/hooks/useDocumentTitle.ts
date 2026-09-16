import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/": "Image Color Picker - pickfrompic",
  "/dashboard": "Dashboard - pickfrompic",
  "/dashboard/palettes": "Saved Palettes - pickfrompic",
  "/dashboard/colors": "Saved Colors - pickfrompic",
  "/dashboard/gradients": "Saved Gradients - pickfrompic",
  "/dashboard/palette": "Palette Generator - pickfrompic",
  "/dashboard/gradient": "Gradient Maker - pickfrompic",
};

const getDynamicTitle = (pathname: string): string => {
  if (titles[pathname]) return titles[pathname];
  if (pathname.startsWith("/color/")) return "Color Conversion - pickfrompic";
  if (pathname === "/404" || pathname === "*") return "Page Not Found - pickfrompic";
  return "pickfrompic - Image Color Picker & Palette Tool";
};

const useDocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = getDynamicTitle(location.pathname);
  }, [location.pathname]);
};

export default useDocumentTitle;
