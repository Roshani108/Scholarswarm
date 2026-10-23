import re
import logging
from typing import Dict, Any, Optional, List
import httpx
from bs4 import BeautifulSoup
import trafilatura
from app.services.cache import cache

logger = logging.getLogger("scholarswarm.scraper")

OFFICIAL_TLDS = [
    ".edu", ".gov", ".ac.", ".edu.", ".gc.ca", ".daad.de", ".tum.de", 
    ".utoronto.ca", ".ubc.ca", ".uwaterloo.ca", ".nus.edu.sg", ".ntu.edu.sg", 
    ".a-star.edu.sg", ".europa.eu", ".gov.on.ca", ".boell.de", ".deutschlandstipendium.de"
]

class ScraperService:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Sec-Ch-Ua": '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
            "Sec-Ch-Ua-Mobile": "?0",
            "Sec-Ch-Ua-Platform": '"Windows"',
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1"
        }

    def is_official_domain(self, url: str) -> bool:
        lower_url = url.lower()
        return any(tld in lower_url for tld in OFFICIAL_TLDS)

    async def fetch_page(self, url: str, force_fresh: bool = False, timeout_seconds: float = 10.0) -> Dict[str, Any]:
        """Fetches a page asynchronously, extracts clean text via trafilatura + bs4 fallback, and caches results."""
        # 1. Check cache
        cached = cache.get_page(url, force_fresh=force_fresh)
        if cached:
            return cached

        # 2. Scrape live
        try:
            async with httpx.AsyncClient(timeout=timeout_seconds, follow_redirects=True, headers=self.headers, verify=False) as client:
                resp = await client.get(url)
                status_code = resp.status_code
                is_official = self.is_official_domain(url)

                if status_code != 200:
                    result = {
                        "url": url,
                        "status_code": status_code,
                        "title": f"HTTP {status_code}",
                        "text": "",
                        "is_official": is_official
                    }
                    return result

                html = resp.text

                # Trafilatura extract
                text_content = trafilatura.extract(html, include_links=False, include_tables=True) or ""

                # BeautifulSoup title and fallback text
                soup = BeautifulSoup(html, "html.parser")
                title = soup.title.string.strip() if soup.title and soup.title.string else url

                if not text_content or len(text_content.strip()) < 100:
                    for tag in soup(["script", "style", "nav", "footer", "header", "noscript"]):
                        tag.decompose()
                    text_content = soup.get_text(separator="\n", strip=True)

                text_content = text_content[:15000]

                result = {
                    "url": url,
                    "status_code": status_code,
                    "title": title,
                    "text": text_content,
                    "is_official": is_official
                }
                cache.set_page(url, status_code, title, text_content)
                return result

        except Exception as e:
            logger.warning(f"Error scraping {url}: {e}")
            return {
                "url": url,
                "status_code": 0,
                "title": "Connection Failed",
                "text": "",
                "is_official": self.is_official_domain(url),
                "error": str(e)
            }

    def extract_evidence_snippets(self, text: str, keywords: List[str], max_snippets: int = 3) -> str:
        """Finds sentences containing keywords to provide factual evidence citations."""
        if not text:
            return "Not found on official page"

        sentences = re.split(r"(?<=[.!?])\s+", text)
        matched = []
        for s in sentences:
            s_clean = s.strip().replace("\n", " ")
            if len(s_clean) < 15 or len(s_clean) > 300:
                continue
            if any(k.lower() in s_clean.lower() for k in keywords):
                matched.append(s_clean)
                if len(matched) >= max_snippets:
                    break

        if matched:
            return " ... ".join(matched)
        return "Not found on official page"

scraper_service = ScraperService()
