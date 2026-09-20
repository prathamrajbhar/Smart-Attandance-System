import { test, expect, TEST_CREDENTIALS } from "../fixtures/test-fixtures";

test.describe("03: Admin Portal - System Setup Sub-Modules CRUD", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password);
    await loginPage.expectLoginSuccess("ADMIN");
  });

  test("manages Departments: creates new department entity", async ({
    adminDepartmentsPage,
    page,
  }) => {
    await adminDepartmentsPage.goto();
    await adminDepartmentsPage.goToAdd();

    const timestamp = Date.now();
    const deptName = `Department E2E ${timestamp.toString().slice(-4)}`;
    const deptCode = `D${timestamp.toString().slice(-3)}`;

    await adminDepartmentsPage.createDepartment(deptName, deptCode, "Dr. Department Head");
    await adminDepartmentsPage.expectToastMessage(/Department created|Success/i);
    await page.waitForURL(/\/admin\/setup\/departments/, { timeout: 10000 });
  });

  test("manages Subjects: creates new subject curriculum", async ({
    adminSubjectsPage,
    page,
  }) => {
    await adminSubjectsPage.goto();
    await adminSubjectsPage.goToAdd();

    const timestamp = Date.now();
    const subName = `Subject E2E ${timestamp.toString().slice(-4)}`;
    const subCode = `S${timestamp.toString().slice(-3)}`;

    await adminSubjectsPage.createSubject(subName, subCode, "Automated Test Subject");
    await adminSubjectsPage.expectToastMessage(/Subject created|Success/i);
    await page.waitForURL(/\/admin\/setup\/subjects/, { timeout: 10000 });
  });

  test("manages Classrooms: registers physical room venue", async ({
    adminClassroomsPage,
    page,
  }) => {
    await adminClassroomsPage.goto();
    await adminClassroomsPage.goToAdd();

    const timestamp = Date.now();
    const roomName = `Room ${timestamp.toString().slice(-3)}`;

    await adminClassroomsPage.createClassroom(roomName, "Science Wing", "60");
    await adminClassroomsPage.expectToastMessage(/Classroom created|Success/i);
    await page.waitForURL(/\/admin\/setup\/classrooms/, { timeout: 10000 });
  });

  test("manages Designations: registers faculty designation role", async ({
    adminDesignationsPage,
    page,
  }) => {
    await adminDesignationsPage.goto();
    await adminDesignationsPage.goToAdd();

    const timestamp = Date.now();
    const desigName = `Fellow ${timestamp.toString().slice(-4)}`;
    const desigCode = `F${timestamp.toString().slice(-3)}`;

    await adminDesignationsPage.createDesignation(desigName, desigCode, "Research Fellow");
    await adminDesignationsPage.expectToastMessage(/Designation created|Success/i);
    await page.waitForURL(/\/admin\/setup\/designations/, { timeout: 10000 });
  });

  test("configures Verification Settings multi-modal kill-switches", async ({
    adminVerificationSettingsPage,
  }) => {
    await adminVerificationSettingsPage.goto();
    await adminVerificationSettingsPage.expectPageLoaded();

    // Toggle switch and save
    await adminVerificationSettingsPage.toggleFaceRecognition();
    await adminVerificationSettingsPage.saveConfiguration();
    await adminVerificationSettingsPage.expectToastMessage(/Verification configuration updated|updated/i);
  });
});
