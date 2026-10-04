#!/usr/bin/env python3
"""
Master Unified Test & Security Runner Orchestrator
Executes:
  1. Backend Pytest Test Suite (All 24+ test files, 130+ unit/integration tests)
  2. Enterprise Security Penetration & Vulnerability Audit (10 security vectors)
  3. Frontend Vitest Unit & Component Test Suite
  4. Next.js Production Build Compilation Check
"""
import subprocess
import sys
import time
import os

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")

GREEN = "\033[92m"
RED = "\033[91m"
BLUE = "\033[94m"
YELLOW = "\033[93m"
BOLD = "\033[1m"
RESET = "\033[0m"


def run_stage(title: str, cmd: list[str], cwd: str) -> tuple[bool, float, str]:
    print(f"\n{BOLD}{BLUE}▶ RUNNING: {title}...{RESET}")
    start = time.perf_counter()
    try:
        proc = subprocess.run(cmd, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        elapsed = time.perf_counter() - start
        success = (proc.returncode == 0)
        output = proc.stdout
        if success:
            print(f"  {GREEN}✔ SUCCESS{RESET} in {elapsed:.2f}s")
        else:
            print(f"  {RED}✘ FAILED{RESET} in {elapsed:.2f}s (Exit code: {proc.returncode})")
        return success, elapsed, output
    except Exception as exc:
        elapsed = time.perf_counter() - start
        print(f"  {RED}✘ ERROR{RESET} in {elapsed:.2f}s: {exc}")
        return False, elapsed, str(exc)


def main():
    print(f"\n{BOLD}{BLUE}{'=' * 65}{RESET}")
    print(f"{BOLD}{BLUE}  SMART ATTENDANCE SYSTEM - MASTER TEST & SECURITY RUNNER   {RESET}")
    print(f"{BOLD}{BLUE}{'=' * 65}{RESET}")

    stages = [
        (
            "1. Backend Pytest Full Test Suite",
            ["python3.12", "-m", "pytest", "backend/tests/", "-q", "--disable-warnings"],
            ROOT_DIR,
        ),
        (
            "2. Enterprise Security & Penetration Suite",
            ["python3.12", "scripts/security_audit_suite.py"],
            ROOT_DIR,
        ),
        (
            "3. Frontend Vitest Component & Unit Tests",
            ["npm", "test", "--", "--run"],
            FRONTEND_DIR,
        ),
        (
            "4. Frontend Next.js Production Build Check",
            ["npm", "run", "build"],
            FRONTEND_DIR,
        ),
    ]

    results = []
    overall_start = time.perf_counter()

    for title, cmd, cwd in stages:
        ok, elapsed, output = run_stage(title, cmd, cwd)
        results.append((title, ok, elapsed, output))

    total_time = time.perf_counter() - overall_start
    all_passed = all(r[1] for r in results)

    print(f"\n{BOLD}{BLUE}{'=' * 65}{RESET}")
    print(f"{BOLD}                    EXECUTION SUMMARY REPORT                 {RESET}")
    print(f"{BOLD}{BLUE}{'=' * 65}{RESET}\n")

    for title, ok, elapsed, _ in results:
        status = f"{GREEN}PASSED{RESET}" if ok else f"{RED}FAILED{RESET}"
        print(f"  • {title:<48} : [{status}] ({elapsed:5.2f}s)")

    print(f"\n{BOLD}Total Pipeline Duration:{RESET} {total_time:.2f}s")

    if all_passed:
        print(f"\n{BOLD}{GREEN}✔ ALL 4 TEST & SECURITY PIPELINES PASSED (100% HEALTHY & SECURED){RESET}\n")
        sys.exit(0)
    else:
        print(f"\n{BOLD}{RED}✘ PIPELINE FAILURES DETECTED. Check logs above.{RESET}\n")
        for title, ok, _, output in results:
            if not ok:
                print(f"{BOLD}{RED}=== FAILED STAGE: {title} ==={RESET}")
                print(output[-1500:] if len(output) > 1500 else output)
        sys.exit(1)


if __name__ == "__main__":
    main()
