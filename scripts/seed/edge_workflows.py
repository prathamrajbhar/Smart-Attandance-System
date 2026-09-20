"""Edge Workflow Simulation Module.

Simulates authentic edge journeys:
1. Students submitting medical & personal leave requests.
2. Teachers reviewing, approving, and rejecting leaves with approver notes.
3. Students submitting device change requests & teachers resolving them.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

import httpx
from rich.console import Console

from scripts.seed.config import SeedingConfig

console = Console()


class EdgeWorkflowsService:
    def __init__(self, config: SeedingConfig, client: httpx.AsyncClient) -> None:
        self.config = config
        self.client = client
        self.results = {"leaves_submitted": 0, "leaves_approved": 0, "leaves_rejected": 0, "device_changes_submitted": 0, "device_changes_approved": 0}

    async def simulate_leave_requests(
        self,
        students: list[dict[str, Any]],
        teachers: list[dict[str, Any]],
    ) -> None:
        """Simulates student leave submissions and teacher review queue processing."""
        today = datetime.now(timezone.utc).date()
        leave_scenarios = [
            {"student_idx": 0, "days_ahead": 1, "duration": 2, "reason": "Viral fever and doctor recommended bed rest", "action": "APPROVED", "note": "Approved on medical grounds"},
            {"student_idx": 1, "days_ahead": 3, "duration": 3, "reason": "Attending sibling's wedding in home town", "action": "APPROVED", "note": "Approved for family event"},
            {"student_idx": 2, "days_ahead": 2, "duration": 2, "reason": "Representing university at national robotics hackathon", "action": "APPROVED", "note": "Official duty granted"},
            {"student_idx": 3, "days_ahead": 0, "duration": 1, "reason": "Feeling mildly tired after festival", "action": "REJECTED", "note": "Unexcused personal leave request"},
        ]

        # 1. Students submit leaves
        for sc in leave_scenarios:
            st = students[sc["student_idx"]]
            email = st.get("email")
            if not email:
                continue

            # Student login
            login_resp = await self.client.post(
                f"{self.config.api_url}/auth/login",
                json={"email": email, "password": self.config.student_default_password},
            )
            if login_resp.status_code != 200:
                continue

            s_token = login_resp.json().get("access_token")
            s_headers = {"Authorization": f"Bearer {s_token}"}

            start_d = (today + timedelta(days=sc["days_ahead"])).isoformat()
            end_d = (today + timedelta(days=sc["days_ahead"] + sc["duration"])).isoformat()

            # Submit leave
            sub_resp = await self.client.post(
                f"{self.config.api_url}/student/leaves",
                data={"start_date": start_d, "end_date": end_d, "reason": sc["reason"]},
                headers=s_headers,
            )
            if sub_resp.status_code in (200, 201):
                self.results["leaves_submitted"] += 1

        console.print(f"  [green]✓[/green] Submitted [cyan]{self.results['leaves_submitted']}[/cyan] Student Leave Requests.")

        # 2. Teachers review and decide on leaves
        for teacher in teachers[:2]:
            t_email = teacher.get("email")
            if not t_email:
                continue

            t_login = await self.client.post(
                f"{self.config.api_url}/auth/login",
                json={"email": t_email, "password": self.config.teacher_default_password},
            )
            if t_login.status_code != 200:
                continue

            t_token = t_login.json().get("access_token")
            t_headers = {"Authorization": f"Bearer {t_token}"}

            pending_resp = await self.client.get(f"{self.config.api_url}/teacher/leaves/pending", headers=t_headers)
            if pending_resp.status_code == 200:
                pending_list = pending_resp.json()
                for pending_item in pending_list:
                    leave_id = pending_item["id"]
                    # Match action
                    action = "REJECTED" if "tired" in pending_item.get("reason", "").lower() else "APPROVED"
                    note = "Approved by faculty" if action == "APPROVED" else "Rejected: Insufficient grounds"

                    decide_resp = await self.client.put(
                        f"{self.config.api_url}/teacher/leaves/{leave_id}/approve",
                        json={"status": action, "approver_note": note},
                        headers=t_headers,
                    )
                    if decide_resp.status_code == 200:
                        if action == "APPROVED":
                            self.results["leaves_approved"] += 1
                        else:
                            self.results["leaves_rejected"] += 1

        console.print(f"  [green]✓[/green] Processed Review Queue: [cyan]{self.results['leaves_approved']}[/cyan] Approved, [cyan]{self.results['leaves_rejected']}[/cyan] Rejected.")

    async def simulate_device_changes(
        self,
        students: list[dict[str, Any]],
        teachers: list[dict[str, Any]],
    ) -> None:
        """Simulates student device changes and teacher resolution."""
        device_cases = [
            {"student_idx": 4, "uuid": "device-pixel-8-uuid-001", "reason": "Replaced damaged phone with new Google Pixel 8"},
            {"student_idx": 5, "uuid": "device-iphone-15-uuid-002", "reason": "Upgraded handset to iPhone 15"},
            {"student_idx": 6, "uuid": "device-samsung-s24-uuid-003", "reason": "Primary phone under repair; using spare Samsung"},
        ]

        # 1. Students submit device change
        for dc in device_cases:
            st = students[dc["student_idx"]]
            resp = await self.client.post(
                f"{self.config.api_url}/auth/request-device-change",
                json={
                    "email": st["email"],
                    "password": self.config.student_default_password,
                    "new_device_uuid": dc["uuid"],
                    "reason": dc["reason"],
                },
            )
            if resp.status_code == 200:
                self.results["device_changes_submitted"] += 1

        console.print(f"  [green]✓[/green] Submitted [cyan]{self.results['device_changes_submitted']}[/cyan] Device Change Requests.")

        # 2. Teachers approve device changes
        for teacher in teachers[:2]:
            t_email = teacher.get("email")
            t_login = await self.client.post(
                f"{self.config.api_url}/auth/login",
                json={"email": t_email, "password": self.config.teacher_default_password},
            )
            if t_login.status_code != 200:
                continue

            t_token = t_login.json().get("access_token")
            t_headers = {"Authorization": f"Bearer {t_token}"}

            pending_resp = await self.client.get(f"{self.config.api_url}/teacher/device-changes/pending", headers=t_headers)
            if pending_resp.status_code == 200:
                pending_reqs = pending_resp.json()
                for req in pending_reqs:
                    req_id = req["id"]
                    appr_resp = await self.client.put(
                        f"{self.config.api_url}/teacher/device-changes/{req_id}/approve",
                        json={"status": "APPROVED"},
                        headers=t_headers,
                    )
                    if appr_resp.status_code == 200:
                        self.results["device_changes_approved"] += 1

        console.print(f"  [green]✓[/green] Approved [cyan]{self.results['device_changes_approved']}[/cyan] Device Change Requests in Teacher Portal.")
