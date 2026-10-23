import os
import yaml
import logging
from typing import List, Dict, Any, Optional
import httpx
from duckduckgo_search import DDGS
from app.config import settings
from app.services.cache import cache

logger = logging.getLogger("scholarswarm.search")

class SearchService:
    def __init__(self):
        self.tavily_key = settings.TAVILY_API_KEY
        self.sources_yaml_path = os.path.join(os.path.dirname(__file__), "..", "registry", "sources.yaml")
        self.registry = self._load_registry()

    def _load_registry(self) -> Dict[str, Any]:
        try:
            if os.path.exists(self.sources_yaml_path):
                with open(self.sources_yaml_path, "r", encoding="utf-8") as f:
                    return yaml.safe_load(f) or {}
        except Exception as e:
            logger.warning(f"Failed to load sources.yaml: {e}")
        return {}

    async def search(self, query: str, max_results: int = 5, force_fresh: bool = False) -> Dict[str, Any]:
        """
        Executes search with multi-tier fallback:
        Tier 1: Tavily API (if key configured)
        Tier 2: DuckDuckGo Search (automatic fallback)
        Tier 3: Curated Source Registry (guaranteed fallback)
        Returns: {"results": [...], "provider": "tavily"|"duckduckgo"|"registry", "healed": bool}
        """
        # Check cache
        cached = cache.get_search(query, force_fresh=force_fresh)
        if cached:
            return {"results": cached, "provider": "cache", "healed": False}

        results = []
        healed = False
        provider = "tavily"

        # Tier 1: Tavily
        if self.tavily_key:
            try:
                results = await self._search_tavily(query, max_results)
                if results:
                    cache.set_search(query, results)
                    return {"results": results, "provider": "tavily", "healed": False}
            except Exception as e:
                logger.warning(f"Tavily search failed for '{query}': {e}. Falling back to DuckDuckGo.")
                healed = True

        # Tier 2: DuckDuckGo
        try:
            provider = "duckduckgo"
            results = await self._search_duckduckgo(query, max_results)
            if results:
                cache.set_search(query, results)
                return {"results": results, "provider": "duckduckgo", "healed": healed or (self.tavily_key is not None and len(self.tavily_key) > 0)}
        except Exception as e:
            logger.warning(f"DuckDuckGo search failed for '{query}': {e}. Falling back to Curated Registry.")
            healed = True

        # Tier 3: Curated Registry Search
        provider = "registry"
        results = self._search_registry(query, max_results)
        cache.set_search(query, results)
        return {"results": results, "provider": "registry", "healed": True}

    async def _search_tavily(self, query: str, max_results: int) -> List[Dict[str, str]]:
        url = "https://api.tavily.com/search"
        payload = {
            "api_key": self.tavily_key,
            "query": query,
            "max_results": max_results,
            "search_depth": "advanced",
            "include_domains": ["edu", "gov", "ac.uk", "daad.de", "utoronto.ca", "ubc.ca", "uwaterloo.ca", "nus.edu.sg", "ntu.edu.sg", "a-star.edu.sg"],
        }
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                items = []
                for res in data.get("results", []):
                    items.append({
                        "title": res.get("title", ""),
                        "url": res.get("url", ""),
                        "snippet": res.get("content", ""),
                    })
                return items
        return []

    async def _search_duckduckgo(self, query: str, max_results: int) -> List[Dict[str, str]]:
        items = []
        try:
            ddgs = DDGS()
            raw_results = list(ddgs.text(query, max_results=max_results))
            for r in raw_results:
                items.append({
                    "title": r.get("title", ""),
                    "url": r.get("href", ""),
                    "snippet": r.get("body", ""),
                })
        except Exception as e:
            logger.warning(f"DDGS error: {e}")
        return items

    def _search_registry(self, query: str, max_results: int) -> List[Dict[str, str]]:
        """Fallback to curated YAML registry."""
        query_terms = [t.lower() for t in query.split() if len(t) > 2]
        matches = []
        portals_by_country = self.registry.get("portals_by_country", {})

        for country, programs in portals_by_country.items():
            for p in programs:
                score = 0
                search_text = f"{p.get('name', '')} {p.get('funding', '')} {p.get('field', '')} {country}".lower()
                for term in query_terms:
                    if term in search_text:
                        score += 1
                if score > 0 or country.lower() in query.lower():
                    matches.append((score, {
                        "title": f"{p.get('name')} ({country})",
                        "url": p.get("url", ""),
                        "snippet": f"{p.get('type')} - {p.get('funding')}. Requirements: {p.get('eligibility_summary')}",
                    }))

        # Sort by match score
        matches.sort(key=lambda x: x[0], reverse=True)
        results = [m[1] for m in matches[:max_results]]
        if not results:
            # Return standard global top scholarships if no terms matched
            results = [
                {
                    "title": "Singapore International Graduate Award (SINGA)",
                    "url": "https://www.a-star.edu.sg/Scholarships/for-graduate-studies/singapore-international-graduate-award-singa",
                    "snippet": "Full tuition coverage + SGD $2,700-$3,200 monthly stipend for international graduates in computing/sciences."
                },
                {
                    "title": "DAAD Development-Related Postgraduate Courses (EPOS) Germany",
                    "url": "https://www.daad.de/en/information-services-for-higher-education-institutions/further-information-on-daad-programmes/epos/",
                    "snippet": "Full German government scholarship covering monthly stipend €934 + health insurance for international master students."
                },
                {
                    "title": "Vanier Canada Graduate Scholarships",
                    "url": "https://vanier.gc.ca/en/home-accueil.html",
                    "snippet": "CAD $50,000 per year for high-achieving doctoral and master-to-PhD researchers in Canada."
                }
            ]
        return results

search_service = SearchService()
