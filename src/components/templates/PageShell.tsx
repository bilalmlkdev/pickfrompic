import React from "react";
import Background from "../organisms/Background";

const PageShell: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div
      className={`min-h-screen w-full relative overflow-hidden ${className}`}
    >
      <Background />
      <div className="relative z-10 flex flex-col min-h-screen">{children}</div>
    </div>
  );
};

export default PageShell;
