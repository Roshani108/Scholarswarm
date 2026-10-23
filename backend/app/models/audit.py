from typing import List, Literal, Dict, Any
from pydantic import BaseModel, Field

class AuditWarning(BaseModel):
    severity: Literal["INFO", "WARNING", "HIGH"]
    category: str # "DEADLINE", "ELIGIBILITY_GAP", "SOURCE_AUTH", "HALLUCINATION_CHECK"
    message: str
    affected_item: str
    action_suggested: str

class SourceAuditEntry(BaseModel):
    opportunity_title: str
    source_url: str
    domain: str
    is_official_domain: bool
    live_http_status: int

class TrustReport(BaseModel):
    overall_confidence: float # 0 - 100
    audited_opportunities_count: int
    verified_links_count: int
    hallucination_risk: Literal["LOW", "MEDIUM", "HIGH"]
    warnings: List[AuditWarning] = Field(default_factory=list)
    source_audit_list: List[SourceAuditEntry] = Field(default_factory=list)
    audited_at: str
    auditor_verdict: str
