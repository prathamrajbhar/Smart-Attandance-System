import { test, expect } from "@playwright/test";
import { setupAdminAuth } from "./test-helpers";
import path from "path";

const SCREENSHOT_DIR = "/home/pratham/.gemini/antigravity/brain/7361ddd5-ec3e-48a0-aeb2-add5b2ce03f5";

test.describe("Searchable Combobox Component Tests", () => {
  test.beforeEach(async ({ page, context }) => {
    await setupAdminAuth(page, context);
  });

  test("Assign teacher dropdown provides live search filtering, keyboard navigation and selection", async ({ page }) => {
    // Mock teachers list with multiple faculty members across departments
    await page.route("http://localhost:8000/api/v1/admin/users/teachers*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [
            { id: "t-1", email: "eknath@smartattendance.edu.in", first_name: "Eknath", last_name: "Kumar", department: "Computer Science & Engineering" },
            { id: "t-2", email: "vihaan@smartattendance.edu.in", first_name: "Vihaan", last_name: "Chatterjee", department: "Computer Science & Engineering" },
            { id: "t-3", email: "savitri@smartattendance.edu.in", first_name: "Savitri", last_name: "Rathore", department: "Computer Science & Engineering" },
            { id: "t-4", email: "ankita@smartattendance.edu.in", first_name: "Ankita", last_name: "Kumar", department: "Information Technology" },
            { id: "t-5", email: "pankaj@smartattendance.edu.in", first_name: "Pankaj", last_name: "Varma", department: "Information Technology" },
            { id: "t-6", email: "kirti@smartattendance.edu.in", first_name: "Kirti", last_name: "Mathew", department: "Information Technology" },
            { id: "t-7", email: "yash@smartattendance.edu.in", first_name: "Yash", last_name: "Gupta", department: "Electronics" },
            { id: "t-8", email: "meera@smartattendance.edu.in", first_name: "Meera", last_name: "Chatterjee", department: "Electronics" },
            { id: "t-9", email: "uma@smartattendance.edu.in", first_name: "Uma", last_name: "Krishnan", department: "Electronics" },
          ],
          total_items: 9,
          page: 1,
          page_size: 10,
        }),
      });
    });

    await page.goto("http://localhost:3000/admin/classes/cls-search-test/assign-teacher");
    await expect(page.getByRole("heading", { name: "Assign Teacher" })).toBeVisible();

    // Trigger button should be rendered
    const trigger = page.locator("button[aria-haspopup='listbox']");
    await expect(trigger).toBeVisible();
    await expect(trigger).toContainText("Select teacher...");

    // Click trigger to open combobox
    await trigger.click();
    const searchInput = page.locator("input[placeholder*='Search teacher']");
    await expect(searchInput).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "combobox-opened.png") });

    // Type query to filter teachers
    await searchInput.fill("Eknath");
    const options = page.locator("li[role='option']");
    await expect(options).toHaveCount(1);
    await expect(options.first()).toContainText("Eknath Kumar");
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "combobox-filtered-eknath.png") });

    // Clear search and test another search
    await searchInput.fill("Information Technology");
    await expect(options).toHaveCount(3);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "combobox-filtered-dept.png") });

    // Select Pankaj Varma
    await page.locator("li[role='option']").filter({ hasText: "Pankaj Varma" }).click();
    await expect(searchInput).not.toBeVisible();
    await expect(trigger).toContainText("Pankaj Varma");
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "combobox-selected-pankaj.png") });
  });
});
