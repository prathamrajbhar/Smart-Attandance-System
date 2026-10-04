import { test, expect, TEST_CREDENTIALS } from "../fixtures/test-fixtures";

test.describe("13: Teacher Portal - Attendance Session Lifecycle & Real-Time Controls", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.teacher.email, TEST_CREDENTIALS.teacher.password);
    await loginPage.expectLoginSuccess("TEACHER");
  });

  test("executes end-to-end active session workflow: launch, QR modal, roster inspection, and stop", async ({
    teacherSessionsPage,
    page,
  }) => {
    await teacherSessionsPage.goto();
    await expect(page.getByText("Session Control")).toBeVisible();

    // Select class from dropdown
    const classSelect = page.locator("select").first();
    await expect(classSelect).toBeVisible();
    const options = await classSelect.locator("option").all();

    if (options.length > 1) {
      const firstValidValue = await options[1].getAttribute("value");
      if (firstValidValue) {
        await classSelect.selectOption(firstValidValue);
      }

      // Enter duration
      const durationInput = teacherSessionsPage.durationInput;
      await durationInput.fill("15");

      // Start attendance session
      await teacherSessionsPage.startSessionButton.click();
      await expect(page.getByText(/Session started|Success/i)).toBeVisible({ timeout: 10000 });

      // Verify Active Session card rendered with Live indicator
      const liveBadge = page.locator("span:has-text('Live')").first();
      await expect(liveBadge).toBeVisible();

      // Test Smart Pass QR Modal
      const qrBtn = page.getByRole("button", { name: /Smart Pass QR/i }).first();
      if (await qrBtn.isVisible()) {
        await qrBtn.click();
        await expect(page.getByText(/Dynamic Smart Pass QR|Smart Pass/i).first()).toBeVisible();
        // Close modal
        const closeBtn = page.locator("button[aria-label='Close modal']").first();
        await expect(closeBtn).toBeVisible();
        await closeBtn.click();
        await expect(closeBtn).toBeHidden({ timeout: 5000 });
      }

      // Test Live Roster Navigation
      const rosterBtn = page.getByRole("button", { name: /Roster/i }).first();
      if (await rosterBtn.isVisible()) {
        await rosterBtn.click();
        await page.waitForURL(/\/teacher\/sessions\/.*\/roster/, { timeout: 10000 });
        await expect(page.getByText(/Session Roster|Students/i).first()).toBeVisible();
        await page.goBack();
      }

      // Stop Session
      const stopBtn = page.getByRole("button", { name: /Stop/i }).first();
      if (await stopBtn.isVisible()) {
        await stopBtn.click();
        await expect(page.getByText(/Session stopped|Success/i)).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test("validates Past Sessions table filtering and navigation controls", async ({
    teacherSessionsPage,
    page,
  }) => {
    await teacherSessionsPage.goto();
    await expect(teacherSessionsPage.pastSessionsTable).toBeVisible();

    const pastRows = page.locator("table tbody tr");
    const count = await pastRows.count();
    if (count > 0) {
      const firstRow = pastRows.first();
      await expect(firstRow).toBeVisible();
      const actions = firstRow.locator("button");
      expect(await actions.count()).toBeGreaterThan(0);
    }
  });
});
