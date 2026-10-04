import { test, expect, TEST_CREDENTIALS } from "../fixtures/test-fixtures";

test.describe("10: Admin Portal - System Setup Submodules Deep CRUD & Policies", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password);
    await loginPage.expectLoginSuccess("ADMIN");
  });

  test("creates and edits a Department entity", async ({ adminDepartmentsPage, page }) => {
    await adminDepartmentsPage.goto();
    await adminDepartmentsPage.goToAdd();

    const timestamp = Date.now().toString().slice(-4);
    const deptName = `Dept Automation ${timestamp}`;
    const deptCode = `DA${timestamp.slice(-2)}`;

    await adminDepartmentsPage.createDepartment(deptName, deptCode, "Prof Head");
    await adminDepartmentsPage.expectToastMessage(/Department created|Success/i);
    await page.waitForURL(/\/admin\/setup\/departments/, { timeout: 10000 });

    await adminDepartmentsPage.searchInput.fill(deptName);
    // Click edit on the created department row
    const row = page.locator("tr", { hasText: deptName });
    await expect(row).toBeVisible();
    await row.locator("button:has-text('Edit'), a:has-text('Edit')").first().click();
    await page.waitForURL(/\/admin\/setup\/departments\/.*\/edit/, { timeout: 10000 });

    // Modify department head
    const headInput = page.locator("input[name='head']");
    if (await headInput.isVisible()) {
      await headInput.fill("Dr. Senior Head Updated");
      await page.locator("button[type='submit']:has-text('Save Changes')").click();
      await expect(page.getByText(/Department updated successfully|Success/i)).toBeVisible({ timeout: 10000 });
      await page.waitForURL(/\/admin\/setup\/departments/, { timeout: 10000 });
    }
  });

  test("creates and edits a Subject entity", async ({ adminSubjectsPage, page }) => {
    await adminSubjectsPage.goto();
    await adminSubjectsPage.goToAdd();

    const timestamp = Date.now().toString().slice(-4);
    const subName = `Sub Automation ${timestamp}`;
    const subCode = `SA${timestamp.slice(-2)}`;

    await adminSubjectsPage.createSubject(subName, subCode, "Automated Syllabus");
    await adminSubjectsPage.expectToastMessage(/Subject created|Success/i);
    await page.waitForURL(/\/admin\/setup\/subjects/, { timeout: 10000 });

    await adminSubjectsPage.searchInput.fill(subName);
    // Edit the created subject
    const row = page.locator("tr", { hasText: subName });
    await expect(row).toBeVisible();
    await row.locator("button:has-text('Edit'), a:has-text('Edit')").first().click();
    await page.waitForURL(/\/admin\/setup\/subjects\/.*\/edit/, { timeout: 10000 });

    await page.locator("button[type='submit']:has-text('Save Changes')").click();
    await expect(page.getByText(/Subject updated successfully|Success/i)).toBeVisible({ timeout: 10000 });
    await page.waitForURL(/\/admin\/setup\/subjects/, { timeout: 10000 });
  });

  test("creates and edits a Classroom entity", async ({ adminClassroomsPage, page }) => {
    await adminClassroomsPage.goto();
    await adminClassroomsPage.goToAdd();

    const timestamp = Date.now().toString().slice(-4);
    const roomName = `Room-E2E-${timestamp}`;

    await adminClassroomsPage.createClassroom(roomName, "North Wing", "45");
    await adminClassroomsPage.expectToastMessage(/Classroom created|Success/i);
    await page.waitForURL(/\/admin\/setup\/classrooms/, { timeout: 10000 });

    await adminClassroomsPage.searchInput.fill(roomName);
    const row = page.locator("tr", { hasText: roomName });
    await expect(row).toBeVisible();
    await row.locator("button:has-text('Edit'), a:has-text('Edit')").first().click();
    await page.waitForURL(/\/admin\/setup\/classrooms\/.*\/edit/, { timeout: 10000 });

    await page.locator("button[type='submit']:has-text('Save Changes')").click();
    await expect(page.getByText(/Classroom updated successfully|Success/i)).toBeVisible({ timeout: 10000 });
    await page.waitForURL(/\/admin\/setup\/classrooms/, { timeout: 10000 });
  });

  test("creates and edits a Designation entity", async ({ adminDesignationsPage, page }) => {
    await adminDesignationsPage.goto();
    await adminDesignationsPage.goToAdd();

    const timestamp = Date.now().toString().slice(-4);
    const desigName = `Role E2E ${timestamp}`;
    const desigCode = `R${timestamp.slice(-2)}`;

    await adminDesignationsPage.createDesignation(desigName, desigCode, "Research Assistant");
    await adminDesignationsPage.expectToastMessage(/Designation created|Success/i);
    await page.waitForURL(/\/admin\/setup\/designations/, { timeout: 10000 });

    await adminDesignationsPage.searchInput.fill(desigName);
    const row = page.locator("tr", { hasText: desigName });
    await expect(row).toBeVisible();
    await row.locator("button:has-text('Edit'), a:has-text('Edit')").first().click();
    await page.waitForURL(/\/admin\/setup\/designations\/.*\/edit/, { timeout: 10000 });

    await page.locator("button[type='submit']:has-text('Save Changes')").click();
    await expect(page.getByText(/Designation updated successfully|Success/i)).toBeVisible({ timeout: 10000 });
    await page.waitForURL(/\/admin\/setup\/designations/, { timeout: 10000 });
  });

  test("configures and saves multi-modal verification policies", async ({
    adminVerificationSettingsPage,
    page,
  }) => {
    await adminVerificationSettingsPage.goto();
    await adminVerificationSettingsPage.expectPageLoaded();

    await adminVerificationSettingsPage.toggleFaceRecognition();
    await adminVerificationSettingsPage.saveConfiguration();
    await adminVerificationSettingsPage.expectToastMessage(/Verification configuration updated|updated/i);
  });
});
