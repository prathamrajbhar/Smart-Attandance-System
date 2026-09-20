import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../../base.page";

export class AdminVerificationSettingsPage extends BasePage {
  readonly faceRecognitionSwitch: Locator;
  readonly gpsSwitch: Locator;
  readonly aiBackgroundSwitch: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.faceRecognitionSwitch = page.getByRole("switch", { name: /Toggle Face Recognition/i });
    this.gpsSwitch = page.getByRole("switch", { name: /Toggle GPS Geofencing/i });
    this.aiBackgroundSwitch = page.getByRole("switch", { name: /Toggle AI Background Validation/i });
    this.saveButton = page.getByRole("button", { name: /Save Configuration|Saving Changes/i });
  }

  async goto(): Promise<void> {
    await this.page.goto("/admin/setup/verification-settings");
    await this.waitForPageLoaded();
  }

  async toggleFaceRecognition(): Promise<void> {
    await this.faceRecognitionSwitch.click();
  }

  async toggleGps(): Promise<void> {
    await this.gpsSwitch.click();
  }

  async toggleAiBackground(): Promise<void> {
    await this.aiBackgroundSwitch.click();
  }

  async saveConfiguration(): Promise<void> {
    await this.saveButton.click();
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.saveButton).toBeVisible({ timeout: 10000 });
  }
}
