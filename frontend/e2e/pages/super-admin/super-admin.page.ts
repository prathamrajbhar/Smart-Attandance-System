import { Page, Locator, expect } from "@playwright/test";

export class SuperAdminPage {
  readonly page: Page;
  readonly provisionButton: Locator;
  readonly modalNameInput: Locator;
  readonly modalSlugInput: Locator;
  readonly modalAdminEmailInput: Locator;
  readonly modalAdminNameInput: Locator;
  readonly modalSubmitButton: Locator;
  readonly searchInput: Locator;
  readonly statusSelect: Locator;
  readonly typeSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.provisionButton = page.getByRole("button", { name: /Provision Institution/i });
    this.modalNameInput = page.locator("input[placeholder*='Oxford Public School'], input[placeholder*='Stanford Academy']");
    this.modalSlugInput = page.locator("input[placeholder*='oxford'], input[placeholder*='stanford-academy']");
    this.modalAdminNameInput = page.locator("input[placeholder*='John Doe']");
    this.modalAdminEmailInput = page.locator("input[placeholder*='principal@school.edu'], input[placeholder*='admin@institution.edu']");
    this.modalSubmitButton = page.locator("button[type='submit']:has-text('Save & Create Institution'), button[type='submit']:has-text('Provision Institution')");
    this.searchInput = page.locator("input[placeholder*='Search by institution name']");
    this.statusSelect = page.locator("select").first();
    this.typeSelect = page.locator("select").nth(1);
  }

  async gotoDashboard(): Promise<void> {
    await this.page.goto("/super-admin/dashboard");
    await this.page.waitForLoadState("networkidle");
  }

  async gotoTenants(): Promise<void> {
    await this.page.goto("/super-admin/tenants");
    await this.page.waitForLoadState("networkidle");
  }

  async openProvisionModal(): Promise<void> {
    await this.provisionButton.first().click();
    await expect(this.modalSubmitButton).toBeVisible();
  }

  async fillAndProvisionTenant(data: {
    name: string;
    slug: string;
    adminEmail: string;
    adminName: string;
  }): Promise<void> {
    await this.modalNameInput.fill(data.name);
    await this.modalSlugInput.fill(data.slug);
    await this.modalAdminNameInput.fill(data.adminName);
    await this.modalAdminEmailInput.fill(data.adminEmail);
    await this.modalSubmitButton.click();
  }

  async toggleTenantStatus(tenantName: string): Promise<void> {
    const row = this.page.locator("tr", { hasText: tenantName });
    const toggleBtn = row.locator("button", { hasText: /Suspend|Activate/i });
    await toggleBtn.click();
  }
}
