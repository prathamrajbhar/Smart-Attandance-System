import { test, expect, TEST_CREDENTIALS } from "../fixtures/test-fixtures";

test.describe("16: Institutional Suspension & Client-Side Eviction Lifecycle", () => {
  test("verifies suspended status page renders informative message and support controls", async ({
    page,
  }) => {
    await page.goto("/suspended");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Institution Account Suspended" })).toBeVisible();
    await expect(page.getByText("Institutional Status")).toBeVisible();
    await expect(page.getByText(/Logins and active sessions are temporarily frozen/i)).toBeVisible();
    await expect(page.getByText(/Attendance records, classes, and roster data remain fully safe/i)).toBeVisible();

    const supportButton = page.getByRole("button", { name: /Contact Platform Support/i });
    const signoutButton = page.getByRole("button", { name: /Sign Out \/ Return to Login/i });
    await expect(supportButton).toBeVisible();
    await expect(signoutButton).toBeVisible();

    await signoutButton.click();
    await page.waitForURL(/\/login/, { timeout: 10000 });
    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  });

  test("displays inline suspension alert banner when logging in under suspended tenant", async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();

    await page.route("**/api/v1/auth/login", async (route) => {
      await route.fulfill({
        status: 403,
        contentType: "application/json",
        body: JSON.stringify({
          detail: "Tenant account for 'Apex Institute of Technology' is currently suspended. Please contact platform administration.",
        }),
      });
    });

    await loginPage.login("prof.sharma@apex.edu", "Secret123!");

    await expect(page.getByText("Institution Suspended", { exact: true })).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Apex Institute of Technology/i)).toBeVisible();
    await expect(page.getByText(/currently suspended/i)).toBeVisible();
    expect(page.url()).toContain("/login");
  });

  test("evicts authenticated faculty session to /suspended upon receiving 403 suspension response", async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.teacher.email, TEST_CREDENTIALS.teacher.password);
    await loginPage.expectLoginSuccess("TEACHER");

    await page.route("**/api/v1/auth/me", async (route) => {
      await route.fulfill({
        status: 403,
        contentType: "application/json",
        body: JSON.stringify({
          detail: "Tenant account is currently suspended.",
        }),
      });
    });

    await page.evaluate(() => {
      window.dispatchEvent(new Event("focus"));
    });

    await page.waitForURL(/\/suspended/, { timeout: 10000 });
    await expect(page.getByRole("heading", { name: "Institution Account Suspended" })).toBeVisible();
    await expect(page.getByText("Institutional Status")).toBeVisible();
  });

  test("evicts authenticated Admin dashboard session to /suspended when tenant gets suspended in background", async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password);
    await loginPage.expectLoginSuccess("ADMIN");

    await page.route("**/api/v1/auth/me", async (route) => {
      await route.fulfill({
        status: 403,
        contentType: "application/json",
        body: JSON.stringify({
          detail: "Tenant account for 'Apex Institute' is currently suspended.",
        }),
      });
    });

    await page.evaluate(() => {
      window.dispatchEvent(new Event("focus"));
    });

    await page.waitForURL(/\/suspended/, { timeout: 10000 });
    await expect(page.getByRole("heading", { name: "Institution Account Suspended" })).toBeVisible();
  });
});
