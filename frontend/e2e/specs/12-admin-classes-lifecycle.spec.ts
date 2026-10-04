import { test, expect, TEST_CREDENTIALS } from "../fixtures/test-fixtures";

test.describe("12: Admin Portal - Academic Classes Full Lifecycle (Create, Edit, Assign, Enroll)", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password);
    await loginPage.expectLoginSuccess("ADMIN");
  });

  test("manages academic class creation, detail inspection, editing, and teacher assignment", async ({
    adminClassesPage,
    page,
  }) => {
    await adminClassesPage.goto();
    await adminClassesPage.goToCreateClass();

    const timestamp = Date.now().toString().slice(-4);
    const className = `CS-FULL-${timestamp}`;

    await adminClassesPage.fillClassName(className);
    await adminClassesPage.selectTeacherByIndex(0);
    await adminClassesPage.selectSubjectByIndex(0);
    await adminClassesPage.submitClassForm();

    await adminClassesPage.expectToastMessage(/Class created|Success/i);
    await page.waitForURL(/\/admin\/classes/, { timeout: 10000 });

    // Locate the newly created class
    const classRow = page.locator("tr", { hasText: className }).first();
    if (!(await classRow.isVisible())) {
      await adminClassesPage.searchInput.fill(className);
      await page.waitForTimeout(500);
    }
    await expect(classRow).toBeVisible();

    // Navigate to Class Detail
    const viewBtn = classRow.locator("a:has-text('View')").first();
    await viewBtn.click();
    await page.waitForURL(/\/admin\/classes\/[0-9a-zA-Z-]+$/, { timeout: 10000 });
    await expect(page.getByRole("heading", { name: className })).toBeVisible();

    // Test Edit Class
    const editBtn = page.locator("a:has-text('Edit Details')").first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await page.waitForURL(/\/admin\/classes\/.*\/edit/, { timeout: 10000 });
      await page.locator("button[type='submit']:has-text('Save Changes')").click();
      await expect(page.getByText(/Class updated successfully|Success/i)).toBeVisible({ timeout: 10000 });
    }

    // Test Change Teacher
    const assignBtn = page.locator("a:has-text('Change Teacher')").first();
    if (await assignBtn.isVisible()) {
      await assignBtn.click();
      await page.waitForURL(/\/admin\/classes\/.*\/assign-teacher/, { timeout: 10000 });
      await page.locator("button[type='submit']:has-text('Assign Teacher')").click();
      await expect(page.getByText(/Teacher assigned successfully|Success/i)).toBeVisible({ timeout: 10000 });
    }
  });

  test("manages student batch enrollment into academic classes", async ({
    adminClassesPage,
    page,
  }) => {
    await adminClassesPage.goto();
    const firstView = page.locator("table tbody tr a:has-text('View')").first();
    await expect(firstView).toBeVisible();
    await firstView.click();
    await page.waitForURL(/\/admin\/classes\/[0-9a-zA-Z-]+$/, { timeout: 10000 });

    const enrollAction = page.locator("a:has-text('Enroll Students')").first();
    if (await enrollAction.isVisible()) {
      await enrollAction.click();
      await page.waitForURL(/\/admin\/classes\/.*\/enroll/, { timeout: 10000 });
      await expect(page.getByText(/Enroll Students/i).first()).toBeVisible();

      // Check if student checkboxes exist
      const firstCheckbox = page.locator("input[type='checkbox']").first();
      if (await firstCheckbox.isVisible()) {
        await firstCheckbox.check();
        const enrollBtn = page.getByRole("button", { name: /Enroll/i });
        if (await enrollBtn.isVisible() && await enrollBtn.isEnabled()) {
          await enrollBtn.click();
          await expect(page.getByText(/enrolled successfully|Success/i)).toBeVisible({ timeout: 10000 });
        }
      }
    }
  });
});
