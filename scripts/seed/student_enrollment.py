"""Student Generation & Academic Enrollment Module.

Onboards realistic cohorts of 30-50 students per section with PRNs,
roll numbers, and @yopmail.com emails, and enrolls them into lectures and labs.
"""

from __future__ import annotations

from typing import Any

import httpx
from rich.console import Console

from scripts.seed.config import SeedingConfig

console = Console()

FIRST_NAMES = [
    "Aarav", "Aditi", "Aditya", "Akash", "Ananya", "Aryan", "Bhavya", "Chetan",
    "Dev", "Diya", "Gaurav", "Harsh", "Ishaan", "Jhanvi", "Kabir", "Kavya",
    "Manish", "Meera", "Neha", "Nikhil", "Pooja", "Pranav", "Priyanka", "Rahul",
    "Rhea", "Rohan", "Saanvi", "Sahil", "Sameer", "Sanya", "Shreya", "Siddharth",
    "Sneha", "Tanvi", "Utkarsh", "Varun", "Vedant", "Vidya", "Vikram", "Yash"
]

LAST_NAMES = [
    "Patel", "Sharma", "Verma", "Gupta", "Deshmukh", "Joshi", "Iyer", "Nair",
    "Kulkarni", "Mehta", "Shah", "Reddy", "Singh", "Choudhury", "Bose", "Das"
]


class StudentEnrollmentService:
    def __init__(self, config: SeedingConfig, client: httpx.AsyncClient) -> None:
        self.config = config
        self.client = client

    def generate_student_specs(self, dept_id: str, dept_code: str, count: int = 35, section: str = "Division A") -> list[dict[str, Any]]:
        """Builds student specification objects with PRNs and @yopmail.com emails."""
        specs = []
        offset = 0 if section == "Division A" else 35
        for i in range(1, count + 1):
            idx = offset + i
            fn = FIRST_NAMES[(idx - 1) % len(FIRST_NAMES)]
            ln = LAST_NAMES[(idx - 1) % len(LAST_NAMES)]
            prn = f"PRN2024{dept_code}{idx:03d}"
            email = f"{fn.lower()}.{ln.lower()}.{idx:03d}@yopmail.com"

            specs.append({
                "enrollment_number": prn,
                "first_name": fn,
                "last_name": ln,
                "email": email,
                "password": self.config.student_default_password,
                "department_id": dept_id,
                "semester": 4,
                "batch": section,
                "roll_number": i,
                "send_invite": False,
            })
        return specs

    async def onboard_students(self, dept_map: dict[str, dict[str, Any]]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
        """Creates cohorts for Division A and Division B in CSE."""
        cse_id = dept_map["CSE"]["id"]
        count = self.config.students_per_section

        div_a_specs = self.generate_student_specs(cse_id, "CSE", count=count, section="Division A")
        div_b_specs = self.generate_student_specs(cse_id, "CSE", count=count, section="Division B")

        all_specs = div_a_specs + div_b_specs
        await self.client.post(f"{self.config.api_url}/admin/users/students/bulk", json={"students": all_specs, "send_invite": False})

        # Fetch created students
        list_resp = await self.client.get(f"{self.config.api_url}/admin/users/students?page_size=1000")
        all_students = list_resp.json().get("items", [])

        div_a_students = [s for s in all_students if s.get("batch") == "Division A"]
        div_b_students = [s for s in all_students if s.get("batch") == "Division B"]

        console.print(f"  [green]✓[/green] Onboarded [cyan]{len(div_a_students)}[/cyan] Students in Division A.")
        console.print(f"  [green]✓[/green] Onboarded [cyan]{len(div_b_students)}[/cyan] Students in Division B.")
        return div_a_students, div_b_students

    async def enroll_students_into_classes(
        self,
        div_a_students: list[dict[str, Any]],
        div_b_students: list[dict[str, Any]],
        classes: list[dict[str, Any]],
    ) -> None:
        """Enrolls students into appropriate theory sections and practical lab batches."""
        div_a_ids = [s["id"] for s in div_a_students]
        div_b_ids = [s["id"] for s in div_b_students]

        # Split into lab batches (first half A1/B1, second half A2/B2)
        mid_a = len(div_a_ids) // 2
        batch_a1_ids = div_a_ids[:mid_a]
        batch_a2_ids = div_a_ids[mid_a:]

        mid_b = len(div_b_ids) // 2
        batch_b1_ids = div_b_ids[:mid_b]
        batch_b2_ids = div_b_ids[mid_b:]

        for c in classes:
            class_id = c["id"]
            name = c.get("name", "")

            target_ids = []
            if "Division A" in name:
                target_ids = div_a_ids
            elif "Division B" in name:
                target_ids = div_b_ids
            elif "Batch A1" in name:
                target_ids = batch_a1_ids
            elif "Batch A2" in name:
                target_ids = batch_a2_ids
            elif "Batch B1" in name:
                target_ids = batch_b1_ids
            elif "Batch B2" in name:
                target_ids = batch_b2_ids

            if target_ids:
                await self.client.post(f"{self.config.api_url}/admin/classes/{class_id}/enroll", json={"student_ids": target_ids})

        console.print("  [green]✓[/green] Successfully enrolled students across all lecture & lab sections.")
