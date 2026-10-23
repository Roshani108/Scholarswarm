import React from 'react';
import { 
  Sparkles, ArrowRight, Bot, ShieldCheck, Zap, 
  Globe2, CheckCircle2, RefreshCw, Cpu, FileText, ExternalLink, Layers
} from 'lucide-react';
import type { DemoProfile } from '../types/swarm';

interface ModernHeroProps {
  onStart: () => void;
  onLoadDemo: (profile: DemoProfile) => void;
  demoProfiles: DemoProfile[];
  onOpenSurprise: () => void;
}

export const ModernHero: React.FC<ModernHeroProps> = ({
  onStart,
  onLoadDemo,
  demoProfiles,
  onOpenSurprise,
}) => {
  const rahulProfile = demoProfiles.find((p) => p.id === 'rahul') || demoProfiles[0];

  const agentNodes = [
    { name: 'Supervisor', role: 'Orchestrator', color: 'from-indigo-500 to-indigo-600' },
    { name: 'Profile Analyst', role: 'CV & GPA Parsing', color: 'from-blue-500 to-cyan-500' },
    { name: 'GitHub Enricher', role: 'Code & Project Proof', color: 'from-purple-500 to-pink-500' },
    { name: 'Research Scout', role: 'Portal Crawler', color: 'from-teal-500 to-emerald-500' },
    { name: 'Verification Agent', role: 'Eligibility Guard', color: 'from-emerald-500 to-green-600' },
    { name: 'Strategist', role: 'Rank & Roadmap', color: 'from-amber-500 to-orange-500' },
    { name: 'Application Writer', role: 'Fact-Checked SOP', color: 'from-rose-500 to-red-600' },
    { name: 'Auditor', role: 'Trust & URL Audit', color: 'from-indigo-600 to-indigo-700' },
  ];

  return (
    <div className="relative overflow-hidden pt-8 pb-20 sm:pt-12 sm:pb-28">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-teal-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top Feature Tag - High Contrast */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-900/90 border border-slate-700 text-indigo-300 shadow-md backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Autonomous Multi-Agent AI System</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-teal-400 font-medium">100% Real Live Links</span>
          </div>
        </div>

        {/* Main Headline - Crystal Clear Contrast */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
            Your Global Scholarship <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-teal-300">
              Research Bureau.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            7 collaborative AI agents parse your background, crawl accredited university portals across <span className="font-semibold text-white">Canada, Germany, & Singapore</span>, verify eligibility requirements with mathematical proof, and draft a fact-checked SOP.
          </p>
        </div>

        {/* Action Buttons - Solid High Contrast Backgrounds */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-14">
          <button
            onClick={onStart}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 active:scale-98 transition-all"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Launch Research Swarm</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {rahulProfile && (
            <button
              onClick={() => onLoadDemo(rahulProfile)}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-semibold text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 shadow-sm active:scale-98 transition-all"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Load Rahul (CSE 8.2 CGPA)</span>
            </button>
          )}

          <button
            onClick={onOpenSurprise}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-semibold text-amber-300 bg-slate-800 hover:bg-slate-700 border border-amber-500/40 shadow-sm transition-all"
          >
            <Globe2 className="w-4 h-4 text-amber-400" />
            <span>Surprise Profile Switcher</span>
          </button>
        </div>

        {/* Interactive Swarm Architecture Card */}
        <div className="max-w-5xl mx-auto bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl mb-16 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Autonomous Collaborative Architecture
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              8 Nodes • Automated Verification • SSE Live Feed
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {agentNodes.map((node, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-slate-850 bg-[#161F30] border border-slate-800 hover:border-indigo-500/60 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    AGENT 0{idx + 1}
                  </span>
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-tr ${node.color}`} />
                </div>
                <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {node.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {node.role}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Generality Profile Chips */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400 font-medium">
              Ready-to-test candidate files:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {demoProfiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onLoadDemo(p)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-indigo-400 border border-slate-700 text-xs font-medium transition-colors"
                >
                  {p.name} ({p.target_field.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Pillars Trust Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-sm">
            <div className="text-3xl font-extrabold text-indigo-400 font-mono">
              8
            </div>
            <div className="text-xs font-semibold text-white mt-1">
              Autonomous Agents
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Specialized pipeline
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-sm">
            <div className="text-3xl font-extrabold text-teal-400 font-mono">
              100%
            </div>
            <div className="text-xs font-semibold text-white mt-1">
              Live Verified URLs
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Official .edu / .gov
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-sm">
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">
              0%
            </div>
            <div className="text-xs font-semibold text-white mt-1">
              Hallucination Risk
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Fact-checked claims
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-sm">
            <div className="text-3xl font-extrabold text-amber-400 font-mono">
              Auto
            </div>
            <div className="text-xs font-semibold text-white mt-1">
              Self-Healing
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Fault-tolerant loops
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
