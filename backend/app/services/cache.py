import sqlite3
import json
import time
from typing import Optional, Any
from app.config import settings

class SQLiteCache:
    def __init__(self, db_path: str = settings.CACHE_DB_PATH):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        if not settings.ENABLE_CACHE:
            return
        conn = sqlite3.connect(self.db_path)
        try:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS search_cache (
                    query TEXT PRIMARY KEY,
                    results_json TEXT,
                    created_at REAL
                )
            """)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS page_cache (
                    url TEXT PRIMARY KEY,
                    status_code INTEGER,
                    title TEXT,
                    content_text TEXT,
                    created_at REAL
                )
            """)
            conn.commit()
        finally:
            conn.close()

    def get_search(self, query: str, max_age_seconds: int = 86400 * 7, force_fresh: bool = False) -> Optional[list]:
        if not settings.ENABLE_CACHE or force_fresh:
            return None
        conn = None
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT results_json, created_at FROM search_cache WHERE query = ?", (query.strip().lower(),))
            row = cursor.fetchone()
            if row:
                results_json, created_at = row
                if time.time() - created_at < max_age_seconds:
                    return json.loads(results_json)
        except Exception:
            pass
        finally:
            if conn:
                conn.close()
        return None

    def set_search(self, query: str, results: list):
        if not settings.ENABLE_CACHE:
            return
        conn = None
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute(
                "INSERT OR REPLACE INTO search_cache (query, results_json, created_at) VALUES (?, ?, ?)",
                (query.strip().lower(), json.dumps(results), time.time())
            )
            conn.commit()
        except Exception:
            pass
        finally:
            if conn:
                conn.close()

    def get_page(self, url: str, max_age_seconds: int = 86400 * 7, force_fresh: bool = False) -> Optional[dict]:
        if not settings.ENABLE_CACHE or force_fresh:
            return None
        conn = None
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT status_code, title, content_text, created_at FROM page_cache WHERE url = ?", (url.strip(),))
            row = cursor.fetchone()
            if row:
                status_code, title, content_text, created_at = row
                if time.time() - created_at < max_age_seconds:
                    return {
                        "url": url,
                        "status_code": status_code,
                        "title": title,
                        "text": content_text
                    }
        except Exception:
            pass
        finally:
            if conn:
                conn.close()
        return None

    def set_page(self, url: str, status_code: int, title: str, content_text: str):
        if not settings.ENABLE_CACHE:
            return
        conn = None
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute(
                "INSERT OR REPLACE INTO page_cache (url, status_code, title, content_text, created_at) VALUES (?, ?, ?, ?, ?)",
                (url.strip(), status_code, title, content_text, time.time())
            )
            conn.commit()
        except Exception:
            pass
        finally:
            if conn:
                conn.close()

cache = SQLiteCache()
