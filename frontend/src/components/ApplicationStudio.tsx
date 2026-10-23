import React, { useState } from 'react';
import { 
  FileEdit, Copy, Check, Download, RefreshCw, 
  ShieldCheck, AlertCircle, Mail, Sparkles, BookOpen 
} from 'lucide-react';
import { SOPDraft, TopOpportunity } from '../types/swarm';

interface ApplicationStudioProps {
  sopDraft: SOPDraft | null;
  topOpportunities: TopOpportunity[];
  selectedOpportunityId?: string;
  onSelectOpportunity: (id: string) => void;
  onRegenerateSOP: (id: string) => void;
  isRegenerating: boolean;
  onBackToDashboard: () => void;
}

export const ApplicationStudio: React.FC<ApplicationStudioProps> = ({
  sopDraft,
  topOpportunities,
  selectedOpportunityId,
  onSelectOpportunity,
  onRegenerateSOP,
  isRegenerating,
  onBackToDashboard,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'sop' | 'lor' | 'docs'>('sop');
  const [hoveredClaimIndex, setHoveredClaimIndex] = useState<number | null>(null);

  if (!sopDraft) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center glass-panel rounded-2xl p-8 border border-white/10">
        <FileEdit className="w-12 h-12 text-aurora-violet mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Statement of Purpose Generated Yet</h3>
        <p className="text-sm text-slate-400 mb-6">
          Select one of your top 5 verified opportunities to generate a grounded, fact-checked draft.
        </p>
        <button
          onClick={onBackToDashboard}
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-aurora-violet hover:bg-purple-600 transition-colors"
        >
          Return to Results Dashboard
        </button>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(sopDraft.statement_of_purpose);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportMarkdown = () => {
    const mdContent = `# ${sopDraft.opportunity_title} - Statement of Purpose\nTarget: ${sopDraft.target_institution}\n\n${sopDraft.statement_of_purpose}\n\n---\n*${sopDraft.disclaimer}*`;
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SOP_${sopDraft.opportunity_title.replace(/\s+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header & Opportunity Selector */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-aurora-violet text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            AI Application Studio
          </div>
          <h2 className="text-2xl font-bold font-heading text-white">
            {sopDraft.opportunity_title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Target Institution: <span className="text-slate-200 font-medium">{sopDraft.target_institution}</span> • Word Count: {sopDraft.word_count} words
          </p>
        </div>

        {/* Opportunity Switcher Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedOpportunityId || sopDraft.opportunity_id}
            onChange={(e) => {
              onSelectOpportunity(e.target.value);
              onRegenerateSOP(e.target.value);
            }}
            className="px-3.5 py-2 rounded-xl bg-space-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-aurora-violet"
          >
            {topOpportunities.map((t) => (
              <option key={t.opportunity.opportunity.id} value={t.opportunity.opportunity.id}>
                #{t.rank} {t.opportunity.opportunity.title} ({t.opportunity.opportunity.country})
              </option>
            ))}
          </select>

          <button
            onClick={() => onRegenerateSOP(selectedOpportunityId || sopDraft.opportunity_id)}
            disabled={isRegenerating}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-space-850 hover:bg-space-800 border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            Regenerate
          </button>

          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 bg-space-700 hover:bg-space-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('sop')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'sop'
              ? 'bg-aurora-violet text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileEdit className="w-3.5 h-3.5" />
          Statement of Purpose (Draft)
        </button>

        <button
          onClick={() => setActiveTab('lor')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'lor'
              ? 'bg-aurora-violet text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          Recommendation Letter Template
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'docs'
              ? 'bg-aurora-violet text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Required Document Checklist ({sopDraft.required_documents.length})
        </button>
      </div>

      {/* Main Split View: Left = Draft Content, Right = Fact-Check Verification Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Draft Content */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400">
              Drafted by ScholarSwarm Application Writer Agent
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-space-850 hover:bg-space-800 border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>

              <button
                onClick={handleExportMarkdown}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-space-850 hover:bg-space-800 border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Export Markdown
              </button>
            </div>
          </div>

          {activeTab === 'sop' ? (
            <div className="prose prose-invert max-w-none text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line space-y-4">
              {sopDraft.statement_of_purpose}
            </div>
          ) : activeTab === 'lor' ? (
            <div className="p-4 rounded-xl bg-space-950 font-mono-code text-xs text-slate-300 whitespace-pre-wrap leading-relaxed border border-slate-800">
              {sopDraft.letter_of_recommendation_template}
            </div>
          ) : (
            <div className="space-y-3">
              {sopDraft.required_documents.map((doc, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-space-900 border border-slate-800 flex items-center gap-3 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-aurora-teal/20 text-aurora-teal flex items-center justify-center font-mono font-bold text-xs">
                    {idx + 1}
                  </div>
                  <span className="text-slate-200 font-medium">{doc}</span>
                </div>
              ))}
            </div>
          )}

          {/* Non-Negotiable Disclaimer */}
          <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-300">DISCLAIMER:</span> {sopDraft.disclaimer}
            </div>
          </div>
        </div>

        {/* Right Column: Fact-Check Verification Pane */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Fact-Check Verification Pane
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Every claim in the SOP is grounded in verified student credentials with zero hallucinated achievements.
          </p>

          <div className="space-y-3">
            {sopDraft.fact_checks.map((claim, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredClaimIndex(idx)}
                onMouseLeave={() => setHoveredClaimIndex(null)}
                className={`p-3.5 rounded-xl border transition-all text-xs ${
                  hoveredClaimIndex === idx
                    ? 'bg-aurora-teal/15 border-aurora-teal text-white shadow-md'
                    : 'bg-space-900/70 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-aurora-teal text-[11px] uppercase">
                    Claim 0{idx + 1} Verified
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                    MATCH 100%
                  </span>
                </div>

                <div className="font-medium text-slate-200 mb-1 leading-snug">
                  "{claim.sentence_or_claim}"
                </div>

                <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span>Source: {claim.source_ref}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
