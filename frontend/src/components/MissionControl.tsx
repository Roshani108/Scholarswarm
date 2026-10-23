import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, ShieldCheck, Terminal, Cpu, CheckCircle2, 
  AlertTriangle, RefreshCw, Activity, Zap, Compass, FileEdit, ShieldAlert
} from 'lucide-react';
import { AgentEvent, SwarmStats, NodeStatus } from '../types/swarm';

interface MissionControlProps {
  events: AgentEvent[];
  stats: SwarmStats;
  isRunning: boolean;
  isCompleted: boolean;
  onViewResults: () => void;
  chaosEnabled: boolean;
  onToggleChaos: (val: boolean) => void;
}

const AGENT_NODES = [
  { id: 'supervisor', name: 'Supervisor Orchestrator', role: 'Health & Re-Plan Loop', x: 50, y: 15, icon: Cpu },
  { id: 'profile_analyst', name: 'Profile Analyst', role: 'Resume & GPA Normalizer', x: 20, y: 38, icon: Bot },
  { id: 'profile_enricher', name: 'Profile Enrichment', role: 'GitHub & Evidence Extractor', x: 80, y: 38, icon: Activity },
  { id: 'research_scout', name: 'Research Scout', role: 'Parallel Matrix Harvester', x: 20, y: 65, icon: Compass },
  { id: 'verification_agent', name: 'Verification & Eligibility', role: 'Official Crawler & Evaluator', x: 80, y: 65, icon: ShieldCheck },
  { id: 'strategist_ranker', name: 'Strategist & Ranker', role: 'Top 5 Match & Roadmap', x: 35, y: 90, icon: Zap },
  { id: 'application_writer', name: 'Application Writer', role: 'Fact-Checked SOP Generator', x: 65, y: 90, icon: FileEdit },
  { id: 'critic_auditor', name: 'Critic & Auditor', role: 'Adversarial Trust Audit', x: 50, y: 52, icon: ShieldAlert },
];

const PHASES = [
  { id: 'understand', label: 'Understand' },
  { id: 'enrich', label: 'Enrich' },
  { id: 'research', label: 'Research' },
  { id: 'verify', label: 'Verify' },
  { id: 'rank', label: 'Rank' },
  { id: 'draft', label: 'Draft' },
  { id: 'audit', label: 'Audit' },
];

