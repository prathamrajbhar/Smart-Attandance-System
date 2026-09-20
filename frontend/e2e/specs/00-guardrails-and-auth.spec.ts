import { test, expect, TEST_CREDENTIALS, generateYopmail } from "../fixtures/test-fixtures";

test.describe("00: Environment Guardrails, Authentication & Password Recovery", () => {
  test("asserts test suite runs strictly against local test database", async () => {
    const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/smart_attendance";
    expect(dbUrl).toMatch(/localhost|127\.0\.0\.1|test\.db|sqlite/i);
    expect(dbUrl).not.toMatch(/amazonaws\.com|supabase\.co|neon\.tech|production/i);
  });

  test("authenticates Admin, verifies sidebar links, persists session, and performs secure logout", async ({
    loginPage,
    adminOverviewPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password);
    await loginPage.expectLoginSuccess("ADMIN");

    // Verify Admin Sidebar Modules
    await expect(page.getByRole("link", { name: "Overview" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Students" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Teachers" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Classes" })).toBeVisible();
    await expect(page.getByRole("link", { name: "AI Scanner" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Audit Log" })).toBeVisible();

    // Verify System Setup Accordion
    await adminOverviewPage.openSystemSetupAccordion();
    await expect(page.getByRole("link", { name: "Departments" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Subjects" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Classrooms" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Designations" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Verification Settings" })).toBeVisible();

    // Verify Session Persistence across page reload
    await page.reload();
    await adminOverviewPage.waitForPageLoaded();
    await expect(page.getByRole("link", { name: "Overview" })).toBeVisible();

    // Perform Secure Logout
    await adminOverviewPage.logout();
    await expect(page).toHaveURL(/\/login/);
  });

  test("authenticates Teacher, verifies faculty sidebar, and performs logout", async ({
    loginPage,
    teacherOverviewPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.teacher.email, TEST_CREDENTIALS.teacher.password);
    await loginPage.expectLoginSuccess("TEACHER");

    // Verify Teacher Sidebar Modules
    await expect(page.getByRole("link", { name: "Overview" })).toBeVisible();
    await expect(page.getByRole("link", { name: "My Classes" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sessions" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Review Queue" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Leave Requests" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Device Changes" })).toBeVisible();

    // Verify Analytics & Reports Group
    await expect(page.getByRole("link", { name: "Class Analytics" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Attendance History" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Profile & Security" })).toBeVisible();

    // Perform Logout
    await teacherOverviewPage.logout();
    await expect(page).toHaveURL(/\/login/);
  });

  test("executes forgot password recovery flow using @yopmail.com address", async ({
    forgotPasswordPage,
  }) => {
    const recoveryYopmail = generateYopmail("recovery_user");
    await forgotPasswordPage.goto();
    await forgotPasswordPage.requestReset(recoveryYopmail);
    await forgotPasswordPage.expectSubmissionConfirmation(recoveryYopmail);
  });

  test("handles reset password page with missing or invalid token safely", async ({
    resetPasswordPage,
  }) => {
    await resetPasswordPage.gotoWithoutToken();
    await resetPasswordPage.expectInvalidToken();

    await resetPasswordPage.gotoWithToken("invalid_jwt_e2e_token");
    await resetPasswordPage.expectInvalidToken();
  });

  test("rejects invalid credentials with error feedback", async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(generateYopmail("nonexistent"), "WrongPassword123!");
    await loginPage.expectToastMessage(/Incorrect|Login failed|Invalid|credentials/i);
  });
});
