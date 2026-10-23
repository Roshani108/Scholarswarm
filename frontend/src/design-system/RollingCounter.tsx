import React, { useEffect, useState } from 'react';

interface RollingCounterProps {
  value: number;
  padLength?: number;
  label?: string;
  className?: string;
}

export const RollingCounter: React.FC<RollingCounterProps> = ({
  value,
  padLength = 2,
  label,
  className = '',
}) => {
  const [displayVal, setDisplayVal] = useState(value);

  useEffect(() => {
    let start = displayVal;
    const end = value;
    if (start === end) return;

    const duration = 600; // ms
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * ease);
      setDisplayVal(current);
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    const handle = requestAnimationFrame(update);
    return () => cancelAnimationFrame(handle);
  }, [value]);

  const formatted = String(displayVal).padStart(padLength, '0');

  return (
    <div className={`font-mono-ledger ${className}`}>
      <span className="tabular-nums font-bold tracking-tight">{formatted}</span>
      {label && <span className="ml-1 text-[10px] uppercase tracking-widest text-ink-muted dark:text-night-muted font-normal">{label}</span>}
    </div>
  );
};
