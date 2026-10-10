# Graph Report - Smart Attandance System  (2026-10-10)

## Corpus Check
- 374 files · ~145,108 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 77 file(s) not represented in the graph (top: .csv 65, (none) 6, .h5 2)

## Summary
- 2564 nodes · 7621 edges · 142 communities (87 shown, 55 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 464 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c1e7bffe`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- next
- getApiErrorMessage
- analytics/page.tsx
- tenant.ts
- attendance.ts
- student_service.py
- StudentService
- utils.ts
- api/timetable.py
- useAuthStore
- cn
- api/teacher.py
- api/auth.py
- SubjectService
- TeacherService
- dev.mjs
- useNotifications.ts
- scanner/page.tsx
- ProvisionTenantModal.tsx
- Changes
- scrape_subjects.py
- argparse
- Changes Required
- AuthService
- notifications.py
- get
- @playwright/test
- api/super_admin.py
- authStore.ts
- main.py
- useDebounce
- _handle_generic_err
- attendance.py
- NotificationFeedItem.tsx
- AttendanceService
- ManualAttendancePage
- admin/dashboard/page.tsx
- select.tsx
- react
- Sidebar.tsx
- types/index.ts
- teacher.ts
- RealtimeBus
- schemas/admin.py
- SessionService
- GlassCombobox.tsx
- GeofenceControls.tsx
- api/student.py
- analyze_attendance
- SuperAdminTenantsPage
- pytest
- frontend/package.json
- EnrollStudentsPage
- TenantDetailResponse
- SuperAdminService
- LeaveRequestResponse
- api/admin.py
- dependencies
- BulkImportModal.tsx
- GlassButton.tsx
- DashboardKpiStrip.tsx
- master_data.py
- admin/layout.tsx
- pagination.py
- package.json
- super-admin/layout.tsx
- teacher/layout.tsx
- .create_designation
- auth_service.py
- smtplib
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
- PasswordRequirementsChecklist.tsx
- next.config.ts
- ReviewQueuePage
- AttendanceTrendChart.tsx
- playwright_async_api
- unittest
- get_redis
- Agent Guidelines & Engineering Standards
- AttendanceRepository
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
- pydantic
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
7. `GlassButton()` - 78 edges
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

## Communities (142 total, 55 thin omitted)

### Community 0 - "next"
Cohesion: 0.10
Nodes (59): SEVERITY_VARIANT, SEMESTER_OPTIONS, INITIAL_FORM, SystemConfig, CohortSummary, DAYS, EditStudentFormFields(), GENDER_OPTIONS (+51 more)

### Community 1 - "getApiErrorMessage"
Cohesion: 0.03
Nodes (88): ForgotPasswordPage(), handleResend(), onSubmit(), OnboardingContent(), checkToken(), onSubmit(), ResetPasswordContent(), checkToken() (+80 more)

### Community 2 - "analytics/page.tsx"
Cohesion: 0.08
Nodes (25): ActiveTab, getSessionLogColumns(), SessionLogItem, AcademicClass, HistoryFilters(), HistoryFiltersProps, AcademicClass, HistoryPage() (+17 more)

### Community 3 - "tenant.ts"
Cohesion: 0.04
Nodes (87): formatDate(), statusVariant(), TenantLicensesPage(), handleSubmitRequest(), SecurityAuditPage(), INITIAL_FORM, SuperAdminDashboardPage(), formatDate() (+79 more)

### Community 4 - "attendance.ts"
Cohesion: 0.09
Nodes (20): AnomalyCardProps, LeaveDocumentModalProps, LeaveReviewDialogProps, AnalyticsOverviewTabProps, StudentsRosterTabProps, AnomalyResult, AttendanceExportRow, AttendanceMatrixResponse (+12 more)

### Community 5 - "student_service.py"
Cohesion: 0.24
Nodes (10): app_repositories_geofence_repo, GeofenceRepository, GeofenceValidator, calculate_haversine_distance(), GPSCoordinate, is_within_geofence(), Validates if student is within the classroom geofence, accounting for GPS…, Geofence (+2 more)

### Community 6 - "StudentService"
Cohesion: 0.15
Nodes (16): scan_smart_pass(), FcmTokenRequest, LeaderboardEntry, LeaderboardResponse, BaseModel, field_validator, SmartPassResponse, StudentAttendanceHistoryResponse (+8 more)

### Community 7 - "utils.ts"
Cohesion: 0.14
Nodes (9): ManualAttendanceStudentRow(), ManualAttendanceStudentRowProps, GlassSlider(), GlassSliderProps, Input, InputProps, Textarea, TextareaProps (+1 more)

### Community 8 - "api/timetable.py"
Cohesion: 0.05
Nodes (57): app_schemas_timetable, app_services_ai_timetable_parser, app_services_timetable_qa_service, app_services_timetable_service, commit_timetable(), create_teacher_substitution(), get_cohort_timetable(), get_student_today_schedule() (+49 more)

### Community 9 - "useAuthStore"
Cohesion: 0.16
Nodes (13): metadata, LoginPage(), handleSuccessRedirect(), onSubmit(), DashboardLayout(), SuspendedPage(), Footer(), Header() (+5 more)

### Community 10 - "cn"
Cohesion: 0.14
Nodes (21): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Skeleton(), Table (+13 more)

### Community 11 - "api/teacher.py"
Cohesion: 0.13
Nodes (33): app_services_leave_service, app_services_session_service, app_services_teacher_service, approve_device_change(), approve_leave(), bulk_mark_attendance(), export_class_attendance(), get_absent_students() (+25 more)

### Community 12 - "api/auth.py"
Cohesion: 0.06
Nodes (56): aiosmtplib, app_core_url_resolver, app_schemas_system_config, app_services_auth_service, app_services_device_change_service, app_services_system_config_service, change_password(), complete_onboarding() (+48 more)

### Community 13 - "SubjectService"
Cohesion: 0.26
Nodes (3): Subject, Subject, SubjectService

### Community 14 - "TeacherService"
Cohesion: 0.15
Nodes (29): AbsentStudentItem, AcademicClassWithGeofenceResponse, AttendanceManualOverride, AttendanceMatrixResponse, AttendanceMatrixSessionItem, AttendanceMatrixStudentItem, BulkAttendanceRecord, BulkMarkRequest (+21 more)

### Community 15 - "dev.mjs"
Cohesion: 0.09
Nodes (32): ref_node_child_process, ref_node_crypto, ref_node_fs, ref_node_path, ref_node_url, checkVenvPythonVersion(), createPython311Venv(), ensureBackendDirectories() (+24 more)

### Community 16 - "useNotifications.ts"
Cohesion: 0.25
Nodes (8): NotificationFilterBarProps, NotificationPopoverProps, NotificationTabs(), NotificationTabsProps, TABS, UseNotificationsReturn, NotificationFilterTab, NotificationListResponse

### Community 17 - "scanner/page.tsx"
Cohesion: 0.29
Nodes (6): AnomalyCard(), getRiskLevel(), WEEKDAYS, ScannerControls(), ScannerControlsProps, frontend_src_types_index_anomalyresult

### Community 18 - "ProvisionTenantModal.tsx"
Cohesion: 0.18
Nodes (13): Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter(), DialogHeader(), DialogOverlay, DialogPortal (+5 more)

### Community 19 - "Changes"
Cohesion: 0.12
Nodes (16): LicenseRequestStatus, 1. Database Schema Updates, 3. Frontend Updates, 4. Testing, 5. Migration, 6. Notes, Changes, Implementation Steps (+8 more)

### Community 20 - "scrape_subjects.py"
Cohesion: 0.10
Nodes (24): clean_str(), process_classrooms_and_labs(), process_faculty_and_departments(), process_students(), process_subjects(), Script to transform raw datasets in temp/ into standard CSV files for bulk…, API-Driven Database Seeder. Uses HTTP REST API exclusively to provision: -…, csv (+16 more)

### Community 22 - "Changes Required"
Cohesion: 0.08
Nodes (20): Classroom, Classroom, 1. Prisma Schema (`backend/prisma/schema.prisma`), 2. Pydantic Schemas, 3. Services, 4. API Routes (`backend/app/api/admin.py`), 5. Test Fixtures (`backend/tests/conftest.py`), 6. Seed Data (`backend/scripts/seeder/data_generator.py`) (+12 more)

### Community 23 - "AuthService"
Cohesion: 0.10
Nodes (20): app_core_security, generate_temporary_password(), hash_password(), StudentCreate, StudentResponse, field_validator, TeacherCreate, TeacherResponse (+12 more)

### Community 24 - "notifications.py"
Cohesion: 0.07
Nodes (50): app_schemas_common, app_schemas_notification, app_services_notification_service, broadcast_notification(), bulk_delete_notifications(), clear_all_notifications(), list_notifications(), mark_all_read() (+42 more)

### Community 25 - "get"
Cohesion: 0.20
Nodes (6): get_global_audit_logs(), get_platform_stats(), get_system_health(), get_tenant_details(), list_license_requests(), get

### Community 27 - "api/super_admin.py"
Cohesion: 0.22
Nodes (18): app_services_super_admin_service, BroadcastHistoryItem, GlobalBroadcastRequest, GlobalUserItem, GlobalUserPasswordResetRequest, GlobalUserStatusUpdateRequest, LicenseRequestCreate, LicenseRequestItem (+10 more)

### Community 28 - "authStore.ts"
Cohesion: 0.27
Nodes (8): SidebarUserFooter(), SidebarUserFooterProps, AuthActions, AuthState, AuthStore, cookieStorage, UserProfile, zustand

### Community 29 - "main.py"
Cohesion: 0.06
Nodes (44): app_api, app_core_config, app_services_s3_service, app_services_scheduler, check_database(), check_redis(), check_s3(), get_health_status() (+36 more)

### Community 30 - "useDebounce"
Cohesion: 0.26
Nodes (11): AdminNotificationsPage(), SuperAdminNotificationsPage(), LeavesPage(), TeacherNotificationsPage(), NotificationFeedList(), NotificationFilterBar(), ActionButtonProps, NotificationHeader() (+3 more)

### Community 31 - "_handle_generic_err"
Cohesion: 0.15
Nodes (40): assign_teacher(), bulk_create_classes(), bulk_create_classrooms(), bulk_create_departments(), bulk_create_designations(), bulk_create_students(), bulk_create_subjects(), bulk_create_teachers() (+32 more)

### Community 32 - "attendance.py"
Cohesion: 0.33
Nodes (7): AttendanceAnalyzeResponse, AttendanceAsyncEnqueueResponse, AttendanceJobStatusResponse, AttendanceMarkResponse, AttendanceReview, BaseModel, field_validator

### Community 33 - "NotificationFeedItem.tsx"
Cohesion: 0.20
Nodes (11): formatRelativeTime(), getCategoryIcon(), NotificationFeedItem(), NotificationFeedItemProps, NotificationFeedListProps, NotificationStatsGridProps, formatRelativeTime(), getIcon() (+3 more)

### Community 34 - "AttendanceService"
Cohesion: 0.17
Nodes (8): AttendanceQueueService, Any, AttendanceSubmission, CachedSession, datetime, AttendanceService, Attendance, dataclasses

### Community 36 - "admin/dashboard/page.tsx"
Cohesion: 0.07
Nodes (29): AuditPage(), ClassesPage(), AdminDashboardPage(), StudentsPage(), TeachersPage(), ActivityDetailModalProps, ActivityCategory, ActivityFilterBar() (+21 more)

### Community 37 - "select.tsx"
Cohesion: 0.25
Nodes (7): Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, @radix-ui/react-select

### Community 38 - "react"
Cohesion: 0.07
Nodes (50): classColumns, EnrollHeader(), EnrollHeaderProps, EnrollStudentFilters(), EnrollStudentFiltersProps, EnrollStudentRow(), EnrollStudentRowProps, studentColumns (+42 more)

### Community 39 - "Sidebar.tsx"
Cohesion: 0.18
Nodes (13): AdminNavSection(), AdminNavSectionProps, adminLinks, NavItem, setupLinks, superAdminLinks, teacherLinks, teacherReportLinks (+5 more)

### Community 40 - "types/index.ts"
Cohesion: 0.06
Nodes (44): TeacherClassesPage(), ActiveSessionBanner(), ActiveSessionBannerProps, TeacherDashboardPage(), ActiveSessionsCard(), ActiveSessionsCardProps, SessionRosterPage(), getRosterColumns() (+36 more)

### Community 41 - "teacher.ts"
Cohesion: 0.05
Nodes (36): GENDER_OPTIONS, SEMESTER_OPTIONS, StudentFormFields(), StudentFormFieldsProps, EditStudentFormFieldsProps, TeacherFormProfileProps, EditTeacherFormFieldsProps, ProvisionAdminAccountsCardProps (+28 more)

### Community 42 - "RealtimeBus"
Cohesion: 0.36
Nodes (3): Any, Publish real-time event to distributed Redis PubSub channel., RealtimeBus

### Community 43 - "schemas/admin.py"
Cohesion: 0.10
Nodes (28): AbsenteeAnomalyItem, AdminStatsResponse, AssignTeacherRequest, AuditLogResponse, BulkImportResponse, ClassBulkCreateRequest, ClassBulkItem, ClassroomBulkCreateRequest (+20 more)

### Community 44 - "SessionService"
Cohesion: 0.22
Nodes (6): start_session(), SessionResponse, SessionStart, SessionScheduler, Mark session as inactive, delete from Redis, and mark all unsubmitted students…, SessionService

### Community 45 - "GlassCombobox.tsx"
Cohesion: 0.33
Nodes (5): ComboboxOption, GlassCombobox(), handleKeyDown(), handleSelect(), GlassComboboxProps

### Community 46 - "GeofenceControls.tsx"
Cohesion: 0.40
Nodes (4): downloadCsv(), GeofenceControls(), GeofenceControlsProps, frontend_src_types_index_attendanceexportrow

### Community 47 - "api/student.py"
Cohesion: 0.15
Nodes (27): app_repositories_leave_repo, app_schemas_attendance, app_schemas_leave, app_services_attendance_attendance_queue_service, app_services_attendance_service, app_services_biometric_consent_service, app_services_gamification_service, app_services_student_service (+19 more)

### Community 48 - "analyze_attendance"
Cohesion: 0.53
Nodes (9): analyze_attendance(), async_mark_attendance(), mark_attendance(), UploadFile, _rate_limit_student(), Run AI scoring and validation without saving the attendance record. Returns…, register_face(), _save_uploaded_image() (+1 more)

### Community 51 - "frontend/package.json"
Cohesion: 0.07
Nodes (27): eslintConfig, name, private, version, axios, clsx, eslint, eslint-config-next (+19 more)

### Community 53 - "TenantDetailResponse"
Cohesion: 0.17
Nodes (13): list_tenants(), put, update_tenant(), TenantDetailResponse, TenantResponse, TenantUpdateRequest, 2. Backend Service Updates, BulkImportService (`backend/app/services/admin/bulk_import_service.py`) (+5 more)

### Community 54 - "SuperAdminService"
Cohesion: 0.14
Nodes (18): add_tenant_admin(), create_global_broadcast(), delete_tenant(), get_all_users(), list_global_broadcasts(), process_license_request(), provision_tenant(), Any (+10 more)

### Community 55 - "LeaveRequestResponse"
Cohesion: 0.27
Nodes (7): LeaveRequestApprove, LeaveRequestCreate, LeaveRequestListResponse, LeaveRequestResponse, BaseModel, field_validator, date

### Community 57 - "api/admin.py"
Cohesion: 0.08
Nodes (39): app_core_rate_limit, app_schemas_master_data, app_schemas_pagination, app_services_absentee_scanner, app_services_admin_service, create_subject(), export_audit_logs(), get_admin_stats() (+31 more)

### Community 58 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, axios, class-variance-authority, clsx, @hookform/resolvers, leaflet, lucide-react, next (+18 more)

### Community 59 - "BulkImportModal.tsx"
Cohesion: 0.18
Nodes (20): getSampleCsv(), buildBatches(), buildBulkPayload(), BULK_BATCH_SIZE, BatchProgressItem, BulkImportEntityType, BulkImportSummary, ImportStage (+12 more)

### Community 60 - "GlassButton.tsx"
Cohesion: 0.07
Nodes (30): VerifyData, VerifyData, colorVariants, colorVariants, ForceChangePasswordData, ForceChangePasswordModalProps, forceChangePasswordSchema, ResetPasswordStatusCard() (+22 more)

### Community 62 - "master_data.py"
Cohesion: 0.20
Nodes (11): ClassroomCreate, ClassroomResponse, ClassroomUpdate, DesignationCreate, DesignationResponse, DesignationUpdate, BaseModel, field_validator (+3 more)

### Community 64 - "pagination.py"
Cohesion: 0.40
Nodes (4): PaginatedResponse, PaginationParams, BaseModel, T

### Community 65 - "package.json"
Cohesion: 0.10
Nodes (20): bin, dev, setup, dependencies, @prisma/client, description, name, private (+12 more)

### Community 69 - "auth_service.py"
Cohesion: 0.11
Nodes (23): app_repositories_student_repo, app_repositories_user_repo, app_schemas_auth, app_schemas_teacher, app_services_email_service, _check_token_revoked(), get_current_student(), get_current_teacher() (+15 more)

### Community 73 - "CommandPaletteModal.tsx"
Cohesion: 0.27
Nodes (6): getCommandIcon(), CommandPaletteModal(), CommandPaletteModalProps, HeaderProps, GlobalSearchResponse, SearchResultItem

### Community 75 - "StudentRepository"
Cohesion: 0.07
Nodes (16): AcademicClass, app_api_ws, app_repositories_class_repo, app_repositories_enrollment_repo, app_repositories_teacher_repo, app_schemas_admin, ClassRepository, EnrollmentRepository (+8 more)

### Community 77 - "GamificationService"
Cohesion: 0.13
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
Cohesion: 0.21
Nodes (13): BroadcastNotificationModal(), BroadcastNotificationModalProps, INITIAL_FORM, AUDIENCE_OPTIONS, CampusBroadcastForm(), CampusBroadcastFormProps, CampusBroadcastPreview(), CampusBroadcastPreviewProps (+5 more)

### Community 82 - "timetable.ts"
Cohesion: 0.14
Nodes (16): Props, StagingCellCard(), StagingCellCardProps, DAYS, TimetableWeeklyGrid(), TimetableWeeklyGridProps, ClashReport, CommitEntryItem (+8 more)

### Community 83 - "🚀 Key Features"
Cohesion: 0.11
Nodes (18): 1. Multi-Layered AI Verification, 1. Prerequisites, 2. Dynamic Location & Geofencing, 2. One-Command Setup, 3. Hardware Device Binding (Anti-Proxy), 3. Running Development Servers, 4. Offline Smart Pass (Encrypted Fallback), 5. Automated Outlier Scanning & Absentee Analytics (+10 more)

### Community 92 - "scim.py"
Cohesion: 0.09
Nodes (26): app_api_dependencies, app_schemas_search, app_services_scim_service, app_services_search_service, RoleChecker, create_scim_user(), delete_scim_user(), get_scim_user() (+18 more)

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

### Community 108 - "PasswordRequirementsChecklist.tsx"
Cohesion: 0.67
Nodes (3): PasswordRequirementsChecklist(), PasswordRequirementsChecklistProps, usePasswordRules()

### Community 117 - "AttendanceTrendChart.tsx"
Cohesion: 0.22
Nodes (5): monthlyData, MonthlyDataPoint, breakdownData, BreakdownItem, recharts

### Community 124 - "get_redis"
Cohesion: 0.10
Nodes (31): app_core_logging_config, app_db_redis, app_repositories_attendance_repo, app_repositories_session_repo, app_repositories_system_config_repo, app_schemas_log, app_services_ai_orchestrator, app_services_attendance_attendance_notifier (+23 more)

### Community 125 - "Agent Guidelines & Engineering Standards"
Cohesion: 0.25
Nodes (7): 1. Environment & Configuration Sync, 2. No Hardcoding, 3. No Patches on Patches (Clean Code First), 4. File Structure & Quality Rules, 5. Version Control & Automated Delivery, 6. Database & Prisma Schema Standards, Agent Guidelines & Engineering Standards

### Community 127 - "AttendanceRepository"
Cohesion: 0.10
Nodes (9): AttendanceRepository, Attendance, LeaveRepository, LeaveRequest, datetime, SessionRepository, LeaveService, LeaveRequest (+1 more)

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
Cohesion: 0.13
Nodes (24): app_schemas_health, app_utils_geofencing, create_access_token(), decode_access_token(), Any, bcrypt, fastapi_testclient, jwt (+16 more)

### Community 145 - "typing"
Cohesion: 0.13
Nodes (19): app_db_client, app_schemas_student, app_schemas_super_admin, app_services_admin_audit_export_service, app_services_admin_bulk_import_service, app_services_admin_class_admin_service, app_services_admin_classroom_service, app_services_admin_department_service (+11 more)

### Community 154 - "dropdown-menu.tsx"
Cohesion: 0.15
Nodes (12): DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuSeparator, DropdownMenuSub (+4 more)

### Community 160 - "logger.ts"
Cohesion: 0.50
Nodes (3): logger, LogLevel, PREFIX

### Community 188 - "AdminService"
Cohesion: 0.07
Nodes (6): ClassCreate, ClassResponse, ClassAdminService, Department, AdminService, Department

### Community 192 - "button.tsx"
Cohesion: 0.24
Nodes (8): Badge(), BadgeProps, badgeVariants, Button, ButtonProps, buttonVariants, class-variance-authority, @radix-ui/react-slot

### Community 203 - "pydantic"
Cohesion: 0.07
Nodes (23): _load_liveness_model(), Any, Service Health & Connectivity Checker Checks AWS S3 and PostgreSQL RDS…, boto3, botocore_config, botocore_exceptions, cv2, deepface (+15 more)

## Knowledge Gaps
- **357 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+352 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 677 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **55 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Changes` connect `Changes` to `TenantDetailResponse`?**
  _High betweenness centrality (0.433) - this node is a cross-community bridge._
- **Why does `2. Backend Service Updates` connect `TenantDetailResponse` to `Changes`?**
  _High betweenness centrality (0.432) - this node is a cross-community bridge._
- **Are the 64 inferred relationships involving `AdminService` (e.g. with `assign_teacher()` and `bulk_create_classes()`) actually correct?**
  _`AdminService` has 64 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _357 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.10201465201465201 - nodes in this community are weakly interconnected._
- **Should `getApiErrorMessage` be split into smaller, more focused modules?**
  _Cohesion score 0.03445650104702075 - nodes in this community are weakly interconnected._
- **Should `analytics/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08235294117647059 - nodes in this community are weakly interconnected._