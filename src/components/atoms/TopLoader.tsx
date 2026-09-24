import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const TopLoader: React.FC = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let tHide: ReturnType<typeof setTimeout> | undefined;
    const raf = requestAnimationFrame(() => {
      setVisible(true);
      setProgress(30);
    });

    const t1 = setTimeout(() => setProgress(60), 150);
    const t2 = setTimeout(() => setProgress(85), 350);
    const t3 = setTimeout(() => {
      setProgress(100);
      tHide = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 200);
    }, 500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (tHide) clearTimeout(tHide);
    };
  }, [location.pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px]">
      <div
        className="h-full bg-foreground transition-all duration-300 ease-out rounded-r-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default TopLoader;
