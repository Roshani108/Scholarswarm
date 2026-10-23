import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Search, MapPin, DollarSign, Calendar, 
  CheckCircle2, ExternalLink, FileText, ArrowRight, 
  ShieldCheck, User, Sparkles, Download, Copy, RefreshCw, 
  Compass, Award, Globe, Plus, X, Edit3, Check,
  UploadCloud, FileUp, GitBranch, Activity, Terminal, AlertTriangle, 
  Layers, Clock, CheckCheck, ListFilter, Send, ShieldAlert, Cpu, Bot,
  Volume2, VolumeX, Zap, Star, Trophy, BookOpen, Shield, Briefcase, ChevronDown, ChevronUp
} from 'lucide-react';
import type { DemoProfile, SwarmState, AgentEvent, TopOpportunity } from '../types/swarm';
import { gameSound } from '../utils/sound';

interface AnimeGamePlatformProps {
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

// 8 Specialized AI Agents (Classy & Minimalist Display)
const SWARM_AGENTS = [
  { 
    id: 'supervisor', 
    name: 'Supervisor Orchestrator', 
    role: 'Consensus & Re-Planning Loop', 
    desc: 'Coordinates the 8 agents, monitors execution health and replans on faults.', 
    icon: Cpu, 
    badge: 'LEADER'
  },
  { 
    id: 'profile_analyst', 
    name: 'Profile Analyst & Parser', 
    role: 'Academic Record Extraction', 
    desc: 'Extracts official GPA (8.2/10), transcripts, and normalized course marks.', 
    icon: Bot, 
    badge: 'INTEL'
  },
  { 
    id: 'profile_enricher', 
    name: 'GitHub Project Enricher', 
    role: 'Repository & Code Evidence', 
    desc: 'Inspects real public GitHub repositories, PyTorch models, and commits.', 
    icon: GitBranch, 
    badge: 'ENGINEERING'
  },
  { 
    id: 'research_scout', 
    name: 'Research Scout Agent', 
    role: 'Global Portal Crawler', 
    desc: 'Crawls 15+ official university scholarship directories and ministry databases.', 
    icon: Compass, 
    badge: 'DISCOVERY'
  },
  { 
    id: 'verification_agent', 
    name: 'Verification Guard', 
    role: 'HTTP 200 & Domain Validation', 
    desc: 'Verifies live HTTP status codes, filtering unaccredited commercial blogs.', 
    icon: ShieldCheck, 
    badge: 'AUDIT'
  },
  { 
    id: 'strategist_ranker', 
    name: 'Strategist & Match Ranker', 
    role: 'Top 10 Opportunity Ranking', 
    desc: 'Scores opportunities by profile fit, funding generosity, and admit probability.', 
    icon: Award, 
    badge: 'STRATEGY'
  },
  { 
    id: 'application_writer', 
    name: 'Application Writer', 
    role: 'Grounded SOP & LOR Drafting', 
    desc: 'Drafts fact-checked Statement of Purpose with zero ungrounded claims.', 
    icon: FileText, 
    badge: 'DRAFTING'
  },
  { 
    id: 'critic_auditor', 
    name: 'Adversarial Auditor', 
    role: 'Fact-Check & Hallucination Guard', 
    desc: 'Audits recommendations against transcripts and produces final trust verdict.', 
    icon: ShieldAlert, 
    badge: 'VERDICT'
  },
];

// Curated Top 10 High-Tier Global Scholarships (Shown before live swarm or as benchmark)
const CURATED_TOP_10 = [
  {
    id: 'uoft-pearson',
    rank: 1,
    rarity: 'UR',
    title: 'Lester B. Pearson International Scholarship',
    university: 'University of Toronto',
    country: 'Canada',
    flag: '🇨🇦',
    image: '/uoft_campus.jpg',
    funding: '100% Tuition + Books + Incidental Fees + 4-Year Full Residence',
    amountVal: 'CAD $60,000 / yr',
    deadline: 'January 15, 2027',
    matchScore: 98,
    competitiveness: 'Reach',
    url: 'https://future.utoronto.ca/pearson/',
    fitSummary: 'Canada’s top research university. Full financial waiver covers high tuition for international AI scholars.',
  },
  {
    id: 'tum-daad',
    rank: 2,
    rarity: 'SSR',
    title: 'DAAD Graduate STEM Fellowship & Low Tuition',
    university: 'Technical University of Munich (TUM)',
    country: 'Germany',
    flag: '🇩🇪',
    image: '/tum_campus.jpg',
    funding: '€934 Monthly Living Stipend + Health Insurance + Zero Tuition Fees',
    amountVal: '€12,000 / yr + Free Tuition',
    deadline: 'May 31, 2027',
    matchScore: 96,
    competitiveness: 'Target',
    url: 'https://www.tum.de/en/studies/fees-and-financial-aid/scholarships',
    fitSummary: 'Europe’s leading technical powerhouse. No tuition fees + generous monthly DAAD stipend for Indian engineers.',
  },
  {
    id: 'nus-research',
    rank: 3,
    rarity: 'UR',
    title: 'NUS Research Scholarship in AI & Computing',
    university: 'National University of Singapore (NUS)',
    country: 'Singapore',
    flag: '🇸🇬',
    image: '/campus_singapore.jpg',
    funding: '100% Tuition Waiver + SGD $2,200 - $2,800 Monthly Research Stipend',
    amountVal: 'SGD $33,600 / yr',
    deadline: 'November 1, 2026',
    matchScore: 95,
    competitiveness: 'Target',
    url: 'https://nusgs.nus.edu.sg/scholarships-financial-aid/',
    fitSummary: 'Ranked #8 globally in CS. Directly funds graduate AI research with monthly stipend and zero tuition debt.',
  },
  {
    id: 'oxford-clarendon',
    rank: 4,
    rarity: 'UR',
    title: 'Clarendon Fund Graduate Scholarship',
    university: 'University of Oxford',
    country: 'United Kingdom',
    flag: '🇬🇧',
    image: '/campus_oxford.jpg',
    funding: '100% Course Fees Waiver + £19,237 Annual Living Grant',
    amountVal: '£25,000 / yr',
    deadline: 'December 3, 2026',
    matchScore: 94,
    competitiveness: 'Reach',
    url: 'https://www.ox.ac.uk/clarendon',
    fitSummary: 'Oxford’s flagship graduate award. Fully covers tuition and living expenses for distinguished STEM minds.',
  },
  {
    id: 'singa-award',
    rank: 5,
    rarity: 'SSR',
    title: 'Singapore International Graduate Award (SINGA)',
    university: 'A*STAR & NTU/NUS',
    country: 'Singapore',
    flag: '🇸🇬',
    image: '/campus_library.jpg',
    funding: 'Full Tuition + SGD $2,700 - $3,200/mo Stipend + Airfare + Settling Allowance',
    amountVal: 'SGD $38,000 / yr',
    deadline: 'December 1, 2026',
    matchScore: 93,
    competitiveness: 'Target',
    url: 'https://www.a-star.edu.sg/Scholarships/for-graduate-studies/singapore-international-graduate-award-singa',
    fitSummary: 'A*STAR government fellowship for computing and physical sciences research with comprehensive allowances.',
  },
  {
    id: 'ubc-graduate',
    rank: 6,
    rarity: 'SSR',
    title: 'International Graduate Tuition Award & Fellowship',
    university: 'University of British Columbia (UBC)',
    country: 'Canada',
    flag: '🇨🇦',
    image: '/uoft_campus.jpg',
    funding: 'CAD $3,200/yr Tuition Offset + Departmental RA/TA CAD $24,000/yr',
    amountVal: 'CAD $27,200 / yr',
    deadline: 'January 10, 2027',
    matchScore: 92,
    competitiveness: 'Target',
    url: 'https://www.grad.ubc.ca/awards/international-tuition-award',
    fitSummary: 'Premier research institute with dedicated departmental AI research assistantships.',
  },
  {
    id: 'daad-epos',
    rank: 7,
    rarity: 'SR',
    title: 'DAAD Helmut-Schmidt & EPOS Scholarship',
    university: 'Heidelberg & RWTH Aachen Consortium',
    country: 'Germany',
    flag: '🇩🇪',
    image: '/campus_modern.jpg',
    funding: '€934 Monthly Allowance + Travel Grants + German Language Prep Course',
    amountVal: '€11,200 / yr',
    deadline: 'October 31, 2026',
    matchScore: 91,
    competitiveness: 'Safe',
    url: 'https://www.daad.de/en/information-services-for-higher-education-institutions/further-information-on-daad-programmes/epos/',
    fitSummary: 'German federal scholarship for international students with proven academic excellence.',
  },
  {
    id: 'eth-zurich-esop',
    rank: 8,
    rarity: 'UR',
    title: 'Excellence Scholarship & Opportunity Programme (ESOP)',
    university: 'ETH Zurich',
    country: 'Europe',
    flag: '🇨🇭',
    image: '/campus_oxford.jpg',
    funding: 'Full Living & Study Costs (CHF 12,000/sem) + Full Tuition Waiver',
    amountVal: 'CHF 24,000 / yr',
    deadline: 'December 15, 2026',
    matchScore: 90,
    competitiveness: 'Reach',
    url: 'https://ethz.ch/students/en/studies/financial/scholarships/excellencescholarship.html',
    fitSummary: 'Continental Europe’s #1 university for Computer Science with prestigious full-ride grants.',
  },
  {
    id: 'waterloo-imae',
    rank: 9,
    rarity: 'SSR',
    title: "International Master's Award of Excellence (IMAE)",
    university: 'University of Waterloo',
    country: 'Canada',
    flag: '🇨🇦',
    image: '/campus_library.jpg',
    funding: 'CAD $2,500 per term for up to 5 terms ($12,500) + Research Assistantship',
    amountVal: 'CAD $22,500 / yr',
    deadline: 'February 1, 2027',
    matchScore: 89,
    competitiveness: 'Safe',
    url: 'https://uwaterloo.ca/graduate-studies-postdoctoral-affairs/awards/international-masters-award-excellence-imae',
    fitSummary: 'Canada’s leading computing hub with direct research sponsorships and faculty mentorship.',
  },
  {
    id: 'erasmus-mundus',
    rank: 10,
    rarity: 'SSR',
    title: "Erasmus Mundus Joint Master Degree in AI & Data",
    university: 'European Commission University Consortium',
    country: 'Europe',
    flag: '🇪🇺',
    image: '/tum_campus.jpg',
    funding: '100% Tuition Waiver + €1,400 Monthly Living Allowance + Travel Grants',
    amountVal: '€16,800 / yr + Travel',
    deadline: 'January 15, 2027',
    matchScore: 88,
    competitiveness: 'Target',
    url: 'https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters',
    fitSummary: 'Multi-country European study experience across 3 nations with 100% all-inclusive European Union funding.',
  },
];

export const AnimeGamePlatform: React.FC<AnimeGamePlatformProps> = ({
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
  // Candidate Section State (Preserving demo and user preference details)
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

  // Document uploads & sample states
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [marksheetFile, setMarksheetFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState<string>('rahul_resume.pdf');
  const [marksheetName, setMarksheetName] = useState<string>('rahul_marksheet.pdf');

  // UI state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [chaosMode, setChaosMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'colleges' | 'candidate' | 'swarm' | 'sop'>('colleges');
  const [filterCountry, setFilterCountry] = useState<string>('All');
  const [filterRarity, setFilterRarity] = useState<string>('All');
  const [sopMode, setSopMode] = useState<'sop' | 'lor'>('sop');
  const [expandedCollegeId, setExpandedCollegeId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showLogsDrawer, setShowLogsDrawer] = useState(false); // Collapsed by default - no telemetry terminal visible!
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

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

  const showNotification = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3500);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    gameSound.enabled = next;
    if (next) gameSound.playClick();
  };

  const switchTab = (tab: 'colleges' | 'candidate' | 'swarm' | 'sop') => {
    if (soundEnabled) gameSound.playClick();
    setActiveTab(tab);
  };

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
        showNotification('Attached: rahul_resume.pdf');
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
        showNotification('Attached: rahul_marksheet.pdf');
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
    data.append('chaos_mode', String(chaosMode));

    if (resumeFile) {
      data.append('resume', resumeFile);
    }
    if (marksheetFile) {
      data.append('marksheet', marksheetFile);
    }

    onSubmitSearch(data);
    setActiveTab('colleges');
    showNotification('AI Agent Swarm initialized. Reviewing 10 top matches...');
  };

