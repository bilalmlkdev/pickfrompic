import React, { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-muted border-b border-border px-4 py-2.5 flex items-center justify-center gap-2">
      <WifiOff size={14} className="text-muted-foreground" />
      <span className="text-sm text-muted-foreground font-medium">
        You're offline - some features may not work
      </span>
    </div>
  );
};

export default OfflineBanner;
