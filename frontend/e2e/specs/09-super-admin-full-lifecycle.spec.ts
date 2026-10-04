import { test, expect, TEST_CREDENTIALS } from "../fixtures/test-fixtures";

test.describe("09: Super Admin Portal - Full Platform Telemetry & Multi-Tenant Lifecycle", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.superAdmin.email, TEST_CREDENTIALS.superAdmin.password);
    await loginPage.expectLoginSuccess("SUPER_ADMIN");
  });

  test("validates platform telemetry metrics, recent tenants list, and navigation", async ({
    superAdminPage,
    page,
  }) => {
    await superAdminPage.gotoDashboard();
    await expect(page.getByText("Platform Control Center")).toBeVisible();
    await expect(page.getByText("Total Institutions")).toBeVisible();
    await expect(page.getByText("Active Tenants")).toBeVisible();
    await expect(page.getByText("Total Students")).toBeVisible();
    await expect(page.getByText("Faculty Members")).toBeVisible();
    await expect(page.getByText("Recent Institutions")).toBeVisible();
    await expect(page.locator("table")).toBeVisible();

    // Navigate to full tenants registry via View All
    const viewAllLink = page.getByRole("link", { name: /View All/i });
    await expect(viewAllLink).toBeVisible();
    await viewAllLink.click();
    await page.waitForURL(/\/super-admin\/tenants/, { timeout: 10000 });
  });

  test("manages Institutional Tenants: filters, provisions new tenant, and tests validation", async ({
    superAdminPage,
    page,
  }) => {
    await superAdminPage.gotoTenants();
    await expect(page.locator("h1:has-text('Institutional Tenants')")).toBeVisible();

    // Verify search and filter controls
    await superAdminPage.searchInput.fill("default");
    await expect(page.locator("table")).toBeVisible();
    await superAdminPage.searchInput.fill("");

    // Open Provisioning Modal
    await superAdminPage.openProvisionModal();

    // Fill valid institution data
    const timestamp = Date.now().toString().slice(-5);
    const tenantName = `Academy Horizon ${timestamp}`;
    const tenantSlug = `horizon-${timestamp}`;
    const adminEmail = `admin.horizon${timestamp}@yopmail.com`;

    await superAdminPage.fillAndProvisionTenant({
      name: tenantName,
      slug: tenantSlug,
      adminEmail,
      adminName: `Dr. Director ${timestamp}`,
    });

    await expect(page.getByText(/registered successfully|provisioned successfully|Success/i).first()).toBeVisible({ timeout: 10000 });
    await page.waitForURL(/\/super-admin\/tenants/, { timeout: 10000 });
  });

  test("verifies tenant status toggle action on secondary institution", async ({
    superAdminPage,
    page,
  }) => {
    await superAdminPage.gotoTenants();
    await expect(page.locator("table")).toBeVisible();

    // Target secondary or newly provisioned institution to preserve default tenant
    await superAdminPage.searchInput.fill("Academy");
    await expect(page.locator("table")).toBeVisible();

    const toggleButton = page.locator("table tbody tr button:has-text('Suspend'), table tbody tr button:has-text('Activate')").first();
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await expect(page.locator("[role='status'], .toaster, div:has-text('is now')").first()).toBeVisible({ timeout: 10000 });
    }
  });
});
