import { test, expect } from "@playwright/test";
import { setupAdminAuth } from "./test-helpers";

test.describe("Module 4: Academic Classes & Enrollment", () => {
  test.beforeEach(async ({ page, context }) => {
    await setupAdminAuth(page, context);
  });

  test("Classes directory renders classes table and create class navigation", async ({ page }) => {
    await page.route("http://localhost:8000/api/v1/admin/classes*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [
            {
              id: "cls-1",
              name: "CS-401: Distributed Systems",
              subject: { name: "Distributed Computing", code: "CS401" },
              teacher: { firstName: "Alan", lastName: "Turing" },
              classroom: { roomNumber: "Lab 302" },
              studentCount: 38,
            },
          ],
          page: 1,
          page_size: 10,
          total_items: 1,
          total_pages: 1,
          has_next: false,
          has_prev: false,
        }),
      });
    });

    await page.goto("/admin/classes");
    await expect(page.locator("h1:has-text('Class & Course Directory')")).toBeVisible();
    await expect(page.getByText("CS-401: Distributed Systems")).toBeVisible();
    await expect(page.getByText("Alan Turing")).toBeVisible();
    await expect(page.getByText("Lab 302")).toBeVisible();

    // Create Class button
    const createBtn = page.getByRole("button", { name: /create class/i });
    await expect(createBtn).toBeVisible();
    await createBtn.click();
    await expect(page).toHaveURL(/.*\/admin\/classes\/create/);
  });

  test("Student enrollment page supports multi-select checkboxes and batch actions", async ({ page }) => {
    let batchActionFired = false;

    // Mock class detail
    await page.route("http://localhost:8000/api/v1/admin/classes/cls-1", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "cls-1",
          name: "CS-401: Distributed Systems",
          subject_name: "Distributed Computing",
          subject_code: "CS401",
          teacher_name: "Alan Turing",
          enrolled_student_ids: [],
        }),
      });
    });

    // Mock enrolled and available students
    await page.route("http://localhost:8000/api/v1/admin/users/students*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "stu-101",
            enrollment_number: "STU-101",
            first_name: "Catherine",
            last_name: "Davis",
            email: "catherine@univ.edu",
          },
          {
            id: "stu-102",
            enrollment_number: "STU-102",
            first_name: "Daniel",
            last_name: "Evans",
            email: "daniel@univ.edu",
          },
        ]),
      });
    });

    // Mock batch enrollment endpoint
    await page.route("http://localhost:8000/api/v1/admin/classes/cls-1/enroll*", async (route) => {
      batchActionFired = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ enrolled_count: 1, message: "Enrolled 1 students successfully" }),
      });
    });

    await page.goto("/admin/classes/cls-1/enroll");
    await expect(page.locator("h1:has-text('Enroll Students')")).toBeVisible();

    // Verify students list renders
    await expect(page.getByText("Catherine Davis")).toBeVisible();
    await expect(page.getByText("Daniel Evans")).toBeVisible();

    // Click student row to toggle selection
    await page.getByText("Catherine Davis").click();
    await page.waitForTimeout(200);

    // Verify batch action button appears enabled and click it
    const batchEnrollBtn = page.getByRole("button", { name: /enroll selected/i });
    await expect(batchEnrollBtn).toBeVisible();
    await batchEnrollBtn.click();
    await page.waitForTimeout(300);
    expect(batchActionFired).toBe(true);
  });
});
