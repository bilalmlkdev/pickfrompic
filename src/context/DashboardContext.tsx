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
  updatePalette: (id: string, collection: string) => void;
  deletePalette: (id: string) => void;
  addColor: (name: string, hex: string) => void;
  deleteColor: (id: string) => void;
  addGradient: (name: string, colors: string[]) => void;
  deleteGradient: (id: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [palettes, setPalettes] = useState<Palette[]>(() => {
    const saved = localStorage.getItem("dash_palettes");
    return saved ? JSON.parse(saved) : [];
  });

  const [colors, setColors] = useState<Color[]>(() => {
    const saved = localStorage.getItem("dash_colors");
    return saved ? JSON.parse(saved) : [];
  });

  const [gradients, setGradients] = useState<Gradient[]>(() => {
    const saved = localStorage.getItem("dash_gradients");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("dash_palettes", JSON.stringify(palettes));
  }, [palettes]);

  useEffect(() => {
    localStorage.setItem("dash_colors", JSON.stringify(colors));
  }, [colors]);

  useEffect(() => {
    localStorage.setItem("dash_gradients", JSON.stringify(gradients));
  }, [gradients]);

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

  const updatePalette = (id: string, collection: string) => {
    setPalettes((prev) => prev.map((p) => (p.id === id ? { ...p, collection } : p)));
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
        updatePalette,
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

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within DashboardProvider");
  return context;
};
