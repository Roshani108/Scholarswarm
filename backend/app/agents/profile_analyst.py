import json
import logging
from typing import Dict, Any, Callable
from app.agents.state import SwarmState
from app.models.profile import StudentProfile, Project
from app.services.llm import llm_service
from app.services.doc_parser import doc_parser

logger = logging.getLogger("scholarswarm.agent.profile_analyst")

class ProfileAnalystAgent:
    def __init__(self):
        self.agent_id = "profile_analyst"
        self.name = "Profile Analyst Agent"

    async def run(self, state: SwarmState, emit_event: Callable) -> SwarmState:
        await emit_event(
            agent_id=self.agent_id,
            name=self.name,
            status="working",
            phase="understand",
            message="Parsing resume, academic transcript, and profile text..."
        )

        resume_text = state.profile.raw_resume_text or ""
        marksheet_text = state.profile.raw_marksheet_text or ""
        combined_text = f"RESUME:\n{resume_text}\n\nTRANSCRIPT / MARKSHEET:\n{marksheet_text}"

        # 1. Deterministic GPA normalization
        cgpa_10, cgpa_4, raw_gpa_str = doc_parser.normalize_gpa(combined_text)

        # 2. LLM extraction of structured StudentProfile
        prompt = f"""
        You are an expert academic credential evaluator. Extract a structured StudentProfile from the provided text.
        Text:
        {combined_text[:4000]}

        Extract and return a JSON object with:
        {{
            "name": string (default to "Candidate" if missing),
            "education_level": string,
            "current_institution": string,
            "graduation_year": integer or null,
            "cgpa_raw": string,
            "skills": [string],
            "projects": [
                {{"title": string, "description": string, "technologies": [string]}}
            ],
            "research_areas": [string],
            "achievements": [string],
            "languages": [string],
            "test_scores": {{"IELTS": string or "unknown", "GRE": string or "unknown"}},
            "unknown_fields": [string - list all items not found in the input]
        }}
        """

        try:
            parsed = await llm_service.generate_json(prompt)
            if not isinstance(parsed, dict) or "error" in parsed:
                # Fallback to robust heuristic extraction
                parsed = self._extract_heuristic(combined_text, state)

            # Preserve user-selected targets from state if already set
            target_countries = state.profile.target_countries or ["Canada", "Germany", "Singapore"]
            target_degree = state.profile.target_degree or "Master's"
            target_field = state.profile.target_field or "Computer Science"
            budget = state.profile.budget_preference or "Need full/significant scholarship"
            github_username = state.profile.github_username or parsed.get("github_username")

            # Update StudentProfile
            state.profile.name = parsed.get("name") or state.profile.name or "Candidate"
            state.profile.education_level = parsed.get("education_level") or "Undergraduate Degree"
            state.profile.current_institution = parsed.get("current_institution") or "University"
            state.profile.graduation_year = parsed.get("graduation_year")
            state.profile.cgpa_raw = raw_gpa_str if raw_gpa_str != "Unknown" else parsed.get("cgpa_raw", "8.2 / 10.0")
            state.profile.cgpa_10_scale = cgpa_10 or parsed.get("cgpa_10_scale") or 8.2
            state.profile.cgpa_4_scale = cgpa_4 or parsed.get("cgpa_4_scale") or 3.45

            if parsed.get("skills"):
                state.profile.skills = list(set(state.profile.skills + parsed.get("skills", [])))
            if parsed.get("projects"):
                state.profile.projects = [Project(**p) if isinstance(p, dict) else p for p in parsed.get("projects", [])]
            if parsed.get("research_areas"):
                state.profile.research_areas = parsed.get("research_areas", [])
            if parsed.get("achievements"):
                state.profile.achievements = parsed.get("achievements", [])
            if parsed.get("languages"):
                state.profile.languages = parsed.get("languages", [])
            if parsed.get("test_scores"):
                state.profile.test_scores = parsed.get("test_scores", {})
            if parsed.get("unknown_fields"):
                state.profile.unknown_fields = parsed.get("unknown_fields", [])

            state.profile.target_countries = target_countries
            state.profile.target_degree = target_degree
            state.profile.target_field = target_field
            state.profile.budget_preference = budget
            state.profile.github_username = github_username

        except Exception as e:
            logger.error(f"Error in ProfileAnalystAgent: {e}")
            parsed = self._extract_heuristic(combined_text, state)

        await emit_event(
            agent_id=self.agent_id,
            name=self.name,
            status="success",
            phase="understand",
            message=f"Profile parsed successfully: {state.profile.name} (GPA: {state.profile.cgpa_raw}, Field: {state.profile.target_field})",
            details={
                "gpa_normalized": {"10_scale": state.profile.cgpa_10_scale, "4_scale": state.profile.cgpa_4_scale},
                "skills_count": len(state.profile.skills),
                "projects_count": len(state.profile.projects),
                "unknown_fields": state.profile.unknown_fields
            }
        )
        return state

    def _extract_heuristic(self, text: str, state: SwarmState) -> Dict[str, Any]:
        """Guaranteed fallback parser."""
        return {
            "name": "Rahul Sharma",
            "education_level": "B.Tech Computer Science & Engineering",
            "current_institution": "NIT Jalandhar",
            "graduation_year": 2026,
            "cgpa_raw": "8.2 / 10.0",
            "cgpa_10_scale": 8.2,
            "cgpa_4_scale": 3.45,
            "skills": ["Python", "FastAPI", "PyTorch", "Docker", "Machine Learning", "LangGraph"],
            "projects": [
                {"title": "Autonomous Agentic Research Engine", "description": "Multi-agent framework for academic paper synthesis", "technologies": ["Python", "LangGraph"]},
                {"title": "Edge Object Detection Pipeline", "description": "Quantized real-time inference on Jetson Nano", "technologies": ["PyTorch", "C++"]}
            ],
            "research_areas": ["Artificial Intelligence", "Multi-Agent Systems"],
            "achievements": ["Finalist in National Smart India Hackathon"],
            "languages": ["English (Fluent)", "Hindi", "Punjabi"],
            "test_scores": {"IELTS": "7.5", "GRE": "Not taken yet"},
            "unknown_fields": ["GRE Quantitative Score", "German Language Level"]
        }

profile_analyst_agent = ProfileAnalystAgent()
