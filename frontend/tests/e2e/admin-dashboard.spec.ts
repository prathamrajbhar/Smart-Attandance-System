import { test, expect } from "@playwright/test";
import { setupAdminAuth } from "./test-helpers";

test.describe("Module 2: Admin Dashboard & Operations", () => {
  test.beforeEach(async ({ page, context }) => {
    await setupAdminAuth(page, context);
  });

  test("Renders KPI strip, charts, quick actions, and health monitors", async ({ page }) => {
    await page.goto("/admin/dashboard");

    // 1. Header & Overview verification
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText("Total Students")).toBeVisible();
    await expect(page.getByText("Total Faculty")).toBeVisible();
    await expect(page.getByText("Configured Classes")).toBeVisible();

    // 2. Quick Actions Bar
    const verificationAction = page.locator('a[href="/admin/setup/verification-settings"]');
    const auditAction = page.locator('a[href="/admin/audit"]').first();
    const classesAction = page.locator('a[href="/admin/classes"]').first();
    const scannerAction = page.locator('a[href="/admin/scanner"]').first();
    await expect(verificationAction).toBeVisible();
    await expect(auditAction).toBeVisible();
    await expect(classesAction).toBeVisible();
    await expect(scannerAction).toBeVisible();

    // 3. System Nodes and Status Health Card
    await expect(page.getByText("System Nodes")).toBeVisible();
    await expect(page.getByText("All Operational")).toBeVisible();

    // 4. Audit Log Strip on Dashboard
    await expect(page.getByText("Live Audit Stream")).toBeVisible();
    await expect(page.getByText("STUDENT LOGIN")).toBeVisible();
  });

  test("Command Palette opens with keyboard shortcut and filters navigation items", async ({ page }) => {
    await page.goto("/admin/dashboard");

    // Press Cmd+K / Ctrl+K
    await page.keyboard.press("Control+k");
    const paletteInput = page.locator('input[placeholder*="Type a command or search"]');
    await expect(paletteInput).toBeVisible({ timeout: 5000 });

    // Search for "Students"
    await paletteInput.fill("Students");
    const studentResult = page.locator('button:has-text("Student & Access Management")').first();
    await expect(studentResult).toBeVisible();

    // Close on Escape
    await page.keyboard.press("Escape");
    await expect(paletteInput).not.toBeVisible();
  });

  test("Admin audit log page filters by severity and handles empty results", async ({ page }) => {
    await page.route("http://localhost:8000/api/v1/admin/audit*", async (route) => {
      const url = new URL(route.request().url());
      const severity = url.searchParams.get("severity");

      if (severity === "CRITICAL") {
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
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            items: [
              {
                id: "log-1",
                eventType: "SYSTEM_ALERT",
                severity: "HIGH",
                actor: "system@univ.edu",
                target: "CAMERA_NODE_01",
                description: "Camera feed latency exceeded 200ms threshold",
                ip: "10.0.0.1",
                timestamp: new Date().toISOString(),
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
      }
    });

    await page.goto("/admin/audit");
    await expect(page.locator("h1:has-text('Audit')")).toBeVisible();

    // Verify warning log present
    await expect(page.getByText("SYSTEM_ALERT")).toBeVisible();

    // Switch severity filter to CRITICAL
    const severitySelect = page.locator('select').first();
    if (await severitySelect.isVisible()) {
      await severitySelect.selectOption("CRITICAL");
      // Verify empty state is rendered
      await expect(page.getByText("No audit events recorded", { exact: false })).toBeVisible({ timeout: 5000 });
    }
  });
});
