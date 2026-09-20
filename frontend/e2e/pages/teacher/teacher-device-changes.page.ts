import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class TeacherDeviceChangesPage extends BasePage {
  readonly pageHeader: Locator;
  readonly refreshButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.getByRole("heading", { name: /Device Change Requests/i });
    this.refreshButton = page.getByRole("button", { name: /Refresh/i });
  }

  async goto(): Promise<void> {
    await this.page.goto("/teacher/device-changes");
    await this.waitForPageLoaded();
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.pageHeader).toBeVisible({ timeout: 10000 });
  }
}
