export type AgentId =
  | 'supervisor'
  | 'profile_analyst'
  | 'profile_enricher'
  | 'research_scout'
  | 'verification_agent'
  | 'strategist_ranker'
  | 'application_writer'
  | 'critic_auditor';

export type NodeStatus = 'idle' | 'thinking' | 'working' | 'success' | 'retrying' | 'failed';

export type SwarmPhase =
  | 'intake'
  | 'understand'
  | 'enrich'
  | 'research'
  | 'verify'
  | 'rank'
  | 'draft'
  | 'audit'
  | 'completed'
  | 'error';

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  github_url?: string;
}

export interface EvidenceStrength {
  area: string;
  detail: string;
  source_url: string;
  confidence: number;
}

export interface StudentProfile {
  name: string;
  education_level: string;
  current_institution?: string;
  graduation_year?: number;
  cgpa_raw?: string;
  cgpa_10_scale?: number;
  cgpa_4_scale?: number;
  skills: string[];
  projects: Project[];
  research_areas: string[];
  achievements: string[];
  languages: string[];
  test_scores: Record<string, string>;
  target_countries: string[];
  target_degree: string;
  target_field: string;
  budget_preference: string;
  github_username?: string;
  portfolio_url?: string;
  linkedin_summary?: string;
  evidence_strengths: EvidenceStrength[];
  unknown_fields: string[];
}

export interface CriterionEvaluation {
  criterion: string;
  requirement: string;
  student_value: string;
  status: 'MET' | 'NOT_MET' | 'PARTIAL' | 'UNKNOWN';
  evidence_snippet: string;
}

export interface CandidateOpportunity {
  id: string;
  title: string;
  university_or_provider: string;
  country: string;
  degree_level: string;
  field: string;
  funding_type: string;
  amount: string;
  deadline?: string;
  source_url: string;
  search_query_used?: string;
  raw_page_snippet?: string;
}

export interface VerifiedOpportunity {
  opportunity: CandidateOpportunity;
  is_verified: boolean;
  http_status: number;
  verified_at: string;
  official_domain_score: number;
  criteria: CriterionEvaluation[];
  eligibility_score: number;
  is_eligible: boolean;
  rejection_reason?: string;
  source_snippet: string;
}

export interface RoadmapStep {
  step_number: number;
  title: string;
  target_date: string;
  action_items: string[];
}

export interface TopOpportunity {
  rank: number;
  opportunity: VerifiedOpportunity;
  fit_score: number;
  generosity_score: number;
  competitiveness: 'Reach' | 'Target' | 'Safe';
  why_it_fits: string;
  missing_items: string[];
  application_roadmap: RoadmapStep[];
}

export interface FactCheckClaim {
  sentence_or_claim: string;
  student_evidence: string;
  source_ref: string;
  is_verified: boolean;
}

export interface SOPDraft {
  opportunity_id: string;
  opportunity_title: string;
  target_institution: string;
  statement_of_purpose: string;
  letter_of_recommendation_template: string;
  required_documents: string[];
  fact_checks: FactCheckClaim[];
  word_count: number;
  generated_at: string;
  disclaimer: string;
}

export interface AuditWarning {
  severity: 'INFO' | 'WARNING' | 'HIGH';
  category: string;
  message: string;
  affected_item: string;
  action_suggested: string;
}

export interface SourceAuditEntry {
  opportunity_title: string;
  source_url: string;
  domain: string;
  is_official_domain: boolean;
  live_http_status: number;
}

export interface TrustReport {
  overall_confidence: number;
  audited_opportunities_count: number;
  verified_links_count: number;
  hallucination_risk: 'LOW' | 'MEDIUM' | 'HIGH';
  warnings: AuditWarning[];
  source_audit_list: SourceAuditEntry[];
  audited_at: string;
  auditor_verdict: string;
}

export interface SwarmStats {
  candidates_found: number;
  opportunities_verified: number;
  opportunities_rejected: number;
  failures_healed: number;
  current_replan_loop: number;
}

export interface AgentEvent {
  event_id: string;
  timestamp: string;
  agent_id: AgentId;
  agent_name: string;
  status: NodeStatus;
  phase: SwarmPhase;
  message: string;
  details?: Record<string, any>;
  stats?: SwarmStats;
  healing_badge?: string;
}

export interface SwarmState {
  session_id: string;
  profile: StudentProfile;
  candidates: CandidateOpportunity[];
  verified_opportunities: VerifiedOpportunity[];
  rejected_opportunities: VerifiedOpportunity[];
  top_5: TopOpportunity[];
  sop_draft?: SOPDraft;
  trust_report?: TrustReport;
  stats: SwarmStats;
  events: AgentEvent[];
  current_phase: SwarmPhase;
  chaos_enabled: boolean;
  replan_count: number;
  selected_opportunity_id?: string;
}

export interface DemoProfile {
  id: string;
  name: string;
  education_level: string;
  current_institution: string;
  graduation_year: number;
  cgpa: string;
  cgpa_10_scale: number;
  skills: string[];
  target_countries: string[];
  target_degree: string;
  target_field: string;
  budget: string;
  github_username: string;
  bio: string;
  test_scores: Record<string, string>;
}
