import React from "react";
import Background from "../organisms/Background";

const PageShell: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div
      className={`h-screen w-full relative overflow-hidden flex flex-col ${className}`}
    >
      <Background />
      <div className="relative z-10 flex flex-col flex-1 overflow-y-auto">{children}</div>
    </div>
  );
};

export default PageShell;
