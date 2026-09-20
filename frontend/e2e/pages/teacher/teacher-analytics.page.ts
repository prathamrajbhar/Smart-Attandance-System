import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class TeacherAnalyticsPage extends BasePage {
  readonly pageHeader: Locator;
  readonly classSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.getByRole("heading", { name: /Analytics/i });
    this.classSelect = page.locator("select").first();
  }

  async goto(): Promise<void> {
    await this.page.goto("/teacher/analytics");
    await this.waitForPageLoaded();
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.pageHeader).toBeVisible({ timeout: 10000 });
  }
}
