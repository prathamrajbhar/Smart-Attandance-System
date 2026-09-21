import pkg from "../frontend/node_modules/@playwright/test/index.js";
const { chromium } = pkg;
import fs from "fs";
import path from "path";

async function main() {
  const screenshotsDir = "/home/pratham/Disk2/Projects/Smart Attandance System/screenshots";
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log("Navigating to login page...");
  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });

  console.log("Logging in as Teacher...");
  await page.fill('input[type="email"]', "prof.aarav.sharma@yopmail.com");
  await page.fill('input[type="password"]', "Teacher@123");
  await page.click('button:has-text("Sign In"), button[type="submit"]');

  await page.waitForURL("**/teacher/**", { timeout: 15000 });
  console.log("Logged in! Navigating to Analytics page...");

  await page.goto("http://localhost:3000/teacher/analytics", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Take screenshot of Overview Tab
  const overviewPath = path.join(screenshotsDir, "teacher_analytics_overview.png");
  await page.screenshot({ path: overviewPath, fullPage: true });
  console.log(`Saved Overview screenshot to ${overviewPath}`);

  // Switch to Students Tab
  console.log("Switching to Student Defaulters & Roster tab...");
  const studentsTab = page.locator('button:has-text("Student Defaulters")');
  if (await studentsTab.isVisible()) {
    await studentsTab.click();
    await page.waitForTimeout(1000);

    const studentsPath = path.join(screenshotsDir, "teacher_analytics_students.png");
    await page.screenshot({ path: studentsPath, fullPage: true });
    console.log(`Saved Students Roster screenshot to ${studentsPath}`);

    // Click on first "View History" button
    const historyBtn = page.locator('button:has-text("View History")').first();
    if (await historyBtn.isVisible()) {
      console.log("Opening Student History Drilldown Modal...");
      await historyBtn.click();
      await page.waitForTimeout(1500);

      const modalPath = path.join(screenshotsDir, "teacher_student_history_modal.png");
      await page.screenshot({ path: modalPath, fullPage: false });
      console.log(`Saved Student History Modal screenshot to ${modalPath}`);

      // Close modal
      const closeBtn = page.locator('button[aria-label="Close dialog"]').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(500);
      }
    }
  }

  // Switch to Attendance Matrix Tab
  console.log("Switching to Attendance Matrix Grid tab...");
  const matrixTab = page.locator('button:has-text("Attendance Matrix")');
  if (await matrixTab.isVisible()) {
    await matrixTab.click();
    await page.waitForTimeout(1500);

    const matrixPath = path.join(screenshotsDir, "teacher_analytics_matrix.png");
    await page.screenshot({ path: matrixPath, fullPage: true });
    console.log(`Saved Attendance Matrix screenshot to ${matrixPath}`);
  }

  await browser.close();
  console.log("All Playwright analytics tests completed successfully!");
}

main().catch((err) => {
  console.error("Playwright analytics test failed:", err);
  process.exit(1);
});
