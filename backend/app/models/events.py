from typing import Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

AgentId = Literal[
    "supervisor",
    "profile_analyst",
    "profile_enricher",
    "research_scout",
    "verification_agent",
    "strategist_ranker",
    "application_writer",
    "critic_auditor"
]

NodeStatus = Literal["idle", "thinking", "working", "success", "retrying", "failed"]

SwarmPhase = Literal[
    "intake",
    "understand",
    "enrich",
    "research",
    "verify",
    "rank",
    "draft",
    "audit",
    "completed",
    "error"
]

class SwarmStats(BaseModel):
    candidates_found: int = 0
    opportunities_verified: int = 0
    opportunities_rejected: int = 0
    failures_healed: int = 0
    current_replan_loop: int = 0

class AgentEvent(BaseModel):
    event_id: str
    timestamp: str
    agent_id: AgentId
    agent_name: str
    status: NodeStatus
    phase: SwarmPhase
    message: str
    details: Optional[Dict[str, Any]] = None
    stats: Optional[SwarmStats] = None
    healing_badge: Optional[str] = None # e.g. "Fallback to DuckDuckGo activated"
