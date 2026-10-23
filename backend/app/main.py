import asyncio
import json
import uuid
from typing import Dict, Optional, List, Any
from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from app.config import settings
from app.models.profile import StudentProfile
from app.agents.state import SwarmState
from app.models.events import AgentEvent
from app.agents.supervisor import supervisor_orchestrator
from app.services.doc_parser import doc_parser
from app.chaos import chaos_engine
from app.agents.application_writer import application_writer_agent

app = FastAPI(
    title="ScholarSwarm API",
    description="Multi-Agent AI Scholarship & University Program Finder",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session store & event queues
sessions: Dict[str, SwarmState] = {}
event_queues: Dict[str, asyncio.Queue] = {}

DEMO_PROFILES = {
    "rahul": {
        "id": "rahul",
        "name": "Rahul Sharma",
        "education_level": "Final-Year B.Tech Computer Science & Engineering",
        "current_institution": "Dr. B. R. Ambedkar National Institute of Technology (NIT) Jalandhar",
        "graduation_year": 2026,
        "cgpa": "8.2 / 10.0",
        "cgpa_10_scale": 8.2,
        "skills": ["Python", "FastAPI", "PyTorch", "Docker", "Machine Learning", "LangGraph", "PostgreSQL"],
        "target_countries": ["Canada", "Germany", "Singapore"],
        "target_degree": "Master of Science (M.S.)",
        "target_field": "Computer Science & Artificial Intelligence",
        "budget": "Need full scholarship or significant research stipend",
        "github_username": "rahul-cse",
        "bio": "Undergraduate developer specializing in autonomous AI agents and low-latency edge computing with limited family funds.",
        "test_scores": {"IELTS": "7.5 (Academic)", "GRE": "Not taken yet"}
    },
    "ananya_commerce": {
        "id": "ananya_commerce",
        "name": "Ananya Sen",
        "education_level": "Bachelor of Commerce (Honours in Finance)",
        "current_institution": "St. Xavier's College, Kolkata",
        "graduation_year": 2026,
        "cgpa": "8.8 / 10.0",
        "skills": ["Financial Modeling", "Python for Finance", "Econometrics", "R", "SQL", "Bloomberg Terminal"],
        "target_countries": ["Germany", "Canada", "Singapore"],
        "target_degree": "Master of Science (M.Sc.)",
        "target_field": "Quantitative Finance & Sustainable Economics",
        "budget": "Need merit tuition waiver or government grant",
        "github_username": "ananya-fintech",
        "bio": "Finance undergraduate focusing on green bond modeling and algorithmic portfolio optimization.",
        "test_scores": {"IELTS": "8.0", "GRE": "322"}
    },
    "priya_biotech": {
        "id": "priya_biotech",
        "name": "Priya Nair",
        "education_level": "B.Tech Biotechnology",
        "current_institution": "Vellore Institute of Technology (VIT)",
        "graduation_year": 2025,
        "cgpa": "8.5 / 10.0",
        "skills": ["CRISPR Design", "Bioinformatics", "Python", "Next-Gen Sequencing", "Molecular Cloning"],
        "target_countries": ["Germany", "Singapore", "Canada"],
        "target_degree": "Master of Science (M.Sc.) / Research Master",
        "target_field": "Computational Biology & Molecular Genomics",
        "budget": "Full DAAD / government fellowship preferred",
        "github_username": "priya-biotech",
        "bio": "Biotech researcher targeting German research universities (TUM, Heidelberg) for computational genomics.",
        "test_scores": {"IELTS": "7.5", "GRE": "Not taken yet"}
    }
}

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "ScholarSwarm Multi-Agent Swarm API",
        "docs_url": "/docs",
        "health_url": "/api/health",
        "demo_profiles_url": "/api/demo/profiles"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ScholarSwarm Backend",
        "providers": {
            "gemini_configured": bool(settings.GEMINI_API_KEY),
            "tavily_configured": bool(settings.TAVILY_API_KEY),
            "github_token_configured": bool(settings.GITHUB_TOKEN),
            "cache_enabled": settings.ENABLE_CACHE,
            "chaos_mode_enabled": chaos_engine.enabled
        }
    }

@app.get("/api/demo/profiles")
async def get_demo_profiles():
    return list(DEMO_PROFILES.values())

