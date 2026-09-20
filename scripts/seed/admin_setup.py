"""Admin Master Data Setup Automation.

Configures institutional master data:
- Departments (CSE, IT, MECH)
- Designations (PROF, ASSOC, ASST)
- Subjects (CS401, CS402, CS403, CS404, IT401, IT402, IT403, ME401)
- Classrooms (Room 101, Room 202, Lab 1, Lab 2)
"""

from __future__ import annotations

from typing import Any

import httpx
from rich.console import Console

from scripts.seed.config import SeedingConfig

console = Console()


class AdminSetupService:
    def __init__(self, config: SeedingConfig, client: httpx.AsyncClient) -> None:
        self.config = config
        self.client = client
        self.admin_token: str = ""

    async def login_admin(self) -> str:
        """Logs into admin account and acquires JWT access token."""
        resp = await self.client.post(
            f"{self.config.api_url}/auth/login",
            json={"email": self.config.admin_email, "password": self.config.admin_password},
        )
        if resp.status_code != 200:
            raise RuntimeError(f"Admin login failed ({resp.status_code}): {resp.text}")

        data = resp.json()
        self.admin_token = data.get("access_token") or data.get("token") or ""
        self.client.headers["Authorization"] = f"Bearer {self.admin_token}"
        console.print(f"  [green]✓[/green] Admin authenticated: [cyan]{self.config.admin_email}[/cyan]")
        return self.admin_token

    async def setup_departments(self) -> dict[str, dict[str, Any]]:
        """Creates institutional departments."""
        departments = [
            {"name": "Computer Science & Engineering", "code": "CSE", "head": "Dr. Ramesh Kulkarni", "description": "Department of CSE"},
            {"name": "Information Technology", "code": "IT", "head": "Dr. Sunita Sharma", "description": "Department of IT"},
            {"name": "Mechanical Engineering", "code": "MECH", "head": "Dr. Rajesh Nair", "description": "Department of Mechanical Engineering"},
        ]
        dept_map: dict[str, dict[str, Any]] = {}
        for dept in departments:
            resp = await self.client.post(f"{self.config.api_url}/admin/departments", json=dept)
            if resp.status_code in (200, 201):
                res_data = resp.json()
                dept_map[dept["code"]] = res_data
            else:
                # Retrieve if already exists
                list_resp = await self.client.get(f"{self.config.api_url}/admin/departments")
                for d in list_resp.json():
                    if d.get("code") == dept["code"]:
                        dept_map[dept["code"]] = d

        console.print(f"  [green]✓[/green] Seeded [cyan]{len(dept_map)}[/cyan] Departments.")
        return dept_map

    async def setup_designations(self) -> dict[str, dict[str, Any]]:
        """Creates academic designations."""
        designations = [
            {"name": "Professor", "code": "PROF", "description": "Senior Tenured Faculty"},
            {"name": "Associate Professor", "code": "ASSOC", "description": "Tenured Faculty"},
            {"name": "Assistant Professor", "code": "ASST", "description": "Junior Faculty"},
        ]
        desig_map: dict[str, dict[str, Any]] = {}
        for desig in designations:
            resp = await self.client.post(f"{self.config.api_url}/admin/designations", json=desig)
            if resp.status_code in (200, 201):
                desig_map[desig["code"]] = resp.json()
            else:
                list_resp = await self.client.get(f"{self.config.api_url}/admin/designations")
                for d in list_resp.json():
                    if d.get("code") == desig["code"]:
                        desig_map[desig["code"]] = d

        console.print(f"  [green]✓[/green] Seeded [cyan]{len(desig_map)}[/cyan] Designations.")
        return desig_map

    async def setup_subjects(self) -> dict[str, dict[str, Any]]:
        """Creates academic subjects (Theory & Practical)."""
        subjects = [
            {"name": "Database Management Systems", "code": "CS401", "description": "Core Theory"},
            {"name": "Operating Systems", "code": "CS402", "description": "Core Theory"},
            {"name": "Computer Networks", "code": "CS403", "description": "Core Theory"},
            {"name": "Database Systems Lab", "code": "CS404", "description": "Practical Lab"},
            {"name": "Web Technologies", "code": "IT401", "description": "Core Theory"},
            {"name": "Software Engineering", "code": "IT402", "description": "Core Theory"},
            {"name": "Full Stack Lab", "code": "IT403", "description": "Practical Lab"},
            {"name": "Engineering Thermodynamics", "code": "ME401", "description": "Core Theory"},
        ]
        subj_map: dict[str, dict[str, Any]] = {}
        for subj in subjects:
            resp = await self.client.post(f"{self.config.api_url}/admin/subjects", json=subj)
            if resp.status_code in (200, 201):
                subj_map[subj["code"]] = resp.json()
            else:
                list_resp = await self.client.get(f"{self.config.api_url}/admin/subjects")
                for s in list_resp.json():
                    if s.get("code") == subj["code"]:
                        subj_map[subj["code"]] = s

        console.print(f"  [green]✓[/green] Seeded [cyan]{len(subj_map)}[/cyan] Subjects.")
        return subj_map

    async def setup_classrooms(self) -> dict[str, dict[str, Any]]:
        """Creates classroom and laboratory venues."""
        rooms = [
            {"name": "Room 101", "building": "Main Academic Block", "capacity": 70},
            {"name": "Room 202", "building": "Main Academic Block", "capacity": 70},
            {"name": "Computing Lab 1", "building": "IT Block", "capacity": 40},
            {"name": "Computing Lab 2", "building": "IT Block", "capacity": 40},
        ]
        room_map: dict[str, dict[str, Any]] = {}
        for r in rooms:
            resp = await self.client.post(f"{self.config.api_url}/admin/classrooms", json=r)
            if resp.status_code in (200, 201):
                room_map[r["name"]] = resp.json()
            else:
                list_resp = await self.client.get(f"{self.config.api_url}/admin/classrooms")
                for room in list_resp.json():
                    if room.get("name") == r["name"]:
                        room_map[r["name"]] = room

        console.print(f"  [green]✓[/green] Seeded [cyan]{len(room_map)}[/cyan] Classrooms.")
        return room_map
