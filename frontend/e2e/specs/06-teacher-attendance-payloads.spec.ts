import { test, expect, TEST_CREDENTIALS, generateYopmail } from "../fixtures/test-fixtures";

test.describe("06: Teacher Portal - Attendance Marking & API Payload Inspection", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(TEST_CREDENTIALS.teacher.email, TEST_CREDENTIALS.teacher.password);
    await loginPage.expectLoginSuccess("TEACHER");
  });

  test("intercepts and validates bulk attendance submission payload schema and status enums", async ({
    page,
  }) => {
    // Intercept manual bulk mark endpoint
    let interceptedPayload: { records?: Array<{ student_id: string; status: string }> } | null = null;

    await page.route("**/teacher/sessions/*/mark-bulk", async (route) => {
      const request = route.request();
      if (request.method() === "POST") {
        interceptedPayload = request.postDataJSON() as { records?: Array<{ student_id: string; status: string }> };
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Attendance override applied successfully",
          updated_count: interceptedPayload?.records?.length || 0,
        }),
      });
    });

    const studentYopmail1 = generateYopmail("student_attend_1");
    const studentYopmail2 = generateYopmail("student_attend_2");

    // Mock an active session roster for deterministic testing
    const mockSessionId = "session-e2e-1001";
    await page.route(`**/teacher/sessions/${mockSessionId}/attendance`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          session_id: mockSessionId,
          class_name: "CS-301 Distributed Systems",
          roster: [
            {
              student_id: "student-uuid-001",
              enrollment_number: "EN2024001",
              full_name: "Aanya Sharma",
              email: studentYopmail1,
              status: "Absent",
              final_score: 0.0,
            },
            {
              student_id: "student-uuid-002",
              enrollment_number: "EN2024002",
              full_name: "Rahul Verma",
              email: studentYopmail2,
              status: "Present",
              final_score: 0.95,
            },
          ],
        }),
      });
    });

    // Navigate directly to manual attendance page for the session
    await page.goto(`/teacher/sessions/${mockSessionId}/manual`);
    await expect(page.getByText(/CS-301 Distributed Systems/i).first()).toBeVisible({ timeout: 10000 });

    // Mark all students present
    const markAllPresentBtn = page.getByRole("button", { name: /Mark All Present|All Present/i });
    if (await markAllPresentBtn.isVisible()) {
      await markAllPresentBtn.click();
    }

    // Submit attendance and trigger network request
    const submitBtn = page.getByRole("button", { name: /Commit Attendance|Save & Commit|Submit/i });
    await submitBtn.click();

    // Assert exact intercepted payload structure
    expect(interceptedPayload).not.toBeNull();
    expect(interceptedPayload).toHaveProperty("records");
    expect(Array.isArray(interceptedPayload?.records)).toBe(true);
    expect(interceptedPayload?.records?.length).toBeGreaterThan(0);

    // Validate payload item schema & status enum
    const firstRecord = interceptedPayload?.records?.[0];
    expect(firstRecord).toBeDefined();
    expect(typeof firstRecord?.student_id).toBe("string");
    expect(["Present", "Absent", "Flagged", "Approved"]).toContain(firstRecord?.status);
  });
});
