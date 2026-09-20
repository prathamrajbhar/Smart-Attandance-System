import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class TeacherOverviewPage extends BasePage {
  readonly greetingHeader: Locator;
  readonly refreshButton: Locator;
  readonly myClassesCard: Locator;
  readonly activeSessionsCard: Locator;
  readonly pendingReviewsCard: Locator;
  readonly startSessionButton: Locator;

  constructor(page: Page) {
    super(page);
    this.greetingHeader = page.locator("h1");
    this.refreshButton = page.getByRole("button", { name: /Refresh Console/i });
    this.myClassesCard = page.locator("main").getByText("My Classes").first();
    this.activeSessionsCard = page.locator("main").getByText("Active Sessions").first();
    this.pendingReviewsCard = page.locator("main").getByText("Pending Reviews").first();
    this.startSessionButton = page.getByRole("button", { name: /Start Session|Broadcast/i }).or(page.getByRole("link", { name: /Start Session/i }));
  }

  async goto(): Promise<void> {
    await this.page.goto("/teacher/dashboard");
    await this.waitForPageLoaded();
  }

  async refreshConsole(): Promise<void> {
    await this.refreshButton.click();
    await this.waitForPageLoaded();
  }

  async expectOverviewLoaded(): Promise<void> {
    await expect(this.myClassesCard).toBeVisible({ timeout: 10000 });
    await expect(this.activeSessionsCard).toBeVisible();
  }
}
