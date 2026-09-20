import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class TeacherProfilePage extends BasePage {
  readonly pageHeader: Locator;
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly updatePasswordButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.getByRole("heading", { name: /Faculty Profile & Security/i });
    this.currentPasswordInput = page.getByLabel(/Current Password/i);
    this.newPasswordInput = page.getByLabel(/^New Password/i);
    this.confirmPasswordInput = page.getByLabel(/Confirm New Password/i);
    this.updatePasswordButton = page.getByRole("button", { name: /Update Password/i });
  }

  async goto(): Promise<void> {
    await this.page.goto("/teacher/profile");
    await this.waitForPageLoaded();
  }

  async expectProfileLoaded(): Promise<void> {
    await expect(this.pageHeader).toBeVisible({ timeout: 10000 });
  }
}
