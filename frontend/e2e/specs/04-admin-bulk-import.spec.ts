import { test, expect, TEST_CREDENTIALS, generateYopmail } from "../fixtures/test-fixtures";

test.describe("04: Admin Portal - Bulk CSV Ingestion Workflows", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password);
    await loginPage.expectLoginSuccess("ADMIN");
  });

  test("executes student roster bulk CSV ingestion with @yopmail.com records", async ({
    bulkImportComponent,
    page,
  }) => {
    await page.goto("/admin/users/students");
    await page.getByRole("button", { name: /Bulk Import/i }).click();
    await page.getByRole("dialog").waitFor({ state: "visible", timeout: 5000 });

    const email1 = generateYopmail("bulk_student_1");
    const email2 = generateYopmail("bulk_student_2");
    const ts = Date.now().toString().slice(-5);

    const csvContent = [
      "email,enrollment_number,first_name,last_name,batch,phone",
      `${email1},EN${ts}1,Ananya,Patel,2024-2028,+919876543201`,
      `${email2},EN${ts}2,Rohan,Gupta,2024-2028,+919876543202`,
    ].join("\n");

    await bulkImportComponent.uploadCsvContent("students_test_roster.csv", csvContent);
    await bulkImportComponent.expectPreviewLoaded(2);

    // Verify preview table has parsed records
    await expect(page.getByText(email1)).toBeVisible();
    await expect(page.getByText(email2)).toBeVisible();

    // Commit import
    await bulkImportComponent.commitImport();
    await expect(page.getByText(/Import Ingestion Report|Completed|Success/i).first()).toBeVisible({ timeout: 15000 });
  });

  test("executes department bulk CSV upload and schema parsing", async ({
    page,
    bulkImportComponent,
  }) => {
    await page.goto("/admin/setup/departments");
    await page.getByRole("button", { name: /Import CSV/i }).click();

    const ts = Date.now().toString().slice(-4);
    const csvContent = [
      "name,code,head,description",
      `Bioinformatics E2E ${ts},BIO${ts},Dr. Bio Head,Computational biology`,
      `Robotics E2E ${ts},ROB${ts},Dr. Robot Head,Autonomous systems`,
    ].join("\n");

    await bulkImportComponent.uploadCsvContent("departments_test.csv", csvContent);
    await bulkImportComponent.expectPreviewLoaded(2);

    await bulkImportComponent.commitImport();
    await expect(page.getByText(/Import Ingestion Report|Completed|Success/i).first()).toBeVisible({ timeout: 15000 });
  });
});
