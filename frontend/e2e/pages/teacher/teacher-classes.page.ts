import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class TeacherClassesPage extends BasePage {
  readonly pageHeader: Locator;
  readonly classCards: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.getByRole("heading", { name: /My Classes/i });
    this.classCards = page.locator(".rounded-2xl, .bg-card");
  }

  async goto(): Promise<void> {
    await this.page.goto("/teacher/classes");
    await this.waitForPageLoaded();
  }

  async expectClassesLoaded(): Promise<void> {
    await expect(this.pageHeader).toBeVisible({ timeout: 10000 });
  }

  async openClassDetailByIndex(index = 0): Promise<void> {
    const card = this.page.getByRole("heading", { level: 3 }).nth(index);
    await card.click();
    await this.waitForPageLoaded();
  }
}
