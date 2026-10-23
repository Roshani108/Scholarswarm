import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('scholarswarm_preloader_seen')) {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRevealing(true);
          sessionStorage.setItem('scholarswarm_preloader_seen', 'true');
          setTimeout(onComplete, 650);
          return 100;
        }
        return prev + 5;
      });
    }, 45);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearInterval(interval);
        sessionStorage.setItem('scholarswarm_preloader_seen', 'true');
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  return (
    <div
      onClick={() => {
        sessionStorage.setItem('scholarswarm_preloader_seen', 'true');
        onComplete();
      }}
      className={`fixed inset-0 z-[100] flex flex-col justify-between p-8 sm:p-14 bg-white dark:bg-night-bg text-ink dark:text-night-bone transition-all duration-700 select-none cursor-pointer ${
        isRevealing ? 'pointer-events-none -translate-y-full opacity-0' : 'opacity-100'
      }`}
      style={{
        clipPath: isRevealing ? 'polygon(0 0, 100% 0, 100% 0, 0 0)' : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        transition: 'clip-path 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease',
      }}
    >
      <div className="flex items-center justify-between font-mono-ledger text-xs text-ink-muted dark:text-night-muted uppercase tracking-widest">
        <span>BUREAU DE RECHERCHE ACADÉMIQUE</span>
        <span>DOSSIER PROTOCOL 2.0</span>
      </div>

      <div className="max-w-3xl">
        <div className="font-mono-ledger text-xs uppercase text-cobalt tracking-widest mb-3">
          INITIALIZING RECONNAISSANCE SWARM
        </div>
        <h1 className="font-display text-5xl sm:text-7xl font-normal tracking-tightest leading-none">
          Scholar<span className="italic text-cobalt">Swarm</span>
        </h1>
        <p className="font-mono-ledger text-xs text-ink-muted dark:text-night-muted mt-4 max-w-md">
          Autonomous intelligence bureau for student scholarship dossier synthesis and verified admissions scouting.
        </p>
      </div>

      <div className="flex items-end justify-between font-mono-ledger text-xs border-t border-hairline dark:border-night-hairline pt-4">
        <span className="text-ink-muted dark:text-night-muted">CLICK OR PRESS ESC TO SKIP</span>
        <div className="text-right">
          <span className="text-3xl font-bold tabular-nums text-ink dark:text-night-bone">
            {String(progress).padStart(3, '0')}
          </span>
          <span className="text-xs text-cobalt ml-1">%</span>
        </div>
      </div>
    </div>
  );
};
