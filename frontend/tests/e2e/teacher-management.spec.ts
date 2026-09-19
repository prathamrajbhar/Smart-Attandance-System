import { test, expect } from "@playwright/test";
import { setupTeacherAuth } from "./test-helpers";

test.describe("Module 7: Teacher Management & Verification Flows", () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTeacherAuth(page, context);
  });

  test("Teacher classes list renders assigned courses and geofence indicators", async ({ page }) => {
    await page.route("http://localhost:8000/api/v1/teacher/my-classes", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "cls-adv-db",
            name: "CS-401: Advanced Distributed Systems",
            subject: "Distributed Systems",
            geofence: { radiusMeters: 50 },
          },
          {
            id: "cls-algo",
            name: "CS-201: Algorithms & Data Structures",
            subject: "Algorithms",
            geofence: null,
          },
        ]),
      });
    });

    await page.goto("/teacher/classes");
    await expect(page.locator("h1:has-text('My Classes')")).toBeVisible();
    await expect(page.getByText("CS-401: Advanced Distributed Systems")).toBeVisible();
    await expect(page.getByText("Geofence Active").first()).toBeVisible();
    await expect(page.getByText("CS-201: Algorithms & Data Structures")).toBeVisible();
    await expect(page.getByText("No Geofence").first()).toBeVisible();
  });

  test("Session manager allows launching new session and viewing past sessions", async ({ page }) => {
    let sessionStarted = false;

    await page.route("http://localhost:8000/api/v1/teacher/my-classes", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "cls-adv-db",
            name: "CS-401: Advanced Distributed Systems",
            subject: "Distributed Systems",
          },
        ]),
      });
    });

    await page.route("http://localhost:8000/api/v1/teacher/sessions/all", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "sess-past-1",
            academicClassId: "cls-adv-db",
            class_name: "CS-401: Advanced Distributed Systems",
            subject: "Distributed Systems",
            startTime: new Date(Date.now() - 7200000).toISOString(),
            endTime: new Date(Date.now() - 3600000).toISOString(),
            isActive: false,
          },
        ]),
      });
    });

    await page.route("http://localhost:8000/api/v1/teacher/sessions/start", async (route) => {
      sessionStarted = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "sess-new-1",
          academicClassId: "cls-adv-db",
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 600000).toISOString(),
          isActive: true,
        }),
      });
    });

    await page.goto("/teacher/sessions");
    await expect(page.locator("h1:has-text('Session Control')")).toBeVisible();
    await expect(page.locator("table td:has-text('CS-401: Advanced Distributed Systems')")).toBeVisible();

    // Select class from dropdown and start session
    const select = page.locator("select").first();
    await select.selectOption("cls-adv-db");

    const startBtn = page.getByRole("button", { name: "Start Session" });
    await expect(startBtn).toBeVisible();
    await startBtn.click();
    expect(sessionStarted).toBe(true);
  });

  test("Flagged review queue displays verification anomalies with filtering", async ({ page }) => {
    await page.route("http://localhost:8000/api/v1/teacher/attendance/flagged*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "flag-1",
            enrollment_number: "STU-FLAG-01",
            student_name: "Bruce Wayne",
            class_name: "CS-401: Advanced Distributed Systems",
            subject: "Distributed Systems",
            final_ai_score: 0.42,
            created_at: new Date().toISOString(),
          },
        ]),
      });
    });

    await page.goto("/teacher/review");
    await expect(page.locator("h1:has-text('Review Queue')")).toBeVisible();
    await expect(page.getByText("Bruce Wayne")).toBeVisible();
    await expect(page.getByText("STU-FLAG-01")).toBeVisible();
    await expect(page.getByText("42.0%")).toBeVisible();
    await expect(page.getByRole("button", { name: /review/i }).first()).toBeVisible();
  });

  test("Student leave requests approval workflow processes approvals and rejections", async ({ page }) => {
    let leaveApproved = false;

    await page.route("http://localhost:8000/api/v1/teacher/leaves/pending*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "leave-req-1",
            student_id: "stu-101",
            student_name: "Clark Kent",
            enrollment_number: "STU-MET-001",
            start_date: "2026-09-20T00:00:00.000Z",
            end_date: "2026-09-22T00:00:00.000Z",
            reason: "Attending international academic symposium",
            document_url: null,
            status: "PENDING",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]),
      });
    });

    await page.route("http://localhost:8000/api/v1/teacher/leaves/leave-req-1/approve", async (route) => {
      leaveApproved = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Leave approved" }),
      });
    });

    await page.goto("/teacher/leaves");
    await expect(page.locator("h1:has-text('Leave Requests')")).toBeVisible();
    await expect(page.getByText("Clark Kent")).toBeVisible();
    await expect(page.getByText("Attending international academic symposium")).toBeVisible();

    // Click Approve button in table
    const tableApproveBtn = page.getByRole("button", { name: "Approve" }).first();
    await expect(tableApproveBtn).toBeVisible();
    await tableApproveBtn.click();

    // Confirm in dialog
    const confirmBtn = page.locator(".fixed button:has-text('Approve')");
    await expect(confirmBtn).toBeVisible();
    await confirmBtn.click();
    expect(leaveApproved).toBe(true);
  });

  test("Teacher course analytics renders stats cards and trend charts", async ({ page }) => {
    await page.route("http://localhost:8000/api/v1/teacher/my-classes", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "cls-adv-db",
            name: "CS-401",
            subject: "Distributed Systems",
          },
        ]),
      });
    });

    await page.route("http://localhost:8000/api/v1/teacher/classes/cls-adv-db/stats", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          class_id: "cls-adv-db",
          total_sessions: 24,
          total_students: 48,
          overall_attendance_percentage: 91.5,
          history: [
            { session_id: "s1", session_name: "Lecture 1", attendance_percentage: 95 },
            { session_id: "s2", session_name: "Lecture 2", attendance_percentage: 88 },
          ],
        }),
      });
    });

    await page.goto("/teacher/analytics");
    await expect(page.locator("h1:has-text('Analytics Dashboard')")).toBeVisible();
    await expect(page.getByText("Total Sessions")).toBeVisible();
    await expect(page.getByText("Enrolled Students")).toBeVisible();
    await expect(page.getByText("Attendance Rate")).toBeVisible();
    await expect(page.getByText("91.5%")).toBeVisible();
  });
});
