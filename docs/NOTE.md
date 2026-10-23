# Engineering Notes: ScholarSwarm

**Author:** [Add Your Name / Team Name Here]  
**Date:** October 2026  
**Project:** ScholarSwarm Multi-Agent Architecture  

---

### The Most Interesting Experiment: Adversarial Verification Loops
The most fascinating technical experiment in ScholarSwarm was pitting the **Verification Agent** and **Critic Agent** against the candidate harvesting pipeline. Early multi-agent setups frequently suffer from "cooperative hallucination"—where one agent proposes an outdated scholarship (e.g., an expired 2021 deadline) and downstream agents blindly write an SOP for it. 

To break this, we implemented an adversarial verification protocol: the Verification Agent refuses to trust search engine summaries and instead directly fetches the live HTML from `.edu` and `.gov` root domains. It parses the actual page text using Trafilatura to confirm minimum GPA formulas and active funding cycles. If a site responds with an HTTP error or if the criteria cannot be backed by an exact quote, the opportunity is rejected immediately. Watching the Critic agent audit the final SOP by cross-referencing each sentence against the student’s GitHub repository links proved that multi-agent systems can achieve near-zero hallucination rates when strict evidence citations are enforced as state invariants.

---

### The Biggest Technical Challenge: Dynamic Real-World Scraping & Self-Healing
Our biggest obstacle was the unpredictability of real university and government scholarship pages. Educational portals employ wildly disparate HTML layouts, anti-bot Cloudflare challenges, and fragmented PDF attachments. A simple `requests` call routinely failed with HTTP 403 or yielded 200 KB of irrelevant navigation menus. 

We solved this through a resilient 3-tier cascade:
1. Browser-profiled async `httpx` with `Trafilatura` article extraction;
2. DOM fallback with script/style decomposition using `BeautifulSoup`;
3. A fallback registry seeded with known official portals.

When we introduced **Chaos Mode** to intentionally sabotage network requests during live testing, watching the supervisor self-heal by switching search streams in under 800ms was the defining technical breakthrough of this project.

---

### Personal Reflections
*[Personalize this section: Add a short paragraph about your personal journey building this hackathon project, what you learned about LLM orchestration, and your vision for democratizing international education access.]*
