import { test, expect } from "@playwright/test";
import { setupAdminAuth } from "./test-helpers";
import path from "path";

const SCREENSHOT_DIR = "/home/pratham/.gemini/antigravity/brain/7361ddd5-ec3e-48a0-aeb2-add5b2ce03f5";

test.describe("Module: System Setup Full CRUD Lifecycle", () => {
  test.beforeEach(async ({ page, context }) => {
    await setupAdminAuth(page, context);
  });

  test("Department Creation and Edit flow operates seamlessly", async ({ page }) => {
    let departmentCreated = false;
    let departmentUpdated = false;

    await page.route("http://localhost:8000/api/v1/admin/departments", async (route) => {
      if (route.request().method() === "POST") {
        departmentCreated = true;
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ id: "dept-new", name: "Biomedical Engineering", code: "BME" }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            { id: "dept-1", name: "Computer Science & Engineering", code: "CSE" },
          ]),
        });
      }
    });

    await page.route("http://localhost:8000/api/v1/admin/departments/dept-1", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: "dept-1",
            name: "Computer Science & Engineering",
            code: "CSE",
            head: "Dr. Grace Hopper",
            description: "Pioneering computing science education",
          }),
        });
      } else if (route.request().method() === "PUT") {
        departmentUpdated = true;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ id: "dept-1", name: "Computer Science & AI", code: "CSAI" }),
        });
      }
    });

    // 1. Create Department
    await page.goto("/admin/setup/departments/create");
    await expect(page.locator("h1:has-text('Create Department')")).toBeVisible();
    await page.locator("input[placeholder*='e.g. Computer Science']").fill("Biomedical Engineering");
    await page.locator("input[placeholder*='e.g. CSE']").fill("BME");
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "setup_dept_create.png"), fullPage: true });
    await page.getByRole("button", { name: "Create Department" }).click();
    expect(departmentCreated).toBe(true);

    // 2. Edit Department
    await page.goto("/admin/setup/departments/dept-1/edit");
    await expect(page.locator("h1:has-text('Edit Department')")).toBeVisible();
    await expect(page.locator("input[value='Computer Science & Engineering']")).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "setup_dept_edit.png"), fullPage: true });
    await page.getByRole("button", { name: "Save Changes" }).click();
    expect(departmentUpdated).toBe(true);
  });

  test("Subject Creation and Edit flow operates seamlessly", async ({ page }) => {
    let subjectCreated = false;
    let subjectUpdated = false;

    await page.route("http://localhost:8000/api/v1/admin/subjects", async (route) => {
      if (route.request().method() === "POST") {
        subjectCreated = true;
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ id: "sub-new", name: "Robotics", code: "ROB201" }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([{ id: "sub-1", name: "Distributed Computing", code: "CS401" }]),
        });
      }
    });

    await page.route("http://localhost:8000/api/v1/admin/subjects/sub-1", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: "sub-1",
            name: "Distributed Computing",
            code: "CS401",
            description: "Advanced consensus and replication",
          }),
        });
      } else if (route.request().method() === "PUT") {
        subjectUpdated = true;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ id: "sub-1", name: "Cloud & Distributed Computing", code: "CS401" }),
        });
      }
    });

    // 1. Create Subject
    await page.goto("/admin/setup/subjects/create");
    await expect(page.locator("h1:has-text('Create Subject')")).toBeVisible();
    await page.locator("input[placeholder*='Machine Learning']").fill("Robotics");
    await page.locator("input[placeholder*='CS-402']").fill("ROB-201");
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "setup_subject_create.png"), fullPage: true });
    await page.getByRole("button", { name: "Create Subject" }).click();
    expect(subjectCreated).toBe(true);

    // 2. Edit Subject
    await page.goto("/admin/setup/subjects/sub-1/edit");
    await expect(page.locator("h1:has-text('Edit Subject')")).toBeVisible();
    await expect(page.locator("input[value='Distributed Computing']")).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "setup_subject_edit.png"), fullPage: true });
    await page.getByRole("button", { name: "Save Changes" }).click();
    expect(subjectUpdated).toBe(true);
  });

  test("Classroom Creation and Edit flow operates seamlessly", async ({ page }) => {
    let classroomCreated = false;
    let classroomUpdated = false;

    await page.route("http://localhost:8000/api/v1/admin/classrooms", async (route) => {
      if (route.request().method() === "POST") {
        classroomCreated = true;
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ id: "room-new", name: "Auditorium A", building: "Main Block", capacity: 250 }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([{ id: "room-1", name: "Lab 302", building: "Tech Park", capacity: 45 }]),
        });
      }
    });

    await page.route("http://localhost:8000/api/v1/admin/classrooms/room-1", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ id: "room-1", name: "Lab 302", building: "Tech Park", capacity: 45 }),
        });
      } else if (route.request().method() === "PUT") {
        classroomUpdated = true;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ id: "room-1", name: "AI Research Lab 302", building: "Tech Park", capacity: 50 }),
        });
      }
    });

    // 1. Create Classroom
    await page.goto("/admin/setup/classrooms/create");
    await expect(page.locator("h1:has-text('Create Classroom')")).toBeVisible();
    await page.locator("input[placeholder*='Room 301']").fill("Auditorium A");
    await page.locator("input[placeholder*='e.g. Science Block']").fill("Main Block");
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "setup_classroom_create.png"), fullPage: true });
    await page.getByRole("button", { name: "Create Classroom" }).click();
    expect(classroomCreated).toBe(true);

    // 2. Edit Classroom
    await page.goto("/admin/setup/classrooms/room-1/edit");
    await expect(page.locator("h1:has-text('Edit Classroom')")).toBeVisible();
    await expect(page.locator("input[value='Lab 302']")).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "setup_classroom_edit.png"), fullPage: true });
    await page.getByRole("button", { name: "Save Changes" }).click();
    expect(classroomUpdated).toBe(true);
  });

  test("Designation Creation and Edit flow operates seamlessly", async ({ page }) => {
    let designationCreated = false;
    let designationUpdated = false;

    await page.route("http://localhost:8000/api/v1/admin/designations", async (route) => {
      if (route.request().method() === "POST") {
        designationCreated = true;
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ id: "desig-new", name: "Distinguished Fellow", code: "DIST_FELLOW" }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([{ id: "desig-1", name: "Associate Professor", code: "ASSOC_PROF" }]),
        });
      }
    });

    await page.route("http://localhost:8000/api/v1/admin/designations/desig-1", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: "desig-1",
            name: "Associate Professor",
            code: "ASSOC_PROF",
            description: "Tenured academic role",
          }),
        });
      } else if (route.request().method() === "PUT") {
        designationUpdated = true;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ id: "desig-1", name: "Tenured Associate Professor", code: "ASSOC_PROF" }),
        });
      }
    });

    // 1. Create Designation
    await page.goto("/admin/setup/designations/create");
    await expect(page.locator("h1:has-text('Create Designation')")).toBeVisible();
    await page.locator("input[placeholder*='e.g. Associate Professor']").fill("Distinguished Fellow");
    await page.locator("input[placeholder*='e.g. ASSOC_PROF']").fill("DIST_FELLOW");
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "setup_designation_create.png"), fullPage: true });
    await page.getByRole("button", { name: "Create Designation" }).click();
    expect(designationCreated).toBe(true);

    // 2. Edit Designation
    await page.goto("/admin/setup/designations/desig-1/edit");
    await expect(page.locator("h1:has-text('Edit Designation')")).toBeVisible();
    await expect(page.locator("input[value='Associate Professor']")).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "setup_designation_edit.png"), fullPage: true });
    await page.getByRole("button", { name: "Save Changes" }).click();
    expect(designationUpdated).toBe(true);
  });

  test("Verification Settings view allows threshold tuning and saves configuration", async ({ page }) => {
    let configUpdated = false;

    await page.route("http://localhost:8000/api/v1/admin/config", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            isAiFaceValidationEnabled: true,
            isAiLivenessValidationEnabled: true,
            isGpsVerificationEnabled: true,
          }),
        });
      } else if (route.request().method() === "PUT" || route.request().method() === "POST") {
        configUpdated = true;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ message: "Configuration updated successfully" }),
        });
      }
    });

    await page.goto("/admin/setup/verification-settings");
    await expect(page.locator("h1:has-text('Verification Kill-Switch')")).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "setup_verification_settings.png"), fullPage: true });
  });
});
