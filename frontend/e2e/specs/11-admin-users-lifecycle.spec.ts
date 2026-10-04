import { test, expect, TEST_CREDENTIALS, generateYopmail } from "../fixtures/test-fixtures";

test.describe("11: Admin Portal - Student & Faculty Full Lifecycles (Create, Inspect, Edit)", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password);
    await loginPage.expectLoginSuccess("ADMIN");
  });

  test("student complete lifecycle: create, inspect profile, and edit details", async ({
    adminStudentsPage,
    page,
  }) => {
    await adminStudentsPage.goto();

    // Create student
    await adminStudentsPage.goToAddStudent();
    const timestamp = Date.now().toString().slice(-5);
    const testEmail = generateYopmail("student_full");
    const testEnroll = `EN${timestamp}`;

    await adminStudentsPage.fillAndSubmitStudent({
      email: testEmail,
      enrollmentNumber: testEnroll,
      firstName: "Aarav",
      lastName: `Student${timestamp}`,
      phone: "+919876543210",
      batch: "2024-2028",
    });

    await adminStudentsPage.expectToastMessage(/Student created|Success/i);
    await page.waitForURL(/\/admin\/users\/students/, { timeout: 10000 });

    // Search and locate student in table
    await adminStudentsPage.searchStudent(testEnroll);
    const studentRow = page.locator("tr", { hasText: testEnroll });
    await expect(studentRow).toBeVisible();

    // Click row or View to open Student Profile
    const viewButton = studentRow.locator("button:has-text('View'), a:has-text('View')").first();
    if (await viewButton.isVisible()) {
      await viewButton.click();
    } else {
      await studentRow.click();
    }
    await page.waitForURL(/\/admin\/users\/students\/.+/, { timeout: 10000 });
    await expect(page.getByText(testEnroll).first()).toBeVisible();

    // Navigate to Edit Student
    const editBtn = page.locator("button:has-text('Edit'), a:has-text('Edit')").first();
    await editBtn.click();
    await page.waitForURL(/\/admin\/users\/students\/.*\/edit/, { timeout: 10000 });

    // Update batch and submit
    const batchInput = page.locator("input[name='batch']");
    if (await batchInput.isVisible()) {
      await batchInput.fill("2025-2029");
    }
    await page.locator("button[type='submit']:has-text('Save Changes')").click();
    await expect(page.getByText(/Student updated successfully|Success/i)).toBeVisible({ timeout: 10000 });
  });

  test("teacher complete lifecycle: create, inspect profile, and edit faculty details", async ({
    adminTeachersPage,
    page,
  }) => {
    await adminTeachersPage.goto();

    // Create teacher
    await adminTeachersPage.goToAddTeacher();
    const timestamp = Date.now().toString().slice(-5);
    const testEmail = generateYopmail("prof_full");
    const testEmpId = `EMP${timestamp}`;

    await adminTeachersPage.fillAndSubmitTeacher({
      email: testEmail,
      employeeId: testEmpId,
      firstName: "Dr. Professor",
      lastName: `Sharma${timestamp}`,
      qualification: "Ph.D. Information Security",
    });

    await adminTeachersPage.expectToastMessage(/Teacher created|Success/i);
    await page.waitForURL(/\/admin\/users\/teachers/, { timeout: 10000 });

    // Search and locate teacher
    await adminTeachersPage.searchTeacher(testEmpId);
    const teacherRow = page.locator("tr", { hasText: testEmpId });
    await expect(teacherRow).toBeVisible();

    // View Profile
    const viewButton = teacherRow.locator("button:has-text('View'), a:has-text('View')").first();
    if (await viewButton.isVisible()) {
      await viewButton.click();
    } else {
      await teacherRow.click();
    }
    await page.waitForURL(/\/admin\/users\/teachers\/.+/, { timeout: 10000 });
    await expect(page.getByText(testEmpId).first()).toBeVisible();

    // Navigate to Edit
    const editBtn = page.locator("button:has-text('Edit'), a:has-text('Edit')").first();
    await editBtn.click();
    await page.waitForURL(/\/admin\/users\/teachers\/.*\/edit/, { timeout: 10000 });

    // Update qualification and save
    const qualInput = page.locator("input[name='qualification']");
    if (await qualInput.isVisible()) {
      await qualInput.fill("Ph.D. Artificial Intelligence");
    }
    await page.locator("button[type='submit']:has-text('Save Changes')").click();
    await expect(page.getByText(/Teacher updated successfully|Success/i)).toBeVisible({ timeout: 10000 });
  });
});
