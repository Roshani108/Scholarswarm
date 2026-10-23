import React from 'react';
import { Sparkles, Bot, ShieldCheck, ArrowRight, Zap, GraduationCap, Globe, BookOpen } from 'lucide-react';
import { DemoProfile } from '../types/swarm';

interface HeroLandingProps {
  onStart: () => void;
  onLoadDemo: (profile: DemoProfile) => void;
  demoProfiles: DemoProfile[];
  onOpenSurprise: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onStart,
  onLoadDemo,
  demoProfiles,
  onOpenSurprise
}) => {
  const rahulProfile = demoProfiles.find((p) => p.id === 'rahul') || demoProfiles[0];

  return (
    <div className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      {/* Top Banner Tag */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aurora-violet/15 border border-aurora-violet/30 text-aurora-violet text-xs font-semibold uppercase tracking-wider mb-8 animate-pulse-glow">
        <Sparkles className="w-3.5 h-3.5" />
        Autonomous Multi-Agent Scholarship Research Engine
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-heading mb-6 leading-tight">
        Your scholarship research team. <br className="hidden sm:inline" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-aurora-violet via-aurora-teal to-aurora-cyan">
          7 AI agents. One click.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300 font-normal mb-10 leading-relaxed">
        Upload your resume, transcript, and GitHub. Watch 7 autonomous agents collaboratively
        crawl official university portals across <span className="text-teal-400 font-medium">Canada, Germany, Singapore & beyond</span>,
        verify requirements with zero fabrication, score your eligibility, and draft a fact-checked SOP.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
        <button
          onClick={onStart}
          className="relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-aurora-violet to-purple-600 hover:from-purple-600 hover:to-aurora-violet shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-white/20"
        >
          <Zap className="w-5 h-5 fill-current" />
          Launch the Swarm
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

        {rahulProfile && (
          <button
            onClick={() => onLoadDemo(rahulProfile)}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium text-slate-200 bg-space-800/80 hover:bg-space-700/80 border border-slate-700 hover:border-slate-500 transition-all duration-200"
          >
            <Bot className="w-5 h-5 text-aurora-teal" />
            Try Demo Profile (Rahul - CSE 8.2 CGPA)
          </button>
        )}

        <button
          onClick={onOpenSurprise}
          className="inline-flex items-center gap-2 px-5 py-4 rounded-xl text-sm font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all duration-200"
          title="Surprise Demo: Works for any student, any field!"
        >
          <Globe className="w-4 h-4" />
          Live Surprise Profile Picker
        </button>
      </div>

      {/* Generality Showcase Quick Switches */}
      <div className="max-w-4xl mx-auto p-4 rounded-2xl glass-panel mb-16">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-aurora-cyan" />
          Pre-Loaded Profiles to Test Generality (Zero Code Changes)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {demoProfiles.map((p) => (
            <button
              key={p.id}
              onClick={() => onLoadDemo(p)}
              className="p-3 rounded-xl bg-space-850/80 hover:bg-space-800 border border-slate-700/60 hover:border-aurora-teal/50 text-left transition-all group"
            >
              <div className="text-sm font-bold text-slate-200 group-hover:text-aurora-teal transition-colors">
                {p.name}
              </div>
              <div className="text-xs text-slate-400 truncate">
                {p.education_level}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span className="text-amber-400 font-mono font-medium">GPA {p.cgpa}</span>
                <span className="text-slate-400">{p.target_countries.join(', ')}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3 Core Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
        <div className="p-6 rounded-2xl glass-card border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-aurora-teal/20 text-aurora-teal flex items-center justify-center mb-4">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">100% Real Live Opportunities</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Crawls verified portals across Canada (.gc.ca), Germany (DAAD), and Singapore (A*STAR/NUS/NTU). Never invents a program or award amount.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-aurora-violet/20 text-aurora-violet flex items-center justify-center mb-4">
            <Bot className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">7 Collaborating Agents</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            A Supervisor guides Profile Analysts, GitHub Enrichers, Scout Harvesters, Verification Engines, Rankers, SOP Writers, and Adversarial Critics.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Adversarial Trust Audit</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Every statement in the generated SOP is linked directly to student evidence with transparent fact-checking and automated link liveness checks.
          </p>
        </div>
      </div>
    </div>
  );
};
