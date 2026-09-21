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
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();

  console.log("Navigating to login page...");
  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });

  console.log("Logging in as Teacher...");
  await page.fill('input[type="email"]', "prof.aarav.sharma@yopmail.com");
  await page.fill('input[type="password"]', "Teacher@123");
  await page.click('button:has-text("Sign In"), button[type="submit"]');

  await page.waitForURL("**/teacher/**", { timeout: 15000 });
  console.log("Logged in! Navigating to active session roster...");

  // Navigate directly to active session roster
  const sessionId = "e2cb6c69-0dbb-4441-a79a-865e82664c15";
  await page.goto(`http://localhost:3000/teacher/sessions/${sessionId}/roster`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);


  // Look for any active session roster or start one
  let rosterButton = page.locator('button:has-text("Roster"), a:has-text("Roster")').first();
  if (!(await rosterButton.isVisible())) {
    console.log("No active session found, checking classes or opening one...");
    const startBtn = page.locator('button:has-text("Start Session"), button:has-text("Open Session")').first();
    if (await startBtn.isVisible()) {
      await startBtn.click();
      await page.waitForTimeout(2000);
    }
  }

  // Look for roster link or first session link
  const sessionRow = page.locator('button:has-text("Roster"), a:has-text("Roster"), tr a').first();
  if (await sessionRow.isVisible()) {
    await sessionRow.click();
    await page.waitForTimeout(2000);
  }

  // If not in roster yet, find a session ID from the URL or API
  if (!page.url().includes("/roster")) {
    console.log("Opening first session roster directly...");
    // Let's query teacher classes to get session id
    const sessions = await page.evaluate(async () => {
      const res = await fetch("/api/v1/teacher/sessions/active");
      return res.json();
    });
  }

  console.log("Current page:", page.url());

  // Check for Smart Pass QR button
  const qrButton = page.locator('button:has-text("Smart Pass QR")').first();
  if (await qrButton.isVisible({ timeout: 5000 })) {
    console.log("Found Smart Pass QR button! Clicking...");
    await qrButton.click();
    await page.waitForTimeout(2000);

    // Verify modal is open
    const modal = page.locator('h3:has-text("Dynamic Smart Pass QR")');
    await modal.waitFor({ state: "visible", timeout: 5000 });
    console.log("Dynamic Smart Pass QR modal is visible!");

    // Take screenshot of Teacher QR modal
    const qrScreenshotPath = path.join(screenshotsDir, "teacher_smart_pass_web.png");
    await page.screenshot({ path: qrScreenshotPath, fullPage: false });
    console.log(`Saved screenshot to ${qrScreenshotPath}`);

    // Click Projector mode
    const projectorBtn = page.locator('button[title*="Projector Mode"], button[aria-label*="Projector Mode"]').first();
    if (await projectorBtn.isVisible()) {
      await projectorBtn.click();
      await page.waitForTimeout(1000);
      const projectorScreenshotPath = path.join(screenshotsDir, "teacher_smart_pass_projector_web.png");
      await page.screenshot({ path: projectorScreenshotPath, fullPage: false });
      console.log(`Saved projector mode screenshot to ${projectorScreenshotPath}`);
    }
  } else {
    console.log("Taking debug screenshot...");
    await page.screenshot({ path: path.join(screenshotsDir, "teacher_sessions_debug.png") });
  }

  await browser.close();
  console.log("Playwright verification completed successfully!");
}

main().catch((err) => {
  console.error("Playwright script failed:", err);
  process.exit(1);
});
