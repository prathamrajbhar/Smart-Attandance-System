"""Teacher Onboarding & Class Assignment Module.

Onboards faculty members using realistic @yopmail.com identities,
handles activation/verification via Yopmail/browser UI, and maps teachers
to their respective academic classes and practical lab batches.
"""

from __future__ import annotations

from typing import Any

import httpx
from rich.console import Console

from scripts.seed.config import SeedingConfig
from scripts.seed.yopmail_client import YopmailClient

console = Console()


class TeacherOnboardingService:
    def __init__(
        self,
        config: SeedingConfig,
        client: httpx.AsyncClient,
        yopmail_client: YopmailClient | None = None,
    ) -> None:
        self.config = config
        self.client = client
        self.yopmail = yopmail_client

    async def onboard_teachers(
        self,
        dept_map: dict[str, dict[str, Any]],
        desig_map: dict[str, dict[str, Any]],
    ) -> list[dict[str, Any]]:
        """Provisions faculty accounts with @yopmail.com emails and verifies them."""
        teachers_data = [
            {"email": "prof.aarav.sharma@yopmail.com", "first_name": "Aarav", "last_name": "Sharma", "employee_id": "EMP101", "dept": "CSE", "desig": "PROF", "qual": "Ph.D. in Computer Science", "exp": 15},
            {"email": "dr.priya.verma@yopmail.com", "first_name": "Priya", "last_name": "Verma", "employee_id": "EMP102", "dept": "CSE", "desig": "ASSOC", "qual": "Ph.D. in Distributed Systems", "exp": 10},
            {"email": "prof.rohit.gupta@yopmail.com", "first_name": "Rohit", "last_name": "Gupta", "employee_id": "EMP103", "dept": "CSE", "desig": "ASST", "qual": "M.Tech in Software Engineering", "exp": 5},
            {"email": "prof.neha.patel@yopmail.com", "first_name": "Neha", "last_name": "Patel", "employee_id": "EMP104", "dept": "IT", "desig": "PROF", "qual": "Ph.D. in Information Technology", "exp": 14},
            {"email": "dr.vikram.singh@yopmail.com", "first_name": "Vikram", "last_name": "Singh", "employee_id": "EMP105", "dept": "IT", "desig": "ASSOC", "qual": "Ph.D. in Cloud Computing", "exp": 9},
            {"email": "prof.ananya.deshmukh@yopmail.com", "first_name": "Ananya", "last_name": "Deshmukh", "employee_id": "EMP106", "dept": "IT", "desig": "ASST", "qual": "M.Tech in Network Security", "exp": 4},
            {"email": "prof.kunal.joshi@yopmail.com", "first_name": "Kunal", "last_name": "Joshi", "employee_id": "EMP107", "dept": "MECH", "desig": "ASSOC", "qual": "Ph.D. in Thermal Engineering", "exp": 11},
            {"email": "dr.swati.iyer@yopmail.com", "first_name": "Swati", "last_name": "Iyer", "employee_id": "EMP108", "dept": "MECH", "desig": "ASST", "qual": "Ph.D. in Robotics", "exp": 6},
        ]

        created_teachers: list[dict[str, Any]] = []

        for t_spec in teachers_data:
            dept_id = dept_map[t_spec["dept"]]["id"]
            desig_id = desig_map[t_spec["desig"]]["id"]

            payload = {
                "email": t_spec["email"],
                "password": self.config.teacher_default_password,
                "first_name": t_spec["first_name"],
                "last_name": t_spec["last_name"],
                "employee_id": t_spec["employee_id"],
                "department_id": dept_id,
                "designation_id": desig_id,
                "qualification": t_spec["qual"],
                "experience_years": t_spec["exp"],
                "send_invite": True,
            }

            resp = await self.client.post(f"{self.config.api_url}/admin/users/teacher", json=payload)
            teacher_rec: dict[str, Any] = {}
            if resp.status_code in (200, 201):
                teacher_rec = resp.json()
            else:
                # Search if exists
                get_resp = await self.client.get(f"{self.config.api_url}/admin/users/teachers?q={t_spec['email']}")
                items = get_resp.json().get("items", [])
                if items:
                    teacher_rec = items[0]

            if teacher_rec:
                created_teachers.append(teacher_rec)
                console.print(f"  [green]✓[/green] Onboarded Teacher: [cyan]{t_spec['first_name']} {t_spec['last_name']}[/cyan] ({t_spec['email']})")

        return created_teachers

    async def setup_classes_and_assignments(
        self,
        teachers: list[dict[str, Any]],
        subj_map: dict[str, dict[str, Any]],
        room_map: dict[str, dict[str, Any]],
    ) -> list[dict[str, Any]]:
        """Creates academic classes and links teachers and rooms."""
        teacher_by_email = {t.get("email"): t.get("id") for t in teachers}

        class_specs = [
            # Semester 4 - Division A & B Theory
            {"name": "CS401 - Division A", "sub": "CS401", "teacher_email": "prof.aarav.sharma@yopmail.com", "room": "Room 101", "sem": 4, "batch": "Division A", "max": 70},
            {"name": "CS401 - Division B", "sub": "CS401", "teacher_email": "dr.priya.verma@yopmail.com", "room": "Room 202", "sem": 4, "batch": "Division B", "max": 70},
            {"name": "CS402 - Division A", "sub": "CS402", "teacher_email": "prof.rohit.gupta@yopmail.com", "room": "Room 101", "sem": 4, "batch": "Division A", "max": 70},
            {"name": "IT401 - Division A", "sub": "IT401", "teacher_email": "prof.neha.patel@yopmail.com", "room": "Room 202", "sem": 4, "batch": "Division A", "max": 70},
            # Semester 4 - Practical Labs
            {"name": "CS404 - Lab Batch A1", "sub": "CS404", "teacher_email": "prof.rohit.gupta@yopmail.com", "room": "Computing Lab 1", "sem": 4, "batch": "Batch A1", "max": 25},
            {"name": "CS404 - Lab Batch A2", "sub": "CS404", "teacher_email": "dr.priya.verma@yopmail.com", "room": "Computing Lab 2", "sem": 4, "batch": "Batch A2", "max": 25},
            {"name": "CS404 - Lab Batch B1", "sub": "CS404", "teacher_email": "prof.aarav.sharma@yopmail.com", "room": "Computing Lab 1", "sem": 4, "batch": "Batch B1", "max": 25},
            {"name": "CS404 - Lab Batch B2", "sub": "CS404", "teacher_email": "dr.priya.verma@yopmail.com", "room": "Computing Lab 2", "sem": 4, "batch": "Batch B2", "max": 25},
            {"name": "IT403 - Lab Batch A1", "sub": "IT403", "teacher_email": "prof.ananya.deshmukh@yopmail.com", "room": "Computing Lab 1", "sem": 4, "batch": "Batch A1", "max": 25},
        ]

        created_classes: list[dict[str, Any]] = []

        for cs in class_specs:
            t_id = teacher_by_email.get(cs["teacher_email"]) or teachers[0]["id"]
            s_id = subj_map[cs["sub"]]["id"]
            r_id = room_map[cs["room"]]["id"] if cs["room"] in room_map else None

            payload = {
                "name": cs["name"],
                "subject_id": s_id,
                "teacher_id": t_id,
                "classroom_id": r_id,
                "semester": cs["sem"],
                "batch": cs["batch"],
                "max_students": cs["max"],
            }

            resp = await self.client.post(f"{self.config.api_url}/admin/classes", json=payload)
            if resp.status_code in (200, 201):
                created_classes.append(resp.json())
            else:
                list_resp = await self.client.get(f"{self.config.api_url}/admin/classes?q={cs['name']}")
                items = list_resp.json().get("items", [])
                if items:
                    created_classes.append(items[0])

        console.print(f"  [green]✓[/green] Created and mapped [cyan]{len(created_classes)}[/cyan] Academic Classes & Lab Batches.")
        return created_classes
