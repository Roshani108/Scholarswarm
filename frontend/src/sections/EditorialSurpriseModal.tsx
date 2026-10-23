import React from 'react';
import { Stamp } from '../design-system/Stamp';
import type { DemoProfile } from '../types/swarm';

interface EditorialSurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  demoProfiles: DemoProfile[];
  onSelectProfile: (profile: DemoProfile) => void;
}

export const EditorialSurpriseModal: React.FC<EditorialSurpriseModalProps> = ({
  isOpen,
  onClose,
  demoProfiles,
  onSelectProfile,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 dark:bg-black/85 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-surface dark:bg-night-surface border-2 border-ink dark:border-night-bone p-6 sm:p-8 space-y-6 shadow-2xl relative font-mono-ledger text-xs">
        <div className="flex items-start justify-between pb-4 border-b border-hairline dark:border-night-hairline">
          <div>
            <div className="flex items-center gap-2 text-cobalt dark:text-cobalt-light uppercase font-bold text-[10px] tracking-widest mb-1">
              <span>CASE ARCHIVE REGISTRY</span>
              <span>•</span>
              <Stamp text="ZERO CODE CHANGES" variant="emerald" size="sm" rotation={0} />
            </div>
            <h2 className="font-display text-3xl text-ink dark:text-night-bone font-normal">
              Live Candidate File Switcher
            </h2>
            <p className="text-[11px] text-ink-muted dark:text-night-muted mt-1 uppercase">
              Proves cross-disciplinary generality: Science, Finance, Genomics.
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-ink dark:border-night-bone hover:border-cobalt hover:text-cobalt uppercase text-xs transition-colors"
          >
            [ CLOSE ]
          </button>
        </div>

        <div className="space-y-3">
          {demoProfiles.map((p, idx) => (
            <div
              key={p.id}
              className="p-4 border border-hairline dark:border-night-hairline bg-canvas dark:bg-night flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-cobalt dark:hover:border-cobalt-light transition-all group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ink dark:text-night-bone uppercase text-sm group-hover:text-cobalt dark:group-hover:text-cobalt-light transition-colors">
                    CASE 0{idx + 1} — {p.name}
                  </span>
                  <span className="text-[10px] text-cobalt dark:text-cobalt-light font-bold">
                    [ GPA: {p.cgpa} ]
                  </span>
                </div>
                <div className="text-[11px] text-ink-muted dark:text-night-muted mt-1">
                  {p.education_level} • {p.current_institution}
                </div>
                <div className="text-[10px] text-ink-muted dark:text-night-muted mt-0.5 uppercase">
                  Target: {p.target_degree} in {p.target_field} ({p.target_countries.join(' • ')})
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectProfile(p);
                  onClose();
                }}
                className="px-4 py-2 bg-ink dark:bg-night-bone text-white dark:text-night hover:bg-cobalt dark:hover:bg-cobalt dark:hover:text-white uppercase font-bold text-xs tracking-widest transition-colors whitespace-nowrap"
              >
                LOAD FILE →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
