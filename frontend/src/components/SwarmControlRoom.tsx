import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Bot, ShieldCheck, Terminal, Cpu, CheckCircle2, 
  RefreshCw, Activity, Zap, Compass, 
  FileEdit, ShieldAlert, ArrowRight, Layers, Clock
} from 'lucide-react';
import type { AgentEvent, SwarmStats, NodeStatus, AgentId } from '../types/swarm';

interface SwarmControlRoomProps {
  events: AgentEvent[];
  stats: SwarmStats;
  isRunning: boolean;
  isCompleted: boolean;
  onViewResults: () => void;
}

const AGENTS: { id: AgentId; name: string; role: string; icon: any; color: string }[] = [
  { id: 'supervisor', name: 'Supervisor Orchestrator', role: 'Health & Re-Plan Loop', icon: Cpu, color: 'text-indigo-400' },
  { id: 'profile_analyst', name: 'Profile Analyst', role: 'CV, GPA & Transcript Normalizer', icon: Bot, color: 'text-blue-400' },
  { id: 'profile_enricher', name: 'GitHub Enricher', role: 'Repositories & Code Evidence', icon: Activity, color: 'text-purple-400' },
  { id: 'research_scout', name: 'Research Scout', role: 'University Portal Crawler', icon: Compass, color: 'text-teal-400' },
  { id: 'verification_agent', name: 'Verification Guard', role: 'Official .edu/.gov Verification', icon: ShieldCheck, color: 'text-emerald-400' },
  { id: 'strategist_ranker', name: 'Strategist & Ranker', role: 'Top 5 Match & Roadmap', icon: Zap, color: 'text-amber-400' },
  { id: 'application_writer', name: 'Application Writer', role: 'Fact-Checked SOP Generator', icon: FileEdit, color: 'text-rose-400' },
  { id: 'critic_auditor', name: 'Critic & Auditor', role: 'Adversarial Trust Audit', icon: ShieldAlert, color: 'text-indigo-400' },
];

export const SwarmControlRoom: React.FC<SwarmControlRoomProps> = ({
  events,
  stats,
  isRunning,
  isCompleted,
  onViewResults,
}) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<AgentEvent | null>(null);

  // Auto-scroll event stream
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  // Confetti burst on completion
  useEffect(() => {
    if (isCompleted) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366F1', '#14B8A6', '#10B981', '#3B82F6'],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [isCompleted]);

  const getNodeStatus = (agentId: string): NodeStatus => {
    for (let i = events.length - 1; i >= 0; i--) {
      if (events[i].agent_id === agentId) {
        return events[i].status;
      }
    }
    return isRunning ? 'idle' : isCompleted ? 'success' : 'idle';
  };

  const getStatusBadge = (status: NodeStatus) => {
    switch (status) {
      case 'working':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950/80 text-blue-300 border border-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            Working
          </span>
        );
      case 'thinking':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-950/80 text-purple-300 border border-purple-800">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Thinking
          </span>
        );
      case 'retrying':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-800 animate-pulse">
            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
            Self-Healing
          </span>
        );
      case 'success':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
            Ready
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400">
            Standby
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner & KPI Metrics Strip */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="relative flex h-3.5 w-3.5">
                {isRunning ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-indigo-500" />
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
                )}
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Multi-Agent Swarm Operations
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              REAL-TIME SSE TELEMETRY STREAM • 8 COLLABORATIVE REASONING NODES
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isCompleted && (
              <button
                onClick={onViewResults}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
              >
                <span>View Matched Scholarships</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 4 Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-[#161F30] border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              CANDIDATES DISCOVERED
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono mt-1 block">
              {stats.candidates_found}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#161F30] border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              VERIFIED OFFICIAL LINKS
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-400 font-mono mt-1 block">
              {stats.opportunities_verified}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#161F30] border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              INELIGIBLE SCREENED
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-400 font-mono mt-1 block">
              {stats.opportunities_rejected}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#161F30] border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              AUTO-HEALED RE-PLANS
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono mt-1 block">
              {stats.failures_healed}
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace: Agent Matrix (Left) + Live Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 8 Agent Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Active Swarm Nodes
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {isRunning ? 'Synthesizing...' : isCompleted ? 'Execution Complete' : 'Ready'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AGENTS.map((agent) => {
              const status = getNodeStatus(agent.id);
              const Icon = agent.icon;
              return (
                <div
                  key={agent.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    status === 'working' || status === 'retrying'
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/20'
                      : 'bg-[#161F30] border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl bg-slate-800 ${agent.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          {agent.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {agent.role}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(status)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Event Terminal Feed (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col h-[480px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Live Swarm Log
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {events.length} events logged
            </span>
          </div>

          {/* Terminal log messages container */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
            {events.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Awaiting swarm trigger...
              </div>
            ) : (
              events.map((evt, idx) => (
                <div
                  key={evt.event_id || idx}
                  onClick={() => setSelectedEvent(evt)}
                  className="p-2.5 rounded-xl bg-[#161F30] border border-slate-800 hover:border-indigo-500/60 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-indigo-400 uppercase">
                      {evt.agent_name || evt.agent_id}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {evt.timestamp ? evt.timestamp.split('T')[1]?.substring(0, 8) : 'Live'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 leading-snug">
                    {evt.message}
                  </div>
                  {evt.healing_badge && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      ⚡ {evt.healing_badge}
                    </span>
                  )}
                </div>
              ))
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};
