import { test, expect } from "@playwright/test";

const ADMIN_STORAGE = JSON.stringify({
  state: {
    token: "mock-admin-token",
    isAuthenticated: true,
    user: {
      id: "admin-123",
      email: "admin@university.edu",
      role: "ADMIN",
      first_name: "System",
      last_name: "Admin",
      requires_password_change: false,
    },
  },
  version: 0,
});

const TEACHER_STORAGE = JSON.stringify({
  state: {
    token: "mock-teacher-token",
    isAuthenticated: true,
    user: {
      id: "teacher-123",
      email: "teacher@university.edu",
      role: "TEACHER",
      first_name: "Sarah",
      last_name: "Connor",
      requires_password_change: false,
    },
  },
  version: 0,
});

test.describe("Authentication and Public Views", () => {
  test("Login page loads with clean enterprise light styling", async ({ page }) => {
    await page.goto("/login");

    await expect(page.locator("h1")).toContainText("Smart Attendance");
    await expect(page.locator("h2")).toContainText("Sign In");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();

    const bodyBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).not.toBe("rgb(0, 0, 0)");
  });

  test("Forgot password page renders correctly", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page.locator("h1")).toContainText("Smart Attendance");
    await expect(page.locator("h2")).toContainText("Forgot Password?");
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test("Reset password page displays token validation state", async ({ page }) => {
    await page.route("**/api/auth/verify-token*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ valid: true }),
      });
    });

    await page.goto("/reset-password?token=sample-test-token");
    await expect(page.locator("h1")).toContainText("Smart Attendance");
    await expect(page.locator("h2")).toContainText("Set New Password");
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });
});

test.describe("Admin Experience - Authenticated", () => {
  test.beforeEach(async ({ page, context }) => {
    await page.goto("/login");
    await page.evaluate((val) => {
      document.cookie = `sas-auth-storage=${encodeURIComponent(val)}; path=/; max-age=604800; SameSite=Lax`;
    }, ADMIN_STORAGE);
    await context.addCookies([
      {
        name: "sas-auth-storage",
        value: encodeURIComponent(ADMIN_STORAGE),
        domain: "localhost",
        path: "/",
      },
    ]);
  });

  test("Admin dashboard layout and metrics render in light theme", async ({ page }) => {
    await page.route("**/api/admin/stats", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          studentCount: 1250,
          teacherCount: 48,
          classCount: 32,
        }),
      });
    });

    await page.route("**/api/health", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: "healthy",
          aiService: "operational",
          database: "connected",
        }),
      });
    });

    await page.route("**/api/admin/audit", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });

    await page.route("**/api/admin/config", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          isAiFaceValidationEnabled: true,
          isAiLivenessValidationEnabled: true,
        }),
      });
    });

    await page.goto("/admin/dashboard");
    await expect(page.locator("h1")).toContainText("Admin");
    await expect(page.getByText("Total Students")).toBeVisible();
  });

  test("Admin students directory renders modern data table", async ({ page }) => {
    await page.route("**/api/admin/users/students", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "s-1",
            email: "student1@univ.edu",
            enrollment_number: "EN2024001",
            first_name: "Alice",
            last_name: "Smith",
          },
        ]),
      });
    });

    await page.goto("/admin/users/students");
    await expect(page.locator("h1")).toContainText("Student Directory");
    await expect(page.getByText("student1@univ.edu")).toBeVisible();
    await expect(page.getByText("EN2024001")).toBeVisible();
  });
});

test.describe("Teacher Experience - Authenticated", () => {
  test.beforeEach(async ({ page, context }) => {
    await page.goto("/login");
    await page.evaluate((val) => {
      document.cookie = `sas-auth-storage=${encodeURIComponent(val)}; path=/; max-age=604800; SameSite=Lax`;
    }, TEACHER_STORAGE);
    await context.addCookies([
      {
        name: "sas-auth-storage",
        value: encodeURIComponent(TEACHER_STORAGE),
        domain: "localhost",
        path: "/",
      },
    ]);
  });

  test("Teacher classes and session control pages render", async ({ page }) => {
    await page.route("**/api/teacher/my-classes", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "c-101",
            name: "CS101 Intro to AI",
            subject: "Computer Science",
            department_name: "Engineering",
            enrolled_student_count: 45,
          },
        ]),
      });
    });

    await page.route("**/api/teacher/sessions/all", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });

    await page.goto("/teacher/classes");
    await expect(page.locator("h1")).toContainText("My Classes");
    await expect(page.getByText("CS101 Intro to AI")).toBeVisible();

    await page.goto("/teacher/sessions");
    await expect(page.locator("h1")).toContainText("Session Control");
    await expect(page.getByText("Start New Session")).toBeVisible();
  });
});
