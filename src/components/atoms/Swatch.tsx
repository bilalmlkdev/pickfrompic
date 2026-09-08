import React from "react";

interface Props {
  color: string;
selected?: boolean;
  onClick?: () => void;
  className?: string;
  title?: string;
}

const Swatch: React.FC<Props> = ({ color, selected, onClick, className = "", title }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title || color}
      style={{ backgroundColor: color }}
      className={`transition-all duration-150 ${
        selected
          ? "ring-offset-background z-10 "
          : ""
      } ${className}`}
    />
  );
};

export default Swatch;
