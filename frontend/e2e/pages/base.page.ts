import { Page, Locator, expect } from "@playwright/test";

export abstract class BasePage {
  readonly page: Page;
  readonly header: Locator;
  readonly sidebar: Locator;
  readonly toastMessage: Locator;
  readonly loader: Locator;
  readonly logoutButton: Locator;
  readonly commandPaletteTrigger: Locator;
  readonly systemSetupAccordionButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator("header");
    this.sidebar = page.locator("aside");
    this.toastMessage = page.locator("div[role='status'], .hot-toast, [data-hot-toast]");
    this.loader = page.getByText(/Authenticating|Loading|Fetching/i);
    this.logoutButton = page.getByTitle(/Sign out|Logout/i);
    this.commandPaletteTrigger = page.getByPlaceholder(/Search students, classes, sessions/i);
    this.systemSetupAccordionButton = page.getByRole("button", { name: /System Setup/i });
  }

  async waitForPageLoaded(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    if (await this.loader.first().isVisible({ timeout: 1500 }).catch(() => false)) {
      await this.loader.first().waitFor({ state: "hidden", timeout: 15000 }).catch(() => {});
    }
  }

  async navigateToSidebarItem(label: string | RegExp): Promise<void> {
    const link = this.sidebar.getByRole("link", { name: label });
    await link.waitFor({ state: "visible", timeout: 10000 });
    await link.click();
    await this.waitForPageLoaded();
  }

  async openSystemSetupAccordion(): Promise<void> {
    const isExpanded = await this.sidebar.getByRole("link", { name: "Departments" }).isVisible().catch(() => false);
    if (!isExpanded) {
      await this.systemSetupAccordionButton.click();
      await this.sidebar.getByRole("link", { name: "Departments" }).waitFor({ state: "visible", timeout: 5000 });
    }
  }

  async navigateToSetupItem(label: string | RegExp): Promise<void> {
    await this.openSystemSetupAccordion();
    const subLink = this.sidebar.getByRole("link", { name: label });
    await subLink.waitFor({ state: "visible", timeout: 5000 });
    await subLink.click();
    await this.waitForPageLoaded();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
    await this.page.waitForURL(/\/login/, { timeout: 10000 });
  }

  async expectToastMessage(messagePattern: RegExp | string): Promise<void> {
    const toast = this.page.getByText(messagePattern).first();
    await expect(toast).toBeVisible({ timeout: 8000 });
  }

  async confirmDialogAction(actionButtonLabel = "Confirm"): Promise<void> {
    const dialog = this.page.getByRole("dialog");
    await dialog.waitFor({ state: "visible", timeout: 5000 });
    await dialog.getByRole("button", { name: actionButtonLabel }).click();
  }
}
