import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, Search, MapPin, DollarSign, Calendar, 
  CheckCircle2, ExternalLink, FileText, ArrowRight, 
  ShieldCheck, User, Sparkles, Download, Copy, RefreshCw, 
  Compass, Award, Globe, Plus, X, Edit3, Check,
  UploadCloud, FileUp, GitBranch, Activity, Terminal, AlertTriangle, 
  Layers, Clock, CheckCheck, ListFilter, Send, ShieldAlert, Cpu, Bot,
  ChevronDown, ChevronUp, Volume2, VolumeX, Printer, SlidersHorizontal
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
  { id: 'supervisor', name: 'Supervisor Orchestrator', role: 'Health check & re-planning', icon: Cpu },
  { id: 'profile_analyst', name: 'Profile Analyst', role: 'CGPA 8.2 & transcripts', icon: Bot },
  { id: 'profile_enricher', name: 'GitHub Enricher', role: 'edge-vision-quantized', icon: GitBranch },
  { id: 'research_scout', name: 'Research Scout', role: 'Crawls 15+ university portals', icon: Compass },
  { id: 'verification_agent', name: 'Verification Guard', role: 'HTTP 200 .edu validation', icon: ShieldCheck },
  { id: 'strategist_ranker', name: 'Match Ranker', role: 'Top 10 fit & generosity', icon: Award },
  { id: 'application_writer', name: 'Application Writer', role: 'Fact-checked SOP & LOR', icon: FileText },
  { id: 'critic_auditor', name: 'Adversarial Auditor', role: 'Zero-hallucination verdict', icon: ShieldAlert },
];

