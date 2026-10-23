import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Bot, ShieldCheck, CheckCircle2, 
  MapPin, GitBranch, FileText, Upload, Plus, 
  Terminal, Activity, Compass, Cpu, FileEdit, ShieldAlert
} from 'lucide-react';
import type { DemoProfile } from '../types/swarm';

interface ArtisanalWorkbenchProps {
  demoProfiles: DemoProfile[];
  selectedProfile: DemoProfile | null;
  onSelectProfile: (profile: DemoProfile) => void;
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
  onViewResults?: () => void;
  hasResults?: boolean;
}

const COUNTRIES = [
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Sweden', flag: '🇸🇪' },
  { name: 'Netherlands', flag: '🇳🇱' },
];

export const ArtisanalWorkbench: React.FC<ArtisanalWorkbenchProps> = ({
  demoProfiles,
  selectedProfile,
  onSelectProfile,
  onSubmit,
  isLoading,
  onViewResults,
  hasResults = false,
}) => {
  const currentProfile = selectedProfile || demoProfiles[0] || {
    id: 'rahul',
    name: 'Rahul Sharma',
    education_level: 'B.Tech Computer Science & Engineering',
    current_institution: 'NIT Jalandhar',
    graduation_year: 2026,
    cgpa: '8.2 / 10.0',
    cgpa_10_scale: 8.2,
    skills: ['Python', 'PyTorch', 'Distributed Systems'],
    target_countries: ['Canada', 'Germany', 'Singapore'],
    target_degree: "Master's",
    target_field: 'Computer Science & AI',
    budget: 'Need full scholarship or significant research stipend',
    github_username: 'rahul-cse',
    bio: 'Built real-time deep learning diagnostic models with 94.2% accuracy. Open-source contributor to PyTorch ecosystem.',
    test_scores: { TOEFL: '108', GRE: '324' },
  };

  const [name, setName] = useState(currentProfile.name);
  const [educationLevel, setEducationLevel] = useState(currentProfile.education_level);
  const [currentInstitution, setCurrentInstitution] = useState(currentProfile.current_institution || 'NIT Jalandhar');
  const [cgpa, setCgpa] = useState(currentProfile.cgpa);
  const [targetDegree, setTargetDegree] = useState(currentProfile.target_degree);
  const [targetField, setTargetField] = useState(currentProfile.target_field);
  const [budget, setBudget] = useState(currentProfile.budget);
  const [githubUsername, setGithubUsername] = useState(currentProfile.github_username);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(currentProfile.target_countries);
  const [bio, setBio] = useState(currentProfile.bio || '');

  useEffect(() => {
    if (selectedProfile) {
      setName(selectedProfile.name);
      setEducationLevel(selectedProfile.education_level);
      setCurrentInstitution(selectedProfile.current_institution || '');
      setCgpa(selectedProfile.cgpa);
      setTargetDegree(selectedProfile.target_degree);
      setTargetField(selectedProfile.target_field);
      setBudget(selectedProfile.budget);
      setGithubUsername(selectedProfile.github_username);
      setSelectedCountries(selectedProfile.target_countries);
      setBio(selectedProfile.bio || '');
    }
  }, [selectedProfile]);

  const toggleCountry = (country: string) => {
    if (selectedCountries.includes(country)) {
      if (selectedCountries.length > 1) {
        setSelectedCountries(selectedCountries.filter((c) => c !== country));
      }
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', name);
    data.append('education_level', educationLevel);
    data.append('current_institution', currentInstitution);
    data.append('cgpa_raw', cgpa);
    data.append('target_degree', targetDegree);
    data.append('target_field', targetField);
    data.append('budget_preference', budget);
    data.append('github_username', githubUsername);
    data.append('target_countries', selectedCountries.join(', '));
    data.append('raw_profile_text', bio);
    onSubmit(data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Candidate Switcher Strip - High density, professional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <h1 className="text-xl font-semibold tracking-tight text-white">
              ScholarSwarm Research Bureau
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Autonomous multi-agent scholarship engine • Official accredited university crawler
          </p>
        </div>

        {/* Candidate Switcher Segmented Control */}
        <div className="flex items-center gap-1.5 p-1 bg-[#121520] border border-slate-800 rounded-xl overflow-x-auto">
          <span className="text-[11px] font-medium text-slate-500 px-2 hidden lg:inline">
            Candidate:
          </span>
          {demoProfiles.map((p) => {
            const isSelected = p.id === currentProfile.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProfile(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {p.name} ({p.cgpa})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Workbench */}
      <form onSubmit={handleExecute} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dossier Specification (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#121520] border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Candidate Dossier Specification
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                Status: Verified Ingestion
              </span>
            </div>

            {/* Field Rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#181C2B] border border-slate-700/80 text-white text-xs font-medium focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Normalized CGPA / GPA
                </label>
                <input
                  type="text"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#181C2B] border border-slate-700/80 text-white text-xs font-mono font-medium focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Current Degree & Institution
                </label>
                <input
                  type="text"
                  value={`${educationLevel} • ${currentInstitution}`}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#181C2B] border border-slate-700/80 text-white text-xs font-medium focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Target Degree & Field
                </label>
                <input
                  type="text"
                  value={`${targetDegree} in ${targetField}`}
                  onChange={(e) => setTargetField(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#181C2B] border border-slate-700/80 text-white text-xs font-medium focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Target Destinations */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-2">
                Target Countries for Crawler Matrix:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COUNTRIES.map((c) => {
                  const isSelected = selectedCountries.includes(c.name);
                  return (
                    <button
                      type="button"
                      key={c.name}
                      onClick={() => toggleCountry(c.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
                        isSelected
                          ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300 font-semibold'
                          : 'bg-[#181C2B] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{c.flag}</span>
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GitHub & Verified Proof Evidence */}
            <div className="pt-2 border-t border-slate-800">
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5 flex items-center justify-between">
                <span>Public Code Repository & Evidence Proof</span>
                <span className="text-indigo-400 font-mono text-[10px]">Verified: github.com/{githubUsername}</span>
              </label>
              <div className="p-3 rounded-xl bg-[#181C2B] border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-slate-400" />
                  <span className="font-mono text-white">github.com/{githubUsername}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">
                  3 AI Repositories Extracted
                </span>
              </div>
            </div>

            {/* Candidate Narrative Bio */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Candidate Bio & Research Abstract
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[#181C2B] border border-slate-700/80 text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Agent Engine Telemetry & Run Action (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#121520] border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Autonomous 8-Agent Pipeline
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                v2.0 Orchestrator
              </span>
            </div>

            {/* Agent Steps Queue */}
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-[#181C2B] border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <div>
                    <div className="text-white font-medium">Supervisor Orchestrator</div>
                    <div className="text-[10px] text-slate-500">Self-healing replan loop</div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Ready</span>
              </div>

              <div className="p-3 rounded-xl bg-[#181C2B] border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-teal-400" />
                  <div>
                    <div className="text-white font-medium">Research Scout</div>
                    <div className="text-[10px] text-slate-500">Canada, Germany, Singapore portals</div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">10+ Targets</span>
              </div>

              <div className="p-3 rounded-xl bg-[#181C2B] border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="text-white font-medium">Verification Agent</div>
                    <div className="text-[10px] text-slate-500">Zero-hallucination .edu crawler</div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">HTTP 200</span>
              </div>

              <div className="p-3 rounded-xl bg-[#181C2B] border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <FileEdit className="w-4 h-4 text-rose-400" />
                  <div>
                    <div className="text-white font-medium">Application Writer</div>
                    <div className="text-[10px] text-slate-500">Fact-checked SOP synthesis</div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Evidence-tethered</span>
              </div>
            </div>

            {/* Prominent Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Executing Swarm Pipeline...</span>
                  </>
                ) : (
                  <>
                    <span>Run Swarm Research Pipeline</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {hasResults && onViewResults && (
              <button
                type="button"
                onClick={onViewResults}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-[#181C2B] hover:bg-slate-800 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Previous Results</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="text-[11px] text-slate-500 text-center">
              Strict mathematical verification • Non-submitting research assistant
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
