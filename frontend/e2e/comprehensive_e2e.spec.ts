import { test, expect } from "@playwright/test";

test.describe("Comprehensive End-to-End System Tests", () => {
  test("Super Admin Portal: Login, metrics, and institution management", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"], input[name="email"]', "superadmin@yopmail.com");
    await page.fill('input[type="password"], input[name="password"]', "SuperAdmin@123");
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/super-admin/, { timeout: 15000 });
    await expect(page.locator("text=Ganpat University (UVPCE)").first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=ACTIVE").first()).toBeVisible();
  });

  test("Tenant Admin Portal: Dashboard metrics display correctly", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"], input[name="email"]', "admin_uvpce@yopmail.com");
    await page.fill('input[type="password"], input[name="password"]', "Password123!");
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/admin/, { timeout: 15000 });
    await expect(page.locator("text=Total Students").first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=Total Faculty").first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=462").first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=144").first()).toBeVisible({ timeout: 15000 });
  });

  test("Tenant Admin: Students Directory displays students with badges", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"], input[name="email"]', "admin_uvpce@yopmail.com");
    await page.fill('input[type="password"], input[name="password"]', "Password123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/, { timeout: 15000 });

    await page.goto("/admin/users/students");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Student & Access Management").first()).toBeVisible({ timeout: 15000 });

    // Verify table has rows and search works
    const searchInput = page.locator('main input[type="text"]:not([readonly])').first();
    await searchInput.fill("22012011135");
    await expect(page.locator("text=22012011135").first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=Krish Mukeshkumar Patel").first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator("table tbody").locator("text=Computer Engineering").first()).toBeVisible({ timeout: 15000 });
  });

  test("Tenant Admin: Faculty Directory displays faculty with rank and department", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"], input[name="email"]', "admin_uvpce@yopmail.com");
    await page.fill('input[type="password"], input[name="password"]', "Password123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/, { timeout: 15000 });

    await page.goto("/admin/users/teachers");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Faculty & Staff Directory").first()).toBeVisible({ timeout: 15000 });

    // Search for Vijaykumar Patel
    const searchInput = page.locator('main input[type="text"]:not([readonly])').first();
    await searchInput.fill("Vijaykumar");
    await expect(page.locator("text=Vijaykumar Patel").first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=Professor").first()).toBeVisible({ timeout: 15000 });
  });

  test("Tenant Admin: Departments and Subjects setup properly populated", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"], input[name="email"]', "admin_uvpce@yopmail.com");
    await page.fill('input[type="password"], input[name="password"]', "Password123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/, { timeout: 15000 });

    // Departments
    await page.goto("/admin/setup/departments");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Computer Engineering").first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=Electronics & Communication").first()).toBeVisible({ timeout: 15000 });

    // Subjects
    await page.goto("/admin/setup/subjects");
    await page.waitForLoadState("networkidle");
    const searchInput = page.locator('main input[type="text"]:not([readonly])').first();
    await searchInput.fill("2BSC1101");
    await expect(page.locator("text=Mathematics - I").first()).toBeVisible({ timeout: 15000 });
  });

  test("Tenant Admin: Classrooms & Academic Classes setup properly populated", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"], input[name="email"]', "admin_uvpce@yopmail.com");
    await page.fill('input[type="password"], input[name="password"]', "Password123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/, { timeout: 15000 });

    // Classrooms
    await page.goto("/admin/setup/classrooms");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Room 001").first()).toBeVisible({ timeout: 15000 });

    // Academic Classes
    await page.goto("/admin/classes");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Mathematics I").first()).toBeVisible({ timeout: 15000 });
  });

  test("Teacher Portal: Classes and Sessions viewable", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"], input[name="email"]', "vijay.patel@yopmail.com");
    await page.fill('input[type="password"], input[name="password"]', "Password123!");
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/teacher/, { timeout: 15000 });
    await expect(page.locator("text=Mathematics I").first()).toBeVisible({ timeout: 15000 });
  });

  test("Student Portal: Web guardrail and Direct API Verification", async ({ page, request }) => {
    // 1. Web guardrail
    await page.goto("/login");
    await page.fill('input[type="email"], input[name="email"]', "22012011135@yopmail.com");
    await page.fill('input[type="password"], input[name="password"]', "Password123!");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Mobile App").first()).toBeVisible({ timeout: 15000 });

    // 2. Direct API
    const loginRes = await request.post("http://localhost:8000/api/v1/auth/login", {
      data: {
        email: "22012011135@yopmail.com",
        password: "Password123!",
      },
    });
    expect(loginRes.ok()).toBeTruthy();
    const tokenData = await loginRes.json();
    expect(tokenData.role).toBe("STUDENT");

    const meRes = await request.get("http://localhost:8000/api/v1/auth/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    expect(meRes.ok()).toBeTruthy();
    const me = await meRes.json();
    expect(me.student_profile?.enrollment_number).toBe("22012011135");
  });
});
