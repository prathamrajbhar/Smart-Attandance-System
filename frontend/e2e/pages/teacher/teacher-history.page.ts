import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class TeacherHistoryPage extends BasePage {
  readonly pageHeader: Locator;
  readonly searchInput: Locator;
  readonly historyTable: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.getByRole("heading", { name: /Attendance Session Logs/i });
    this.searchInput = page.getByPlaceholder(/Search by class, subject/i);
    this.historyTable = page.locator("table");
  }

  async goto(): Promise<void> {
    await this.page.goto("/teacher/history");
    await this.waitForPageLoaded();
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.pageHeader).toBeVisible({ timeout: 10000 });
  }
}
