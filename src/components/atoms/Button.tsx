import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "accent";
type Size = "sm" | "md" | "lg";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-foreground text-background hover:opacity-90 shadow-sm",
  secondary:
    "bg-card border border-border text-foreground hover:bg-muted",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-muted",
  accent: "bg-accent text-accent-foreground hover:brightness-95 shadow-sm",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5 rounded-full shadow-sm bg-background",
  md: "h-9 px-4 text-sm gap-2 rounded-full shadow-sm bg-background",
  lg: "h-9 px-5 text-sm gap-2 rounded-full shadow-sm bg-background",
};

const Button: React.FC<Props> = ({
  variant = "secondary",
  size = "md",
  fullWidth,
  icon,
  className = "",
  children,
  ...rest
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;
