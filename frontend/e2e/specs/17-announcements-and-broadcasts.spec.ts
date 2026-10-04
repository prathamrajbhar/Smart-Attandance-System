import { test, expect, TEST_CREDENTIALS } from "../fixtures/test-fixtures";

test.describe("17: Platform Announcements & Real-Time Broadcasts", () => {
  test("Super Admin: Dispatches global announcement and verifies dispatch history log", async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.superAdmin.email, TEST_CREDENTIALS.superAdmin.password);
    await loginPage.expectLoginSuccess("SUPER_ADMIN");

    // Navigate to Global Announcements
    await page.goto("/super-admin/broadcasts");
    await expect(page.getByText("Global Platform Broadcasts")).toBeVisible();
    await expect(page.getByText("Compose Broadcast Announcement")).toBeVisible();
    await expect(page.getByText("Live User Notification Preview")).toBeVisible();

    // Click quick template
    const templateButton = page.getByRole("button", { name: /Maintenance Window/i });
    await expect(templateButton).toBeVisible();
    await templateButton.click();

    // Verify preview is populated
    await expect(page.getByText("Scheduled System Maintenance Window").first()).toBeVisible();

    // Dispatch broadcast
    const dispatchButton = page.getByRole("button", { name: /Dispatch Broadcast Announcement/i });
    await expect(dispatchButton).toBeVisible();
    await dispatchButton.click();

    // Verify toast confirmation
    await expect(page.getByText(/Broadcast sent! Delivered to/i)).toBeVisible({ timeout: 10000 });

    // Verify history table contains the dispatched announcement
    await expect(page.getByText("Recent Global Broadcast Dispatch Log")).toBeVisible();
    await expect(page.locator("table tbody tr").first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Scheduled System Maintenance Window").first()).toBeVisible();
  });

  test("Tenant Admin: Composes and dispatches campus-wide broadcast announcement", async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password);
    await loginPage.expectLoginSuccess("ADMIN");

    // Navigate to Campus Broadcast Studio
    await page.goto("/admin/notifications/broadcast");
    await expect(page.getByText("Campus Broadcast Studio")).toBeVisible();
    await expect(page.getByText("Live Preview Simulation")).toBeVisible();

    const timestamp = Date.now().toString().slice(-4);
    const title = `Campus Exam Schedule Update ${timestamp}`;
    const message = `Midterm examinations will commence next Monday at 09:00 AM sharp.`;

    // Fill form
    await page.locator("#broadcast-title").fill(title);
    await page.locator("#broadcast-message").fill(message);

    // Verify live preview renders title and message
    await expect(page.getByText(title).first()).toBeVisible();
    await expect(page.getByText(message).first()).toBeVisible();

    // Dispatch announcement
    const submitButton = page.getByRole("button", { name: /Dispatch Broadcast Announcement/i });
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // Verify success and redirect to notifications center
    await expect(page.getByText(/Broadcast announcement dispatched successfully!/i)).toBeVisible({ timeout: 10000 });
    await page.waitForURL(/\/admin\/notifications/, { timeout: 10000 });

  });

  test("In-App Notification Center: Navigates via sidebar Notifications link to notification hub", async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password);
    await loginPage.expectLoginSuccess("ADMIN");

    // Click Notifications link in sidebar
    const notifSidebarLink = page.getByRole("link", { name: /Notifications/i });
    await expect(notifSidebarLink).toBeVisible();
    await notifSidebarLink.click();

    // Verify navigation to dedicated notifications hub
    await page.waitForURL(/\/admin\/notifications/, { timeout: 10000 });
    await expect(page.getByRole("heading", { name: /Campus Notifications & Alerts/i })).toBeVisible({ timeout: 5000 });
  });
});
