# 🎓 ScholarSwarm — Official 5-Day Project Submission

**Project Title:** ScholarSwarm: Autonomous Multi-Agent AI Swarm for Zero-Debt Global Education  
**Candidate Case Study:** Rahul Sharma (8.2 CGPA B.Tech student, Dr. B.R. Ambedkar NIT Jalandhar)  
**Target:** 100% funded M.S. / Ph.D. scholarships in Canada, Germany, Singapore, and the UK  
**Author / GitHub:** [@Roshani108](https://github.com/Roshani108)  

---

## 📋 Complete Submission Checklist

| # | Required Deliverable | Status | Location / Link |
|---|----------------------|:------:|-----------------|
| **1** | **A GitHub repository with working code** | ✅ Ready | [github.com/Roshani108/Scholarswarm](https://github.com/Roshani108/Scholarswarm) |
| **2** | **A working website or local demo** | ✅ Ready | Live Render Deployment & Local Dev Scripts |
| **3** | **A 5-minute screen recording guide** | ✅ Ready | [03_SCREEN_RECORDING_SCRIPT.md](./03_SCREEN_RECORDING_SCRIPT.md) |
| **4** | **A simple diagram explaining how agents work** | ✅ Ready | [04_AGENT_ARCHITECTURE_DIAGRAM.md](./04_AGENT_ARCHITECTURE_DIAGRAM.md) |
| **5** | **Most interesting experiment & biggest challenge** | ✅ Ready | [05_EXPERIMENT_AND_CHALLENGE.md](./05_EXPERIMENT_AND_CHALLENGE.md) |

---

## 1. 💻 GitHub Repository with Working Code
* **Repository Link:** [https://github.com/Roshani108/Scholarswarm](https://github.com/Roshani108/Scholarswarm)
* **Codebase Highlights:**
  - **Clean Architecture:** Python FastAPI multi-agent swarm in `/backend`, modern React Vite in `/frontend`.
  - **No Monolithic Bloat:** 4 specialized autonomous agents (Profile Ingestor, Opportunity Finder, Eligibility Validator, Strategist Ranker).
  - **Automated Tests:** 100% passing pytest suite (`pytest tests/`).
  - **Zero Unverified Hallucinations:** Statement of Purpose and LOR generator strictly cites verified transcript facts and GitHub repository evidence.

---

## 2. 🌐 Working Website & Local Demo

### A. Live Cloud Deployment
* **Live Website URL:** [https://scholarswarm-backend-1prf.onrender.com](https://scholarswarm-backend-1prf.onrender.com)
* **Interactive API Documentation:** [https://scholarswarm-backend-1prf.onrender.com/docs](https://scholarswarm-backend-1prf.onrender.com/docs)
* **Features Live on Cloud:**
  - Distinct campus photo cards for all **Top 10 University & Scholarship programs**.
  - Direct **`Apply on Official Website ↗`** portal links for each university.
  - Interactive **Candidate Profile Switcher** (Rahul Sharma, Ananya Sen, Priya Nair) + custom profile editor.
  - **Application Deadline Calendar** and **1-Click PDF Report Export**.

### B. Local Demo Instructions (Run in 2 commands)
```bash
# Terminal 1: Backend
cd backend
python -m uvicorn app.main:app --port 8000 --reload

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

---

## 3. 🎥 5-Minute Screen Recording Video Guide
See [03_SCREEN_RECORDING_SCRIPT.md](./03_SCREEN_RECORDING_SCRIPT.md) for the second-by-second walkthrough to present:
1. **0:00 - 0:45:** The Problem — Rahul Sharma's dilemma (8.2 CGPA, limited funds, seeking full funding).
2. **0:45 - 1:45:** The Agent Swarm Execution — Ingestion, Search, Eligibility, and Ranking.
3. **1:45 - 3:00:** The Results — Top 10 photo cards, zero-debt breakdown, and direct application links.
4. **3:00 - 4:00:** SOP & LOR Generation — Evidence citations and zero hallucination proof.
5. **4:00 - 5:00:** Resilience & Architecture — Chaos mode, caching, and multi-tier fallbacks.

---

## 4. 🗺️ Agent Swarm Architecture Diagram
See [04_AGENT_ARCHITECTURE_DIAGRAM.md](./04_AGENT_ARCHITECTURE_DIAGRAM.md) for interactive Mermaid & ASCII diagrams showing how data flows between:
- **Agent 1 (Profile Ingestor):** Extracts GPA, skills, and GitHub repos.
- **Agent 2 (Opportunity Finder):** Discovers accredited programs across Canada, Germany, Singapore, and UK.
- **Agent 3 (Eligibility Validator):** Performs strict GPA and requirement filtering.
- **Agent 4 (Strategist Ranker):** Computes financial relief and composite match scores.

---

## 5. 🔬 Most Interesting Experiment & Biggest Technical Challenge
See [05_EXPERIMENT_AND_CHALLENGE.md](./05_EXPERIMENT_AND_CHALLENGE.md) for the detailed research write-up covering:
- **Most Interesting Experiment:** The *Zero-Hallucination Evidence Extraction & Dynamic Relief Index*.
- **Biggest Technical Challenge:** Real-time Web Scraping Resilience and Rate-Limit Bypass across 20+ university portals using a 3-layer tiered fallback.
