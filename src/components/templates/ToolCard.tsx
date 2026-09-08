import React from "react";

/**
 * ToolCard is the single source of truth for the "app card" dimensions
 * used on the homepage picker AND every tool/creation page, so they all
 * share identical width, padding, radius and shadow.
 *
 * Reference: 780px content width, 2-col grid (image col ~400px / colors col ~180px+),
 * 28px padding, 24px radius, soft shadow, subtle border.
 */
const ToolCard: React.FC<{ children: React.ReactNode; className?: string; noPadding?: boolean }> = ({
  children,
  className = "",
  noPadding = false,
}) => {
  return (
    <div
      className={`relative bg-card border border-border rounded-[28px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] w-full max-w-[980px] mx-auto ${
        noPadding ? "" : "p-6"
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default ToolCard;
