import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class TeacherReviewPage extends BasePage {
  readonly pageHeader: Locator;
  readonly searchInput: Locator;
  readonly reviewTable: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.getByRole("heading", { name: /Review Queue/i });
    this.searchInput = page.getByPlaceholder(/Search by name or enrollment/i);
    this.reviewTable = page.locator("table");
  }

  async goto(): Promise<void> {
    await this.page.goto("/teacher/review");
    await this.waitForPageLoaded();
  }

  async expectReviewQueueLoaded(): Promise<void> {
    await expect(this.pageHeader).toBeVisible({ timeout: 10000 });
  }
}
