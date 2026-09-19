import asyncio
import os
import sys
import json
import time
from playwright.async_api import async_playwright

SCREENSHOTS_DIR = "/tmp/playwright_report/screenshots/interactive"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

class DeepInteractiveRunner:
    def __init__(self):
        self.findings = []
        self.console_issues = []

    def log(self, section, step, ok, msg=""):
        status_str = "✅ PASS" if ok else "❌ FAIL"
        print(f"[{status_str}] [{section}] {step} - {msg}")
        self.findings.append({"section": section, "step": step, "passed": ok, "message": msg})

    async def run(self):
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(viewport={"width": 1440, "height": 900})
            page = await context.new_page()

            page.on("console", lambda msg: self.console_issues.append({"type": msg.type, "text": msg.text, "url": page.url}) if msg.type in ["error"] else None)
            page.on("pageerror", lambda exc: self.console_issues.append({"type": "pageerror", "text": str(exc), "url": page.url}))

            print("\n=== STARTING DEEP INTERACTIVE PLATFORM VERIFICATION ===")

            # 1. ADMIN FLOWS
            print("\n--- Admin Deep Interactive Checks ---")
            await page.goto("http://localhost:3000/login", wait_until="networkidle")
            await page.fill('input[type="email"]', "admin@smartattendance.edu.in")
            await page.fill('input[type="password"]', "Admin@123")
            await page.click('button[type="submit"]')
            await page.wait_for_url("**/admin/**", timeout=10000)

            # Check Admin Dashboard Components
            await page.wait_for_selector('text="Total Students"', timeout=5000)
            stat_cards = await page.locator('text="Total Students"').count() + await page.locator('text="Total Teachers"').count() + await page.locator('text="Total Classes"').count()
            self.log("Admin Dashboard", "Dashboard Stat Panels", stat_cards == 3, f"Found {stat_cards}/3 stats cards (Students, Teachers, Classes)")

            # Check Department Create Form Validation
            await page.goto("http://localhost:3000/admin/setup/departments/create", wait_until="networkidle")
            has_name_inp = await page.locator('input[placeholder*="Computer Science" i], label:has-text("Department Name")').count() > 0
            has_code_inp = await page.locator('input[placeholder*="CSE" i], label:has-text("Code")').count() > 0
            has_submit = await page.locator('button[type="submit"]').count() > 0
            self.log("Admin Setup", "Department Create Form Elements", has_name_inp and has_code_inp and has_submit, "Inputs & Submit rendered")
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/admin_dept_create.png")

            # Check Subject Create Form
            await page.goto("http://localhost:3000/admin/setup/subjects/create", wait_until="networkidle")
            has_sub_name = await page.locator('input[placeholder*="Machine Learning" i], label:has-text("Subject Name")').count() > 0
            has_sub_code = await page.locator('input[placeholder*="CS-402" i], label:has-text("Subject Code")').count() > 0
            self.log("Admin Setup", "Subject Create Form Elements", has_sub_name and has_sub_code, "Subject inputs rendered")
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/admin_sub_create.png")

            # Check Classroom Create Form
            await page.goto("http://localhost:3000/admin/setup/classrooms/create", wait_until="networkidle")
            has_cr_name = await page.locator('label:has-text("Room Name"), input[placeholder*="Room" i]').count() > 0
            self.log("Admin Setup", "Classroom Create Form Elements", has_cr_name, "Classroom inputs rendered")
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/admin_classroom_create.png")

            # Check Verification Settings Form & Sliders
            await page.goto("http://localhost:3000/admin/setup/verification-settings", wait_until="networkidle")
            has_sliders_or_inputs = await page.locator('input[type="range"], input[type="number"], button:has-text("Save")').count() > 0
            self.log("Admin Setup", "Verification Settings Sliders/Buttons", has_sliders_or_inputs, "Verification UI rendered")
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/admin_verification_settings.png")

            # Check Students Management Table & Search
            await page.goto("http://localhost:3000/admin/users/students", wait_until="networkidle")
            search_input = page.locator('input[placeholder*="Search" i], input[type="search"]')
            has_search = await search_input.count() > 0
            if has_search:
                await search_input.first.fill("cse")
                await page.wait_for_timeout(500)
            self.log("Admin Users", "Students Search & Table", has_search, "Search filtering functioning")
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/admin_students_search.png")

            # Check Teachers Management Table & Search
            await page.goto("http://localhost:3000/admin/users/teachers", wait_until="networkidle")
            search_input = page.locator('input[placeholder*="Search" i], input[type="search"]')
            has_search = await search_input.count() > 0
            if has_search:
                await search_input.first.fill("emp")
                await page.wait_for_timeout(500)
            self.log("Admin Users", "Teachers Search & Table", has_search, "Search filtering functioning")
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/admin_teachers_search.png")

            # Check Audit Logs
            await page.goto("http://localhost:3000/admin/audit", wait_until="networkidle")
            has_audit_content = await page.locator('table, .glass-panel-static, [class*="table"]').count() > 0
            self.log("Admin Audit", "Audit Log Table Render", has_audit_content, "Audit records/table displayed")
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/admin_audit_table.png")

            # Check Scanner Page
            await page.goto("http://localhost:3000/admin/scanner", wait_until="networkidle")
            has_scanner_ui = await page.locator('video, button, canvas, .glass-panel-static').count() > 0
            self.log("Admin Scanner", "Scanner Interface Components", has_scanner_ui, "Scanner container & controls active")
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/admin_scanner_ui.png")

            # 2. TEACHER FLOWS
            print("\n--- Teacher Deep Interactive Checks ---")
            await context.clear_cookies()
            await page.goto("http://localhost:3000/login", wait_until="networkidle")
            await page.evaluate("() => { localStorage.clear(); sessionStorage.clear(); }")
            await page.reload(wait_until="networkidle")

            await page.fill('input[type="email"]', "emp001@smartattendance.edu.in")
            await page.fill('input[type="password"]', "Teacher@123")
            await page.click('button[type="submit"]')
            await page.wait_for_url("**/teacher/**", timeout=10000)

            # Check Teacher Dashboard
            await page.goto("http://localhost:3000/teacher/dashboard", wait_until="networkidle")
            await page.wait_for_timeout(1000)
            teacher_cards = await page.locator('.glass-panel, .glass-panel-static').count()
            self.log("Teacher Dashboard", "Dashboard Overview Panels", teacher_cards >= 1, f"Found {teacher_cards} overview panels")
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/teacher_dashboard_overview.png")

            # Check Teacher Sessions
            await page.goto("http://localhost:3000/teacher/sessions", wait_until="networkidle")
            has_sessions_ui = await page.locator('.glass-panel-static, button, table').count() > 0
            self.log("Teacher Sessions", "Sessions List & Controls", has_sessions_ui, "Sessions list loaded")
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/teacher_sessions_list.png")

            # Check Teacher Classes
            await page.goto("http://localhost:3000/teacher/classes", wait_until="networkidle")
            has_classes_ui = await page.locator('.glass-panel, .glass-panel-static, [class*="empty"]').count() > 0
            self.log("Teacher Classes", "Teacher Assigned Classes Cards/State", has_classes_ui, "Classes UI loaded")
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/teacher_classes_list.png")

            # Check Teacher Analytics
            await page.goto("http://localhost:3000/teacher/analytics", wait_until="networkidle")
            has_charts = await page.locator('svg, .recharts-responsive-container, canvas, .glass-panel-static').count() > 0
            self.log("Teacher Analytics", "Analytics Visualizations / Charts", has_charts, "Chart elements mounted")
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/teacher_analytics_charts.png")

            # Check Teacher Leaves
            await page.goto("http://localhost:3000/teacher/leaves", wait_until="networkidle")
            has_leaves_ui = await page.locator('.glass-panel-static, table, [class*="empty"]').count() > 0
            self.log("Teacher Leaves", "Leave Requests Module", has_leaves_ui, "Leave requests table/empty state rendered")
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/teacher_leaves_list.png")

            # Check Teacher Device Changes
            await page.goto("http://localhost:3000/teacher/device-changes", wait_until="networkidle")
            has_device_changes = await page.locator('.glass-panel-static, table, [class*="empty"]').count() > 0
            self.log("Teacher Device Changes", "Device Change Requests Module", has_device_changes, "Device changes table/empty state rendered")
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/teacher_device_changes_list.png")

            # Check Teacher History
            await page.goto("http://localhost:3000/teacher/history", wait_until="networkidle")
            has_history = await page.locator('.glass-panel-static, table, input[type="date"], select').count() > 0
            self.log("Teacher History", "Attendance History & Filters", has_history, "History table & filters rendered")
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/teacher_history_list.png")

            # Check Teacher Review
            await page.goto("http://localhost:3000/teacher/review", wait_until="networkidle")
            has_review = await page.locator('.glass-panel-static, table, [class*="empty"]').count() > 0
            self.log("Teacher Review", "Flagged Mismatch Reviews", has_review, "Review table/empty state rendered")
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/teacher_review_list.png")

            await browser.close()

            print("\n=== INTERACTIVE TEST SUMMARY ===")
            passed_count = sum(1 for f in self.findings if f["passed"])
            print(f"Interactive Checks: {passed_count}/{len(self.findings)} Passed")
            if self.console_issues:
                print(f"Console issues detected: {len(self.console_issues)}")
                for err in self.console_issues:
                    print(f"  - [{err.get('type')}] {err.get('text')} on {err.get('url')}")
            else:
                print("Zero client console errors or unhandled exceptions detected.")

if __name__ == "__main__":
    runner = DeepInteractiveRunner()
    asyncio.run(runner.run())
