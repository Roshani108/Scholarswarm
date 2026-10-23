import React, { useState } from 'react';
import { 
  Trophy, ExternalLink, CheckCircle2, AlertTriangle, 
  Clock, DollarSign, ArrowRight, ShieldCheck, ChevronDown, ChevronUp, FileText, Filter
} from 'lucide-react';
import { TopOpportunity, VerifiedOpportunity } from '../types/swarm';

interface ResultsDashboardProps {
  top5: TopOpportunity[];
  allVerified: VerifiedOpportunity[];
  rejected: VerifiedOpportunity[];
  onSelectForSOP: (opportunityId: string) => void;
  onOpenTrustReport: () => void;
  onResetNewProfile: () => void;
}

const COUNTRY_FLAGS: Record<string, string> = {
  Canada: '🇨🇦',
  Germany: '🇩🇪',
  Singapore: '🇸🇬',
  'United Kingdom': '🇬🇧',
  'United States': '🇺🇸',
  Europe: '🇪🇺',
  Global: '🌐',
};

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  top5,
  allVerified,
  rejected,
  onSelectForSOP,
  onOpenTrustReport,
  onResetNewProfile,
}) => {
  const [filterCountry, setFilterCountry] = useState('ALL');
  const [showRejected, setShowRejected] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(top5[0]?.opportunity.opportunity.id || null);

  const countries = ['ALL', ...Array.from(new Set(allVerified.map((v) => v.opportunity.country)))];

  const filteredOpportunities = allVerified.filter((v) => {
    if (filterCountry === 'ALL') return true;
    return v.opportunity.country === filterCountry;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Dashboard Top Header */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-aurora-teal text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            Verified Recommendations
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Top 5 Strategic Scholarship Matches
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Grounded in official portals. Verified against student GPA, degree requirements, and research evidence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTrustReport}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-space-850 hover:bg-space-800 border border-slate-700 hover:border-aurora-teal transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-aurora-teal" />
            View Trust Report & Audit
          </button>
          <button
            onClick={onResetNewProfile}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-space-700 hover:bg-space-600 transition-all"
          >
            New Profile (Surprise Demo)
          </button>
        </div>
      </div>

      {/* Top 5 Cards */}
      <div className="space-y-6">
        {top5.map((top) => {
          const opp = top.opportunity.opportunity;
          const flag = COUNTRY_FLAGS[opp.country] || '🌐';
          const isExpanded = expandedCardId === opp.id;

          return (
            <div
              key={opp.id}
              className="glass-panel rounded-2xl border border-white/10 p-6 sm:p-7 hover:border-aurora-violet/40 transition-all shadow-xl"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-start gap-4">
                  {/* Rank Badge with Match Score Ring */}
                  <div className="relative flex-shrink-0 w-16 h-16 rounded-2xl bg-space-950 border border-slate-700 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">RANK</span>
                    <span className="text-2xl font-extrabold font-heading text-white leading-none">
                      #{top.rank}
                    </span>
                    <span className="text-[10px] text-aurora-teal font-mono font-bold">
                      {top.fit_score}% Fit
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xl">{flag}</span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {opp.country}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          top.competitiveness === 'Target'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : top.competitiveness === 'Reach'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {top.competitiveness} Match
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white font-heading">
                      {opp.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Provider: <span className="text-slate-300 font-medium">{opp.university_or_provider}</span> • Level: {opp.degree_level}
                    </p>
                  </div>
                </div>

                {/* Funding & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="px-4 py-2 rounded-xl bg-space-900 border border-slate-700/80">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-emerald-400" /> Funding Value
                    </div>
                    <div className="text-sm font-bold text-emerald-400 font-mono">
                      {opp.amount}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectForSOP(opp.id)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-aurora-violet to-purple-600 hover:opacity-95 transition-all flex items-center gap-2 shadow-md shadow-purple-500/20"
                  >
                    Draft Tailored SOP
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Why It Fits Section */}
              <div className="pt-4 pb-2">
                <div className="text-xs font-bold uppercase text-aurora-cyan tracking-wider mb-1">
                  Why This Program Fits You
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {top.why_it_fits}
                </p>
              </div>

              {/* Verified Source Badge & Official Evidence Snippet */}
              <div className="mt-3 p-3.5 rounded-xl bg-space-950/70 border border-slate-800">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Verified Official Source (HTTP {top.opportunity.http_status})
                  </span>
                  <a
                    href={opp.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-aurora-teal hover:underline flex items-center gap-1"
                  >
                    Visit Official Portal
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-slate-400 italic">
                  "{top.opportunity.source_snippet || opp.raw_page_snippet || 'Verified on official admissions portal.'}"
                </p>
              </div>

              {/* Collapsible Details: Eligibility Criteria & Roadmap */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setExpandedCardId(isExpanded ? null : opp.id)}
                  className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  {isExpanded ? 'Hide Eligibility Checklist & Roadmap' : 'View 5-Point Eligibility Criteria & Roadmap'}
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <span className="text-[11px] font-mono text-slate-500">
                  Updated: {top.opportunity.verified_at}
                </span>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-4">
                  {/* Criteria Checklist */}
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-300 mb-2">
                      Eligibility Evaluation Breakdown
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {top.opportunity.criteria.map((c, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-space-900 border border-slate-800 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-white">{c.criterion}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                c.status === 'MET'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : c.status === 'PARTIAL'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {c.status}
                            </span>
                          </div>
                          <div className="text-slate-400">{c.requirement}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Application Roadmap */}
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-300 mb-2">
                      Application Action Roadmap
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {top.application_roadmap.map((step) => (
                        <div key={step.step_number} className="p-3 rounded-lg bg-space-900 border border-slate-800">
                          <div className="text-[10px] font-mono font-bold text-aurora-teal uppercase">
                            Step 0{step.step_number} • {step.target_date}
                          </div>
                          <div className="text-xs font-bold text-white mt-0.5 mb-1.5">{step.title}</div>
                          <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
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
            </div>
          );
        })}
      </div>

      {/* Filterable Table of ALL 10+ Verified Opportunities */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold font-heading text-white">
              All Verified Opportunities ({allVerified.length})
            </h3>
            <p className="text-xs text-slate-400">
              Sort and filter through all live verified programs surviving criteria audit.
            </p>
          </div>

          {/* Country Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setFilterCountry(c)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterCountry === c
                    ? 'bg-aurora-violet text-white'
                    : 'bg-space-900 text-slate-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-space-950 text-slate-400 uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3 px-4 rounded-l-lg">Program / Award</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4">Funding Level</th>
                <th className="py-3 px-4">Eligibility</th>
                <th className="py-3 px-4 rounded-r-lg text-right">Official Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredOpportunities.map((v) => (
                <tr key={v.opportunity.id} className="hover:bg-space-850/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {v.opportunity.title}
                    <div className="text-[11px] text-slate-400 font-normal">
                      {v.opportunity.university_or_provider}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {COUNTRY_FLAGS[v.opportunity.country] || ''} {v.opportunity.country}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400 font-medium">
                    {v.opportunity.amount}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-aurora-teal">
                    {v.eligibility_score}%
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={v.opportunity.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-aurora-cyan hover:underline"
                    >
                      Visit <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejected Opportunities & Why (Transparency Builds Trust) */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10">
        <button
          onClick={() => setShowRejected(!showRejected)}
          className="w-full flex items-center justify-between text-left"
        >
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Rejected Opportunities & Audit Logs ({rejected.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Programs discarded during verification due to dead links or unmet requirements (Transparency).
            </p>
          </div>
          {showRejected ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {showRejected && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
            {rejected.map((r, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-space-950 border border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <div className="font-semibold text-slate-200">{r.opportunity.title}</div>
                  <div className="text-slate-400 text-[11px] font-mono">{r.opportunity.source_url}</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-rose-500/15 text-rose-400 font-mono text-[11px] font-medium border border-rose-500/30">
                  {r.rejection_reason || 'Incomplete criteria'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
