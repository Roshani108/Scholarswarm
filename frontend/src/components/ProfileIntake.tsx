import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, GitBranch, Globe, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';
import type { DemoProfile } from '../types/swarm';

interface ProfileIntakeProps {
  initialProfile?: DemoProfile | null;
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
  chaosEnabled: boolean;
  onToggleChaos: (val: boolean) => void;
}

const COUNTRIES = [
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Europe (Erasmus)', flag: '🇪🇺' },
];

export const ProfileIntake: React.FC<ProfileIntakeProps> = ({
  initialProfile,
  onSubmit,
  isLoading,
  chaosEnabled,
  onToggleChaos,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [name, setName] = useState(initialProfile?.name || 'Rahul Sharma');
  const [educationLevel, setEducationLevel] = useState(initialProfile?.education_level || 'B.Tech Computer Science & Engineering');
  const [cgpa, setCgpa] = useState(initialProfile?.cgpa || '8.2 / 10.0');
  const [targetDegree, setTargetDegree] = useState(initialProfile?.target_degree || "Master's");
  const [targetField, setTargetField] = useState(initialProfile?.target_field || 'Computer Science & Artificial Intelligence');
  const [budget, setBudget] = useState(initialProfile?.budget || 'Need full scholarship or significant research stipend');
  const [githubUsername, setGithubUsername] = useState(initialProfile?.github_username || 'rahul-cse');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    initialProfile?.target_countries || ['Canada', 'Germany', 'Singapore']
  );
  const [rawProfileText, setRawProfileText] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [marksheetFile, setMarksheetFile] = useState<File | null>(null);

  // Sync when initialProfile changes (e.g. user clicked demo button)
  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name);
      setEducationLevel(initialProfile.education_level);
      setCgpa(initialProfile.cgpa);
      setTargetDegree(initialProfile.target_degree);
      setTargetField(initialProfile.target_field);
      setBudget(initialProfile.budget);
      setGithubUsername(initialProfile.github_username);
      setSelectedCountries(initialProfile.target_countries);
    }
  }, [initialProfile]);

  // Dynamic Profile Strength Score Calculation (0 - 100)
  const calculateStrength = () => {
    let score = 0;
    if (name.trim()) score += 15;
    if (educationLevel.trim()) score += 15;
    if (cgpa.trim()) score += 15;
    if (selectedCountries.length > 0) score += 15;
    if (githubUsername.trim()) score += 15;
    if (resumeFile || rawProfileText.trim().length > 50) score += 15;
    if (marksheetFile) score += 10;
    return Math.min(100, score);
  };

  const strength = calculateStrength();

  const toggleCountry = (country: string) => {
    if (selectedCountries.includes(country)) {
      if (selectedCountries.length > 1) {
        setSelectedCountries(selectedCountries.filter((c) => c !== country));
      }
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', name);
    fd.append('education_level', educationLevel);
    fd.append('cgpa', cgpa);
    fd.append('target_countries', selectedCountries.join(','));
    fd.append('target_degree', targetDegree);
    fd.append('target_field', targetField);
    fd.append('budget', budget);
    fd.append('github_username', githubUsername);
    fd.append('chaos_mode', String(chaosEnabled));

    if (activeTab === 'text') {
      fd.append('raw_profile_text', rawProfileText);
    } else {
      if (resumeFile) fd.append('resume', resumeFile);
      if (marksheetFile) fd.append('marksheet', marksheetFile);
      if (rawProfileText) fd.append('raw_profile_text', rawProfileText);
    }

    onSubmit(fd);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl relative">
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-slate-700/60 gap-4">
          <div>
            <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-aurora-violet" />
              Candidate Profile Intake
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Provide student credentials or choose the instant raw text paste option.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-xl bg-space-950/80 border border-slate-700/70">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'upload'
                  ? 'bg-aurora-violet text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Document Upload
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'text'
                  ? 'bg-aurora-violet text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Paste Profile Text
            </button>
          </div>
        </div>

        {/* Profile Strength Progress Rail */}
        <div className="mb-8 p-4 rounded-xl bg-space-850/60 border border-slate-700/40">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              Profile Completeness Score
            </span>
            <span className="font-mono font-bold text-aurora-teal">{strength}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-space-950 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-aurora-violet via-aurora-cyan to-aurora-teal transition-all duration-500"
              style={{ width: `${strength}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Student Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-aurora-violet transition-colors text-sm"
                placeholder="e.g. Rahul Sharma"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                CGPA / Academic Score
              </label>
              <input
                type="text"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-aurora-violet transition-colors text-sm"
                placeholder="e.g. 8.2 / 10.0 or 3.6 / 4.0 or 82%"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Current Degree & Discipline
              </label>
              <input
                type="text"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-aurora-violet transition-colors text-sm"
                placeholder="e.g. B.Tech Computer Science"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Public GitHub Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <GitBranch className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-space-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-aurora-violet transition-colors text-sm font-mono"
                  placeholder="e.g. rahul-cse"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Target Degree Level
              </label>
              <select
                value={targetDegree}
                onChange={(e) => setTargetDegree(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-slate-700 text-white focus:outline-none focus:border-aurora-violet transition-colors text-sm"
              >
                <option value="Master's">Master's (M.S. / M.Sc. / Research Master)</option>
                <option value="Ph.D.">Doctoral / Ph.D.</option>
                <option value="Postgraduate Diploma">Postgraduate Diploma</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Target Field of Study
              </label>
              <input
                type="text"
                value={targetField}
                onChange={(e) => setTargetField(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-aurora-violet transition-colors text-sm"
                placeholder="e.g. Artificial Intelligence, Data Science, Bioinformatics"
              />
            </div>
          </div>

          {/* Target Countries Multi-Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Target Destinations (Multi-Select)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {COUNTRIES.map((c) => {
                const isSelected = selectedCountries.includes(c.name);
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => toggleCountry(c.name)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-aurora-teal/15 border-aurora-teal/60 text-white font-medium shadow-sm'
                        : 'bg-space-900/60 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    <span className="text-xl">{c.flag}</span>
                    <span className="text-sm">{c.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 ml-auto text-aurora-teal" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload Mode vs Raw Text Mode */}
          {activeTab === 'upload' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Resume Upload Zone */}
              <div className="p-5 rounded-xl border-2 border-dashed border-slate-700/80 hover:border-aurora-violet/60 bg-space-900/40 text-center transition-all">
                <FileText className="w-8 h-8 mx-auto text-aurora-violet mb-2" />
                <div className="text-sm font-semibold text-slate-200">
                  {resumeFile ? resumeFile.name : 'Upload Student Resume / CV'}
                </div>
                <p className="text-xs text-slate-400 mt-1 mb-3">
                  {resumeFile ? `${(resumeFile.size / 1024).toFixed(1)} KB` : 'PDF, DOCX, or plain text'}
                </p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-aurora-violet bg-aurora-violet/15 hover:bg-aurora-violet/25 cursor-pointer transition-colors border border-aurora-violet/30">
                  <Upload className="w-3.5 h-3.5" />
                  Select File
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => e.target.files?.[0] && setResumeFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Marksheet Upload Zone */}
              <div className="p-5 rounded-xl border-2 border-dashed border-slate-700/80 hover:border-aurora-teal/60 bg-space-900/40 text-center transition-all">
                <FileText className="w-8 h-8 mx-auto text-aurora-teal mb-2" />
                <div className="text-sm font-semibold text-slate-200">
                  {marksheetFile ? marksheetFile.name : 'Upload Academic Marksheet / Transcript'}
                </div>
                <p className="text-xs text-slate-400 mt-1 mb-3">
                  {marksheetFile ? `${(marksheetFile.size / 1024).toFixed(1)} KB` : 'Used for official GPA verification'}
                </p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-aurora-teal bg-aurora-teal/15 hover:bg-aurora-teal/25 cursor-pointer transition-colors border border-aurora-teal/30">
                  <Upload className="w-3.5 h-3.5" />
                  Select File
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => e.target.files?.[0] && setMarksheetFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Paste Raw Profile or Unstructured Bio (For Instant Live Testing)
              </label>
              <textarea
                rows={5}
                value={rawProfileText}
                onChange={(e) => setRawProfileText(e.target.value)}
                className="w-full p-4 rounded-xl bg-space-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-aurora-violet transition-colors text-sm font-mono-code"
                placeholder="Paste any student background here: degree, GPA, past projects, awards, test scores, target labs..."
              />
            </div>
          )}

          {/* Chaos Mode Toggle & Self-Healing Callout */}
          <div className="p-4 rounded-xl bg-space-850/80 border border-slate-700/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${chaosEnabled ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700 text-slate-400'}`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  Chaos Mode (Failure Injection Showpiece)
                  {chaosEnabled && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400">
                  Randomly drops search queries and simulates 500 timeouts to showcase agent self-healing.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onToggleChaos(!chaosEnabled)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                chaosEnabled
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-space-700 hover:bg-space-600 text-slate-300'
              }`}
            >
              {chaosEnabled ? 'Disable Chaos Mode' : 'Enable Chaos Mode'}
            </button>
          </div>

          {/* Launch Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-aurora-violet via-purple-600 to-aurora-teal hover:opacity-95 shadow-xl shadow-purple-600/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Allocating Agent Swarm...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Deploy ScholarSwarm (7 Autonomous Agents)
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
