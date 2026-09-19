import { test, expect } from "@playwright/test";

test.describe("Enterprise Bulk Import with 10-Batch Ingestion", () => {
  test("Processes records in batches of 10 with email invites and progress UI", async ({ page }) => {
    // Mock login and auth endpoints on backend (port 8000)
    await page.route("http://localhost:8000/api/v1/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          access_token: "mock-admin-token-123",
          token_type: "bearer",
          must_change_password: false,
        }),
      });
    });

    await page.route("http://localhost:8000/api/v1/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "admin-123",
          email: "admin@university.edu",
          role: "ADMIN",
          first_name: "System",
          last_name: "Admin",
          must_change_password: false,
        }),
      });
    });

    // Intercept admin dashboard stats
    await page.route("http://localhost:8000/api/v1/admin/stats", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ studentCount: 100, teacherCount: 10, classCount: 5 }),
      });
    });

    await page.route("http://localhost:8000/api/v1/health", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ status: "healthy" }),
      });
    });

    await page.route("http://localhost:8000/api/v1/admin/audit*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });

    await page.route("http://localhost:8000/api/v1/admin/config", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ isAiFaceValidationEnabled: true }),
      });
    });

    // Intercept students query
    await page.route("http://localhost:8000/api/v1/admin/users/students*", async (route) => {
      if (route.request().url().includes("/bulk")) {
        await route.fallback();
        return;
      }
      if (route.request().method() === "GET") {
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
      } else {
        await route.continue();
      }
    });

    // Intercept departments query
    await page.route("http://localhost:8000/api/v1/admin/departments*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });

    await page.route("http://localhost:8000/api/v1/admin/setup/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });

    // Intercept bulk ingestion endpoint and track payloads
    const interceptedBatches: Array<{ count: number; send_invite: boolean }> = [];
    await page.route("http://localhost:8000/api/v1/admin/users/students/bulk", async (route) => {
      const postData = route.request().postDataJSON();
      const count = postData?.students?.length || 0;
      const sendInvite = postData?.send_invite;
      interceptedBatches.push({ count, send_invite: sendInvite });

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          imported_count: count,
          failed_count: 0,
          invitations_sent: sendInvite ? count : 0,
          errors: [],
        }),
      });
    });

    // 1. Authenticate via login page
    await page.goto("/login");
    await page.fill('input[type="email"]', "admin@university.edu");
    await page.fill('input[type="password"]', "Password123!");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Verify redirected to dashboard
    await expect(page.locator("h1:has-text('Admin')")).toBeVisible({ timeout: 10000 });

    // 2. Navigate to students directory
    const menuBtn = page.locator('button[aria-label="Toggle navigation menu"]');
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await page.waitForTimeout(400);
    }
    const studentsNav = page.locator('a[href="/admin/users/students"]').first();
    await studentsNav.click();
    await expect(page.locator("h1:has-text('Student & Access Management')")).toBeVisible({ timeout: 10000 });

    // 3. Open Bulk Import modal
    const bulkButton = page.getByRole("button", { name: /bulk import/i });
    await expect(bulkButton).toBeVisible();
    await bulkButton.click();

    // Verify Dropzone stage
    await expect(page.locator("h3:has-text('Bulk Ingest Students')")).toBeVisible();
    await expect(page.getByText("Download Sample Template")).toBeVisible();

    // Generate CSV content with 23 rows (3 batches: 10, 10, 3)
    let csvContent = "email,enrollment_number,first_name,last_name\n";
    for (let i = 1; i <= 23; i++) {
      csvContent += `student${i}@university.edu,STU-2026-${String(i).padStart(3, "0")},StudentFirst${i},StudentLast${i}\n`;
    }

    // Upload file via hidden file input
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "roster-23-students.csv",
      mimeType: "text/csv",
      buffer: Buffer.from(csvContent),
    });

    // Verify Stage 2: Preview & Options
    await expect(page.getByText("23", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("3 batches (10 per batch)")).toBeVisible();
    await expect(page.getByText("Email Invites")).toBeVisible();

    // Screenshot preview stage
    await page.screenshot({ path: "screenshots/bulk-import-stage-preview.png" });

    // 4. Click Commit Import
    const commitButton = page.getByRole("button", { name: /commit import/i });
    await expect(commitButton).toBeVisible();
    await commitButton.click();

    // 5. Verify Stage 4: Results & Resolution
    await expect(page.getByText("Bulk Import Completed Successfully")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("23 of 23 records were created in 10-item batches.")).toBeVisible();

    // Verify batches that were sent
    expect(interceptedBatches.length).toBe(3);
    expect(interceptedBatches[0].count).toBe(10);
    expect(interceptedBatches[0].send_invite).toBe(true);
    expect(interceptedBatches[1].count).toBe(10);
    expect(interceptedBatches[1].send_invite).toBe(true);
    expect(interceptedBatches[2].count).toBe(3);
    expect(interceptedBatches[2].send_invite).toBe(true);

    // Screenshot completed stage
    await page.screenshot({ path: "screenshots/bulk-import-stage-completed.png" });

    // Click Done to finish
    await page.getByRole("button", { name: /done/i }).click();
    await expect(page.locator("h3:has-text('Bulk Ingest Students')")).not.toBeVisible();
  });
});
