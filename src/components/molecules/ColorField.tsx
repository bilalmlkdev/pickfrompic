import React from "react";
import { Check, Copy } from "lucide-react";

interface Props {
  label: string;
  value: string;
  copied?: boolean;
  onCopy: () => void;
  labelWidth?: string;
  compact?: boolean;
}

const ColorField: React.FC<Props> = ({
  label,
  value,
  copied,
  onCopy,
  labelWidth = "w-11",
  compact = false,
}) => {
  return (
    <div
      className={`flex items-center justify-between gap-2 border border-border rounded-lg bg-card/50 ${
        compact ? "px-2.5 py-1.5" : "px-3 py-2"
      }`}
    >
      <span
        className={`text-muted-foreground font-medium shrink-0 ${labelWidth} ${
          compact ? "text-sm" : "text-sm"
        }`}
      >
        {label}
      </span>
      <span
        className={`font-mono text-foreground flex-1 truncate ${compact ? "text-sm" : "text-base"}`}
      >
        {value}
      </span>
      <button
        onClick={onCopy}
        className="text-foreground shrink-0"
        title={`Copy ${label}`}
      >
        {copied ? <Check size={compact ? 12 : 14} /> : <Copy size={compact ? 12 : 14} />}
      </button>
    </div>
  );
};

export default ColorField;
