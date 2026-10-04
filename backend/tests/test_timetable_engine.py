import pytest
from unittest.mock import MagicMock, AsyncMock, patch

from app.schemas.timetable import (
    ParsedTimetableDocument,
    ParsedTimeSlot,
    ParsedTimetableCell,
    CommitTimetableRequest,
    CommitEntryItem,
)
from app.services.ai_timetable_parser import AITimetableParser
from app.services.timetable_qa_service import TimetableQAService


@pytest.fixture
def sample_parsed_doc():
    slots = [
        ParsedTimeSlot(slot_number=1, name="Period 1", start_time="09:00", end_time="09:50"),
        ParsedTimeSlot(slot_number=2, name="Period 2", start_time="10:00", end_time="10:50"),
    ]
    cells = [
        ParsedTimetableCell(
            day_of_week=1,
            slot_number=1,
            subject_raw="Data Structures",
            teacher_raw="Prof. Rajesh Sharma",
            classroom_raw="Room 101",
        ),
        ParsedTimetableCell(
            day_of_week=1,
            slot_number=2,
            subject_raw="Database Management",
            teacher_raw="Prof. Vikram Joshi",
            classroom_raw="Room 102",
        ),
    ]
    return ParsedTimetableDocument(
        cohort_name="CSE-3A",
        department_name="Computer Science",
        semester=3,
        academic_year="2024-2028",
        time_slots=slots,
        cells=cells,
    )


@pytest.mark.asyncio
async def test_ai_parser_parsing():
    parser = AITimetableParser()
    parser.api_key = "test-gemini-key"
    parser.model_name = "gemini-3.5-flash"
    
    mock_json_response = (
        '{"cohort_name": "CSE-3B", "department_name": "CSE", "semester": 5, "academic_year": "2025-2026", '
        '"time_slots": [{"slot_number": 1, "name": "Period 1", "start_time": "09:00", "end_time": "09:50", "is_break": false}], '
        '"cells": [{"day_of_week": 1, "slot_number": 1, "subject_raw": "Math", "teacher_raw": "Prof. Smith", "classroom_raw": "101", "batch_raw": null}]}'
    )
    
    from google import genai
    with patch.object(genai, "Client") as MockClient:
        mock_instance = MagicMock()
        mock_response = MagicMock()
        mock_response.text = mock_json_response
        mock_instance.models.generate_content.return_value = mock_response
        MockClient.return_value = mock_instance
        
        result = await parser.parse_document(
            file_bytes=b"dummy pdf content",
            filename="timetable.pdf",
            content_type="application/pdf",
            default_cohort_name="CSE-3B",
            default_semester=5,
        )
        assert result.cohort_name == "CSE-3B"
        assert result.semester == 5
        assert len(result.time_slots) == 1
        assert len(result.cells) == 1
        assert result.cells[0].subject_raw == "Math"


@pytest.mark.asyncio
async def test_clash_detection_room_double_booking():
    qa = TimetableQAService()
    slots = [
        ParsedTimeSlot(slot_number=1, name="Period 1", start_time="09:00", end_time="09:50"),
    ]
    cells = [
        ParsedTimetableCell(day_of_week=1, slot_number=1, subject_raw="DS", teacher_raw="Teacher A", classroom_raw="Room 101"),
        ParsedTimetableCell(day_of_week=1, slot_number=1, subject_raw="OS", teacher_raw="Teacher B", classroom_raw="Room 101"),
    ]
    doc = ParsedTimetableDocument(
        cohort_name="CSE-3A",
        semester=3,
        academic_year="2024-2028",
        time_slots=slots,
        cells=cells,
    )

    mock_db = MagicMock()
    mock_db.teacher.find_many = AsyncMock(return_value=[])
    mock_db.subject.find_many = AsyncMock(return_value=[])
    mock_db.classroom.find_many = AsyncMock(return_value=[])
    mock_db.department.find_first = AsyncMock(return_value=None)
    mock_db.timetableentry.find_many = AsyncMock(return_value=[])

    with patch("app.services.timetable_qa_service.db", mock_db):
        staged = await qa.stage_and_validate(doc, tenant_id="tenant-1")
        assert staged.cohort_name == "CSE-3A"
        assert len(staged.staged_cells) == 2


@pytest.mark.asyncio
async def test_clash_detection_teacher_double_booking():
    qa = TimetableQAService()
    slots = [
        ParsedTimeSlot(slot_number=1, name="Period 1", start_time="09:00", end_time="09:50"),
    ]
    cells = [
        ParsedTimetableCell(day_of_week=1, slot_number=1, subject_raw="Math", teacher_raw="Prof. Raman", classroom_raw="Room 101"),
        ParsedTimetableCell(day_of_week=1, slot_number=1, subject_raw="Physics", teacher_raw="Prof. Raman", classroom_raw="Room 102"),
    ]
    doc = ParsedTimetableDocument(
        cohort_name="CSE-3A",
        semester=3,
        academic_year="2024-2028",
        time_slots=slots,
        cells=cells,
    )

    mock_db = MagicMock()
    mock_db.teacher.find_many = AsyncMock(return_value=[])
    mock_db.subject.find_many = AsyncMock(return_value=[])
    mock_db.classroom.find_many = AsyncMock(return_value=[])
    mock_db.department.find_first = AsyncMock(return_value=None)
    mock_db.timetableentry.find_many = AsyncMock(return_value=[])

    with patch("app.services.timetable_qa_service.db", mock_db):
        staged = await qa.stage_and_validate(doc, tenant_id="tenant-1")
        assert len(staged.staged_cells) == 2
