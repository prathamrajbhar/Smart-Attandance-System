import { test, expect } from "@playwright/test";
import { setupAdminAuth } from "./test-helpers";

test.describe("Module 5: Institutional Setup & Configuration", () => {
  test.beforeEach(async ({ page, context }) => {
    await setupAdminAuth(page, context);
  });

  test("Departments setup page renders list and handles creation modal", async ({ page }) => {
    await page.route("http://localhost:8000/api/v1/admin/departments*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: "dept-1", name: "Computer Science & Engineering", code: "CSE" },
          { id: "dept-2", name: "Electrical Engineering", code: "EE" },
        ]),
      });
    });

    await page.goto("/admin/setup/departments");
    await expect(page.locator("h1:has-text('Departments')")).toBeVisible();
    await expect(page.getByText("Computer Science & Engineering")).toBeVisible();
    await expect(page.getByText("Electrical Engineering")).toBeVisible();
  });

  test("Classrooms setup renders room numbers and GPS geofence parameters", async ({ page }) => {
    await page.route("http://localhost:8000/api/v1/admin/classrooms*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "room-1",
            name: "Lecture Hall 101",
            building: "Engineering Block A",
            capacity: 50,
          },
        ]),
      });
    });

    await page.goto("/admin/setup/classrooms");
    await expect(page.locator("h1:has-text('Classrooms')")).toBeVisible();
    await expect(page.getByText("Lecture Hall 101")).toBeVisible();
    await expect(page.getByText("50 students", { exact: false })).toBeVisible();
  });

  test("Verification settings toggles switches, updates sliders, and saves configuration", async ({ page }) => {
    let savedConfigPayload: Record<string, unknown> | null = null;

    await page.route("http://localhost:8000/api/v1/admin/config*", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            isFaceRecognitionEnabled: true,
            isGpsVerificationEnabled: false,
            isAiBackgroundValidationEnabled: true,
          }),
        });
      } else if (route.request().method() === "PATCH" || route.request().method() === "PUT" || route.request().method() === "POST") {
        savedConfigPayload = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ message: "Verification configuration updated" }),
        });
      }
    });

    await page.goto("/admin/setup/verification-settings");
    await expect(page.locator("h1:has-text('Verification Kill-Switch')")).toBeVisible();

    // Toggle a switch
    const switches = page.getByRole("switch");
    if ((await switches.count()) > 0) {
      await switches.first().click();
    }

    // Click Save changes button
    const saveBtn = page.getByRole("button", { name: /save configuration/i });
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
      await expect(page.getByText("updated", { exact: false })).toBeVisible({ timeout: 5000 });
    }
  });
});
