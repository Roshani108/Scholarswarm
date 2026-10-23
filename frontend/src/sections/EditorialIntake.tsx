import React, { useState, useEffect } from 'react';
import { Stamp } from '../design-system/Stamp';
import { RollingCounter } from '../design-system/RollingCounter';
import type { DemoProfile } from '../types/swarm';

interface EditorialIntakeProps {
  initialProfile?: DemoProfile | null;
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
  chaosEnabled: boolean;
  onToggleChaos: (val: boolean) => void;
}

const DESTINATIONS = [
  'CANADA',
  'GERMANY',
  'SINGAPORE',
  'UNITED KINGDOM',
  'UNITED STATES',
  'EUROPEAN UNION',
];

export const EditorialIntake: React.FC<EditorialIntakeProps> = ({
  initialProfile,
  onSubmit,
  isLoading,
  chaosEnabled,
  onToggleChaos,
}) => {
  const [activeTab, setActiveTab] = useState<'trays' | 'raw_text'>('trays');
  const [name, setName] = useState(initialProfile?.name || 'Rahul Sharma');
  const [educationLevel, setEducationLevel] = useState(initialProfile?.education_level || 'B.Tech Computer Science & Engineering');
  const [cgpa, setCgpa] = useState(initialProfile?.cgpa || '8.2 / 10.0');
  const [targetDegree, setTargetDegree] = useState(initialProfile?.target_degree || "Master's");
  const [targetField, setTargetField] = useState(initialProfile?.target_field || 'Computer Science & Artificial Intelligence');
  const [budget, setBudget] = useState(initialProfile?.budget || 'Need full scholarship or significant research stipend');
  const [githubUsername, setGithubUsername] = useState(initialProfile?.github_username || 'rahul-cse');
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    initialProfile?.target_countries.map((c) => c.toUpperCase()) || ['CANADA', 'GERMANY', 'SINGAPORE']
  );
  const [rawText, setRawText] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [marksheetFile, setMarksheetFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name);
      setEducationLevel(initialProfile.education_level);
      setCgpa(initialProfile.cgpa);
      setTargetDegree(initialProfile.target_degree);
      setTargetField(initialProfile.target_field);
      setBudget(initialProfile.budget);
      setGithubUsername(initialProfile.github_username);
      setSelectedDestinations(initialProfile.target_countries.map((c) => c.toUpperCase()));
    }
  }, [initialProfile]);

  const calculateCompleteness = () => {
    let score = 0;
    if (name.trim()) score += 15;
    if (educationLevel.trim()) score += 15;
    if (cgpa.trim()) score += 15;
    if (selectedDestinations.length > 0) score += 15;
    if (githubUsername.trim()) score += 15;
    if (resumeFile || rawText.trim().length > 40) score += 15;
    if (marksheetFile) score += 10;
    return Math.min(100, score);
  };

  const completeness = calculateCompleteness();

  const toggleDestination = (dest: string) => {
    if (selectedDestinations.includes(dest)) {
      if (selectedDestinations.length > 1) {
        setSelectedDestinations(selectedDestinations.filter((d) => d !== dest));
      }
    } else {
      setSelectedDestinations([...selectedDestinations, dest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', name);
    fd.append('education_level', educationLevel);
    fd.append('cgpa', cgpa);
    fd.append('target_countries', selectedDestinations.map((d) => d.charAt(0) + d.slice(1).toLowerCase()).join(','));
    fd.append('target_degree', targetDegree);
    fd.append('target_field', targetField);
    fd.append('budget', budget);
    fd.append('github_username', githubUsername);
    fd.append('chaos_mode', String(chaosEnabled));

    if (activeTab === 'raw_text') {
      fd.append('raw_profile_text', rawText);
    } else {
      if (resumeFile) fd.append('resume', resumeFile);
      if (marksheetFile) fd.append('marksheet', marksheetFile);
      if (rawText) fd.append('raw_profile_text', rawText);
    }

    onSubmit(fd);
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-12">
      {/* Dossier File Cover Header */}
      <div className="border border-hairline dark:border-night-hairline p-6 sm:p-8 bg-white dark:bg-night-sheet shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-hairline dark:border-night-hairline gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono-ledger text-xs uppercase tracking-widest text-cobalt dark:text-cobalt-dark font-semibold">
                FORM BUR-01 / ADMISSIONS INVESTIGATION
              </span>
              <Stamp text="CONFIDENTIAL" variant="cobalt" size="sm" rotation={0} />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-ink dark:text-night-bone mt-2">
              Candidate Dossier Intake
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono-ledger text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('trays')}
              className={`px-3 py-1.5 border transition-all ${
                activeTab === 'trays'
                  ? 'border-cobalt bg-cobalt text-white font-bold'
                  : 'border-hairline dark:border-night-hairline text-ink-muted hover:text-ink'
              }`}
            >
              [ TRAY ATTACHMENTS ]
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('raw_text')}
              className={`px-3 py-1.5 border transition-all ${
                activeTab === 'raw_text'
                  ? 'border-cobalt bg-cobalt text-white font-bold'
                  : 'border-hairline dark:border-night-hairline text-ink-muted hover:text-ink'
              }`}
            >
              [ RAW CASE TRANSCRIPT ]
            </button>
          </div>
        </div>

        {/* File Completeness Ruled Gauge */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono-ledger text-xs text-ink-muted dark:text-night-muted">
          <div className="flex items-center gap-4">
            <span className="uppercase tracking-widest text-[11px]">DOSSIER COMPLETENESS:</span>
            <div className="w-48 sm:w-72 h-1 bg-hairline dark:bg-night-hairline relative overflow-hidden">
              <div
                className="h-full bg-cobalt transition-all duration-500 ease-editorial"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <RollingCounter value={completeness} label="%" className="text-ink dark:text-night-bone font-bold" />
          </div>
          <span className="text-[10px] uppercase tracking-widest">
            {completeness === 100 ? 'READY FOR ALLOCATION' : 'AWAITING PARTICULARS'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column (7 cols): Editorial Case Particulars */}
          <div className="lg:col-span-7 space-y-8">
            <div className="border-b border-hairline dark:border-night-hairline pb-2 font-mono-ledger text-xs uppercase tracking-widest text-ink-muted dark:text-night-muted">
              SECTION 01 / CANDIDATE IDENTITY
            </div>

            {/* Candidate Name */}
            <div>
              <label className="block font-display text-2xl text-ink dark:text-night-bone mb-1">
                Candidate Legal Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-transparent border-b border-ink/40 dark:border-night-bone/40 focus:border-cobalt dark:focus:border-cobalt outline-none py-2 font-display text-2xl text-ink dark:text-night-bone transition-colors"
              />
            </div>

            {/* Academic Standing & Discipline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="block font-display text-xl text-ink dark:text-night-bone mb-1">
                  Cumulative GPA / Marks
                </label>
                <input
                  type="text"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  required
                  placeholder="e.g. 8.2 / 10.0 or 3.45 / 4.0"
                  className="w-full bg-transparent border-b border-ink/40 dark:border-night-bone/40 focus:border-cobalt dark:focus:border-cobalt outline-none py-2 font-display text-xl text-ink dark:text-night-bone transition-colors"
                />
                <span className="font-mono-ledger text-[10px] text-ink-muted dark:text-night-muted mt-1 block">
                  Normalized mathematically via WES scales
                </span>
              </div>

              <div>
                <label className="block font-display text-xl text-ink dark:text-night-bone mb-1">
                  Current Degree Level
                </label>
                <input
                  type="text"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  required
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full bg-transparent border-b border-ink/40 dark:border-night-bone/40 focus:border-cobalt dark:focus:border-cobalt outline-none py-2 font-display text-xl text-ink dark:text-night-bone transition-colors"
                />
              </div>
            </div>

            {/* Target Field & GitHub */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="block font-display text-xl text-ink dark:text-night-bone mb-1">
                  Target Field of Research
                </label>
                <input
                  type="text"
                  value={targetField}
                  onChange={(e) => setTargetField(e.target.value)}
                  required
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full bg-transparent border-b border-ink/40 dark:border-night-bone/40 focus:border-cobalt dark:focus:border-cobalt outline-none py-2 font-display text-xl text-ink dark:text-night-bone transition-colors"
                />
              </div>

              <div>
                <label className="block font-display text-xl text-ink dark:text-night-bone mb-1">
                  Public GitHub Username
                </label>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  placeholder="e.g. rahul-cse"
                  className="w-full bg-transparent border-b border-ink/40 dark:border-night-bone/40 focus:border-cobalt dark:focus:border-cobalt outline-none py-2 font-mono text-base text-ink dark:text-night-bone transition-colors"
                />
                <span className="font-mono-ledger text-[10px] text-ink-muted dark:text-night-muted mt-1 block">
                  Inspects public repositories without credential exposure
                </span>
              </div>
            </div>

            {/* Target Destinations */}
            <div>
              <label className="block font-display text-xl text-ink dark:text-night-bone mb-3">
                Scouting Jurisdictions
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono-ledger text-xs">
                {DESTINATIONS.map((dest) => {
                  const isChecked = selectedDestinations.includes(dest);
                  return (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => toggleDestination(dest)}
                      data-cursor="TOGGLE"
                      className={`p-3 border text-left transition-all ${
                        isChecked
                          ? 'border-cobalt bg-cobalt text-white font-bold shadow-sm'
                          : 'border-hairline dark:border-night-hairline bg-white dark:bg-night-bg text-ink-muted hover:border-ink'
                      }`}
                    >
                      <span className="mr-2 font-bold">{isChecked ? '[x]' : '[ ]'}</span>
                      {dest}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Physical Trays & Chaos Switch */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border-b border-hairline dark:border-night-hairline pb-2 font-mono-ledger text-xs uppercase tracking-widest text-ink-muted dark:text-night-muted">
              SECTION 02 / PHYSICAL EVIDENCE TRAYS
            </div>

            {activeTab === 'trays' ? (
              <div className="space-y-4">
                {/* Tray 01: Resume Archive */}
                <div className="border border-dashed border-hairline dark:border-night-hairline p-6 bg-white dark:bg-night-sheet shadow-sm relative">
                  <div className="font-mono-ledger text-[10px] uppercase text-cobalt tracking-widest mb-1 font-semibold">
                    [ TRAY 01: CANDIDATE CURRICULUM VITAE ]
                  </div>
                  <div className="font-display text-lg text-ink dark:text-night-bone">
                    {resumeFile ? resumeFile.name : 'Awaiting Resume Document (PDF / DOCX)'}
                  </div>
                  <p className="font-mono-ledger text-[11px] text-ink-muted dark:text-night-muted mt-1">
                    {resumeFile ? `${(resumeFile.size / 1024).toFixed(1)} KB — VERIFIED ATTACHED` : 'Upload candidate CV for project and honors extraction'}
                  </p>
                  <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-cobalt text-cobalt hover:bg-cobalt hover:text-white font-mono-ledger text-xs uppercase tracking-widest cursor-pointer transition-colors">
                    <span>BROWSE ARCHIVE</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={(e) => e.target.files?.[0] && setResumeFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Tray 02: Marksheet Transcript */}
                <div className="border border-dashed border-hairline dark:border-night-hairline p-6 bg-white dark:bg-night-sheet shadow-sm relative">
                  <div className="font-mono-ledger text-[10px] uppercase text-emerald tracking-widest mb-1 font-semibold">
                    [ TRAY 02: OFFICIAL ACADEMIC MARKSHEET ]
                  </div>
                  <div className="font-display text-lg text-ink dark:text-night-bone">
                    {marksheetFile ? marksheetFile.name : 'Awaiting University Transcript (PDF)'}
                  </div>
                  <p className="font-mono-ledger text-[11px] text-ink-muted dark:text-night-muted mt-1">
                    {marksheetFile ? `${(marksheetFile.size / 1024).toFixed(1)} KB — OFFICIAL RECORD VERIFIED` : 'Used for mathematical GPA audit and degree confirmation'}
                  </p>
                  <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-emerald text-emerald hover:bg-emerald hover:text-white font-mono-ledger text-xs uppercase tracking-widest cursor-pointer transition-colors">
                    <span>BROWSE ARCHIVE</span>
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
                <label className="block font-mono-ledger text-xs uppercase tracking-widest text-ink dark:text-night-bone mb-2">
                  RAW CANDIDATE CASE TRANSCRIPT (TYPEWRITER INTAKE)
                </label>
                <textarea
                  rows={8}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste unstructured biographical transcript: degrees, published papers, projects, standardized test scores, budget limitations..."
                  className="w-full p-4 border border-hairline dark:border-night-hairline bg-white dark:bg-night-bg font-mono-ledger text-xs text-ink dark:text-night-bone outline-none focus:border-cobalt transition-colors leading-relaxed"
                />
              </div>
            )}

            {/* Industrial Chaos Switch */}
            <div className="border border-hairline dark:border-night-hairline p-5 bg-white dark:bg-night-bg shadow-sm flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${chaosEnabled ? 'bg-cobalt animate-ping' : 'bg-ink-muted/40'}`} />
                  <span className="font-mono-ledger text-xs font-bold uppercase tracking-wider text-ink dark:text-night-bone">
                    CHAOS INJECTION MECHANISM
                  </span>
                </div>
                <p className="font-mono-ledger text-[10px] text-ink-muted dark:text-night-muted mt-1 max-w-xs">
                  Artificially drops 45% of network queries and induces timeouts to demonstrate autonomous self-healing.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onToggleChaos(!chaosEnabled)}
                data-cursor="TOGGLE"
                className={`relative px-4 py-2 border font-mono-ledger text-xs uppercase tracking-widest font-bold transition-all ${
                  chaosEnabled
                    ? 'border-cobalt bg-cobalt text-white shadow-sm'
                    : 'border-hairline dark:border-night-hairline text-ink-muted hover:border-ink'
                }`}
              >
                {chaosEnabled ? '[ CHAOS ENGAGED ]' : '[ STANDBY ]'}
              </button>
            </div>
          </div>
        </div>

        {/* Big Solid Cobalt Launch Button */}
        <div className="pt-6 border-t border-hairline dark:border-night-hairline">
          <button
            type="submit"
            disabled={isLoading}
            data-cursor="LAUNCH"
            className="w-full py-5 bg-cobalt hover:bg-cobalt-hover text-white font-mono-ledger text-sm font-bold uppercase tracking-widest transition-colors duration-200 flex items-center justify-center gap-4 disabled:opacity-50 shadow-md"
          >
            {isLoading ? (
              <span>DEPLOYING SEVEN INVESTIGATIVE AGENTS...</span>
            ) : (
              <>
                <span>DEPLOY SCHOLARSWARM DOSSIER PROTOCOL</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
