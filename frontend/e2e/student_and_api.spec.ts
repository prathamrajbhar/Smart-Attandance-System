import { test, expect } from "@playwright/test";

test.describe("Student Authentication & Direct API Verification", () => {
  test("Student web login correctly informs user to use Mobile App", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"], input[name="email"]', "22012011135@yopmail.com");
    await page.fill('input[type="password"], input[name="password"]', "Password123!");
    await page.click('button[type="submit"]');

    // Should display notice instructing student to access via Mobile App
    await expect(page.locator("text=Mobile App").first()).toBeVisible({ timeout: 15000 });
  });

  test("Student API authenticates and retrieves profile with enrollment number", async ({ request }) => {
    // 1. Authenticate student via REST API
    const loginRes = await request.post("http://localhost:8000/api/v1/auth/login", {
      data: {
        email: "22012011135@yopmail.com",
        password: "Password123!",
      },
    });

    expect(loginRes.ok()).toBeTruthy();
    const tokenData = await loginRes.json();
    expect(tokenData.role).toBe("STUDENT");
    expect(tokenData.access_token).toBeDefined();

    // 2. Fetch student profile
    const profileRes = await request.get("http://localhost:8000/api/v1/auth/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    expect(profileRes.ok()).toBeTruthy();
    const profile = await profileRes.json();
    expect(profile.role).toBe("STUDENT");
    expect(profile.student_profile?.enrollment_number).toBe("22012011135");
  });
});
