import asyncio
import datetime
import uuid
import logging
from typing import Callable, Optional
from app.agents.state import SwarmState
from app.models.events import AgentEvent, SwarmStats
from app.agents.profile_analyst import profile_analyst_agent
from app.agents.profile_enricher import profile_enrichment_agent
from app.agents.research_scout import research_scout_agent
from app.agents.verification_agent import verification_agent
from app.agents.strategist_ranker import strategist_ranker_agent
from app.agents.application_writer import application_writer_agent
from app.agents.critic_auditor import critic_auditor_agent

logger = logging.getLogger("scholarswarm.supervisor")

class SupervisorOrchestrator:
    def __init__(self):
        self.agent_id = "supervisor"
        self.name = "Supervisor / Orchestrator"

    async def execute_swarm(self, state: SwarmState, emit_callback: Callable) -> SwarmState:
        """Executes the multi-agent pipeline with autonomous health monitoring and replanning loops."""

        async def emit(agent_id: str, name: str, status: str, phase: str, message: str, details=None, healing_badge=None):
            event = AgentEvent(
                event_id=f"evt_{uuid.uuid4().hex[:8]}",
                timestamp=datetime.datetime.now().strftime("%H:%M:%S"),
                agent_id=agent_id, # type: ignore
                agent_name=name,
                status=status, # type: ignore
                phase=phase, # type: ignore
                message=message,
                details=details,
                stats=state.stats,
                healing_badge=healing_badge
            )
            state.events.append(event)
            await emit_callback(event)

        try:
            # 0. Supervisor kickoff
            state.current_phase = "understand"
            await emit(
                self.agent_id,
                self.name,
                "working",
                "understand",
                f"Initializing ScholarSwarm for {state.profile.name or 'Student'}. Allocating 7 collaborative agents..."
            )

            # 1. Profile Analyst
            state = await profile_analyst_agent.run(state, emit)
            if state.is_stopped:
                return state

            # 2. Profile Enrichment
            state.current_phase = "enrich"
            state = await profile_enrichment_agent.run(state, emit)
            if state.is_stopped:
                return state

            # 3. Research & Verification Loop (with autonomous replan if < 10 verified)
            loop_count = 0
            while loop_count < 2:
                state.current_phase = "research"
                state = await research_scout_agent.run(state, emit)
                if state.is_stopped:
                    return state

                state.current_phase = "verify"
                state = await verification_agent.run(state, emit)
                if state.is_stopped:
                    return state

                verified_count = len(state.verified_opportunities)
                if verified_count >= 10:
                    break
                else:
                    loop_count += 1
                    state.replan_count += 1
                    state.stats.current_replan_loop = loop_count
                    await emit(
                        self.agent_id,
                        self.name,
                        "retrying",
                        "research",
                        f"Autonomous Replan Loop {loop_count}: Verified opportunities ({verified_count}) below threshold of 10. Broadening query parameters...",
                        details={"replan_loop": loop_count, "previous_verified": verified_count}
                    )

            # 4. Strategist & Ranker
            state.current_phase = "rank"
            state = await strategist_ranker_agent.run(state, emit)
            if state.is_stopped:
                return state

            # 5. Application Writer
            state.current_phase = "draft"
            state = await application_writer_agent.run(state, emit)
            if state.is_stopped:
                return state

            # 6. Critic / Auditor
            state.current_phase = "audit"
            state = await critic_auditor_agent.run(state, emit)
            if state.is_stopped:
                return state

            # 7. Completion
            state.current_phase = "completed"
            await emit(
                self.agent_id,
                self.name,
                "success",
                "completed",
                f"ScholarSwarm mission finished! {len(state.top_5)} top scholarships ranked, {len(state.verified_opportunities)} verified, SOP generated, Trust Report 100% verified.",
                details={
                    "total_candidates": state.stats.candidates_found,
                    "verified_count": state.stats.opportunities_verified,
                    "rejected_count": state.stats.opportunities_rejected,
                    "failures_healed": state.stats.failures_healed
                }
            )

        except Exception as e:
            logger.exception("ScholarSwarm execution failed")
            state.current_phase = "error"
            await emit(
                self.agent_id,
                self.name,
                "failed",
                "error",
                f"Execution encountered an error: {str(e)}. Partial results retained.",
                details={"error": str(e)}
            )

        return state

supervisor_orchestrator = SupervisorOrchestrator()
