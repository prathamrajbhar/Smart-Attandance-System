import { test, expect, TEST_CREDENTIALS } from "../fixtures/test-fixtures";

test.describe("18: Dedicated Notification Centers (Super Admin, Admin, Teacher)", () => {
  test("Super Admin: Dedicated notifications hub renders metrics, search, and navigation", async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.superAdmin.email, TEST_CREDENTIALS.superAdmin.password);
    await loginPage.expectLoginSuccess("SUPER_ADMIN");

    // Navigate to dedicated notifications hub
    await page.goto("/super-admin/notifications");
    await expect(page.getByRole("heading", { name: /Platform Notifications & System Alerts/i })).toBeVisible();
    await expect(page.getByText("Total Alerts")).toBeVisible();
    await expect(page.getByText("Critical & Warnings")).toBeVisible();
    await expect(page.getByPlaceholder(/Search notifications/i)).toBeVisible();

    // Test filter tabs
    await page.getByRole("button", { name: "Security & Tenants" }).click();
    await page.getByRole("button", { name: "System Alerts" }).click();
    await page.getByRole("button", { name: "All Platform Alerts" }).click();
  });

  test("Tenant Admin: Dedicated campus notifications hub renders metrics and filters", async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password);
    await loginPage.expectLoginSuccess("ADMIN");

    // Navigate to dedicated admin notifications hub
    await page.goto("/admin/notifications");
    await expect(page.getByRole("heading", { name: /Campus Notifications & Alerts/i })).toBeVisible();
    await expect(page.getByText("Total Alerts")).toBeVisible();
    await expect(page.getByPlaceholder(/Search notifications/i)).toBeVisible();

    // Test filter tabs
    await page.getByRole("button", { name: "Attendance" }).click();
    await page.getByRole("button", { name: "All Alerts" }).click();
  });

  test("Teacher: Dedicated notifications hub renders alerts feed and role-specific filters", async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.teacher.email, TEST_CREDENTIALS.teacher.password);
    await loginPage.expectLoginSuccess("TEACHER");

    // Navigate to dedicated teacher notifications hub
    await page.goto("/teacher/notifications");
    await expect(page.getByRole("heading", { name: /Teacher Notifications & Alerts/i })).toBeVisible();
    await expect(page.getByText("Total Alerts")).toBeVisible();
    await expect(page.getByRole("button", { name: /^Unread$/i })).toBeVisible();

    // Test category filters
    await page.getByRole("button", { name: "Leave Requests" }).click();
    await page.getByRole("button", { name: "Device Changes" }).click();
    await page.getByRole("button", { name: "Announcements" }).click();
    await page.getByRole("button", { name: /^All$/i }).click();
  });
});
