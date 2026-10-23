import React from 'react';

const SOURCES = [
  'DAAD GERMAN ACADEMIC EXCHANGE',
  'VANIER CANADA GRADUATE SCHOLARSHIPS',
  'SINGA SINGAPORE INTERNATIONAL GRADUATE AWARD',
  'ERASMUS MUNDUS JOINT MASTERS',
  'A*STAR RESEARCH FELLOWSHIPS',
  'ONTARIO GRADUATE SCHOLARSHIP (OGS)',
  'TU MUNICH DEPARTMENT AWARDS',
  'NUS RESEARCH SCHOLARSHIPS',
  'NTU RESEARCH FELLOWSHIPS',
  'WATERLOO INTERNATIONAL AWARDS',
];

export const Marquee: React.FC = () => {
  return (
    <div className="w-full border-y border-hairline dark:border-night-hairline py-3.5 overflow-hidden bg-canvas-subtle/50 dark:bg-night-sheet/50 select-none">
      <div className="flex w-max animate-[marquee_38s_linear_infinite] hover:[animation-play-state:paused]">
        {[...SOURCES, ...SOURCES].map((src, i) => (
          <div key={i} className="flex items-center mx-6 font-mono-ledger text-[11px] uppercase tracking-widest text-ink-muted dark:text-night-muted">
            <span className="w-1.5 h-1.5 rounded-none bg-cobalt mr-3 inline-block" />
            <span>{src}</span>
            <span className="mx-6 text-hairline dark:text-night-hairline">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};
