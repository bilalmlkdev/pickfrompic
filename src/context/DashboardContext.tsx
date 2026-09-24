import React, { createContext, useContext, useEffect, useState } from "react";

export interface Palette {
  id: string;
  name: string;
  collection: string;
  colors: string[];
  createdAt: string;
}

export interface Color {
  id: string;
  name: string;
  hex: string;
  createdAt: string;
}

export interface Gradient {
  id: string;
  name: string;
  colors: string[];
  createdAt: string;
}

interface DashboardContextType {
  palettes: Palette[];
  colors: Color[];
  gradients: Gradient[];
  addPalette: (name: string, collection: string, colors: string[]) => void;
  deletePalette: (id: string) => void;
  addColor: (name: string, hex: string) => void;
  deleteColor: (id: string) => void;
  addGradient: (name: string, colors: string[]) => void;
  deleteGradient: (id: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const safeParse = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [palettes, setPalettes] = useState<Palette[]>(() =>
    safeParse<Palette[]>("dash_palettes", [])
  );

  const [colors, setColors] = useState<Color[]>(() =>
    safeParse<Color[]>("dash_colors", [])
  );

  const [gradients, setGradients] = useState<Gradient[]>(() =>
    safeParse<Gradient[]>("dash_gradients", [])
  );

  useEffect(() => {
    try {
      localStorage.setItem("dash_palettes", JSON.stringify(palettes));
      localStorage.setItem("dash_colors", JSON.stringify(colors));
      localStorage.setItem("dash_gradients", JSON.stringify(gradients));
    } catch {
      // quota exceeded or private mode
    }
  }, [palettes, colors, gradients]);

  const addPalette = (name: string, collection: string, colors: string[]) => {
    const newPalette: Palette = {
      id: crypto.randomUUID(),
      name,
      collection: collection || "Untitled Collection",
      colors,
      createdAt: new Date().toISOString(),
    };
    setPalettes((prev) => [newPalette, ...prev]);
  };

  const deletePalette = (id: string) => {
    setPalettes((prev) => prev.filter((p) => p.id !== id));
  };

  const addColor = (name: string, hex: string) => {
    const newColor: Color = {
      id: crypto.randomUUID(),
      name,
      hex,
      createdAt: new Date().toISOString(),
    };
    setColors((prev) => [newColor, ...prev]);
  };

  const deleteColor = (id: string) => {
    setColors((prev) => prev.filter((c) => c.id !== id));
  };

  const addGradient = (name: string, colors: string[]) => {
    const newGradient: Gradient = {
      id: crypto.randomUUID(),
      name,
      colors,
      createdAt: new Date().toISOString(),
    };
    setGradients((prev) => [newGradient, ...prev]);
  };

  const deleteGradient = (id: string) => {
    setGradients((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <DashboardContext.Provider
      value={{
        palettes,
        colors,
        gradients,
        addPalette,
        deletePalette,
        addColor,
        deleteColor,
        addGradient,
        deleteGradient,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within DashboardProvider");
  return context;
};
