import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly formCard: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[name="email"], input[type="email"]');
    this.passwordInput = page.locator('input[name="password"], input[type="password"]');
    this.submitButton = page.getByRole("button", { name: /Sign In/i });
    this.forgotPasswordLink = page.getByRole("link", { name: /Forgot password\?/i });
    this.formCard = page.locator("form");
  }

  async goto(): Promise<void> {
    await this.page.goto("/login");
    await this.waitForPageLoaded();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectLoginSuccess(role: "ADMIN" | "TEACHER"): Promise<void> {
    const expectedUrl = role === "ADMIN" ? /\/admin\/dashboard/ : /\/teacher\/classes|\/teacher\/dashboard/;
    await this.page.waitForURL(expectedUrl, { timeout: 15000 });
  }

  async expectValidationError(messagePattern: RegExp | string): Promise<void> {
    const errorEl = this.page.getByText(messagePattern).first();
    await expect(errorEl).toBeVisible({ timeout: 5000 });
  }
}
