import { test, expect, TEST_CREDENTIALS, generateYopmail } from "../fixtures/test-fixtures";

test.describe("02: Admin Portal - Students, Teachers & Classes CRUD with @yopmail.com", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password);
    await loginPage.expectLoginSuccess("ADMIN");
  });

  test("manages Students: tests validation errors, search, and student creation with @yopmail.com", async ({
    adminStudentsPage,
    page,
  }) => {
    await adminStudentsPage.goto();

    // Verify search
    await adminStudentsPage.searchStudent("cse");
    await expect(page.locator("table")).toBeVisible();

    // Go to Add Student and test empty validation
    await adminStudentsPage.goToAddStudent();
    await adminStudentsPage.submitButton.click();
    await expect(page.getByText(/Invalid email|Required|String must contain|Email is required/i).first()).toBeVisible();

    // Fill valid student data using @yopmail.com
    const timestamp = Date.now();
    const testEmail = generateYopmail("student_e2e");
    const testEnroll = `EN${timestamp.toString().slice(-6)}`;

    await adminStudentsPage.fillAndSubmitStudent({
      email: testEmail,
      enrollmentNumber: testEnroll,
      firstName: "Test",
      lastName: "Student",
      phone: "+919876543210",
      batch: "2024-2028",
    });

    await adminStudentsPage.expectToastMessage(/Student created|Success/i);
    await page.waitForURL(/\/admin\/users\/students/, { timeout: 10000 });
  });

  test("manages Teachers: tests validation errors and faculty creation with @yopmail.com", async ({
    adminTeachersPage,
    page,
  }) => {
    await adminTeachersPage.goto();

    // Search faculty
    await adminTeachersPage.searchTeacher("emp");
    await expect(page.locator("table")).toBeVisible();

    // Go to Add Teacher and test validation
    await adminTeachersPage.goToAddTeacher();
    await adminTeachersPage.submitButton.click();
    await expect(page.getByText(/Invalid email|Required|String must contain|Email is required/i).first()).toBeVisible();

    // Fill valid teacher data using @yopmail.com
    const timestamp = Date.now();
    const testEmail = generateYopmail("prof_e2e");
    const testEmpId = `EMP${timestamp.toString().slice(-6)}`;

    await adminTeachersPage.fillAndSubmitTeacher({
      email: testEmail,
      employeeId: testEmpId,
      firstName: "Professor",
      lastName: "Tester",
      qualification: "Ph.D Computer Science",
    });

    await adminTeachersPage.expectToastMessage(/Teacher created|Success/i);
    await page.waitForURL(/\/admin\/users\/teachers/, { timeout: 10000 });
  });

  test("manages Classes: creates academic class and associates faculty", async ({
    adminClassesPage,
    page,
  }) => {
    await adminClassesPage.goto();

    await adminClassesPage.goToCreateClass();
    const timestamp = Date.now();
    const className = `CS-E2E-${timestamp.toString().slice(-4)}`;

    await adminClassesPage.fillClassName(className);
    await adminClassesPage.selectTeacherByIndex(0);
    await adminClassesPage.selectSubjectByIndex(0);

    await adminClassesPage.submitClassForm();
    await adminClassesPage.expectToastMessage(/Class created|Success/i);
    await page.waitForURL(/\/admin\/classes/, { timeout: 10000 });
  });
});
