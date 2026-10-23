import React from 'react';
import { 
  Sparkles, Bot, ShieldCheck, Moon, Sun, 
  RotateCcw, CheckCircle2, ChevronRight, GraduationCap
} from 'lucide-react';

interface NavbarProps {
  currentScreen: 'landing' | 'intake' | 'mission' | 'results' | 'studio';
  onNavigate: (screen: 'landing' | 'intake' | 'mission' | 'results' | 'studio') => void;
  hasActiveSession: boolean;
  onReset: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isRunning?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  hasActiveSession,
  onReset,
  isDarkMode,
  onToggleTheme,
  isRunning = false,
}) => {
  const navItems: { id: 'landing' | 'intake' | 'mission' | 'results' | 'studio'; label: string; badge?: string }[] = [
    { id: 'landing', label: 'Overview' },
    { id: 'intake', label: 'Candidate Profile' },
    { id: 'mission', label: 'Live Swarm', badge: isRunning ? 'Active' : undefined },
    { id: 'results', label: 'Matched Scholarships' },
    { id: 'studio', label: 'SOP Studio' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo - NO v2.4 badge */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white dark:text-white light:text-slate-900">
                Scholar<span className="text-indigo-400">Swarm</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Multi-Agent AI Scholarship Bureau
            </p>
          </div>
        </div>

        {/* Center Nav Tabs - 100% visible, high contrast */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Toolbar - NO Chaos Mode */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-indigo-400 hover:border-slate-700 transition-colors shadow-sm"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Reset / New Search Button */}
          {hasActiveSession && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Profile</span>
            </button>
          )}

          {/* Primary Action Button */}
          <button
            onClick={() => onNavigate('intake')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25 active:scale-95 transition-all"
          >
            <span>Start Research</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
