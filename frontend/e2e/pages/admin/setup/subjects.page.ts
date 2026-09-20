import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../../base.page";

export class AdminSubjectsPage extends BasePage {
  readonly addSubjectButton: Locator;
  readonly searchInput: Locator;
  readonly subjectTable: Locator;
  readonly nameInput: Locator;
  readonly codeInput: Locator;
  readonly descriptionInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addSubjectButton = page.getByRole("button", { name: /Add Subject/i });
    this.searchInput = page.getByPlaceholder(/Search subjects/i);
    this.subjectTable = page.locator("table");
    this.nameInput = page.locator('input[name="name"]');
    this.codeInput = page.locator('input[name="code"]');
    this.descriptionInput = page.locator('textarea[name="description"]');
    this.submitButton = page.getByRole("button", { name: /Create Subject|Save Changes/i });
  }

  async goto(): Promise<void> {
    await this.page.goto("/admin/setup/subjects");
    await this.waitForPageLoaded();
  }

  async goToAdd(): Promise<void> {
    await this.addSubjectButton.click();
    await this.page.waitForURL(/\/admin\/setup\/subjects\/create/, { timeout: 10000 });
  }

  async createSubject(name: string, code: string, description?: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.codeInput.fill(code);
    if (description) await this.descriptionInput.fill(description);
    await this.submitButton.click();
  }

  async expectSubjectInTable(nameOrCode: string): Promise<void> {
    await expect(this.subjectTable.getByText(nameOrCode).first()).toBeVisible({ timeout: 10000 });
  }
}
