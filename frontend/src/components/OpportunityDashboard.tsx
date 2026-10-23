import React, { useState } from 'react';
import { 
  Award, ShieldCheck, ExternalLink, FileText, ChevronRight, 
  MapPin, DollarSign, Calendar, CheckCircle2, XCircle, AlertCircle, 
  Sparkles, Filter, ShieldAlert
} from 'lucide-react';
import type { TopOpportunity, VerifiedOpportunity } from '../types/swarm';

interface OpportunityDashboardProps {
  top5: TopOpportunity[];
  allVerified: VerifiedOpportunity[];
  rejected: VerifiedOpportunity[];
  onSelectForSOP: (oppId: string) => void;
  onOpenTrustReport: () => void;
  onResetNewProfile: () => void;
}

export const OpportunityDashboard: React.FC<OpportunityDashboardProps> = ({
  top5,
  allVerified,
  rejected,
  onSelectForSOP,
  onOpenTrustReport,
  onResetNewProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'top5' | 'all' | 'rejected'>('top5');
  const [filterCountry, setFilterCountry] = useState<string>('all');

  const countries = Array.from(
    new Set([
      ...top5.map((t) => t.opportunity.opportunity.country),
      ...allVerified.map((v) => v.opportunity.country),
    ])
  ).filter(Boolean);

  const filteredTop5 = filterCountry === 'all' 
    ? top5 
    : top5.filter((t) => t.opportunity.opportunity.country === filterCountry);

  const filteredAll = filterCountry === 'all'
    ? allVerified
    : allVerified.filter((v) => v.opportunity.country === filterCountry);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Top Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Adversarially Audited • Zero Hallucinations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Curated Scholarship & University Dossier
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {allVerified.length} official opportunities crawled and mathematically scored against candidate credentials.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenTrustReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-sm transition-all"
            >
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              <span>Audit Certificate</span>
            </button>

            <button
              onClick={onResetNewProfile}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 transition-all"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Switch Candidate</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher & Country Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6">
          <div className="flex items-center gap-2 p-1 bg-slate-850 bg-[#161F30] rounded-xl w-fit border border-slate-800">
            <button
              onClick={() => setActiveTab('top5')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'top5'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Top 5 Recommendations ({top5.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Verified ({allVerified.length})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'rejected'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Screened Out ({rejected.length})
            </button>
          </div>

          {/* Country Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-slate-400 font-medium">Filter:</span>
            <button
              onClick={() => setFilterCountry('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                filterCountry === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              All Countries
            </button>
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setFilterCountry(c)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                  filterCountry === c
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TOP 5 TAB CONTENT */}
      {activeTab === 'top5' && (
        <div className="space-y-6">
          {filteredTop5.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No opportunities match the selected filter.</div>
          ) : (
            filteredTop5.map((item) => {
              const opp = item.opportunity.opportunity;
              const isReach = item.competitiveness === 'Reach';
              const isTarget = item.competitiveness === 'Target';
              return (
                <div
                  key={opp.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl hover:border-indigo-500/60 transition-all space-y-6"
                >
                  {/* Card Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-mono font-extrabold text-lg flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30">
                        #{item.rank}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 flex items-center gap-1 border border-slate-700">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {opp.country}
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                            isReach 
                              ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                              : isTarget
                              ? 'bg-blue-950/80 text-blue-300 border-blue-800'
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                          }`}>
                            {item.competitiveness} Match
                          </span>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 flex items-center gap-1 border border-emerald-800">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            Official .edu/.gov
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          {opp.title}
                        </h3>
                        <p className="text-sm font-medium text-indigo-400 mt-0.5">
                          {opp.university_or_provider} • {opp.degree_level} in {opp.field}
                        </p>
                      </div>
                    </div>

                    {/* Fit & Generosity Scores */}
                    <div className="flex items-center gap-4 shrink-0 sm:text-right">
                      <div className="p-3 rounded-2xl bg-[#161F30] border border-slate-800 text-center min-w-[90px]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          MATCH SCORE
                        </span>
                        <span className="text-xl font-extrabold text-indigo-400 font-mono mt-0.5 block">
                          {item.fit_score}%
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#161F30] border border-slate-800 text-center min-w-[90px]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          GENEROSITY
                        </span>
                        <span className="text-xl font-extrabold text-teal-400 font-mono mt-0.5 block">
                          {item.generosity_score}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Funding & Deadline Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#161F30] border border-slate-800 flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          Funding & Stipend Package
                        </div>
                        <div className="text-sm font-bold text-white">
                          {opp.amount || opp.funding_type}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#161F30] border border-slate-800 flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          Application Deadline
                        </div>
                        <div className="text-sm font-bold text-white">
                          {opp.deadline || 'Rolling / Priority Window'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Why It Fits Rationale */}
                  <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/60">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                      STRATEGIC PROFILE FIT
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.why_it_fits}
                    </p>
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <a
                      href={opp.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      <span>Visit Official University Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => onSelectForSOP(opp.id)}
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 active:scale-95 transition-all"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Draft Tailored SOP for this Program</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ALL VERIFIED TAB CONTENT */}
      {activeTab === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAll.map((v) => {
            const opp = v.opportunity;
            return (
              <div
                key={opp.id}
                className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    {opp.country} • {opp.degree_level}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    HTTP {v.http_status}
                  </span>
                </div>
                <h4 className="font-bold text-white text-base">
                  {opp.title}
                </h4>
                <p className="text-xs text-indigo-400 font-medium">
                  {opp.university_or_provider}
                </p>
                <div className="text-xs text-slate-300 font-mono">
                  {opp.amount || opp.funding_type}
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <a
                    href={opp.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => onSelectForSOP(opp.id)}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <span>Draft SOP</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* REJECTED / SCREENED OUT TAB CONTENT */}
      {activeTab === 'rejected' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-900/50 text-xs text-amber-300 leading-relaxed">
            ScholarSwarm's Verification Agent automatically filters out opportunities that do not meet strict student constraints (e.g. minimum GPA criteria, expired deadlines, non-matching degree requirements) to protect the applicant from wasted applications.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rejected.map((v) => {
              const opp = v.opportunity;
              return (
                <div
                  key={opp.id}
                  className="bg-slate-900/90 border border-red-950/60 p-5 rounded-2xl space-y-2 opacity-85"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">
                      {opp.country} • {opp.university_or_provider}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800">
                      FILTERED OUT
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">
                    {opp.title}
                  </h4>
                  <p className="text-xs text-red-400 leading-snug">
                    Reason: {v.rejection_reason || 'Criteria requirement not met.'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
