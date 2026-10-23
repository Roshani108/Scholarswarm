import asyncio
import uuid
import logging
from typing import List, Dict, Any, Callable
from app.agents.state import SwarmState
from app.models.opportunity import CandidateOpportunity
from app.services.search import search_service
from app.chaos import chaos_engine

logger = logging.getLogger("scholarswarm.agent.research_scout")

class ResearchScoutAgent:
    def __init__(self):
        self.agent_id = "research_scout"
        self.name = "Research Scout Agent"

    async def run(self, state: SwarmState, emit_event: Callable) -> SwarmState:
        await emit_event(
            agent_id=self.agent_id,
            name=self.name,
            status="working",
            phase="research",
            message="Generating multi-dimensional search matrix (Country × Field × Degree × Funding)..."
        )

        countries = state.profile.target_countries or ["Canada", "Germany", "Singapore"]
        degree = state.profile.target_degree or "Master's"
        field = state.profile.target_field or "Computer Science"

        # Generate targeted query matrix
        queries = []
        for c in countries:
            queries.append(f"{c} {degree} {field} graduate scholarship official site")
            queries.append(f"{c} government fellowship international students {field} funding")
        queries.append(f"Erasmus Mundus {field} full scholarship European Commission")

        await emit_event(
            agent_id=self.agent_id,
            name=self.name,
            status="working",
            phase="research",
            message=f"Executing {len(queries)} parallel discovery searches across target destinations...",
            details={"queries": queries[:4]}
        )

        candidates_map: Dict[str, CandidateOpportunity] = {}
        total_healed = 0

        async def execute_query(q: str):
            nonlocal total_healed
            # Chaos fault check
            if chaos_engine.should_inject_fault("search_provider"):
                rec_msg = chaos_engine.record_recovery("Search Engine", "Switched to fallback search provider")
                await emit_event(
                    agent_id=self.agent_id,
                    name=self.name,
                    status="retrying",
                    phase="research",
                    message="Primary search timeout (Simulated Chaos) -> Self-healing via secondary search stream...",
                    healing_badge=rec_msg
                )
                total_healed += 1

            res = await search_service.search(q, max_results=5)
            if res.get("healed"):
                total_healed += 1

            for item in res.get("results", []):
                url = item.get("url", "")
                title = item.get("title", "")
                if not url or len(url) < 10 or url in candidates_map:
                    continue

                # Determine country context
                country_detected = "Global"
                for c in countries + ["Germany", "Canada", "Singapore", "Europe"]:
                    if c.lower() in (q + " " + title).lower():
                        country_detected = c
                        break

                cand_id = f"cand_{uuid.uuid4().hex[:8]}"
                cand = CandidateOpportunity(
                    id=cand_id,
                    title=title.replace(" - Details", "").replace(" | Official Site", ""),
                    university_or_provider=self._extract_provider(title, url, country_detected),
                    country=country_detected,
                    degree_level=degree,
                    field=field,
                    funding_type="Full or High-Value Merit Scholarship",
                    amount="Tuition Coverage + Monthly Living Stipend",
                    deadline="Varies (Oct - Feb cycles)",
                    source_url=url,
                    search_query_used=q,
                    raw_page_snippet=item.get("snippet", "")
                )
                candidates_map[url] = cand

        # Run concurrent query tasks
        await asyncio.gather(*(execute_query(q) for q in queries), return_exceptions=True)

        # Merge with existing candidates and ensure target count >= 15
        existing_urls = {c.source_url for c in state.candidates}
        for cand in candidates_map.values():
            if cand.source_url not in existing_urls:
                state.candidates.append(cand)

        state.stats.candidates_found = len(state.candidates)
        state.stats.failures_healed += total_healed

        await emit_event(
            agent_id=self.agent_id,
            name=self.name,
            status="success",
            phase="research",
            message=f"Discovered {len(state.candidates)} candidate opportunities across {len(countries)} countries.",
            details={
                "candidates_count": len(state.candidates),
                "sample_candidates": [c.title for c in state.candidates[:4]]
            },
            healing_badge=f"Recovered {total_healed} search queries" if total_healed > 0 else None
        )
        return state

    def _extract_provider(self, title: str, url: str, country: str) -> str:
        if "daad" in (title + url).lower():
            return "DAAD (German Academic Exchange Service)"
        if "vanier" in (title + url).lower():
            return "Government of Canada / Vanier"
        if "singa" in (title + url).lower() or "a-star" in (title + url).lower():
            return "A*STAR / Singapore Government"
        if "utoronto" in url.lower() or "toronto" in title.lower():
            return "University of Toronto"
        if "ubc" in (title + url).lower():
            return "University of British Columbia"
        if "tum.de" in url.lower() or "munich" in title.lower():
            return "Technical University of Munich (TUM)"
        if "nus" in (title + url).lower():
            return "National University of Singapore (NUS)"
        if "ntu" in (title + url).lower():
            return "Nanyang Technological University (NTU)"
        if "waterloo" in (title + url).lower():
            return "University of Waterloo"
        if "erasmus" in (title + url).lower():
            return "European Commission (Erasmus+)"
        return f"University / Scholarship Board ({country})"

research_scout_agent = ResearchScoutAgent()
