"""Summary Reporting & Terminal Dashboard Module.

Renders final summary tables and metrics for seeded academic hierarchy,
user cohorts, session attendance distributions, and edge workflows.
"""

from __future__ import annotations

from typing import Any

from rich import box
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

console = Console()


def print_final_summary(
    dept_count: int,
    desig_count: int,
    subj_count: int,
    room_count: int,
    class_count: int,
    teachers: list[dict[str, Any]],
    students_a: list[dict[str, Any]],
    students_b: list[dict[str, Any]],
    sim_stats: dict[str, Any],
    edge_stats: dict[str, Any],
) -> None:
    """Prints beautiful formatted terminal summary tables using rich."""
    console.print("\n")
    console.print(
        Panel.fit(
            "[bold green]✨ DATA SEEDING & SIMULATION PIPELINE COMPLETED SUCCESSFULLY ✨[/bold green]\n"
            "[dim]All data generated through authentic UI journeys and public API endpoints.[/dim]",
            border_style="green",
            box=box.ROUNDED,
        )
    )

    # 1. Master Data & Entity Counts Table
    master_table = Table(title="🏛️ Institutional Master Data & User Hierarchy", box=box.ROUNDED)
    master_table.add_column("Category", style="cyan", justify="left")
    master_table.add_column("Configured Entities", style="white", justify="left")
    master_table.add_column("Total Count", style="bold green", justify="right")

    master_table.add_row("Departments", "CSE, IT, MECH", str(dept_count))
    master_table.add_row("Designations", "Professor, Associate Prof, Assistant Prof", str(desig_count))
    master_table.add_row("Subjects", "CS401-404, IT401-403, ME401 (Theory & Labs)", str(subj_count))
    master_table.add_row("Classrooms", "Room 101, Room 202, Lab 1, Lab 2", str(room_count))
    master_table.add_row("Classes / Batches", "Sem 4 (Div A, Div B, Batches A1, A2, B1, B2)", str(class_count))
    master_table.add_row("Faculty (Teachers)", "Verified @yopmail.com accounts mapped to classes", str(len(teachers)))
    master_table.add_row("Students (Division A)", f"PRN2024CSE001 - PRN2024CSE{len(students_a):03d}", str(len(students_a)))
    master_table.add_row("Students (Division B)", f"PRN2024CSE{len(students_a)+1:03d} - PRN2024CSE{len(students_a)+len(students_b):03d}", str(len(students_b)))
    master_table.add_row("Total Student Body", "Active student accounts with institutional PRNs", str(len(students_a) + len(students_b)))

    console.print(master_table)
    console.print("\n")

    # 2. Session Simulation & Attendance Distributions Table
    total_recs = sim_stats.get("total_records", 0)
    pres = sim_stats.get("present", 0)
    absn = sim_stats.get("absent", 0)
    late = sim_stats.get("late", 0)
    flag = sim_stats.get("flagged", 0)

    p_pres = (pres / total_recs * 100) if total_recs > 0 else 0
    p_absn = (absn / total_recs * 100) if total_recs > 0 else 0
    p_late = (late / total_recs * 100) if total_recs > 0 else 0
    p_flag = (flag / total_recs * 100) if total_recs > 0 else 0

    att_table = Table(title="📊 Academic Attendance Simulation & Behavior Distribution", box=box.ROUNDED)
    att_table.add_column("Student Behavior Cohort", style="cyan")
    att_table.add_column("Population %", justify="center")
    att_table.add_column("Target Attendance", justify="center")
    att_table.add_column("Key Behavioral Characteristics", style="dim")

    att_table.add_row("Exemplary Students", "60%", "85% – 98%", "High punctuality, accurate facial match, geofenced")
    att_table.add_row("Irregular / Borderline", "25%", "65% – 75%", "Occasional unexcused absences, occasional late arrivals")
    att_table.add_row("Defaulters / Truant", "15%", "< 50%", "Chronic absenteeism, sporadic single-lecture attendance")

    console.print(att_table)
    console.print("\n")

    # 3. Attendance Status Breakdown Table
    breakdown_table = Table(title=f"📈 Attendance Records Distribution ({total_recs} total marks across {sim_stats.get('total_sessions', 0)} sessions)", box=box.ROUNDED)
    breakdown_table.add_column("Attendance Status", style="bold")
    breakdown_table.add_column("Record Count", justify="right")
    breakdown_table.add_column("Percentage", justify="right")

    breakdown_table.add_row("[green]Present[/green]", str(pres), f"{p_pres:.1f}%")
    breakdown_table.add_row("[red]Absent[/red]", str(absn), f"{p_absn:.1f}%")
    breakdown_table.add_row("[yellow]Late Arrival[/yellow]", str(late), f"{p_late:.1f}%")
    breakdown_table.add_row("[magenta]Flagged for Review[/magenta]", str(flag), f"{p_flag:.1f}%")

    console.print(breakdown_table)
    console.print("\n")

    # 4. Edge Workflows Table
    edge_table = Table(title="🔄 Student & Teacher Edge Workflows Resolution", box=box.ROUNDED)
    edge_table.add_column("Workflow Type", style="cyan")
    edge_table.add_column("Submitted", justify="right")
    edge_table.add_column("Approved", justify="right", style="green")
    edge_table.add_column("Rejected", justify="right", style="red")
    edge_table.add_column("Teacher Portal Resolution", style="dim")

    edge_table.add_row(
        "Student Leave Requests",
        str(edge_stats.get("leaves_submitted", 0)),
        str(edge_stats.get("leaves_approved", 0)),
        str(edge_stats.get("leaves_rejected", 0)),
        "Reviewed in /teacher/leaves with approver notes",
    )
    edge_table.add_row(
        "Device Change Requests",
        str(edge_stats.get("device_changes_submitted", 0)),
        str(edge_stats.get("device_changes_approved", 0)),
        "0",
        "Approved in /teacher/device-changes to bind new hardware UUID",
    )

    console.print(edge_table)
    console.print("\n")
