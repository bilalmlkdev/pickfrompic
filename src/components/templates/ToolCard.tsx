import React, { useState, useEffect } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

interface Props {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  noMaximize?: boolean;
}

const ToolCard: React.FC<Props> = ({
  children,
  className = "",
  noPadding = false,
  noMaximize = false,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (isMaximized) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMaximized]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMaximized) setIsMaximized(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMaximized]);

  if (isMaximized) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMaximized(false)}
        />
        <div
          className={`relative bg-card border border-border rounded-[28px] shadow-2xl w-full max-w-[1100px] max-h-[90vh] overflow-y-auto ${
            noPadding ? "" : "p-6"
          } ${className}`}
        >
          <button
            onClick={() => setIsMaximized(false)}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-foreground  flex items-center justify-center text-card transition-colors z-10"
            title="Exit fullscreen"
          >
            <Minimize2 size={14} />
          </button>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-card border border-border rounded-[28px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] w-full max-w-[980px] mx-auto ${
        noPadding ? "" : "p-6"
      } ${className}`}
    >
      {!noMaximize && (
        <button
          onClick={() => setIsMaximized(true)}
          className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-foreground border border-border border-r-0 shadow-md hover:shadow-lg flex items-center justify-center text-card transition-all z-10"
          title="Maximize"
        >
          <Maximize2 size={18} />
        </button>
      )}
      {children}
    </div>
  );
};

export default ToolCard;
