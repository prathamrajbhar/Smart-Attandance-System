import { test, expect, TEST_CREDENTIALS } from "../fixtures/test-fixtures";

test.describe("14: Teacher Portal - Attendance Overrides & Flagged Review Decisions", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.teacher.email, TEST_CREDENTIALS.teacher.password);
    await loginPage.expectLoginSuccess("TEACHER");
  });

  test("manages manual attendance roster overrides, bulk actions, and commits changes", async ({
    teacherSessionsPage,
    page,
  }) => {
    await teacherSessionsPage.goto();

    // Find first past or active session and navigate to Manual attendance
    const manualBtn = page.locator("table tbody tr button:has-text('Manual'), .space-y-3 button:has-text('Manual')").first();
    if (await manualBtn.isVisible()) {
      await manualBtn.click();
      await page.waitForURL(/\/teacher\/sessions\/.*\/manual/, { timeout: 10000 });
      await expect(page.getByText(/Roster Health|Manual Attendance/i).first()).toBeVisible();

      const studentRows = page.locator(".divide-y > div");
      const studentCount = await studentRows.count();

      // Test "All Present" action
      const allPresentBtn = page.getByRole("button", { name: /All Present/i });
      if (await allPresentBtn.isVisible()) {
        await allPresentBtn.click();
      }

      // Test student search within roster
      const studentSearch = page.locator("main input[placeholder*='Search students']");
      if (await studentSearch.isVisible()) {
        await studentSearch.fill("a");
        await studentSearch.fill("");
      }

      // Commit Attendance
      const commitBtn = page.getByRole("button", { name: /Commit Attendance/i });
      if (await commitBtn.isVisible()) {
        await commitBtn.click();
        if (studentCount > 0) {
          await expect(
            page.getByText(/Attendance override applied successfully|Attendance recorded successfully|Success/i)
          ).toBeVisible({ timeout: 10000 });
        } else {
          await expect(
            page.getByText("No students enrolled in this session to mark attendance").first()
          ).toBeVisible({ timeout: 10000 });
        }
      }
    }
  });

  test("inspects Review Queue and processes flagged attendance records", async ({
    teacherReviewPage,
    page,
  }) => {
    await teacherReviewPage.goto();
    await expect(page.getByText(/Review Queue/i).first()).toBeVisible();

    // Verify search and class filter controls
    const searchInput = page.locator("input[placeholder*='Search by name or enrollment']");
    if (await searchInput.isVisible()) {
      await searchInput.fill("test");
      await searchInput.fill("");
    }

    // Check for review items in table
    const reviewBtn = page.locator("table tbody tr button:has-text('Review')").first();
    if (await reviewBtn.isVisible()) {
      await reviewBtn.click();
      await page.waitForURL(/\/teacher\/review\/.+/, { timeout: 10000 });

      // Verify AI Evidence score gauges
      await expect(page.getByText(/AI Evidence/i)).toBeVisible();
      await expect(page.getByText(/Face/i).first()).toBeVisible();
      await expect(page.getByText(/Liveness/i).first()).toBeVisible();

      // Fill remarks
      const remarksInput = page.locator("textarea");
      if (await remarksInput.isVisible()) {
        await remarksInput.fill("Automated E2E review verification - Verified by Faculty");
      }

      // Click Approve and handle confirmation dialog
      const approveBtn = page.getByRole("button", { name: /^Approve$/i });
      if (await approveBtn.isVisible()) {
        await approveBtn.click();
        const confirmBtn = page.locator("button:has-text('Confirm'), button:has-text('Approve')").last();
        if (await confirmBtn.isVisible()) {
          await confirmBtn.click();
        }
        await expect(page.getByText(/Record approved|approved/i)).toBeVisible({ timeout: 10000 });
      }
    }
  });
});
