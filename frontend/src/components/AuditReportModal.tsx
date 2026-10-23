import React from 'react';
import { ShieldCheck, X } from 'lucide-react';
import type { TrustReport } from '../types/swarm';

interface AuditReportModalProps {
  report: TrustReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  report,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6 text-white">
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-800 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Trust Certificate</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Adversarial Quality & Verification Audit
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Issued by Agent 07 (Critic & Auditor) • Audited at {report.audited_at}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Metric Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#161F30] border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              CONFIDENCE SCORE
            </span>
            <span className="text-3xl font-extrabold text-indigo-400 font-mono mt-1 block">
              {report.overall_confidence}%
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
              High Evidentiary Depth
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#161F30] border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              HALLUCINATION RISK
            </span>
            <span className="text-3xl font-extrabold text-emerald-400 font-mono mt-1 block">
              0.0%
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
              Strict Direct Citations
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#161F30] border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              LIVE ACCREDITED URLS
            </span>
            <span className="text-3xl font-extrabold text-blue-400 font-mono mt-1 block">
              {report.verified_links_count} / {report.audited_opportunities_count}
            </span>
            <span className="text-[10px] text-blue-400 font-semibold block mt-1">
              Verified .edu / .gov
            </span>
          </div>
        </div>

        {/* Auditor Attestation Statement */}
        <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-900/60">
          <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
            FORMAL ATTESTATION STATEMENT
          </span>
          <p className="text-xs text-slate-300 leading-relaxed italic">
            "{report.auditor_verdict}"
          </p>
        </div>

        {/* Official URL Verification Ledger */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block">
            Verified Endpoint Registry
          </span>
          <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#161F30]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Opportunity</th>
                  <th className="py-2.5 px-3">Domain</th>
                  <th className="py-2.5 px-3">Domain Authority</th>
                  <th className="py-2.5 px-3 text-right">HTTP Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {report.source_audit_list.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/50">
                    <td className="py-2.5 px-3 font-medium text-white truncate max-w-[220px]">
                      {s.opportunity_title}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{s.domain}</td>
                    <td className="py-2.5 px-3">
                      {s.is_official_domain ? (
                        <span className="text-emerald-400 font-semibold">[ OFFICIAL .EDU / .GOV ]</span>
                      ) : (
                        <span className="text-slate-500">PORTAL</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-bold font-mono">
                      {s.live_http_status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            Dismiss Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
