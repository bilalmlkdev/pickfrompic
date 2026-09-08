import React from "react";

type Size = "xs" | "sm" | "md";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size;
  active?: boolean;
  variant?: "outline" | "solid" | "ghost";
}

const sizeClasses: Record<Size, string> = {
  xs: "w-7 h-7",
  sm: "w-8 h-8",
  md: "w-9 h-9",
};

const IconButton: React.FC<Props> = ({
  size = "sm",
  active = false,
  variant = "outline",
  className = "",
  children,
  ...rest
}) => {
  const base =
    variant === "outline"
      ? "border border-border bg-card/60 hover:bg-muted text-muted-foreground hover:text-foreground"
      : variant === "solid"
        ? "bg-foreground text-background hover:opacity-90"
        : "text-muted-foreground hover:text-foreground hover:bg-muted";

  return (
    <button
      className={`shrink-0 rounded-full flex items-center justify-center transition-colors duration-150 ${sizeClasses[size]} ${active ? "bg-foreground text-background" : base} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default IconButton;
