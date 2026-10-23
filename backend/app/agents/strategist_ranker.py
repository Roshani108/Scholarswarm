import logging
from typing import List, Callable
from app.agents.state import SwarmState
from app.models.ranking import TopOpportunity, RoadmapStep
from app.models.opportunity import VerifiedOpportunity

logger = logging.getLogger("scholarswarm.agent.strategist")

class StrategistRankerAgent:
    def __init__(self):
        self.agent_id = "strategist_ranker"
        self.name = "Strategist / Ranker Agent"

    async def run(self, state: SwarmState, emit_event: Callable) -> SwarmState:
        await emit_event(
            agent_id=self.agent_id,
            name=self.name,
            status="working",
            phase="rank",
            message=f"Evaluating and ranking {len(state.verified_opportunities)} verified opportunities on fit, generosity, and admit probability..."
        )

        candidates = [v for v in state.verified_opportunities if v.is_eligible]
        if not candidates:
            candidates = state.verified_opportunities

        scored_items = []
        for v in candidates:
            opp = v.opportunity
            country = opp.country
            title = opp.title.lower()

            # Generosity scoring
            if "singa" in title or "vanier" in title or "epos" in title or "full" in opp.funding_type.lower():
                generosity = 96.0
            elif "stipend" in opp.funding_type.lower() or "fellowship" in title:
                generosity = 88.0
            else:
                generosity = 78.0

            # Fit scoring based on student profile
            fit = 85.0
            if any(c.lower() in country.lower() for c in state.profile.target_countries):
                fit += 8.0
            if any(k.lower() in (opp.field + " " + opp.title).lower() for k in ["computer", "ai", "intelligence", "informatics"]):
                fit += 5.0
            fit = min(98.0, fit)

            # Competitiveness categorization
            if "vanier" in title or "singa" in title:
                competitiveness = "Reach"
            elif "tum" in title or "utoronto" in title or "ubc" in title:
                competitiveness = "Target"
            else:
                competitiveness = "Safe"

            # Composite ranking score
            composite = (fit * 0.45) + (generosity * 0.35) + (v.eligibility_score * 0.20)
            scored_items.append((composite, fit, generosity, competitiveness, v))

        # Sort descending by composite score
        scored_items.sort(key=lambda x: x[0], reverse=True)
        top_candidates = scored_items[:5]

        top_5_list: List[TopOpportunity] = []
        for rank, (composite, fit, generosity, competitiveness, v_opp) in enumerate(top_candidates, start=1):
            title = v_opp.opportunity.title
            country = v_opp.opportunity.country

            why_it_fits = (
                f"Directly matches your {state.profile.education_level} background and {state.profile.cgpa_raw} GPA. "
                f"Your hands-on projects in {', '.join([p.title for p in state.profile.projects[:2]])} provide concrete "
                f"evidence for their faculty research priorities. Generous funding ({v_opp.opportunity.amount}) covers "
                f"financial requirements without personal debt."
            )

            missing_items = [
                "2 Letters of Academic Recommendation (from department professors)",
                "Official sealed university transcripts & degree certificate",
                f"Valid English Language Test Score (IELTS current: {state.profile.test_scores.get('IELTS', '7.5')})",
                "Updated CV with GitHub project repository hyperlinks",
            ]
            if country == "Germany":
                missing_items.append("APS India Certificate (mandatory for visa application to Germany)")
            elif country == "Canada":
                missing_items.append("Statement of Research Intent tailored to faculty lab openings")

            roadmap = [
                RoadmapStep(
                    step_number=1,
                    title="Profile & Document Attestation",
                    target_date="Within 14 Days",
                    action_items=[
                        "Order official university transcripts",
                        "Brief two faculty recommenders on scholarship targets"
                    ]
                ),
                RoadmapStep(
                    step_number=2,
                    title="SOP & Research Pitch Finalization",
                    target_date="Within 30 Days",
                    action_items=[
                        "Adapt ScholarSwarm SOP draft to faculty research focus",
                        "Review portfolio links and project README files"
                    ]
                ),
                RoadmapStep(
                    step_number=3,
                    title="Application Submission",
                    target_date="Before Priority Deadline",
                    action_items=[
                        "Submit official portal application form",
                        "Verify application fee waiver or submit receipt"
                    ]
                )
            ]

            top_5_list.append(TopOpportunity(
                rank=rank,
                opportunity=v_opp,
                fit_score=round(fit, 1),
                generosity_score=round(generosity, 1),
                competitiveness=competitiveness,
                why_it_fits=why_it_fits,
                missing_items=missing_items,
                application_roadmap=roadmap
            ))

        state.top_5 = top_5_list

        await emit_event(
            agent_id=self.agent_id,
            name=self.name,
            status="success",
            phase="rank",
            message=f"Selected TOP 5 strategic scholarship matches across {', '.join(set([t.opportunity.opportunity.country for t in top_5_list]))}.",
            details={"top_5": [{"rank": t.rank, "title": t.opportunity.opportunity.title, "fit": t.fit_score} for t in top_5_list]}
        )
        return state

strategist_ranker_agent = StrategistRankerAgent()
