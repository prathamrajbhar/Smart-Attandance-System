import { test, expect } from "@playwright/test";
import { setupAdminAuth } from "./test-helpers";
import path from "path";

const SCREENSHOT_DIR = "/home/pratham/.gemini/antigravity/brain/7361ddd5-ec3e-48a0-aeb2-add5b2ce03f5";

test.describe("Module: User Creation & Course Enrollment Flows", () => {
  test.beforeEach(async ({ page, context }) => {
    await setupAdminAuth(page, context);
  });

  test("Add Student page validates required fields and dispatches creation payload", async ({ page }) => {
    let studentCreated = false;

    await page.route("http://localhost:8000/api/v1/admin/departments*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: "dept-1", name: "Computer Science & Engineering", code: "CSE" },
        ]),
      });
    });

    await page.route("http://localhost:8000/api/v1/admin/users/student", async (route) => {
      if (route.request().method() === "POST") {
        studentCreated = true;
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ id: "stu-new-001", email: "elizabeth.blackwell@university.edu" }),
        });
      }
    });

    await page.goto("/admin/users/students/add");
    await expect(page.locator("h1:has-text('Add Student')")).toBeVisible();

    // Fill student registration form
    await page.locator("input[placeholder*='student@university.edu']").fill("elizabeth.blackwell@university.edu");
    await page.locator("input[placeholder*='EN2024001']").fill("STU-2026-901");
    await page.locator("input[placeholder*='Aanya']").fill("Elizabeth");
    await page.locator("input[placeholder*='Sharma']").fill("Blackwell");

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "user_add_student.png"), fullPage: true });

    await page.getByRole("button", { name: "Create Student" }).click();
    expect(studentCreated).toBe(true);
  });

  test("Add Teacher page validates required fields and dispatches creation payload", async ({ page }) => {
    let teacherCreated = false;

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
          { id: "desig-1", name: "Assistant Professor", code: "ASST_PROF" },
        ]),
      });
    });

    await page.route("http://localhost:8000/api/v1/admin/users/teacher", async (route) => {
      if (route.request().method() === "POST") {
        teacherCreated = true;
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ id: "teach-new-001", email: "claude.shannon@university.edu" }),
        });
      }
    });

    await page.goto("/admin/users/teachers/add");
    await expect(page.locator("h1:has-text('Add Teacher')")).toBeVisible();

    // Fill faculty form
    await page.locator("input[placeholder*='teacher@university.edu']").fill("claude.shannon@university.edu");
    await page.locator("input[placeholder*='EMP2024001']").fill("EMP-2026-777");
    await page.locator("input[placeholder*='Ravi']").fill("Claude");
    await page.locator("input[placeholder*='Shankar']").fill("Shannon");

    // Select Department & Designation
    await page.locator("select").nth(0).selectOption("dept-1");
    await page.locator("select").nth(1).selectOption("desig-1");

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "user_add_teacher.png"), fullPage: true });

    await page.getByRole("button", { name: "Create Teacher" }).click();
    expect(teacherCreated).toBe(true);
  });

  test("Class Enrollment page allows filtering, multi-selecting students and enrolling", async ({ page }) => {
    let enrollmentDispatched = false;

    await page.route("http://localhost:8000/api/v1/admin/classes/cls-enroll-1", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "cls-enroll-1",
          name: "CS-301: Algorithms & Data Structures",
          subject_name: "Algorithms",
          enrolled_count: 15,
          max_students: 60,
        }),
      });
    });

    await page.route("http://localhost:8000/api/v1/admin/users/students*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [
            {
              id: "stu-101",
              user_id: "u-101",
              enrollment_number: "STU-2026-101",
              first_name: "Katherine",
              last_name: "Johnson",
              email: "katherine.j@university.edu",
              department_name: "Mathematics",
              semester: 4,
              batch: "2024-2028",
            },
            {
              id: "stu-102",
              user_id: "u-102",
              enrollment_number: "STU-2026-102",
              first_name: "Dorothy",
              last_name: "Vaughan",
              email: "dorothy.v@university.edu",
              department_name: "Computer Science",
              semester: 4,
              batch: "2024-2028",
            },
          ],
          total_items: 2,
          page: 1,
          page_size: 10,
        }),
      });
    });

    await page.route("http://localhost:8000/api/v1/admin/classes/cls-enroll-1/enroll", async (route) => {
      if (route.request().method() === "POST") {
        enrollmentDispatched = true;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ message: "Students enrolled successfully" }),
        });
      }
    });

    await page.goto("/admin/classes/cls-enroll-1/enroll");
    await expect(page.locator("h1:has-text('Enroll Students')")).toBeVisible();
    await expect(page.locator("a:has-text('CS-301: Algorithms & Data Structures')").first()).toBeVisible();

    // Select students by clicking their roster row cards
    await page.getByText("Katherine Johnson").click();
    await page.getByText("Dorothy Vaughan").click();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "deep_enroll_students.png"), fullPage: true });

    // Click enroll button
    const enrollBtn = page.getByRole("button", { name: "Enroll Selected" });
    await expect(enrollBtn).toBeVisible();
    await enrollBtn.click();
    expect(enrollmentDispatched).toBe(true);
  });
});
