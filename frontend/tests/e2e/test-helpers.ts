import { Page, BrowserContext, expect } from "@playwright/test";

export const MOCK_ADMIN_USER = {
  id: "admin-uuid-001",
  email: "admin@university.edu",
  role: "ADMIN",
  first_name: "Alexander",
  last_name: "Wright",
  must_change_password: false,
};

export const MOCK_TEACHER_USER = {
  id: "teacher-uuid-001",
  email: "sarah.connor@university.edu",
  role: "TEACHER",
  first_name: "Sarah",
  last_name: "Connor",
  must_change_password: false,
  teacher_profile: {
    first_name: "Sarah",
    last_name: "Connor",
    employee_id: "EMP-2026-99",
  },
};

export function createAuthStorage(user: typeof MOCK_ADMIN_USER | typeof MOCK_TEACHER_USER, token = "mock-jwt-token"): string {
  return JSON.stringify({
    state: {
      token,
      user,
      isAuthenticated: true,
      isHydrated: true,
    },
    version: 0,
  });
}

export async function setupAdminAuth(page: Page, context: BrowserContext): Promise<void> {
  const authPayload = createAuthStorage(MOCK_ADMIN_USER);
  await context.addCookies([
    {
      name: "sas-auth-storage",
      value: authPayload,
      url: "http://localhost:3000",
    },
  ]);

  await page.route("http://localhost:8000/api/v1/auth/login", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        access_token: "mock-jwt-token",
        token_type: "bearer",
        must_change_password: false,
      }),
    });
  });

  await page.route("http://localhost:8000/api/v1/auth/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_ADMIN_USER),
    });
  });

  await page.route("http://localhost:8000/api/v1/health", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status: "healthy", aiService: "operational", database: "connected" }),
    });
  });

  await page.route("http://localhost:8000/api/v1/admin/stats", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ studentCount: 145, teacherCount: 18, classCount: 12 }),
    });
  });

  await page.route("http://localhost:8000/api/v1/admin/config", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        isAiFaceValidationEnabled: true,
        isAiLivenessValidationEnabled: true,
        isGpsVerificationEnabled: true,
      }),
    });
  });

  await page.route("http://localhost:8000/api/v1/admin/audit*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: [
          {
            id: "audit-1",
            eventType: "STUDENT_LOGIN",
            severity: "INFO",
            actor: "admin@university.edu",
            target: "SYSTEM",
            description: "Administrator logged in from authenticated terminal",
            ip: "127.0.0.1",
            timestamp: new Date().toISOString(),
          },
        ],
        page: 1,
        page_size: 10,
        total_items: 1,
        total_pages: 1,
        has_next: false,
        has_prev: false,
      }),
    });
  });

  await page.route("http://localhost:8000/api/v1/admin/departments*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { id: "dept-1", name: "Computer Science & Engineering", code: "CSE" },
        { id: "dept-2", name: "Information Technology", code: "IT" },
      ]),
    });
  });

  await page.route("http://localhost:8000/api/v1/admin/subjects*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { id: "sub-1", name: "Distributed Computing", code: "CS401", department_id: "dept-1" },
        { id: "sub-2", name: "Database Systems", code: "CS302", department_id: "dept-1" },
      ]),
    });
  });

  await page.route("http://localhost:8000/api/v1/admin/classrooms*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { id: "room-1", name: "Lab 302", room_number: "302", capacity: 40 },
        { id: "room-2", name: "Lecture Hall A", room_number: "LH-A", capacity: 120 },
      ]),
    });
  });
}

export async function setupTeacherAuth(page: Page, context: BrowserContext): Promise<void> {
  const authPayload = createAuthStorage(MOCK_TEACHER_USER);
  await context.addCookies([
    {
      name: "sas-auth-storage",
      value: authPayload,
      url: "http://localhost:3000",
    },
  ]);

  await page.route("http://localhost:8000/api/v1/auth/login", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        access_token: "mock-teacher-jwt-token",
        token_type: "bearer",
        must_change_password: false,
      }),
    });
  });

  await page.route("http://localhost:8000/api/v1/auth/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_TEACHER_USER),
    });
  });

  await page.route("http://localhost:8000/api/v1/health", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status: "healthy" }),
    });
  });

  await page.route("http://localhost:8000/api/v1/teacher/attendance/flagged*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });
}

export async function navigateViaSidebar(page: Page, href: string): Promise<void> {
  const menuBtn = page.locator('button[aria-label="Toggle navigation menu"]');
  if (await menuBtn.isVisible()) {
    await menuBtn.click();
    await page.waitForTimeout(300);
  }
  const link = page.locator(`a[href="${href}"]`).first();
  await expect(link).toBeVisible({ timeout: 5000 });
  await link.click();
}
