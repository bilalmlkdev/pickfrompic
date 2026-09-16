import React, { useEffect, useRef, useSyncExternalStore } from "react";

type Listener = () => void;

let progress = 0;
let listeners: Listener[] = [];

const notify = () => listeners.forEach((l) => l());

const updateProgress = (value: number) => {
  progress = value;
  notify();
};

const subscribe = (listener: Listener) => {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

const getSnapshot = () => progress;

interface Props {
  onComplete: () => void;
}

const TopLoader: React.FC<Props> = ({ onComplete }) => {
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const currentProgress = useSyncExternalStore(subscribe, getSnapshot);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const schedule = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timersRef.current.push(t);
    };

    schedule(() => updateProgress(30), 50);
    schedule(() => updateProgress(60), 200);
    schedule(() => updateProgress(80), 450);
    schedule(() => {
      updateProgress(100);
      setTimeout(() => {
        onComplete();
        setTimeout(() => updateProgress(0), 200);
      }, 150);
    }, 650);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [onComplete]);

  if (currentProgress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px]">
      <div
        className="h-full bg-foreground transition-all duration-300 ease-out rounded-r-full"
        style={{ width: `${currentProgress}%` }}
      />
    </div>
  );
};

export default TopLoader;
