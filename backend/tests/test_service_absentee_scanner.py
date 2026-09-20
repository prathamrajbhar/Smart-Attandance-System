import pytest
from app.services.absentee_scanner import run_absentee_scan

@pytest.mark.asyncio
async def test_run_absentee_scan_empty():
    res = await run_absentee_scan([])
    assert res == []

@pytest.mark.asyncio
async def test_run_absentee_scan_detects_outliers():
    records = []
    # 20 normal students with 1-2 random absences across weekdays
    for s_idx in range(1, 21):
        s_id = f"stu-norm-{s_idx}"
        records.append({"student_id": s_id, "status": "Absent", "day_of_week": "Tuesday"})
        records.append({"student_id": s_id, "status": "Absent", "day_of_week": "Thursday"})

    # 2 high-outlier students with persistent absences on Mondays and Fridays (10 absences each)
    for s_idx in range(1, 3):
        s_id = f"stu-outlier-{s_idx}"
        for _ in range(5):
            records.append({"student_id": s_id, "status": "Absent", "day_of_week": "Monday"})
            records.append({"student_id": s_id, "status": "Absent", "day_of_week": "Friday"})

    flagged = await run_absentee_scan(records, contamination=0.10)
    assert isinstance(flagged, list)
    # The outlier students should be identified and ranked at the top of anomalies
    student_ids = [item["student_id"] for item in flagged]
    assert any("outlier" in s for s in student_ids)
    for item in flagged:
        assert "student_id" in item
        assert "total_absences" in item
        assert "anomaly_score" in item
