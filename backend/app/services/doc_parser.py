import io
import re
import logging
from typing import Dict, Any, Optional, Tuple
from pypdf import PdfReader

logger = logging.getLogger("scholarswarm.doc_parser")

class DocumentParserService:
    def extract_text_from_bytes(self, file_bytes: bytes, filename: str) -> str:
        """Extracts text from PDF, TXT or raw markdown."""
        ext = filename.lower().split(".")[-1] if "." in filename else ""

        if ext == "pdf":
            try:
                reader = PdfReader(io.BytesIO(file_bytes))
                text_pages = []
                for idx, page in enumerate(reader.pages):
                    t = page.extract_text()
                    if t:
                        text_pages.append(t)
                full_text = "\n\n".join(text_pages)
                if len(full_text.strip()) > 30:
                    return full_text
            except Exception as e:
                logger.warning(f"pypdf extraction error for {filename}: {e}")

        # If plain text or fallback
        try:
            return file_bytes.decode("utf-8", errors="ignore")
        except Exception:
            return ""

    def normalize_gpa(self, raw_text: str) -> Tuple[Optional[float], Optional[float], str]:
        """
        Extracts and normalizes GPA from text.
        Returns: (cgpa_10_scale, cgpa_4_scale, raw_match_string)
        Common formats:
        - "8.2 / 10.0" -> 8.2 (10-scale) -> approx 3.45 (4-scale)
        - "3.7 / 4.0" -> 3.7 (4-scale) -> approx 8.8 (10-scale)
        - "82%" or "82 percent" -> 8.2 (10-scale) -> 3.45 (4-scale)
        """
        # 1. Match "X.XX / 10" or "CGPA: X.XX" or "8.2 CGPA"
        match_10 = re.search(r"(\b[6-9]\.\d{1,2}|10\.0?)\s*(?:/|out of)?\s*(?:10(?:\.0)?)?", raw_text, re.IGNORECASE)
        match_4 = re.search(r"(\b[2-3]\.\d{1,2}|4\.0?)\s*(?:/|out of)?\s*4(?:\.0)?", raw_text, re.IGNORECASE)
        match_pct = re.search(r"(\b[5-9]\d(?:\.\d+)?)\s*%", raw_text)

        if match_4:
            gpa_4 = float(match_4.group(1))
            gpa_10 = round((gpa_4 / 4.0) * 10.0, 2)
            return (gpa_10, gpa_4, f"{gpa_4} / 4.0")

        if match_10:
            val = float(match_10.group(1))
            if val <= 10.0:
                gpa_10 = val
                # Standard WES/credential conversion approx:
                # 8.0-8.9 in Indian 10-point scale maps typically to 3.3 - 3.7
                gpa_4 = round(min(4.0, max(1.0, (gpa_10 - 5.0) / 5.0 * 2.0 + 2.0)), 2)
                return (gpa_10, gpa_4, f"{gpa_10} / 10.0")

        if match_pct:
            pct = float(match_pct.group(1))
            gpa_10 = round(pct / 10.0, 2)
            gpa_4 = round(min(4.0, max(1.0, (pct - 50.0) / 50.0 * 2.0 + 2.0)), 2)
            return (gpa_10, gpa_4, f"{pct}%")

        return (None, None, "Unknown")

doc_parser = DocumentParserService()
