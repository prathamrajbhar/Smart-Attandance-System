import random
from typing import Any, Dict, List
from scripts.seeder.client import ApiClient, SeederApiError
from scripts.seeder.data_generator import (
    get_preset_departments, get_preset_designations, get_preset_classrooms,
    get_preset_subjects, generate_teacher_payload, generate_student_payload,
    generate_leave_payload,
)


async def seed_master_setup(client: ApiClient) -> Dict[str, List[Any]]:
    print("  -> Creating master academic entities (Departments, Designations, Classrooms, Subjects)...")
    departments, designations, classrooms, subjects = [], [], [], []

    for dept in get_preset_departments():
        try:
            res = await client.post("/admin/departments", dept)
            departments.append(res)
        except SeederApiError:
            pass

    for desig in get_preset_designations():
        try:
            res = await client.post("/admin/designations", desig)
            designations.append(res)
        except SeederApiError:
            pass

    for room in get_preset_classrooms():
        try:
            res = await client.post("/admin/classrooms", room)
            classrooms.append(res)
        except SeederApiError:
            pass

    for subj in get_preset_subjects():
        try:
            res = await client.post("/admin/subjects", subj)
            subjects.append(res)
        except SeederApiError:
            pass

    # If any were existing, fetch current lists via API
    if not departments:
        departments = await client.get("/admin/departments")
    if not designations:
        designations = await client.get("/admin/designations")
    if not classrooms:
        classrooms = await client.get("/admin/classrooms")
    if not subjects:
        subjects = await client.get("/admin/subjects")

    return {
        "departments": departments,
        "designations": designations,
        "classrooms": classrooms,
        "subjects": subjects,
    }


async def seed_users(
    client: ApiClient,
    dept_id: str,
    desig_id: str,
    teacher_count: int = 2,
    student_count: int = 6,
) -> Dict[str, List[Any]]:
    print(f"  -> Registering {teacher_count} faculty members and {student_count} students via Admin API...")
    created_teachers = []
    created_students = []

    for i in range(1, teacher_count + 1):
        payload = generate_teacher_payload(dept_id, desig_id, i + random.randint(100, 999))
        try:
            res = await client.post("/admin/users/teacher", payload)
            res["plain_password"] = payload.get("password", "Teacher@123")
            created_teachers.append(res)
        except SeederApiError as e:
            print(f"     [!] Teacher creation note: {e.response_text[:80]}")

    for i in range(1, student_count + 1):
        payload = generate_student_payload(dept_id, i + random.randint(1000, 9999))
        try:
            res = await client.post("/admin/users/student", payload)
            res["plain_password"] = payload.get("password", "Student@123")
            created_students.append(res)
        except SeederApiError as e:
            print(f"     [!] Student creation note: {e.response_text[:80]}")

    return {"teachers": created_teachers, "students": created_students}


async def seed_classes_and_enroll(
    client: ApiClient,
    teacher: Dict[str, Any],
    subject: Dict[str, Any],
    classroom: Dict[str, Any],
    students: List[Dict[str, Any]],
) -> Dict[str, Any]:
    class_payload = {
        "name": f"{subject.get('name', 'CS')} - Section A",
        "subject_id": subject["id"],
        "classroom_id": classroom["id"],
        "teacher_id": teacher["id"],
        "semester": 6,
        "batch": "2022-2026",
        "max_students": 60,
    }
    print(f"  -> Scheduling Academic Class '{class_payload['name']}'...")
    academic_class = await client.post("/admin/classes", class_payload)

    student_ids = [s["id"] for s in students if "id" in s]
    if student_ids:
        print(f"  -> Enrolling {len(student_ids)} students into class...")
        await client.post(f"/admin/classes/{academic_class['id']}/enroll", {"student_ids": student_ids})

    return academic_class


async def seed_live_attendance_session(
    client: ApiClient,
    teacher: Dict[str, Any],
    academic_class: Dict[str, Any],
    students: List[Dict[str, Any]],
) -> Dict[str, Any]:
    teacher_email = teacher.get("email") or teacher.get("user", {}).get("email")
    print(f"  -> Authenticating as Teacher ({teacher_email}) to start live session...")
    try:
        await client.authenticate(teacher_email, teacher.get("plain_password", "Teacher@123"))
    except SeederApiError as e:
        print(f"     [!] Teacher auth issue: {e.response_text[:80]}")
        raise

    # Upsert geofence for classroom
    geofence_payload = {
        "latitude": 28.5450,
        "longitude": 77.1926,
        "radius_meters": 150.0,
    }
    await client.post(f"/teacher/classes/{academic_class['id']}/geofence", geofence_payload)

    # Start attendance session
    print("  -> Launching active attendance session with geofence...")
    session_data = await client.post("/teacher/sessions/start", {
        "academic_class_id": academic_class["id"],
        "duration_minutes": 30,
    })
    session_id = session_data["id"]

    # Mark attendance for enrolled students
    records = []
    statuses = ["Present", "Present", "Present", "Present", "Absent", "Present"]
    for idx, student in enumerate(students):
        status = statuses[idx % len(statuses)]
        records.append({
            "student_id": student["id"],
            "status": status,
        })

    print(f"  -> Submitting bulk verified attendance roster for {len(records)} students...")
    await client.post(f"/teacher/sessions/{session_id}/mark-bulk", {"records": records})

    # Conclude session
    print("  -> Concluding active attendance session...")
    await client.post(f"/teacher/sessions/{session_id}/stop")
    return {"session_id": session_id, "records_marked": len(records)}
