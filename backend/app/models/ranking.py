from typing import List, Optional, Literal
from pydantic import BaseModel, Field
from app.models.opportunity import VerifiedOpportunity

class RoadmapStep(BaseModel):
    step_number: int
    title: str
    target_date: str
    action_items: List[str]

class TopOpportunity(BaseModel):
    rank: int
    opportunity: VerifiedOpportunity
    fit_score: float # 0 - 100
    generosity_score: float # 0 - 100
    competitiveness: Literal["Reach", "Target", "Safe"]
    why_it_fits: str
    missing_items: List[str] = Field(default_factory=list)
    application_roadmap: List[RoadmapStep] = Field(default_factory=list)
