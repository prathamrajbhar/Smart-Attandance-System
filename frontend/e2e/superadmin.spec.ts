import { test, expect } from "@playwright/test";

test.describe("Super Admin Platform Operations", () => {
  test("Super Admin can log in and view institutions", async ({ page }) => {
    // 1. Visit Login Page
    await page.goto("/login");
    await expect(page).toHaveTitle(/Smart Attendance/i);

    // 2. Fill credentials
    await page.fill('input[type="email"], input[name="email"]', "superadmin@yopmail.com");
    await page.fill('input[type="password"], input[name="password"]', "SuperAdmin@123");
    await page.click('button[type="submit"]');

    // 3. Wait for navigation to Super Admin portal
    await page.waitForURL(/\/super-admin/, { timeout: 15000 });
    await expect(page.locator("text=Ganpat University (UVPCE)")).toBeVisible({ timeout: 15000 });

    // 4. Verify institution status badge and details
    const institutionCard = page.locator("text=Ganpat University (UVPCE)").first();
    await expect(institutionCard).toBeVisible();
    await expect(page.locator("text=ACTIVE").first()).toBeVisible();
  });
});
