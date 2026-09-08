import React from "react";

const SectionLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <h2 className={`font-semibold text-[13px] text-foreground mb-2.5 ${className}`}>
    {children}
  </h2>
);

export default SectionLabel;
