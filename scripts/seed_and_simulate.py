#!/usr/bin/env python3
"""Automated Data-Seeding and Realistic User-Simulation Pipeline.

Usage:
  python scripts/seed_and_simulate.py --clean --days 20 --students-per-section 35
"""

from __future__ import annotations

import argparse
import asyncio
import os
import sys

import httpx
from playwright.async_api import async_playwright
from rich.console import Console

# Add project root to sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from scripts.seed.admin_setup import AdminSetupService
from scripts.seed.config import SeedingConfig
from scripts.seed.db_cleaner import clean_database
from scripts.seed.edge_workflows import EdgeWorkflowsService
from scripts.seed.session_simulation import SessionSimulationService
from scripts.seed.student_enrollment import StudentEnrollmentService
from scripts.seed.summary_reporter import print_final_summary
from scripts.seed.teacher_onboarding import TeacherOnboardingService
from scripts.seed.yopmail_client import YopmailClient

console = Console()


async def run_pipeline(config: SeedingConfig, clean: bool) -> None:
    config.enforce_safety()

    console.print("\n[bold cyan]🚀 SMART ATTENDANCE SYSTEM: DATA-SEEDING & USER SIMULATION[/bold cyan]")
    console.print(f"  Target Backend:  [yellow]{config.backend_base_url}[/yellow]")
    console.print(f"  Target Frontend: [yellow]{config.frontend_base_url}[/yellow]")
    console.print(f"  Simulation Days: [green]{config.simulation_days}[/green] | Students/Section: [green]{config.students_per_section}[/green]\n")

    # Step 0: Database Clean Wipe (if requested)
    if clean:
        await clean_database(config)

    async with async_playwright() as p, httpx.AsyncClient(timeout=30.0) as http_client:
        browser = await p.chromium.launch(
            headless=config.headless,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        browser_context = await browser.new_context(viewport={"width": 1440, "height": 900})
        yopmail = YopmailClient(config, browser_context)

        # ----------------------------------------------------
        # 1. [Admin Setup]
        # ----------------------------------------------------
        console.print("[bold blue]\n[1/4] [Admin Setup][/bold blue] Initializing Institutional Master Data...")
        admin_service = AdminSetupService(config, http_client)
        await admin_service.login_admin()
        dept_map = await admin_service.setup_departments()
        desig_map = await admin_service.setup_designations()
        subj_map = await admin_service.setup_subjects()
        room_map = await admin_service.setup_classrooms()

        # ----------------------------------------------------
        # 2. [Teacher Onboarding]
        # ----------------------------------------------------
        console.print("[bold blue]\n[2/4] [Teacher Onboarding][/bold blue] Provisioning & Verifying Faculty Cohort...")
        teacher_service = TeacherOnboardingService(config, http_client, yopmail)
        teachers = await teacher_service.onboard_teachers(dept_map, desig_map)
        classes = await teacher_service.setup_classes_and_assignments(teachers, subj_map, room_map)

        # ----------------------------------------------------
        # 3. [Student Enrollment]
        # ----------------------------------------------------
        console.print("[bold blue]\n[3/4] [Student Enrollment][/bold blue] Generating Student Body & Roster Mappings...")
        student_service = StudentEnrollmentService(config, http_client)
        div_a_students, div_b_students = await student_service.onboard_students(dept_map)
        await student_service.enroll_students_into_classes(div_a_students, div_b_students, classes)
        all_students = div_a_students + div_b_students

        # ----------------------------------------------------
        # 4. [Session Simulation]
        # ----------------------------------------------------
        console.print("[bold blue]\n[4/4] [Session Simulation][/bold blue] Simulating Full Semester Attendance & Behavior...")
        session_service = SessionSimulationService(config, http_client)
        sim_results = await session_service.simulate_academic_semester(teachers, classes, all_students)

        # Edge Workflows Simulation
        console.print("[bold blue]\n[Edge Workflows][/bold blue] Simulating Student Leave & Device Change Requests...")
        edge_service = EdgeWorkflowsService(config, http_client)
        await edge_service.simulate_leave_requests(all_students, teachers)
        await edge_service.simulate_device_changes(all_students, teachers)

        await browser.close()

        # ----------------------------------------------------
        # [Complete] Summary Reporting
        # ----------------------------------------------------
        print_final_summary(
            dept_count=len(dept_map),
            desig_count=len(desig_map),
            subj_count=len(subj_map),
            room_count=len(room_map),
            class_count=len(classes),
            teachers=teachers,
            students_a=div_a_students,
            students_b=div_b_students,
            sim_stats=sim_results["stats"],
            edge_stats=edge_service.results,
        )


def main() -> None:
    parser = argparse.ArgumentParser(description="Automated Data Seeding & User Simulation Suite")
    parser.add_argument("--clean", action="store_true", help="Wipe local database and reset to clean slate before seeding")
    parser.add_argument("--days", type=int, default=20, help="Number of simulated academic days (default: 20)")
    parser.add_argument("--students-per-section", type=int, default=35, help="Number of students per section (default: 35)")
    parser.add_argument("--headless", action="store_true", default=True, help="Run Playwright in headless mode")
    parser.add_argument("--no-headless", action="store_false", dest="headless", help="Run Playwright with visible browser UI")
    parser.add_argument("--skip-yopmail-browser", action="store_true", help="Skip external Yopmail scraping if running offline")

    args = parser.parse_args()

    config = SeedingConfig(
        simulation_days=args.days,
        students_per_section=args.students_per_section,
        headless=args.headless,
        skip_yopmail_browser=args.skip_yopmail_browser,
    )

    asyncio.run(run_pipeline(config, clean=args.clean))


if __name__ == "__main__":
    main()
