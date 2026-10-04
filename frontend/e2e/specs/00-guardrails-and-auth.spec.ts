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
    const sidebar = page.locator("aside");
    await expect(sidebar.getByRole("link", { name: "Overview" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Students" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Teachers" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Classes", exact: true })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "AI Scanner", exact: true })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Audit Log" })).toBeVisible();

    // Verify System Setup Accordion
    await adminOverviewPage.openSystemSetupAccordion();
    await expect(sidebar.getByRole("link", { name: "Departments" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Subjects" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Classrooms" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Designations" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Verification Settings" })).toBeVisible();

    // Verify Session Persistence across page reload
    await page.reload();
    await adminOverviewPage.waitForPageLoaded();
    await expect(sidebar.getByRole("link", { name: "Overview" })).toBeVisible();

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
    const teacherSidebar = page.locator("aside");
    await expect(teacherSidebar.getByRole("link", { name: "Overview" })).toBeVisible();
    await expect(teacherSidebar.getByRole("link", { name: "My Classes" })).toBeVisible();
    await expect(teacherSidebar.getByRole("link", { name: "Sessions" })).toBeVisible();
    await expect(teacherSidebar.getByRole("link", { name: "Review Queue" })).toBeVisible();
    await expect(teacherSidebar.getByRole("link", { name: "Leave Requests" })).toBeVisible();
    await expect(teacherSidebar.getByRole("link", { name: "Device Changes" })).toBeVisible();

    // Verify Analytics & Reports Group
    await expect(teacherSidebar.getByRole("link", { name: "Class Analytics" })).toBeVisible();
    await expect(teacherSidebar.getByRole("link", { name: "Attendance History" })).toBeVisible();
    await expect(teacherSidebar.getByRole("link", { name: "Profile & Security" })).toBeVisible();

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

  test("enforces unauthenticated route protection and redirects to login", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/login/);

    await page.goto("/teacher/dashboard");
    await expect(page).toHaveURL(/\/login/);

    await page.goto("/super-admin/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("handles onboarding invitation page with missing or invalid token safely", async ({ page }) => {
    await page.goto("/onboarding");
    await expect(page.getByText(/Missing invitation token|Invalid/i).first()).toBeVisible({ timeout: 10000 });

    await page.goto("/onboarding?token=expired-or-malformed-token");
    await expect(page.getByText(/Failed to verify|Invalid/i).first()).toBeVisible({ timeout: 10000 });
  });
});
