import { test, expect } from "@playwright/test";

test.describe("Module 1: Authentication & Onboarding", () => {
  test("Login page form validation, network errors, and successful admin auth", async ({ page }) => {
    await page.goto("/login");

    // 1. Initial State Verification
    await expect(page.locator("h1:has-text('Smart Attendance')")).toBeVisible();
    await expect(page.locator("h2:has-text('Sign In')")).toBeVisible();
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitBtn = page.getByRole("button", { name: /sign in to dashboard/i });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // 2. Client-side Form Validation
    await submitBtn.click();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();

    await emailInput.fill("invalid-email-pattern");
    await passwordInput.fill("short");
    await submitBtn.click();
    await expect(page.getByText("Invalid email format")).toBeVisible();
    await expect(page.getByText("Minimum 8 characters")).toBeVisible();

    // 3. Network 401 Rejection Handling
    await page.route("http://localhost:8000/api/v1/auth/login", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ detail: "Invalid institutional credentials provided." }),
      });
    });

    await emailInput.fill("admin@university.edu");
    await passwordInput.fill("WrongPassword123!");
    await submitBtn.click();
    await expect(page.getByText("Invalid institutional credentials provided.")).toBeVisible({ timeout: 5000 });

    // 4. Successful Admin Login
    await page.route("http://localhost:8000/api/v1/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          access_token: "mock-valid-admin-jwt",
          token_type: "bearer",
          must_change_password: false,
        }),
      });
    });

    await page.route("http://localhost:8000/api/v1/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "admin-uuid",
          email: "admin@university.edu",
          role: "ADMIN",
          first_name: "Alexander",
          last_name: "Wright",
          must_change_password: false,
        }),
      });
    });

    await page.route("http://localhost:8000/api/v1/health", async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ status: "healthy" }) });
    });
    await page.route("http://localhost:8000/api/v1/admin/stats", async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ studentCount: 10, teacherCount: 2, classCount: 1 }) });
    });
    await page.route("http://localhost:8000/api/v1/admin/audit*", async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([]) });
    });
    await page.route("http://localhost:8000/api/v1/admin/config", async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ isAiFaceValidationEnabled: true }) });
    });

    await passwordInput.fill("CorrectAdminPassword123!");
    await submitBtn.click();
    await expect(page.locator("h1:has-text('Admin')")).toBeVisible({ timeout: 10000 });
  });

  test("Forgot password flow validates email and submits recovery request", async ({ page }) => {
    await page.goto("/forgot-password");

    await expect(page.locator("h1:has-text('Smart Attendance')")).toBeVisible();
    await expect(page.locator("h2:has-text('Forgot Password?')")).toBeVisible();

    const emailInput = page.locator('input[type="email"]');
    const sendBtn = page.getByRole("button", { name: /send reset link/i });
    await expect(emailInput).toBeVisible();

    // Validation
    await sendBtn.click();
    await expect(page.getByText("Email address is required")).toBeVisible();

    await emailInput.fill("notanemail");
    await sendBtn.click();
    await expect(page.getByText("Please enter a valid email address")).toBeVisible();

    // Mock successful password reset trigger
    await page.route("http://localhost:8000/api/v1/auth/forgot-password", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Recovery email dispatched." }),
      });
    });

    await emailInput.fill("teacher@university.edu");
    await sendBtn.click();
    await expect(page.getByText("Check Your Inbox", { exact: false })).toBeVisible({ timeout: 5000 });
  });

  test("Reset password validates matching passwords and confirms update", async ({ page }) => {
    await page.route("http://localhost:8000/api/v1/auth/verify-token*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ valid: true, email: "teacher@university.edu" }),
      });
    });

    await page.goto("/reset-password?token=valid-test-token-123");
    await expect(page.locator("h1:has-text('Smart Attendance')")).toBeVisible();
    await expect(page.locator("h2:has-text('Choose New Password')")).toBeVisible();

    const passInputs = page.locator('input[type="password"]');
    const newPass = passInputs.nth(0);
    const confirmPass = passInputs.nth(1);
    const updateBtn = page.getByRole("button", { name: /update password/i });

    // Validation mismatch
    await newPass.fill("SecurePass123!");
    await confirmPass.fill("MismatchPass456!");
    await updateBtn.click();
    await expect(page.getByText("Passwords do not match")).toBeVisible();

    // Mock reset success
    await page.route("http://localhost:8000/api/v1/auth/reset-password", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Password updated successfully." }),
      });
    });

    await confirmPass.fill("SecurePass123!");
    await updateBtn.click();
    await expect(page.locator("h2:has-text('Password Updated!')")).toBeVisible({ timeout: 5000 });
  });

  test("Onboarding view renders account setup workflow", async ({ page }) => {
    await page.route("http://localhost:8000/api/v1/auth/verify-token*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          valid: true,
          email: "student@university.edu",
          name: "New Student",
          role: "STUDENT",
        }),
      });
    });

    await page.goto("/onboarding?token=onboarding-token-456");
    await expect(page.locator("h1:has-text('Smart Attendance')")).toBeVisible();
    await expect(page.getByText("Activate Your Account")).toBeVisible();
    await expect(page.getByText("New Student")).toBeVisible();
  });
});
