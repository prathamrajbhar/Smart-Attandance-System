import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../../base.page";

export class AdminDesignationsPage extends BasePage {
  readonly addDesignationButton: Locator;
  readonly searchInput: Locator;
  readonly designationTable: Locator;
  readonly nameInput: Locator;
  readonly codeInput: Locator;
  readonly descriptionInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addDesignationButton = page.getByRole("button", { name: /Add Designation/i });
    this.searchInput = page.getByPlaceholder(/Search designations/i);
    this.designationTable = page.locator("table");
    this.nameInput = page.locator('input[name="name"]');
    this.codeInput = page.locator('input[name="code"]');
    this.descriptionInput = page.locator('textarea[name="description"]');
    this.submitButton = page.getByRole("button", { name: /Create Designation|Save Changes/i });
  }

  async goto(): Promise<void> {
    await this.page.goto("/admin/setup/designations");
    await this.waitForPageLoaded();
  }

  async goToAdd(): Promise<void> {
    await this.addDesignationButton.click();
    await this.page.waitForURL(/\/admin\/setup\/designations\/create/, { timeout: 10000 });
  }

  async createDesignation(name: string, code: string, description?: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.codeInput.fill(code);
    if (description) await this.descriptionInput.fill(description);
    await this.submitButton.click();
  }

  async expectDesignationInTable(nameOrCode: string): Promise<void> {
    await expect(this.designationTable.getByText(nameOrCode).first()).toBeVisible({ timeout: 10000 });
  }
}
