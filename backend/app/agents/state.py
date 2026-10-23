from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.models.profile import StudentProfile
from app.models.opportunity import CandidateOpportunity, VerifiedOpportunity
from app.models.ranking import TopOpportunity
from app.models.application import SOPDraft
from app.models.audit import TrustReport
from app.models.events import AgentEvent, SwarmStats, SwarmPhase

class SwarmState(BaseModel):
    session_id: str
    profile: StudentProfile = Field(default_factory=StudentProfile)
    candidates: List[CandidateOpportunity] = Field(default_factory=list)
    verified_opportunities: List[VerifiedOpportunity] = Field(default_factory=list)
    rejected_opportunities: List[VerifiedOpportunity] = Field(default_factory=list)
    top_5: List[TopOpportunity] = Field(default_factory=list)
    sop_draft: Optional[SOPDraft] = None
    trust_report: Optional[TrustReport] = None
    stats: SwarmStats = Field(default_factory=SwarmStats)
    events: List[AgentEvent] = Field(default_factory=list)
    current_phase: SwarmPhase = "intake"
    is_paused: bool = False
    is_stopped: bool = False
    chaos_enabled: bool = False
    replan_count: int = 0
    selected_opportunity_id: Optional[str] = None
