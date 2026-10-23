from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # API Keys (all optional with graceful fallbacks)
    GEMINI_API_KEY: Optional[str] = ""
    OPENAI_API_KEY: Optional[str] = ""
    GROQ_API_KEY: Optional[str] = ""
    TAVILY_API_KEY: Optional[str] = ""
    GITHUB_TOKEN: Optional[str] = ""

    # Models & Providers
    PRIMARY_LLM_PROVIDER: str = "gemini" # gemini, openai, groq, heuristic
    PRIMARY_LLM_MODEL: str = "gemini-2.0-flash"
    SECONDARY_LLM_MODEL: str = "gemini-1.5-flash"

    # Search provider
    SEARCH_PRIMARY: str = "tavily" # tavily or duckduckgo
    SEARCH_FALLBACK: str = "duckduckgo"

    # System configurations
    MIN_VERIFIED_OPPORTUNITIES: int = 10
    CANDIDATES_HARVEST_TARGET: int = 15
    ENABLE_CACHE: bool = True
    CACHE_DB_PATH: str = "scholar_cache.db"
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
