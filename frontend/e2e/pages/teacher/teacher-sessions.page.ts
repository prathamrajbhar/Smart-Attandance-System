import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class TeacherSessionsPage extends BasePage {
  readonly classSelect: Locator;
  readonly durationInput: Locator;
  readonly startSessionButton: Locator;
  readonly activeSessionsCard: Locator;
  readonly pastSessionsTable: Locator;

  constructor(page: Page) {
    super(page);
    this.classSelect = page.locator("select").first();
    this.durationInput = page.getByLabel(/Duration/i);
    this.startSessionButton = page.getByRole("button", { name: /Start Session/i });
    this.activeSessionsCard = page.getByText(/Active Sessions/i);
    this.pastSessionsTable = page.getByText(/Past Sessions|Recent Course Sessions/i);
  }

  async goto(): Promise<void> {
    await this.page.goto("/teacher/sessions");
    await this.waitForPageLoaded();
  }

  async startNewSession(durationMinutes = 15): Promise<void> {
    const options = await this.classSelect.locator("option").all();
    if (options.length > 1) {
      const val = await options[1].getAttribute("value");
      if (val) await this.classSelect.selectOption(val);
    }
    await this.durationInput.fill(String(durationMinutes));
    await this.startSessionButton.click();
    await this.waitForPageLoaded();
  }

  async goToManualAttendance(sessionId: string): Promise<void> {
    await this.page.goto(`/teacher/sessions/${sessionId}/manual`);
    await this.waitForPageLoaded();
  }

  async markAllStudentsPresent(): Promise<void> {
    const markAllBtn = this.page.getByRole("button", { name: /All Present|Present/i });
    if (await markAllBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await markAllBtn.click();
    }
  }

  async submitManualAttendance(): Promise<void> {
    const submitBtn = this.page.getByRole("button", { name: /Save & Commit Attendance|Save & Commit|Submit/i });
    await submitBtn.click();
  }
}
