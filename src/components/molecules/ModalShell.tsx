import React from "react";

interface Props {
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  zIndex?: string;
}

const ModalShell: React.FC<Props> = ({ onClose, children, maxWidth = "max-w-lg", zIndex = "z-100" }) => {
  return (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm ${zIndex} flex items-center justify-center p-4`}
      onClick={onClose}
    >
      <div
        className={`bg-card border border-border text-foreground rounded-3xl shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalShell;
