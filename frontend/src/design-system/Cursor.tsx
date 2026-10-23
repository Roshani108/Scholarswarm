import React, { useEffect, useState, useRef } from 'react';

export const Cursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [targetPos, setTargetPos] = useState({ x: -100, y: -100 });
  const [label, setLabel] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const reqRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setTargetPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = (e.target as HTMLElement).closest('[data-cursor]');
      if (target) {
        setLabel(target.getAttribute('data-cursor'));
        setIsHovered(true);
      } else {
        const clickable = (e.target as HTMLElement).closest('button, a, input, select');
        if (clickable) {
          setLabel(null);
          setIsHovered(true);
        } else {
          setLabel(null);
          setIsHovered(false);
        }
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  useEffect(() => {
    const follow = () => {
      setPos((prev) => ({
        x: prev.x + (targetPos.x - prev.x) * 0.22,
        y: prev.y + (targetPos.y - prev.y) * 0.22,
      }));
      reqRef.current = requestAnimationFrame(follow);
    };
    reqRef.current = requestAnimationFrame(follow);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [targetPos]);

  if (!isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[999] top-0 left-0 transition-opacity duration-300"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
      }}
    >
      <div
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${
          isHovered ? 'w-2 h-2 bg-cobalt' : 'w-1.5 h-1.5 bg-ink dark:bg-night-bone'
        }`}
      />

      <div
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 flex items-center justify-center ${
          label
            ? 'w-16 h-16 border-cobalt bg-white/95 dark:bg-night-bg/95 shadow-sm'
            : isHovered
            ? 'w-10 h-10 border-cobalt/80 scale-110'
            : 'w-7 h-7 border-hairline dark:border-night-hairline'
        }`}
      >
        {label && (
          <span className="font-mono text-[9px] uppercase tracking-widest text-cobalt font-semibold select-none">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};
