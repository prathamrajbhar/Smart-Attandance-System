import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../../base.page";

export class AdminDepartmentsPage extends BasePage {
  readonly addDepartmentButton: Locator;
  readonly searchInput: Locator;
  readonly departmentTable: Locator;
  readonly nameInput: Locator;
  readonly codeInput: Locator;
  readonly headInput: Locator;
  readonly descriptionInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addDepartmentButton = page.getByRole("button", { name: /Add Department/i });
    this.searchInput = page.getByPlaceholder(/Search departments/i);
    this.departmentTable = page.locator("table");
    this.nameInput = page.locator('input[name="name"]');
    this.codeInput = page.locator('input[name="code"]');
    this.headInput = page.locator('input[name="head"]');
    this.descriptionInput = page.locator('textarea[name="description"]');
    this.submitButton = page.getByRole("button", { name: /Create Department|Save Changes/i });
  }

  async goto(): Promise<void> {
    await this.page.goto("/admin/setup/departments");
    await this.waitForPageLoaded();
  }

  async goToAdd(): Promise<void> {
    await this.addDepartmentButton.click();
    await this.page.waitForURL(/\/admin\/setup\/departments\/create/, { timeout: 10000 });
  }

  async createDepartment(name: string, code: string, head?: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.codeInput.fill(code);
    if (head) await this.headInput.fill(head);
    await this.submitButton.click();
  }

  async expectDepartmentInTable(nameOrCode: string): Promise<void> {
    await expect(this.departmentTable.getByText(nameOrCode).first()).toBeVisible({ timeout: 10000 });
  }
}
