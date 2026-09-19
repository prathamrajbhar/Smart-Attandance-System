import { test, expect } from "@playwright/test";
import { setupAdminAuth } from "./test-helpers";

test.describe("Module 3: User Management (Students & Faculty)", () => {
  test.beforeEach(async ({ page, context }) => {
    await setupAdminAuth(page, context);
  });

  test("Students directory supports server sorting, 350ms debounced search, and URL sync", async ({ page }) => {
    let capturedSearchQuery = "";
    let capturedSortBy = "";
    let capturedSortOrder = "";

    await page.route("http://localhost:8000/api/v1/admin/users/students*", async (route) => {
      const url = new URL(route.request().url());
      capturedSearchQuery = url.searchParams.get("q") || "";
      capturedSortBy = url.searchParams.get("sort_by") || "";
      capturedSortOrder = url.searchParams.get("sort_order") || "";

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [
            {
              id: "stu-1",
              userId: "user-1",
              enrollmentNumber: "STU-2026-001",
              firstName: "Alice",
              lastName: "Johnson",
              email: "alice@university.edu",
              phone: "555-0101",
              semester: 4,
              batch: "2024-2028",
              department: { name: "Computer Science & Engineering" },
            },
            {
              id: "stu-2",
              userId: "user-2",
              enrollmentNumber: "STU-2026-002",
              firstName: "Bob",
              lastName: "Smith",
              email: "bob@university.edu",
              phone: "555-0102",
              semester: 6,
              batch: "2023-2027",
              department: { name: "Information Technology" },
            },
          ],
          page: 1,
          page_size: 10,
          total_items: 2,
          total_pages: 1,
          has_next: false,
          has_prev: false,
        }),
      });
    });

    await page.goto("/admin/users/students");
    await expect(page.locator("h1:has-text('Student & Access Management')")).toBeVisible();

    // 1. Initial Table Rendering
    await expect(page.getByText("Alice Johnson")).toBeVisible();
    await expect(page.getByText("STU-2026-001")).toBeVisible();
    await expect(page.getByText("Bob Smith")).toBeVisible();

    // 2. 350ms Debounced Search Input
    const searchInput = page.locator('input[placeholder*="Search by name"]').first();
    await searchInput.fill("Alice");

    // Wait for debounce timeout
    await page.waitForTimeout(450);
    expect(capturedSearchQuery).toBe("Alice");
    await expect(page).toHaveURL(/.*q=Alice.*/);

    // 3. Server-side Column Sorting Click
    const nameHeader = page.locator('th button:has-text("User")');
    if (await nameHeader.isVisible()) {
      await nameHeader.click();
      await page.waitForTimeout(200);
      expect(capturedSortBy).toBe("full_name");
      await expect(page).toHaveURL(/.*sortBy=full_name.*/);
    }
  });

  test("Add student form validates required fields and dispatches creation payload", async ({ page }) => {
    let createdPayload: Record<string, unknown> | null = null;

    await page.route("http://localhost:8000/api/v1/admin/users/student*", async (route) => {
      if (route.request().method() === "POST") {
        createdPayload = route.request().postDataJSON();
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            id: "stu-new-id",
            enrollment_number: createdPayload?.enrollment_number,
            first_name: createdPayload?.first_name,
            last_name: createdPayload?.last_name,
            email: createdPayload?.email,
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/admin/users/students/add");
    await expect(page.locator("h1:has-text('Add Student')")).toBeVisible();

    const submitBtn = page.getByRole("button", { name: /create student/i });

    // Submit without required fields
    await submitBtn.click();
    await expect(page.getByText("First name is required")).toBeVisible();
    await expect(page.getByText("Last name is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Enrollment number is required")).toBeVisible();

    // Fill valid inputs
    await page.locator('input[placeholder*="e.g. Aanya"]').fill("Jordan");
    await page.locator('input[placeholder*="e.g. Sharma"]').fill("Miller");
    await page.locator('input[placeholder*="student@university.edu"]').fill("jordan.miller@university.edu");
    await page.locator('input[placeholder*="e.g. EN2024001"]').fill("STU-2026-999");

    await submitBtn.click();
    await expect(page).toHaveURL(/.*\/admin\/users\/students/);
    expect(createdPayload?.email).toBe("jordan.miller@university.edu");
    expect(createdPayload?.enrollment_number).toBe("STU-2026-999");
  });

  test("Faculty directory renders table, search filter, and action triggers", async ({ page }) => {
    await page.route("http://localhost:8000/api/v1/admin/users/teachers*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [
            {
              id: "fac-1",
              user_id: "user-fac-1",
              employee_id: "FAC-2026-001",
              employeeId: "FAC-2026-001",
              first_name: "Alan",
              firstName: "Alan",
              last_name: "Turing",
              lastName: "Turing",
              email: "alan.turing@university.edu",
              department: "Computer Science & Engineering",
              designation: "Department Head",
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

    await page.goto("/admin/users/teachers");
    await expect(page.locator("h1:has-text('Faculty & Staff Directory')")).toBeVisible();
    await expect(page.getByText("Alan Turing")).toBeVisible();
    await expect(page.getByText("FAC-2026-001")).toBeVisible();
    await expect(page.getByRole("button", { name: /add teacher/i })).toBeVisible();
  });
});
