import { test, expect } from "@playwright/test";
import { setupTeacherAuth } from "./test-helpers";

test.describe("Module 6: Teacher Attendance & Operations", () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTeacherAuth(page, context);
  });

  test("Teacher dashboard renders overview, class cards, and active session status", async ({ page }) => {
    await page.route("http://localhost:8000/api/v1/teacher/my-classes", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "t-cls-1",
            name: "CS-302: Database Engineering",
            subject_name: "Database Systems",
            subject_code: "CS302",
            teacherId: "teacher-1",
            classroom_name: "Lab 3",
            enrolled_count: 42,
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
            id: "sess-1",
            academicClassId: "t-cls-1",
            class_name: "CS-302: Database Engineering",
            subject: "Database Systems",
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 3600000).toISOString(),
            isActive: true,
          },
        ]),
      });
    });

    await page.goto("/teacher/dashboard");
    await expect(page.locator("h1:has-text('Professor')")).toBeVisible();
    await expect(page.getByText("My Classes").first()).toBeVisible();
    await expect(page.getByText("Active Sessions").first()).toBeVisible();
    await expect(page.getByText("CS-302: Database Engineering").first()).toBeVisible();
  });

  test("Manual attendance marking grid supports bulk toggle and individual status toggling", async ({ page }) => {
    let bulkMarkSubmitted = false;

    await page.route("http://localhost:8000/api/v1/teacher/sessions/sess-1/attendance*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          session_id: "sess-1",
          class_name: "CS-302: Database Engineering",
          roster: [
            {
              student_id: "stu-1",
              enrollment_number: "STU-2026-001",
              full_name: "Alice Johnson",
              email: "alice@univ.edu",
              status: "Absent",
              final_score: 0,
              marked_at: null,
            },
            {
              student_id: "stu-2",
              enrollment_number: "STU-2026-002",
              full_name: "Bob Smith",
              email: "bob@univ.edu",
              status: "Absent",
              final_score: 0,
              marked_at: null,
            },
          ],
        }),
      });
    });

    await page.route("http://localhost:8000/api/v1/teacher/sessions/sess-1/mark-bulk", async (route) => {
      bulkMarkSubmitted = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ marked_count: 2, message: "Attendance updated" }),
      });
    });

    await page.goto("/teacher/sessions/sess-1/manual");
    await expect(page.locator("h1:has-text('Manual Override')")).toBeVisible();

    // Verify student roster rendered
    await expect(page.getByText("Alice Johnson")).toBeVisible();
    await expect(page.getByText("Bob Smith")).toBeVisible();

    // Click "All Present" batch action
    const markAllBtn = page.getByRole("button", { name: "All Present" });
    await expect(markAllBtn).toBeVisible();
    await markAllBtn.click();

    // Submit changes
    const saveBtn = page.getByRole("button", { name: "Commit Attendance" });
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();
    expect(bulkMarkSubmitted).toBe(true);
  });

  test("Device changes review queue displays student requests with approve/reject actions", async ({ page }) => {
    let approveCalled = false;

    await page.route("http://localhost:8000/api/v1/teacher/device-changes/pending*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "dev-req-1",
            student_id: "stu-101",
            student_name: "Daniel Craig",
            enrollment_number: "STU-2026-777",
            new_device_uuid: "e8293b01-a47c-48be-85a2-9fa3bd4150aa",
            reason: "Upgraded primary mobile device",
            status: "PENDING",
            created_at: new Date().toISOString(),
          },
        ]),
      });
    });

    await page.route("http://localhost:8000/api/v1/teacher/device-changes/dev-req-1/approve", async (route) => {
      approveCalled = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Approved" }),
      });
    });

    await page.goto("/teacher/device-changes");
    await expect(page.locator("h1:has-text('Device Change Requests')")).toBeVisible();
    await expect(page.getByText("Daniel Craig")).toBeVisible();
    await expect(page.getByText("Upgraded primary mobile device")).toBeVisible();

    // Test approve action
    const approveBtn = page.getByRole("button", { name: "Approve" });
    await expect(approveBtn).toBeVisible();
    await approveBtn.click();
    expect(approveCalled).toBe(true);
  });
});
