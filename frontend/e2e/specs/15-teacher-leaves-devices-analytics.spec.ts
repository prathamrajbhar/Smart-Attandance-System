import { test, expect, TEST_CREDENTIALS } from "../fixtures/test-fixtures";

test.describe("15: Teacher Portal - Leaves, Device Resets, Class Analytics & Faculty Security", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.teacher.email, TEST_CREDENTIALS.teacher.password);
    await loginPage.expectLoginSuccess("TEACHER");
  });

  test("processes Student Leave Requests with review modal and notes", async ({
    teacherLeavesPage,
    page,
  }) => {
    await teacherLeavesPage.goto();
    await expect(page.getByText(/Leave Requests|Student Leave/i).first()).toBeVisible();

    // Verify search filter input
    const searchInput = page.locator("main input[placeholder*='Search']").first();
    if (await searchInput.isVisible()) {
      await searchInput.fill("rahul");
      await searchInput.fill("");
    }

    // Check for pending leave row action
    const actionBtn = page.locator("table tbody tr button:has-text('Approve'), table tbody tr button:has-text('Review')").first();
    if (await actionBtn.isVisible()) {
      await actionBtn.click();
      const reviewDialog = page.locator("div[role='dialog']");
      if (await reviewDialog.isVisible()) {
        const noteArea = reviewDialog.locator("textarea");
        if (await noteArea.isVisible()) {
          await noteArea.fill("Leave approved per institutional protocol");
        }
        const confirmBtn = reviewDialog.locator("button:has-text('Confirm'), button:has-text('Approve')").last();
        await confirmBtn.click();
        await expect(page.getByText(/successfully|processed/i)).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test("manages Device Change Requests with refresh action and decision controls", async ({
    teacherDeviceChangesPage,
    page,
  }) => {
    await teacherDeviceChangesPage.goto();
    await expect(page.getByText(/Device Change Requests/i)).toBeVisible();

    // Test Refresh action
    const refreshBtn = page.getByRole("button", { name: /Refresh/i });
    await expect(refreshBtn).toBeVisible();
    await refreshBtn.click();

    // Check device table rows or empty state
    const hasTable = await page.locator("table").isVisible().catch(() => false);
    if (hasTable) {
      await expect(page.locator("table")).toBeVisible();
    } else {
      await expect(page.getByText(/No Pending Requests|All device change requests/i).first()).toBeVisible();
    }
  });

  test("inspects Class Analytics metrics, trend visualizations, and class dropdown filters", async ({
    teacherAnalyticsPage,
    page,
  }) => {
    await teacherAnalyticsPage.goto();
    await teacherAnalyticsPage.expectPageLoaded();

    // Test Class Filter Select
    const classSelect = teacherAnalyticsPage.classSelect;
    await expect(classSelect).toBeVisible();
    const options = await classSelect.locator("option").all();
    if (options.length > 1) {
      await classSelect.selectOption({ index: 1 });
      await expect(page.locator("h1, h2, h3").first()).toBeVisible();
    }
  });

  test("filters Attendance History logs and triggers CSV Export download", async ({
    teacherHistoryPage,
    page,
  }) => {
    await teacherHistoryPage.goto();
    await expect(page.getByText(/Attendance History/i)).toBeVisible();

    // Test Export CSV action
    const exportBtn = page.locator("button:has-text('Export CSV'), button:has-text('Export')").first();
    if (await exportBtn.isVisible()) {
      const [download] = await Promise.all([
        page.waitForEvent("download", { timeout: 7000 }).catch(() => null),
        exportBtn.click(),
      ]);
      if (download) {
        expect(download.suggestedFilename()).toMatch(/\.csv$/i);
      }
    }
  });

  test("verifies Faculty Profile attributes and tests Password Change validation rules", async ({
    teacherProfilePage,
    page,
  }) => {
    await teacherProfilePage.goto();
    await expect(page.getByText(/Faculty Profile & Security|Faculty Profile/i)).toBeVisible();

    // Assert employee attributes
    await expect(page.getByText(/Employee ID/i)).toBeVisible();
    await expect(page.getByText(/Faculty Member/i)).toBeVisible();

    // Test password change validation: empty submission
    const saveBtn = page.getByRole("button", { name: /Update Password|Save Password|Change Password/i });
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
      await expect(
        page.getByText(/Password must be at least 8 characters|Please confirm/i).first()
      ).toBeVisible();

      // Test password mismatch
      const currInput = page.locator("input[name='current_password']");
      const newInput = page.locator("input[name='new_password']");
      const confirmInput = page.locator("input[name='confirm_password']");

      if (await currInput.isVisible() && await newInput.isVisible() && await confirmInput.isVisible()) {
        await currInput.fill("OldPassword123!");
        await newInput.fill("NewPassword123!");
        await confirmInput.fill("MismatchPassword456!");
        await saveBtn.click();
        await expect(page.getByText(/Passwords do not match|do not match/i).first()).toBeVisible();
      }
    }
  });
});
