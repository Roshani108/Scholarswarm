import React from 'react';
import { ShieldCheck, X, AlertTriangle, ExternalLink, CheckCircle2, ShieldAlert } from 'lucide-react';
import { TrustReport } from '../types/swarm';

interface TrustReportModalProps {
  report: TrustReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TrustReportModal: React.FC<TrustReportModalProps> = ({
  report,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel-elevated w-full max-w-3xl rounded-3xl border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading text-white">
                Adversarial Trust & Audit Report
              </h2>
              <p className="text-xs text-slate-400">
                Audited by Agent 07 (Critic & Auditor) • Timestamp: {report.audited_at}
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

        {/* Top Confidence Score & Risk Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-space-900 border border-slate-800 text-center">
            <div className="text-xs font-semibold text-slate-400 uppercase">Confidence Score</div>
            <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">
              {report.overall_confidence}%
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Audited against 7 validation criteria</div>
          </div>

          <div className="p-4 rounded-2xl bg-space-900 border border-slate-800 text-center">
            <div className="text-xs font-semibold text-slate-400 uppercase">Hallucination Risk</div>
            <div className="text-xl font-bold font-mono text-aurora-teal mt-2 inline-flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> {report.hallucination_risk}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Zero unbacked achievements</div>
          </div>

          <div className="p-4 rounded-2xl bg-space-900 border border-slate-800 text-center">
            <div className="text-xs font-semibold text-slate-400 uppercase">Verified Live URLs</div>
            <div className="text-3xl font-extrabold font-mono text-aurora-cyan mt-1">
              {report.verified_links_count} / {report.audited_opportunities_count}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Active official endpoints</div>
          </div>
        </div>

        {/* Auditor Verdict */}
        <div className="p-4 rounded-2xl bg-space-950/90 border border-emerald-500/30 text-xs">
          <div className="font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            Auditor Final Verdict
          </div>
          <p className="text-slate-300 leading-relaxed font-mono">
            {report.auditor_verdict}
          </p>
        </div>

        {/* Audit Warnings (if any) */}
        {report.warnings.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase text-amber-400 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Advisory Warnings ({report.warnings.length})
            </h4>
            <div className="space-y-2">
              {report.warnings.map((w, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-space-900 border border-amber-500/30 text-xs">
                  <div className="flex items-center justify-between font-semibold text-amber-300 mb-0.5">
                    <span>{w.affected_item}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20">
                      {w.category}
                    </span>
                  </div>
                  <div className="text-slate-300">{w.message}</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Action: <span className="text-slate-300">{w.action_suggested}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Source Audit Table */}
        <div>
          <h4 className="text-xs font-bold uppercase text-slate-300 mb-2">
            Inspected Source URLs & Domain Authority
          </h4>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-space-950 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Opportunity</th>
                  <th className="py-2.5 px-3">Domain</th>
                  <th className="py-2.5 px-3">Official</th>
                  <th className="py-2.5 px-3 text-right">HTTP Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {report.source_audit_list.map((s, idx) => (
                  <tr key={idx} className="hover:bg-space-900/50">
                    <td className="py-2.5 px-3 font-medium text-white truncate max-w-[200px]">
                      {s.opportunity_title}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">
                      {s.domain}
                    </td>
                    <td className="py-2.5 px-3">
                      {s.is_official_domain ? (
                        <span className="text-emerald-400 font-semibold">Yes (.edu/.gov)</span>
                      ) : (
                        <span className="text-slate-400">Portal</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                      {s.live_http_status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-space-700 hover:bg-space-600 transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
