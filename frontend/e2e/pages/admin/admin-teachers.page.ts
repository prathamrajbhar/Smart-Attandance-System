import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export interface TeacherInput {
  email: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  qualification?: string;
}

export class AdminTeachersPage extends BasePage {
  readonly addTeacherButton: Locator;
  readonly searchInput: Locator;
  readonly teachersTable: Locator;
  readonly submitButton: Locator;
  readonly emailInput: Locator;
  readonly employeeIdInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly phoneInput: Locator;
  readonly qualificationInput: Locator;

  constructor(page: Page) {
    super(page);
    this.addTeacherButton = page.getByRole("link", { name: /Add Teacher|Add New/i }).or(page.getByRole("button", { name: /Add Teacher/i }));
    this.searchInput = page.locator("main").getByPlaceholder(/Search by name|Search/i);
    this.teachersTable = page.locator("table");
    this.emailInput = page.locator('input[name="email"]');
    this.employeeIdInput = page.locator('input[name="employee_id"]');
    this.firstNameInput = page.locator('input[name="first_name"]');
    this.lastNameInput = page.locator('input[name="last_name"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.qualificationInput = page.locator('input[name="qualification"]');
    this.submitButton = page.getByRole("button", { name: /Create Teacher|Save Changes/i });
  }

  async goto(): Promise<void> {
    await this.page.goto("/admin/users/teachers");
    await this.waitForPageLoaded();
  }

  async searchTeacher(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(400);
  }

  async goToAddTeacher(): Promise<void> {
    await this.addTeacherButton.first().click();
    await this.page.waitForURL(/\/admin\/users\/teachers\/add/, { timeout: 10000 });
  }

  async selectDepartmentByIndex(index = 1): Promise<void> {
    const deptBtn = this.page.getByRole("button", { name: /Select Department/i });
    if (await deptBtn.isVisible().catch(() => false)) {
      await deptBtn.click();
      const options = this.page.getByRole("option");
      if ((await options.count()) > index) {
        await options.nth(index).click();
        return;
      }
    }
    const deptSelect = this.page.locator("select").first();
    const count = await deptSelect.locator("option").count();
    if (count > index) {
      await deptSelect.selectOption({ index });
    }
  }

  async selectDesignationByIndex(index = 1): Promise<void> {
    const desigBtn = this.page.getByRole("button", { name: /Select Designation/i });
    if (await desigBtn.isVisible().catch(() => false)) {
      await desigBtn.click();
      const options = this.page.getByRole("option");
      if ((await options.count()) > index) {
        await options.nth(index).click();
        return;
      }
    }
    const desigSelect = this.page.locator("select").nth(1);
    const count = await desigSelect.locator("option").count();
    if (count > index) {
      await desigSelect.selectOption({ index });
    }
  }

  async fillAndSubmitTeacher(data: TeacherInput): Promise<void> {
    await this.emailInput.fill(data.email);
    await this.employeeIdInput.fill(data.employeeId);
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.selectDepartmentByIndex(1);
    await this.selectDesignationByIndex(1);
    if (data.phone) await this.phoneInput.fill(data.phone);
    if (data.qualification) await this.qualificationInput.fill(data.qualification);
    await this.submitButton.click();
  }

  async expectTeacherInTable(nameOrEmail: string): Promise<void> {
    await expect(this.teachersTable.getByText(nameOrEmail).first()).toBeVisible({ timeout: 10000 });
  }
}
