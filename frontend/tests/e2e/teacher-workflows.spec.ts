import { test, expect } from "@playwright/test";
import { setupTeacherAuth } from "./test-helpers";
import path from "path";

const SCREENSHOT_DIR = "/home/pratham/.gemini/antigravity/brain/7361ddd5-ec3e-48a0-aeb2-add5b2ce03f5";

test.describe("Module: Teacher Specialized Operations & Analytics", () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTeacherAuth(page, context);
  });

  test("Analytics dashboard renders class metrics and charts", async ({ page }) => {
    await page.route("http://localhost:8000/api/v1/teacher/my-classes", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: "cls-analytics-1", name: "CS-401", subject: "Distributed Systems" },
        ]),
      });
    });

    await page.route("http://localhost:8000/api/v1/teacher/classes/cls-analytics-1/stats", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          total_sessions: 24,
          overall_attendance_percentage: 88.5,
          total_enrolled: 42,
          history: [
            { session_name: "Session 1", attendance_percentage: 92.0 },
            { session_name: "Session 2", attendance_percentage: 85.0 },
          ],
        }),
      });
    });

    await page.goto("/teacher/analytics");
    await expect(page.locator("h1:has-text('Analytics Dashboard')")).toBeVisible();
    await expect(page.getByText("88.5%")).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "deep_teacher_analytics.png"), fullPage: true });
  });

  test("Device change approval queue allows approving hardware changes", async ({ page }) => {
    let actionFired = false;

    await page.route("http://localhost:8000/api/v1/teacher/device-changes/pending", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "dev-req-1",
            student_id: "stu-dev-1",
            student_name: "Bruce Wayne",
            enrollment_number: "STU-2026-007",
            new_device_uuid: "pixel-8-pro-uuid-9999",
            reason: "Upgraded primary mobile device",
            status: "PENDING",
            created_at: new Date().toISOString(),
          },
        ]),
      });
    });

    await page.route("http://localhost:8000/api/v1/teacher/device-changes/dev-req-1/approve", async (route) => {
      actionFired = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Approved successfully" }),
      });
    });

    await page.goto("/teacher/device-changes");
    await expect(page.locator("h1:has-text('Device Change Requests')")).toBeVisible();
    await expect(page.getByText("Bruce Wayne")).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "deep_teacher_devices.png"), fullPage: true });

    const approveBtn = page.getByRole("button", { name: "Approve" }).first();
    await expect(approveBtn).toBeVisible();
    await approveBtn.click();
    expect(actionFired).toBe(true);
  });

  test("Leave requests view supports review and approval with remarks", async ({ page }) => {
    let leaveApproved = false;

    await page.route("http://localhost:8000/api/v1/teacher/leaves/pending", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "leave-req-1",
            student_id: "stu-leave-1",
            student_name: "Clark Kent",
            enrollment_number: "STU-2026-999",
            start_date: "2026-09-20T00:00:00.000Z",
            end_date: "2026-09-22T00:00:00.000Z",
            reason: "Medical appointment and recovery",
            status: "PENDING",
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
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "deep_teacher_leaves.png"), fullPage: true });

    const approveBtn = page.getByRole("button", { name: "Approve" }).first();
    await expect(approveBtn).toBeVisible();
    await approveBtn.click();

    // Confirm dialog
    const confirmBtn = page.getByRole("button", { name: "Confirm Action" });
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      expect(leaveApproved).toBe(true);
    }
  });

  test("Teacher profile view displays faculty credentials and password change card", async ({ page }) => {
    await page.goto("/teacher/profile");
    await expect(page.locator("h1:has-text('Faculty Profile & Security')")).toBeVisible();
    await expect(page.locator("input[placeholder='Enter current password']")).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "deep_teacher_profile.png"), fullPage: true });
  });

  test("Flagged attendance review detail inspects biometric metrics and approves override", async ({ page }) => {
    let reviewSubmitted = false;

    await page.route("http://localhost:8000/api/v1/teacher/attendance/flagged-item-1", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "flagged-item-1",
          student_id: "stu-flag-1",
          student_name: "Diana Prince",
          enrollment_number: "STU-2026-003",
          class_name: "CS-401: Distributed Systems",
          face_match_score: 0.62,
          liveness_score: 0.88,
          final_ai_score: 0.65,
          distance_meters: 14.5,
          flags: ["FACE_SCORE_LOW"],
          created_at: new Date().toISOString(),
        }),
      });
    });

    await page.route("http://localhost:8000/api/v1/teacher/attendance/flagged-item-1/review", async (route) => {
      reviewSubmitted = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Attendance verified and approved" }),
      });
    });

    await page.goto("/teacher/review/flagged-item-1");
    await expect(page.locator("h1:has-text('Review Flagged Record')")).toBeVisible();
    await expect(page.locator("p:has-text('Diana Prince')")).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "deep_review_detail.png"), fullPage: true });

    // Select Approve
    const approveBtn = page.getByRole("button", { name: "Approve" }).first();
    await expect(approveBtn).toBeVisible();
    await approveBtn.click();
    const confirmBtn = page.getByRole("button", { name: "Confirm" });
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      expect(reviewSubmitted).toBe(true);
    }
  });

  test("Manual session attendance roster permits toggling present/absent states and saving", async ({ page }) => {
    let bulkMarkSubmitted = false;

    await page.route("http://localhost:8000/api/v1/teacher/sessions/ses-manual-1/attendance", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            session_id: "ses-manual-1",
            class_name: "CS-401: Distributed Systems",
            total_students: 2,
            present_count: 1,
            absent_count: 1,
            roster: [
              {
                student_id: "stu-m-1",
                student_name: "Peter Parker",
                enrollment_number: "STU-2026-701",
                status: "Present",
              },
              {
                student_id: "stu-m-2",
                student_name: "Miles Morales",
                enrollment_number: "STU-2026-702",
                status: "Absent",
              },
            ],
          }),
        });
      }
    });

    await page.route("http://localhost:8000/api/v1/teacher/sessions/ses-manual-1/mark-bulk", async (route) => {
      bulkMarkSubmitted = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Attendance saved" }),
      });
    });

    await page.goto("/teacher/sessions/ses-manual-1/manual");
    await expect(page.locator("h1:has-text('Manual Override')")).toBeVisible();
    await expect(page.getByText("Peter Parker")).toBeVisible();
    await expect(page.getByText("Miles Morales")).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "deep_session_manual.png"), fullPage: true });

    // Submit bulk attendance
    const saveBtn = page.getByRole("button", { name: "Commit Attendance" });
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();
    expect(bulkMarkSubmitted).toBe(true);
  });
});
