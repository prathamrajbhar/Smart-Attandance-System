import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export interface ClassInput {
  name: string;
  batch?: string;
  maxStudents?: string;
}

export class AdminClassesPage extends BasePage {
  readonly createClassButton: Locator;
  readonly searchInput: Locator;
  readonly classesTable: Locator;
  readonly classNameInput: Locator;
  readonly maxStudentsInput: Locator;
  readonly batchInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.createClassButton = page.getByRole("link", { name: /Create Class|Create/i }).or(page.getByRole("button", { name: /Create Class/i }));
    this.searchInput = page.locator("main").getByPlaceholder(/Search by class|Search/i);
    this.classesTable = page.locator("table");
    this.classNameInput = page.locator('input[name="name"]');
    this.maxStudentsInput = page.locator('input[name="max_students"]');
    this.batchInput = page.locator('input[name="batch"]');
    this.submitButton = page.getByRole("button", { name: /Create Class|Save Changes/i });
  }

  async goto(): Promise<void> {
    await this.page.goto("/admin/classes");
    await this.waitForPageLoaded();
  }

  async goToCreateClass(): Promise<void> {
    await this.createClassButton.first().click();
    await this.page.waitForURL(/\/admin\/classes\/create/, { timeout: 10000 });
  }

  async fillClassName(name: string): Promise<void> {
    await this.classNameInput.fill(name);
  }

  async selectTeacherByIndex(index = 0): Promise<void> {
    const teacherBtn = this.page.getByRole("button", { name: /Select Teacher/i }).first();
    await teacherBtn.click();
    await this.page.waitForTimeout(200);
    const options = this.page.getByRole("option").filter({ hasNotText: /Select Teacher/i });
    if ((await options.count()) > index) {
      await options.nth(index).click();
    }
    await this.page.waitForTimeout(200);
  }

  async selectSubjectByIndex(index = 0): Promise<void> {
    const subjectBtn = this.page.getByRole("button", { name: /Select Subject/i }).first();
    if (await subjectBtn.isVisible().catch(() => false)) {
      await subjectBtn.click();
      await this.page.waitForTimeout(200);
      const options = this.page.getByRole("option").filter({ hasNotText: /Select Subject/i });
      if ((await options.count()) > index) {
        await options.nth(index).click();
        await this.page.waitForTimeout(200);
        return;
      }
    }
    const subjectSelect = this.page.locator("#subject, select#subject");
    if (await subjectSelect.isVisible().catch(() => false)) {
      const validOptions = await subjectSelect.locator("option").all();
      let foundIndex = 0;
      for (const opt of validOptions) {
        const val = await opt.getAttribute("value");
        if (val && val.length > 0) {
          if (foundIndex === index) {
            await subjectSelect.selectOption(val);
            return;
          }
          foundIndex++;
        }
      }
    }
  }

  async submitClassForm(): Promise<void> {
    await this.submitButton.click();
  }

  async expectClassInTable(className: string): Promise<void> {
    await expect(this.classesTable.getByText(className).first()).toBeVisible({ timeout: 10000 });
  }
}
