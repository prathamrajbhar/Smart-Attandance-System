import { test, expect, TEST_CREDENTIALS } from "../fixtures/test-fixtures";

test.describe("05: Teacher Portal - Core Workflows & Classes", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.teacher.email, TEST_CREDENTIALS.teacher.password);
    await loginPage.expectLoginSuccess("TEACHER");
  });

  test("validates Teacher Console metrics, quick actions, and recent sessions", async ({
    teacherOverviewPage,
    page,
  }) => {
    await teacherOverviewPage.goto();
    await teacherOverviewPage.expectOverviewLoaded();

    // Verify console refresh
    await teacherOverviewPage.refreshConsole();
    await expect(page.locator("h1")).toContainText(/Good morning|Good afternoon|Good evening|Professor/i);
  });

  test("navigates My Classes and inspects assigned course sections", async ({
    teacherClassesPage,
    page,
  }) => {
    await teacherClassesPage.goto();
    await teacherClassesPage.expectClassesLoaded();

    // Check if class cards or empty state is rendered
    const hasCards = await page.locator("h3").first().isVisible().catch(() => false);
    if (hasCards) {
      await expect(page.locator("h3").first()).toBeVisible();
    } else {
      await expect(page.getByText(/No Classes Assigned/i)).toBeVisible();
    }
  });

  test("manages Session Control: verifies form fields, durations, and past sessions", async ({
    teacherSessionsPage,
  }) => {
    await teacherSessionsPage.goto();

    await expect(teacherSessionsPage.durationInput).toBeVisible();
    await expect(teacherSessionsPage.startSessionButton).toBeVisible();
    await expect(teacherSessionsPage.pastSessionsTable).toBeVisible();
  });
});
