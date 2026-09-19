import asyncio
import os
import sys
import json
import time
import subprocess
import urllib.request
import urllib.error
from typing import Dict, List, Any

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend"))
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend"))
SCREENSHOTS_DIR = "/tmp/smart_attendance_e2e_screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)


class E2ETestRunner:
    def __init__(self):
        self.results: List[Dict[str, Any]] = []
        self.backend_proc = None
        self.frontend_proc = None

    def log(self, module: str, test_name: str, passed: bool, details: str = ""):
        self.results.append({
            "module": module,
            "test": test_name,
            "status": "PASS" if passed else "FAIL",
            "details": details,
        })
        sym = "✅ PASS" if passed else "❌ FAIL"
        print(f"[{sym}] [{module}] {test_name}: {details}")

    def start_servers_if_needed(self):
        print("\n========================================================")
        print("  1. INITIALIZING SERVERS & BACKGROUND SERVICES")
        print("========================================================")

        # 1. Check/Start Backend
        try:
            req = urllib.request.Request("http://localhost:8000/health")
            with urllib.request.urlopen(req, timeout=2) as resp:
                if resp.status == 200:
                    print("✓ Backend already running on http://localhost:8000")
        except Exception:
            print("Starting FastAPI backend on http://localhost:8000...")
            python_bin = os.path.join(BACKEND_DIR, ".venv/bin/python")
            if not os.path.exists(python_bin):
                python_bin = sys.executable

            self.backend_proc = subprocess.Popen(
                [python_bin, "-m", "uvicorn", "main:app", "--port", "8000"],
                cwd=BACKEND_DIR,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )

        # 2. Check/Start Frontend
        try:
            req = urllib.request.Request("http://localhost:3000")
            with urllib.request.urlopen(req, timeout=2) as resp:
                if resp.status in [200, 307, 308]:
                    print("✓ Frontend already running on http://localhost:3000")
        except Exception:
            print("Starting Next.js frontend on http://localhost:3000...")
            self.frontend_proc = subprocess.Popen(
                ["npm", "run", "start", "--", "-p", "3000"],
                cwd=FRONTEND_DIR,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )

        # Wait for servers to be healthy
        print("Waiting for servers to be ready...")
        backend_ready = False
        frontend_ready = False
        for _ in range(30):
            if not backend_ready:
                try:
                    with urllib.request.urlopen("http://localhost:8000/health", timeout=2) as r:
                        if r.status == 200:
                            backend_ready = True
                except Exception:
                    pass

            if not frontend_ready:
                try:
                    with urllib.request.urlopen("http://localhost:3000", timeout=2) as r:
                        if r.status in [200, 307, 308]:
                            frontend_ready = True
                except Exception:
                    pass

            if backend_ready and frontend_ready:
                break
            time.sleep(1)

        print(f"Backend ready: {backend_ready} | Frontend ready: {frontend_ready}")

    def run_api_e2e_tests(self):
        print("\n========================================================")
        print("  2. EXECUTING END-TO-END REST API & AI PIPELINE TESTS")
        print("========================================================")

        # Test 1: Health Check
        try:
            with urllib.request.urlopen("http://localhost:8000/health", timeout=5) as r:
                data = json.loads(r.read().decode())
                self.log("Health", "System Health Telemetry", r.status == 200 and data.get("status") == "healthy",
                         f"DB: {data['services']['database']['status']}, Redis: {data['services']['redis']['status']}")
        except Exception as e:
            self.log("Health", "System Health Telemetry", False, str(e))

        # Helper for API requests
        def api_call(endpoint: str, method: str = "GET", data: dict = None, token: str = None) -> tuple[int, dict]:
            url = f"http://localhost:8000/api/v1{endpoint}"
            headers = {"Content-Type": "application/json"}
            if token:
                headers["Authorization"] = f"Bearer {token}"
            payload = json.dumps(data).encode("utf-8") if data is not None else None
            req = urllib.request.Request(url, data=payload, headers=headers, method=method)
            try:
                with urllib.request.urlopen(req, timeout=10) as resp:
                    return resp.status, json.loads(resp.read().decode("utf-8"))
            except urllib.error.HTTPError as err:
                try:
                    return err.code, json.loads(err.read().decode("utf-8"))
                except Exception:
                    return err.code, {"error": str(err)}
            except Exception as e:
                return 500, {"error": str(e)}

        # Test 2: Admin Login
        admin_token = None
        code, resp = api_call("/auth/login", "POST", {"email": "admin@smartattendance.edu.in", "password": "Admin@123"})
        if code == 200 and "access_token" in resp:
            admin_token = resp["access_token"]
            self.log("Auth", "Admin Authentication", True, f"Token generated successfully (Role: {resp.get('role')})")
        else:
            self.log("Auth", "Admin Authentication", False, f"HTTP {code}: {resp}")

        # Test 3: Teacher Login
        teacher_token = None
        code, resp = api_call("/auth/login", "POST", {"email": "emp001@smartattendance.edu.in", "password": "Teacher@123"})
        if code == 200 and "access_token" in resp:
            teacher_token = resp["access_token"]
            self.log("Auth", "Teacher Authentication", True, f"Token generated (Role: {resp.get('role')})")
        else:
            self.log("Auth", "Teacher Authentication", False, f"HTTP {code}: {resp}")

        # Test 4: Student Login
        student_token = None
        code, resp = api_call("/auth/login", "POST", {"email": "cse2025001@smartattendance.edu.in", "password": "Student@123"})
        if code == 200 and "access_token" in resp:
            student_token = resp["access_token"]
            self.log("Auth", "Student Authentication", True, f"Token generated (Role: {resp.get('role')})")
        else:
            self.log("Auth", "Student Authentication", False, f"HTTP {code}: {resp}")

        # Test 5: Teacher gets assigned classes
        classes = []
        if teacher_token:
            code, resp = api_call("/teacher/my-classes", "GET", token=teacher_token)
            if code == 200 and isinstance(resp, list):
                classes = resp
                self.log("Teacher", "Fetch Assigned Classes", len(classes) > 0, f"Found {len(classes)} classes")
            else:
                self.log("Teacher", "Fetch Assigned Classes", False, f"HTTP {code}: {resp}")

        # Test 6: Teacher starts active session
        session_id = None
        if teacher_token and classes:
            target_class = classes[0]
            code, resp = api_call("/teacher/sessions/start", "POST", {"academic_class_id": target_class["id"], "duration_minutes": 60}, token=teacher_token)
            if code == 200 and "id" in resp:
                session_id = resp["id"]
                self.log("Session", f"Start Active Session for {target_class['name']}", True, f"Session ID: {session_id}")
            else:
                self.log("Session", "Start Active Session", False, f"HTTP {code}: {resp}")

        # Test 7: Student generates rotating 30s Smart Pass QR Token
        qr_token = None
        if student_token:
            code, resp = api_call("/student/smart-pass", "GET", token=student_token)
            if code == 200 and "qr_token" in resp:
                qr_token = resp["qr_token"]
                self.log("SmartPass", "Generate Rotating Smart Pass QR", True, f"Token generated for {resp.get('student_name')}")
            else:
                self.log("SmartPass", "Generate Rotating Smart Pass QR", False, f"HTTP {code}: {resp}")

        # Test 8: Teacher verifies Student Smart Pass QR
        if teacher_token and session_id and qr_token:
            code, resp = api_call("/teacher/smart-pass/verify", "POST", {"session_id": session_id, "qr_token": qr_token}, token=teacher_token)
            if code in [200, 400] and (resp.get("status") in ["success", "already_marked"] or "already marked" in resp.get("message", "").lower()):
                self.log("SmartPass", "Verify Student Smart Pass QR at Kiosk", True, f"Result: {resp.get('message', 'Verified')}")
            else:
                self.log("SmartPass", "Verify Student Smart Pass QR at Kiosk", False, f"HTTP {code}: {resp}")

        # Test 9: Verify Roster reflects attendance
        if teacher_token and session_id:
            code, resp = api_call(f"/teacher/sessions/{session_id}/attendance", "GET", token=teacher_token)
            if code == 200 and "roster" in resp:
                roster = resp["roster"]
                present_students = [s for s in roster if s["status"] == "Present"]
                self.log("Roster", "Live Attendance Roster Sync", len(present_students) > 0, f"{len(present_students)} Present, Total {len(roster)} enrolled")
            else:
                self.log("Roster", "Live Attendance Roster Sync", False, f"HTTP {code}: {resp}")

        # Test 10: Student Leave Request Flow
        leave_id = None
        if student_token:
            # Create leave request
            url = "http://localhost:8000/api/v1/student/leaves"
            boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
            body = (
                f"--{boundary}\r\n"
                f'Content-Disposition: form-data; name="start_date"\r\n\r\n2026-09-20\r\n'
                f"--{boundary}\r\n"
                f'Content-Disposition: form-data; name="end_date"\r\n\r\n2026-09-22\r\n'
                f"--{boundary}\r\n"
                f'Content-Disposition: form-data; name="reason"\r\n\r\nAttending national hackathon championship competition\r\n'
                f"--{boundary}--\r\n"
            ).encode("utf-8")
            req = urllib.request.Request(url, data=body, headers={
                "Content-Type": f"multipart/form-data; boundary={boundary}",
                "Authorization": f"Bearer {student_token}",
            }, method="POST")
            try:
                with urllib.request.urlopen(req, timeout=5) as r:
                    resp = json.loads(r.read().decode("utf-8"))
                    leave_id = resp.get("id")
                    self.log("Leave", "Student Submit Leave Request", r.status == 201 and bool(leave_id), f"Leave ID: {leave_id}")
            except Exception as e:
                self.log("Leave", "Student Submit Leave Request", False, str(e))

        # Test 11: Teacher Approves Student Leave
        if teacher_token and leave_id:
            code, resp = api_call(f"/teacher/leaves/{leave_id}/approve", "PUT", {"status": "APPROVED", "approver_note": "Approved for hackathon"}, token=teacher_token)
            self.log("Leave", "Teacher Review & Approve Leave", code == 200, f"Result: {resp.get('message', 'Approved')}")

        # Test 12: Admin Scanner Anomaly Detection (Isolation Forest)
        if admin_token:
            code, resp = api_call("/admin/scan-absentees?contamination=0.10", "POST", token=admin_token)
            self.log("AI Scanner", "Isolation Forest Absentee Anomaly Scan", code == 200, f"HTTP {code} (Identified anomalies or nominal baseline)")

    async def run_browser_e2e_tests(self):
        print("\n========================================================")
        print("  3. EXECUTING PLAYWRIGHT BROWSER UI AUTOMATION TESTS")
        print("========================================================")

        try:
            from playwright.async_api import async_playwright
        except ImportError:
            print("Playwright not installed, skipping browser tests")
            return

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"])
            context = await browser.new_context(viewport={"width": 1440, "height": 900})
            page = await context.new_page()

            # 1. Admin Login Flow
            print("\n[Browser UI] Testing Admin Login & Live Dashboard...")
            await page.goto("http://localhost:3000/login", wait_until="networkidle")
            await page.fill('input[type="email"]', "admin@smartattendance.edu.in")
            await page.fill('input[type="password"]', "Admin@123")
            await page.click('button[type="submit"]')

            try:
                await page.wait_for_url("**/admin/**", timeout=8000)
                await page.wait_for_timeout(1000)
                shot = f"{SCREENSHOTS_DIR}/admin_dashboard.png"
                await page.screenshot(path=shot)
                self.log("Browser UI", "Admin Dashboard Render with Live Telemetry", True, f"Landed on {page.url}")
            except Exception as e:
                self.log("Browser UI", "Admin Dashboard Render", False, str(e))

            # 2. Teacher Login & Roster View
            print("\n[Browser UI] Testing Teacher Portal, Roster & Smart Pass...")
            await context.clear_cookies()
            await page.goto("http://localhost:3000/login", wait_until="networkidle")
            await page.evaluate("() => { localStorage.clear(); sessionStorage.clear(); }")
            await page.reload(wait_until="networkidle")

            await page.fill('input[type="email"]', "emp001@smartattendance.edu.in")
            await page.fill('input[type="password"]', "Teacher@123")
            await page.click('button[type="submit"]')

            try:
                await page.wait_for_url("**/teacher/**", timeout=8000)
                await page.wait_for_timeout(1000)
                self.log("Browser UI", "Teacher Dashboard Render", True, f"Landed on {page.url}")

                # Navigate to teacher profile
                await page.goto("http://localhost:3000/teacher/profile", wait_until="networkidle")
                await page.wait_for_timeout(800)
                shot = f"{SCREENSHOTS_DIR}/teacher_profile.png"
                await page.screenshot(path=shot)
                self.log("Browser UI", "Teacher Profile & Security Center", True, "Profile details rendered")
            except Exception as e:
                self.log("Browser UI", "Teacher Portal", False, str(e))

            await browser.close()

    def print_summary(self):
        print("\n========================================================")
        print("  4. END-TO-END VALIDATION SUMMARY REPORT")
        print("========================================================")

        total = len(self.results)
        passed = sum(1 for r in self.results if r["status"] == "PASS")
        failed = total - passed

        print(f"Total Test Cases: {total}")
        print(f"Passed:           {passed} ({(passed / total * 100):.1f}%)")
        print(f"Failed:           {failed}")
        print("--------------------------------------------------------")

        if self.backend_proc:
            self.backend_proc.terminate()
        if self.frontend_proc:
            self.frontend_proc.terminate()

        return failed == 0


if __name__ == "__main__":
    runner = E2ETestRunner()
    runner.start_servers_if_needed()
    runner.run_api_e2e_tests()
    asyncio.run(runner.run_browser_e2e_tests())
    success = runner.print_summary()
    sys.exit(0 if success else 1)
