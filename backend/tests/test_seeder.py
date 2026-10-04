import pytest
from unittest.mock import AsyncMock, MagicMock
from scripts.seeder.data_generator import (
    generate_institution_data,
    get_preset_departments,
    get_preset_designations,
    get_preset_classrooms,
    get_preset_subjects,
    generate_teacher_payload,
    generate_student_payload,
    generate_leave_payload,
)
from scripts.seeder.client import ApiClient, SeederApiError


def test_data_generator_validity():
    inst = generate_institution_data()
    assert "name" in inst
    assert "slug" in inst
    assert inst["type"] in ("COLLEGE", "SCHOOL", "COACHING_CENTER")
    assert "@" in inst["admin_email"]

    depts = get_preset_departments()
    assert len(depts) >= 3
    assert all("code" in d and "name" in d for d in depts)

    desigs = get_preset_designations()
    assert len(desigs) >= 3

    rooms = get_preset_classrooms()
    assert len(rooms) >= 3

    subjs = get_preset_subjects()
    assert len(subjs) >= 3

    teacher = generate_teacher_payload("dept-1", "desig-1", 1)
    assert teacher["department_id"] == "dept-1"
    assert teacher["designation_id"] == "desig-1"
    assert "@" in teacher["email"]

    student = generate_student_payload("dept-1", 1)
    assert student["department_id"] == "dept-1"
    assert student["gender"] in ("Male", "Female")
    assert "@" in student["email"]

    leave = generate_leave_payload("class-1")
    assert leave["class_id"] == "class-1"
    assert len(leave["reason"]) > 10


@pytest.mark.asyncio
async def test_api_client_request_headers():
    client = ApiClient(base_url="http://testserver/api/v1")
    client.set_auth("mock-jwt-token")
    client.set_tenant("tenant-apex-1")

    headers = client._headers()
    assert headers["Authorization"] == "Bearer mock-jwt-token"
    assert headers["X-Tenant-ID"] == "tenant-apex-1"
    assert headers["Content-Type"] == "application/json"

    # Mock response
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {"status": "ok"}
    client.client.get = AsyncMock(return_value=mock_resp)

    res = await client.get("/health")
    assert res == {"status": "ok"}
    await client.close()


@pytest.mark.asyncio
async def test_api_client_error_handling():
    client = ApiClient(base_url="http://testserver/api/v1")
    mock_resp = MagicMock()
    mock_resp.status_code = 400
    mock_resp.text = '{"detail": "Bad Request"}'
    client.client.post = AsyncMock(return_value=mock_resp)

    with pytest.raises(SeederApiError) as exc_info:
        await client.post("/invalid-endpoint", {"key": "val"})

    assert exc_info.value.status_code == 400
    await client.close()
