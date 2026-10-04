import io
import json
import re
from typing import Optional, Dict, Any

import pandas as pd
from app.core.config import settings
from app.core.logging_config import get_logger
from app.schemas.timetable import (
    ParsedTimetableDocument,
    ParsedTimeSlot,
    ParsedTimetableCell,
)

logger = get_logger("app.ai.timetable_parser")


class AITimetableParser:
    """Multimodal Gemini-powered timetable parser supporting PDF, Images, Excel, and CSV."""

    def __init__(self) -> None:
        self.api_key: str = settings.GEMINI_API_KEY.strip()
        self.model_name: str = settings.GEMINI_MODEL.strip()

    async def parse_document(
        self,
        file_bytes: bytes,
        filename: str,
        content_type: str,
        default_cohort_name: Optional[str] = None,
        default_semester: Optional[int] = None,
        default_academic_year: Optional[str] = None,
    ) -> ParsedTimetableDocument:
        """
        Parse any timetable document into a structured academic timetable schema.
        Raises an explicit ValueError if GEMINI_API_KEY or GEMINI_MODEL is missing.
        """
        if not self.api_key:
            raise ValueError(
                "GEMINI_API_KEY is not set in backend/.env. Please configure GEMINI_API_KEY to enable AI timetable parsing."
            )

        if not self.model_name:
            raise ValueError(
                "GEMINI_MODEL is not set in backend/.env. Please configure GEMINI_MODEL (e.g. gemini-3.5-flash)."
            )

        lower_name = filename.lower()
        extracted_text_prompt = ""

        # Preprocess tabular Excel/CSV if applicable to send structured markdown tables to Gemini
        if lower_name.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(file_bytes))
            extracted_text_prompt = f"Table Data (CSV format):\n{df.to_markdown()}"
        elif lower_name.endswith((".xlsx", ".xls")):
            excel_file = pd.ExcelFile(io.BytesIO(file_bytes))
            sheets_text = []
            for sheet_name in excel_file.sheet_names:
                df = excel_file.parse(sheet_name)
                sheets_text.append(f"Sheet: {sheet_name}\n{df.to_markdown()}")
            extracted_text_prompt = "\n\n".join(sheets_text)

        return await self._call_gemini(
            file_bytes=file_bytes,
            content_type=content_type,
            text_prompt=extracted_text_prompt,
            default_cohort_name=default_cohort_name,
            default_semester=default_semester,
            default_academic_year=default_academic_year,
        )

    async def _call_gemini(
        self,
        file_bytes: bytes,
        content_type: str,
        text_prompt: str,
        default_cohort_name: Optional[str],
        default_semester: Optional[int],
        default_academic_year: Optional[str],
    ) -> ParsedTimetableDocument:
        """Call Gemini API using the single configured model from .env with zero fallback models or mock injection."""
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=self.api_key)

        prompt_instruction = (
            "You are an expert academic timetable extraction system for universities, colleges, and schools.\n"
            "Analyze the provided timetable document (which may be a PDF grid, scanned image, or spreadsheet).\n"
            "Carefully parse all periods/slots, breaks, days of the week, subjects (with codes and names), faculty/teachers, classrooms/labs, and batch labels.\n"
            "Handle diverse formats including:\n"
            "- Multi-teacher / practical lab batches (e.g. 'RK', 'DHR / NF7', 'Batch A1', 'Group 1')\n"
            "- Electives or merged subjects (e.g. '2CEIT5PE18(MAD)', 'CN Lab')\n"
            "- Short breaks and lunch breaks (mark is_break: true)\n"
            "- Empty/free periods (do not emit cells for periods where no class is held)\n\n"
            "You MUST output the result strictly as a valid, single JSON object with this exact structure:\n"
            "{\n"
            '  "cohort_name": "string (e.g. B.Tech V IOT-A, CSE-3A, Class 10-B)",\n'
            '  "department_name": "string (e.g. Computer Science & Engineering, IT)",\n'
            '  "semester": 5,\n'
            '  "academic_year": "2025-2026",\n'
            '  "time_slots": [\n'
            '    {"slot_number": 1, "name": "Period 1", "start_time": "08:30", "end_time": "09:15", "is_break": false},\n'
            '    {"slot_number": 3, "name": "Short Break", "start_time": "10:00", "end_time": "10:10", "is_break": true}\n'
            "  ],\n"
            '  "cells": [\n'
            '    {\n'
            '      "day_of_week": 1,\n'
            '      "slot_number": 1,\n'
            '      "subject_raw": "2CEIT503(CN)",\n'
            '      "teacher_raw": "RK",\n'
            '      "classroom_raw": "1NB002",\n'
            '      "batch_raw": null\n'
            '    }\n'
            "  ]\n"
            "}\n\n"
            "Rules:\n"
            "1. day_of_week MUST be an integer: 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday, 7=Sunday.\n"
            "2. start_time and end_time MUST be 24-hour format string 'HH:MM' (e.g. '08:30', '14:00').\n"
            "3. If cohort, department, semester, or academic year are not explicitly written in the header, use context or fallback defaults: "
            f"Cohort: '{default_cohort_name or 'Main Cohort'}', Semester: {default_semester or 1}, Academic Year: '{default_academic_year or '2025-2026'}'.\n"
            "4. teacher_raw, classroom_raw, and batch_raw should be 'TBA' if not specified in a cell, but never null unless there is truly no teacher or room.\n"
            "5. Return ONLY the raw JSON object. No explanation, no markdown fence wrapping."
        )

        prompt_parts: List[Any] = [prompt_instruction]
        if text_prompt:
            prompt_parts.append(text_prompt)
        elif content_type in ["application/pdf", "image/png", "image/jpeg", "image/webp", "image/bmp"]:
            prompt_parts.append(
                types.Part.from_bytes(
                    data=file_bytes,
                    mime_type=content_type,
                )
            )

        logger.info("Calling Gemini model '%s' for timetable parsing...", self.model_name)
        response = client.models.generate_content(
            model=self.model_name,
            contents=prompt_parts,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.1,
            ),
        )

        response_text = response.text or "{}"
        clean_json = re.sub(r"^```json\s*", "", response_text, flags=re.MULTILINE)
        clean_json = re.sub(r"```\s*$", "", clean_json, flags=re.MULTILINE).strip()
        data = json.loads(clean_json)

        # Defensive normalization to support slight variance in model top-level keys
        if isinstance(data, list):
            data = {
                "cohort_name": default_cohort_name or "Main Cohort",
                "department_name": "General",
                "semester": default_semester or 1,
                "academic_year": default_academic_year or "2025-2026",
                "time_slots": [
                    {
                        "slot_number": i + 1,
                        "name": f"Period {i + 1}",
                        "start_time": f"{8 + i:02d}:00",
                        "end_time": f"{8 + i:02d}:50",
                        "is_break": False,
                    }
                    for i in range(8)
                ],
                "cells": data,
            }
        elif isinstance(data, dict):
            if "cells" not in data and "timetable" in data and isinstance(data["timetable"], list):
                data["cells"] = data["timetable"]
            if not data.get("cohort_name"):
                u_info = data.get("university_info", {})
                data["cohort_name"] = default_cohort_name or u_info.get("program_section") or "Main Cohort"
            if not data.get("semester"):
                data["semester"] = default_semester or 1
            if not data.get("academic_year"):
                data["academic_year"] = default_academic_year or "2025-2026"
            if not data.get("time_slots"):
                data["time_slots"] = [
                    {
                        "slot_number": i + 1,
                        "name": f"Period {i + 1}",
                        "start_time": f"{8 + i:02d}:00",
                        "end_time": f"{8 + i:02d}:50",
                        "is_break": False,
                    }
                    for i in range(8)
                ]

        # Clean cell mappings
        clean_cells = []
        for c in data.get("cells", []):
            if isinstance(c, dict):
                clean_cells.append(
                    {
                        "day_of_week": int(c.get("day_of_week", 1)),
                        "slot_number": int(c.get("slot_number", 1)),
                        "subject_raw": str(c.get("subject_raw") or c.get("subject") or "TBA"),
                        "teacher_raw": str(c.get("teacher_raw") or c.get("faculty") or c.get("teacher") or "TBA"),
                        "classroom_raw": str(c.get("classroom_raw") or c.get("room") or c.get("classroom") or "TBA"),
                        "batch_raw": c.get("batch_raw") or c.get("batch"),
                    }
                )
        data["cells"] = clean_cells

        return ParsedTimetableDocument.model_validate(data)
