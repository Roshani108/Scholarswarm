import React from 'react';
import { Globe, X, Sparkles, UserCheck, ArrowRight } from 'lucide-react';
import { DemoProfile } from '../types/swarm';

interface SurpriseProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  demoProfiles: DemoProfile[];
  onSelectProfile: (profile: DemoProfile) => void;
}

export const SurpriseProfileModal: React.FC<SurpriseProfileModalProps> = ({
  isOpen,
  onClose,
  demoProfiles,
  onSelectProfile,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel-elevated w-full max-w-2xl rounded-3xl border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading text-white">
                Live Surprise Demo Profile Picker
              </h2>
              <p className="text-xs text-slate-400">
                Guaranteed zero code changes for any field, country, or degree.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-space-850 hover:bg-space-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          Select any pre-configured profile below to demonstrate that ScholarSwarm adapts dynamically
          to any discipline (Commerce, Biotechnology, Computer Science) and country requirements.
        </p>

        <div className="space-y-3">
          {demoProfiles.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-space-900/90 border border-slate-700/80 hover:border-aurora-teal transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white group-hover:text-aurora-teal transition-colors">
                    {p.name}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 font-mono font-semibold">
                    CGPA {p.cgpa}
                  </span>
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  {p.education_level} • {p.current_institution}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Target: <span className="text-slate-300">{p.target_degree} in {p.target_field}</span> ({p.target_countries.join(', ')})
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectProfile(p);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-aurora-violet to-purple-600 hover:opacity-90 transition-all flex items-center gap-1.5 flex-shrink-0"
              >
                Load & Test
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
