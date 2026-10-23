import React, { useState } from 'react';
import { Stamp } from '../design-system/Stamp';
import type { TopOpportunity, VerifiedOpportunity } from '../types/swarm';

interface DossierResultsProps {
  top5: TopOpportunity[];
  allVerified: VerifiedOpportunity[];
  rejected: VerifiedOpportunity[];
  onSelectForSOP: (opportunityId: string) => void;
  onOpenTrustReport: () => void;
  onResetNewProfile: () => void;
}

export const DossierResults: React.FC<DossierResultsProps> = ({
  top5,
  allVerified,
  rejected,
  onSelectForSOP,
  onOpenTrustReport,
  onResetNewProfile,
}) => {
  const [filterCountry, setFilterCountry] = useState('ALL');
  const [showRejected, setShowRejected] = useState(false);
  const [expandedSheetId, setExpandedSheetId] = useState<string | null>(top5[0]?.opportunity.opportunity.id || null);

  const countries = ['ALL', ...Array.from(new Set(allVerified.map((v) => v.opportunity.country.toUpperCase())))];

  const filteredItems = allVerified.filter((v) => {
    if (filterCountry === 'ALL') return true;
    return v.opportunity.country.toUpperCase() === filterCountry;
  });

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-12 space-y-12">
      {/* Dossier Cover Masthead */}
      <div className="border border-hairline dark:border-night-hairline p-6 sm:p-8 bg-white dark:bg-night-sheet shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-hairline dark:border-night-hairline gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono-ledger text-xs uppercase tracking-widest text-cobalt dark:text-cobalt-dark font-semibold">
                DOSSIER COMPILATION / SECTION 03
              </span>
              <Stamp text="AUDIT STATUS: VERIFIED" variant="emerald" size="sm" rotation={0} />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-ink dark:text-night-bone mt-2">
              Strategic Opportunity Sheets
            </h2>
          </div>

          <div className="flex items-center gap-3 font-mono-ledger text-xs">
            <button
              onClick={onOpenTrustReport}
              data-cursor="AUDIT"
              className="px-4 py-2 border border-hairline dark:border-night-hairline hover:border-cobalt hover:text-cobalt transition-colors uppercase tracking-widest"
            >
              [ CERTIFICATE OF TRUST ]
            </button>
            <button
              onClick={onResetNewProfile}
              data-cursor="NEW"
              className="px-4 py-2 bg-cobalt hover:bg-cobalt-hover text-white transition-colors uppercase tracking-widest shadow-sm"
            >
              NEW CANDIDATE FILE
            </button>
          </div>
        </div>

        <p className="font-sans text-sm text-ink-muted dark:text-night-muted mt-3 max-w-3xl leading-relaxed">
          The following five programs represent optimal academic standing, institutional prestige, and full financial coverage. Every criterion has been checked against official university regulations with live source evidence.
        </p>
      </div>

      {/* Top 5 Editorial Opportunity Sheets */}
      <div className="space-y-8">
        {top5.map((top) => {
          const opp = top.opportunity.opportunity;
          const isExpanded = expandedSheetId === opp.id;

          return (
            <article
              key={opp.id}
              className="border border-hairline dark:border-night-hairline bg-white dark:bg-night-sheet p-6 sm:p-8 relative transition-all duration-300 hover:border-cobalt shadow-sm"
            >
              {/* Sheet Header Row */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-hairline dark:border-night-hairline">
                <div className="flex items-start gap-6">
                  {/* Big Italic Rank Numeral */}
                  <div className="font-display text-6xl sm:text-7xl italic text-ink-muted/20 dark:text-night-muted/30 leading-none select-none font-normal">
                    0{top.rank}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3 font-mono-ledger text-xs mb-2">
                      <span className="font-bold text-ink dark:text-night-bone uppercase tracking-widest">
                        {opp.country}
                      </span>
                      <span className="text-hairline dark:text-night-hairline">/</span>
                      <span className="text-cobalt dark:text-cobalt-dark font-semibold uppercase">
                        {top.competitiveness} MATCH
                      </span>
                      <span className="text-hairline dark:text-night-hairline">/</span>
                      <span className="text-ink-muted dark:text-night-muted">
                        FIT SCORE: {top.fit_score}%
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl text-ink dark:text-night-bone font-normal leading-tight">
                      {opp.title}
                    </h3>
                    <p className="font-mono-ledger text-xs text-ink-muted dark:text-night-muted mt-1">
                      AWARD PROVIDER: {opp.university_or_provider.toUpperCase()} • DEGREE LEVEL: {opp.degree_level.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Funding Value Figure & Action Button */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:text-right">
                  <div className="border border-hairline dark:border-night-hairline p-3 bg-canvas-subtle dark:bg-night-bg">
                    <span className="font-mono-ledger text-[9px] uppercase tracking-widest text-ink-muted dark:text-night-muted block">
                      STIPEND & TUITION FIGURE
                    </span>
                    <span className="font-mono-ledger text-base sm:text-lg font-bold text-cobalt dark:text-cobalt-dark">
                      {opp.amount}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectForSOP(opp.id)}
                    data-cursor="DRAFT"
                    className="px-5 py-3 bg-cobalt hover:bg-cobalt-hover text-white font-mono-ledger text-xs uppercase tracking-widest transition-colors font-bold whitespace-nowrap shadow-sm"
                  >
                    DRAFT STATEMENT OF PURPOSE →
                  </button>
                </div>
              </div>

              {/* Editorial "Why This Fits You" Section */}
              <div className="py-5 border-b border-hairline dark:border-night-hairline">
                <span className="font-mono-ledger text-xs uppercase tracking-widest text-ink-muted dark:text-night-muted block mb-2">
                  EVALUATIVE RATIONALE & ACADEMIC ALIGNMENT
                </span>
                <p className="font-sans text-sm sm:text-base text-ink dark:text-night-bone leading-relaxed max-w-4xl">
                  {top.why_it_fits}
                </p>
              </div>

              {/* Verified Source Stamp & Verbatim Snippet */}
              <div className="mt-4 p-4 border border-hairline dark:border-night-hairline bg-canvas-subtle dark:bg-night-bg font-mono-ledger text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Stamp text="VERIFIED SOURCE" variant="emerald" size="sm" rotation={0} />
                    <span className="text-[11px] text-ink-muted dark:text-night-muted">
                      HTTP {top.opportunity.http_status} • DOMAIN AUTHORITY {Math.round(top.opportunity.official_domain_score * 100)}%
                    </span>
                  </div>
                  <a
                    href={opp.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="PORTAL"
                    className="text-cobalt hover:underline text-[11px] uppercase tracking-widest"
                  >
                    [ INSPECT OFFICIAL ENDPOINT ↗ ]
                  </a>
                </div>
                <blockquote className="text-[11px] text-ink-muted dark:text-night-muted italic border-l-2 border-hairline dark:border-night-hairline pl-3">
                  "{top.opportunity.source_snippet || opp.raw_page_snippet || 'Documented on official institution portal.'}"
                </blockquote>
              </div>

              {/* Collapsible 5-Point Criteria Ledger & Action Roadmap */}
              <div className="mt-4 pt-3 flex items-center justify-between font-mono-ledger text-xs text-ink-muted dark:text-night-muted">
                <button
                  onClick={() => setExpandedSheetId(isExpanded ? null : opp.id)}
                  data-cursor="INSPECT"
                  className="hover:text-cobalt uppercase tracking-widest transition-colors"
                >
                  {isExpanded ? '[ - HIDE CRITERIA LEDGER & ROADMAP ]' : '[ + EXPAND 5-POINT CRITERIA LEDGER & ROADMAP ]'}
                </button>
                <span className="text-[10px]">VERIFIED: {top.opportunity.verified_at}</span>
              </div>

              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-hairline dark:border-night-hairline space-y-6">
                  {/* 5-Point Criteria Ledger */}
                  <div>
                    <span className="font-mono-ledger text-xs uppercase tracking-widest text-ink dark:text-night-bone block mb-3 font-semibold">
                      EVIDENTIARY CRITERIA EVALUATION
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {top.opportunity.criteria.map((c, i) => (
                        <div key={i} className="p-3 border border-hairline dark:border-night-hairline bg-canvas dark:bg-night-bg font-mono-ledger text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-ink dark:text-night-bone uppercase tracking-wider">{c.criterion}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 border ${
                              c.status === 'MET' ? 'border-emerald text-emerald' : 'border-cobalt text-cobalt'
                            }`}>
                              [{c.status}]
                            </span>
                          </div>
                          <div className="text-[11px] text-ink-muted dark:text-night-muted">{c.requirement}</div>
                          <div className="text-[10px] text-ink dark:text-night-bone mt-1 border-t border-hairline/60 pt-1">
                            Candidate: {c.student_value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Roadmap Timeline */}
                  <div>
                    <span className="font-mono-ledger text-xs uppercase tracking-widest text-ink dark:text-night-bone block mb-3 font-semibold">
                      APPLICATION ACTION TIMELINE
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {top.application_roadmap.map((step) => (
                        <div key={step.step_number} className="p-3 border border-hairline dark:border-night-hairline bg-canvas dark:bg-night-bg font-mono-ledger text-xs">
                          <span className="text-[10px] text-cobalt dark:text-cobalt-dark uppercase tracking-widest block font-bold">
                            PHASE 0{step.step_number} — {step.target_date}
                          </span>
                          <span className="font-bold text-ink dark:text-night-bone block mt-1 mb-2">
                            {step.title}
                          </span>
                          <ul className="text-[11px] text-ink-muted dark:text-night-muted space-y-1 list-disc list-inside">
                            {step.action_items.map((it, idx) => (
                              <li key={idx}>{it}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Thin-Line D3 Plot: Fit vs Funding Distribution */}
      <div className="border border-hairline dark:border-night-hairline p-6 sm:p-8 bg-white dark:bg-night-sheet shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-hairline dark:border-night-hairline font-mono-ledger text-xs text-ink-muted dark:text-night-muted">
          <span>ANALYTICAL DISTRIBUTION: FIT SCORE VS. GENEROSITY VALUE</span>
          <span>D3 HAIRLINE COORDINATES</span>
        </div>

        <div className="w-full h-48 my-4 relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160">
            <line x1="40" y1="20" x2="40" y2="140" stroke="currentColor" strokeWidth="1" className="text-hairline dark:text-night-hairline" />
            <line x1="40" y1="140" x2="580" y2="140" stroke="currentColor" strokeWidth="1" className="text-hairline dark:text-night-hairline" />

            <text x="35" y="25" textAnchor="end" className="font-mono-ledger text-[9px] fill-current text-ink-muted">100</text>
            <text x="35" y="80" textAnchor="end" className="font-mono-ledger text-[9px] fill-current text-ink-muted">50</text>
            <text x="35" y="140" textAnchor="end" className="font-mono-ledger text-[9px] fill-current text-ink-muted">0</text>

            <text x="40" y="155" textAnchor="middle" className="font-mono-ledger text-[9px] fill-current text-ink-muted">0%</text>
            <text x="310" y="155" textAnchor="middle" className="font-mono-ledger text-[9px] fill-current text-ink-muted">50% FIT</text>
            <text x="580" y="155" textAnchor="middle" className="font-mono-ledger text-[9px] fill-current text-ink-muted">100% FIT</text>

            {top5.map((t) => {
              const cx = 40 + (t.fit_score / 100) * 520;
              const cy = 140 - (t.generosity_score / 100) * 115;
              return (
                <g key={t.rank}>
                  <circle cx={cx} cy={cy} r="4" fill="#2563EB" className="hover:scale-150 transition-transform" />
                  <text
                    x={cx + 8}
                    y={cy - 4}
                    className="font-mono-ledger text-[9px] fill-current text-ink dark:text-night-bone font-bold"
                  >
                    #{t.rank} {t.opportunity.opportunity.title.slice(0, 16)}...
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Sortable Ledger Table of ALL 10+ Verified Opportunities */}
      <div className="border border-hairline dark:border-night-hairline p-6 sm:p-8 bg-white dark:bg-night-sheet shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-hairline dark:border-night-hairline gap-4 font-mono-ledger text-xs">
          <div>
            <span className="font-bold text-ink dark:text-night-bone uppercase tracking-widest">
              REGISTER OF VERIFIED PROGRAMS ({allVerified.length})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setFilterCountry(c)}
                className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest border transition-all ${
                  filterCountry === c
                    ? 'border-cobalt bg-cobalt text-white shadow-sm'
                    : 'border-hairline dark:border-night-hairline text-ink-muted hover:text-ink'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono-ledger text-xs">
            <thead className="border-b border-hairline dark:border-night-hairline text-ink-muted dark:text-night-muted uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">TITLE / PROVIDER</th>
                <th className="py-2.5 px-3">JURISDICTION</th>
                <th className="py-2.5 px-3">FUNDING FIGURE</th>
                <th className="py-2.5 px-3">SCORE</th>
                <th className="py-2.5 px-3 text-right">ENDPOINT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline dark:divide-night-hairline text-ink dark:text-night-bone">
              {filteredItems.map((v) => (
                <tr key={v.opportunity.id} className="hover:bg-canvas-subtle dark:hover:bg-night-bg transition-colors">
                  <td className="py-3 px-3 font-semibold">
                    {v.opportunity.title}
                    <span className="block text-[10px] text-ink-muted dark:text-night-muted font-normal">
                      {v.opportunity.university_or_provider}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[11px] uppercase">
                    {v.opportunity.country}
                  </td>
                  <td className="py-3 px-3 font-bold text-cobalt dark:text-cobalt-dark">
                    {v.opportunity.amount}
                  </td>
                  <td className="py-3 px-3 text-emerald font-bold">
                    {v.eligibility_score}%
                  </td>
                  <td className="py-3 px-3 text-right">
                    <a
                      href={v.opportunity.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink-muted hover:text-cobalt hover:underline"
                    >
                      [ VISIT ↗ ]
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejected Drawer */}
      <div className="border border-hairline dark:border-night-hairline p-6 bg-white dark:bg-night-sheet shadow-sm font-mono-ledger text-xs">
        <button
          onClick={() => setShowRejected(!showRejected)}
          className="w-full flex items-center justify-between text-left"
        >
          <div>
            <span className="font-bold text-ink dark:text-night-bone uppercase tracking-widest block">
              DRAWER: REJECTED CANDIDATES & AUDIT TRAILS ({rejected.length})
            </span>
            <span className="text-[10px] text-ink-muted dark:text-night-muted">
              Programs discarded due to dead URLs or unverified GPA requirements (Full Transparency)
            </span>
          </div>
          <span className="text-cobalt font-bold">
            {showRejected ? '[-] COLLAPSE' : '[+] EXPAND'}
          </span>
        </button>

        {showRejected && (
          <div className="mt-4 pt-4 border-t border-hairline dark:border-night-hairline space-y-2">
            {rejected.map((r, idx) => (
              <div key={idx} className="p-3 border border-hairline dark:border-night-hairline bg-canvas-subtle dark:bg-night-bg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-ink dark:text-night-bone block">{r.opportunity.title}</span>
                  <span className="text-[10px] text-ink-muted dark:text-night-muted">{r.opportunity.source_url}</span>
                </div>
                <Stamp text={r.rejection_reason || 'UNMET CRITERIA'} variant="muted" size="sm" rotation={0} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
