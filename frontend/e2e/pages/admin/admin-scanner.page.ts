import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class AdminScannerPage extends BasePage {
  readonly runScanButton: Locator;
  readonly contaminationSlider: Locator;
  readonly searchFilterInput: Locator;
  readonly awaitingCard: Locator;

  constructor(page: Page) {
    super(page);
    this.runScanButton = page.getByRole("button", { name: /Run AI Anomaly Scan|Run Scan/i });
    this.contaminationSlider = page.locator("input[type='range']");
    this.searchFilterInput = page.getByPlaceholder(/Filter flagged students/i);
    this.awaitingCard = page.getByText(/System Awaiting Analysis|Evaluating Isolation Forest/i);
  }

  async goto(): Promise<void> {
    await this.page.goto("/admin/scanner");
    await this.waitForPageLoaded();
  }

  async triggerScan(): Promise<void> {
    await this.runScanButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  async expectScannerLoaded(): Promise<void> {
    await expect(this.runScanButton).toBeVisible({ timeout: 10000 });
  }
}
