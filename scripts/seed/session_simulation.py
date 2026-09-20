"""Academic Semester Session & Student Behavior Simulation.

Simulates 15-30 academic days with varied student attendance profiles:
- Exemplary (60%): 85%-98% attendance
- Irregular/Borderline (25%): 65%-75% attendance
- Defaulter (15%): < 50% attendance
"""

from __future__ import annotations

import asyncio
import random
from typing import Any

import httpx
from rich.console import Console

from scripts.seed.config import SeedingConfig

console = Console()


class SessionSimulationService:
    def __init__(self, config: SeedingConfig, client: httpx.AsyncClient) -> None:
        self.config = config
        self.client = client
        self.teacher_tokens: dict[str, str] = {}
        self.stats = {"total_sessions": 0, "total_records": 0, "present": 0, "absent": 0, "late": 0, "flagged": 0}

    async def _authenticate_teachers(self, teachers: list[dict[str, Any]]) -> None:
        """Acquires auth tokens for faculty members to drive session endpoints."""
        for t in teachers:
            email = t.get("email")
            if not email:
                continue
            resp = await self.client.post(
                f"{self.config.api_url}/auth/login",
                json={"email": email, "password": self.config.teacher_default_password},
            )
            if resp.status_code == 200:
                data = resp.json()
                self.teacher_tokens[t["id"]] = data.get("access_token") or data.get("token") or ""

    def _assign_student_cohorts(self, students: list[dict[str, Any]]) -> dict[str, str]:
        """Categorizes students into Exemplary (~60%), Irregular (~25%), and Defaulter (~15%)."""
        cohort_map = {}
        shuffled = list(students)
        random.seed(42)  # Deterministic seed for reproducible simulation runs
        random.shuffle(shuffled)

        n = len(shuffled)
        n_exemplary = int(n * 0.60)
        n_irregular = int(n * 0.25)

        for i, s in enumerate(shuffled):
            if i < n_exemplary:
                cohort_map[s["id"]] = "EXEMPLARY"
            elif i < n_exemplary + n_irregular:
                cohort_map[s["id"]] = "IRREGULAR"
            else:
                cohort_map[s["id"]] = "DEFAULTER"

        return cohort_map

    async def simulate_academic_semester(
        self,
        teachers: list[dict[str, Any]],
        classes: list[dict[str, Any]],
        all_students: list[dict[str, Any]],
    ) -> dict[str, Any]:
        """Runs the multi-day attendance simulation across classes."""
        await self._authenticate_teachers(teachers)
        cohort_map = self._assign_student_cohorts(all_students)

        days = self.config.simulation_days
        console.print(f"  [cyan]Starting {days}-day academic attendance simulation...[/cyan]")

        # Map class to enrolled students
        class_rosters: dict[str, list[dict[str, Any]]] = {}
        for c in classes:
            c_name = c.get("name", "")
            if "Division A" in c_name:
                class_rosters[c["id"]] = [s for s in all_students if s.get("batch") == "Division A"]
            elif "Division B" in c_name:
                class_rosters[c["id"]] = [s for s in all_students if s.get("batch") == "Division B"]
            elif "Batch A1" in c_name:
                div_a = [s for s in all_students if s.get("batch") == "Division A"]
                class_rosters[c["id"]] = div_a[:len(div_a) // 2]
            elif "Batch A2" in c_name:
                div_a = [s for s in all_students if s.get("batch") == "Division A"]
                class_rosters[c["id"]] = div_a[len(div_a) // 2:]
            elif "Batch B1" in c_name:
                div_b = [s for s in all_students if s.get("batch") == "Division B"]
                class_rosters[c["id"]] = div_b[:len(div_b) // 2]
            elif "Batch B2" in c_name:
                div_b = [s for s in all_students if s.get("batch") == "Division B"]
                class_rosters[c["id"]] = div_b[len(div_b) // 2:]

        for day in range(1, days + 1):
            # Simulate 2-3 lectures per day
            for cls in classes[:3]:
                t_id = cls.get("teacherId") or cls.get("teacher_id")
                t_token = self.teacher_tokens.get(t_id)
                if not t_token:
                    continue

                auth_headers = {"Authorization": f"Bearer {t_token}"}
                roster = class_rosters.get(cls["id"], [])
                if not roster:
                    continue

                # 1. Start session
                start_resp = await self.client.post(
                    f"{self.config.api_url}/teacher/sessions/start",
                    json={"academic_class_id": cls["id"], "duration_minutes": 60},
                    headers=auth_headers,
                )
                if start_resp.status_code != 200:
                    continue

                session_id = start_resp.json()["id"]
                self.stats["total_sessions"] += 1

                # 2. Mark attendance for enrolled students based on cohort
                for student in roster:
                    cohort = cohort_map.get(student["id"], "EXEMPLARY")
                    prob = 0.92 if cohort == "EXEMPLARY" else (0.70 if cohort == "IRREGULAR" else 0.35)

                    status = "Present" if random.random() < prob else "Absent"
                    if status == "Present" and cohort == "IRREGULAR" and random.random() < 0.20:
                        status = "Late"
                    elif status == "Present" and random.random() < 0.05:
                        status = "Flagged"

                    # Override / bulk mark via teacher endpoint
                    override_resp = await self.client.post(
                        f"{self.config.api_url}/teacher/sessions/{session_id}/override",
                        json={"student_id": student["id"], "status": status},
                        headers=auth_headers,
                    )
                    if override_resp.status_code == 200:
                        self.stats["total_records"] += 1
                        if status == "Present":
                            self.stats["present"] += 1
                        elif status == "Absent":
                            self.stats["absent"] += 1
                        elif status == "Late":
                            self.stats["late"] += 1
                        elif status == "Flagged":
                            self.stats["flagged"] += 1

                # 3. Stop session
                await self.client.post(f"{self.config.api_url}/teacher/sessions/{session_id}/stop", headers=auth_headers)
                await asyncio.sleep(self.config.request_delay_seconds)

        console.print(f"  [green]✓[/green] Completed simulation: [cyan]{self.stats['total_sessions']}[/cyan] Sessions, [cyan]{self.stats['total_records']}[/cyan] Records.")
        return {"stats": self.stats, "cohort_map": cohort_map}