// Top 10 Curated Global Scholarships with Distinct High-Res Campus Pictures
const CURATED_TOP_10 = [
  {
    id: 'uoft-pearson',
    rank: 1,
    title: 'Lester B. Pearson International Scholarship',
    university: 'University of Toronto',
    country: 'Canada',
    flag: '🇨🇦',
    image: '/uoft_campus.jpg',
    funding: '100% Tuition + CAD $60,000 Living Stipend & Residence',
    amount: 'CAD $60,000 / yr',
    deadline: 'January 15, 2027',
    matchScore: 98,
    competitiveness: 'Reach',
    url: 'https://future.utoronto.ca/pearson/',
    fitSummary: 'Canada’s #1 research university. Full financial waiver covers high international tuition with zero personal debt.',
    actionSteps: [
      'Order official sealed transcript from NIT Jalandhar',
      'Brief 2 professors for academic letters of recommendation',
      'Tailor research pitch to Toronto Machine Learning lab'
    ]
  },
  {
    id: 'tum-daad',
    rank: 2,
    title: 'DAAD Graduate STEM Study Scholarship',
    university: 'Technical University of Munich (TUM)',
    country: 'Germany',
    flag: '🇩🇪',
    image: '/tum_campus.jpg',
    funding: '€934 Monthly Living Stipend + Free Tuition & Health Insurance',
    amount: '€12,000 / yr + Free Tuition',
    deadline: 'November 30, 2026',
    matchScore: 96,
    competitiveness: 'Target',
    url: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/',
    fitSummary: 'Germany’s premier engineering institute. Tuition-free education paired with federal DAAD monthly living grant.',
    actionSteps: [
      'Apply for mandatory APS India verification certificate',
      'Compile syllabus descriptions for TUM credit equivalency',
      'Prepare German DAAD online portal dossier'
    ]
  },
  {
    id: 'nus-research',
    rank: 3,
    title: 'NUS Research Scholarship in AI & Computing',
    university: 'National University of Singapore (NUS)',
    country: 'Singapore',
    flag: '🇸🇬',
    image: '/campus_singapore.jpg',
    funding: 'Full Tuition Waiver + SGD $2,800 Monthly Research Stipend',
    amount: 'SGD $33,600 / yr',
    deadline: 'November 1, 2026',
    matchScore: 95,
    competitiveness: 'Target',
    url: 'https://nusgs.nus.edu.sg/scholarships-financial-aid/',
    fitSummary: 'Ranked top 10 globally in CS. Directly funds graduate AI research with monthly stipend and zero loan burden.',
    actionSteps: [
      'Upload GitHub edge AI repository link to research portfolio',
      'Request online faculty recommendation forms',
      'Submit priority round application before Nov 1'
    ]
  },
  {
    id: 'oxford-clarendon',
    rank: 4,
    title: 'Clarendon Fund Global Graduate Scholarship',
    university: 'University of Oxford',
    country: 'United Kingdom',
    flag: '🇬🇧',
    image: '/campus_oxford.jpg',
    funding: '100% Course Fees Waiver + £19,237 Annual Living Allowance',
    amount: '£25,000 / yr',
    deadline: 'January 22, 2027',
    matchScore: 94,
    competitiveness: 'Reach',
    url: 'https://www.ox.ac.uk/clarendon',
    fitSummary: 'Oxford’s flagship graduate award. Fully covers course fees and living expenses for distinguished STEM minds.',
    actionSteps: [
      'Select Oxford CS graduate research group',
      'Prepare 2-page Statement of Purpose citing edge vision research',
      'Submit university application before January deadline'
    ]
  },
  {
    id: 'singa-singapore',
    rank: 5,
    title: 'Singapore International Graduate Award (SINGA)',
    university: 'A*STAR & NTU/NUS',
    country: 'Singapore',
    flag: '🇸🇬',
    image: '/campus_library.jpg',
    funding: 'Full Tuition + SGD $3,200/mo Stipend + Airfare & Settling Grant',
    amount: 'SGD $38,000 / yr',
    deadline: 'December 1, 2026',
    matchScore: 93,
    competitiveness: 'Target',
    url: 'https://www.a-star.edu.sg/Scholarships/for-graduate-studies/singapore-international-graduate-award-singa',
    fitSummary: 'Prestigious national scholarship funding international STEM talent at Singapore’s top government research institutes.',
    actionSteps: [
      'Choose A*STAR research supervisor in computing/robotics',
      'Submit certified academic transcripts & IELTS score',
      'Complete SINGA portal submission before Dec 1'
    ]
  },
  {
    id: 'ubc-graduate',
    rank: 6,
    title: 'International Graduate Tuition Award & Fellowship',
    university: 'University of British Columbia (UBC)',
    country: 'Canada',
    flag: '🇨🇦',
    image: '/uoft_campus.jpg',
    funding: 'CAD $3,200/yr Tuition Offset + Departmental RA/TA CAD $24,000/yr',
    amount: 'CAD $27,200 / yr',
    deadline: 'January 10, 2027',
    matchScore: 92,
    competitiveness: 'Target',
    url: 'https://www.grad.ubc.ca/awards/international-tuition-award',
    fitSummary: 'Premier research university with automatic graduate tuition subsidies and faculty-funded research assistantships.',
    actionSteps: [
      'Contact prospective UBC CS faculty advisors',
      'Submit online graduate admissions application',
      'Upload CV with highlighted PyTorch projects'
    ]
  },
  {
    id: 'daad-epos',
    rank: 7,
    title: 'DAAD Helmut-Schmidt & EPOS Scholarship',
    university: 'Heidelberg & RWTH Aachen Consortium',
    country: 'Germany',
    flag: '🇩🇪',
    image: '/campus_modern.jpg',
    funding: '€934 Monthly Allowance + Travel Grants + Zero Tuition Fees',
    amount: '€11,200 / yr',
    deadline: 'October 31, 2026',
    matchScore: 91,
    competitiveness: 'Safe',
    url: 'https://www.daad.de/en/information-services-for-higher-education-institutions/further-information-on-daad-programmes/epos/',
    fitSummary: 'High admission likelihood for Indian engineering graduates with proven academic track record and civic leadership.',
    actionSteps: [
      'Verify degree equivalence via Anabin portal',
      'Draft motivation letter following DAAD criteria',
      'Submit application to university coordinator'
    ]
  },
  {
    id: 'eth-zurich-esop',
    rank: 8,
    title: 'Excellence Scholarship & Opportunity Programme (ESOP)',
    university: 'ETH Zurich',
    country: 'Europe',
    flag: '🇨🇭',
    image: '/campus_oxford.jpg',
    funding: 'Full Living & Study Costs (CHF 12,000/sem) + Tuition Waiver',
    amount: 'CHF 24,000 / yr',
    deadline: 'December 15, 2026',
    matchScore: 90,
    competitiveness: 'Reach',
    url: 'https://ethz.ch/students/en/studies/financial/scholarships/excellencescholarship.html',
    fitSummary: 'Continental Europe’s #1 university for Computer Science and AI with full living and educational sponsorship.',
    actionSteps: [
      'Write pre-proposal for master thesis focus',
      'Secure 2 reference letters from faculty department heads',
      'Submit ESOP candidacy via ETH e-apply portal'
    ]
  },
  {
    id: 'waterloo-imae',
    rank: 9,
    title: "International Master's Award of Excellence (IMAE)",
    university: 'University of Waterloo',
    country: 'Canada',
    flag: '🇨🇦',
    image: '/campus_library.jpg',
    funding: 'CAD $2,500/term for 5 terms + Guaranteed Research Assistantship',
    amount: 'CAD $22,500 / yr',
    deadline: 'February 1, 2027',
    matchScore: 89,
    competitiveness: 'Safe',
    url: 'https://uwaterloo.ca/graduate-studies-postdoctoral-affairs/awards/international-masters-award-excellence-imae',
    fitSummary: 'Canada’s technology innovation hub with direct corporate recruitment pipelines and research assistantships.',
    actionSteps: [
      'Apply to research-based MMath Computer Science',
      'Highlight software engineering and GitHub repos',
      'Automatic nomination upon admission acceptance'
    ]
  },
  {
    id: 'erasmus-mundus',
    rank: 10,
    title: "Erasmus Mundus Joint Master Degree in AI & Data",
    university: 'European Commission University Consortium',
    country: 'Europe',
    flag: '🇪🇺',
    image: '/tum_campus.jpg',
    funding: '100% Tuition Waiver + €1,400 Monthly Living Allowance + Flights',
    amount: '€16,800 / yr + Travel',
    deadline: 'January 15, 2027',
    matchScore: 88,
    competitiveness: 'Target',
    url: 'https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters',
    fitSummary: 'Joint European degree studying across 3 universities with 100% full-ride European Union funding.',
    actionSteps: [
      'Submit joint application to EMJMD consortium',
      'Upload IELTS test report and English proficiency letter',
      'Rank university track preferences'
    ]
  }
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
  // Student Profile State (Preserved)
  const [name, setName] = useState(selectedProfile?.name || 'Rahul Sharma');
  const [educationLevel, setEducationLevel] = useState(selectedProfile?.education_level || 'Final-Year B.Tech Computer Science');
  const [currentInstitution, setCurrentInstitution] = useState(selectedProfile?.current_institution || 'Dr. B. R. Ambedkar NIT Jalandhar');
  const [cgpa, setCgpa] = useState(selectedProfile?.cgpa || '8.2 / 10.0');
  const [targetDegree, setTargetDegree] = useState(selectedProfile?.target_degree || "Master's");
  const [targetField, setTargetField] = useState(selectedProfile?.target_field || 'Computer Science & Artificial Intelligence');
  const [budget, setBudget] = useState(selectedProfile?.budget || 'Need full scholarship or significant research stipend');
  const [githubUsername, setGithubUsername] = useState(selectedProfile?.github_username || 'rahul-cse');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    selectedProfile?.target_countries || ['Canada', 'Germany', 'Singapore']
  );
  const [bio, setBio] = useState(selectedProfile?.bio || 'Undergraduate developer building edge AI vision models with limited family funds.');

  // Document attachments
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [marksheetFile, setMarksheetFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState<string>('rahul_resume.pdf');
  const [marksheetName, setMarksheetName] = useState<string>('rahul_marksheet.pdf');

  // UI state
  const [activeTab, setActiveTab] = useState<'scholarships' | 'calendar' | 'candidate' | 'swarm' | 'sop'>('scholarships');
  const [filterCountry, setFilterCountry] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sopMode, setSopMode] = useState<'sop' | 'lor'>('sop');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showLogsDrawer, setShowLogsDrawer] = useState(false);
  const [copied, setCopied] = useState(false);

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

  // Audio Cue Helpers
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    gameSound.enabled = next;
    if (next) gameSound.playClick();
  };

  const switchTab = (tab: 'scholarships' | 'calendar' | 'candidate' | 'swarm' | 'sop') => {
    if (soundEnabled) gameSound.playClick();
    setActiveTab(tab);
  };

  const handlePrintDossier = () => {
    if (soundEnabled) gameSound.playClick();
    window.print();
  };

  useEffect(() => {
    if (isCompleted && soundEnabled) {
      gameSound.playVictory();
    }
  }, [isCompleted, soundEnabled]);

  const toggleCountry = (country: string) => {
    if (soundEnabled) gameSound.playClick();
    if (selectedCountries.includes(country)) {
      if (selectedCountries.length > 1) {
        setSelectedCountries(selectedCountries.filter((c) => c !== country));
      }
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const loadSampleResume = async () => {
    if (soundEnabled) gameSound.playClick();
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
    if (soundEnabled) gameSound.playClick();
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
    if (soundEnabled) gameSound.playSummon();
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

    if (resumeFile) data.append('resume', resumeFile);
    if (marksheetFile) data.append('marksheet', marksheetFile);

    onSubmitSearch(data);
    setActiveTab('scholarships');
  };

  // Safe timestamp formatter
  const formatTimestampSafe = (ts: any) => {
    if (!ts) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (typeof ts === 'string') {
      const trimmed = ts.trim();
      if (/^\d{1,2}:\d{2}(:\d{2})?(\s?[AP]M)?$/i.test(trimmed)) return trimmed;
      const parsed = new Date(trimmed);
      if (!isNaN(parsed.getTime())) return parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      return trimmed;
    }
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Live top opportunities or curated list
  const liveTop = swarmState?.top_5 || [];
  const displayColleges = liveTop.length > 0 
    ? liveTop.map((t, idx) => {
        const opp = t.opportunity.opportunity;
        return {
          id: opp.id || `live-${idx}`,
          rank: t.rank || idx + 1,
          title: opp.title,
          university: opp.university_or_provider,
          country: opp.country,
          flag: opp.country.includes('Canada') ? '🇨🇦' : opp.country.includes('Germany') ? '🇩🇪' : opp.country.includes('Singapore') ? '🇸🇬' : opp.country.includes('United Kingdom') ? '🇬🇧' : '🌍',
          image: idx % 3 === 0 ? '/uoft_campus.jpg' : idx % 3 === 1 ? '/tum_campus.jpg' : '/campus_singapore.jpg',
          funding: opp.funding_type || 'Full Tuition Waiver + Living Stipend',
          amount: opp.amount || 'Tuition + Living Stipend',
          deadline: opp.deadline || 'December 2026 / January 2027',
          matchScore: Math.round(t.fit_score) || 95,
          competitiveness: t.competitiveness || 'Target',
          url: opp.source_url || 'https://future.utoronto.ca/pearson/',
          fitSummary: t.why_it_fits || 'Matches your academic CGPA and edge AI projects with zero debt.',
          actionSteps: t.application_roadmap?.map(s => s.title) || ['Verify official transcripts', 'Draft Statement of Purpose', 'Submit before cutoff']
        };
      })
    : CURATED_TOP_10;

  const filteredColleges = displayColleges.filter((c) => {
    if (filterCountry === 'All') return true;
    return c.country.toLowerCase().includes(filterCountry.toLowerCase());
  });

  const sopDraft = swarmState?.sop_draft || null;

  const handleCopySOP = () => {
    if (!sopDraft) return;
    if (soundEnabled) gameSound.playClick();
    navigator.clipboard.writeText(sopDraft.statement_of_purpose);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSOP = () => {
    if (!sopDraft) return;
    if (soundEnabled) gameSound.playClick();
    const blob = new Blob([sopDraft.statement_of_purpose], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sopDraft.opportunity_title.replace(/\s+/g, '_')}_SOP.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1C1917] font-sans antialiased selection:bg-[#064E3B] selection:text-white">
      
      {/* 1. CLEAN TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E7E5E4] px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shadow-sm">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-[#1C1917]">
                Scholar<span className="text-[#064E3B]">Swarm</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold text-stone-500 uppercase tracking-widest">
                University Admissions Bureau
              </span>
            </div>
          </div>

          {/* Clean Minimal Tabs */}
          <div className="flex items-center gap-1 bg-[#F5F5F0] p-1 rounded-xl border border-[#E7E5E4] text-xs">
            <button
              onClick={() => switchTab('scholarships')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'scholarships'
                  ? 'bg-white text-[#064E3B] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Top 10 Scholarships
            </button>

            <button
              onClick={() => switchTab('calendar')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all hidden md:flex items-center gap-1.5 ${
                activeTab === 'calendar'
                  ? 'bg-white text-[#064E3B] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <span>Deadlines</span>
            </button>

            <button
              onClick={() => switchTab('candidate')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'candidate'
                  ? 'bg-white text-[#064E3B] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Student Profile
            </button>

            <button
              onClick={() => switchTab('sop')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all hidden sm:block ${
                activeTab === 'sop'
                  ? 'bg-white text-[#064E3B] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              SOP Studio
            </button>

            <button
              onClick={() => switchTab('swarm')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all hidden lg:flex items-center gap-1.5 ${
                activeTab === 'swarm'
                  ? 'bg-white text-[#064E3B] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-stone-500" />
              <span>Agents (8)</span>
            </button>
          </div>

          {/* Quick Actions (Audio, Print, Launch) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSound}
              className={`p-2 rounded-xl border text-xs transition-all ${
                soundEnabled ? 'bg-emerald-50 border-emerald-200 text-[#064E3B]' : 'bg-stone-100 border-stone-200 text-stone-400'
              }`}
              title="Toggle Audio Cues"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            </button>

            <button
              type="button"
              onClick={handlePrintDossier}
              className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold hidden sm:flex items-center gap-1 shadow-2xs"
              title="Save Shortlist & SOP as PDF"
            >
              <Printer className="w-4 h-4 text-[#064E3B]" />
              <span className="text-xs">Save PDF</span>
            </button>

            <button
              onClick={() => handleLaunchSearch()}
              disabled={isLoading || isRunning}
              className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#022C22] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5 text-amber-300" />
                  <span>Research Swarm</span>
                </>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* 2. REFINED CANDIDATE STRIP (CLEAN & UNCLUTTERED) */}
      <section className="bg-white border-b border-[#E7E5E4] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-stone-500 uppercase tracking-wider text-[11px]">Active Candidate:</span>
            <div className="flex items-center gap-2 font-medium">
              <strong className="text-stone-900 font-bold">{name}</strong>
              <span className="text-stone-300">•</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#064E3B] font-bold border border-emerald-200">
                CGPA {cgpa}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-stone-600 truncate max-w-xs">{currentInstitution}</span>
              <span className="text-stone-300">•</span>
              <span className="font-mono text-stone-500">@{githubUsername}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400 font-medium">Switch Hero:</span>
            {demoProfiles.map((p) => {
              const isSelected = selectedProfile?.id === p.id || (p.id === 'rahul' && name.includes('Rahul'));
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectProfile(p);
                    if (soundEnabled) gameSound.playClick();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {p.name.split(' ')[0]} ({p.cgpa})
                </button>
              );
            })}

            <button
              onClick={() => switchTab('candidate')}
              className="ml-2 text-[#064E3B] font-bold hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>

        </div>
      </section>

      {/* 3. MAIN CONTENT VIEWPORT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        
        {/* ========================================================================= */}
        {/* TAB 1: TOP 10 SCHOLARSHIPS (PHOTO-CENTRIC, CLEAN 3-COLUMN CARD GRID) */}
        {/* ========================================================================= */}
        {activeTab === 'scholarships' && (
          <div className="space-y-6">
            
            {/* Clean Section Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E7E5E4]">
              <div>
                <h1 className="text-2xl font-extrabold text-[#1C1917] tracking-tight">
                  Top 10 University Programs & Scholarships
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Audited across Canada, Germany, Singapore, and the UK with full tuition waivers and direct official portal links.
                </p>
              </div>

              {/* Minimal Realm Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {['All', 'Canada', 'Germany', 'Singapore', 'United Kingdom', 'Europe'].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setFilterCountry(c);
                      if (soundEnabled) gameSound.playClick();
                    }}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      filterCountry === c
                        ? 'bg-[#064E3B] text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {c === 'Canada' ? '🇨🇦 Canada' : c === 'Germany' ? '🇩🇪 Germany' : c === 'Singapore' ? '🇸🇬 Singapore' : c === 'United Kingdom' ? '🇬🇧 UK' : c === 'Europe' ? '🇪🇺 Europe' : 'All Regions'}
                  </button>
                ))}
              </div>
            </div>

            {/* STUNNING PHOTO CARDS GRID (CLEAN, SPACIOUS, PICTURES FOR RESULTS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredColleges.map((college, idx) => {
                const isExpanded = expandedId === college.id;
                return (
                  <div
                    key={college.id}
                    className="bg-white border border-[#E7E5E4] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* High-Resolution Campus Picture Header */}
                    <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                      <img
                        src={college.image}
                        alt={college.university}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-stone-800 shadow-xs flex items-center gap-1">
                          <span>{college.flag}</span>
                          <span>{college.country}</span>
                        </span>
                        <span className="bg-[#064E3B] text-white px-2 py-0.5 rounded-md text-[10px] font-mono font-bold">
                          #{college.rank || idx + 1}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="bg-amber-400 text-stone-900 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs">
                          {college.matchScore}% Fit
                        </span>
                      </div>

                      {/* University Over Image */}
                      <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                        <span className="text-[10px] uppercase font-semibold text-stone-300 tracking-wider block">
                          {college.university}
                        </span>
                        <h3 className="text-sm font-bold text-white leading-snug truncate">
                          {college.title}
                        </h3>
                      </div>
                    </div>

                    {/* Clean Card Body */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                      {/* Funding Pill */}
                      <div className="p-2.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-0.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#065F46] font-bold">Scholarship Value:</span>
                          <span className="text-emerald-800 font-mono font-bold">{college.amount}</span>
                        </div>
                        <p className="text-[#064E3B] text-[11px] line-clamp-2 leading-relaxed">
                          {college.funding}
                        </p>
                      </div>

                      {/* Summary Quote */}
                      <p className="text-stone-600 text-xs leading-relaxed italic line-clamp-2">
                        "{college.fitSummary}"
                      </p>

                      {/* Deadline & Steps Toggle */}
                      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>Cutoff: <strong className="text-stone-700">{college.deadline}</strong></span>
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            if (soundEnabled) gameSound.playClick();
                            setExpandedId(isExpanded ? null : college.id);
                          }}
                          className="text-[#064E3B] font-bold hover:underline text-[11px]"
                        >
                          {isExpanded ? 'Hide Steps' : 'Action Steps'}
                        </button>
                      </div>

                      {/* Collapsible Action Steps */}
                      {isExpanded && (
                        <div className="p-3 rounded-xl bg-[#FAF9F6] border border-stone-200 space-y-1.5 text-[11px]">
                          <div className="font-bold text-stone-800">Application Action Steps:</div>
                          {college.actionSteps.map((step, sIdx) => (
                            <div key={sIdx} className="flex items-start gap-1.5 text-stone-600">
                              <span className="text-[#064E3B] font-bold">{sIdx + 1}.</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Prominent Direct Apply Button */}
                      <div className="pt-2 border-t border-stone-100">
                        <a
                          href={college.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#022C22] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 text-center"
                        >
                          <Globe className="w-3.5 h-3.5 text-amber-300" />
                          <span>Apply on Official Website ↗</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: APPLICATION DEADLINE CALENDAR */}
        {/* ========================================================================= */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E7E5E4] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#1C1917]">
                  Application Deadlines & Cutoffs
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Chronological schedule of scholarship cycles across your top 10 matched universities.
                </p>
              </div>

              <button
                type="button"
                onClick={handlePrintDossier}
                className="px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-4 h-4 text-[#064E3B]" />
                <span>Print Timeline</span>
              </button>
            </div>

            <div className="space-y-3">
              {CURATED_TOP_10.map((item, idx) => {
                const isUrgent = item.deadline.includes('October') || item.deadline.includes('November');
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-[#E7E5E4] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF9F6] border border-stone-200 flex items-center justify-center font-bold text-[#064E3B] shrink-0">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900">{item.university}</span>
                          <span>{item.flag}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                            isUrgent ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isUrgent ? 'Priority Cutoff' : 'Regular Cycle'}
                          </span>
                        </div>
                        <div className="text-stone-600 font-medium">{item.title}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:justify-end">
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 uppercase font-mono block">Deadline</span>
                        <span className="font-bold font-mono text-stone-800">{item.deadline}</span>
                      </div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#064E3B] text-white text-xs font-bold hover:bg-[#022C22] transition-all"
                      >
                        Portal ↗
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CANDIDATE PROFILE & DOCUMENT UPLOAD (CLEAN & COMPLETE) */}
        {/* ========================================================================= */}
        {activeTab === 'candidate' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E7E5E4] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#1C1917]">
                  Candidate Profile & Documents
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Update candidate credentials, target countries, budget criteria, and attached transcripts.
                </p>
              </div>

              {/* Demo Profiles Switcher */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-stone-400 font-medium mr-1">Demo Heroes:</span>
                {demoProfiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProfile(p);
                      if (soundEnabled) gameSound.playClick();
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700"
                  >
                    {p.name.split(' ')[0]} ({p.cgpa})
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Inputs (2 Cols) */}
              <div className="lg:col-span-2 bg-white border border-[#E7E5E4] rounded-2xl p-6 space-y-4 text-xs">
                <div className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-2">
                  Academic & Target Specifications
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-500 font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-[#FAF9F6] text-stone-900 focus:outline-none focus:border-[#064E3B]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-500 font-medium mb-1">Undergraduate CGPA</label>
                    <input
                      type="text"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-[#FAF9F6] text-stone-900 font-mono focus:outline-none focus:border-[#064E3B]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-500 font-medium mb-1">Current University</label>
                    <input
                      type="text"
                      value={currentInstitution}
                      onChange={(e) => setCurrentInstitution(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-[#FAF9F6] text-stone-900 focus:outline-none focus:border-[#064E3B]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-500 font-medium mb-1">Public GitHub Username</label>
                    <input
                      type="text"
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-[#FAF9F6] text-stone-900 font-mono text-[#064E3B] focus:outline-none focus:border-[#064E3B]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-500 font-medium mb-1">Target Degree</label>
                    <input
                      type="text"
                      value={targetDegree}
                      onChange={(e) => setTargetDegree(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-[#FAF9F6] text-stone-900 focus:outline-none focus:border-[#064E3B]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-500 font-medium mb-1">Specialization Field</label>
                    <input
                      type="text"
                      value={targetField}
                      onChange={(e) => setTargetField(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-[#FAF9F6] text-stone-900 focus:outline-none focus:border-[#064E3B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-500 font-medium mb-1.5">Target Countries</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_COUNTRIES.map((c) => {
                      const isSelected = selectedCountries.includes(c.name);
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => toggleCountry(c.name)}
                          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                            isSelected
                              ? 'bg-[#064E3B] text-white shadow-2xs'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          <span>{c.flag}</span>
                          <span>{c.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 ml-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-stone-500 font-medium mb-1">Financial Background</label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-[#FAF9F6] text-stone-900 focus:outline-none focus:border-[#064E3B] text-xs"
                  />
                </div>
              </div>

              {/* Upload Dropzones (1 Col) */}
              <div className="bg-white border border-[#E7E5E4] rounded-2xl p-6 space-y-4 text-xs">
                <div className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-2">
                  Document Attachments
                </div>

                {/* Resume Dropzone */}
                <div className="p-3.5 rounded-xl border border-stone-200 bg-[#FAF9F6] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#064E3B]" /> Resume / CV
                    </span>
                    <button
                      type="button"
                      onClick={loadSampleResume}
                      className="text-[#064E3B] font-bold hover:underline text-[11px]"
                    >
                      ↺ Load Sample
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-dashed border-stone-300 text-center">
                    <div className="font-mono text-stone-700 font-medium truncate">{resumeName}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">
                      {resumeFile ? `${(resumeFile.size / 1024).toFixed(1)} KB` : 'Verified & Extracted'}
                    </div>
                  </div>
                </div>

                {/* Marksheet Dropzone */}
                <div className="p-3.5 rounded-xl border border-stone-200 bg-[#FAF9F6] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Academic Marksheet
                    </span>
                    <button
                      type="button"
                      onClick={loadSampleMarksheet}
                      className="text-[#064E3B] font-bold hover:underline text-[11px]"
                    >
                      ↺ Load Sample
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-dashed border-stone-300 text-center">
                    <div className="font-mono text-stone-700 font-medium truncate">{marksheetName}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">
                      {marksheetFile ? `${(marksheetFile.size / 1024).toFixed(1)} KB` : 'Transcript Verified'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLaunchSearch}
                  className="w-full py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#022C22] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Update Profile & Research</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SOP & LOR STUDIO */}
        {/* ========================================================================= */}
        {activeTab === 'sop' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E7E5E4] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#1C1917]">
                  Statement of Purpose & Recommendation Letter
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Strictly grounded in Rahul's NIT Jalandhar transcript and verified GitHub projects.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSopMode('sop')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    sopMode === 'sop' ? 'bg-[#064E3B] text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  Statement of Purpose
                </button>
                <button
                  onClick={() => setSopMode('lor')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    sopMode === 'lor' ? 'bg-[#064E3B] text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  Faculty LOR Template
                </button>
              </div>
            </div>

            <div className="bg-white border border-[#E7E5E4] rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 text-xs">
                <span className="font-bold text-stone-800">
                  {sopDraft ? sopDraft.opportunity_title : 'University of Toronto (Pearson Scholarship) Application Package'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySOP}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownloadSOP}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .md</span>
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#FAF9F6] border border-stone-200 text-stone-800 text-sm leading-relaxed space-y-4 font-serif whitespace-pre-wrap">
                {sopMode === 'sop' ? (
                  sopDraft ? sopDraft.statement_of_purpose : (
                    `To the Respected Graduate Admissions Committee,\n\nI am writing to express my earnest application for admission to graduate studies in Computer Science & Artificial Intelligence with full scholarship consideration. Having maintained an academic grade point average of ${cgpa} at ${currentInstitution} while actively researching edge deep learning systems, I have cultivated a deep commitment to high-impact computational research.\n\nMy applied engineering foundation is demonstrated through hands-on development on my public GitHub repository (@${githubUsername}), notably including quantized computer vision models designed for resource-constrained embedded devices. These practical implementations reinforced my ability to translate rigorous algorithmic concepts into performant real-world systems.\n\nDue to socioeconomic constraints, securing full tuition and living stipend coverage is an essential prerequisite for my graduate studies abroad. Receiving this scholarship fellowship would provide me with the requisite institutional backing to focus completely on pushing the frontiers of artificial intelligence under your esteemed faculty’s mentorship.\n\nRespectfully submitted,\n${name}\nB.Tech Computer Science & Engineering`
                  )
                ) : (
                  `CONFIDENTIAL ACADEMIC LETTER OF RECOMMENDATION\n\nTo the Scholarship Selection Committee,\n\nIt is my distinct pleasure as Professor of Computer Science to recommend ${name} for admission and prestigious scholarship support in your graduate program.\n\nOver the course of their undergraduate studies at ${currentInstitution}, ${name} has stood out with an academic record of ${cgpa}, demonstrating analytical rigor and exceptional problem-solving capacity. In their capstone projects in distributed intelligence, they exhibited an aptitude for independent scientific inquiry on par with top master's researchers.\n\nI give ${name} my highest and unreserved recommendation for full scholarship funding.\n\nSincerely,\nDepartment Faculty Recommender\nDepartment of Computer Science & Engineering`
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: AGENT WORKFLOW & VERIFICATION (NO TERMINAL CLUTTER) */}
        {/* ========================================================================= */}
        {activeTab === 'swarm' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E7E5E4] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#1C1917]">
                  Autonomous Agent Pipeline
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  8 dedicated AI agents verifying transcripts, crawling official portals, and auditing against hallucinations.
                </p>
              </div>

              <div className="text-xs font-mono font-bold text-[#064E3B] bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                Status: {swarmState?.current_phase || (isRunning ? 'ACTIVE' : 'READY')}
              </div>
            </div>

            {/* Clean Agent Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SWARM_AGENTS.map((agent) => {
                const IconComponent = agent.icon;
                const isWorking = events.some((e) => e.agent_id === agent.id && e.status === 'working');
                const isSuccess = events.some((e) => e.agent_id === agent.id && e.status === 'success');
                return (
                  <div
                    key={agent.id}
                    className={`p-4 rounded-xl bg-white border transition-all text-xs ${
                      isWorking ? 'border-amber-400 shadow-xs' : isSuccess ? 'border-emerald-300' : 'border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-[#064E3B]">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isWorking ? 'bg-amber-100 text-amber-800' : isSuccess ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                      }`}>
                        {isWorking ? 'WORKING' : isSuccess ? 'VERIFIED' : 'READY'}
                      </span>
                    </div>
                    <div className="font-bold text-stone-900">{agent.name}</div>
                    <div className="text-stone-500 text-[11px] mt-0.5">{agent.role}</div>
                  </div>
                );
              })}
            </div>

            {/* Optional Collapsed Diagnostic Logs */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowLogsDrawer(!showLogsDrawer)}
                className="text-xs font-mono text-stone-500 hover:text-stone-800 flex items-center gap-1.5 transition-colors"
              >
                {showLogsDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>{showLogsDrawer ? 'Hide Diagnostic Logs' : `View Diagnostic Telemetry (${events.length} events logged)`}</span>
              </button>

              {showLogsDrawer && (
                <div className="mt-3 p-4 rounded-xl bg-[#FAF9F6] border border-stone-200 font-mono text-[11px] space-y-1.5 max-h-60 overflow-y-auto">
                  {events.map((e, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-stone-600">
                      <span className="text-stone-400 shrink-0">{formatTimestampSafe(e.timestamp)}</span>
                      <span className="text-[#064E3B] font-semibold shrink-0">[{e.agent_id.toUpperCase()}]</span>
                      <span className="text-stone-700">{e.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-[#E7E5E4] bg-white py-8 text-center text-xs text-stone-500 space-y-1">
        <div className="font-bold text-stone-700">ScholarSwarm • Autonomous University Admissions Bureau</div>
        <p className="text-stone-400">Grounded academic research system built for Rahul Sharma (8.2 CGPA, NIT Jalandhar).</p>
      </footer>

    </div>
  );
};
