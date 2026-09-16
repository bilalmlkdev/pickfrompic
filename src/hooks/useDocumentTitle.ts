import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/": "Image Color Picker - pickfrompic",
  "/dashboard": "Dashboard - pickfrompic",
  "/dashboard/palette": "Saved Palettes - pickfrompic",
  "/dashboard/color": "Saved Colors - pickfrompic",
  "/dashboard/gradient": "Saved Gradients - pickfrompic",
  "/dashboard/palette/create": "Palette Generator - pickfrompic",
  "/dashboard/gradient/create": "Gradient Maker - pickfrompic",
  "/dashboard/color/create": "Color Conversion - pickfrompic",
};

const getDynamicTitle = (pathname: string): string => {
  if (titles[pathname]) return titles[pathname];
  if (pathname.startsWith("/color/")) return "Color Conversion - pickfrompic";
  return "pickfrompic - Image Color Picker & Palette Tool";
};

const useDocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = getDynamicTitle(location.pathname);
  }, [location.pathname]);
};

export default useDocumentTitle;
