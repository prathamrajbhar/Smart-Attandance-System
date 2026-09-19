import { test, expect } from "@playwright/test";

test.describe("Password Recovery & Reset Flow with Dynamic Email Services", () => {
  test("Forgot password form validates input, sends instructions, and supports resend with cooldown", async ({
    page,
  }) => {
    let forgotPasswordRequestCount = 0;
    let requestedEmail = "";

    await page.route("http://localhost:8000/api/v1/auth/forgot-password", async (route) => {
      forgotPasswordRequestCount++;
      const body = route.request().postDataJSON();
      requestedEmail = body?.email;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: "success",
          message: "If the email is registered, a password reset link has been dispatched.",
        }),
      });
    });

    // 1. Visit forgot password page
    await page.goto("/forgot-password");
    await expect(page.locator("h1:has-text('Smart Attendance')")).toBeVisible();
    await expect(page.locator("h2:has-text('Forgot Password?')")).toBeVisible();
    await page.screenshot({ path: "screenshots/auth-forgot-password-initial.png" });

    // 2. Validate empty email error
    await page.getByRole("button", { name: /send reset link/i }).click();
    await expect(page.getByText("Email address is required")).toBeVisible();

    // 3. Fill email and submit
    await page.fill('input[type="email"]', "  admin@smartattendance.edu.in  ");
    await page.getByRole("button", { name: /send reset link/i }).click();

    // 4. Verify trimmed submission
    await expect(page.locator("h2:has-text('Check Your Inbox')")).toBeVisible();
    expect(requestedEmail).toBe("admin@smartattendance.edu.in");
    expect(forgotPasswordRequestCount).toBe(1);
    await page.screenshot({ path: "screenshots/auth-forgot-password-submitted.png" });

    // 5. Verify Resend cooldown is active
    const resendBtn = page.getByRole("button", { name: /resend email in/i });
    await expect(resendBtn).toBeVisible();
    await expect(resendBtn).toBeDisabled();

    // 6. Test 'Use a different email'
    await page.getByText("Use a different email").click();
    await expect(page.locator("h2:has-text('Forgot Password?')")).toBeVisible();
    await expect(page.locator('input[type="email"]')).toHaveValue("admin@smartattendance.edu.in");
  });

  test("Reset password validates token, renders requirements checklist, and executes password update", async ({
    page,
  }) => {
    // 1. Invalid or missing token
    await page.goto("/reset-password");
    await expect(page.locator("h2:has-text('Invalid or Expired Link')")).toBeVisible();
    await page.screenshot({ path: "screenshots/auth-reset-password-invalid.png" });

    // 2. Valid token mock
    await page.route("http://localhost:8000/api/v1/auth/verify-token*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          valid: true,
          email: "teacher@university.edu",
          name: "Dr. Marie Curie",
          role: "TEACHER",
        }),
      });
    });

    let passwordResetPayload: { token: string; new_password: string } | null = null;
    await page.route("http://localhost:8000/api/v1/auth/reset-password", async (route) => {
      passwordResetPayload = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: "success",
          message: "Password reset successfully. You can now login with your new credentials.",
        }),
      });
    });

    await page.goto("/reset-password?token=secure-valid-token-777");
    await expect(page.locator("h2:has-text('Choose New Password')")).toBeVisible();
    await expect(page.getByText("Dr. Marie Curie (teacher@university.edu)")).toBeVisible();

    // Verify Password Security Requirements checklist renders
    await expect(page.getByText("At least 8 characters")).toBeVisible();
    await expect(page.getByText("Uppercase & lowercase letters")).toBeVisible();
    await expect(page.getByText("At least one number (0-9)")).toBeVisible();
    await expect(page.getByText("At least one special symbol")).toBeVisible();

    // Fill new password
    const newPassInput = page.locator('input[type="password"]').first();
    const confirmPassInput = page.locator('input[type="password"]').nth(1);

    await newPassInput.fill("StrongPass99!");
    await confirmPassInput.fill("StrongPass99!");
    await page.screenshot({ path: "screenshots/auth-reset-password-valid.png" });

    // Submit form
    await page.getByRole("button", { name: /update password/i }).click();

    // Verify completion status card
    await expect(page.locator("h2:has-text('Password Updated!')")).toBeVisible();
    expect(passwordResetPayload).toEqual({
      token: "secure-valid-token-777",
      new_password: "StrongPass99!",
    });
    await page.screenshot({ path: "screenshots/auth-reset-password-success.png" });
  });
});
