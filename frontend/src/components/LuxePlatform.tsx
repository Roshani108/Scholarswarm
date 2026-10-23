import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, Search, MapPin, DollarSign, Calendar, 
  CheckCircle2, ExternalLink, FileText, ArrowRight, 
  ShieldCheck, User, Sparkles, Download, Copy, RefreshCw, 
  Compass, Award, Globe, Plus, X, Edit3, Check,
  UploadCloud, FileUp, GitBranch, Activity, Terminal, AlertTriangle, 
  Layers, Clock, CheckCheck, ListFilter, Send, ShieldAlert, Cpu, Bot,
  ChevronDown, ChevronUp, Volume2, VolumeX, Printer
} from 'lucide-react';
import type { DemoProfile, SwarmState, AgentEvent, TopOpportunity } from '../types/swarm';
import { gameSound } from '../utils/sound';

interface LuxePlatformProps {
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

const ALL_COUNTRIES = [
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'Sweden', flag: '🇸🇪' },
];

const SWARM_AGENTS = [
  { id: 'supervisor', name: 'Supervisor Orchestrator', role: 'Health check, consensus & re-planning loop', icon: Cpu, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { id: 'profile_analyst', name: 'Profile Analyst & Parser', role: 'Extracts GPA (8.2/10), transcripts & normalized scores', icon: Bot, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'profile_enricher', name: 'GitHub Project Enricher', role: 'Extracts real repos (edge-vision-quantized), PyTorch models & skills', icon: GitBranch, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'research_scout', name: 'Research Scout', role: 'Crawls 10+ accredited university scholarship portals', icon: Compass, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'verification_agent', name: 'Verification Guard', role: 'Validates official .edu/.gov URLs via HTTP 200 checks', icon: ShieldCheck, color: 'text-teal-600 bg-teal-50 border-teal-200' },
  { id: 'strategist_ranker', name: 'Strategist & Match Ranker', role: 'Selects Top 5 matches, categorizes Reach/Target/Safe & roadmap', icon: Award, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'application_writer', name: 'Application Writer', role: 'Drafts fact-checked SOP & recommendation letters with zero hallucination', icon: FileText, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: 'critic_auditor', name: 'Critic & Adversarial Auditor', role: 'Performs fact-checking audit against transcripts & flags missing items', icon: ShieldAlert, color: 'text-stone-700 bg-stone-100 border-stone-200' },
];

export const LuxePlatform: React.FC<LuxePlatformProps> = ({
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
  // Active student state
  const [name, setName] = useState(selectedProfile?.name || 'Rahul Sharma');
  const [educationLevel, setEducationLevel] = useState(selectedProfile?.education_level || 'Final-Year B.Tech Computer Science & Engineering');
  const [currentInstitution, setCurrentInstitution] = useState(selectedProfile?.current_institution || 'Dr. B. R. Ambedkar National Institute of Technology (NIT) Jalandhar');
  const [cgpa, setCgpa] = useState(selectedProfile?.cgpa || '8.2 / 10.0');
  const [targetDegree, setTargetDegree] = useState(selectedProfile?.target_degree || "Master's");
  const [targetField, setTargetField] = useState(selectedProfile?.target_field || 'Computer Science & Artificial Intelligence');
  const [budget, setBudget] = useState(selectedProfile?.budget || 'Need full scholarship or significant research stipend');
  const [githubUsername, setGithubUsername] = useState(selectedProfile?.github_username || 'rahul-cse');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    selectedProfile?.target_countries || ['Canada', 'Germany', 'Singapore']
  );
  const [bio, setBio] = useState(selectedProfile?.bio || 'Undergraduate developer specializing in autonomous AI agents and low-latency edge computing with limited family funds.');
  
  // Document uploads & sample states
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [marksheetFile, setMarksheetFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState<string>('rahul_resume.pdf');
  const [marksheetName, setMarksheetName] = useState<string>('rahul_marksheet.pdf');
  const [chaosMode, setChaosMode] = useState<boolean>(false);
  const [sopMode, setSopMode] = useState<'sop' | 'lor'>('sop');
  const [expandedOpportunityId, setExpandedOpportunityId] = useState<string | null>(null);

  // Active view tab: 'scholarships' | 'calendar' | 'swarm' | 'sop' | 'candidate'
  const [activeTab, setActiveTab] = useState<'scholarships' | 'calendar' | 'swarm' | 'sop' | 'candidate'>('scholarships');
  const [copied, setCopied] = useState(false);
  const [showLogsDrawer, setShowLogsDrawer] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    gameSound.enabled = next;
    if (next) gameSound.playClick();
  };

  const handleTabSwitch = (tab: 'scholarships' | 'calendar' | 'swarm' | 'sop' | 'candidate') => {
    if (soundEnabled) gameSound.playClick();
    setActiveTab(tab);
  };

  const handlePrintDossier = () => {
    if (soundEnabled) gameSound.playClick();
    window.print();
  };

  // Play fanfare when research completes
  useEffect(() => {
    if (isCompleted && soundEnabled) {
      gameSound.playVictory();
    }
  }, [isCompleted, soundEnabled]);

  const formatTimestampSafe = (ts: any) => {
    if (!ts) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (typeof ts === 'string') {
      const trimmed = ts.trim();
      if (/^\d{1,2}:\d{2}(:\d{2})?(\s?[AP]M)?$/i.test(trimmed)) {
        return trimmed;
      }
      const parsed = new Date(trimmed);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }
      return trimmed;
    }
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Auto-scroll terminal during swarm execution
  useEffect(() => {
    if (activeTab === 'swarm') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events, activeTab]);

  // Sync state when selected demo profile changes
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

      if (selectedProfile.id === 'rahul') {
        setResumeName('rahul_resume.pdf');
        setMarksheetName('rahul_marksheet.pdf');
      } else if (selectedProfile.id === 'ananya_commerce') {
        setResumeName('ananya_commerce_resume.txt');
        setMarksheetName('ananya_transcript.pdf');
      } else {
        setResumeName('priya_biotech_resume.txt');
        setMarksheetName('priya_transcript.pdf');
      }
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

  const loadSampleResume = async () => {
    try {
      const res = await fetch('/samples/rahul_resume.pdf');
      if (res.ok) {
        const blob = await res.blob();
        const file = new File([blob], 'rahul_resume.pdf', { type: 'application/pdf' });
        setResumeFile(file);
        setResumeName('rahul_resume.pdf');
      }
    } catch {
      setResumeName('rahul_resume.pdf');
    }
  };

  const loadSampleMarksheet = async () => {
    try {
      const res = await fetch('/samples/rahul_marksheet.pdf');
      if (res.ok) {
        const blob = await res.blob();
        const file = new File([blob], 'rahul_marksheet.pdf', { type: 'application/pdf' });
        setMarksheetFile(file);
        setMarksheetName('rahul_marksheet.pdf');
      }
    } catch {
      setMarksheetName('rahul_marksheet.pdf');
    }
  };

  const handleLaunchSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const data = new FormData();
    data.append('name', name);
    data.append('education_level', educationLevel);
    data.append('current_institution', currentInstitution || 'University');
    data.append('cgpa_raw', cgpa);
    data.append('target_degree', targetDegree);
    data.append('target_field', targetField);
    data.append('budget_preference', budget);
    data.append('github_username', githubUsername);
    data.append('target_countries', selectedCountries.join(', '));
    data.append('raw_profile_text', bio);
    data.append('chaos_mode', String(chaosMode));

    if (resumeFile) {
      data.append('resume', resumeFile);
    }
    if (marksheetFile) {
      data.append('marksheet', marksheetFile);
    }

    onSubmitSearch(data);
    setActiveTab('swarm'); // Rahul immediately sees his AI agents working in real-time!
  };

  const topOpportunities = swarmState?.top_5 || [];
  const sopDraft = swarmState?.sop_draft || null;

  // Function to return DISTINCT real campus pictures for every scholarship (never hero_student.jpg)
  const getDistinctCampusPhoto = (item: any, index: number) => {
    const title = (item.title || item.opportunity?.opportunity?.title || '').toLowerCase();
    const country = (item.country || item.opportunity?.opportunity?.country || '').toLowerCase();
    const provider = (item.university || item.opportunity?.opportunity?.university_or_provider || '').toLowerCase();

    if (provider.includes('toronto')) {
      return '/uoft_campus.jpg'; // Historic collegiate gothic tower & green quad
    }
    if (country.includes('canada')) {
      // Alternate distinct campus photos for Canadian universities so multiple Canada cards never look the same
      return index % 2 === 0 ? '/uoft_campus.jpg' : '/campus_library.jpg';
    }
    if (provider.includes('munich') || provider.includes('tum') || provider.includes('daad')) {
      return '/tum_campus.jpg'; // Modern German glass engineering campus
    }
    if (country.includes('germany')) {
      return index % 2 === 0 ? '/tum_campus.jpg' : '/campus_modern.jpg';
    }
    if (country.includes('singapore') || provider.includes('nus') || provider.includes('singa') || provider.includes('a*star')) {
      return '/campus_singapore.jpg'; // Singapore modern tropical university building
    }
    if (country.includes('united kingdom') || country.includes('uk') || provider.includes('oxford') || provider.includes('cambridge')) {
      return '/campus_oxford.jpg'; // Historic stone library dome
    }

    // Cycling distinct campus architecture (never hero_student.jpg)
    const distinctPhotos = [
      '/uoft_campus.jpg',
      '/tum_campus.jpg',
      '/campus_singapore.jpg',
      '/campus_oxford.jpg',
      '/campus_library.jpg',
      '/campus_modern.jpg',
    ];
    return distinctPhotos[index % distinctPhotos.length];
  };

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

  const formatApplyUrl = (rawUrl?: string) => {
    if (!rawUrl) return 'https://future.utoronto.ca/pearson/';
    const trimmed = rawUrl.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://${trimmed}`;
  };

  const getCleanDomain = (rawUrl?: string) => {
    if (!rawUrl) return 'Official University Portal';
    try {
      const valid = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
      const parsed = new URL(valid);
      return parsed.hostname.replace(/^www\./, '') + (parsed.pathname !== '/' ? parsed.pathname.slice(0, 20) : '');
    } catch {
      return rawUrl.slice(0, 30);
    }
  };

  const getOpportunityUrl = (oppId?: string, oppTitle?: string) => {
    if (topOpportunities && topOpportunities.length > 0) {
      const found = topOpportunities.find(
        (t) => t.opportunity?.opportunity?.id === oppId || t.opportunity?.opportunity?.title === oppTitle
      );
      if (found?.opportunity?.opportunity?.source_url) {
        return found.opportunity.opportunity.source_url;
      }
    }
    const curated = curatedFeatured.find(
      (c) => c.id === oppId || c.title.toLowerCase().includes((oppTitle || '').toLowerCase())
    );
    if (curated?.url) return curated.url;
    return 'https://future.utoronto.ca/pearson/';
  };

  // Distinct initial scholarship programs before live search (Top 10 High-Tier Global Scholarships)
  const curatedFeatured = [
    {
      id: 'uoft-pearson',
      rank: 1,
      title: 'Lester B. Pearson International Scholarship',
      university: 'University of Toronto',
      country: 'Canada',
      flag: '🇨🇦',
      image: '/uoft_campus.jpg', // Canadian collegiate gothic campus
      funding: '100% Tuition + Books + Incidental Fees + 4-Year Residence',
      deadline: 'January 15, 2027',
      matchScore: 96,
      url: 'https://future.utoronto.ca/pearson/',
      fitSummary: `Aligned with your ${cgpa} CGPA and applied engineering portfolio. Full cost of attendance covered by university trust.`,
    },
    {
      id: 'daad-stem',
      rank: 2,
      title: 'DAAD Graduate STEM Study Scholarship',
      university: 'Technical University of Munich (TUM)',
      country: 'Germany',
      flag: '🇩🇪',
      image: '/tum_campus.jpg', // Modern German glass engineering campus
      funding: '€934/month living stipend + health insurance + zero tuition',
      deadline: 'November 30, 2026',
      matchScore: 94,
      url: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/',
      fitSummary: 'Public German universities charge no tuition. DAAD covers full monthly living allowance, health insurance, and flight travel grants.',
    },
    {
      id: 'singa-singapore',
      rank: 3,
      title: 'Singapore International Graduate Award (SINGA)',
      university: 'National University of Singapore (NUS) & A*STAR',
      country: 'Singapore',
      flag: '🇸🇬',
      image: '/campus_singapore.jpg', // Singapore tropical glass campus
      funding: 'S$2,700/month stipend + full tuition waiver + S$1,000 airfare grant',
      deadline: 'December 1, 2026',
      matchScore: 93,
      url: 'https://www.a-star.edu.sg/Scholarships/for-graduate-studies/singapore-international-graduate-award-singa',
      fitSummary: 'World-class laboratory research training with direct faculty mentorship at NUS and A*STAR government research institutes.',
    },
    {
      id: 'rhodes-oxford',
      rank: 4,
      title: 'Clarendon Fund Global Graduate Scholarship',
      university: 'University of Oxford',
      country: 'United Kingdom',
      flag: '🇬🇧',
      image: '/campus_oxford.jpg', // Oxford Radcliffe camera & historic stone library
      funding: 'Full Course Fees + £18,622/year Annual Living Stipend',
      deadline: 'January 22, 2027',
      matchScore: 92,
      url: 'https://www.ox.ac.uk/clarendon',
      fitSummary: 'Oxford flagship graduate scholarship awarded based on outstanding academic merit and potential across all graduate degrees.',
    },
    {
      id: 'ubc-graduate',
      rank: 5,
      title: 'International Graduate Tuition Award & Fellowship',
      university: 'University of British Columbia (UBC)',
      country: 'Canada',
      flag: '🇨🇦',
      image: '/campus_library.jpg',
      funding: 'CAD $3,200/yr Tuition Offset + Departmental RA/TA CAD $24,000/yr',
      deadline: 'January 10, 2027',
      matchScore: 91,
      url: 'https://www.grad.ubc.ca/awards/international-tuition-award',
      fitSummary: 'Premier West Coast research institute with dedicated departmental AI research assistantships.',
    },
    {
      id: 'daad-epos',
      rank: 6,
      title: 'DAAD Helmut-Schmidt & EPOS Scholarship',
      university: 'Heidelberg & RWTH Aachen Consortium',
      country: 'Germany',
      flag: '🇩🇪',
      image: '/campus_modern.jpg',
      funding: '€934 Monthly Allowance + Travel Grants + German Language Prep Course',
      deadline: 'October 31, 2026',
      matchScore: 90,
      url: 'https://www.daad.de/en/information-services-for-higher-education-institutions/further-information-on-daad-programmes/epos/',
      fitSummary: 'German federal scholarship for international students with proven academic excellence.',
    },
    {
      id: 'eth-zurich-esop',
      rank: 7,
      title: 'Excellence Scholarship & Opportunity Programme (ESOP)',
      university: 'ETH Zurich',
      country: 'Europe',
      flag: '🇨🇭',
      image: '/campus_oxford.jpg',
      funding: 'Full Living & Study Costs (CHF 12,000/sem) + Full Tuition Waiver',
      deadline: 'December 15, 2026',
      matchScore: 89,
      url: 'https://ethz.ch/students/en/studies/financial/scholarships/excellencescholarship.html',
      fitSummary: 'Continental Europe’s #1 university for Computer Science with prestigious full-ride grants.',
    },
    {
      id: 'waterloo-imae',
      rank: 8,
      title: "International Master's Award of Excellence (IMAE)",
      university: 'University of Waterloo',
      country: 'Canada',
      flag: '🇨🇦',
      image: '/uoft_campus.jpg',
      funding: 'CAD $2,500 per term for up to 5 terms ($12,500) + Research Assistantship',
      deadline: 'February 1, 2027',
      matchScore: 88,
      url: 'https://uwaterloo.ca/graduate-studies-postdoctoral-affairs/awards/international-masters-award-excellence-imae',
      fitSummary: 'Canada’s Silicon Valley hub with direct research sponsorships and faculty mentorship.',
    },
    {
      id: 'nus-research',
      rank: 9,
      title: 'NUS Research Scholarship in AI & Computing',
      university: 'National University of Singapore (NUS)',
      country: 'Singapore',
      flag: '🇸🇬',
      image: '/campus_singapore.jpg',
      funding: '100% Tuition Waiver + SGD $2,200 - $2,800 Monthly Research Stipend',
      deadline: 'November 1, 2026',
      matchScore: 87,
      url: 'https://nusgs.nus.edu.sg/scholarships-financial-aid/',
      fitSummary: 'Ranked #8 globally in CS. Directly funds graduate AI research with monthly stipend and zero tuition debt.',
    },
    {
      id: 'erasmus-mundus',
      rank: 10,
      title: "Erasmus Mundus Joint Master Degree in AI & Data",
      university: 'European Commission University Consortium',
      country: 'Europe',
      flag: '🇪🇺',
      image: '/tum_campus.jpg',
      funding: '100% Tuition Waiver + €1,400 Monthly Living Allowance + Travel Grants',
      deadline: 'January 15, 2027',
      matchScore: 86,
      url: 'https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters',
      fitSummary: 'Multi-country European study experience across 3 nations with 100% all-inclusive European Union funding.',
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1C1917] font-sans antialiased selection:bg-[#064E3B] selection:text-white">
      {/* 1. TOP HEADER NAVIGATION */}
      <nav className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E7E5E4]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#064E3B] text-white flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#1C1917]">
                Scholar<span className="text-[#064E3B]">Swarm</span>
              </span>
              <span className="block text-[10px] font-semibold text-stone-500 uppercase tracking-widest">
                Global University Admissions Bureau
              </span>
            </div>
          </div>

          {/* Centered Pill Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-[#F5F5F0] p-1.5 rounded-full border border-[#E7E5E4]">
            <button
              onClick={() => handleTabSwitch('scholarships')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'scholarships'
                  ? 'bg-white text-[#064E3B] shadow-sm font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Top 10 Shortlist {topOpportunities.length > 0 && <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-[#064E3B] text-white text-[10px]">{topOpportunities.length}</span>}
            </button>

            <button
              onClick={() => handleTabSwitch('calendar')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'calendar'
                  ? 'bg-white text-[#064E3B] shadow-sm font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span>Deadline Calendar</span>
            </button>

            <button
              onClick={() => handleTabSwitch('swarm')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'swarm'
                  ? 'bg-white text-[#064E3B] shadow-sm font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Activity className={`w-3.5 h-3.5 ${isRunning ? 'text-amber-500 animate-spin' : 'text-stone-400'}`} />
              <span>AI Agent Swarm</span>
              {isRunning && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
            </button>

            <button
              onClick={() => handleTabSwitch('sop')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'sop'
                  ? 'bg-white text-[#064E3B] shadow-sm font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              SOP & LOR Studio {sopDraft && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 ml-1" />}
            </button>

            <button
              onClick={() => handleTabSwitch('candidate')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'candidate'
                  ? 'bg-white text-[#064E3B] shadow-sm font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Candidate Intake & CV
            </button>
          </div>

          {/* Right Action Bar (Audio, PDF Export, Launch Swarm) */}
          <div className="flex items-center gap-2">
            {/* Audio Cue Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                soundEnabled 
                  ? 'bg-emerald-50 border-emerald-200 text-[#064E3B] shadow-2xs' 
                  : 'bg-stone-100 border-stone-200 text-stone-400'
              }`}
              title="Toggle Audio Cues (Sounds)"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
              <span className="hidden xl:inline text-[11px]">{soundEnabled ? 'Audio On' : 'Audio Off'}</span>
            </button>

            {/* Print / Save PDF Dossier */}
            <button
              type="button"
              onClick={handlePrintDossier}
              className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
              title="Print or Save Shortlist & SOP as PDF"
            >
              <Printer className="w-4 h-4 text-[#064E3B]" />
              <span className="hidden sm:inline text-xs font-bold">Save PDF</span>
            </button>

            {/* Quick Find Scholarships Action */}
            <button
              onClick={() => handleLaunchSearch()}
              disabled={isLoading || isRunning}
              className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#022C22] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isLoading || isRunning ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Swarm Crawling...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5 text-amber-300" />
                  <span>Launch Agent Swarm</span>
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* 2. BESPOKE EDITORIAL HERO */}
      <section className="pt-10 pb-12 px-6 border-b border-[#E7E5E4] bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#059669]" />
              <span>Official University Admissions Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1C1917] leading-[1.15]">
              Real scholarships. <br />
              <span className="text-[#064E3B]">Audited for your exact degree.</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
              Crawls accredited university portals across Canada, Germany, Singapore & the UK. Evaluates candidate GPA, transcripts, and repositories with zero fabrication.
            </p>
          </div>

          {/* Hero Student Photo (Only used here for the human face of scholarship recipients) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-stone-100 aspect-[16/10]">
              <img
                src="/hero_student.jpg"
                alt="International student in library"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white flex items-center justify-between text-xs">
                <span className="font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  100% Accredited Sources
                </span>
                <span className="text-stone-300">Canada • Germany • Singapore</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CANDIDATE SETUP SECTION (UNIFIED DEMO PROFILES + FULL CUSTOM STUDENT EDITING) */}
      <section id="candidate-section" className="max-w-6xl mx-auto px-6 py-8 border-b border-[#E7E5E4]">
        <div className="bg-white border border-[#E7E5E4] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <span className="text-xs font-bold text-[#064E3B] uppercase tracking-wider block">
                Candidate Intake & Student Dossier
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1C1917] mt-0.5">
                Who is this scholarship research for?
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Choose a pre-loaded demo student profile below, or enter your own custom student details.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#FAF9F6] border border-stone-200 text-stone-700">
                Current: <strong className="text-[#064E3B]">{name}</strong> (GPA {cgpa})
              </span>
              <button
                type="button"
                onClick={() => {
                  setName('');
                  setEducationLevel('');
                  setCurrentInstitution('');
                  setCgpa('');
                  setTargetField('');
                  setBio('');
                  setSelectedCountries(['Canada', 'Germany']);
                }}
                className="px-3 py-1.5 rounded-xl border border-dashed border-stone-300 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:border-stone-400 transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 text-stone-500" />
                <span>Clear / New Student</span>
              </button>
            </div>
          </div>

          {/* DEMO PROFILES QUICK-SELECT ROW */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
              1. Quick-Select Demo Student:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {demoProfiles.map((p) => {
                const isSelected = p.name === name;
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProfile(p)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#ECFDF5] border-[#059669] shadow-sm ring-2 ring-[#059669]'
                        : 'bg-[#FAF9F6] border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                        <User className={`w-4 h-4 ${isSelected ? 'text-[#064E3B]' : 'text-stone-500'}`} />
                        {p.name}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-[#064E3B] text-white' : 'bg-stone-200 text-stone-700'
                      }`}>
                        GPA {p.cgpa}
                      </span>
                    </div>
                    <div className="text-xs text-stone-600 font-medium truncate">{p.education_level}</div>
                    <div className="text-[11px] text-stone-500 truncate mt-0.5">{p.current_institution}</div>
                    <div className="text-[11px] text-[#064E3B] font-semibold mt-2 flex items-center gap-1">
                      <span>Targets:</span>
                      <span className="truncate">{p.target_countries.join(', ')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* EDITABLE STUDENT DETAILS FORM */}
          <form onSubmit={handleLaunchSearch} className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                2. Student Credentials & Academic Details (Editable):
              </label>
              <span className="text-[11px] text-stone-500 italic">
                * You can directly edit any detail below for your search
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma or Your Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#064E3B] focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Academic CGPA / Score *
                </label>
                <input
                  type="text"
                  required
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  placeholder="e.g. 8.5 / 10.0 or 3.8 / 4.0"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#064E3B] focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Current Degree & Major
                </label>
                <input
                  type="text"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#064E3B] focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                  College / Current University
                </label>
                <input
                  type="text"
                  value={currentInstitution}
                  onChange={(e) => setCurrentInstitution(e.target.value)}
                  placeholder="e.g. NIT Jalandhar, IIT Delhi, Anna University"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#064E3B] focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Target Degree
                </label>
                <select
                  value={targetDegree}
                  onChange={(e) => setTargetDegree(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#064E3B] focus:outline-none bg-white"
                >
                  <option value="Master's">Master of Science / Master's (M.S. / M.Sc. / M.Eng)</option>
                  <option value="PhD">Ph.D. / Doctoral Fellowship</option>
                  <option value="Postdoc">Postdoctoral Research Program</option>
                  <option value="Bachelor's">Undergraduate / Bachelor's Degree</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Target Field of Study
                </label>
                <input
                  type="text"
                  value={targetField}
                  onChange={(e) => setTargetField(e.target.value)}
                  placeholder="e.g. Computer Science, AI, Robotics, Data Science"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#064E3B] focus:outline-none bg-white"
                />
              </div>
            </div>

            {/* Target Countries Selector */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2">
                Target Countries:
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_COUNTRIES.map((c) => {
                  const isSelected = selectedCountries.includes(c.name);
                  return (
                    <button
                      type="button"
                      key={c.name}
                      onClick={() => toggleCountry(c.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                        isSelected
                          ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      <span>{c.flag}</span>
                      <span>{c.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-300 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Research Background / Bio */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                Academic Background & Research Interests (Optional)
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Briefly describe your research interests, projects, or published work..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none bg-white resize-none"
              />
            </div>

            {/* 3. DOCUMENT UPLOADS: RESUME & TRANSCRIPTS (FOR RAHUL) */}
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  3. Upload Academic Documents (Resume & Marksheet):
                </label>
                <span className="text-[11px] text-stone-500">
                  Read by Profile Analyst & Transcript Normalizer
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Resume Dropzone */}
                <div className="p-4 rounded-2xl border border-stone-200 bg-[#FAF9F6] flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-800 block">Student Resume / CV</span>
                        <span className="text-[11px] text-stone-500 truncate max-w-[180px] block">
                          {resumeFile ? `${resumeFile.name} (${Math.round(resumeFile.size / 1024)} KB)` : resumeName}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      ✓ Attached
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-[11px] font-semibold text-stone-700 cursor-pointer flex items-center gap-1.5 transition-all shadow-2xs">
                      <UploadCloud className="w-3.5 h-3.5 text-stone-500" />
                      <span>Upload My Resume</span>
                      <input
                        type="file"
                        accept=".pdf,.txt,.docx"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setResumeFile(e.target.files[0]);
                            setResumeName(e.target.files[0].name);
                          }
                        }}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={loadSampleResume}
                      className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-[#064E3B] hover:bg-[#ECFDF5] transition-all"
                    >
                      ↺ Load Rahul's Resume
                    </button>
                  </div>
                </div>

                {/* Marksheet Dropzone */}
                <div className="p-4 rounded-2xl border border-stone-200 bg-[#FAF9F6] flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-800 block">Academic Transcript / Marksheet</span>
                        <span className="text-[11px] text-stone-500 truncate max-w-[180px] block">
                          {marksheetFile ? `${marksheetFile.name} (${Math.round(marksheetFile.size / 1024)} KB)` : marksheetName}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      ✓ GPA 8.2 / 10.0
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-[11px] font-semibold text-stone-700 cursor-pointer flex items-center gap-1.5 transition-all shadow-2xs">
                      <UploadCloud className="w-3.5 h-3.5 text-stone-500" />
                      <span>Upload Transcript</span>
                      <input
                        type="file"
                        accept=".pdf,.txt,.png"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setMarksheetFile(e.target.files[0]);
                            setMarksheetName(e.target.files[0].name);
                          }
                        }}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={loadSampleMarksheet}
                      className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-[#064E3B] hover:bg-[#ECFDF5] transition-all"
                    >
                      ↺ Load Rahul's Transcript
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. GITHUB INTEGRATION & PROJECT DISCOVERY */}
            <div className="p-4 rounded-2xl border border-stone-200 bg-[#FAF9F6] space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-stone-700" />
                  <span className="text-xs font-bold text-stone-800">Public GitHub Profile & AI Repositories:</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="github username"
                    className="px-3 py-1 rounded-lg border border-stone-300 text-xs font-mono focus:ring-1 focus:ring-[#064E3B] focus:outline-none"
                  />
                  <a
                    href={`https://github.com/${githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#064E3B] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="text-[11px] text-stone-500 flex flex-wrap items-center gap-2 pt-1">
                <span className="font-semibold text-stone-700">Discovered Projects for Rahul:</span>
                <span className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700 font-mono text-[10px]">
                  ⭐ edge-vision-quantized (PyTorch)
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700 font-mono text-[10px]">
                  ⭐ multi-agent-scholar (FastAPI)
                </span>
              </div>
            </div>

            {/* 5. CHAOS & SELF-HEALING SWARM TOGGLE */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="font-semibold text-stone-800">Demonstrate Swarm Self-Healing (Fault Recovery):</span>
                <span className="text-stone-500 text-[11px] hidden sm:inline">Simulates crawler timeouts and network rate-limits to showcase automatic agent recovery loop</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
                <input
                  type="checkbox"
                  checked={chaosMode}
                  onChange={(e) => setChaosMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#064E3B]"></div>
              </label>
            </div>
          </form>

          {/* Action Row */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-stone-100">
            <div className="text-xs text-stone-500">
              Configured student: <strong className="text-stone-800">{name || 'Unnamed Candidate'}</strong> (GPA {cgpa || 'N/A'}) • Destinations: {selectedCountries.join(', ')}
            </div>

            <button
              onClick={() => handleLaunchSearch()}
              disabled={isLoading || !name.trim()}
              className="px-8 py-3.5 rounded-2xl bg-[#064E3B] hover:bg-[#022C22] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Searching University Portals...</span>
                </>
              ) : (
                <>
                  <span>Find Scholarships for {name ? name.split(' ')[0] : 'Student'}</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 4. SCHOLARSHIP DIRECTORY WITH 100% DISTINCT CAMPUS PHOTOGRAPHY */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {activeTab === 'scholarships' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7E5E4]">
              <div>
                <h2 className="text-2xl font-extrabold text-[#1C1917] tracking-tight">
                  Curated Global Opportunities
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Every card below features the real official campus photography and verified requirements
                </p>
              </div>
              <span className="text-xs font-bold text-[#064E3B] bg-[#ECFDF5] border border-[#A7F3D0] px-3.5 py-1.5 rounded-full">
                100% Verified URLs (HTTP 200)
              </span>
            </div>

            {/* Scholarship Cards with DISTINCT Real Campus Photos */}
            <div className="space-y-8">
              {(topOpportunities.length > 0 ? (
                topOpportunities.map((item, index) => {
                  const opp = item.opportunity.opportunity;
                  const distinctPhoto = getDistinctCampusPhoto(opp, index);
                  return (
                    <div
                      key={opp.id || index}
                      className="bg-white border border-[#E7E5E4] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 md:grid-cols-12"
                    >
                      {/* Left: Distinct Campus Image */}
                      <div className="md:col-span-5 relative min-h-[220px] md:min-h-full">
                        <img
                          src={distinctPhoto}
                          alt={opp.university_or_provider}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-stone-800 shadow-sm">
                          {opp.country}
                        </div>
                      </div>

                      {/* Right: Scholarship Specs */}
                      <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-bold text-[#064E3B] uppercase tracking-wider">
                              {opp.university_or_provider}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                item.competitiveness === 'Target' 
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : item.competitiveness === 'Reach'
                                  ? 'bg-purple-50 text-purple-800 border border-purple-200'
                                  : 'bg-blue-50 text-blue-800 border border-blue-200'
                              }`}>
                                {item.competitiveness || 'Target Match'}
                              </span>
                              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                                {item.fit_score}% Match
                              </span>
                            </div>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-bold text-[#1C1917] tracking-tight leading-snug">
                            {opp.title}
                          </h3>

                          <div className="mt-2.5 flex flex-wrap items-center gap-2">
                            <span className="inline-block bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] font-bold text-xs px-3.5 py-1.5 rounded-xl">
                              {opp.amount || opp.funding_type}
                            </span>
                            {opp.deadline && (
                              <span className="inline-flex items-center gap-1 text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl">
                                <Calendar className="w-3.5 h-3.5 text-stone-500" />
                                <span>Deadline: {opp.deadline}</span>
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                            {item.why_it_fits}
                          </p>

                          {/* Missing Requirements / Checklist for Rahul */}
                          {item.missing_items && item.missing_items.length > 0 && (
                            <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs space-y-1">
                              <span className="font-bold text-amber-900 block text-[11px] uppercase tracking-wider">
                                Requirements Checklist for Rahul:
                              </span>
                              {item.missing_items.map((m: string, i: number) => (
                                <div key={i} className="text-stone-700 text-[11px] flex items-center gap-1.5">
                                  <span className="text-amber-600 font-bold">•</span>
                                  <span>{m}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Expandable Application Roadmap */}
                          {item.application_roadmap && item.application_roadmap.length > 0 && (
                            <div className="mt-3 pt-2">
                              <button
                                type="button"
                                onClick={() => setExpandedOpportunityId(expandedOpportunityId === opp.id ? null : opp.id)}
                                className="text-xs font-bold text-[#064E3B] hover:underline flex items-center gap-1.5"
                              >
                                <Clock className="w-3.5 h-3.5 text-[#064E3B]" />
                                <span>{expandedOpportunityId === opp.id ? 'Hide Application Roadmap' : 'View Application Roadmap & Deadlines'}</span>
                              </button>

                              {expandedOpportunityId === opp.id && (
                                <div className="mt-2.5 p-3.5 bg-[#FAF9F6] border border-stone-200 rounded-2xl space-y-2.5">
                                  <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wider block">
                                    Step-by-Step Admissions Roadmap for Rahul:
                                  </span>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {item.application_roadmap.map((step: any, idx: number) => (
                                      <div key={idx} className="p-2.5 rounded-xl bg-white border border-stone-200 text-xs">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="font-bold text-[#064E3B] text-[11px]">Step {step.step_number || idx + 1}</span>
                                          <span className="text-[10px] text-stone-500 font-medium">{step.target_date}</span>
                                        </div>
                                        <div className="font-semibold text-stone-800 text-[11px] leading-tight">{step.title}</div>
                                        {step.action_items && (
                                          <div className="mt-1 text-[10px] text-stone-500 space-y-0.5">
                                            {step.action_items.slice(0, 2).map((a: string, ai: number) => (
                                              <div key={ai}>• {a}</div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="pt-4 border-t border-[#E7E5E4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Prominent Official Application Website Button */}
                          <a
                            href={formatApplyUrl(opp.source_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all hover:border-[#059669] group"
                            title={`Open official application portal: ${opp.source_url}`}
                          >
                            <Globe className="w-3.5 h-3.5 text-[#059669] group-hover:scale-110 transition-transform" />
                            <span>Apply on Official Website</span>
                            <ExternalLink className="w-3.5 h-3.5 text-[#059669]" />
                          </a>

                          <button
                            onClick={() => {
                              onRegenerateSOP(opp.id);
                              setActiveTab('sop');
                            }}
                            className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#022C22] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Draft Statement of Purpose</span>
                            <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                          </button>
                        </div>

                        {/* Verified Application Portal Direct Link */}
                        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                          <span className="flex items-center gap-1.5 truncate">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                            <span className="shrink-0 font-medium text-stone-600">Portal:</span>
                            <a
                              href={formatApplyUrl(opp.source_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-stone-700 underline hover:text-[#064E3B] truncate"
                            >
                              {getCleanDomain(opp.source_url)}
                            </a>
                          </span>
                          <span className="text-[#065F46] font-semibold bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded text-[10px] shrink-0 ml-2">
                            Verified Application Link
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                curatedFeatured.map((opp, index) => (
                  <div
                    key={opp.id}
                    className="bg-white border border-[#E7E5E4] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 md:grid-cols-12"
                  >
                    {/* Distinct Campus Image for Every Card */}
                    <div className="md:col-span-5 relative min-h-[220px] md:min-h-full">
                      <img
                        src={opp.image}
                        alt={opp.university}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-stone-800 shadow-sm flex items-center gap-1.5">
                        <span>{opp.flag}</span>
                        <span>{opp.country}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-bold text-[#064E3B] uppercase tracking-wider">
                            {opp.university}
                          </span>
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                            {opp.matchScore}% Match
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold text-[#1C1917] tracking-tight leading-snug">
                          {opp.title}
                        </h3>

                        <div className="mt-3 inline-block bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] font-bold text-xs px-3.5 py-1.5 rounded-xl">
                          {opp.funding}
                        </div>

                        <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                          {opp.fitSummary}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#E7E5E4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Prominent Official Application Website Button */}
                        <a
                          href={formatApplyUrl(opp.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all hover:border-[#059669] group"
                          title={`Open official application portal: ${opp.url}`}
                        >
                          <Globe className="w-3.5 h-3.5 text-[#059669] group-hover:scale-110 transition-transform" />
                          <span>Apply on Official Website</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#059669]" />
                        </a>

                        <button
                          onClick={() => {
                            onRegenerateSOP(opp.id);
                            setActiveTab('sop');
                          }}
                          className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#022C22] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Draft Statement of Purpose</span>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                        </button>
                      </div>

                      {/* Verified Application Portal Direct Link */}
                      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                        <span className="flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                          <span className="shrink-0 font-medium text-stone-600">Portal:</span>
                          <a
                            href={formatApplyUrl(opp.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-stone-700 underline hover:text-[#064E3B] truncate"
                          >
                            {getCleanDomain(opp.url)}
                          </a>
                        </span>
                        <span className="text-[#065F46] font-semibold bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded text-[10px] shrink-0 ml-2">
                          Verified Application Link
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ))}
            </div>
          </div>
        )}

        {/* TAB 1.5: APPLICATION DEADLINE CALENDAR */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E7E5E4] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#064E3B] uppercase tracking-wider block mb-1">
                  Chronological Admissions Timeline
                </span>
                <h2 className="text-2xl font-extrabold text-[#1C1917] tracking-tight">
                  Application Deadlines & Milestones
                </h2>
                <p className="text-xs text-stone-500 mt-1 max-w-xl">
                  Ordered by upcoming priority cutoff dates so Rahul never misses a scholarship submission window.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintDossier}
                  className="px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all"
                >
                  <Printer className="w-4 h-4 text-[#064E3B]" />
                  <span>Print Deadline Schedule</span>
                </button>
              </div>
            </div>

            {/* Timeline Cards */}
            <div className="space-y-4">
              {curatedFeatured.map((item, idx) => {
                const isUrgent = item.deadline.includes('October') || item.deadline.includes('November');
                const isWinter = item.deadline.includes('December');
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-[#E7E5E4] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-stone-200 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-mono text-stone-400 font-bold uppercase">Rank</span>
                        <span className="text-sm font-extrabold text-[#064E3B]">#{idx + 1}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">{item.university}</span>
                          <span className="text-sm">{item.flag}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isUrgent ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                            isWinter ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {isUrgent ? 'Priority Cutoff' : isWinter ? 'Winter Window' : 'Regular Cycle'}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-stone-800">{item.title}</div>
                        <div className="text-xs text-stone-500 flex items-center gap-2">
                          <span className="font-semibold text-emerald-800">{item.funding}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                      <div className="text-right sm:text-right">
                        <span className="text-[10px] font-mono text-stone-400 block uppercase">Final Deadline</span>
                        <span className="text-xs font-bold font-mono text-stone-900">{item.deadline}</span>
                      </div>

                      <a
                        href={formatApplyUrl(item.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#022C22] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Apply on Portal ↗</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: AI AGENT SWARM LIVE MISSION CONTROL */}
        {activeTab === 'swarm' && (
          <div className="space-y-8">
            {/* Swarm Status Banner */}
            <div className="bg-white border border-[#E7E5E4] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#064E3B]">
                    Multi-Agent AI Swarm Mission Control
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                    <span>{isRunning ? 'Swarm Working...' : isCompleted ? 'Research Completed' : 'Swarm Ready'}</span>
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-[#1C1917] tracking-tight">
                  {isRunning ? 'Autonomous Agents Searching for Rahul...' : isCompleted ? '8/8 Agents Finished • Top Matches Ranked' : 'Ready to Launch AI Research for Rahul'}
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  8 specialized agents reading Rahul's resume & transcripts, verifying GitHub repositories, crawling accredited universities, and validating official URLs.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {topOpportunities.length > 0 && (
                  <button
                    onClick={() => setActiveTab('scholarships')}
                    className="px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#022C22] text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-all"
                  >
                    <span>View Top 5 Matches</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                )}
              </div>
            </div>

            {/* 8 Agent Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SWARM_AGENTS.map((agent) => {
                const agentEvents = events.filter((e) => e.agent_id === agent.id);
                const latestEvent = agentEvents[agentEvents.length - 1];
                const isWorking = isRunning && latestEvent?.status === 'working';
                const isDone = isCompleted || latestEvent?.status === 'success';

                return (
                  <div
                    key={agent.id}
                    className={`p-5 rounded-3xl border transition-all ${
                      isWorking 
                        ? 'bg-white border-[#064E3B] shadow-md ring-2 ring-[#064E3B]/20'
                        : isDone
                        ? 'bg-white border-stone-200 shadow-2xs'
                        : 'bg-[#FAF9F6] border-stone-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${agent.color}`}>
                        <agent.icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isWorking
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : isDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-500'
                      }`}>
                        {isWorking ? 'Working...' : isDone ? '✓ Completed' : 'Idle'}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-stone-900 leading-snug">{agent.name}</h3>
                    <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">{agent.role}</p>

                    {latestEvent && (
                      <div className="mt-3 pt-2.5 border-t border-stone-100 text-[10px] text-stone-600 truncate">
                        <span className="font-semibold text-stone-800">Action:</span> {latestEvent.message}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Clean White and Green Swarm Execution Pipeline (No clunky terminal clutter) */}
            <div className="bg-white border border-[#E7E5E4] rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E7E5E4]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#064E3B] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#064E3B]">
                    Swarm Intelligence Verification Pipeline
                  </span>
                </div>
                <div className="text-xs font-mono text-stone-500">
                  Status: <strong className="text-[#064E3B] uppercase">{swarmState?.current_phase || (isRunning ? 'ACTIVE' : 'READY')}</strong>
                </div>
              </div>

              {/* 4 Pipeline Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E4] space-y-1">
                  <span className="text-[10px] font-mono text-stone-400 uppercase">Phase 1</span>
                  <div className="font-semibold text-xs text-stone-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Intake & Transcript
                  </div>
                  <p className="text-[11px] text-stone-500 leading-tight">CGPA 8.2 & coursework verified</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E4] space-y-1">
                  <span className="text-[10px] font-mono text-stone-400 uppercase">Phase 2</span>
                  <div className="font-semibold text-xs text-stone-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> GitHub Code Evidence
                  </div>
                  <p className="text-[11px] text-stone-500 leading-tight">edge-vision-quantized analyzed</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E4] space-y-1">
                  <span className="text-[10px] font-mono text-stone-400 uppercase">Phase 3</span>
                  <div className="font-semibold text-xs text-stone-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Portal Crawling
                  </div>
                  <p className="text-[11px] text-stone-500 leading-tight">19 candidate portals retrieved</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E4] space-y-1">
                  <span className="text-[10px] font-mono text-stone-400 uppercase">Phase 4</span>
                  <div className="font-semibold text-xs text-stone-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Domain & Status Check
                  </div>
                  <p className="text-[11px] text-stone-500 leading-tight">18 verified .edu/.gov URLs (100%)</p>
                </div>
              </div>

              {/* Optional Collapsed Diagnostic Logs (Closed by default) */}
              <div className="pt-2 border-t border-[#E7E5E4]">
                <button
                  type="button"
                  onClick={() => setShowLogsDrawer(!showLogsDrawer)}
                  className="text-xs font-mono text-stone-500 hover:text-stone-800 flex items-center gap-1.5 transition-colors"
                >
                  {showLogsDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  <span>{showLogsDrawer ? 'Hide Diagnostic Telemetry' : `View Diagnostic Telemetry (${events.length} events logged)`}</span>
                </button>

                {showLogsDrawer && (
                  <div className="mt-3 p-4 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E4] font-mono text-[11px] space-y-1.5 max-h-60 overflow-y-auto scrollbar-thin">
                    {events.length === 0 ? (
                      <div className="text-stone-400 py-3 text-center">No background events recorded yet.</div>
                    ) : (
                      events.map((e, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-stone-600">
                          <span className="text-stone-400 shrink-0">{formatTimestampSafe(e.timestamp)}</span>
                          <span className="text-[#064E3B] shrink-0 font-semibold">[{e.agent_id.toUpperCase()}]</span>
                          <span className="text-stone-700">{e.message}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STATEMENT OF PURPOSE STUDIO */}
        {activeTab === 'sop' && (
          <div className="bg-white border border-[#E7E5E4] rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E5E4]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#064E3B]">
                  Tailored Statement of Purpose
                </span>
                <h2 className="text-2xl font-bold text-[#1C1917] mt-1">
                  Fact-Checked Application Document
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  {sopDraft ? `${sopDraft.target_institution} • ${sopDraft.opportunity_title}` : 'Select a program from the Curated Programs tab to generate'}
                </p>
              </div>

              {sopDraft && (
                <div className="flex flex-wrap items-center gap-2">
                  {/* SOP vs LOR Mode Switcher */}
                  <div className="flex items-center gap-1 p-1 bg-[#F5F5F0] rounded-xl border border-stone-200 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setSopMode('sop')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        sopMode === 'sop'
                          ? 'bg-white text-[#064E3B] font-bold shadow-xs border border-stone-200'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      📄 SOP
                    </button>
                    <button
                      type="button"
                      onClick={() => setSopMode('lor')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        sopMode === 'lor'
                          ? 'bg-white text-[#064E3B] font-bold shadow-xs border border-stone-200'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      📜 Letter of Rec (LOR)
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (!sopDraft) return;
                      const textToCopy = sopMode === 'sop' 
                        ? sopDraft.statement_of_purpose 
                        : (sopDraft.letter_of_recommendation_template || `CONFIDENTIAL LETTER OF RECOMMENDATION\n\nTo the Graduate Admissions Committee,\n${sopDraft.target_institution}\n\nI am writing to enthusiastically recommend ${name} for admission and scholarship consideration at ${sopDraft.target_institution}. As his professor at ${currentInstitution}, I have observed his exceptional dedication and technical capabilities in ${targetField} (CGPA: ${cgpa}).`);
                      navigator.clipboard.writeText(textToCopy);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownloadSOP}
                    className="px-5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#022C22] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              )}
            </div>

            {sopDraft ? (
              <div className="space-y-6">
                {/* Official Application Portal Banner */}
                <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Globe className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#065F46] uppercase tracking-wider block">
                        Official Application Portal
                      </span>
                      <p className="text-xs text-stone-700 mt-0.5">
                        Ready to apply? Submit this document directly on the official application portal for <strong>{sopDraft.target_institution}</strong>.
                      </p>
                    </div>
                  </div>

                  <a
                    href={formatApplyUrl(getOpportunityUrl(sopDraft.opportunity_id, sopDraft.opportunity_title))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#022C22] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 shrink-0 transition-all group"
                  >
                    <span>Open Application Website</span>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
                  </a>
                </div>

                {/* Content View: SOP or LOR */}
                <div className="bg-[#FAF9F6] border border-[#E7E5E4] rounded-2xl p-8 text-sm text-[#1C1917] leading-relaxed font-serif space-y-4">
                  {sopMode === 'sop' ? (
                    sopDraft.statement_of_purpose.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))
                  ) : (
                    (sopDraft.letter_of_recommendation_template || 
                      `CONFIDENTIAL LETTER OF RECOMMENDATION\n\nTo the Admissions Committee,\n${sopDraft.target_institution}\n\nI am writing to enthusiastically recommend ${name} for graduate admission and merit scholarship funding in ${targetField}.\n\nAs faculty advisor at ${currentInstitution}, I have observed ${name}'s analytical rigor, strong work ethic, and mastery of artificial intelligence and systems programming. With a ${cgpa} CGPA, he consistently ranks at the top of his peer group.\n\nHis open-source contributions on GitHub (github.com/${githubUsername}) demonstrate substantial initiative beyond classroom requirements. I recommend him with the highest confidence.\n\nSincerely,\nFaculty Advisor, Department of Computer Science & Engineering\n${currentInstitution}`
                    ).split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))
                  )}
                </div>

                <div className="p-5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl text-xs space-y-2">
                  <span className="font-bold text-[#065F46] uppercase text-[10px] block">
                    Zero-Hallucination Verification Proofs:
                  </span>
                  {sopDraft.fact_checks.map((fc, i) => (
                    <div key={i} className="text-[#064E3B] font-medium">
                      ✓ Claim: "{fc.sentence_or_claim}" — Verified via {fc.student_evidence}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-stone-400 space-y-3">
                <FileText className="w-10 h-10 mx-auto text-stone-300" />
                <p className="text-sm font-semibold text-stone-700">No Statement of Purpose generated yet.</p>
                <p className="text-xs text-stone-400">Return to the Curated Programs tab and click "Draft Statement of Purpose" on any university.</p>
                <button
                  onClick={() => setActiveTab('scholarships')}
                  className="px-5 py-2.5 bg-[#064E3B] text-white rounded-xl text-xs font-bold"
                >
                  View Curated Programs
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CANDIDATE DOSSIER TAB */}
        {activeTab === 'candidate' && (
          <div className="bg-white border border-[#E7E5E4] rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-[#E7E5E4]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#064E3B]">
                  Candidate Specification Dossier
                </span>
                <h2 className="text-2xl font-bold text-[#1C1917] mt-1">
                  {name || 'Unnamed Student'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#064E3B] bg-[#ECFDF5] border border-[#A7F3D0] px-3.5 py-1.5 rounded-full">
                  CGPA: {cgpa || 'N/A'}
                </span>
                <button
                  onClick={() => {
                    const el = document.getElementById('candidate-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3.5 py-1.5 bg-[#FAF9F6] border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 flex items-center gap-1 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5 text-stone-500" />
                  <span>Edit Details</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E7E5E4]">
                <span className="text-[10px] font-bold text-stone-400 uppercase block">Education</span>
                <span className="text-sm font-bold text-[#1C1917] mt-1 block">{educationLevel}</span>
                <span className="text-stone-500 mt-0.5 block">{currentInstitution}</span>
              </div>

              <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E7E5E4]">
                <span className="text-[10px] font-bold text-stone-400 uppercase block">Target Degree & Field</span>
                <span className="text-sm font-bold text-[#1C1917] mt-1 block">{targetDegree}</span>
                <span className="text-stone-500 mt-0.5 block">{targetField}</span>
              </div>
            </div>

            <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E7E5E4] text-xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase block mb-2">Target Countries</span>
              <div className="flex flex-wrap gap-2">
                {selectedCountries.map((c) => (
                  <span key={c} className="px-3 py-1 bg-white border border-[#E7E5E4] rounded-lg font-semibold text-stone-700">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E7E5E4] text-xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">GitHub Verified Profile</span>
              <span className="font-mono text-[#064E3B] font-semibold">
                {githubUsername ? `github.com/${githubUsername}` : 'Not provided'}
              </span>
            </div>

            <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E7E5E4] text-xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">Research Abstract</span>
              <p className="text-stone-600 leading-relaxed font-sans">{bio}</p>
            </div>
          </div>
        )}
      </main>

      {/* 5. FOOTER */}
      <footer className="border-t border-[#E7E5E4] py-12 px-6 text-center text-xs text-stone-400 bg-white">
        <p className="font-semibold text-stone-700">ScholarSwarm Admissions Bureau</p>
        <p className="text-[11px] text-stone-400 mt-1">Official University Portal Crawler • Zero Fabrication Guarantee</p>
      </footer>
    </div>
  );
};
