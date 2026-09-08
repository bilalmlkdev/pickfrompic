import React from "react";

interface Props<T extends string> {
  tabs: { value: T; label: string; icon?: React.ReactNode }[];
  active: T;
  onChange: (value: T) => void;
  className?: string;
}

function PillTabs<T extends string>({ tabs, active, onChange, className = "" }: Props<T>) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`flex items-center gap-1.5 px-[19.5px] py-2 rounded-full text-xs font-medium transition-colors ${
            active === tab.value
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default PillTabs;
