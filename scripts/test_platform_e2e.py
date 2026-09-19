import asyncio
import os
import sys
import json
import time
from typing import Dict, List, Any
import urllib.request
import urllib.error

SCREENSHOTS_DIR = "/tmp/playwright_report/screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

class TestRunner:
    def __init__(self):
        self.results: List[Dict[str, Any]] = []
        self.console_errors: List[Dict[str, Any]] = []
        self.network_failures: List[Dict[str, Any]] = []

    def log_result(self, module: str, test_name: str, passed: bool, details: str = "", screenshot: str = None):
        self.results.append({
            "module": module,
            "test": test_name,
            "status": "PASS" if passed else "FAIL",
            "details": details,
            "screenshot": screenshot
        })
        status_sym = "✅ PASS" if passed else "❌ FAIL"
        print(f"[{status_sym}] [{module}] {test_name}: {details}")

    def check_backend_api(self):
        print("\n--- Testing Backend API Direct Connectivity ---")
        health_url = "http://localhost:8000/health"
        try:
            req = urllib.request.Request(health_url)
            with urllib.request.urlopen(req, timeout=5) as response:
                body = response.read().decode('utf-8')
                data = json.loads(body)
                self.log_result("Backend", "Health Check Endpoint", response.status == 200, f"Status: {data.get('status')}, DB: {data.get('database')}, Redis: {data.get('redis')}")
        except Exception as e:
            self.log_result("Backend", "Health Check Endpoint", False, f"Error: {e}")

        # Test auth endpoints
        for role, email, password in [
            ("Admin", "admin@smartattendance.edu.in", "Admin@123"),
            ("Teacher", "emp001@smartattendance.edu.in", "Teacher@123"),
            ("Student", "cse2025001@smartattendance.edu.in", "Student@123")
        ]:
            login_url = "http://localhost:8000/api/v1/auth/login"
            try:
                payload = json.dumps({"email": email, "password": password}).encode('utf-8')
                req = urllib.request.Request(login_url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
                with urllib.request.urlopen(req, timeout=5) as resp:
                    resp_data = json.loads(resp.read().decode('utf-8'))
                    has_token = "access_token" in resp_data or "token" in resp_data or "accessToken" in resp_data
                    token_field = resp_data.get("access_token") or resp_data.get("token") or resp_data.get("accessToken")
                    user_role = resp_data.get("user", {}).get("role") or resp_data.get("role")
                    self.log_result("Backend Auth", f"Login {role} ({email})", resp.status == 200 and bool(token_field), f"User role: {user_role}")
            except Exception as e:
                self.log_result("Backend Auth", f"Login {role} ({email})", False, f"Login failed: {e}")

    async def run_playwright_tests(self):
        from playwright.async_api import async_playwright

        print("\n--- Starting Playwright Browser Test Run ---")
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"])
            context = await browser.new_context(viewport={"width": 1440, "height": 900})
            page = await context.new_page()

            # Attach event handlers
            def on_console(msg):
                if msg.type in ["error"]:
                    self.console_errors.append({"url": page.url, "text": msg.text, "location": msg.location})
            
            def on_page_error(exc):
                self.console_errors.append({"url": page.url, "text": f"Uncaught exception: {str(exc)}"})

            def on_response(response):
                if response.status >= 400 and not response.url.endswith("/favicon.ico"):
                    self.network_failures.append({
                        "url": response.url,
                        "status": response.status,
                        "statusText": response.status_text,
                        "page": page.url
                    })

            page.on("console", on_console)
            page.on("pageerror", on_page_error)
            page.on("response", on_response)

            # ----------------------------------------------------
            # 1. Test Unauthenticated Protected Routes Redirection
            # ----------------------------------------------------
            print("\n[Suite 1] Testing Unauthenticated Route Security...")
            try:
                await page.goto("http://localhost:3000/admin/dashboard", wait_until="networkidle", timeout=15000)
                await page.wait_for_timeout(1000)
                curr_url = page.url
                is_redirected = "/login" in curr_url or "/admin/dashboard" not in curr_url
                self.log_result("Security", "Unauthenticated Admin Access Redirection", is_redirected, f"Redirected to {curr_url}")
            except Exception as e:
                self.log_result("Security", "Unauthenticated Admin Access Redirection", False, f"Error: {e}")

            try:
                await page.goto("http://localhost:3000/teacher/dashboard", wait_until="networkidle", timeout=15000)
                await page.wait_for_timeout(1000)
                curr_url = page.url
                is_redirected = "/login" in curr_url or "/teacher/dashboard" not in curr_url
                self.log_result("Security", "Unauthenticated Teacher Access Redirection", is_redirected, f"Redirected to {curr_url}")
            except Exception as e:
                self.log_result("Security", "Unauthenticated Teacher Access Redirection", False, f"Error: {e}")

            # ----------------------------------------------------
            # 2. Test Admin Login & All Admin Modules
            # ----------------------------------------------------
            print("\n[Suite 2] Testing Admin Login & Dashboard...")
            await page.goto("http://localhost:3000/login", wait_until="networkidle")
            
            # Fill login
            email_input = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]')
            pwd_input = page.locator('input[type="password"], input[name="password"], input[placeholder*="password" i]')
            submit_btn = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Login")')

            await email_input.fill("admin@smartattendance.edu.in")
            await pwd_input.fill("Admin@123")
            await submit_btn.click()
            
            try:
                await page.wait_for_url("**/admin/**", timeout=10000)
                shot = f"{SCREENSHOTS_DIR}/admin_dashboard.png"
                await page.screenshot(path=shot)
                self.log_result("Admin Auth", "Admin Login Flow", True, f"Landed on {page.url}", shot)
            except Exception as e:
                shot = f"{SCREENSHOTS_DIR}/admin_login_fail.png"
                await page.screenshot(path=shot)
                self.log_result("Admin Auth", "Admin Login Flow", False, f"Failed waiting for /admin: {e}", shot)

            # Test all Admin Modules
            admin_routes = [
                ("Admin Dashboard", "http://localhost:3000/admin/dashboard", "Dashboard Stats & Metrics"),
                ("Admin Audit", "http://localhost:3000/admin/audit", "Audit Logs Module"),
                ("Admin Scanner", "http://localhost:3000/admin/scanner", "Kiosk / Attendance Scanner"),
                ("Admin Setup Departments", "http://localhost:3000/admin/setup/departments", "Departments List"),
                ("Admin Setup Dept Create", "http://localhost:3000/admin/setup/departments/create", "Department Creation Form"),
                ("Admin Setup Designations", "http://localhost:3000/admin/setup/designations", "Designations List"),
                ("Admin Setup Subjects", "http://localhost:3000/admin/setup/subjects", "Subjects List"),
                ("Admin Setup Subject Create", "http://localhost:3000/admin/setup/subjects/create", "Subject Creation Form"),
                ("Admin Setup Classrooms", "http://localhost:3000/admin/setup/classrooms", "Classrooms & Geofences List"),
                ("Admin Setup Classroom Create", "http://localhost:3000/admin/setup/classrooms/create", "Classroom Creation Form"),
                ("Admin Setup Verification", "http://localhost:3000/admin/setup/verification-settings", "AI & Verification Thresholds"),
                ("Admin Students Management", "http://localhost:3000/admin/users/students", "Students Directory"),
                ("Admin Student Add", "http://localhost:3000/admin/users/students/add", "Student Enrollment Form"),
                ("Admin Teachers Management", "http://localhost:3000/admin/users/teachers", "Teachers Directory"),
                ("Admin Teacher Add", "http://localhost:3000/admin/users/teachers/add", "Teacher Registration Form"),
                ("Admin Classes Management", "http://localhost:3000/admin/classes", "Classes Directory"),
                ("Admin Class Create", "http://localhost:3000/admin/classes/create", "Class Creation Form"),
            ]

            print("\n[Suite 3] Testing All Admin Submodules...")
            for mod_name, route_url, description in admin_routes:
                try:
                    resp = await page.goto(route_url, wait_until="networkidle", timeout=12000)
                    await page.wait_for_timeout(800)
                    
                    status_code = resp.status if resp else 0
                    slug = mod_name.lower().replace(" ", "_")
                    shot = f"{SCREENSHOTS_DIR}/{slug}.png"
                    await page.screenshot(path=shot)

                    # Check for client error indicators or error boundary
                    has_error_boundary = await page.locator('text="Something went wrong"').count() > 0 or await page.locator('text="Application error"').count() > 0 or await page.locator('text="Internal Server Error"').count() > 0
                    has_404 = await page.locator('text="404"').count() > 0 and await page.locator('text="This page could not be found"').count() > 0

                    if status_code in [200, 304] and not has_error_boundary and not has_404:
                        self.log_result("Admin Module", f"{mod_name} ({route_url})", True, f"HTTP {status_code}, rendered successfully", shot)
                    else:
                        self.log_result("Admin Module", f"{mod_name} ({route_url})", False, f"HTTP {status_code}, error_boundary={has_error_boundary}, 404={has_404}", shot)
                except Exception as e:
                    self.log_result("Admin Module", f"{mod_name} ({route_url})", False, f"Navigation failed: {e}")

            # ----------------------------------------------------
            # 3. Test Teacher Login & All Teacher Modules
            # ----------------------------------------------------
            print("\n[Suite 4] Testing Teacher Login & Teacher Modules...")
            # Clear storage / cookies for fresh session
            await context.clear_cookies()
            await page.goto("http://localhost:3000/login", wait_until="networkidle")
            await page.evaluate("() => { localStorage.clear(); sessionStorage.clear(); }")
            await page.reload(wait_until="networkidle")

            email_input = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]')
            pwd_input = page.locator('input[type="password"], input[name="password"], input[placeholder*="password" i]')
            submit_btn = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Login")')

            await email_input.fill("emp001@smartattendance.edu.in")
            await pwd_input.fill("Teacher@123")
            await submit_btn.click()

            try:
                await page.wait_for_url("**/teacher/**", timeout=10000)
                shot = f"{SCREENSHOTS_DIR}/teacher_dashboard.png"
                await page.screenshot(path=shot)
                self.log_result("Teacher Auth", "Teacher Login Flow", True, f"Landed on {page.url}", shot)
            except Exception as e:
                shot = f"{SCREENSHOTS_DIR}/teacher_login_fail.png"
                await page.screenshot(path=shot)
                self.log_result("Teacher Auth", "Teacher Login Flow", False, f"Failed waiting for /teacher: {e}", shot)

            teacher_routes = [
                ("Teacher Dashboard", "http://localhost:3000/teacher/dashboard", "Teacher Overview & Stats"),
                ("Teacher Sessions", "http://localhost:3000/teacher/sessions", "Attendance Sessions List"),
                ("Teacher Classes", "http://localhost:3000/teacher/classes", "Assigned Classes"),
                ("Teacher Analytics", "http://localhost:3000/teacher/analytics", "Subject & Class Analytics"),
                ("Teacher Leaves", "http://localhost:3000/teacher/leaves", "Student Leave Requests"),
                ("Teacher Device Changes", "http://localhost:3000/teacher/device-changes", "Device Change Requests"),
                ("Teacher History", "http://localhost:3000/teacher/history", "Attendance Session History"),
                ("Teacher Review", "http://localhost:3000/teacher/review", "Flagged Mismatch Reviews"),
            ]

            print("\n[Suite 5] Testing All Teacher Submodules...")
            for mod_name, route_url, description in teacher_routes:
                try:
                    resp = await page.goto(route_url, wait_until="networkidle", timeout=12000)
                    await page.wait_for_timeout(800)
                    
                    status_code = resp.status if resp else 0
                    slug = mod_name.lower().replace(" ", "_")
                    shot = f"{SCREENSHOTS_DIR}/{slug}.png"
                    await page.screenshot(path=shot)

                    has_error_boundary = await page.locator('text="Something went wrong"').count() > 0 or await page.locator('text="Application error"').count() > 0 or await page.locator('text="Internal Server Error"').count() > 0
                    has_404 = await page.locator('text="404"').count() > 0 and await page.locator('text="This page could not be found"').count() > 0

                    if status_code in [200, 304] and not has_error_boundary and not has_404:
                        self.log_result("Teacher Module", f"{mod_name} ({route_url})", True, f"HTTP {status_code}, rendered successfully", shot)
                    else:
                        self.log_result("Teacher Module", f"{mod_name} ({route_url})", False, f"HTTP {status_code}, error_boundary={has_error_boundary}, 404={has_404}", shot)
                except Exception as e:
                    self.log_result("Teacher Module", f"{mod_name} ({route_url})", False, f"Navigation failed: {e}")

            # ----------------------------------------------------
            # 4. Test Student Login Flow
            # ----------------------------------------------------
            print("\n[Suite 6] Testing Student Login Behavior...")
            await context.clear_cookies()
            await page.goto("http://localhost:3000/login", wait_until="networkidle")
            await page.evaluate("() => { localStorage.clear(); sessionStorage.clear(); }")
            await page.reload(wait_until="networkidle")

            email_input = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]')
            pwd_input = page.locator('input[type="password"], input[name="password"], input[placeholder*="password" i]')
            submit_btn = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Login")')

            await email_input.fill("cse2025001@smartattendance.edu.in")
            await pwd_input.fill("Student@123")
            await submit_btn.click()
            await page.wait_for_timeout(2000)

            student_shot = f"{SCREENSHOTS_DIR}/student_login_result.png"
            await page.screenshot(path=student_shot)
            curr_url = page.url
            self.log_result("Student Auth", "Student Login Response", True, f"Current page: {curr_url}", student_shot)

            await browser.close()

    def generate_report(self):
        report_path = "/tmp/playwright_report/summary.json"
        total_tests = len(self.results)
        passed_tests = sum(1 for r in self.results if r["status"] == "PASS")
        failed_tests = total_tests - passed_tests

        summary_data = {
            "total": total_tests,
            "passed": passed_tests,
            "failed": failed_tests,
            "results": self.results,
            "console_errors": self.console_errors,
            "network_failures": self.network_failures
        }

        with open(report_path, "w") as f:
            json.dump(summary_data, f, indent=2)

        print("\n" + "="*70)
        print(f"TEST RUN COMPLETED: {passed_tests}/{total_tests} Passed ({failed_tests} Failed)")
        print(f"Report saved to: {report_path}")
        print("="*70)

if __name__ == "__main__":
    runner = TestRunner()
    runner.check_backend_api()
    asyncio.run(runner.run_playwright_tests())
    runner.generate_report()
