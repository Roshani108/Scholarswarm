import React, { useState, useEffect } from 'react';
import { 
  Upload, FileText, CheckCircle2, GitBranch, Globe, 
  Sparkles, ArrowRight, UserCheck
} from 'lucide-react';
import type { DemoProfile } from '../types/swarm';

interface CandidateIntakeProps {
  initialProfile?: DemoProfile | null;
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
}

const TARGET_COUNTRIES = [
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Sweden', flag: '🇸🇪' },
  { name: 'Netherlands', flag: '🇳🇱' },
];

export const CandidateIntake: React.FC<CandidateIntakeProps> = ({
  initialProfile,
  onSubmit,
  isLoading,
}) => {
  const [name, setName] = useState(initialProfile?.name || 'Rahul Sharma');
  const [educationLevel, setEducationLevel] = useState(initialProfile?.education_level || 'B.Tech Computer Science & Engineering');
  const [currentInstitution, setCurrentInstitution] = useState(initialProfile?.current_institution || 'NIT Jalandhar');
  const [cgpa, setCgpa] = useState(initialProfile?.cgpa || '8.2 / 10.0');
  const [targetDegree, setTargetDegree] = useState(initialProfile?.target_degree || "Master's");
  const [targetField, setTargetField] = useState(initialProfile?.target_field || 'Computer Science & Artificial Intelligence');
  const [budget, setBudget] = useState(initialProfile?.budget || 'Need full scholarship or significant research stipend');
  const [githubUsername, setGithubUsername] = useState(initialProfile?.github_username || 'rahul-cse');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    initialProfile?.target_countries || ['Canada', 'Germany', 'Singapore']
  );
  const [rawProfileText, setRawProfileText] = useState(initialProfile?.bio || '');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [marksheetFile, setMarksheetFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name);
      setEducationLevel(initialProfile.education_level);
      setCurrentInstitution(initialProfile.current_institution || '');
      setCgpa(initialProfile.cgpa);
      setTargetDegree(initialProfile.target_degree);
      setTargetField(initialProfile.target_field);
      setBudget(initialProfile.budget);
      setGithubUsername(initialProfile.github_username);
      setSelectedCountries(initialProfile.target_countries);
      setRawProfileText(initialProfile.bio || '');
    }
  }, [initialProfile]);

  const calculateCompleteness = () => {
    let score = 0;
    if (name.trim()) score += 15;
    if (educationLevel.trim()) score += 15;
    if (cgpa.trim()) score += 15;
    if (selectedCountries.length > 0) score += 15;
    if (githubUsername.trim()) score += 15;
    if (resumeFile || rawProfileText.trim().length > 30) score += 15;
    if (marksheetFile || currentInstitution.trim()) score += 10;
    return Math.min(100, score);
  };

  const completeness = calculateCompleteness();

  const toggleCountry = (country: string) => {
    if (selectedCountries.includes(country)) {
      if (selectedCountries.length > 1) {
        setSelectedCountries(selectedCountries.filter((c) => c !== country));
      }
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
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
    data.append('raw_profile_text', rawProfileText);

    if (resumeFile) {
      data.append('resume_file', resumeFile);
    }
    if (marksheetFile) {
      data.append('marksheet_file', marksheetFile);
    }

    onSubmit(data);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Header bar */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/80 mb-2">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Step 1: Student Dossier Intake</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Candidate Profile & Evidence Repository
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Provide academic credentials, target destinations, and research interests.
          </p>
        </div>

        {/* Profile Completeness Pill */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 min-w-[240px] shadow-lg">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                className="text-slate-800"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                className="text-indigo-500 transition-all duration-500"
                strokeWidth="4"
                strokeDasharray={125}
                strokeDashoffset={125 - (125 * completeness) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-xs font-bold text-white">
              {completeness}%
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              Completeness
            </div>
            <div className="text-[11px] text-slate-400">
              {completeness >= 80 ? 'High Evidence Depth' : 'Add CV or GitHub'}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Core Profile Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Academic & Identification Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-850 bg-[#161F30] text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                placeholder="e.g. Rahul Sharma"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Current Degree / Background
              </label>
              <input
                type="text"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-[#161F30] text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                placeholder="e.g. B.Tech Computer Science"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Institution Name
              </label>
              <input
                type="text"
                value={currentInstitution}
                onChange={(e) => setCurrentInstitution(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-[#161F30] text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                placeholder="e.g. NIT Jalandhar"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                CGPA / Grades (Normalized by Swarm)
              </label>
              <input
                type="text"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-[#161F30] text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                placeholder="e.g. 8.2 / 10.0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Degree
              </label>
              <select
                value={targetDegree}
                onChange={(e) => setTargetDegree(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-[#161F30] text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              >
                <option value="Master's">Master's (M.Sc / M.S / M.Eng)</option>
                <option value="PhD">Ph.D. / Doctorate</option>
                <option value="Postdoc">Postdoctoral Research</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Field of Study
              </label>
              <input
                type="text"
                value={targetField}
                onChange={(e) => setTargetField(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-[#161F30] text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                placeholder="e.g. Artificial Intelligence"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                GitHub Username (Auto-Enriched)
              </label>
              <div className="relative">
                <GitBranch className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-[#161F30] text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  placeholder="e.g. rahul-cse"
                />
              </div>
            </div>
          </div>

          {/* Target Countries Selector */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Target Destinations (Multi-Select)
            </label>
            <div className="flex flex-wrap gap-2">
              {TARGET_COUNTRIES.map((c) => {
                const isSelected = selectedCountries.includes(c.name);
                return (
                  <button
                    type="button"
                    key={c.name}
                    onClick={() => toggleCountry(c.name)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all ${
                      isSelected
                        ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300 shadow-sm'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Uploads & Narrative Evidence Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Upload className="w-4 h-4 text-teal-400" />
            Evidence Ingestion: Resume, Transcript & Bio
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Resume Dropzone */}
            <div className="p-5 rounded-2xl border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-850 bg-[#161F30] text-center transition-colors">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-semibold text-slate-200">
                {resumeFile ? resumeFile.name : 'Upload Student Resume / CV'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                PDF or TXT format (max 5MB)
              </div>
              <label className="mt-3 inline-block px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-200 cursor-pointer hover:bg-slate-700 transition-colors">
                Browse File
                <input
                  type="file"
                  accept=".pdf,.txt,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            {/* Marksheet Dropzone */}
            <div className="p-5 rounded-2xl border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-[#161F30] text-center transition-colors">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-semibold text-slate-200">
                {marksheetFile ? marksheetFile.name : 'Upload Official Academic Transcript'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Parsed for credits & GPA verification
              </div>
              <label className="mt-3 inline-block px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-200 cursor-pointer hover:bg-slate-700 transition-colors">
                Browse File
                <input
                  type="file"
                  accept=".pdf,.txt,.docx"
                  onChange={(e) => setMarksheetFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Candidate Bio, Research Accomplishments & Projects (Optional Text Fallback)
            </label>
            <textarea
              rows={3}
              value={rawProfileText}
              onChange={(e) => setRawProfileText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-[#161F30] text-white text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder-slate-500"
              placeholder="Paste research highlights, publications, hackathon wins, or key projects here..."
            />
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 active:scale-98 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Initializing 7-Agent Swarm...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Launch Autonomous Swarm</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
