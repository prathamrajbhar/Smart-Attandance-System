import { test, expect } from "@playwright/test";
import { setupTeacherAuth } from "./test-helpers";
import path from "path";

const SCREENSHOT_DIR = "/home/pratham/.gemini/antigravity/brain/7361ddd5-ec3e-48a0-aeb2-add5b2ce03f5";

test.describe("Teacher Device Change Requests - Optimization & Blur Fix", () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTeacherAuth(page, context);
  });

  test("Action on one device change request does not blur or disable other requests", async ({ page }) => {
    // Mock pending requests with dynamic state
    let pendingRequests = [
      {
        id: "dcr-1",
        student_id: "s-1",
        student_name: "Ada Lovelace",
        enrollment_number: "ENR-2026-001",
        new_device_uuid: "ada-pixel-8-uuid-12345678",
        reason: "Lost previous phone, got new device",
        status: "PENDING",
        created_at: new Date().toISOString(),
      },
      {
        id: "dcr-2",
        student_id: "s-2",
        student_name: "Alan Turing",
        enrollment_number: "ENR-2026-002",
        new_device_uuid: "alan-iphone-uuid-87654321",
        reason: "Screen cracked, replacement unit",
        status: "PENDING",
        created_at: new Date().toISOString(),
      },
    ];

    await page.route("http://localhost:8000/api/v1/teacher/device-changes/pending", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(pendingRequests),
      });
    });

    // Mock approve action with an intentional short delay to verify non-blocking UI state
    await page.route("http://localhost:8000/api/v1/teacher/device-changes/dcr-1/approve", async (route) => {
      pendingRequests = pendingRequests.filter((r) => r.id !== "dcr-1");
      await new Promise((resolve) => setTimeout(resolve, 400));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ status: "success", message: "Device change request approved successfully." }),
      });
    });

    await page.goto("http://localhost:3000/teacher/device-changes");
    await expect(page.getByRole("heading", { name: "Device Change Requests" })).toBeVisible();

    // Verify both requests are displayed
    await expect(page.locator("text=Ada Lovelace")).toBeVisible();
    await expect(page.locator("text=Alan Turing")).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "device-changes-initial.png") });

    // Locate action buttons for row 1 and row 2
    const adaRow = page.locator("tr", { hasText: "Ada Lovelace" });
    const alanRow = page.locator("tr", { hasText: "Alan Turing" });

    const adaApproveBtn = adaRow.getByRole("button", { name: "Approve" });
    const alanApproveBtn = alanRow.getByRole("button", { name: "Approve" });
    const alanRejectBtn = alanRow.getByRole("button", { name: "Reject" });

    // Trigger approve on Ada's request
    await adaApproveBtn.click();

    // Check during in-flight action: Alan's buttons MUST remain enabled and not blurred!
    await expect(alanApproveBtn).toBeEnabled();
    await expect(alanRejectBtn).toBeEnabled();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "device-changes-inflight-unblurred.png") });

    // Wait for Ada's request to be optimistically and successfully processed
    await expect(page.locator("text=Ada Lovelace")).not.toBeVisible();

    // Alan's request remains active and crisp
    await expect(page.locator("text=Alan Turing")).toBeVisible();
    await expect(alanApproveBtn).toBeEnabled();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "device-changes-completed.png") });
  });
});
