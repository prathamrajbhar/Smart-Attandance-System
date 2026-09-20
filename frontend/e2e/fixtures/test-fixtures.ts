import { test as base, Page } from "@playwright/test";
import { LoginPage } from "../pages/auth/login.page";
import { ForgotPasswordPage } from "../pages/auth/forgot-password.page";
import { ResetPasswordPage } from "../pages/auth/reset-password.page";
import { BulkImportComponent } from "../pages/admin/bulk-import.page";
import { AdminOverviewPage } from "../pages/admin/admin-overview.page";
import { AdminStudentsPage } from "../pages/admin/admin-students.page";
import { AdminTeachersPage } from "../pages/admin/admin-teachers.page";
import { AdminClassesPage } from "../pages/admin/admin-classes.page";
import { AdminScannerPage } from "../pages/admin/admin-scanner.page";
import { AdminAuditPage } from "../pages/admin/admin-audit.page";
import { AdminDepartmentsPage } from "../pages/admin/setup/departments.page";
import { AdminSubjectsPage } from "../pages/admin/setup/subjects.page";
import { AdminClassroomsPage } from "../pages/admin/setup/classrooms.page";
import { AdminDesignationsPage } from "../pages/admin/setup/designations.page";
import { AdminVerificationSettingsPage } from "../pages/admin/setup/verification-settings.page";
import { TeacherOverviewPage } from "../pages/teacher/teacher-overview.page";
import { TeacherClassesPage } from "../pages/teacher/teacher-classes.page";
import { TeacherSessionsPage } from "../pages/teacher/teacher-sessions.page";
import { TeacherReviewPage } from "../pages/teacher/teacher-review.page";
import { TeacherLeavesPage } from "../pages/teacher/teacher-leaves.page";
import { TeacherDeviceChangesPage } from "../pages/teacher/teacher-device-changes.page";
import { TeacherAnalyticsPage } from "../pages/teacher/teacher-analytics.page";
import { TeacherHistoryPage } from "../pages/teacher/teacher-history.page";
import { TeacherProfilePage } from "../pages/teacher/teacher-profile.page";

export const TEST_CREDENTIALS = {
  admin: {
    email: "admin@smartattendance.edu.in",
    password: "Admin@123",
  },
  teacher: {
    email: "emp001@smartattendance.edu.in",
    password: "Teacher@123",
  },
  student: {
    email: "cse2025001@smartattendance.edu.in",
    password: "Student@123",
  },
};

export const generateYopmail = (prefix = "testuser"): string => {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}@yopmail.com`;
};

export interface PageObjects {
  loginPage: LoginPage;
  forgotPasswordPage: ForgotPasswordPage;
  resetPasswordPage: ResetPasswordPage;
  bulkImportComponent: BulkImportComponent;
  adminOverviewPage: AdminOverviewPage;
  adminStudentsPage: AdminStudentsPage;
  adminTeachersPage: AdminTeachersPage;
  adminClassesPage: AdminClassesPage;
  adminScannerPage: AdminScannerPage;
  adminAuditPage: AdminAuditPage;
  adminDepartmentsPage: AdminDepartmentsPage;
  adminSubjectsPage: AdminSubjectsPage;
  adminClassroomsPage: AdminClassroomsPage;
  adminDesignationsPage: AdminDesignationsPage;
  adminVerificationSettingsPage: AdminVerificationSettingsPage;
  teacherOverviewPage: TeacherOverviewPage;
  teacherClassesPage: TeacherClassesPage;
  teacherSessionsPage: TeacherSessionsPage;
  teacherReviewPage: TeacherReviewPage;
  teacherLeavesPage: TeacherLeavesPage;
  teacherDeviceChangesPage: TeacherDeviceChangesPage;
  teacherAnalyticsPage: TeacherAnalyticsPage;
  teacherHistoryPage: TeacherHistoryPage;
  teacherProfilePage: TeacherProfilePage;
}

export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  forgotPasswordPage: async ({ page }, use) => {
    await use(new ForgotPasswordPage(page));
  },
  resetPasswordPage: async ({ page }, use) => {
    await use(new ResetPasswordPage(page));
  },
  bulkImportComponent: async ({ page }, use) => {
    await use(new BulkImportComponent(page));
  },
  adminOverviewPage: async ({ page }, use) => {
    await use(new AdminOverviewPage(page));
  },
  adminStudentsPage: async ({ page }, use) => {
    await use(new AdminStudentsPage(page));
  },
  adminTeachersPage: async ({ page }, use) => {
    await use(new AdminTeachersPage(page));
  },
  adminClassesPage: async ({ page }, use) => {
    await use(new AdminClassesPage(page));
  },
  adminScannerPage: async ({ page }, use) => {
    await use(new AdminScannerPage(page));
  },
  adminAuditPage: async ({ page }, use) => {
    await use(new AdminAuditPage(page));
  },
  adminDepartmentsPage: async ({ page }, use) => {
    await use(new AdminDepartmentsPage(page));
  },
  adminSubjectsPage: async ({ page }, use) => {
    await use(new AdminSubjectsPage(page));
  },
  adminClassroomsPage: async ({ page }, use) => {
    await use(new AdminClassroomsPage(page));
  },
  adminDesignationsPage: async ({ page }, use) => {
    await use(new AdminDesignationsPage(page));
  },
  adminVerificationSettingsPage: async ({ page }, use) => {
    await use(new AdminVerificationSettingsPage(page));
  },
  teacherOverviewPage: async ({ page }, use) => {
    await use(new TeacherOverviewPage(page));
  },
  teacherClassesPage: async ({ page }, use) => {
    await use(new TeacherClassesPage(page));
  },
  teacherSessionsPage: async ({ page }, use) => {
    await use(new TeacherSessionsPage(page));
  },
  teacherReviewPage: async ({ page }, use) => {
    await use(new TeacherReviewPage(page));
  },
  teacherLeavesPage: async ({ page }, use) => {
    await use(new TeacherLeavesPage(page));
  },
  teacherDeviceChangesPage: async ({ page }, use) => {
    await use(new TeacherDeviceChangesPage(page));
  },
  teacherAnalyticsPage: async ({ page }, use) => {
    await use(new TeacherAnalyticsPage(page));
  },
  teacherHistoryPage: async ({ page }, use) => {
    await use(new TeacherHistoryPage(page));
  },
  teacherProfilePage: async ({ page }, use) => {
    await use(new TeacherProfilePage(page));
  },
});

test.afterEach(async ({ page }, testInfo) => {
  try {
    const sanitizedTitle = testInfo.title.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60);
    const screenshotDir = `./e2e-screenshots/${testInfo.project.name}`;
    const screenshotPath = `${screenshotDir}/${sanitizedTitle}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
  } catch {
    // Ignore screenshot errors if page is closed or not attached
  }
});

export { expect } from "@playwright/test";
