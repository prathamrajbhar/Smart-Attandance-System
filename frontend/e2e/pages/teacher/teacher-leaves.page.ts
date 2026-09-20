import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class TeacherLeavesPage extends BasePage {
  readonly pageHeader: Locator;
  readonly searchInput: Locator;
  readonly leavesTable: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.getByRole("heading", { name: /Leave Requests/i });
    this.searchInput = page.getByPlaceholder(/Search by name or enrollment/i);
    this.leavesTable = page.locator("table");
  }

  async goto(): Promise<void> {
    await this.page.goto("/teacher/leaves");
    await this.waitForPageLoaded();
  }

  async expectLeavesPageLoaded(): Promise<void> {
    await expect(this.pageHeader).toBeVisible({ timeout: 10000 });
  }
}
