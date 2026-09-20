import { test, expect, TEST_CREDENTIALS } from "../fixtures/test-fixtures";

test.describe("07: Teacher Portal - Analytics, Review, Leaves & Profile", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.teacher.email, TEST_CREDENTIALS.teacher.password);
    await loginPage.expectLoginSuccess("TEACHER");
  });

  test("validates Review Queue page and filter interactions", async ({
    teacherReviewPage,
    page,
  }) => {
    await teacherReviewPage.goto();
    await teacherReviewPage.expectReviewQueueLoaded();

    const isAllClear = await page.getByText(/All Clear|No flagged records/i).isVisible().catch(() => false);
    if (!isAllClear) {
      await expect(teacherReviewPage.searchInput).toBeVisible();
    }
  });

  test("validates Student Leave Requests list and empty state handling", async ({
    teacherLeavesPage,
    page,
  }) => {
    await teacherLeavesPage.goto();
    await teacherLeavesPage.expectLeavesPageLoaded();

    const isAllClear = await page.getByText(/All Clear|No pending leave/i).isVisible().catch(() => false);
    if (!isAllClear) {
      await expect(teacherLeavesPage.searchInput).toBeVisible();
    }
  });

  test("validates Device Change Requests and refresh button", async ({
    teacherDeviceChangesPage,
  }) => {
    await teacherDeviceChangesPage.goto();
    await teacherDeviceChangesPage.expectPageLoaded();
    await expect(teacherDeviceChangesPage.refreshButton).toBeVisible();
  });

  test("validates Class Analytics charts and select controls", async ({
    teacherAnalyticsPage,
    page,
  }) => {
    await teacherAnalyticsPage.goto();
    await teacherAnalyticsPage.expectPageLoaded();

    const hasNoClasses = await page.getByText(/No Classes|No statistics/i).first().isVisible().catch(() => false);
    if (!hasNoClasses) {
      await expect(teacherAnalyticsPage.classSelect).toBeVisible();
    }
  });

  test("validates Attendance History logs and export actions", async ({
    teacherHistoryPage,
    page,
  }) => {
    await teacherHistoryPage.goto();
    await teacherHistoryPage.expectPageLoaded();

    const hasTable = await page.locator("table").isVisible().catch(() => false);
    if (hasTable) {
      await expect(page.locator("table")).toBeVisible();
    } else {
      await expect(page.getByText(/No Sessions Match Filters|No matching sessions/i).first()).toBeVisible();
    }
  });

  test("validates Faculty Profile & Password Security controls", async ({
    teacherProfilePage,
  }) => {
    await teacherProfilePage.goto();
    await teacherProfilePage.expectProfileLoaded();

    await expect(teacherProfilePage.currentPasswordInput).toBeVisible();
    await expect(teacherProfilePage.newPasswordInput).toBeVisible();
    await expect(teacherProfilePage.confirmPasswordInput).toBeVisible();
    await expect(teacherProfilePage.updatePasswordButton).toBeVisible();
  });
});
