import { test, expect } from "@playwright/test";
import { setupAdminAuth, setupTeacherAuth } from "./test-helpers";
import path from "path";

const SCREENSHOT_DIR = "/home/pratham/.gemini/antigravity/brain/7361ddd5-ec3e-48a0-aeb2-add5b2ce03f5";

test.describe("Deep Feature Verification & Screenshot Audits", () => {
  test("Teacher profile and edit views load data directly without list errors", async ({ page, context }) => {
    await setupAdminAuth(page, context);

    const mockTeacher = {
      id: "t-101",
      userId: "u-101",
      email: "dr.sarah@university.edu",
      employee_id: "EMP-2026-101",
      first_name: "Sarah",
      last_name: "Connor",
      phone: "+1-555-0199",
      qualification: "Ph.D. in Distributed Systems",
      specialization: "Fault Tolerant Consensus",
      experience_years: 12,
      joining_date: "2020-08-15T00:00:00.000Z",
      department_id: "dept-1",
      designation_id: "desig-1",
      department: "Computer Science & Engineering",
      designation: "Associate Professor",
    };

    await page.route("http://localhost:8000/api/v1/admin/users/teachers/t-101", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockTeacher),
        });
      } else if (route.request().method() === "PUT") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockTeacher),
        });
      }
    });

    await page.route("http://localhost:8000/api/v1/admin/departments*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: "dept-1", name: "Computer Science & Engineering", code: "CSE" },
        ]),
      });
    });

    await page.route("http://localhost:8000/api/v1/admin/designations*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: "desig-1", name: "Associate Professor", code: "ASSOC_PROF" },
        ]),
      });
    });

    // 1. Visit Teacher Detail View
    await page.goto("/admin/users/teachers/t-101");
    await expect(page.locator("h1:has-text('Sarah Connor')")).toBeVisible();
    await expect(page.getByText("EMP-2026-101").first()).toBeVisible();
    await expect(page.getByText("Associate Professor").first()).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "deep_teacher_detail.png"), fullPage: true });

    // 2. Visit Teacher Edit View
    await page.goto("/admin/users/teachers/t-101/edit");
    await expect(page.locator("h1:has-text('Edit Teacher Profile')")).toBeVisible();
    await expect(page.locator("input[value='Sarah']")).toBeVisible();
    await expect(page.locator("input[value='Connor']")).toBeVisible();
    await expect(page.locator("input[value='EMP-2026-101']")).toBeVisible();

    // Verify error toast does NOT appear
    await expect(page.getByText("Failed to load teacher data")).not.toBeVisible();
    await expect(page.getByText("Teacher not found")).not.toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "deep_teacher_edit.png"), fullPage: true });

    // Submit form
    const saveBtn = page.getByRole("button", { name: /save changes/i });
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();
  });

  test("Student profile and edit views load data directly without list errors", async ({ page, context }) => {
    await setupAdminAuth(page, context);

    const mockStudent = {
      id: "stu-202",
      user_id: "u-202",
      enrollment_number: "STU-2026-088",
      email: "marcus.vance@university.edu",
      first_name: "Marcus",
      last_name: "Vance",
      phone: "+1-555-0888",
      gender: "Male",
      date_of_birth: "2004-03-25T00:00:00.000Z",
      department_id: "dept-1",
      department_name: "Computer Science & Engineering",
      semester: 4,
      batch: "2024-2028",
    };

    await page.route("http://localhost:8000/api/v1/admin/users/students/stu-202", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockStudent),
        });
      } else if (route.request().method() === "PUT") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockStudent),
        });
      }
    });

    await page.route("http://localhost:8000/api/v1/admin/departments*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: "dept-1", name: "Computer Science & Engineering", code: "CSE" },
        ]),
      });
    });

    // 1. Visit Student Detail View
    await page.goto("/admin/users/students/stu-202");
    await expect(page.locator("h1:has-text('Marcus Vance')")).toBeVisible();
    await expect(page.getByText("STU-2026-088").first()).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "deep_student_detail.png"), fullPage: true });

    // 2. Visit Student Edit View
    await page.goto("/admin/users/students/stu-202/edit");
    await expect(page.locator("h1:has-text('Edit Student Profile')")).toBeVisible();
    await expect(page.locator("input[value='Marcus']")).toBeVisible();
    await expect(page.locator("input[value='Vance']")).toBeVisible();
    await expect(page.locator("input[value='STU-2026-088']")).toBeVisible();

    // Verify error toast does NOT appear
    await expect(page.getByText("Failed to load student data")).not.toBeVisible();
    await expect(page.getByText("Student not found")).not.toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "deep_student_edit.png"), fullPage: true });

    // Submit form
    const saveBtn = page.getByRole("button", { name: /save changes/i });
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();
  });

  test("Class detail and edit views render subject codes and parameters", async ({ page, context }) => {
    await setupAdminAuth(page, context);

    const mockClass = {
      id: "cls-eng-301",
      name: "CS-301: Cloud Infrastructure",
      subject_name: "Cloud Computing",
      subject_code: "CS301",
      teacherId: "teacher-1",
      classroom_name: "Lab 4",
      semester: 5,
      batch: "2023-2027",
      max_students: 60,
      enrolled_count: 48,
    };

    await page.route("http://localhost:8000/api/v1/admin/classes/cls-eng-301", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockClass),
      });
    });

    await page.route("http://localhost:8000/api/v1/admin/subjects*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: "sub-1", name: "Cloud Computing", code: "CS301" },
        ]),
      });
    });

    await page.route("http://localhost:8000/api/v1/admin/classrooms*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: "room-1", name: "Lab 4" },
        ]),
      });
    });

    // 1. Visit Class Detail View
    await page.goto("/admin/classes/cls-eng-301");
    await expect(page.locator("h1:has-text('CS-301: Cloud Infrastructure')")).toBeVisible();
    await expect(page.getByText("CS301").first()).toBeVisible();
    await expect(page.getByText("Lab 4")).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "deep_class_detail.png"), fullPage: true });

    // 2. Visit Class Edit View
    await page.goto("/admin/classes/cls-eng-301/edit");
    await expect(page.locator("h1:has-text('Edit Class')")).toBeVisible();
    await expect(page.locator("input[value='CS-301: Cloud Infrastructure']")).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "deep_class_edit.png"), fullPage: true });
  });

  test("Teacher session roster and printable preview render attendance statuses", async ({ page, context }) => {
    await setupTeacherAuth(page, context);

    const mockAttendance = {
      session_id: "sess-live-99",
      class_name: "CS-401: Distributed Systems",
      roster: [
        {
          student_id: "stu-1",
          enrollment_number: "STU-2026-001",
          full_name: "Alice Johnson",
          email: "alice@univ.edu",
          status: "Present",
          final_score: 0.98,
          marked_at: new Date().toISOString(),
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
        {
          student_id: "stu-3",
          enrollment_number: "STU-2026-003",
          full_name: "Charlie Brown",
          email: "charlie@univ.edu",
          status: "Flagged",
          final_score: 0.45,
          marked_at: new Date().toISOString(),
        },
      ],
    };

    await page.route("http://localhost:8000/api/v1/teacher/sessions/sess-live-99/attendance*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockAttendance),
      });
    });

    // 1. Visit Session Live Roster
    await page.goto("/teacher/sessions/sess-live-99/roster");
    await expect(page.locator("h1:has-text('CS-401: Distributed Systems')")).toBeVisible();
    await expect(page.getByText("Alice Johnson")).toBeVisible();
    await expect(page.getByText("Bob Smith")).toBeVisible();
    await expect(page.getByText("Charlie Brown")).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "deep_session_roster.png"), fullPage: true });

    // 2. Visit Session Printable Preview
    await page.goto("/teacher/sessions/sess-live-99/preview");
    await expect(page.locator("h1:has-text('CS-401: Distributed Systems')")).toBeVisible();
    await expect(page.getByText("Alice Johnson")).toBeVisible();
    await expect(page.getByText("PRESENT").first()).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "deep_session_preview.png"), fullPage: true });
  });
});
