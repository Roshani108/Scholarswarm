import React, { useEffect, useRef, useState } from 'react';
import { Stamp } from '../design-system/Stamp';
import { RollingCounter } from '../design-system/RollingCounter';
import type { AgentEvent, SwarmStats, NodeStatus } from '../types/swarm';

interface ControlRoomProps {
  events: AgentEvent[];
  stats: SwarmStats;
  isRunning: boolean;
  isCompleted: boolean;
  onViewResults: () => void;
  chaosEnabled: boolean;
  onToggleChaos: (val: boolean) => void;
}

interface Station {
  id: string;
  code: string;
  stationNum: string;
  name: string;
  role: string;
  x: number;
  y: number;
}

const STATIONS: Station[] = [
  { id: 'supervisor', code: 'SP', stationNum: '00', name: 'SUPERVISOR', role: 'HEALTH & RE-PLAN LOOP', x: 50, y: 16 },
  { id: 'profile_analyst', code: 'PA', stationNum: '01', name: 'PROFILE ANALYST', role: 'CREDENTIAL PARSER', x: 18, y: 38 },
  { id: 'profile_enricher', code: 'PE', stationNum: '02', name: 'PROFILE ENRICHMENT', role: 'GITHUB EVIDENCE', x: 82, y: 38 },
  { id: 'research_scout', code: 'RS', stationNum: '03', name: 'RESEARCH SCOUT', role: 'MATRIX HARVESTER', x: 18, y: 68 },
  { id: 'verification_agent', code: 'VE', stationNum: '04', name: 'VERIFICATION', role: 'OFFICIAL PAGE CRAWLER', x: 82, y: 68 },
  { id: 'strategist_ranker', code: 'SR', stationNum: '05', name: 'STRATEGIST', role: 'RANKING & ROADMAP', x: 32, y: 88 },
  { id: 'application_writer', code: 'AW', stationNum: '06', name: 'APPLICATION WRITER', role: 'FACT-CHECKED SOP', x: 68, y: 88 },
  { id: 'critic_auditor', code: 'CA', stationNum: '07', name: 'CRITIC AUDITOR', role: 'ADVERSARIAL AUDIT', x: 50, y: 52 },
];

const PHASES = ['UNDERSTAND', 'ENRICH', 'RESEARCH', 'VERIFY', 'RANK', 'DRAFT', 'AUDIT'];