export const MissionControl: React.FC<MissionControlProps> = ({
  events,
  stats,
  isRunning,
  isCompleted,
  onViewResults,
  chaosEnabled,
  onToggleChaos,
}) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<AgentEvent | null>(null);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  // Determine current active node statuses from the latest events
  const getNodeStatus = (agentId: string): NodeStatus => {
    for (let i = events.length - 1; i >= 0; i--) {
      if (events[i].agent_id === agentId) {
        return events[i].status;
      }
    }
    return isRunning ? 'idle' : isCompleted ? 'success' : 'idle';
  };

  // Determine active phase
  const latestEvent = events[events.length - 1];
  const activePhase = latestEvent?.phase || 'understand';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header & Live Counter Bar */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="flex h-3 w-3">
                {isRunning ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aurora-teal opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-aurora-teal" />
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                )}
              </span>
            </div>
            <h2 className="text-xl font-bold font-heading text-white">
              ScholarSwarm Mission Control
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-aurora-violet/20 text-aurora-violet border border-aurora-violet/30 font-mono">
              7 Agents Autonomous
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time pipeline orchestration, autonomous replanning loops, and adversarial verification.
          </p>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
          <div className="p-3 rounded-xl bg-space-900 border border-slate-700/60 text-center">
            <div className="text-xs text-slate-400 uppercase tracking-wider">Discovered</div>
            <div className="text-xl font-extrabold font-mono text-aurora-cyan mt-0.5">
              {stats.candidates_found || 0}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-space-900 border border-slate-700/60 text-center">
            <div className="text-xs text-slate-400 uppercase tracking-wider">Verified</div>
            <div className="text-xl font-extrabold font-mono text-emerald-400 mt-0.5">
              {stats.opportunities_verified || 0}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-space-900 border border-slate-700/60 text-center">
            <div className="text-xs text-slate-400 uppercase tracking-wider">Rejected</div>
            <div className="text-xl font-extrabold font-mono text-slate-400 mt-0.5">
              {stats.opportunities_rejected || 0}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center">
            <div className="text-xs text-rose-300 uppercase tracking-wider flex items-center justify-center gap-1">
              <RefreshCw className="w-3 h-3" /> Healed
            </div>
            <div className="text-xl font-extrabold font-mono text-rose-400 mt-0.5">
              {stats.failures_healed || 0}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleChaos(!chaosEnabled)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chaosEnabled
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-space-800 text-slate-400 border border-slate-700 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Chaos {chaosEnabled ? 'ON' : 'OFF'}
          </button>

          {isCompleted && (
            <button
              onClick={onViewResults}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-aurora-violet to-aurora-teal hover:opacity-90 transition-all shadow-lg shadow-teal-500/20"
            >
              View Verified Top 5 & SOP →
            </button>
          )}
        </div>
      </div>

      {/* Progress Phase Rail */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10">
        <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
          {PHASES.map((p, idx) => {
            const isPassed = PHASES.findIndex((x) => x.id === activePhase) >= idx || isCompleted;
            const isCurrent = activePhase === p.id && isRunning;
            return (
              <div
                key={p.id}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-aurora-violet/20 border-aurora-violet text-white shadow-md shadow-purple-500/20'
                    : isPassed
                    ? 'bg-space-900/80 border-emerald-500/40 text-emerald-400'
                    : 'bg-space-900/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-[10px] uppercase font-mono font-bold tracking-wider mb-0.5">
                  Phase 0{idx + 1}
                </div>
                <div className="text-xs font-semibold flex items-center justify-center gap-1">
                  {p.label}
                  {isPassed && !isCurrent && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Left = Interactive Agent Network Graph, Right = Terminal Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Agent Network Graph (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between min-h-[440px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-aurora-teal" />
              Collaborative Agent Topology (Active Data Flow)
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {isRunning ? 'Orchestrating live' : isCompleted ? 'All agents idle' : 'Ready'}
            </span>
          </div>

          {/* SVG Animated Topology Visualizer */}
          <div className="relative w-full h-[360px] bg-space-950/70 rounded-xl border border-slate-800/80 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Animated Edges connecting to Supervisor and between agents */}
              <line x1="50%" y1="15%" x2="20%" y2="38%" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
              <line x1="50%" y1="15%" x2="80%" y2="38%" stroke="rgba(20, 184, 166, 0.4)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
              <line x1="20%" y1="38%" x2="20%" y2="65%" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="2" />
              <line x1="20%" y1="65%" x2="80%" y2="65%" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="2" strokeDasharray="6 6" />
              <line x1="80%" y1="65%" x2="35%" y2="90%" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2" />
              <line x1="35%" y1="90%" x2="65%" y2="90%" stroke="rgba(20, 184, 166, 0.4)" strokeWidth="2" />
              <line x1="65%" y1="90%" x2="50%" y2="52%" stroke="rgba(244, 63, 94, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="50%" y1="52%" x2="50%" y2="15%" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="2" />
            </svg>

            {/* Agent Nodes */}
            {AGENT_NODES.map((node) => {
              const status = getNodeStatus(node.id);
              const Icon = node.icon;
              const isWorking = status === 'working' || status === 'thinking';
              const isRetrying = status === 'retrying';

              return (
                <div
                  key={node.id}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                >
                  <div
                    className={`relative p-2.5 rounded-2xl border transition-all duration-300 ${
                      isWorking
                        ? 'bg-aurora-violet/30 border-aurora-violet shadow-lg shadow-purple-500/40 scale-110'
                        : isRetrying
                        ? 'bg-amber-500/30 border-amber-400 shadow-lg shadow-amber-500/40 animate-bounce'
                        : status === 'success'
                        ? 'bg-space-900 border-emerald-500/70 text-emerald-400'
                        : 'bg-space-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                    {isWorking && (
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aurora-teal opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-aurora-teal" />
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-slate-200 mt-1 whitespace-nowrap bg-space-950/80 px-2 py-0.5 rounded-md border border-slate-800">
                    {node.name}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {status.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Streaming Activity Terminal (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between min-h-[440px]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-aurora-violet" />
              Live Activity Stream (SSE)
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              {events.length} Events Logged
            </span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[340px] space-y-2 pr-1 font-mono-code text-xs">
            {events.length === 0 ? (
              <div className="text-slate-500 text-center py-16">
                Waiting for agent activation...
              </div>
            ) : (
              events.map((evt, i) => {
                const isFailHealed = Boolean(evt.healing_badge);
                return (
                  <div
                    key={evt.event_id || i}
                    onClick={() => setSelectedEvent(evt)}
                    className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                      isFailHealed
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                        : evt.status === 'retrying'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        : evt.status === 'working'
                        ? 'bg-space-900 border-slate-700/80 text-slate-200'
                        : 'bg-space-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-aurora-teal font-bold">{evt.agent_name}</span>
                      <span className="text-slate-500">{evt.timestamp}</span>
                    </div>
                    <div className="leading-snug">{evt.message}</div>
                    {evt.healing_badge && (
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        {evt.healing_badge}
                      </div>
                    )}
                  </div>
                );
              })
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};
