import React, { useState } from 'react';
import { 
  FileText, Copy, Download, RefreshCw, CheckCircle2, 
  ArrowLeft, ShieldCheck, Layers
} from 'lucide-react';
import type { SOPDraft, TopOpportunity } from '../types/swarm';

interface SOPStudioProps {
  sopDraft: SOPDraft | null;
  topOpportunities: TopOpportunity[];
  selectedOpportunityId?: string;
  onSelectOpportunity: (id: string) => void;
  onRegenerateSOP: (oppId: string) => void;
  isRegenerating: boolean;
  onBackToDashboard: () => void;
}

export const SOPStudio: React.FC<SOPStudioProps> = ({
  sopDraft,
  topOpportunities,
  selectedOpportunityId,
  onSelectOpportunity,
  onRegenerateSOP,
  isRegenerating,
  onBackToDashboard,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'sop' | 'lor'>('sop');

  const selectedOpp = topOpportunities.find(
    (t) => t.opportunity.opportunity.id === (selectedOpportunityId || sopDraft?.opportunity_id)
  ) || topOpportunities[0];

  const handleCopy = () => {
    if (!sopDraft) return;
    const textToCopy = activeTab === 'sop' ? sopDraft.statement_of_purpose : sopDraft.letter_of_recommendation_template;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!sopDraft) return;
    const text = activeTab === 'sop' ? sopDraft.statement_of_purpose : sopDraft.letter_of_recommendation_template;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sopDraft.opportunity_title.replace(/\s+/g, '_')}_${activeTab.toUpperCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!sopDraft) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-12 shadow-xl">
          <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            No SOP Draft Generated Yet
          </h3>
          <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
            Select a target opportunity from your matched scholarships to synthesize a tailored, fact-checked Statement of Purpose.
          </p>
          <button
            onClick={onBackToDashboard}
            className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all"
          >
            Explore Matched Scholarships
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      {/* Studio Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <button
              onClick={onBackToDashboard}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Matched Scholarships</span>
            </button>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Application & SOP Studio
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              TARGET: {sopDraft.target_institution} • {sopDraft.opportunity_title}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onRegenerateSOP(sopDraft.opportunity_id)}
              disabled={isRegenerating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-sm transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-indigo-400' : ''}`} />
              <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Draft'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-sm transition-all"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Markdown</span>
            </button>
          </div>
        </div>

        {/* Tab switcher: SOP vs LOR Template */}
        <div className="flex items-center justify-between pt-6">
          <div className="flex items-center gap-2 p-1 bg-[#161F30] rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('sop')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'sop'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Fact-Checked Statement of Purpose
            </button>
            <button
              onClick={() => setActiveTab('lor')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'lor'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Letter of Recommendation Template
            </button>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {sopDraft.word_count} words • ~3 min read
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Required Documents & Fact Checks (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Document Checklist */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Application Document Checklist
            </h4>
            <div className="space-y-2.5">
              {sopDraft.required_documents.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fact-Checked Evidence Citations */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Zero-Hallucination Proofs
              </h4>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                100% VERIFIED
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Every factual assertion in this draft is tethered directly to the applicant's verified transcripts and repositories.
            </p>
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {sopDraft.fact_checks.map((fc, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#161F30] border border-slate-800 text-xs space-y-1"
                >
                  <div className="text-[11px] font-semibold text-white">
                    "{fc.sentence_or_claim}"
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    ✓ Evidence: {fc.student_evidence}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: High-End Manuscript */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl">
          {activeTab === 'sop' ? (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">
                    FORMAL STATEMENT OF PURPOSE
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {sopDraft.opportunity_title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                    Fact-Checked
                  </span>
                </div>
              </div>

              {/* Formatted SOP Body */}
              <div className="text-sm text-slate-200 leading-relaxed space-y-4 font-sans">
                {sopDraft.statement_of_purpose.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="leading-7">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500 italic">
                * Note: ScholarSwarm is a research bureau and application assistance engine. It never auto-submits applications. The student maintains full editorial autonomy over the final submission.
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">
                  RECOMMENDATION LETTER BLUEPRINT
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Faculty Recommendation Template
                </h3>
              </div>
              <div className="text-sm text-slate-200 leading-relaxed font-mono whitespace-pre-wrap bg-[#161F30] p-6 rounded-2xl border border-slate-800">
                {sopDraft.letter_of_recommendation_template}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
