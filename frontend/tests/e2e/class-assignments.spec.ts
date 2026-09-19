import { test, expect } from "@playwright/test";
import { setupAdminAuth } from "./test-helpers";
import path from "path";

const SCREENSHOT_DIR = "/home/pratham/.gemini/antigravity/brain/7361ddd5-ec3e-48a0-aeb2-add5b2ce03f5";

test.describe("Class Assignments & Course Creation Verification", () => {
  test.beforeEach(async ({ page, context }) => {
    await setupAdminAuth(page, context);
  });

  test("Assign teacher view handles paginated teachers list and assigns teacher", async ({ page }) => {
    let teacherAssigned = false;

    // Mock paginated teachers list response
    await page.route("http://localhost:8000/api/v1/admin/users/teachers*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [
            {
              id: "t-prof-1",
              email: "ada.lovelace@university.edu",
              first_name: "Ada",
              last_name: "Lovelace",
              department: "Computer Science & Engineering",
            },
            {
              id: "t-prof-2",
              email: "alan.turing@university.edu",
              first_name: "Alan",
              last_name: "Turing",
              department: "Mathematics & Computing",
            },
          ],
          total_items: 2,
          page: 1,
          page_size: 10,
        }),
      });
    });

    await page.route("http://localhost:8000/api/v1/admin/classes/cls-assign-1/assign-teacher", async (route) => {
      if (route.request().method() === "PUT") {
        teacherAssigned = true;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ message: "Teacher assigned successfully" }),
        });
      }
    });

    await page.route("http://localhost:8000/api/v1/admin/classes/cls-assign-1", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "cls-assign-1",
          name: "CS-402: Quantum Computing",
          subject_name: "Quantum Algorithms",
          subject_code: "CS402",
        }),
      });
    });

    await page.goto("/admin/classes/cls-assign-1/assign-teacher");

    // Verify error boundary did NOT catch "f.map is not a function"
    await expect(page.getByText("Something went wrong")).not.toBeVisible();
    await expect(page.getByText("is not a function")).not.toBeVisible();

    await expect(page.locator("h1:has-text('Assign Teacher')")).toBeVisible();
    await expect(page.getByText("Select a teacher to manage this class")).toBeVisible();

    // Select teacher from dropdown
    const select = page.locator("select").first();
    await select.selectOption("t-prof-1");

    // Capture visual proof of functioning assign-teacher page
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "deep_assign_teacher.png"), fullPage: true });

    // Click assign button
    const assignBtn = page.getByRole("button", { name: "Assign Teacher" });
    await expect(assignBtn).toBeVisible();
    await assignBtn.click();
    expect(teacherAssigned).toBe(true);
  });

  test("Create class form handles paginated teachers and submits payload", async ({ page }) => {
    let createFired = false;

    await page.route("http://localhost:8000/api/v1/admin/users/teachers*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [
            {
              id: "t-prof-1",
              email: "ada.lovelace@university.edu",
              first_name: "Ada",
              last_name: "Lovelace",
              department: "Computer Science",
            },
          ],
          total_items: 1,
          page: 1,
          page_size: 10,
        }),
      });
    });

    await page.route("http://localhost:8000/api/v1/admin/subjects*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: "sub-1", name: "Distributed Systems", code: "CS401" },
        ]),
      });
    });

    await page.route("http://localhost:8000/api/v1/admin/classrooms*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: "room-1", name: "Lecture Hall B", building: "Science Block" },
        ]),
      });
    });

    await page.route("http://localhost:8000/api/v1/admin/classes", async (route) => {
      if (route.request().method() === "POST") {
        createFired = true;
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ id: "cls-created-1", name: "CS-401: Distributed Computing" }),
        });
      }
    });

    await page.goto("/admin/classes/create");

    // Verify error boundary did NOT catch "is not a function"
    await expect(page.getByText("Something went wrong")).not.toBeVisible();
    await expect(page.locator("h1:has-text('Create Class')")).toBeVisible();

    // Fill form
    await page.locator("input[placeholder*='e.g.']").first().fill("CS-401: Distributed Computing");
    await page.locator("select").nth(0).selectOption("t-prof-1");
    await page.locator("select").nth(1).selectOption("sub-1");

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "deep_create_class.png"), fullPage: true });

    const submitBtn = page.getByRole("button", { name: "Create Class" });
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();
    expect(createFired).toBe(true);
  });
});
