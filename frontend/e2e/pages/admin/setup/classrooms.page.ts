import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../../base.page";

export class AdminClassroomsPage extends BasePage {
  readonly addClassroomButton: Locator;
  readonly searchInput: Locator;
  readonly classroomTable: Locator;
  readonly nameInput: Locator;
  readonly buildingInput: Locator;
  readonly capacityInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addClassroomButton = page.getByRole("button", { name: /Add Classroom/i });
    this.searchInput = page.getByPlaceholder(/Search classrooms/i);
    this.classroomTable = page.locator("table");
    this.nameInput = page.locator('input[name="name"]');
    this.buildingInput = page.locator('input[name="building"]');
    this.capacityInput = page.locator('input[name="capacity"]');
    this.submitButton = page.getByRole("button", { name: /Create Classroom|Save Changes/i });
  }

  async goto(): Promise<void> {
    await this.page.goto("/admin/setup/classrooms");
    await this.waitForPageLoaded();
  }

  async goToAdd(): Promise<void> {
    await this.addClassroomButton.click();
    await this.page.waitForURL(/\/admin\/setup\/classrooms\/create/, { timeout: 10000 });
  }

  async createClassroom(name: string, building?: string, capacity?: string): Promise<void> {
    await this.nameInput.fill(name);
    if (building) await this.buildingInput.fill(building);
    if (capacity) await this.capacityInput.fill(capacity);
    await this.submitButton.click();
  }

  async expectClassroomInTable(name: string): Promise<void> {
    await expect(this.classroomTable.getByText(name).first()).toBeVisible({ timeout: 10000 });
  }
}
