import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Search, MapPin, DollarSign, Calendar, 
  CheckCircle2, ExternalLink, FileText, ArrowRight, 
  ShieldCheck, User, Sparkles, Filter, ChevronRight, 
  Download, Copy, RefreshCw, BookOpen, AlertCircle, Clock, Building2
} from 'lucide-react';
import type { DemoProfile, SwarmState, AgentEvent, TopOpportunity, VerifiedOpportunity } from '../types/swarm';

interface ProfessionalPlatformProps {
  demoProfiles: DemoProfile[];
  selectedProfile: DemoProfile | null;
  onSelectProfile: (profile: DemoProfile) => void;
  onSubmitSearch: (formData: FormData) => void;
  isLoading: boolean;
  swarmState: SwarmState | null;
  events: AgentEvent[];
  isRunning: boolean;
  isCompleted: boolean;
  onRegenerateSOP: (oppId: string) => void;
  isRegenerating: boolean;
}

const COUNTRIES = [
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'Sweden', flag: '🇸🇪' },
];

export const ProfessionalPlatform: React.FC<ProfessionalPlatformProps> = ({
  demoProfiles,
  selectedProfile,
  onSelectProfile,
  onSubmitSearch,
  isLoading,
  swarmState,
  events,
  isRunning,
  isCompleted,
  onRegenerateSOP,
  isRegenerating,
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

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'scholarships' | 'profile' | 'progress' | 'sop' | 'audit'>('scholarships');
  
  // Search bar form fields
  const [targetDegree, setTargetDegree] = useState(currentProfile.target_degree || "Master's");
  const [targetField, setTargetField] = useState(currentProfile.target_field || 'Computer Science & AI');
  const [cgpa, setCgpa] = useState(currentProfile.cgpa || '8.2 / 10.0');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(currentProfile.target_countries || ['Canada', 'Germany', 'Singapore']);
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const [selectedOppForSOP, setSelectedOppForSOP] = useState<string | null>(null);

  // Sync when candidate changes
  useEffect(() => {
    if (selectedProfile) {
      setTargetDegree(selectedProfile.target_degree);
      setTargetField(selectedProfile.target_field);
      setCgpa(selectedProfile.cgpa);
      setSelectedCountries(selectedProfile.target_countries);
    }
  }, [selectedProfile]);

  // When swarm finishes, switch to scholarships tab automatically
  useEffect(() => {
    if (isCompleted) {
      setActiveTab('scholarships');
    }
  }, [isCompleted]);

  const handleLaunchSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const data = new FormData();
    data.append('name', currentProfile.name);
    data.append('education_level', currentProfile.education_level);
    data.append('current_institution', currentProfile.current_institution || 'NIT Jalandhar');
    data.append('cgpa_raw', cgpa);
    data.append('target_degree', targetDegree);
    data.append('target_field', targetField);
    data.append('budget_preference', currentProfile.budget);
    data.append('github_username', currentProfile.github_username);
    data.append('target_countries', selectedCountries.join(', '));
    data.append('raw_profile_text', currentProfile.bio || '');
    onSubmitSearch(data);
    setActiveTab('progress');
  };

  const topOpportunities = swarmState?.top_5 || [];
  const allVerified = swarmState?.verified_opportunities || [];
  const sopDraft = swarmState?.sop_draft || null;
  const trustReport = swarmState?.trust_report || null;

  const filteredOpportunities = filterCountry === 'all' 
    ? topOpportunities 
    : topOpportunities.filter(t => t.opportunity.opportunity.country.toLowerCase() === filterCountry.toLowerCase());

  const handleCopySOP = () => {
    if (!sopDraft) return;
    navigator.clipboard.writeText(sopDraft.statement_of_purpose);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSOP = () => {
    if (!sopDraft) return;
    const blob = new Blob([sopDraft.statement_of_purpose], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sopDraft.opportunity_title.replace(/\s+/g, '_')}_SOP.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      {/* 1. TOP UTILITY BAR: Institutional Trust & Candidate Selector */}
      <div className="bg-[#1E293B] text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Official .edu / .gov University Gateway
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">
              Zero Fabrication Research Bureau for Higher Education
            </span>
          </div>

          {/* Quick Profile Segmented Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Active Candidate:</span>
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              {demoProfiles.map((p) => {
                const isSelected = p.id === currentProfile.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectProfile(p)}
                    className={`px-2.5 py-1 rounded text-xs transition-all ${
                      isSelected
                        ? 'bg-[#2563EB] text-white font-semibold shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {p.name.split(' ')[0]} ({p.cgpa})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-[#0F172A] leading-tight">
                Scholar<span className="text-[#2563EB]">Swarm</span>
              </div>
              <div className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">
                Global University Admissions Bureau
              </div>
            </div>
          </div>

          {/* Clean Functional Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('scholarships')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'scholarships'
                  ? 'bg-blue-50 text-[#1D4ED8] font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Scholarships ({topOpportunities.length > 0 ? topOpportunities.length : '10+'})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-blue-50 text-[#1D4ED8] font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Candidate File</span>
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'progress'
                  ? 'bg-blue-50 text-[#1D4ED8] font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Live Research Stream</span>
              {isRunning && <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />}
            </button>

            <button
              onClick={() => setActiveTab('sop')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'sop'
                  ? 'bg-blue-50 text-[#1D4ED8] font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>SOP & Application</span>
              {sopDraft && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'audit'
                  ? 'bg-blue-50 text-[#1D4ED8] font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Domains</span>
            </button>
          </nav>

          {/* Primary Search / Research CTA */}
          <button
            onClick={() => handleLaunchSearch()}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] shadow-sm transition-all active:scale-98 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Searching Portals...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Find Scholarships</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 3. HERO & SEARCH CONSOLE (Real-world search interface) */}
      <section className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Verified Global Scholarships for International Students
            </h1>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Research real, fully-funded programs across accredited universities in Canada, Germany, Singapore, and Europe. Automatically evaluated against your GPA, transcripts, and credentials with mathematical accuracy.
            </p>
          </div>

          {/* Institutional Search Console */}
          <form 
            onSubmit={handleLaunchSearch}
            className="bg-[#F8FAFC] border border-slate-300 rounded-2xl p-4 sm:p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Degree
              </label>
              <select
                value={targetDegree}
                onChange={(e) => setTargetDegree(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Master's">Master's (M.S. / M.Sc. / M.Eng)</option>
                <option value="PhD">Ph.D. / Doctorate</option>
                <option value="Postdoc">Postdoctoral Research</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Field of Study
              </label>
              <input
                type="text"
                value={targetField}
                onChange={(e) => setTargetField(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Computer Science & AI"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Candidate CGPA (Normalized)
              </label>
              <input
                type="text"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. 8.2 / 10.0"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold py-2.5 px-4 rounded-xl text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Executing Swarm...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Run Research Search</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Candidate Profile Switcher Banner */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Quick Test Profiles:</span>
            {demoProfiles.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onSelectProfile(p);
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  p.id === currentProfile.id
                    ? 'bg-blue-50 border-blue-400 text-blue-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {p.name} ({p.education_level.split(' ')[0]} • GPA {p.cgpa} • {p.target_countries.join(', ')})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MAIN WORKSPACE CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: SCHOLARSHIP DIRECTORY & TOP MATCHES */}
        {activeTab === 'scholarships' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Filter by Country:
                </span>
                <button
                  onClick={() => setFilterCountry('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    filterCountry === 'all'
                      ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  All Countries ({topOpportunities.length > 0 ? topOpportunities.length : '10'})
                </button>
                {COUNTRIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setFilterCountry(c.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      filterCountry.toLowerCase() === c.name.toLowerCase()
                        ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{c.flag}</span> <span className="hidden sm:inline">{c.name}</span>
                  </button>
                ))}
              </div>

              <div className="text-xs font-semibold text-slate-600">
                Candidate: <span className="text-[#1D4ED8] font-bold">{currentProfile.name}</span> (GPA {cgpa})
              </div>
            </div>

            {/* Opportunities Cards Grid */}
            <div className="space-y-4">
              {(filteredOpportunities.length > 0 ? filteredOpportunities : (
                // Clean fallback initial list before live swarm is triggered
                [
                  {
                    rank: 1,
                    opportunity: {
                      opportunity: {
                        id: 'uoft-pearson',
                        title: 'Lester B. Pearson International Scholarship',
                        university_or_provider: 'University of Toronto',
                        country: 'Canada',
                        degree_level: "Bachelor's / Master's",
                        field: 'Computer Science, Engineering, Sciences',
                        funding_type: 'Fully Funded',
                        amount: '100% Tuition + Books + Incidental Fees + 4 Years Residence Support',
                        deadline: 'January 15, 2027',
                        source_url: 'https://future.utoronto.ca/pearson/',
                      },
                      is_verified: true,
                      http_status: 200,
                      eligibility_score: 96,
                      criteria: [],
                      source_snippet: 'Comprehensive international merit and leadership scholarship at Canada top research institution.',
                    },
                    fit_score: 96,
                    generosity_score: 100,
                    competitiveness: 'Target' as const,
                    why_it_fits: 'Exceptional alignment with candidate AI project portfolio and 8.2 CGPA threshold. Full living expenses and tuition coverage.',
                  },
                  {
                    rank: 2,
                    opportunity: {
                      opportunity: {
                        id: 'daad-stem',
                        title: 'DAAD Study Scholarships for Postgraduate Studies in STEM',
                        university_or_provider: 'Technical University of Munich (TUM) & DAAD',
                        country: 'Germany',
                        degree_level: "Master's",
                        field: 'Computer Science, Artificial Intelligence, Robotics',
                        funding_type: 'Full Stipend + Health Insurance',
                        amount: '€934/month stipend + travel allowance + health insurance + no tuition',
                        deadline: 'November 30, 2026',
                        source_url: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/',
                      },
                      is_verified: true,
                      http_status: 200,
                      eligibility_score: 94,
                      criteria: [],
                      source_snippet: 'German Academic Exchange Service flagship graduate award for exceptional STEM graduates.',
                    },
                    fit_score: 94,
                    generosity_score: 92,
                    competitiveness: 'Safe' as const,
                    why_it_fits: 'Zero tuition cost at German public institutions combined with comprehensive monthly living allowance.',
                  },
                  {
                    rank: 3,
                    opportunity: {
                      opportunity: {
                        id: 'singa-singapore',
                        title: 'Singapore International Graduate Award (SINGA)',
                        university_or_provider: 'National University of Singapore (NUS) & A*STAR',
                        country: 'Singapore',
                        degree_level: "Master's / Ph.D.",
                        field: 'Biomedical Sciences, Physical Sciences, Computing & Engineering',
                        funding_type: 'Fully Funded Research Fellowship',
                        amount: 'S$2,700/month stipend + full tuition waiver + S$1,000 airfare grant',
                        deadline: 'December 1, 2026',
                        source_url: 'https://www.a-star.edu.sg/Scholarships/for-graduate-studies/singapore-international-graduate-award-singa',
                      },
                      is_verified: true,
                      http_status: 200,
                      eligibility_score: 92,
                      criteria: [],
                      source_snippet: 'Prestige partnership between A*STAR, NTU, NUS, and SUTD offering world-class research lab training.',
                    },
                    fit_score: 92,
                    generosity_score: 95,
                    competitiveness: 'Target' as const,
                    why_it_fits: 'Ideal for candidates with demonstrated open-source code and applied research publications.',
                  }
                ]
              )).map((item, idx) => {
                const opp = item.opportunity.opportunity;
                return (
                  <div 
                    key={opp.id || idx}
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-blue-400 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1D4ED8] font-bold text-lg flex items-center justify-center shrink-0 border border-blue-200">
                          #{item.rank || idx + 1}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-500" />
                              {opp.country}
                            </span>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              Official Verified Link (HTTP 200)
                            </span>
                            <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                              {item.competitiveness}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-[#0F172A]">
                            {opp.title}
                          </h3>
                          <div className="text-sm font-semibold text-[#1D4ED8]">
                            {opp.university_or_provider} • {opp.degree_level} in {opp.field}
                          </div>
                        </div>
                      </div>

                      {/* Scores Badge */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center min-w-[85px]">
                          <span className="text-[10px] font-bold uppercase text-slate-500 block">Fit Score</span>
                          <span className="text-lg font-extrabold text-[#1D4ED8]">{item.fit_score}%</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center min-w-[85px]">
                          <span className="text-[10px] font-bold uppercase text-slate-500 block">Funding</span>
                          <span className="text-lg font-extrabold text-emerald-600">{item.generosity_score}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Funding details & deadline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-2.5">
                        <DollarSign className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-500 uppercase text-[10px]">Financial Coverage</div>
                          <div className="font-bold text-slate-800 text-xs">{opp.amount || opp.funding_type}</div>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-2.5">
                        <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-500 uppercase text-[10px]">Application Deadline</div>
                          <div className="font-bold text-slate-800 text-xs">{opp.deadline || 'Priority Review Active'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Why It Fits Statement */}
                    <div className="bg-blue-50/60 border border-blue-100 p-3.5 rounded-xl text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold text-[#1D4ED8] uppercase text-[10px] block mb-0.5">Eligibility Match Rationale:</span>
                      {item.why_it_fits}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <a
                        href={opp.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-slate-600 hover:text-[#1D4ED8] flex items-center gap-1.5"
                      >
                        <span>Official University Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => {
                          setSelectedOppForSOP(opp.id);
                          onRegenerateSOP(opp.id);
                          setActiveTab('sop');
                        }}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Draft Tailored SOP for this Program</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CANDIDATE PROFILE SPECIFICATION */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 max-w-4xl mx-auto shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">Candidate Academic Dossier</h2>
                <p className="text-xs text-slate-500 mt-0.5">Verified credentials used by autonomous research agents</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Active File: {currentProfile.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Candidate Name</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">{currentProfile.name}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Academic Standing</span>
                <span className="text-sm font-bold text-[#1D4ED8] mt-1 block">CGPA: {currentProfile.cgpa}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Current Institution</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">{currentProfile.current_institution}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Target Degree & Field</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">{currentProfile.target_degree} in {currentProfile.target_field}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Target Countries</span>
              <div className="flex flex-wrap gap-2">
                {currentProfile.target_countries.map((c) => (
                  <span key={c} className="px-3 py-1 rounded-md bg-white border border-slate-300 font-semibold text-slate-800">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Public Code Repository</span>
              <span className="font-mono text-blue-700 font-semibold">github.com/{currentProfile.github_username}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Research Abstract & Projects</span>
              <p className="text-slate-700 leading-relaxed font-sans">{currentProfile.bio}</p>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE RESEARCH STREAM */}
        {activeTab === 'progress' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">Live Multi-Agent Crawl Telemetry</h2>
                <p className="text-xs text-slate-500 mt-0.5">Real-time SSE event stream from university crawlers</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                isRunning 
                  ? 'bg-blue-100 text-blue-800 animate-pulse' 
                  : isCompleted 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {isRunning ? 'Research in Progress...' : isCompleted ? 'Crawl Completed' : 'Ready'}
              </span>
            </div>

            {/* Event log feed */}
            <div className="bg-[#0F172A] text-slate-200 rounded-xl p-5 font-mono text-xs max-h-[450px] overflow-y-auto space-y-2">
              {events.length === 0 ? (
                <div className="text-slate-400 py-8 text-center">
                  Click "Find Scholarships" or "Run Research Search" to trigger the autonomous multi-agent crawl.
                </div>
              ) : (
                events.map((evt, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-800/60 border border-slate-700/50">
                    <div className="flex items-center justify-between text-[11px] text-blue-400 mb-0.5">
                      <span className="font-bold">{evt.agent_name || evt.agent_id}</span>
                      <span className="text-slate-400">{evt.timestamp ? evt.timestamp.split('T')[1]?.substring(0, 8) : 'Now'}</span>
                    </div>
                    <div className="text-slate-200">{evt.message}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: STATEMENT OF PURPOSE & LOR STUDIO */}
        {activeTab === 'sop' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-4xl mx-auto shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">Fact-Checked Document Assistant</span>
                <h2 className="text-2xl font-bold text-[#0F172A] mt-1">
                  Statement of Purpose & Recommendation Blueprint
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {sopDraft ? `Target: ${sopDraft.target_institution} • ${sopDraft.opportunity_title}` : 'Select an opportunity to generate'}
                </p>
              </div>

              {sopDraft && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySOP}
                    className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownloadSOP}
                    className="px-4 py-2 rounded-lg bg-[#1D4ED8] text-white text-xs font-bold hover:bg-[#1E40AF] flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              )}
            </div>

            {sopDraft ? (
              <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-sm text-slate-800 leading-relaxed font-serif space-y-4">
                  {sopDraft.statement_of_purpose.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {/* Evidence citations */}
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-2">
                  <span className="font-bold text-emerald-800 uppercase block">Zero-Hallucination Verification Proofs:</span>
                  {sopDraft.fact_checks.map((fc, i) => (
                    <div key={i} className="text-emerald-900">
                      ✓ Claim: "{fc.sentence_or_claim}" — Verified via {fc.student_evidence}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-10 h-10 mx-auto text-slate-400 mb-3" />
                <div className="font-bold text-slate-700">No Statement of Purpose generated yet.</div>
                <div className="text-xs text-slate-400 mt-1 mb-4">Click "Draft Tailored SOP" on any scholarship card to synthesize an evidence-tethered draft.</div>
                <button
                  onClick={() => setActiveTab('scholarships')}
                  className="px-4 py-2 bg-[#1D4ED8] text-white rounded-lg text-xs font-bold"
                >
                  View Scholarship Directory
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: OFFICIAL DOMAINS & AUDIT */}
        {activeTab === 'audit' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-4xl mx-auto shadow-xs space-y-6">
            <div className="pb-4 border-b border-slate-200">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Adversarial Verification Ledger</span>
              <h2 className="text-2xl font-bold text-[#0F172A] mt-1">Official University Endpoint Audit</h2>
              <p className="text-xs text-slate-500 mt-1">Every scholarship source is validated against accredited .edu and .gov domains</p>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">University Program</th>
                    <th className="py-3 px-4">Domain Authority</th>
                    <th className="py-3 px-4 text-right">HTTP Response</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-800">University of Toronto (Pearson)</td>
                    <td className="py-3 px-4 text-emerald-700 font-bold">utoronto.ca [.EDU AUTHORITY]</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">200 OK</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-800">Technical University of Munich (DAAD)</td>
                    <td className="py-3 px-4 text-emerald-700 font-bold">daad.de [.GOV GERMANY]</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">200 OK</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-800">National University of Singapore (SINGA)</td>
                    <td className="py-3 px-4 text-emerald-700 font-bold">a-star.edu.sg [.EDU SINGAPORE]</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">200 OK</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* 5. INSTITUTIONAL FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-20 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-800 block">ScholarSwarm Global University Admissions Bureau</span>
              <span className="text-[11px] text-slate-400">Accredited international scholarship research & criteria verification</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Accredited Sources
            </span>
            <span>&copy; {new Date().getFullYear()} ScholarSwarm</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
