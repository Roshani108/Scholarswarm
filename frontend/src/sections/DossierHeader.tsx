import React, { useState, useEffect } from 'react';
import { Stamp } from '../design-system/Stamp';

interface DossierHeaderProps {
  currentScreen: 'landing' | 'intake' | 'mission' | 'results' | 'studio';
  onNavigate: (screen: 'landing' | 'intake' | 'mission' | 'results' | 'studio') => void;
  hasActiveSession: boolean;
  onReset: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const DossierHeader: React.FC<DossierHeaderProps> = ({
  currentScreen,
  onNavigate,
  hasActiveSession,
  onReset,
  isDarkMode,
  onToggleTheme,
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + ' LOCAL');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-night-bg/95 backdrop-blur-md border-b border-hairline dark:border-night-hairline transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between font-mono-ledger text-xs">
        {/* Left: Bureau Wordmark */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('landing')}
            data-cursor="HOME"
            className="text-left group"
          >
            <span className="font-display text-2xl font-normal tracking-tight text-ink dark:text-night-bone">
              Scholar<span className="italic text-cobalt dark:text-cobalt-dark">Swarm</span>
            </span>
          </button>
          <div className="hidden sm:block">
            <Stamp text="REF: BUR-2026" variant="muted" size="sm" rotation={0} />
          </div>
        </div>

        {/* Center: Monospace Section Breadcrumbs */}
        <nav className="hidden md:flex items-center gap-1 text-[11px] uppercase tracking-widest text-ink-muted dark:text-night-muted">
          <button
            onClick={() => onNavigate('landing')}
            data-cursor="INDEX"
            className={`px-3 py-1.5 transition-colors ${
              currentScreen === 'landing' ? 'text-ink dark:text-night-bone font-bold underline decoration-cobalt underline-offset-4' : 'hover:text-ink dark:hover:text-night-bone'
            }`}
          >
            00 / INDEX
          </button>
          <span className="text-hairline dark:text-night-hairline">/</span>
          <button
            onClick={() => onNavigate('intake')}
            data-cursor="INTAKE"
            className={`px-3 py-1.5 transition-colors ${
              currentScreen === 'intake' ? 'text-ink dark:text-night-bone font-bold underline decoration-cobalt underline-offset-4' : 'hover:text-ink dark:hover:text-night-bone'
            }`}
          >
            01 / INTAKE
          </button>

          {hasActiveSession && (
            <>
              <span className="text-hairline dark:text-night-hairline">/</span>
              <button
                onClick={() => onNavigate('mission')}
                data-cursor="OPS"
                className={`px-3 py-1.5 transition-colors ${
                  currentScreen === 'mission' ? 'text-ink dark:text-night-bone font-bold underline decoration-cobalt underline-offset-4' : 'hover:text-ink dark:hover:text-night-bone'
                }`}
              >
                02 / CONTROL
              </button>
              <span className="text-hairline dark:text-night-hairline">/</span>
              <button
                onClick={() => onNavigate('results')}
                data-cursor="DOSSIER"
                className={`px-3 py-1.5 transition-colors ${
                  currentScreen === 'results' ? 'text-ink dark:text-night-bone font-bold underline decoration-cobalt underline-offset-4' : 'hover:text-ink dark:hover:text-night-bone'
                }`}
              >
                03 / DOSSIER
              </button>
              <span className="text-hairline dark:text-night-hairline">/</span>
              <button
                onClick={() => onNavigate('studio')}
                data-cursor="STUDIO"
                className={`px-3 py-1.5 transition-colors ${
                  currentScreen === 'studio' ? 'text-ink dark:text-night-bone font-bold underline decoration-cobalt underline-offset-4' : 'hover:text-ink dark:hover:text-night-bone'
                }`}
              >
                04 / STUDIO
              </button>
            </>
          )}
        </nav>

        {/* Right: Clock & Theme Toggle */}
        <div className="flex items-center gap-4">
          <span className="hidden lg:inline text-ink-muted dark:text-night-muted font-mono tracking-widest text-[10px]">
            {timeStr}
          </span>

          <button
            onClick={onToggleTheme}
            data-cursor="THEME"
            className="px-2.5 py-1 border border-hairline dark:border-night-hairline hover:border-cobalt text-[10px] tracking-widest uppercase transition-colors"
          >
            {isDarkMode ? 'MODE: OBSIDIAN' : 'MODE: SLATE'}
          </button>

          {hasActiveSession && (
            <button
              onClick={onReset}
              data-cursor="RESET"
              className="text-cobalt hover:underline text-[10px] tracking-widest uppercase"
              title="Reset active case file"
            >
              [ NEW FILE ]
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
