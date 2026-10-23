import pytest
import asyncio
from app.services.doc_parser import doc_parser
from app.services.search import search_service
from app.chaos import chaos_engine
from app.models.profile import StudentProfile
from app.models.opportunity import CandidateOpportunity
from app.agents.state import SwarmState
from app.agents.profile_analyst import profile_analyst_agent
from app.agents.verification_agent import verification_agent

def test_gpa_normalization_10_scale():
    text = "Candidate completed B.Tech with 8.2 / 10.0 CGPA"
    cgpa_10, cgpa_4, raw = doc_parser.normalize_gpa(text)
    assert cgpa_10 == 8.2
    assert cgpa_4 is not None
    assert cgpa_4 > 3.0

def test_gpa_normalization_4_scale():
    text = "Graduated with 3.75 / 4.0 GPA from university"
    cgpa_10, cgpa_4, raw = doc_parser.normalize_gpa(text)
    assert cgpa_4 == 3.75
    assert cgpa_10 is not None
    assert cgpa_10 > 9.0

def test_gpa_normalization_percentage():
    text = "Academic aggregate score: 84.5%"
    cgpa_10, cgpa_4, raw = doc_parser.normalize_gpa(text)
    assert cgpa_10 == 8.45

@pytest.mark.asyncio
async def test_search_service_fallback_and_recovery():
    # Test fallback to duckduckgo / registry
    res = await search_service.search("Canada graduate computer science scholarship", max_results=3)
    assert "results" in res
    assert len(res["results"]) > 0
    assert "provider" in res

def test_chaos_engine_fault_injection():
    chaos_engine.set_enabled(True)
    chaos_engine.failure_rate = 1.0 # Guarantee trigger
    injected = chaos_engine.should_inject_fault("test_unit")
    assert injected is True
    rec_msg = chaos_engine.record_recovery("test_unit", "automatic failover test")
    assert "Self-Healed" in rec_msg
    assert chaos_engine.total_recoveries >= 1
    chaos_engine.set_enabled(False)

@pytest.mark.asyncio
async def test_verification_agent_evaluation():
    profile = StudentProfile(
        name="Test Candidate",
        education_level="B.Tech Computer Science",
        cgpa_raw="8.2 / 10.0",
        cgpa_10_scale=8.2,
        cgpa_4_scale=3.45,
        target_countries=["Germany"],
        target_degree="Master's",
        target_field="Computer Science"
    )
    cand = CandidateOpportunity(
        id="cand_test_1",
        title="DAAD EPOS German Master Scholarship",
        university_or_provider="DAAD",
        country="Germany",
        degree_level="Master's",
        field="Computer Science",
        funding_type="Full scholarship",
        amount="€934/month + travel",
        source_url="https://www.daad.de/en/",
        raw_page_snippet="Offers full funding for master degrees with minimum GPA requirements."
    )
    state = SwarmState(session_id="test_sess", profile=profile, candidates=[cand])

    async def dummy_emit(**kwargs):
        pass

    state = await verification_agent.run(state, dummy_emit)
    assert len(state.verified_opportunities) >= 1
    ver = state.verified_opportunities[0]
    assert ver.is_verified is True
    assert ver.eligibility_score > 50
