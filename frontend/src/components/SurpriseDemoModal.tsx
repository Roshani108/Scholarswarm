import React from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import type { DemoProfile } from '../types/swarm';

interface SurpriseDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  demoProfiles: DemoProfile[];
  onSelectProfile: (profile: DemoProfile) => void;
}

export const SurpriseDemoModal: React.FC<SurpriseDemoModalProps> = ({
  isOpen,
  onClose,
  demoProfiles,
  onSelectProfile,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 text-white">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-950/80 text-indigo-300 border border-indigo-800 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Cross-Disciplinary Registry</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Instant Candidate File Switcher
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select any pre-configured student profile to test cross-disciplinary swarm research.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profiles list */}
        <div className="space-y-3">
          {demoProfiles.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-[#161F30] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-500/60 transition-all group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">
                    {p.name}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-400 font-mono px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-800/80">
                    GPA {p.cgpa}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {p.education_level} • {p.current_institution}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Target: {p.target_degree} in {p.target_field} ({p.target_countries.join(', ')})
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectProfile(p);
                  onClose();
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-all whitespace-nowrap"
              >
                <span>Load Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
