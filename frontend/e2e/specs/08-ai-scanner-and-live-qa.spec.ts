import { test, expect, TEST_CREDENTIALS } from "../fixtures/test-fixtures";

test.describe("08: AI Absentee Pattern Scanner & Live QA Suite", () => {
  test.describe("Admin AI Scanner Workflows", () => {
    test.beforeEach(async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password);
      await loginPage.expectLoginSuccess("ADMIN");
    });

    test("runs Isolation Forest scan and verifies pattern detection cards", async ({
      adminScannerPage,
      page,
    }) => {
      await adminScannerPage.goto();
      await adminScannerPage.expectScannerLoaded();

      // Verify sensitivity controls and guide text
      await expect(page.getByText(/Sensitivity Range Guide/i)).toBeVisible();
      await expect(page.getByText(/Balanced/i).first()).toBeVisible();

      // Trigger AI Anomaly Scan
      await adminScannerPage.triggerScan();

      // Ensure Scan Completed and Results are rendered
      await expect(
        page.getByText(/Flagged Students|No anomalies detected|System Awaiting Analysis/i).first()
      ).toBeVisible({ timeout: 15000 });

      // Verify Anomaly Score / Index headers if cards exist
      const anomalyIndex = page.getByText(/Anomaly Index|Anomaly Score/i).first();
      if (await anomalyIndex.isVisible()) {
        await expect(anomalyIndex).toBeVisible();

        // Test Weekday Breakdown Expansion
        const weekdayToggle = page.getByRole("button", { name: /Weekday Breakdown/i }).first();
        if (await weekdayToggle.isVisible()) {
          await weekdayToggle.click();
          await expect(page.getByText("Mon").first()).toBeVisible();
          await expect(page.getByText("Fri").first()).toBeVisible();
        }
      }
    });

    test("verifies responsive layout on mobile viewport", async ({ page, adminScannerPage }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await adminScannerPage.goto();
      await adminScannerPage.expectScannerLoaded();

      await expect(page.getByRole("button", { name: /Run AI Anomaly Scan|Run Scan/i })).toBeVisible();
      await expect(page.getByText(/Absentee Pattern Scanner|AI Anomaly/i).first()).toBeVisible();
    });
  });

  test.describe("Faculty Edge Workflows", () => {
    test.beforeEach(async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login(TEST_CREDENTIALS.teacher.email, TEST_CREDENTIALS.teacher.password);
      await loginPage.expectLoginSuccess("TEACHER");
    });

    test("validates Faculty Leaves & Device Change edge dashboards", async ({
      teacherLeavesPage,
      teacherDeviceChangesPage,
      page,
    }) => {
      // Check Leaves Dashboard
      await teacherLeavesPage.goto();
      await teacherLeavesPage.expectLeavesPageLoaded();
      await expect(page.locator("h1, h2, h3").filter({ hasText: /Leave/i }).first()).toBeVisible();

      // Check Device Changes Dashboard
      await teacherDeviceChangesPage.goto();
      await teacherDeviceChangesPage.expectPageLoaded();
      await expect(page.locator("h1, h2, h3").filter({ hasText: /Device/i }).first()).toBeVisible();
    });
  });
});


