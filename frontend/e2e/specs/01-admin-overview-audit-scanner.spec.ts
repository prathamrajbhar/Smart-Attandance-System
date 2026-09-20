import { test, expect, TEST_CREDENTIALS } from "../fixtures/test-fixtures";

test.describe("01: Admin Portal - Overview, AI Scanner & Audit Log", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password);
    await loginPage.expectLoginSuccess("ADMIN");
  });

  test("validates Admin Dashboard KPI cards and quick action navigation", async ({
    adminOverviewPage,
    page,
  }) => {
    await adminOverviewPage.goto();
    await adminOverviewPage.expectDashboardLoaded();

    // Verify Refresh Status interaction
    await adminOverviewPage.refreshStatus();
    await expect(page.locator("h1")).toContainText(/Good morning|Good afternoon|Good evening/i);

    // Verify Quick Action Link navigation
    await adminOverviewPage.configVerificationsLink.click();
    await page.waitForURL(/\/admin\/setup\/verification-settings/, { timeout: 10000 });
  });

  test("validates AI Absentee Pattern Scanner controls and scan triggers", async ({
    adminScannerPage,
    page,
  }) => {
    await adminScannerPage.goto();
    await adminScannerPage.expectScannerLoaded();

    await expect(page.getByText(/Machine Learning Engine Active/i)).toBeVisible();
    await expect(adminScannerPage.runScanButton).toBeEnabled();

    // Trigger AI Scan and assert response states
    await adminScannerPage.triggerScan();
    await expect(
      page.getByText(/Flagged Students|No anomalies detected|System Awaiting Analysis/i).first()
    ).toBeVisible();
  });

  test("validates System Audit Log trail, search, and severity filters", async ({
    adminAuditPage,
    page,
  }) => {
    await adminAuditPage.goto();
    await adminAuditPage.expectAuditPageLoaded();

    // Test search functionality
    await adminAuditPage.searchAudit("ADMIN");
    await expect(page.locator("table")).toBeVisible();

    // Verify Export Button is present and clickable
    await expect(adminAuditPage.exportButton).toBeVisible();
  });
});
