import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class BulkImportComponent extends BasePage {
  readonly modal: Locator;
  readonly fileInput: Locator;
  readonly commitButton: Locator;
  readonly sampleCsvButton: Locator;
  readonly sendInviteCheckbox: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.modal = page.getByRole("dialog").or(page.locator(".fixed.inset-0.z-50"));
    this.fileInput = page.locator('input[type="file"]');
    this.commitButton = page.getByRole("button", { name: /Commit Import/i });
    this.sampleCsvButton = page.getByRole("button", { name: /Download Sample CSV/i });
    this.sendInviteCheckbox = page.getByRole("checkbox");
    this.closeButton = page.locator('button:has(svg.lucide-x)');
  }

  async uploadCsvContent(fileName: string, content: string): Promise<void> {
    const buffer = Buffer.from(content, "utf-8");
    await this.fileInput.setInputFiles({
      name: fileName,
      mimeType: "text/csv",
      buffer,
    });
  }

  async expectPreviewLoaded(recordCount: number): Promise<void> {
    await expect(this.page.getByText(new RegExp(`Commit Import \\(${recordCount} records`, "i"))).toBeVisible({ timeout: 10000 });
  }

  async commitImport(): Promise<void> {
    await this.commitButton.click();
    await expect(this.page.getByText(/Import Ingestion Report|Completed|Success/i).first()).toBeVisible({ timeout: 15000 });
  }
}