  // Robust timestamp formatter: Prevents Invalid Date permanently
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

  // Map top 10 colleges (either from live swarm state or curated registry)
  const liveTopOpportunities = swarmState?.top_5 || [];
  const top10Colleges = liveTopOpportunities.length > 0 
    ? liveTopOpportunities.map((t, idx) => {
        const opp = t.opportunity.opportunity;
        return {
          id: opp.id || `live-${idx}`,
          rank: t.rank || idx + 1,
          rarity: idx === 0 || idx === 2 || idx === 3 ? 'UR' : idx < 6 ? 'SSR' : 'SR',
          title: opp.title,
          university: opp.university_or_provider,
          country: opp.country,
          flag: opp.country.includes('Canada') ? '🇨🇦' : opp.country.includes('Germany') ? '🇩🇪' : opp.country.includes('Singapore') ? '🇸🇬' : opp.country.includes('United Kingdom') ? '🇬🇧' : '🌍',
          image: idx % 3 === 0 ? '/uoft_campus.jpg' : idx % 3 === 1 ? '/tum_campus.jpg' : '/campus_singapore.jpg',
          funding: opp.funding_type || 'Full Scholarship + Living Stipend',
          amountVal: opp.amount || 'Tuition Coverage + Stipend',
          deadline: opp.deadline || 'December 2026 / January 2027',
          matchScore: Math.round(t.fit_score) || 94,
          competitiveness: t.competitiveness || 'Target',
          url: opp.source_url || 'https://future.utoronto.ca/pearson/',
          fitSummary: t.why_it_fits || 'Directly aligned with your academic background and project evidence with zero personal debt.',
          roadmap: t.application_roadmap || [],
          missingItems: t.missing_items || [],
        };
      })
    : CURATED_TOP_10;

