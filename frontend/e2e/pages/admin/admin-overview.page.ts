import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class AdminOverviewPage extends BasePage {
  readonly greetingHeader: Locator;
  readonly refreshButton: Locator;
  readonly totalStudentsCard: Locator;
  readonly totalFacultyCard: Locator;
  readonly configuredClassesCard: Locator;
  readonly biometricPassesCard: Locator;
  readonly configVerificationsLink: Locator;
  readonly auditActivityLink: Locator;
  readonly configClassesLink: Locator;
  readonly aiScannerLink: Locator;

  constructor(page: Page) {
    super(page);
    this.greetingHeader = page.locator("h1");
    this.refreshButton = page.getByRole("button", { name: /Refresh Status/i });
    this.totalStudentsCard = page.getByText(/Total Students/i);
    this.totalFacultyCard = page.getByText(/Total Faculty/i);
    this.configuredClassesCard = page.getByText(/Configured Classes/i);
    this.biometricPassesCard = page.getByText(/Biometric Passes/i);
    this.configVerificationsLink = page.getByRole("link", { name: /Configure Verifications/i });
    this.auditActivityLink = page.getByRole("link", { name: /Audit Activity Log/i });
    this.configClassesLink = page.getByRole("link", { name: /Configure Classes/i });
    this.aiScannerLink = page.getByRole("link", { name: /Execute AI Scanner/i });
  }

  async goto(): Promise<void> {
    await this.page.goto("/admin/dashboard");
    await this.waitForPageLoaded();
  }

  async refreshStatus(): Promise<void> {
    await this.refreshButton.click();
    await this.waitForPageLoaded();
  }

  async expectDashboardLoaded(): Promise<void> {
    await expect(this.totalStudentsCard).toBeVisible({ timeout: 10000 });
    await expect(this.totalFacultyCard).toBeVisible();
    await expect(this.configuredClassesCard).toBeVisible();
    await expect(this.configVerificationsLink).toBeVisible();
    await expect(this.aiScannerLink).toBeVisible();
  }
}
