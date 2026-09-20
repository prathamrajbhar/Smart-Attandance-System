import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class ForgotPasswordPage extends BasePage {
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly backToLoginLink: Locator;
  readonly resendButton: Locator;
  readonly successHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[name="email"], input[type="email"]');
    this.submitButton = page.getByRole("button", { name: /Send Reset Link/i });
    this.backToLoginLink = page.getByRole("link", { name: /Back to Sign In/i });
    this.resendButton = page.getByRole("button", { name: /Resend/i });
    this.successHeading = page.getByRole("heading", { name: /Check Your Inbox/i });
  }

  async goto(): Promise<void> {
    await this.page.goto("/forgot-password");
    await this.waitForPageLoaded();
  }

  async requestReset(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }

  async expectSubmissionConfirmation(email: string): Promise<void> {
    await expect(this.successHeading).toBeVisible({ timeout: 10000 });
    await expect(this.page.getByText(email)).toBeVisible();
  }
}
