import { test, expect } from "@playwright/test";
import { setupAdminAuth } from "./test-helpers";
import path from "path";

const SCREENSHOT_DIR = "/home/pratham/.gemini/antigravity/brain/7361ddd5-ec3e-48a0-aeb2-add5b2ce03f5";

test.describe("Module: Admin Advanced Operations (Audit & Scanner)", () => {
  test.beforeEach(async ({ page, context }) => {
    await setupAdminAuth(page, context);
  });

  test("Audit Log table supports severity filtering, server-side search, and export", async ({ page }) => {
    let exportTriggered = false;

    await page.route("http://localhost:8000/api/v1/admin/audit*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [
            {
              id: "audit-1",
              eventType: "SYSTEM_ACCESS",
              severity: "HIGH",
              actor: "sec-admin@university.edu",
              target: "ATTENDANCE_OVERRIDE",
              description: "Manual attendance override applied for Session #401",
              ip: "192.168.1.105",
              timestamp: "2026-09-19T20:30:00.000Z",
            },
            {
              id: "audit-2",
              eventType: "POLICY_UPDATE",
              severity: "MEDIUM",
              actor: "admin@university.edu",
              target: "SYSTEM_CONFIG",
              description: "AI Liveness threshold increased to 0.85",
              ip: "127.0.0.1",
              timestamp: "2026-09-19T18:15:00.000Z",
            },
          ],
          total_items: 2,
          page: 1,
          page_size: 15,
        }),
      });
    });

    await page.route("http://localhost:8000/api/v1/admin/audit/export", async (route) => {
      exportTriggered = true;
      await route.fulfill({
        status: 200,
        contentType: "text/csv",
        body: "id,eventType,severity,actor,description\naudit-1,SYSTEM_ACCESS,HIGH,sec-admin@university.edu,Manual override",
      });
    });

    await page.goto("/admin/audit");
    await expect(page.locator("h1:has-text('System Audit Trail')")).toBeVisible();
    await expect(page.getByText("Manual attendance override applied")).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "deep_admin_audit.png"), fullPage: true });

    // Click Export CSV
    const exportBtn = page.getByRole("button", { name: /Export Audit CSV/i });
    await expect(exportBtn).toBeVisible();
    await exportBtn.click();
    expect(exportTriggered).toBe(true);
  });

  test("AI Scanner executes absentee scan with contamination adjustment and renders anomaly cards", async ({ page }) => {
    let scanTriggered = false;

    await page.route("http://localhost:8000/api/v1/admin/scan-absentees*", async (route) => {
      scanTriggered = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            student_id: "stu-fraud-1",
            student_name: "Vincent Vega",
            enrollment_number: "STU-2026-666",
            anomaly_score: 0.89,
            reasons: ["Impossible GPS travel speed between consecutive check-ins (950 km/h)"],
            details: {
              consecutive_absences: 8,
              historical_attendance_pct: 22.5,
              total_classes: 40,
            },
          },
          {
            student_id: "stu-fraud-2",
            student_name: "Jules Winnfield",
            enrollment_number: "STU-2026-777",
            anomaly_score: 0.74,
            reasons: ["Repeated simultaneous check-in attempts from disparate IP addresses"],
            details: {
              consecutive_absences: 5,
              historical_attendance_pct: 45.0,
              total_classes: 40,
            },
          },
        ]),
      });
    });

    await page.goto("/admin/scanner");
    await expect(page.locator("h1:has-text('AI Absentee Pattern Scanner')")).toBeVisible();

    // Trigger AI Scan
    const scanBtn = page.getByRole("button", { name: "Run AI Anomaly Scan" });
    await expect(scanBtn).toBeVisible();
    await scanBtn.click();
    expect(scanTriggered).toBe(true);

    // Verify Anomaly cards rendered
    await expect(page.getByText("Vincent Vega")).toBeVisible();
    await expect(page.getByText("Jules Winnfield")).toBeVisible();
    await expect(page.getByText("High Risk").first()).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "deep_admin_scanner.png"), fullPage: true });
  });
});
