import React, { forwardRef } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  monospace?: boolean;
}

const Input = forwardRef<HTMLInputElement, Props>(({ monospace, className = "", ...rest }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-colors ${monospace ? "font-mono" : ""} ${className}`}
      {...rest}
    />
  );
});

Input.displayName = "Input";

export default Input;
