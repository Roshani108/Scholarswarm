import React from 'react';

interface StampProps {
  text: string;
  variant?: 'cobalt' | 'emerald' | 'ink' | 'muted';
  rotation?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Stamp: React.FC<StampProps> = ({
  text,
  variant = 'cobalt',
  rotation = 0,
  size = 'md',
  className = '',
}) => {
  const colorStyles = {
    cobalt: 'text-cobalt dark:text-cobalt-dark border-cobalt dark:border-cobalt-dark bg-cobalt/5 dark:bg-cobalt/10',
    emerald: 'text-emerald dark:text-emerald-dark border-emerald dark:border-emerald-dark bg-emerald/5 dark:bg-emerald/10',
    ink: 'text-ink dark:text-night-bone border-ink dark:border-night-bone bg-ink/5 dark:bg-night-bone/5',
    muted: 'text-ink-muted dark:text-night-muted border-hairline dark:border-night-hairline bg-transparent',
  }[variant];

  const sizeStyles = {
    sm: 'text-[9px] px-1.5 py-0.5 tracking-widest',
    md: 'text-[10px] px-2.5 py-1 tracking-widestMono font-semibold',
    lg: 'text-xs px-3.5 py-1.5 tracking-widestMono font-bold',
  }[size];

  return (
    <div
      style={{ transform: rotation ? `rotate(${rotation}deg)` : undefined }}
      className={`inline-flex items-center justify-center font-mono-ledger uppercase border border-dashed select-none transition-transform duration-200 hover:rotate-0 ${colorStyles} ${sizeStyles} ${className}`}
    >
      <span className="relative">
        {text}
      </span>
    </div>
  );
};
