import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export interface StudentInput {
  email: string;
  enrollmentNumber: string;
  firstName: string;
  lastName: string;
  phone?: string;
  batch?: string;
}

export class AdminStudentsPage extends BasePage {
  readonly addStudentButton: Locator;
  readonly searchInput: Locator;
  readonly studentTable: Locator;
  readonly submitButton: Locator;
  readonly emailInput: Locator;
  readonly enrollmentInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly phoneInput: Locator;
  readonly batchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.addStudentButton = page.getByRole("link", { name: /Add Student|Add New/i }).or(page.getByRole("button", { name: /Add Student/i }));
    this.searchInput = page.locator("main").getByPlaceholder(/Search by name|Search/i);
    this.studentTable = page.locator("table");
    this.emailInput = page.locator('input[name="email"]');
    this.enrollmentInput = page.locator('input[name="enrollment_number"]');
    this.firstNameInput = page.locator('input[name="first_name"]');
    this.lastNameInput = page.locator('input[name="last_name"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.batchInput = page.locator('input[name="batch"]');
    this.submitButton = page.getByRole("button", { name: /Create Student|Save Changes/i });
  }

  async goto(): Promise<void> {
    await this.page.goto("/admin/users/students");
    await this.waitForPageLoaded();
  }

  async searchStudent(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(400);
  }

  async goToAddStudent(): Promise<void> {
    await this.addStudentButton.first().click();
    await this.page.waitForURL(/\/admin\/users\/students\/add/, { timeout: 10000 });
  }

  async fillAndSubmitStudent(data: StudentInput): Promise<void> {
    await this.emailInput.fill(data.email);
    await this.enrollmentInput.fill(data.enrollmentNumber);
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    if (data.phone) await this.phoneInput.fill(data.phone);
    if (data.batch) await this.batchInput.fill(data.batch);
    await this.submitButton.click();
  }

  async expectStudentInTable(nameOrEmail: string): Promise<void> {
    await expect(this.studentTable.getByText(nameOrEmail).first()).toBeVisible({ timeout: 10000 });
  }
}