@app.post("/api/chaos/toggle")
async def toggle_chaos(payload: Dict[str, bool]):
    enabled = payload.get("enabled", not chaos_engine.enabled)
    chaos_engine.set_enabled(enabled)
    return {
        "chaos_enabled": chaos_engine.enabled,
        "faults_injected": chaos_engine.total_faults_injected,
        "recoveries": chaos_engine.total_recoveries
    }

@app.post("/api/swarm/start")
async def start_swarm(
    background_tasks: BackgroundTasks,
    name: str = Form("Rahul Sharma"),
    education_level: str = Form("Final-Year B.Tech CSE"),
    cgpa: str = Form("8.2 / 10.0"),
    target_countries: str = Form("Canada,Germany,Singapore"),
    target_degree: str = Form("Master's"),
    target_field: str = Form("Computer Science"),
    budget: str = Form("Need full scholarship"),
    github_username: Optional[str] = Form("rahul-cse"),
    raw_profile_text: Optional[str] = Form(None),
    chaos_mode: bool = Form(False),
    resume: Optional[UploadFile] = File(None),
    marksheet: Optional[UploadFile] = File(None),
):
    session_id = f"session_{uuid.uuid4().hex[:10]}"
    queue = asyncio.Queue()
    event_queues[session_id] = queue

    chaos_engine.set_enabled(chaos_mode)

    # Parse uploaded files
    resume_text = ""
    marksheet_text = ""
    if resume:
        res_bytes = await resume.read()
        resume_text = doc_parser.extract_text_from_bytes(res_bytes, resume.filename or "resume.pdf")
    if marksheet:
        mark_bytes = await marksheet.read()
        marksheet_text = doc_parser.extract_text_from_bytes(mark_bytes, marksheet.filename or "marksheet.pdf")

    if raw_profile_text and not resume_text:
        resume_text = raw_profile_text

    country_list = [c.strip() for c in target_countries.split(",") if c.strip()]
    cgpa_10, cgpa_4, norm_raw = doc_parser.normalize_gpa(cgpa + " " + resume_text)

    profile = StudentProfile(
        name=name,
        education_level=education_level,
        cgpa_raw=norm_raw if norm_raw != "Unknown" else cgpa,
        cgpa_10_scale=cgpa_10 or 8.2,
        cgpa_4_scale=cgpa_4 or 3.45,
        target_countries=country_list or ["Canada", "Germany", "Singapore"],
        target_degree=target_degree or "Master's",
        target_field=target_field or "Computer Science",
        budget_preference=budget,
        github_username=github_username,
        raw_resume_text=resume_text,
        raw_marksheet_text=marksheet_text
    )

    state = SwarmState(
        session_id=session_id,
        profile=profile,
        chaos_enabled=chaos_mode
    )
    sessions[session_id] = state

    async def emit_callback(event: AgentEvent):
        await queue.put(event)

    async def run_pipeline():
        await supervisor_orchestrator.execute_swarm(state, emit_callback)
        # Put sentinel event
        await queue.put(None)

    background_tasks.add_task(run_pipeline)

    return {"session_id": session_id, "status": "started", "chaos_mode": chaos_mode}

@app.get("/api/swarm/stream/{session_id}")
async def stream_swarm(session_id: str):
    if session_id not in event_queues:
        raise HTTPException(status_code=404, detail="Session not found")

    queue = event_queues[session_id]

    async def event_generator():
        while True:
            event = await queue.get()
            if event is None:
                # Swarm completed sentinel
                yield f"event: end\ndata: {json.dumps({'status': 'completed'})}\n\n"
                break
            payload = event.model_dump_json()
            yield f"event: agent_event\ndata: {payload}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@app.get("/api/swarm/state/{session_id}")
async def get_state(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    return sessions[session_id]

@app.post("/api/swarm/regenerate_sop")
async def regenerate_sop(payload: Dict[str, Any]):
    session_id = payload.get("session_id")
    opportunity_id = payload.get("opportunity_id")
    if not session_id or session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    state = sessions[session_id]
    queue = event_queues.get(session_id)

    async def dummy_emit(agent_id, name, status, phase, message, details=None, healing_badge=None):
        if queue:
            evt = AgentEvent(
                event_id=f"evt_{uuid.uuid4().hex[:8]}",
                timestamp="00:00:00",
                agent_id=agent_id,
                agent_name=name,
                status=status,
                phase=phase,
                message=message,
                details=details
            )
            await queue.put(evt)

    await application_writer_agent.run(state, dummy_emit, opportunity_id=opportunity_id)
    return state.sop_draft