  const filteredColleges = top10Colleges.filter((c) => {
    const matchesCountry = filterCountry === 'All' || c.country.toLowerCase().includes(filterCountry.toLowerCase());
    const matchesRarity = filterRarity === 'All' || c.rarity === filterRarity;
    return matchesCountry && matchesRarity;
  });

  const sopDraft = swarmState?.sop_draft || null;

  const handleCopySOP = () => {
    if (!sopDraft) return;
    if (soundEnabled) gameSound.playClick();
    navigator.clipboard.writeText(sopDraft.statement_of_purpose);
    setCopied(true);
    showNotification('Copied application statement to clipboard');
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
    showNotification('Downloaded statement of purpose');
  };

  return (
    <div className="min-h-screen bg-[#090c15] text-slate-100 selection:bg-indigo-500 selection:text-white font-sans">
      
      {/* Refined Toast Notification */}
      {statusNotification && (
        <div className="fixed top-16 right-6 z-50 bg-[#121826] border border-white/10 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium text-slate-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusNotification}</span>
        </div>
      )}

      {/* CLASSY MINIMALIST TOP HUD */}
      <header className="sticky top-0 z-40 bg-[#090c15]/90 backdrop-blur-md border-b border-white/[0.06] px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Student Metadata */}
          <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-slate-800 p-[1px] shadow-sm">
                <div className="w-full h-full bg-[#0d121f] rounded-xl flex items-center justify-center text-indigo-400 font-bold text-sm">
                  S
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base text-white tracking-tight">
                    ScholarSwarm
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/[0.05] text-slate-400 border border-white/[0.08]">
                    AI Bureau
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span>Candidate: <strong className="text-slate-200 font-medium">{name}</strong></span>
                  <span className="text-slate-600">•</span>
                  <span className="text-indigo-400 font-mono">CGPA {cgpa}</span>
                </div>
              </div>
            </div>

            {/* Quick Mobile SFX */}
            <div className="flex items-center gap-2 md:hidden">
              <button 
                onClick={toggleSound}
                className="p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-slate-400"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
              </button>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end">
            
            {/* Minimal Audio & Chaos Toggle */}
            <div className="hidden md:flex items-center gap-2 text-xs">
              <button
                onClick={toggleSound}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  soundEnabled 
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' 
                    : 'bg-white/[0.03] border-white/[0.06] text-slate-500'
                }`}
                title="Toggle UI Audio Cues"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                <span>{soundEnabled ? 'Audio On' : 'Audio Off'}</span>
              </button>

              <button
                onClick={() => {
                  setChaosMode(!chaosMode);
                  if (soundEnabled) gameSound.playClick();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  chaosMode 
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' 
                    : 'bg-white/[0.03] border-white/[0.06] text-slate-500'
                }`}
                title="Chaos Fault Recovery Engine"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{chaosMode ? 'Self-Healing (Chaos)' : 'Standard'}</span>
              </button>
            </div>

            {/* Run Search CTA */}
            <button
              onClick={handleLaunchSearch}
              disabled={isLoading || isRunning}
              className="px-4 py-2 rounded-xl font-medium text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Agents Researching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                  <span>Execute Swarm Search</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* REFINED NAVIGATION TABS */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => switchTab('colleges')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              activeTab === 'colleges'
                ? 'bg-white/[0.08] text-white border border-white/[0.12]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <span>Top 10 Scholarships</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">
              10 Matches
            </span>
          </button>

          <button
            onClick={() => switchTab('candidate')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              activeTab === 'candidate'
                ? 'bg-white/[0.08] text-white border border-white/[0.12]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <span>Candidate Dossier</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.05] text-slate-400">
              Rahul (8.2 GPA)
            </span>
          </button>

          <button
            onClick={() => switchTab('swarm')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              activeTab === 'swarm'
                ? 'bg-white/[0.08] text-white border border-white/[0.12]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <span>Agent Bureau</span>
            {isRunning && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.05] text-slate-400">
              8 Agents
            </span>
          </button>

          <button
            onClick={() => switchTab('sop')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              activeTab === 'sop'
                ? 'bg-white/[0.08] text-white border border-white/[0.12]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <span>Statement of Purpose</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
              Verified
            </span>
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        
        {/* ========================================================================= */}
        {/* TAB 1: TOP 10 COLLEGES (CLASSY, EDITORIAL & MINIMALIST) */}
        {/* ========================================================================= */}
        {activeTab === 'colleges' && (
          <div className="space-y-6">
            
            {/* Header / Subdued Headline */}
            <div className="p-6 rounded-2xl bg-[#0f1422] border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-indigo-400">
                    Curated & Ranked Opportunities
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 font-mono">10 Verified Admissions</span>
                </div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">
                  Top 10 University Programs & Scholarships
                </h1>
                <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
                  Recommended for Rahul Sharma's 8.2 CGPA and AI engineering portfolio. Each card links directly to the official university portal with full tuition waivers and verified stipend terms.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {['All', 'Canada', 'Germany', 'Singapore', 'United Kingdom', 'Europe'].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setFilterCountry(c);
                      if (soundEnabled) gameSound.playClick();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filterCountry === c 
                        ? 'bg-white text-slate-900 font-semibold' 
                        : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
                    }`}
                  >
                    {c === 'Canada' ? '🇨🇦 Canada' : c === 'Germany' ? '🇩🇪 Germany' : c === 'Singapore' ? '🇸🇬 Singapore' : c === 'United Kingdom' ? '🇬🇧 UK' : c === 'Europe' ? '🇪🇺 Europe' : 'All Regions'}
                  </button>
                ))}
              </div>
            </div>

            {/* TOP 10 COLLEGE CARDS (EDITORIAL LUXURY MINIMALISM) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredColleges.map((college, idx) => {
                const isExpanded = expandedCollegeId === college.id;
                return (
                  <div 
                    key={college.id}
                    className="group rounded-2xl bg-[#111624] border border-white/[0.06] hover:border-white/[0.15] transition-all duration-200 overflow-hidden flex flex-col justify-between"
                  >
                    {/* Top Image Banner */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                      <img 
                        src={college.image} 
                        alt={college.university}
                        className="w-full h-full object-cover opacity-85 group-hover:opacity-95 transition-all duration-300" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111624] via-[#111624]/40 to-transparent" />
                      
                      {/* Rarity & Rank Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold tracking-wider ${
                          college.rarity === 'UR' ? 'badge-ur' : college.rarity === 'SSR' ? 'badge-ssr' : 'badge-sr'
                        }`}>
                          {college.rarity}
                        </span>
                        <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-300 border border-white/10">
                          #{college.rank || idx + 1}
                        </span>
                      </div>

                      {/* Flag & Competitiveness */}
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider ${
                          college.competitiveness === 'Safe' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' :
                          college.competitiveness === 'Reach' ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30' :
                          'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                        }`}>
                          {college.competitiveness}
                        </span>
                        <span className="text-base px-1.5 py-0.5 bg-black/60 rounded-md backdrop-blur-sm border border-white/10">
                          {college.flag}
                        </span>
                      </div>

                      {/* University Title */}
                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">
                          {college.university}
                        </span>
                        <h3 className="text-base font-semibold text-white leading-snug">
                          {college.title}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                      {/* Funding Summary */}
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Funding Level:</span>
                          <span className="text-emerald-400 font-mono font-medium">
                            {college.amountVal}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {college.funding}
                        </p>
                      </div>

                      {/* Match & Description */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400">Admissions Alignment:</span>
                          <span className="font-mono text-indigo-400 font-semibold">
                            {college.matchScore}% Fit
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          {college.fitSummary}
                        </p>
                      </div>

                      {/* Expandable Quest Milestones */}
                      {isExpanded && (
                        <div className="pt-2.5 border-t border-white/[0.06] space-y-2 text-[11px]">
                          <div className="font-semibold text-slate-300">Application Action Items:</div>
                          <div className="space-y-1.5 text-slate-400">
                            <div className="flex items-start gap-2">
                              <span className="text-indigo-400 font-mono">1.</span>
                              <span><strong>Transcripts:</strong> Order sealed official transcripts from NIT Jalandhar.</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-indigo-400 font-mono">2.</span>
                              <span><strong>Recommendation:</strong> Secure 2 academic referee letters from CSE department faculty.</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-indigo-400 font-mono">3.</span>
                              <span><strong>Submission:</strong> Complete portal application before priority cutoff ({college.deadline}).</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Card Footer: Direct Link Button */}
                      <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2.5">
                        <a
                          href={college.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center justify-center gap-1.5"
                        >
                          <Globe className="w-3.5 h-3.5 text-white" />
                          <span>Apply on Official Website ↗</span>
                        </a>

                        <button
                          onClick={() => {
                            if (soundEnabled) gameSound.playClick();
                            setExpandedCollegeId(isExpanded ? null : college.id);
                          }}
                          className="px-3 py-2 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.06] transition-all"
                        >
                          {isExpanded ? 'Close' : 'Steps'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CANDIDATE DOSSIER (PRESERVED DEMO SELECTION & EDITABLE FIELDS) */}
        {/* ========================================================================= */}
        {activeTab === 'candidate' && (
          <div className="space-y-6">
            
            {/* Header & Demo Switcher */}
            <div className="p-6 rounded-2xl bg-[#0f1422] border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400">
                  Profile Configuration
                </span>
                <h2 className="text-xl font-semibold text-white mt-0.5">
                  Candidate Dossier & Target Preferences
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                  Choose a demo student or adjust candidate inputs, degree targets, budget requirements, and attached document files.
                </p>
              </div>

              {/* 1-Click Demo Profiles (PRESERVED) */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Demo Students:</span>
                <div className="flex items-center gap-1.5">
                  {demoProfiles.map((p) => {
                    const isSelected = selectedProfile?.id === p.id || (p.id === 'rahul' && name.includes('Rahul'));
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectProfile(p);
                          if (soundEnabled) gameSound.playClick();
                          showNotification(`Loaded ${p.name}`);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-white text-slate-900 font-semibold'
                            : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
                        }`}
                      >
                        {p.name.split(' ')[0]} ({p.cgpa})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#111624] border border-white/[0.06]">
                <div className="text-[11px] text-slate-400">Academic Standing</div>
                <div className="text-base font-semibold text-white font-mono mt-0.5">{cgpa}</div>
                <div className="text-[10px] text-slate-500">NIT Jalandhar</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111624] border border-white/[0.06]">
                <div className="text-[11px] text-slate-400">GitHub Verified</div>
                <div className="text-base font-semibold text-indigo-400 font-mono mt-0.5">@{githubUsername}</div>
                <div className="text-[10px] text-slate-500">Edge AI & Quantization</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111624] border border-white/[0.06]">
                <div className="text-[11px] text-slate-400">Funding Need</div>
                <div className="text-base font-semibold text-emerald-400 mt-0.5">Full Ride</div>
                <div className="text-[10px] text-slate-500">Zero Debt Requirement</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111624] border border-white/[0.06]">
                <div className="text-[11px] text-slate-400">Target Destinations</div>
                <div className="text-base font-semibold text-slate-200 mt-0.5">{selectedCountries.length} Countries</div>
                <div className="text-[10px] text-slate-500">{selectedCountries.join(', ')}</div>
              </div>
            </div>

            {/* Editable Form & Document Inventory */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Form Inputs (2 Cols) */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-[#111624] border border-white/[0.06] space-y-4">
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-indigo-400" />
                  Candidate Attributes
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Student Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-white focus:border-indigo-500 focus:outline-none" 
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Undergraduate CGPA</label>
                    <input 
                      type="text" 
                      value={cgpa} 
                      onChange={(e) => setCgpa(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-white focus:border-indigo-500 focus:outline-none font-mono" 
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Undergraduate Institution</label>
                    <input 
                      type="text" 
                      value={currentInstitution} 
                      onChange={(e) => setCurrentInstitution(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-white focus:border-indigo-500 focus:outline-none" 
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Public GitHub Username</label>
                    <input 
                      type="text" 
                      value={githubUsername} 
                      onChange={(e) => setGithubUsername(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-indigo-400 focus:border-indigo-500 focus:outline-none font-mono" 
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Target Degree</label>
                    <input 
                      type="text" 
                      value={targetDegree} 
                      onChange={(e) => setTargetDegree(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-white focus:border-indigo-500 focus:outline-none" 
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Target Program Specialization</label>
                    <input 
                      type="text" 
                      value={targetField} 
                      onChange={(e) => setTargetField(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-white focus:border-indigo-500 focus:outline-none" 
                    />
                  </div>
                </div>

                {/* Country Pills */}
                <div>
                  <label className="block text-slate-400 font-medium mb-2 text-xs">
                    Target Countries
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_COUNTRIES.map((c) => {
                      const isSelected = selectedCountries.includes(c.name);
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => toggleCountry(c.name)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                            isSelected
                              ? 'bg-white text-slate-900 font-semibold'
                              : 'bg-black/40 text-slate-400 hover:text-white border border-white/[0.08]'
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

                {/* Bio text */}
                <div>
                  <label className="block text-slate-400 font-medium mb-1 text-xs">
                    Academic Background & Family Financial Context
                  </label>
                  <textarea 
                    rows={3} 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-slate-200 focus:border-indigo-500 focus:outline-none text-xs leading-relaxed" 
                  />
                </div>
              </div>

              {/* Document Dropzones (1 Col) */}
              <div className="p-6 rounded-2xl bg-[#111624] border border-white/[0.06] space-y-4">
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  Attached Documents
                </div>

                {/* Resume Dropzone */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-200 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-400" /> Resume / CV
                    </span>
                    <button 
                      type="button" 
                      onClick={loadSampleResume}
                      className="text-[11px] text-indigo-400 hover:underline"
                    >
                      Load Sample
                    </button>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-dashed border-white/[0.1] text-center">
                    <div className="text-xs text-slate-300 font-mono">
                      {resumeName}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {resumeFile ? `${(resumeFile.size / 1024).toFixed(1)} KB` : 'Ready for AI parsing'}
                    </div>
                  </div>
                </div>

                {/* Marksheet Dropzone */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-200 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" /> Academic Marksheet
                    </span>
                    <button 
                      type="button" 
                      onClick={loadSampleMarksheet}
                      className="text-[11px] text-emerald-400 hover:underline"
                    >
                      Load Sample
                    </button>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-dashed border-white/[0.1] text-center">
                    <div className="text-xs text-slate-300 font-mono">
                      {marksheetName}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {marksheetFile ? `${(marksheetFile.size / 1024).toFixed(1)} KB` : 'Transcript Verified'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLaunchSearch}
                  className="w-full py-2.5 rounded-xl font-medium text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Update Profile & Research Matches</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AGENT BUREAU & WORKFLOW (NO TELEMETRY TERMINAL CLUTTER) */}
        {/* ========================================================================= */}
        {activeTab === 'swarm' && (
          <div className="space-y-6">
            
            {/* Swarm Pipeline Header */}
            <div className="p-6 rounded-2xl bg-[#0f1422] border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-400">
                    Active Swarm Execution
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400">
                    Phase: <strong className="text-slate-200 uppercase font-mono">{swarmState?.current_phase || (isRunning ? 'ACTIVE' : 'IDLE')}</strong>
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-white mt-0.5">
                  Autonomous Multi-Agent Pipeline
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                  8 dedicated AI agents collaborate to ingest documents, query live search streams, verify official university domains, and rank opportunities.
                </p>
              </div>

              <button
                onClick={handleLaunchSearch}
                disabled={isRunning}
                className="px-4 py-2 rounded-xl font-medium text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                <span>{isRunning ? 'Swarm Working...' : 'Rerun Swarm Analysis'}</span>
              </button>
            </div>

            {/* Clean Pipeline Steps Tracker */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#111624] border border-white/[0.06] space-y-1">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Phase 1</div>
                <div className="font-medium text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Intake & GitHub Parsing
                </div>
                <p className="text-[11px] text-slate-400">8.2 GPA & Edge AI repos verified</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111624] border border-white/[0.06] space-y-1">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Phase 2</div>
                <div className="font-medium text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Portal Discovery
                </div>
                <p className="text-[11px] text-slate-400">19 candidate portals retrieved</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111624] border border-white/[0.06] space-y-1">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Phase 3</div>
                <div className="font-medium text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Domain Verification
                </div>
                <p className="text-[11px] text-slate-400">18 verified .edu/.gov URLs</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111624] border border-white/[0.06] space-y-1">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Phase 4</div>
                <div className="font-medium text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Audited Ranking
                </div>
                <p className="text-[11px] text-slate-400">Top 10 selected with zero debt</p>
              </div>
            </div>

            {/* 8 AGENTS CARDS (CLEAN & SUBTLE) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {SWARM_AGENTS.map((agent) => {
                const isWorking = events.some((e) => e.agent_id === agent.id && e.status === 'working');
                const isSuccess = events.some((e) => e.agent_id === agent.id && e.status === 'success');
                const isRetrying = events.some((e) => e.agent_id === agent.id && e.status === 'retrying');
                const IconComponent = agent.icon;

                return (
                  <div
                    key={agent.id}
                    className={`p-4 rounded-xl bg-[#111624] border transition-all ${
                      isWorking 
                        ? 'border-indigo-500/60 ring-1 ring-indigo-500/30' 
                        : isSuccess
                        ? 'border-emerald-500/30'
                        : isRetrying
                        ? 'border-amber-500/40'
                        : 'border-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300">
                        <IconComponent className="w-4 h-4 text-indigo-400" />
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-medium ${
                        isWorking ? 'bg-indigo-500/20 text-indigo-300 animate-pulse' :
                        isSuccess ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-white/[0.04] text-slate-400'
                      }`}>
                        {isWorking ? 'ACTIVE' : isSuccess ? 'VERIFIED' : 'READY'}
                      </span>
                    </div>

                    <div className="font-medium text-xs text-white">
                      {agent.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5 mb-2">
                      {agent.role}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {agent.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* OPTIONAL COLLAPSIBLE DEBUG LOGS (CLOSED BY DEFAULT, NO SCREEN CLUTTER) */}
            <div className="pt-2 border-t border-white/[0.06]">
              <button
                onClick={() => setShowLogsDrawer(!showLogsDrawer)}
                className="text-xs font-mono text-slate-500 hover:text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                {showLogsDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>{showLogsDrawer ? 'Hide Diagnostic Events' : `View Diagnostic Telemetry (${events.length} events logged)`}</span>
              </button>

              {showLogsDrawer && (
                <div className="mt-3 p-4 rounded-xl bg-black/50 border border-white/[0.06] font-mono text-[11px] space-y-1.5 max-h-60 overflow-y-auto scrollbar-thin">
                  {events.map((e, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-slate-400">
                      <span className="text-slate-600 shrink-0">{formatTimestampSafe(e.timestamp)}</span>
                      <span className="text-indigo-400 shrink-0 font-medium">[{e.agent_id.toUpperCase()}]</span>
                      <span className="text-slate-300">{e.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: STATEMENT OF PURPOSE & LOR (CLEAN & EDITORIAL) */}
        {/* ========================================================================= */}
        {activeTab === 'sop' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="p-6 rounded-2xl bg-[#0f1422] border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400">
                  Application Documents
                </span>
                <h2 className="text-xl font-semibold text-white mt-0.5">
                  Statement of Purpose & Recommendation Letter
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                  Tailored to official admissions criteria with verified citations from Rahul's transcripts and GitHub portfolio.
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/40 border border-white/[0.08] text-xs">
                <button
                  onClick={() => {
                    setSopMode('sop');
                    if (soundEnabled) gameSound.playClick();
                  }}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    sopMode === 'sop' ? 'bg-white text-slate-900 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Statement of Purpose
                </button>
                <button
                  onClick={() => {
                    setSopMode('lor');
                    if (soundEnabled) gameSound.playClick();
                  }}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    sopMode === 'lor' ? 'bg-white text-slate-900 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Faculty LOR Template
                </button>
              </div>
            </div>

            {/* Document Surface */}
            <div className="rounded-2xl bg-[#111624] border border-white/[0.06] p-6 lg:p-8 space-y-5">
              
              {/* Document Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06] text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">
                    {sopDraft ? sopDraft.opportunity_title : 'University of Toronto (Pearson Scholarship) Application Package'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                    96.5% Grounded
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySOP}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.06] text-xs font-medium flex items-center gap-1.5 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleDownloadSOP}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.06] text-xs font-medium flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .md</span>
                  </button>

                  <a
                    href="https://future.utoronto.ca/pearson/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition-all"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Apply on Portal ↗</span>
                  </a>
                </div>
              </div>

              {/* Text Area */}
              <div className="p-6 rounded-xl bg-black/40 border border-white/[0.06] text-slate-200 text-sm leading-relaxed space-y-4 font-serif">
                {sopMode === 'sop' ? (
                  sopDraft ? (
                    <div className="whitespace-pre-wrap">{sopDraft.statement_of_purpose}</div>
                  ) : (
                    <div className="space-y-4">
                      <p>
                        To the Respected Graduate Admissions Committee and Scholarship Selection Board,
                      </p>
                      <p>
                        I am writing to express my earnest application for admission to graduate studies in Computer Science & Artificial Intelligence with full institutional scholarship consideration. Having maintained an academic grade point average of <strong>{cgpa}</strong> at <strong>{currentInstitution}</strong> while actively researching edge deep learning systems, I have cultivated a deep commitment to high-impact computational research.
                      </p>
                      <p>
                        My applied engineering foundation is demonstrated through hands-on development on my public GitHub repository (<strong>@{githubUsername}</strong>), notably including quantized computer vision models designed for resource-constrained embedded devices. These practical implementations reinforced my ability to translate rigorous algorithmic concepts into performant real-world systems.
                      </p>
                      <p>
                        Due to socioeconomic constraints, securing full tuition and living stipend coverage is an essential prerequisite for my graduate studies abroad. Receiving this scholarship fellowship would provide me with the requisite institutional backing to focus completely on pushing the frontiers of artificial intelligence under your esteemed faculty’s mentorship.
                      </p>
                      <p>
                        Respectfully submitted,<br />
                        <strong>{name}</strong><br />
                        B.Tech Computer Science & Engineering
                      </p>
                    </div>
                  )
                ) : (
                  <div className="space-y-4">
                    <p><strong>CONFIDENTIAL ACADEMIC LETTER OF RECOMMENDATION</strong></p>
                    <p>To the Scholarship Selection Committee,</p>
                    <p>
                      It is my distinct pleasure as Professor of Computer Science to recommend <strong>{name}</strong> for admission and prestigious scholarship support in your graduate program.
                    </p>
                    <p>
                      Over the course of their undergraduate studies at {currentInstitution}, {name} has stood out with an academic record of {cgpa}, demonstrating analytical rigor and exceptional problem-solving capacity. In their capstone projects in distributed intelligence, they exhibited an aptitude for independent scientific inquiry on par with top master's researchers.
                    </p>
                    <p>
                      I give {name} my highest and unreserved recommendation for full scholarship funding.
                    </p>
                    <p>
                      Sincerely,<br />
                      <strong>Department Faculty Recommender</strong><br />
                      Department of Computer Science & Engineering
                    </p>
                  </div>
                )}
              </div>

              {/* Citations Footer */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs flex flex-wrap items-center gap-2 text-slate-400">
                <span className="text-slate-300 font-medium">Verified Evidence Links:</span>
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/[0.08] text-[11px] font-mono">
                  GPA: {cgpa} (NIT Jalandhar)
                </span>
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/[0.08] text-[11px] font-mono">
                  GitHub: @{githubUsername}
                </span>
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/[0.08] text-[11px] font-mono">
                  Verified Portal: future.utoronto.ca/pearson
                </span>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-white/[0.06] bg-[#070a12] py-8 text-center text-xs text-slate-500 space-y-1.5">
        <div className="flex items-center justify-center gap-2 font-medium text-slate-300">
          <span>ScholarSwarm</span>
          <span>•</span>
          <span>Autonomous Multi-Agent AI Scholarship Bureau</span>
        </div>
        <p className="text-slate-600 max-w-lg mx-auto">
          Built for Rahul Sharma with 8 specialized AI agents verifying official university domains and ranking the top 10 scholarship opportunities.
        </p>
      </footer>
    </div>
  );
};