export const ControlRoom: React.FC<ControlRoomProps> = ({
  events,
  stats,
  isRunning,
  isCompleted,
  onViewResults,
  chaosEnabled,
  onToggleChaos,
}) => {
  const ledgerEndRef = useRef<HTMLDivElement>(null);
  const [pulseActive, setPulseActive] = useState(false);

  useEffect(() => {
    ledgerEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (events.length > 0) {
      setPulseActive(true);
      const timer = setTimeout(() => setPulseActive(false), 800);
      return () => clearTimeout(timer);
    }
  }, [events]);

  const getNodeStatus = (agentId: string): NodeStatus => {
    for (let i = events.length - 1; i >= 0; i--) {
      if (events[i].agent_id === agentId) {
        return events[i].status;
      }
    }
    return isRunning ? 'idle' : isCompleted ? 'success' : 'idle';
  };

  const latestEvent = events[events.length - 1];
  const activePhase = latestEvent?.phase?.toUpperCase() || 'UNDERSTAND';

  return (
    <section className="w-full bg-[#070A11] text-[#F8FAFC] border-y border-[#1E293B] py-10 px-4 sm:px-8 select-none">
      <div className="max-w-[1440px] mx-auto space-y-8">
        {/* Top Control Room Telemetry Header */}
        <div className="border border-[#1E293B] p-6 bg-[#0B101D] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono-ledger text-xs uppercase text-[#3B82F6] tracking-widest font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-none bg-[#3B82F6] animate-ping" />
                CENTRAL OPERATIONS ROOM / SWARM PROTOCOL ACTIVE
              </span>
              <Stamp text="LEVEL-01 ACCESS" variant="muted" size="sm" rotation={0} />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-[#F8FAFC] mt-1 font-normal">
              Autonomous Swarm Topology
            </h2>
            <p className="font-mono-ledger text-xs text-[#94A3B8] mt-1">
              Synchronous state machine routing tasks across 7 stations with autonomous replanning.
            </p>
          </div>

          {/* Rolling Mechanical Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto font-mono-ledger">
            <div className="p-3 border border-[#1E293B] bg-[#070A11]">
              <span className="text-[10px] uppercase text-[#94A3B8] block">DISCOVERED</span>
              <RollingCounter value={stats.candidates_found || 0} className="text-2xl text-[#F8FAFC] font-bold" />
            </div>

            <div className="p-3 border border-[#1E293B] bg-[#070A11]">
              <span className="text-[10px] uppercase text-[#10B981] block">VERIFIED CRITERIA</span>
              <RollingCounter value={stats.opportunities_verified || 0} className="text-2xl text-[#10B981] font-bold" />
            </div>

            <div className="p-3 border border-[#1E293B] bg-[#070A11]">
              <span className="text-[10px] uppercase text-[#94A3B8] block">REJECTED</span>
              <RollingCounter value={stats.opportunities_rejected || 0} className="text-2xl text-[#94A3B8] font-bold" />
            </div>

            <div className="p-3 border border-[#2563EB]/40 bg-[#2563EB]/10">
              <span className="text-[10px] uppercase text-[#3B82F6] font-bold block">SELF-HEALED</span>
              <RollingCounter value={stats.failures_healed || 0} className="text-2xl text-[#3B82F6] font-bold" />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleChaos(!chaosEnabled)}
              data-cursor="CHAOS"
              className={`px-3 py-2 border font-mono-ledger text-xs uppercase font-bold tracking-widest transition-all ${
                chaosEnabled
                  ? 'border-[#3B82F6] bg-[#2563EB] text-white shadow-lg'
                  : 'border-[#1E293B] text-[#94A3B8] hover:border-[#F8FAFC] hover:text-[#F8FAFC]'
              }`}
            >
              CHAOS: {chaosEnabled ? '[ INJECTING FAULTS ]' : '[ PASSIVE ]'}
            </button>

            {isCompleted && (
              <button
                onClick={onViewResults}
                data-cursor="DOSSIER"
                className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-mono-ledger text-xs font-bold uppercase tracking-widest transition-colors shadow-sm"
              >
                OPEN COMPILED DOSSIER →
              </button>
            )}
          </div>
        </div>

        {/* Phase Timeline Rail */}
        <div className="border border-[#1E293B] p-3 bg-[#0B101D] overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] font-mono-ledger text-xs">
            {PHASES.map((ph, idx) => {
              const isPassed = PHASES.findIndex((p) => p === activePhase) >= idx || isCompleted;
              const isCurrent = activePhase === ph && isRunning;
              return (
                <div key={ph} className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 border transition-colors ${
                    isCurrent
                      ? 'border-[#3B82F6] bg-[#2563EB]/20 text-[#3B82F6] font-bold'
                      : isPassed
                      ? 'border-[#10B981] text-[#10B981]'
                      : 'border-[#1E293B] text-[#475569]'
                  }`}>
                    0{idx + 1} / {ph}
                  </span>
                  {idx < PHASES.length - 1 && <span className="text-[#1E293B]">———</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Control Room Grid: Left = Topology Station Map, Right = Ledger Logbook */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Station Map Canvas */}
          <div className="lg:col-span-7 border border-[#1E293B] p-6 bg-[#070A11] min-h-[500px] relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between font-mono-ledger text-xs pb-3 border-b border-[#1E293B] text-[#94A3B8]">
              <span>[ TOPOLOGY GRID: HAIRLINE PULSE PATHS ]</span>
              <span className="text-[#3B82F6] font-bold">
                {isRunning ? 'TRANSMITTING INTER-AGENT PROOFS' : isCompleted ? 'MISSION CONCLUDED' : 'STANDBY'}
              </span>
            </div>

            {/* SVG Hairline Circuit Map */}
            <div className="relative w-full h-[400px] bg-[#04060A] border border-[#111827] overflow-hidden">
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="50%" y1="16%" x2="18%" y2="38%" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="50%" y1="16%" x2="82%" y2="38%" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="18%" y1="38%" x2="18%" y2="68%" stroke="#1E293B" strokeWidth="1" />
                <line x1="18%" y1="68%" x2="82%" y2="68%" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="82%" y1="68%" x2="32%" y2="88%" stroke="#1E293B" strokeWidth="1" />
                <line x1="32%" y1="88%" x2="68%" y2="88%" stroke="#1E293B" strokeWidth="1" />
                <line x1="68%" y1="88%" x2="50%" y2="52%" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="50%" y1="52%" x2="50%" y2="16%" stroke="#1E293B" strokeWidth="1" />

                {pulseActive && (
                  <>
                    <circle cx="34%" cy="27%" r="2.5" fill="#3B82F6" className="animate-ping" />
                    <circle cx="50%" cy="68%" r="2.5" fill="#10B981" className="animate-ping" />
                  </>
                )}
              </svg>

              {/* The 8 Monogram Stations */}
              {STATIONS.map((station) => {
                const status = getNodeStatus(station.id);
                const isWorking = status === 'working' || status === 'thinking';
                const isRetrying = status === 'retrying';

                return (
                  <div
                    key={station.id}
                    style={{ left: `${station.x}%`, top: `${station.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                  >
                    <div
                      className={`relative w-12 h-12 border flex flex-col items-center justify-center transition-all duration-300 ${
                        isWorking
                          ? 'border-[#3B82F6] bg-[#2563EB]/25 scale-110 shadow-lg shadow-[#3B82F6]/30'
                          : isRetrying
                          ? 'border-[#F59E0B] bg-[#F59E0B]/20 animate-bounce'
                          : status === 'success'
                          ? 'border-[#10B981] bg-[#10B981]/20 text-[#10B981]'
                          : 'border-[#1E293B] bg-[#0B101D] text-[#94A3B8]'
                      }`}
                    >
                      <span className="font-mono-ledger text-xs font-bold tracking-widest text-[#F8FAFC]">
                        {station.code}
                      </span>
                      <span className="font-mono-ledger text-[8px] text-[#94A3B8]">
                        {station.stationNum}
                      </span>

                      {isWorking && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#3B82F6] animate-ping" />
                      )}
                    </div>

                    <span className="font-mono-ledger text-[10px] uppercase font-bold text-[#F8FAFC] mt-1 whitespace-nowrap bg-[#070A11] px-1.5 py-0.5 border border-[#1E293B]">
                      {station.name}
                    </span>
                    <span className="font-mono-ledger text-[8px] text-[#94A3B8] uppercase">
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between font-mono-ledger text-[10px] text-[#94A3B8] pt-3 border-t border-[#1E293B]">
              <span>CONFIDENTIAL PROTOCOL / SCHOLARSWARM BUR-2026</span>
              <span>100% GROUNDED SOURCES</span>
            </div>
          </div>

          {/* Right Column (5 cols): Monospace Ledger Logbook Feed */}
          <div className="lg:col-span-5 border border-[#1E293B] p-6 bg-[#070A11] min-h-[500px] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] font-mono-ledger text-xs text-[#94A3B8]">
              <span>[ BUREAU LEDGER LOGBOOK: SSE ]</span>
              <span className="text-[#F8FAFC]">{events.length} ENTRIES</span>
            </div>

            {/* Scrollable Ledger Line-by-Line Log */}
            <div className="flex-1 overflow-y-auto max-h-[380px] space-y-2.5 my-3 pr-2 font-mono-ledger text-xs">
              {events.length === 0 ? (
                <div className="text-[#475569] text-center py-20 font-mono-ledger">
                  Awaiting dispatch signal from supervisor...
                </div>
              ) : (
                events.map((evt, i) => {
                  const isHealed = Boolean(evt.healing_badge);
                  return (
                    <div
                      key={evt.event_id || i}
                      className={`p-2.5 border text-left transition-colors ${
                        isHealed
                          ? 'border-[#3B82F6] bg-[#2563EB]/15 text-[#F8FAFC]'
                          : evt.status === 'retrying'
                          ? 'border-[#F59E0B]/60 bg-[#F59E0B]/10 text-[#F8FAFC]'
                          : evt.status === 'working'
                          ? 'border-[#1E293B] bg-[#0E131F] text-[#F8FAFC]'
                          : 'border-[#141C2B] bg-[#070A11] text-[#94A3B8]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="font-bold text-[#3B82F6]">
                          [{evt.agent_name.toUpperCase()}]
                        </span>
                        <span className="text-[#475569]">{evt.timestamp}</span>
                      </div>

                      <div className="leading-snug text-[11px] text-[#F8FAFC]">
                        {evt.message}
                      </div>

                      {evt.healing_badge && (
                        <div className="mt-2">
                          <Stamp text={evt.healing_badge.toUpperCase()} variant="cobalt" size="sm" rotation={0} />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={ledgerEndRef} />
            </div>

            <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between font-mono-ledger text-[10px] text-[#94A3B8]">
              <span>FEED: /api/swarm/stream</span>
              <span className="text-[#10B981] font-bold">STREAM LIVE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
