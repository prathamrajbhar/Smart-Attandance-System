import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class ResetPasswordPage extends BasePage {
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly invalidTokenCard: Locator;

  constructor(page: Page) {
    super(page);
    this.passwordInput = page.locator('input[name="password"]');
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"]');
    this.submitButton = page.getByRole("button", { name: /Update Password/i });
    this.invalidTokenCard = page.getByText(/Invalid|Missing password reset token/i);
  }

  async gotoWithToken(token: string): Promise<void> {
    await this.page.goto(`/reset-password?token=${encodeURIComponent(token)}`);
    await this.waitForPageLoaded();
  }

  async gotoWithoutToken(): Promise<void> {
    await this.page.goto("/reset-password");
    await this.waitForPageLoaded();
  }

  async expectInvalidToken(): Promise<void> {
    await expect(this.invalidTokenCard.first()).toBeVisible({ timeout: 10000 });
  }
}
