import { test, expect } from "@playwright/test";

test.describe("Teacher Portal Operations", () => {
  test("Teacher can log in and view assigned academic classes", async ({ page }) => {
    // 1. Visit Login Page
    await page.goto("/login");

    // 2. Fill Teacher credentials
    await page.fill('input[type="email"], input[name="email"]', "vijay.patel@yopmail.com");
    await page.fill('input[type="password"], input[name="password"]', "Password123!");
    await page.click('button[type="submit"]');

    // 3. Wait for navigation to Teacher portal
    await page.waitForURL(/\/teacher/, { timeout: 15000 });

    // 4. Verify assigned class is visible
    await expect(page.locator("text=Mathematics I").first()).toBeVisible({ timeout: 15000 });
  });
});
