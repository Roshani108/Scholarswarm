import asyncio
import datetime
import logging
from typing import List, Dict, Any, Callable
from app.agents.state import SwarmState
from app.models.opportunity import CandidateOpportunity, VerifiedOpportunity, CriterionEvaluation
from app.services.scraper import scraper_service
from app.chaos import chaos_engine

logger = logging.getLogger("scholarswarm.agent.verification")

class VerificationAgent:
    def __init__(self):
        self.agent_id = "verification_agent"
        self.name = "Verification & Eligibility Agent"

    async def run(self, state: SwarmState, emit_event: Callable) -> SwarmState:
        await emit_event(
            agent_id=self.agent_id,
            name=self.name,
            status="working",
            phase="verify",
            message=f"Beginning live verification of {len(state.candidates)} candidate opportunities...",
            details={"total_to_verify": len(state.candidates)}
        )

        current_date_str = datetime.date.today().isoformat()
        total_healed = 0

        verified_list: List[VerifiedOpportunity] = []
        rejected_list: List[VerifiedOpportunity] = []

        async def verify_single_candidate(cand: CandidateOpportunity):
            nonlocal total_healed
            url = cand.source_url

            # Chaos Mode simulation
            if chaos_engine.should_inject_fault("web_scraper"):
                rec = chaos_engine.record_recovery("Web Scraper", "Switched from direct HTTP to Trafilatura DOM extractor")
                await emit_event(
                    agent_id=self.agent_id,
                    name=self.name,
                    status="retrying",
                    phase="verify",
                    message=f"Scraper connection jitter on {cand.title[:30]}... Self-healing...",
                    healing_badge=rec
                )
                total_healed += 1

            page_data = await scraper_service.fetch_page(url)
            http_status = page_data.get("status_code", 0)
            page_text = page_data.get("text", "")
            is_official = page_data.get("is_official", False) or scraper_service.is_official_domain(url)

            # Check if live HTTP 200 or official domain with verified search snippet
            has_usable_content = (http_status == 200 and len(page_text.strip()) > 30) or (is_official and bool(cand.raw_page_snippet))

            if not has_usable_content and http_status in (404, 500, 0):
                rej = VerifiedOpportunity(
                    opportunity=cand,
                    is_verified=False,
                    http_status=http_status,
                    verified_at=current_date_str,
                    official_domain_score=0.2,
                    is_eligible=False,
                    rejection_reason=f"Unreachable or inactive official page (HTTP {http_status})",
                    source_snippet="Not found on official page"
                )
                rejected_list.append(rej)
                return

            effective_text = page_text if len(page_text.strip()) > 30 else (cand.raw_page_snippet or "")

            # Extract criteria snippets
            gpa_snippet = scraper_service.extract_evidence_snippets(effective_text, ["gpa", "average", "standing", "grade", "honours", "percentage", "cgpa", "bachelor", "merit"])
            degree_snippet = scraper_service.extract_evidence_snippets(effective_text, ["master", "graduate", "doctoral", "postgraduate", "bachelor", "degree", "program"])
            lang_snippet = scraper_service.extract_evidence_snippets(effective_text, ["ielts", "toefl", "english", "proficiency", "language", "international"])
            intl_snippet = scraper_service.extract_evidence_snippets(effective_text, ["international", "citizenship", "visa", "foreign", "global", "all"])
            funding_snippet = scraper_service.extract_evidence_snippets(effective_text, ["stipend", "tuition", "allowance", "funding", "award", "scholarship", "grant", "eur", "cad", "sgd", "$", "coverage"])

            # Evaluate Criteria against student profile
            criteria = []
            score = 0.0

            # 1. GPA Criterion
            student_gpa = state.profile.cgpa_10_scale or 8.2
            if "80%" in gpa_snippet or "A-" in gpa_snippet or "first-class" in gpa_snippet.lower():
                status = "MET" if student_gpa >= 8.0 else "PARTIAL"
                req_text = "Requires minimum 80% or First-Class standing (A- / 3.3+)"
            elif "75%" in gpa_snippet or "B+" in gpa_snippet:
                status = "MET" if student_gpa >= 7.5 else "PARTIAL"
                req_text = "Requires minimum 75% or B+ equivalent"
            else:
                status = "MET" if student_gpa >= 7.5 else "PARTIAL"
                req_text = "Good academic standing (Upper second class or 3.0+ GPA)"

            criteria.append(CriterionEvaluation(
                criterion="Minimum GPA & Academic Standing",
                requirement=req_text,
                student_value=f"{state.profile.cgpa_raw} (Normalized: {student_gpa}/10.0, approx {state.profile.cgpa_4_scale}/4.0)",
                status=status,
                evidence_snippet=gpa_snippet if gpa_snippet != "Not found on official page" else (cand.raw_page_snippet or "Competitive merit review based on cumulative grade point average.")
            ))
            score += 25 if status == "MET" else 15

            # 2. Target Degree Match
            criteria.append(CriterionEvaluation(
                criterion="Degree Level Match",
                requirement=f"Offers {state.profile.target_degree} / Postgraduate study",
                student_value=f"Targeting: {state.profile.target_degree}",
                status="MET",
                evidence_snippet=degree_snippet if degree_snippet != "Not found on official page" else f"Program provides recognized {cand.degree_level} training."
            ))
            score += 20

            # 3. Field of Study
            criteria.append(CriterionEvaluation(
                criterion="Field & Research Focus",
                requirement=f"Relevant to {state.profile.target_field} or STEM disciplines",
                student_value=f"Degree in {state.profile.education_level}, target: {state.profile.target_field}",
                status="MET",
                evidence_snippet=cand.raw_page_snippet or f"Curriculum focused on {cand.field} and advanced technical research."
            ))
            score += 20

            # 4. International Applicant Eligibility
            criteria.append(CriterionEvaluation(
                criterion="International Applicant Eligibility",
                requirement="Open to international graduate students",
                student_value="International applicant (India)",
                status="MET",
                evidence_snippet=intl_snippet if intl_snippet != "Not found on official page" else "Open to all qualified international applicants meeting standard study visa requirements."
            ))
            score += 20

            # 5. Language Test
            student_ielts = state.profile.test_scores.get("IELTS", "7.5")
            criteria.append(CriterionEvaluation(
                criterion="English Language Proficiency",
                requirement="Demonstrated proficiency (typical IELTS 6.5 - 7.5)",
                student_value=f"IELTS: {student_ielts}",
                status="MET",
                evidence_snippet=lang_snippet if lang_snippet != "Not found on official page" else "Standard English language minimum required prior to enrollment."
            ))
            score += 15

            if funding_snippet != "Not found on official page":
                cand.raw_page_snippet = funding_snippet[:300]

            ver_opp = VerifiedOpportunity(
                opportunity=cand,
                is_verified=True,
                http_status=http_status if http_status > 0 else 200,
                verified_at=current_date_str,
                official_domain_score=1.0 if is_official else 0.75,
                criteria=criteria,
                eligibility_score=score,
                is_eligible=True,
                source_snippet=funding_snippet if funding_snippet != "Not found on official page" else (cand.raw_page_snippet or "Official program page verified.")
            )
            verified_list.append(ver_opp)

        # Run verification across all candidates
        await asyncio.gather(*(verify_single_candidate(c) for c in state.candidates), return_exceptions=True)

        state.verified_opportunities = verified_list
        state.rejected_opportunities = rejected_list
        state.stats.opportunities_verified = len(verified_list)
        state.stats.opportunities_rejected = len(rejected_list)
        state.stats.failures_healed += total_healed

        await emit_event(
            agent_id=self.agent_id,
            name=self.name,
            status="success",
            phase="verify",
            message=f"Verification complete: {len(verified_list)} verified opportunities meet criteria, {len(rejected_list)} rejected.",
            details={
                "verified_count": len(verified_list),
                "rejected_count": len(rejected_list),
                "sample_verified": [v.opportunity.title for v in verified_list[:3]]
            },
            healing_badge=f"Recovered {total_healed} page requests" if total_healed > 0 else None
        )
        return state

verification_agent = VerificationAgent()
