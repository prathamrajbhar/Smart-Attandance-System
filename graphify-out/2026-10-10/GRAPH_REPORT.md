# Graph Report - Smart Attandance System  (2026-10-10)

## Corpus Check
- 378 files · ~147,228 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 77 file(s) not represented in the graph (top: .csv 65, (none) 6, .h5 2)

## Summary
- 2599 nodes · 7695 edges · 145 communities (93 shown, 52 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 466 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c1e7bffe`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- api.ts
- getApiErrorMessage
- react
- tenant.ts
- attendance.ts
- student_service.py
- StudentService
- prepare_bulk_datasets.py
- api/timetable.py
- useAuthStore
- cn
- api/teacher.py
- api/auth.py
- tenants/[id]/page.tsx
- TeacherService
- dev.mjs
- Smart Attendance System - Verification Report
- broadcasts/page.tsx
- ProvisionTenantModal.tsx
- Changes
- smoke_test.py
- argparse
- Changes Required
- AuthService
- notifications.py
- SuperAdminService
- @playwright/test
- schemas/super_admin.py
- GlobalSearchResponse
- main.py
- useDebounce
- _handle_generic_err
- api/health.py
- NotificationFeedItem.tsx
- AttendanceService
- ManualAttendancePage
- ActivityFilterBar.tsx
- super-admin/dashboard/page.tsx
- lucide-react
- Sidebar.tsx
- types/index.ts
- teacher.ts
- RealtimeBus
- schemas/admin.py
- SessionService
- GlassCombobox.tsx
- AttendanceRepository
- api/student.py
- analyze_attendance
- SuperAdminTenantsPage
- pytest
- frontend/package.json
- enroll/page.tsx
- TenantDetailResponse
- api/super_admin.py
- leave.py
- .create_department
- api/admin.py
- dependencies
- BulkImportModal.tsx
- reset-password/page.tsx
- DashboardKpiStrip.tsx
- master_data.py
- admin/layout.tsx
- pagination.py
- package.json
- super-admin/layout.tsx
- next
- .create_designation
- auth_service.py
- TenantDetail
- BiometricConsentService
- CommandPaletteModal.tsx
- app_services_realtime_bus
- StudentRepository
- faker
- GamificationService
- devDependencies
- GeofenceMap.tsx
- compilerOptions
- notification.ts
- timetable.ts
- 🚀 Key Features
- random
- ref_fs
- rich_console
- rich_panel
- rich_progress
- rich_table
- scripts_seeder_client
- scim.py
- form.tsx
- frontend_e2e_fixtures_test_fixtures_expect
- scripts_seeder_config
- scripts_seeder_data_generator
- scripts_seeder_workflows
- sentry_sdk
- ssl
- AIOrchestrator
- global_exception_handler
- subprocess
- ConnectionManager
- Settings
- app_services_sso_service
- urllib_error
- absentee_scanner.py
- PasswordRequirementsChecklist.tsx
- attendance_service.py
- next.config.ts
- ReviewQueuePage
- AttendanceTrendChart.tsx
- playwright_async_api
- unittest
- get_redis
- Agent Guidelines & Engineering Standards
- SessionRepository
- SystemConfigService
- scripts
- proxy.ts
- ref_playwright
- security_audit_suite.py
- typing
- dropdown-menu.tsx
- WebSocketClient
- logger.ts
- frontend/README.md
- rich
- rules/graphify.md
- workflows/graphify.md
- backend/README.md
- postcss.config.mjs
- frontend_node_modules_playwright_test_index
- AdminService
- button.tsx
- app_middleware_request_logging
- app/layout.tsx
- GlassButton.tsx
- os
- frontend_src_types_index_tenantprovisionrequest
- frontend_src_types_index_tenantstatus
- frontend_src_types_index_tenantupdaterequest

## God Nodes (most connected - your core abstractions)
1. `react` - 211 edges
2. `getApiErrorMessage()` - 182 edges
3. `lucide-react` - 156 edges
4. `AdminService` - 110 edges
5. `cn()` - 99 edges
6. `next` - 92 edges
7. `GlassButton()` - 79 edges
8. `react-hot-toast` - 77 edges
9. `api` - 72 edges
10. `applyValidationErrorsToForm()` - 65 edges

## Surprising Connections (you probably didn't know these)
- ``backend/app/schemas/master_data.py`` --references--> `ClassroomUpdate`  [INFERRED]
  .kilo/plans/remove-classroom-capacity.md → backend/app/schemas/master_data.py
- `4. API Routes (`backend/app/api/admin.py`)` --references--> `get_classroom()`  [INFERRED]
  .kilo/plans/remove-classroom-capacity.md → backend/app/api/admin.py
- ``backend/app/schemas/admin.py`` --references--> `ClassUpdate`  [INFERRED]
  .kilo/plans/remove-classroom-capacity.md → backend/app/schemas/admin.py
- ``backend/app/schemas/admin.py`` --references--> `ClassBulkItem`  [INFERRED]
  .kilo/plans/remove-classroom-capacity.md → backend/app/schemas/admin.py
- `DTOs (`backend/app/schemas/super_admin.py`)` --references--> `TenantResponse`  [INFERRED]
  .kilo/plans/license-based-system.md → backend/app/schemas/super_admin.py

## Import Cycles
- None detected.

## Communities (145 total, 52 thin omitted)

### Community 0 - "api.ts"
Cohesion: 0.08
Nodes (67): SEMESTER_OPTIONS, INITIAL_FORM, SystemConfig, VerificationSettingsPage(), CohortSummary, DAYS, GENDER_OPTIONS, SEMESTER_OPTIONS (+59 more)

### Community 1 - "getApiErrorMessage"
Cohesion: 0.03
Nodes (98): ForgotPasswordPage(), handleResend(), onSubmit(), LoginPage(), handleSuccessRedirect(), onSubmit(), OnboardingContent(), checkToken() (+90 more)

### Community 2 - "react"
Cohesion: 0.04
Nodes (56): SEVERITY_VARIANT, AuditPage(), AnomalyCard(), getRiskLevel(), WEEKDAYS, ScannerControls(), ScannerControlsProps, StudentsPage() (+48 more)

### Community 3 - "tenant.ts"
Cohesion: 0.12
Nodes (23): AuditDetailModalProps, AuditLogTableProps, SystemHealthCardProps, SystemMetricsGrid(), SystemMetricsGridProps, AuditLogListParams, LicenseRequestListParams, PaginatedAuditLogs (+15 more)

### Community 4 - "attendance.ts"
Cohesion: 0.09
Nodes (20): AnomalyCardProps, LeaveDocumentModalProps, LeaveReviewDialogProps, AnalyticsOverviewTabProps, StudentsRosterTabProps, AnomalyResult, AttendanceExportRow, AttendanceMatrixResponse (+12 more)

### Community 5 - "student_service.py"
Cohesion: 0.24
Nodes (10): app_repositories_geofence_repo, GeofenceRepository, GeofenceValidator, calculate_haversine_distance(), GPSCoordinate, is_within_geofence(), Validates if student is within the classroom geofence, accounting for GPS…, Geofence (+2 more)

### Community 6 - "StudentService"
Cohesion: 0.16
Nodes (15): FcmTokenRequest, LeaderboardEntry, LeaderboardResponse, BaseModel, field_validator, SmartPassResponse, StudentAttendanceHistoryResponse, StudentAttendanceItem (+7 more)

### Community 7 - "prepare_bulk_datasets.py"
Cohesion: 0.18
Nodes (10): clean_str(), process_classrooms_and_labs(), process_faculty_and_departments(), process_students(), process_subjects(), Script to transform raw datasets in temp/ into standard CSV files for bulk…, API-Driven Database Seeder. Uses HTTP REST API exclusively to provision: -…, csv (+2 more)

### Community 8 - "api/timetable.py"
Cohesion: 0.05
Nodes (57): app_schemas_timetable, app_services_ai_timetable_parser, app_services_timetable_qa_service, app_services_timetable_service, commit_timetable(), create_teacher_substitution(), get_cohort_timetable(), get_student_today_schedule() (+49 more)

### Community 9 - "useAuthStore"
Cohesion: 0.12
Nodes (18): metadata, DashboardLayout(), SuspendedPage(), Footer(), Header(), HeaderProps, NotificationPopover(), SidebarUserFooter() (+10 more)

### Community 10 - "cn"
Cohesion: 0.08
Nodes (34): ManualAttendanceStudentRow(), ManualAttendanceStudentRowProps, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle (+26 more)

### Community 11 - "api/teacher.py"
Cohesion: 0.13
Nodes (34): app_services_leave_service, app_services_session_service, app_services_teacher_service, approve_device_change(), approve_leave(), bulk_mark_attendance(), export_class_attendance(), get_absent_students() (+26 more)

### Community 12 - "api/auth.py"
Cohesion: 0.06
Nodes (56): aiosmtplib, app_core_url_resolver, app_schemas_system_config, app_services_auth_service, app_services_device_change_service, app_services_system_config_service, change_password(), complete_onboarding() (+48 more)

### Community 13 - "tenants/[id]/page.tsx"
Cohesion: 0.17
Nodes (17): TenantDetailPage(), DeleteTenantModal(), DeleteTenantModalProps, EditTenantModal(), EditTenantModalProps, ProvisionTenantModalProps, TenantFilterBar(), TenantFilterBarProps (+9 more)

### Community 14 - "TeacherService"
Cohesion: 0.14
Nodes (29): AbsentStudentItem, AcademicClassWithGeofenceResponse, AttendanceManualOverride, AttendanceMatrixResponse, AttendanceMatrixSessionItem, AttendanceMatrixStudentItem, BulkAttendanceRecord, BulkMarkRequest (+21 more)

### Community 15 - "dev.mjs"
Cohesion: 0.07
Nodes (42): ref_node_child_process, ref_node_crypto, ref_node_fs, ref_node_path, ref_node_url, checkVenvPythonVersion(), createPython311Venv(), ensureBackendDirectories() (+34 more)

### Community 16 - "Smart Attendance System - Verification Report"
Cohesion: 0.11
Nodes (17): ✅ 00-guardrails-and-auth.spec.ts (16/16 tests PASSED), ✅ 01-admin-overview-audit-scanner.spec.ts (6/6 tests PASSED), ✅ Admin Authentication Flow, ✅ Admin Sidebar, Authentication & Authorization Verification, Conclusion, Core Functionality Verified via E2E Tests, Database State Verification (+9 more)

### Community 17 - "broadcasts/page.tsx"
Cohesion: 0.15
Nodes (14): INITIAL_FORM, SuperAdminBroadcastsPage(), AUDIENCE_OPTIONS, BroadcastForm(), BroadcastFormProps, CATEGORY_OPTIONS, TYPE_OPTIONS, BroadcastHistoryTable() (+6 more)

### Community 18 - "ProvisionTenantModal.tsx"
Cohesion: 0.20
Nodes (12): Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter(), DialogHeader(), DialogOverlay, DialogPortal (+4 more)

### Community 19 - "Changes"
Cohesion: 0.12
Nodes (16): LicenseRequestStatus, 1. Database Schema Updates, 3. Frontend Updates, 4. Testing, 5. Migration, 6. Notes, Changes, Implementation Steps (+8 more)

### Community 20 - "smoke_test.py"
Cohesion: 0.12
Nodes (19): Service Health & Connectivity Checker Checks AWS S3 and PostgreSQL RDS…, botocore_exceptions, dotenv, html, smtplib, socket, fetch_department_urls(), fetch_url() (+11 more)

### Community 22 - "Changes Required"
Cohesion: 0.08
Nodes (20): Classroom, Classroom, 1. Prisma Schema (`backend/prisma/schema.prisma`), 2. Pydantic Schemas, 3. Services, 4. API Routes (`backend/app/api/admin.py`), 5. Test Fixtures (`backend/tests/conftest.py`), 6. Seed Data (`backend/scripts/seeder/data_generator.py`) (+12 more)

### Community 23 - "AuthService"
Cohesion: 0.10
Nodes (31): app_schemas_master_data, app_schemas_student, app_schemas_super_admin, app_services_admin_audit_export_service, app_services_admin_bulk_import_service, app_services_admin_class_admin_service, app_services_admin_classroom_service, app_services_admin_department_service (+23 more)

### Community 24 - "notifications.py"
Cohesion: 0.07
Nodes (51): app_schemas_notification, app_services_notification_service, broadcast_notification(), bulk_delete_notifications(), clear_all_notifications(), list_notifications(), mark_all_read(), mark_read() (+43 more)

### Community 25 - "SuperAdminService"
Cohesion: 0.22
Nodes (10): get_all_users(), get_global_audit_logs(), get_platform_stats(), get_system_health(), list_global_broadcasts(), list_license_requests(), get, SuperAdminStatsResponse (+2 more)

### Community 27 - "schemas/super_admin.py"
Cohesion: 0.19
Nodes (16): patch, set_user_status(), BroadcastHistoryItem, GlobalUserItem, GlobalUserPasswordResetRequest, GlobalUserStatusUpdateRequest, LicenseRequestCreate, LicenseRequestItem (+8 more)

### Community 28 - "GlobalSearchResponse"
Cohesion: 0.27
Nodes (9): app_schemas_search, global_search(), get, User, GlobalSearchResponse, BaseModel, SearchResultItem, GlobalSearchService (+1 more)

### Community 29 - "main.py"
Cohesion: 0.07
Nodes (28): app_api, app_schemas_common, app_schemas_log, app_services_s3_service, app_services_scheduler, setup_logging(), BaseHTTPMiddleware, Request (+20 more)

### Community 30 - "useDebounce"
Cohesion: 0.23
Nodes (11): EnrollStudentsPage(), handleEnroll(), AdminNotificationsPage(), SuperAdminNotificationsPage(), TeacherNotificationsPage(), NotificationFeedList(), NotificationFilterBar(), ActionButtonProps (+3 more)

### Community 31 - "_handle_generic_err"
Cohesion: 0.15
Nodes (41): assign_teacher(), bulk_create_classes(), bulk_create_classrooms(), bulk_create_departments(), bulk_create_designations(), bulk_create_students(), bulk_create_subjects(), bulk_create_teachers() (+33 more)

### Community 32 - "api/health.py"
Cohesion: 0.36
Nodes (9): check_database(), check_redis(), check_s3(), get_health_status(), get, Response, HealthResponse, BaseModel (+1 more)

### Community 33 - "NotificationFeedItem.tsx"
Cohesion: 0.20
Nodes (11): formatRelativeTime(), getCategoryIcon(), NotificationFeedItem(), NotificationFeedItemProps, NotificationFeedListProps, NotificationStatsGridProps, formatRelativeTime(), getIcon() (+3 more)

### Community 34 - "AttendanceService"
Cohesion: 0.19
Nodes (8): AttendanceQueueService, Any, AttendanceSubmission, CachedSession, datetime, AttendanceService, Attendance, dataclasses

### Community 36 - "ActivityFilterBar.tsx"
Cohesion: 0.27
Nodes (8): ActivityCategory, ActivityFilterBar(), ActivityFilterBarProps, CATEGORIES, PRESETS, TimePresetFilter(), TimePresetFilterProps, TimeRangePreset

### Community 37 - "super-admin/dashboard/page.tsx"
Cohesion: 0.23
Nodes (8): SuperAdminDashboardPage(), ProvisionTenantModal(), handleSubmit(), SuperAdminKpiStrip(), SuperAdminKpiStripProps, frontend_src_types_index_superadminstats, frontend_src_types_index_tenant, SuperAdminStats

### Community 38 - "lucide-react"
Cohesion: 0.10
Nodes (33): studentColumns, teacherColumns, ColumnProps, getSessionLogColumns(), SessionLogItem, AcademicClass, HistoryFilters(), HistoryFiltersProps (+25 more)

### Community 39 - "Sidebar.tsx"
Cohesion: 0.17
Nodes (15): AdminNavSection(), AdminNavSectionProps, adminLinks, NavItem, setupLinks, superAdminLinks, teacherLinks, teacherReportLinks (+7 more)

### Community 40 - "types/index.ts"
Cohesion: 0.06
Nodes (44): AdminDashboardPage(), ManualAttendanceStats(), AttendanceStatus, SessionRosterPage(), getRosterColumns(), AdminQuickActions(), QuickActionItem, formatEventName() (+36 more)

### Community 41 - "teacher.ts"
Cohesion: 0.07
Nodes (28): StudentFormFieldsProps, EditStudentFormFieldsProps, TeacherFormProfileProps, AssignTeacherFormData, assignTeacherSchema, SystemConfigFormData, systemConfigSchema, LeaveApprovalFormData (+20 more)

### Community 42 - "RealtimeBus"
Cohesion: 0.36
Nodes (3): Any, Publish real-time event to distributed Redis PubSub channel., RealtimeBus

### Community 43 - "schemas/admin.py"
Cohesion: 0.10
Nodes (28): AbsenteeAnomalyItem, AdminStatsResponse, AssignTeacherRequest, AuditLogResponse, BulkImportResponse, ClassBulkCreateRequest, ClassBulkItem, ClassroomBulkCreateRequest (+20 more)

### Community 44 - "SessionService"
Cohesion: 0.24
Nodes (6): start_session(), SessionResponse, SessionStart, SessionScheduler, Mark session as inactive, delete from Redis, and mark all unsubmitted students…, SessionService

### Community 45 - "GlassCombobox.tsx"
Cohesion: 0.33
Nodes (5): ComboboxOption, GlassCombobox(), handleKeyDown(), handleSelect(), GlassComboboxProps

### Community 47 - "api/student.py"
Cohesion: 0.11
Nodes (32): app_repositories_leave_repo, app_schemas_attendance, app_schemas_leave, app_services_attendance_attendance_queue_service, app_services_attendance_service, app_services_biometric_consent_service, app_services_gamification_service, app_services_student_service (+24 more)

### Community 48 - "analyze_attendance"
Cohesion: 0.45
Nodes (11): analyze_attendance(), async_mark_attendance(), mark_attendance(), post, UploadFile, _rate_limit_student(), Run AI scoring and validation without saving the attendance record. Returns…, register_face() (+3 more)

### Community 51 - "frontend/package.json"
Cohesion: 0.07
Nodes (29): eslintConfig, name, private, version, axios, clsx, eslint, eslint-config-next (+21 more)

### Community 52 - "enroll/page.tsx"
Cohesion: 0.09
Nodes (22): classColumns, EnrollHeader(), EnrollHeaderProps, EnrollStudentFilters(), EnrollStudentFiltersProps, EnrollStudentRow(), EnrollStudentRowProps, ClassesPage() (+14 more)

### Community 53 - "TenantDetailResponse"
Cohesion: 0.15
Nodes (14): get_tenant_details(), list_tenants(), put, update_tenant(), TenantDetailResponse, TenantResponse, TenantUpdateRequest, 2. Backend Service Updates (+6 more)

### Community 54 - "api/super_admin.py"
Cohesion: 0.17
Nodes (14): add_tenant_admin(), create_global_broadcast(), delete_tenant(), process_license_request(), provision_tenant(), Any, delete, post (+6 more)

### Community 55 - "leave.py"
Cohesion: 0.29
Nodes (6): LeaveRequestApprove, LeaveRequestCreate, LeaveRequestListResponse, BaseModel, field_validator, date

### Community 57 - "api/admin.py"
Cohesion: 0.08
Nodes (37): app_core_rate_limit, app_schemas_pagination, app_services_absentee_scanner, app_services_admin_service, export_audit_logs(), get_admin_stats(), get_audit_logs(), get_class_by_id() (+29 more)

### Community 58 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, axios, class-variance-authority, clsx, @hookform/resolvers, leaflet, lucide-react, next (+18 more)

### Community 59 - "BulkImportModal.tsx"
Cohesion: 0.18
Nodes (20): getSampleCsv(), buildBatches(), buildBulkPayload(), BULK_BATCH_SIZE, BatchProgressItem, BulkImportEntityType, BulkImportSummary, ImportStage (+12 more)

### Community 60 - "reset-password/page.tsx"
Cohesion: 0.11
Nodes (17): VerifyData, VerifyData, ResetPasswordStatusCard(), ResetPasswordStatusCardProps, StudentMobileAppCallout(), StudentMobileAppCalloutProps, ChangePasswordFormData, changePasswordSchema (+9 more)

### Community 62 - "master_data.py"
Cohesion: 0.20
Nodes (11): ClassroomCreate, ClassroomResponse, ClassroomUpdate, DesignationCreate, DesignationResponse, DesignationUpdate, BaseModel, field_validator (+3 more)

### Community 64 - "pagination.py"
Cohesion: 0.40
Nodes (4): PaginatedResponse, PaginationParams, BaseModel, T

### Community 65 - "package.json"
Cohesion: 0.10
Nodes (20): bin, dev, setup, dependencies, @prisma/client, description, name, private (+12 more)

### Community 67 - "next"
Cohesion: 0.11
Nodes (15): ActiveSessionBanner(), ActiveSessionBannerProps, TeacherDashboardPage(), metadata, ActiveSessionsCard(), ActiveSessionsCardProps, PastSessionsTable(), PastSessionsTableProps (+7 more)

### Community 69 - "auth_service.py"
Cohesion: 0.07
Nodes (31): app_api_dependencies, app_core_config, app_repositories_student_repo, app_repositories_user_repo, app_schemas_auth, app_schemas_teacher, app_services_email_service, app_services_search_service (+23 more)

### Community 71 - "TenantDetail"
Cohesion: 0.28
Nodes (7): TenantAdminsTabProps, TenantHeaderBanner(), TenantHeaderBannerProps, TenantOverviewTab(), TenantOverviewTabProps, TenantPoliciesTabProps, TenantDetail

### Community 72 - "BiometricConsentService"
Cohesion: 0.32
Nodes (3): submit_biometric_consent(), BiometricConsentService, Any

### Community 73 - "CommandPaletteModal.tsx"
Cohesion: 0.32
Nodes (5): getCommandIcon(), CommandPaletteModal(), CommandPaletteModalProps, GlobalSearchResponse, SearchResultItem

### Community 75 - "StudentRepository"
Cohesion: 0.08
Nodes (16): AcademicClass, app_api_ws, app_repositories_class_repo, app_repositories_teacher_repo, app_schemas_admin, ClassRepository, EnrollmentRepository, Student (+8 more)

### Community 77 - "GamificationService"
Cohesion: 0.11
Nodes (10): GamificationService, Return the active Redis client if available., Update a student's score in the Redis leaderboard., Fetch the leaderboard from Redis, falling back to DB if empty., Helper to compatibility-wrap recalculate_student_streak., Rebuild the leaderboard cache from DB data., Recalculate student streak based on historical attendance logs and active…, Fetch top 10 students from Redis cache and load details from DB. (+2 more)

### Community 78 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, eslint, eslint-config-next, jsdom, @playwright/test, tailwindcss, @tailwindcss/postcss, @testing-library/dom (+11 more)

### Community 79 - "GeofenceMap.tsx"
Cohesion: 0.13
Nodes (11): Circle, GeofenceMap(), GeofenceMapProps, MapContainer, Marker, TileLayer, LocationSearchBar(), LocationSearchBarProps (+3 more)

### Community 80 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 81 - "notification.ts"
Cohesion: 0.13
Nodes (21): BroadcastNotificationModal(), BroadcastNotificationModalProps, INITIAL_FORM, AUDIENCE_OPTIONS, CampusBroadcastForm(), CampusBroadcastFormProps, CampusBroadcastPreview(), CampusBroadcastPreviewProps (+13 more)

### Community 82 - "timetable.ts"
Cohesion: 0.15
Nodes (15): Props, StagingCellCard(), StagingCellCardProps, DAYS, TimetableWeeklyGrid(), TimetableWeeklyGridProps, ClashReport, CommitEntryItem (+7 more)

### Community 83 - "🚀 Key Features"
Cohesion: 0.11
Nodes (18): 1. Multi-Layered AI Verification, 1. Prerequisites, 2. Dynamic Location & Geofencing, 2. One-Command Setup, 3. Hardware Device Binding (Anti-Proxy), 3. Running Development Servers, 4. Offline Smart Pass (Encrypted Fallback), 5. Automated Outlier Scanning & Absentee Analytics (+10 more)

### Community 92 - "scim.py"
Cohesion: 0.20
Nodes (14): app_services_scim_service, create_scim_user(), delete_scim_user(), get_scim_user(), get_service_provider_config(), list_scim_users(), Any, delete (+6 more)

### Community 93 - "form.tsx"
Cohesion: 0.18
Nodes (13): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+5 more)

### Community 100 - "AIOrchestrator"
Cohesion: 0.29
Nodes (3): AIOrchestrator, _load_and_crop(), ndarray

### Community 101 - "global_exception_handler"
Cohesion: 0.38
Nodes (7): global_exception_handler(), Request, validation_exception_handler(), Exception, exception_handler, JSONResponse, RequestValidationError

### Community 104 - "Settings"
Cohesion: 0.33
Nodes (3): field_validator, Settings, BaseSettings

### Community 107 - "absentee_scanner.py"
Cohesion: 0.60
Nodes (5): _detect_pattern(), Any, run_absentee_scan(), _run_isolation_forest(), sklearn_ensemble

### Community 108 - "PasswordRequirementsChecklist.tsx"
Cohesion: 0.67
Nodes (3): PasswordRequirementsChecklist(), PasswordRequirementsChecklistProps, usePasswordRules()

### Community 109 - "attendance_service.py"
Cohesion: 0.17
Nodes (10): app_repositories_attendance_repo, app_repositories_enrollment_repo, app_repositories_session_repo, app_services_ai_orchestrator, app_services_attendance_attendance_notifier, app_services_attendance_attendance_recorder, app_services_attendance_geofence_validator, app_services_attendance_models (+2 more)

### Community 117 - "AttendanceTrendChart.tsx"
Cohesion: 0.22
Nodes (5): monthlyData, MonthlyDataPoint, breakdownData, BreakdownItem, recharts

### Community 124 - "get_redis"
Cohesion: 0.11
Nodes (24): app_core_logging_config, app_core_security, app_db_redis, app_repositories_system_config_repo, asyncio, get_logger(), rate_limiter(), dependency() (+16 more)

### Community 125 - "Agent Guidelines & Engineering Standards"
Cohesion: 0.25
Nodes (7): 1. Environment & Configuration Sync, 2. No Hardcoding, 3. No Patches on Patches (Clean Code First), 4. File Structure & Quality Rules, 5. Version Control & Automated Delivery, 6. Database & Prisma Schema Standards, Agent Guidelines & Engineering Standards

### Community 127 - "SessionRepository"
Cohesion: 0.14
Nodes (7): LeaveRepository, LeaveRequest, datetime, SessionRepository, LeaveService, LeaveRequest, Session

### Community 131 - "SystemConfigService"
Cohesion: 0.29
Nodes (5): SystemConfiguration, Gets the system configuration for the specified tenant. If it doesn't exist,…, SystemConfigRepository, SystemConfiguration, SystemConfigService

### Community 134 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 136 - "proxy.ts"
Cohesion: 0.67
Nodes (3): config, parseAuthCookie(), proxy()

### Community 138 - "security_audit_suite.py"
Cohesion: 0.14
Nodes (22): app_schemas_health, app_utils_geofencing, create_access_token(), Any, fastapi_testclient, jwt, main, main() (+14 more)

### Community 145 - "typing"
Cohesion: 0.26
Nodes (3): app_db_client, prisma_models, typing

### Community 154 - "dropdown-menu.tsx"
Cohesion: 0.15
Nodes (12): DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuSeparator, DropdownMenuSub (+4 more)

### Community 160 - "logger.ts"
Cohesion: 0.50
Nodes (3): logger, LogLevel, PREFIX

### Community 188 - "AdminService"
Cohesion: 0.07
Nodes (5): BulkImportService, Check if tenant has enough license capacity for additional users., AdminService, Subject, Subject

### Community 192 - "button.tsx"
Cohesion: 0.24
Nodes (8): Badge(), BadgeProps, badgeVariants, Button, ButtonProps, buttonVariants, class-variance-authority, @radix-ui/react-slot

### Community 201 - "GlassButton.tsx"
Cohesion: 0.14
Nodes (10): colorVariants, colorVariants, TenantAdminsTab(), ButtonSize, ButtonVariant, GlassButtonProps, sizeStyles, variantStyles (+2 more)

### Community 203 - "os"
Cohesion: 0.08
Nodes (25): connect_redis(), disconnect_redis(), _load_liveness_model(), Any, lifespan(), _hash_password(), Production Database Reset & Wipe Script =======================================…, reset_production_database() (+17 more)

## Knowledge Gaps
- **376 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+371 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 697 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **52 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Changes` connect `Changes` to `TenantDetailResponse`?**
  _High betweenness centrality (0.430) - this node is a cross-community bridge._
- **Why does `2. Backend Service Updates` connect `TenantDetailResponse` to `Changes`?**
  _High betweenness centrality (0.424) - this node is a cross-community bridge._
- **Are the 64 inferred relationships involving `AdminService` (e.g. with `assign_teacher()` and `bulk_create_classes()`) actually correct?**
  _`AdminService` has 64 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _376 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08462033462033462 - nodes in this community are weakly interconnected._
- **Should `getApiErrorMessage` be split into smaller, more focused modules?**
  _Cohesion score 0.03176359039190898 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.04459644322845417 - nodes in this community are weakly interconnected._