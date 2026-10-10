import { test, expect } from "@playwright/test";

async function loginAsAdmin(page: any) {
  await page.goto("/login");
  await page.fill('input[type="email"], input[name="email"]', "admin_uvpce@yopmail.com");
  await page.fill('input[type="password"], input[name="password"]', "Password123!");
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/admin/, { timeout: 15000 });
}

test.describe("Tenant Admin Management Operations", () => {
  test("Admin can log in and view dashboard statistics", async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page.locator("text=Total Students").first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=Total Faculty").first()).toBeVisible({ timeout: 15000 });
  });

  test("Admin can view students directory", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/users/students");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Student & Access Management").first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator("table, [role='table']").first()).toBeVisible({ timeout: 15000 });
  });

  test("Admin can view faculty directory", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/users/teachers");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Faculty & Staff Directory").first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator("table, [role='table']").first()).toBeVisible({ timeout: 15000 });
  });

  test("Admin can view departments and subjects setup", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/setup/departments");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Computer Engineering").first()).toBeVisible({ timeout: 15000 });

    await page.goto("/admin/setup/subjects");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Subjects").first()).toBeVisible({ timeout: 15000 });
  });
});
