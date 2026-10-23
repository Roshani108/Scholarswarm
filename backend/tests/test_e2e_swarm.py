import pytest
from app.agents.state import SwarmState
from app.models.profile import StudentProfile, Project
from app.agents.supervisor import supervisor_orchestrator

@pytest.mark.asyncio
async def test_end_to_end_swarm_pipeline():
    profile = StudentProfile(
        name="Rahul Sharma",
        education_level="B.Tech Computer Science & Engineering",
        current_institution="NIT Jalandhar",
        cgpa_raw="8.2 / 10.0",
        cgpa_10_scale=8.2,
        cgpa_4_scale=3.45,
        target_countries=["Canada", "Germany", "Singapore"],
        target_degree="Master's",
        target_field="Computer Science & AI",
        budget_preference="Need full scholarship or research stipend",
        github_username="rahul-cse",
        skills=["Python", "FastAPI", "Machine Learning", "PyTorch"],
        projects=[
            Project(
                title="Autonomous Agent Research Engine",
                description="Multi-agent paper synthesis pipeline",
                technologies=["Python", "LangGraph"],
                github_url="https://github.com/rahul-cse/agentic-research"
            )
        ]
    )

    state = SwarmState(session_id="test_e2e_session", profile=profile)
    events_collected = []

    async def emit_callback(event):
        events_collected.append(event)

    final_state = await supervisor_orchestrator.execute_swarm(state, emit_callback)

    assert final_state.current_phase == "completed"
    assert len(events_collected) >= 7
    assert len(final_state.verified_opportunities) >= 5
    assert len(final_state.top_5) == 5
    assert final_state.sop_draft is not None
    assert final_state.sop_draft.word_count > 100
    assert len(final_state.sop_draft.fact_checks) >= 3
    assert final_state.trust_report is not None
    assert final_state.trust_report.overall_confidence >= 80.0
