from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Project(BaseModel):
    title: str
    description: str
    technologies: List[str] = Field(default_factory=list)
    github_url: Optional[str] = None
    evidence_source: Optional[str] = None

class Publication(BaseModel):
    title: str
    venue: Optional[str] = None
    year: Optional[int] = None
    link: Optional[str] = None

class EvidenceStrength(BaseModel):
    area: str
    detail: str
    source_url: str
    confidence: float = 1.0

class StudentProfile(BaseModel):
    name: str = "Candidate"
    email: Optional[str] = None
    education_level: str = "Undergraduate"
    current_institution: Optional[str] = None
    graduation_year: Optional[int] = None
    cgpa_raw: Optional[str] = None
    cgpa_10_scale: Optional[float] = None
    cgpa_4_scale: Optional[float] = None
    skills: List[str] = Field(default_factory=list)
    projects: List[Project] = Field(default_factory=list)
    research_areas: List[str] = Field(default_factory=list)
    publications: List[Publication] = Field(default_factory=list)
    achievements: List[str] = Field(default_factory=list)
    languages: List[str] = Field(default_factory=list)
    test_scores: Dict[str, str] = Field(default_factory=dict) # e.g. {"IELTS": "7.5", "GRE": "320"}
    target_countries: List[str] = Field(default_factory=list) # e.g. ["Canada", "Germany", "Singapore"]
    target_degree: str = "Master's" # e.g. M.S., Ph.D.
    target_field: str = "Computer Science"
    budget_preference: str = "Need full/significant scholarship"
    github_username: Optional[str] = None
    portfolio_url: Optional[str] = None
    linkedin_summary: Optional[str] = None
    evidence_strengths: List[EvidenceStrength] = Field(default_factory=list)
    unknown_fields: List[str] = Field(default_factory=list)
    raw_resume_text: Optional[str] = None
    raw_marksheet_text: Optional[str] = None
