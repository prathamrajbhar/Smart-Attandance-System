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

  test("Classes directory opens BulkImportModal and handles bulk class ingestion without navigating away", async ({
    page,
  }) => {
    // Intercept classes list query
    await page.route("http://localhost:8000/api/v1/admin/classes*", async (route) => {
      if (route.request().url().includes("/bulk")) {
        await route.fallback();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [],
          page: 1,
          page_size: 10,
          total_items: 0,
          total_pages: 1,
          has_next: false,
          has_prev: false,
        }),
      });
    });

    // Intercept bulk classes post
    let interceptedBatchCount = 0;
    await page.route("http://localhost:8000/api/v1/admin/classes/bulk", async (route) => {
      const body = route.request().postDataJSON();
      interceptedBatchCount = body?.classes?.length || 0;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          imported_count: interceptedBatchCount,
          failed_count: 0,
          invitations_sent: 0,
          errors: [],
        }),
      });
    });

    await page.goto("/admin/classes");
    await expect(page.locator("h1:has-text('Class & Course Directory')")).toBeVisible();

    // Click Bulk Import button
    const bulkBtn = page.getByRole("button", { name: /bulk import/i });
    await expect(bulkBtn).toBeVisible();
    await bulkBtn.click();

    // URL should NOT change to /admin/classes/create
    await expect(page).toHaveURL(/\/admin\/classes(\?.*)?$/);
    expect(page.url()).not.toContain("/create");

    // Modal should be visible with Bulk Ingest Classes title
    await expect(page.locator("h3:has-text('Bulk Ingest Classes')")).toBeVisible();
    await expect(page.getByText("Download Sample Template")).toBeVisible();
    await page.screenshot({ path: "screenshots/bulk-classes-stage-modal.png" });

    // Upload CSV
    const csvContent =
      "name,subject_code,teacher_email,classroom_name,semester,batch,max_students\n" +
      "CS-101: Intro to CS,CS101,teacher@univ.edu,Room 101,1,2026,60\n" +
      "CS-102: Data Structures,CS102,teacher@univ.edu,Room 102,2,2026,60\n";

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "classes.csv",
      mimeType: "text/csv",
      buffer: Buffer.from(csvContent),
    });

    // Preview table
    await expect(page.getByText("CS-101: Intro to CS")).toBeVisible();
    await expect(page.getByText("CS-102: Data Structures")).toBeVisible();
    await page.screenshot({ path: "screenshots/bulk-classes-stage-preview.png" });

    // Commit import
    const commitBtn = page.getByRole("button", { name: /commit import/i });
    await expect(commitBtn).toBeVisible();
    await commitBtn.click();

    // Completion
    await expect(page.getByText("Bulk Import Completed Successfully")).toBeVisible({ timeout: 10000 });
    expect(interceptedBatchCount).toBe(2);
    await page.screenshot({ path: "screenshots/bulk-classes-stage-completed.png" });

    // Done button closes modal
    await page.getByRole("button", { name: /done/i }).click();
    await expect(page.locator("h3:has-text('Bulk Ingest Classes')")).not.toBeVisible();
  });
});
