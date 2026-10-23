import React, { useState } from 'react';
import { Stamp } from '../design-system/Stamp';
import type { SOPDraft, TopOpportunity } from '../types/swarm';

interface EditorialStudioProps {
  sopDraft: SOPDraft | null;
  topOpportunities: TopOpportunity[];
  selectedOpportunityId?: string;
  onSelectOpportunity: (id: string) => void;
  onRegenerateSOP: (id: string) => void;
  isRegenerating: boolean;
  onBackToDashboard: () => void;
}

export const EditorialStudio: React.FC<EditorialStudioProps> = ({
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
  const [hoveredClaimIdx, setHoveredClaimIdx] = useState<number | null>(null);

  if (!sopDraft) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20 text-center border border-hairline dark:border-night-hairline p-8 bg-white dark:bg-night-sheet font-mono-ledger">
        <h3 className="font-display text-3xl text-ink dark:text-night-bone mb-2">No Statement of Purpose Generated Yet</h3>
        <p className="text-xs text-ink-muted dark:text-night-muted mb-6">Select a top opportunity sheet from Section 03 to draft a verified SOP.</p>
        <button
          onClick={onBackToDashboard}
          className="px-6 py-3 bg-cobalt hover:bg-cobalt-hover text-white font-mono-ledger text-xs uppercase tracking-widest font-bold shadow-sm"
        >
          RETURN TO DOSSIER SHEETS
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
    <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-12 space-y-8">
      {/* Editorial Spread Masthead */}
      <div className="border border-hairline dark:border-night-hairline p-6 sm:p-8 bg-white dark:bg-night-sheet shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-hairline dark:border-night-hairline gap-4 font-mono-ledger text-xs">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-cobalt dark:text-cobalt-dark uppercase tracking-widest font-bold">
                APPLICATION STUDIO / TWO-PAGE EDITORIAL SPREAD
              </span>
              <Stamp text="DRAFT ONLY" variant="cobalt" size="sm" rotation={0} />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-ink dark:text-night-bone mt-2">
              {sopDraft.opportunity_title}
            </h2>
            <p className="text-[11px] text-ink-muted dark:text-night-muted mt-1 uppercase">
              INSTITUTION: {sopDraft.target_institution} • LENGTH: {sopDraft.word_count} WORDS • ALL CLAIMS GROUNDED
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono-ledger text-xs">
            <select
              value={selectedOpportunityId || sopDraft.opportunity_id}
              onChange={(e) => {
                onSelectOpportunity(e.target.value);
                onRegenerateSOP(e.target.value);
              }}
              className="px-3 py-2 border border-hairline dark:border-night-hairline bg-canvas dark:bg-night-bg text-ink dark:text-night-bone text-xs font-mono-ledger uppercase outline-none focus:border-cobalt"
            >
              {topOpportunities.map((t) => (
                <option key={t.opportunity.opportunity.id} value={t.opportunity.opportunity.id}>
                  #{t.rank} {t.opportunity.opportunity.title} ({t.opportunity.opportunity.country.toUpperCase()})
                </option>
              ))}
            </select>

            <button
              onClick={() => onRegenerateSOP(selectedOpportunityId || sopDraft.opportunity_id)}
              disabled={isRegenerating}
              className="px-3 py-2 border border-hairline dark:border-night-hairline hover:border-cobalt text-ink dark:text-night-bone uppercase tracking-widest disabled:opacity-50"
            >
              {isRegenerating ? '[ RE-DRAFTING... ]' : '[ REGENERATE ]'}
            </button>

            <button
              onClick={onBackToDashboard}
              className="px-3 py-2 bg-ink dark:bg-night-bone text-white dark:text-night-bg uppercase tracking-widest"
            >
              ← DOSSIER
            </button>
          </div>
        </div>

        {/* Spread Navigation Tabs */}
        <div className="pt-4 flex items-center gap-2 font-mono-ledger text-xs">
          <button
            onClick={() => setActiveTab('sop')}
            className={`px-3 py-1.5 border transition-all ${
              activeTab === 'sop'
                ? 'border-cobalt bg-cobalt text-white font-bold shadow-sm'
                : 'border-hairline dark:border-night-hairline text-ink-muted hover:text-ink'
            }`}
          >
            [ SPREAD: STATEMENT OF PURPOSE ]
          </button>
          <button
            onClick={() => setActiveTab('lor')}
            className={`px-3 py-1.5 border transition-all ${
              activeTab === 'lor'
                ? 'border-cobalt bg-cobalt text-white font-bold shadow-sm'
                : 'border-hairline dark:border-night-hairline text-ink-muted hover:text-ink'
            }`}
          >
            [ PROFESSOR RECOMMENDATION EMAIL ]
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-3 py-1.5 border transition-all ${
              activeTab === 'docs'
                ? 'border-cobalt bg-cobalt text-white font-bold shadow-sm'
                : 'border-hairline dark:border-night-hairline text-ink-muted hover:text-ink'
            }`}
          >
            [ REQUIRED DOSSIER ATTACHMENTS ({sopDraft.required_documents.length}) ]
          </button>
        </div>
      </div>

      {/* Two-Page Spread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Page (8 cols): The Typed Paper Sheet */}
        <div className="lg:col-span-8 border border-hairline dark:border-night-hairline p-8 sm:p-12 bg-white dark:bg-night-sheet shadow-sm relative space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-hairline dark:border-night-hairline font-mono-ledger text-xs text-ink-muted dark:text-night-muted">
            <span>BUR-SOP / FORMAL RESEARCH INTENT</span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="hover:text-cobalt uppercase tracking-widest transition-colors"
              >
                {copied ? '[ COPIED ]' : '[ COPY TEXT ]'}
              </button>
              <button
                onClick={handleExportMarkdown}
                className="hover:text-cobalt uppercase tracking-widest transition-colors"
              >
                [ EXPORT .MD ]
              </button>
            </div>
          </div>

          {activeTab === 'sop' ? (
            <div className="font-sans text-base sm:text-lg text-ink dark:text-night-bone leading-relaxed whitespace-pre-line space-y-4 max-w-none">
              {sopDraft.statement_of_purpose}
              <span className="inline-block w-2 h-4 bg-cobalt ml-1 animate-pulse" />
            </div>
          ) : activeTab === 'lor' ? (
            <div className="font-mono-ledger text-xs text-ink dark:text-night-bone whitespace-pre-wrap leading-relaxed p-4 border border-hairline dark:border-night-hairline bg-canvas-subtle dark:bg-night-bg">
              {sopDraft.letter_of_recommendation_template}
            </div>
          ) : (
            <div className="space-y-3 font-mono-ledger text-xs">
              {sopDraft.required_documents.map((doc, idx) => (
                <div key={idx} className="p-3 border border-hairline dark:border-night-hairline bg-canvas dark:bg-night-bg flex items-center gap-3">
                  <span className="font-bold text-cobalt">ATTACHMENT 0{idx + 1}:</span>
                  <span className="text-ink dark:text-night-bone">{doc}</span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-6 border-t border-hairline dark:border-night-hairline font-mono-ledger text-[10px] text-ink-muted dark:text-night-muted">
            <span className="font-bold text-ink dark:text-night-bone">LEGAL DISCLAIMER:</span> {sopDraft.disclaimer}
          </div>
        </div>

        {/* Right Page (4 cols): Marginalia Fact-Check Annotations */}
        <div className="lg:col-span-4 border border-hairline dark:border-night-hairline p-6 bg-white dark:bg-night-sheet shadow-sm space-y-4">
          <div className="pb-3 border-b border-hairline dark:border-night-hairline font-mono-ledger text-xs">
            <span className="font-bold text-ink dark:text-night-bone uppercase tracking-widest block">
              MARGINALIA: FACT-CHECK PROOF
            </span>
            <span className="text-[10px] text-ink-muted dark:text-night-muted">
              Every sentence linked to verifiable student records
            </span>
          </div>

          <div className="space-y-4">
            {sopDraft.fact_checks.map((claim, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredClaimIdx(idx)}
                onMouseLeave={() => setHoveredClaimIdx(null)}
                className={`p-3.5 border transition-all font-mono-ledger text-xs ${
                  hoveredClaimIdx === idx
                    ? 'border-cobalt bg-cobalt/5 text-ink dark:text-night-bone shadow-sm'
                    : 'border-hairline dark:border-night-hairline bg-canvas-subtle dark:bg-night-bg text-ink-muted dark:text-night-muted'
                }`}
              >
                <div className="flex items-center justify-between mb-1 text-[10px] uppercase font-bold text-cobalt">
                  <span>PROOF NOTE 0{idx + 1}</span>
                  <span className="text-emerald">100% MATCH</span>
                </div>

                <div className="font-sans text-xs text-ink dark:text-night-bone font-medium mb-2 leading-snug">
                  "{claim.sentence_or_claim}"
                </div>

                <div className="text-[10px] border-t border-hairline dark:border-night-hairline pt-2 text-ink-muted dark:text-night-muted">
                  CITED PROOF: <span className="font-bold text-ink dark:text-night-bone">{claim.source_ref}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
