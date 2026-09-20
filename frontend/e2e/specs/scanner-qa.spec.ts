import { test, expect, TEST_CREDENTIALS } from "../fixtures/test-fixtures";
import * as path from "path";

const ARTIFACT_DIR = "/home/pratham/.gemini/antigravity/brain/66955144-d1a9-4696-ba85-524b63642ef3";

test.describe("AI Absentee Pattern Scanner QA Suite", () => {
  test("performs full scan, validates patterns, expands breakdown and captures QA screenshots", async ({
    page,
    loginPage,
  }) => {
    // 1. Authenticate as Admin
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password);
    await loginPage.expectLoginSuccess("ADMIN");

    // 2. Navigate directly to AI Absentee Scanner
    await page.goto("/admin/scanner");
    await page.waitForLoadState("networkidle");

    // 3. Assert Scanner Controls & Explanations are rendered
    await expect(page.getByRole("heading", { name: /Absentee Pattern Scanner/i })).toBeVisible();
    await expect(page.getByText(/Sensitivity Range Guide/i)).toBeVisible();
    await expect(page.getByText(/Balanced Mode/i)).toBeVisible();

    // 4. Capture initial scanner view
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "ai_scanner_initial_state.png"),
      fullPage: true,
    });

    // 5. Trigger AI Isolation Forest Scan
    const scanButton = page.getByRole("button", { name: /Run AI Anomaly Scan|Run Scan/i });
    await expect(scanButton).toBeEnabled();
    await scanButton.click();

    // 6. Wait for anomalies to be calculated and rendered
    const anomalyCards = page.locator(".glass-card, [class*='bg-card']");
    await expect(anomalyCards.first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Anomaly Index|Anomaly Score/i).first()).toBeVisible();

    // 7. Verify detected pattern badge
    const patternBadges = page.locator(".text-amber-600, .text-amber-400, [class*='bg-amber']");
    await expect(patternBadges.first()).toBeVisible();

    // 8. Capture scanned results state
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "ai_scanner_results_state.png"),
      fullPage: true,
    });

    // 9. Expand Weekday Breakdown on the first card
    const weekdayToggle = page.getByRole("button", { name: /Weekday Breakdown/i }).first();
    if (await weekdayToggle.isVisible()) {
      await weekdayToggle.click();
      await page.waitForTimeout(400);
      await expect(page.getByText("Mon").first()).toBeVisible();
      await expect(page.getByText("Fri").first()).toBeVisible();
    }

    // 10. Capture comprehensive final screenshot with expanded day distribution
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "ai_scanner_breakdown_expanded.png"),
      fullPage: true,
    });
  });
});
