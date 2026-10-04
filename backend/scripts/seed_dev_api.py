#!/usr/bin/env python3
import asyncio
import os
import sys
import argparse
import time

backend_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

from scripts.seeder.client import ApiClient, SeederApiError
from scripts.seeder.config import config
from scripts.seeder.workflows import (
    seed_master_setup,
    seed_users,
    seed_classes_and_enroll,
    seed_live_attendance_session,
)


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="API-driven local development database seeder")
    parser.add_argument("--url", default=config.base_url, help="API Base URL (e.g. http://localhost:7860/api/v1)")
    parser.add_argument("--tenant", default="default-institution", help="Tenant ID or slug")
    parser.add_argument("--email", default=config.default_tenant_admin_email, help="Tenant admin email")
    parser.add_argument("--password", default=config.default_tenant_admin_password, help="Tenant admin password")
    parser.add_argument("--teachers", type=int, default=2, help="Number of teachers to register")
    parser.add_argument("--students", type=int, default=6, help="Number of students to register")
    return parser.parse_args()


async def main() -> None:
    args = parse_arguments()
    start_time = time.time()
    client = ApiClient(base_url=args.url)
    client.set_tenant(args.tenant)

    print("================================================================")
    print("   Smart Attendance System - API-Driven Development Seeder      ")
    print("================================================================")
    print(f"Target API Base:   {args.url}")
    print(f"Target Tenant:     {args.tenant}")
    print(f"Admin Credential:  {args.email}")
    print("----------------------------------------------------------------")

    try:
        # Step 1: Healthcheck
        print("[1/5] Verifying API availability...")
        health = await client.get("/health")
        print(f"      API is online: status={health.get('status', 'healthy')}")

        # Step 2: Tenant Admin Authentication
        print(f"[2/5] Authenticating as Tenant Admin ({args.email})...")
        await client.authenticate(args.email, args.password)
        print("      Authenticated successfully. JWT token obtained.")

        # Step 3: Master Academic Setup
        print("[3/5] Seeding Master Academic Setup via API...")
        setup = await seed_master_setup(client)
        print(f"      Configured: {len(setup['departments'])} depts, {len(setup['subjects'])} subjects, {len(setup['classrooms'])} rooms.")

        dept_id = setup["departments"][0]["id"]
        desig_id = setup["designations"][0]["id"]

        # Step 4: Register Faculty & Students
        print("[4/5] Provisioning Faculty & Student Rosters via API...")
        roster = await seed_users(
            client=client,
            dept_id=dept_id,
            desig_id=desig_id,
            teacher_count=args.teachers,
            student_count=args.students,
        )
        print(f"      Provisioned: {len(roster['teachers'])} faculty members, {len(roster['students'])} students.")

        # Step 5: Schedule Class & Run Live Session
        if roster["teachers"] and roster["students"]:
            print("[5/5] Scheduling Class & Simulating Live Session Flow...")
            academic_class = await seed_classes_and_enroll(
                client=client,
                teacher=roster["teachers"][0],
                subject=setup["subjects"][0],
                classroom=setup["classrooms"][0],
                students=roster["students"],
            )

            # Live attendance session workflow
            session_result = await seed_live_attendance_session(
                client=client,
                teacher=roster["teachers"][0],
                academic_class=academic_class,
                students=roster["students"],
            )
            print(f"      Session complete: ID={session_result['session_id'][:8]}..., {session_result['records_marked']} records marked.")

        elapsed = time.time() - start_time
        print("----------------------------------------------------------------")
        print(f"[SUCCESS] Database populated strictly through API in {elapsed:.2f}s!")
        print("================================================================")

    except SeederApiError as err:
        print(f"\n[ERROR] API rejected request: {err}", file=sys.stderr)
        sys.exit(1)
    except Exception as exc:
        print(f"\n[ERROR] Unexpected error: {exc}", file=sys.stderr)
        sys.exit(1)
    finally:
        await client.close()


if __name__ == "__main__":
    asyncio.run(main())
