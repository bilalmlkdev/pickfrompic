import React from "react";

interface Props {
  color: string;
  onClick?: () => void;
  className?: string;
  title?: string;
}

const Swatch: React.FC<Props> = ({ color, onClick, className = "", title }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title || color}
      aria-label={`Color ${color}`}
      style={{ backgroundColor: color }}
      className={`transition-all duration-150 ${className}`}
    />
  );
};

export default Swatch;
