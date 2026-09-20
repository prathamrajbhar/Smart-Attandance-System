import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class AdminAuditPage extends BasePage {
  readonly searchInput: Locator;
  readonly exportButton: Locator;
  readonly auditTable: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByPlaceholder(/Search audit trail by event, actor/i);
    this.exportButton = page.getByRole("button", { name: /Export Audit CSV|Exporting/i });
    this.auditTable = page.locator("table");
  }

  async goto(): Promise<void> {
    await this.page.goto("/admin/audit");
    await this.waitForPageLoaded();
  }

  async searchAudit(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(400);
  }

  async expectAuditPageLoaded(): Promise<void> {
    await expect(this.searchInput).toBeVisible({ timeout: 10000 });
  }
}
