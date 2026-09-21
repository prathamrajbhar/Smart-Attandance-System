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

  // 1. Teacher Search Context
  console.log("Starting Teacher Global Search tests...");
  const teacherContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const teacherPage = await teacherContext.newPage();

  console.log("Navigating to login page for Teacher...");
  await teacherPage.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
  await teacherPage.fill('input[type="email"]', "prof.aarav.sharma@yopmail.com");
  await teacherPage.fill('input[type="password"]', "Teacher@123");
  await teacherPage.click('button:has-text("Sign In"), button[type="submit"]');

  await teacherPage.waitForURL("**/teacher/**", { timeout: 15000 });
  console.log("Logged in as Teacher! Clicking Global Search bar...");

  // Click search input bar in header to open Command Palette
  const searchBar = teacherPage.locator('input[placeholder*="Search students"]').first();
  await searchBar.click();
  await teacherPage.waitForTimeout(600);

  // Take screenshot of default top actions
  const defaultSearchPath = path.join(screenshotsDir, "search_palette_default.png");
  await teacherPage.screenshot({ path: defaultSearchPath, fullPage: false });
  console.log(`Saved default search screenshot to ${defaultSearchPath}`);

  // Search for Student "Ananya"
  console.log("Searching for student 'Ananya' in palette input...");
  const paletteInput = teacherPage.locator('input[placeholder*="Search enrolled students"], input[placeholder*="Search students"]').last();
  await paletteInput.fill("Ananya");
  await teacherPage.waitForTimeout(1000);

  const studentSearchPath = path.join(screenshotsDir, "search_palette_student.png");
  await teacherPage.screenshot({ path: studentSearchPath, fullPage: false });
  console.log(`Saved student search screenshot to ${studentSearchPath}`);

  // Search for Class "CS401"
  console.log("Searching for class 'CS401' in palette input...");
  await paletteInput.fill("CS401");
  await teacherPage.waitForTimeout(1000);

  const classSearchPath = path.join(screenshotsDir, "search_palette_class.png");
  await teacherPage.screenshot({ path: classSearchPath, fullPage: false });
  console.log(`Saved class search screenshot to ${classSearchPath}`);

  await teacherContext.close();

  // 2. Admin Search Context
  console.log("Starting Admin Global Search tests...");
  const adminContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const adminPage = await adminContext.newPage();

  console.log("Navigating to login page for Admin...");
  await adminPage.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
  await adminPage.fill('input[type="email"]', "admin@smartattendance.edu.in");
  await adminPage.fill('input[type="password"]', "Admin@123");
  await adminPage.click('button:has-text("Sign In"), button[type="submit"]');

  await adminPage.waitForURL("**/admin/**", { timeout: 15000 });
  console.log("Logged in as Admin! Opening Command Palette...");

  const adminSearchBar = adminPage.locator('input[placeholder*="Search students"]').first();
  await adminSearchBar.click();
  await adminPage.waitForTimeout(600);

  console.log("Searching for faculty member 'Aarav' in admin palette...");
  const adminPaletteInput = adminPage.locator('input[placeholder*="Search students, faculty"], input[placeholder*="Search students"]').last();
  await adminPaletteInput.fill("Aarav");
  await adminPage.waitForTimeout(1000);

  const adminSearchPath = path.join(screenshotsDir, "search_palette_admin_faculty.png");
  await adminPage.screenshot({ path: adminSearchPath, fullPage: false });
  console.log(`Saved admin faculty search screenshot to ${adminSearchPath}`);

  await adminContext.close();
  await browser.close();
  console.log("All Playwright global search tests completed successfully!");
}

main().catch((err) => {
  console.error("Playwright search test failed:", err);
  process.exit(1);
});
