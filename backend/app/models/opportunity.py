from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class CriterionEvaluation(BaseModel):
    criterion: str # e.g. "Minimum CGPA / Academic Standing", "Target Degree Match", "Field Match", "Nationality / International Status", "Language Proficiency"
    requirement: str # e.g. "Requires equivalent to 75% or 3.0/4.0 GPA"
    student_value: str # e.g. "Candidate has 8.2/10 (approx 3.4/4.0)"
    status: Literal["MET", "NOT_MET", "PARTIAL", "UNKNOWN"]
    evidence_snippet: str # exact snippet extracted from the official page

class CandidateOpportunity(BaseModel):
    id: str
    title: str
    university_or_provider: str
    country: str
    degree_level: str
    field: str
    funding_type: str # e.g. "Full Tuition + Living Stipend", "Government Fellowship", "Partial Tuition Waiver"
    amount: str # e.g. "CAD $50,000/yr", "€934/month stipend + health insurance", "SGD $2,700/mo"
    deadline: Optional[str] = "Check official site"
    source_url: str
    official_domain: Optional[str] = None
    search_query_used: Optional[str] = None
    raw_page_snippet: Optional[str] = None

class VerifiedOpportunity(BaseModel):
    opportunity: CandidateOpportunity
    is_verified: bool = False
    http_status: int = 200
    verified_at: str
    official_domain_score: float = 1.0 # 1.0 for .edu/.gov/.ac/official, 0.7 for other
    criteria: List[CriterionEvaluation] = Field(default_factory=list)
    eligibility_score: float = 0.0 # 0 to 100
    is_eligible: bool = True
    rejection_reason: Optional[str] = None
    source_snippet: str = ""
    is_deadline_passed: bool = False
