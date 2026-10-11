# Graph Report - Smart Attandance System  (2026-10-10)

## Corpus Check
- 534 files · ~188,642 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 90 file(s) not represented in the graph (top: .csv 65, (none) 8, .xml 7)

## Summary
- 4456 nodes · 10574 edges · 203 communities (146 shown, 57 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 464 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `30805fdc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- GlassButton.tsx
- getApiErrorMessage
- package:flutter_riverpod/flutter_riverpod.dart
- tenant.ts
- GeofenceControls.tsx
- student_service.py
- StudentService
- package:smart_attendance_app/app/theme.dart
- api/timetable.py
- useAuthStore
- cn
- api/teacher.py
- api/auth.py
- package:flutter/material.dart
- TeacherService
- dev.mjs
- NotificationPopover.tsx
- String?
- verification_ai_review_card.dart
- Changes
- scrape_subjects.py
- argparse
- ClassroomService
- auth_service.py
- notifications.py
- get
- @playwright/test
- api/super_admin.py
- authStore.ts
- main.py
- admin/notifications/page.tsx
- _handle_generic_err
- attendance.py
- NotificationFeedItem.tsx
- AttendanceService
- verification_screen.dart
- types/index.ts
- select.tsx
- lucide-react
- Sidebar.tsx
- teacher/dashboard/page.tsx
- classes/[id]/edit/page.tsx
- get_redis
- schemas/admin.py
- SessionService
- reset_password_screen.dart
- session_provider.dart
- api/student.py
- analyze_attendance
- SuperAdminTenantsPage
- pytest
- frontend/package.json
- user.dart
- TenantDetailResponse
- SuperAdminService
- leave.py
- face_registration_screen.dart
- api/admin.py
- dependencies
- BulkImportModal.tsx
- GlassBadge.tsx
- DashboardKpiStrip.tsx
- master_data.py
- theme.dart
- pydantic
- package.json
- preferences_service.dart
- verification_step_content.dart
- DesignationService
- dependencies.py
- auth_repository.dart
- smtplib
- BiometricConsentService
- geofence_verification_provider.dart
- app_services_realtime_bus
- admin_service.py
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
- hive_service.dart
- react
- websocket_service.dart
- next.config.ts
- attendance.dart
- router.dart
- smart_pass_provider.dart
- glass_button.dart
- auth_provider.dart
- flagged_detail_screen.dart
- AttendanceTrendChart.tsx
- playwright_async_api
- attendance_provider.dart
- List
- unittest
- result_config.dart
- leave_requests_screen.dart
- typing
- Agent Guidelines & Engineering Standards
- glass_input.dart
- SessionRepository
- student_api.dart
- secure_storage.dart
- attendance_utils.dart
- constants.dart
- notification_api.dart
- notification_service.dart
- scripts
- verification_preview_frame.dart
- proxy.ts
- ref_playwright
- security_audit_suite.py
- history_provider.dart
- attendance_constants.dart
- leave_request.dart
- smart_pass_screen.dart
- attendance_repository.dart
- offline_sync_service.dart
- DepartmentService
- notification_tile.dart
- reset_password_provider.dart
- splash_screen.dart
- main.dart
- device_change_dialog.dart
- geofence_status_card.dart
- logs.py
- permission_service.dart
- dropdown-menu.tsx
- app_notification.dart
- history_list_tab.dart
- WebSocketClient
- AttendanceRepository
- StudentCreate
- logger.ts
- student_stats.dart
- manifest.json
- register_fcm_token
- frontend/README.md
- resolve_frontend_url
- ActivityFilterBar.tsx
- rich
- rules/graphify.md
- workflows/graphify.md
- backend/README.md
- leaderboard_provider.dart
- postcss.config.mjs
- leaderboard_item_card.dart
- prepare_bulk_datasets.py
- frontend_node_modules_playwright_test_index
- logger.dart
- _SmartPassScreenState
- system_configuration.dart
- build
- location_exceptions.dart
- FlutterActivity
- smart_attendance_app
- RouterNotifier
- AppHttpOverrides
- AdminService
- AttendanceRepository
- button.tsx
- DateTime?
- Exception
- LeaderboardResponse?
- T
- app_middleware_request_logging
- app/layout.tsx
- ai_orchestrator.py
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

## Communities (203 total, 57 thin omitted)

### Community 0 - "GlassButton.tsx"
Cohesion: 0.04
Nodes (100): VerifyData, VerifyData, EnrollStudentFiltersProps, ScannerControls(), ScannerControlsProps, CreateClassroomPage(), onSubmit(), CreateDepartmentPage() (+92 more)

### Community 1 - "getApiErrorMessage"
Cohesion: 0.03
Nodes (89): ForgotPasswordPage(), handleResend(), onSubmit(), LoginPage(), handleSuccessRedirect(), onSubmit(), OnboardingContent(), checkToken() (+81 more)

### Community 2 - "package:flutter_riverpod/flutter_riverpod.dart"
Cohesion: 0.03
Nodes (101): ConsumerWidget, notificationsLoadingProvider, notificationsProvider, pendingCountProvider, leaderboardProvider, AnalyticsScreen, _AnalyticsScreenState, build (+93 more)

### Community 3 - "tenant.ts"
Cohesion: 0.04
Nodes (75): formatDate(), statusVariant(), TenantLicensesPage(), handleSubmitRequest(), INITIAL_FORM, SuperAdminBroadcastsPage(), SuperAdminDashboardPage(), formatDate() (+67 more)

### Community 4 - "GeofenceControls.tsx"
Cohesion: 0.08
Nodes (23): downloadCsv(), GeofenceControls(), GeofenceControlsProps, StudentHistoryModalProps, FilterTier, StudentsRosterTab(), StudentsRosterTabProps, AttendanceExportRow (+15 more)

### Community 5 - "student_service.py"
Cohesion: 0.15
Nodes (14): app_repositories_geofence_repo, GeofenceRepository, Gets the system configuration for the specified tenant. If it doesn't exist,…, SystemConfigRepository, GeofenceValidator, SystemConfigService, calculate_haversine_distance(), GPSCoordinate (+6 more)

### Community 6 - "StudentService"
Cohesion: 0.24
Nodes (12): LeaderboardEntry, LeaderboardResponse, BaseModel, SmartPassResponse, StudentAttendanceHistoryResponse, StudentAttendanceItem, StudentClassResponse, StudentSmartPassScanRequest (+4 more)

### Community 7 - "package:smart_attendance_app/app/theme.dart"
Cohesion: 0.03
Nodes (86): AttendanceHistoryItem, AttendanceHistoryResponse, AnalyticsKpiOverview, build, data, target, AnalyticsSubjectGoals, build (+78 more)

### Community 8 - "api/timetable.py"
Cohesion: 0.05
Nodes (57): app_schemas_timetable, app_services_ai_timetable_parser, app_services_timetable_qa_service, app_services_timetable_service, commit_timetable(), create_teacher_substitution(), get_cohort_timetable(), get_student_today_schedule() (+49 more)

### Community 9 - "useAuthStore"
Cohesion: 0.20
Nodes (9): metadata, DashboardLayout(), SuspendedPage(), Footer(), Header(), NotificationPopover(), usePlatformWebSocket(), WsMessage (+1 more)

### Community 10 - "cn"
Cohesion: 0.06
Nodes (47): ManualAttendanceStudentRow(), ManualAttendanceStudentRowProps, ProvisionTenantModalProps, Card, CardContent, CardDescription, CardFooter, CardHeader (+39 more)

### Community 11 - "api/teacher.py"
Cohesion: 0.14
Nodes (32): app_services_device_change_service, app_services_leave_service, app_services_session_service, app_services_teacher_service, approve_device_change(), approve_leave(), bulk_mark_attendance(), export_class_attendance() (+24 more)

### Community 12 - "api/auth.py"
Cohesion: 0.11
Nodes (40): app_schemas_system_config, app_services_auth_service, change_password(), complete_onboarding(), forgot_password(), get_me(), get_public_system_config(), get_sso_config() (+32 more)

### Community 13 - "package:flutter/material.dart"
Cohesion: 0.03
Nodes (81): slideRightPage, slideUpPage, build, child, ShellScaffold, _tabPaths, build, email (+73 more)

### Community 14 - "TeacherService"
Cohesion: 0.14
Nodes (30): AbsentStudentItem, AcademicClassWithGeofenceResponse, AttendanceManualOverride, AttendanceMatrixResponse, AttendanceMatrixSessionItem, AttendanceMatrixStudentItem, BulkAttendanceRecord, BulkMarkRequest (+22 more)

### Community 15 - "dev.mjs"
Cohesion: 0.09
Nodes (32): ref_node_child_process, ref_node_crypto, ref_node_fs, ref_node_path, ref_node_url, checkVenvPythonVersion(), createPython311Venv(), ensureBackendDirectories() (+24 more)

### Community 16 - "NotificationPopover.tsx"
Cohesion: 0.29
Nodes (7): NotificationPopoverProps, formatRelativeTime(), getIcon(), NotificationItemRow(), NotificationItemRowProps, NotificationTabs(), TABS

### Community 17 - "String?"
Cohesion: 0.02
Nodes (82): Color, dart:ui, IconData?, build, isSecondaryGhost, onPrimaryPressed, onSecondaryPressed, primaryIcon (+74 more)

### Community 18 - "verification_ai_review_card.dart"
Cohesion: 0.03
Nodes (68): AnimationController, CustomPainter, AttendanceAnalysisResult, GeofenceStatus, build, createState, desc, _expanded (+60 more)

### Community 19 - "Changes"
Cohesion: 0.12
Nodes (16): LicenseRequestStatus, 1. Database Schema Updates, 3. Frontend Updates, 4. Testing, 5. Migration, 6. Notes, Changes, Implementation Steps (+8 more)

### Community 20 - "scrape_subjects.py"
Cohesion: 0.23
Nodes (14): html, fetch_department_urls(), fetch_url(), get_name_initials(), main(), parse_faculty_cards(), clean(), fetch_url() (+6 more)

### Community 22 - "ClassroomService"
Cohesion: 0.08
Nodes (21): ClassroomService, Classroom, Classroom, 1. Prisma Schema (`backend/prisma/schema.prisma`), 2. Pydantic Schemas, 3. Services, 4. API Routes (`backend/app/api/admin.py`), 5. Test Fixtures (`backend/tests/conftest.py`) (+13 more)

### Community 23 - "auth_service.py"
Cohesion: 0.08
Nodes (27): app_core_security, app_repositories_user_repo, app_schemas_auth, app_schemas_student, app_schemas_super_admin, app_schemas_teacher, app_services_email_service, app_services_super_admin_service (+19 more)

### Community 24 - "notifications.py"
Cohesion: 0.07
Nodes (48): app_schemas_common, app_schemas_notification, app_services_notification_service, broadcast_notification(), bulk_delete_notifications(), clear_all_notifications(), list_notifications(), mark_all_read() (+40 more)

### Community 25 - "get"
Cohesion: 0.22
Nodes (5): get_all_users(), get_global_audit_logs(), get_platform_stats(), list_global_broadcasts(), get

### Community 27 - "api/super_admin.py"
Cohesion: 0.23
Nodes (17): BroadcastHistoryItem, GlobalBroadcastRequest, GlobalUserItem, GlobalUserPasswordResetRequest, GlobalUserStatusUpdateRequest, LicenseRequestCreate, LicenseRequestItem, LicenseRequestProcessedResponse (+9 more)

### Community 28 - "authStore.ts"
Cohesion: 0.31
Nodes (7): SidebarUserFooter(), SidebarUserFooterProps, AuthActions, AuthState, AuthStore, cookieStorage, UserProfile

### Community 29 - "main.py"
Cohesion: 0.07
Nodes (34): app_api, app_core_config, app_services_s3_service, app_services_scheduler, check_database(), check_redis(), check_s3(), get_health_status() (+26 more)

### Community 30 - "admin/notifications/page.tsx"
Cohesion: 0.20
Nodes (12): AdminNotificationsPage(), SuperAdminNotificationsPage(), TeacherNotificationsPage(), NotificationFeedList(), NotificationFilterBar(), NotificationFilterBarProps, ActionButtonProps, NotificationHeader() (+4 more)

### Community 31 - "_handle_generic_err"
Cohesion: 0.14
Nodes (43): assign_teacher(), bulk_create_classes(), bulk_create_classrooms(), bulk_create_departments(), bulk_create_designations(), bulk_create_students(), bulk_create_subjects(), bulk_create_teachers() (+35 more)

### Community 32 - "attendance.py"
Cohesion: 0.25
Nodes (9): confirm_attendance(), Confirm a previously analyzed attendance submission. Accepts the review_token…, AttendanceAnalyzeResponse, AttendanceAsyncEnqueueResponse, AttendanceJobStatusResponse, AttendanceMarkResponse, AttendanceReview, BaseModel (+1 more)

### Community 33 - "NotificationFeedItem.tsx"
Cohesion: 0.29
Nodes (7): formatRelativeTime(), getCategoryIcon(), NotificationFeedItem(), NotificationFeedItemProps, NotificationFeedListProps, NotificationStatsGridProps, NotificationItem

### Community 34 - "AttendanceService"
Cohesion: 0.17
Nodes (8): AttendanceQueueService, Any, AttendanceSubmission, CachedSession, datetime, AttendanceService, Attendance, dataclasses

### Community 35 - "verification_screen.dart"
Cohesion: 0.05
Nodes (59): ConsumerState, ConsumerStatefulWidget, build, createState, dispose, _handleNotificationClick, inferNotificationSeverity, _initializeFcm (+51 more)

### Community 36 - "types/index.ts"
Cohesion: 0.06
Nodes (38): AdminDashboardPage(), LeaveDocumentModalProps, LeaveReviewDialogProps, ActivityDetailModalProps, ActivityLogTableProps, AdminQuickActions(), QuickActionItem, formatEventName() (+30 more)

### Community 37 - "select.tsx"
Cohesion: 0.25
Nodes (7): Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, @radix-ui/react-select

### Community 38 - "lucide-react"
Cohesion: 0.09
Nodes (50): SEVERITY_VARIANT, classColumns, INITIAL_FORM, SystemConfig, CohortSummary, DAYS, studentColumns, ActiveTab (+42 more)

### Community 39 - "Sidebar.tsx"
Cohesion: 0.17
Nodes (15): AdminNavSection(), AdminNavSectionProps, adminLinks, NavItem, setupLinks, superAdminLinks, teacherLinks, teacherReportLinks (+7 more)

### Community 40 - "teacher/dashboard/page.tsx"
Cohesion: 0.13
Nodes (16): ActiveSessionBanner(), ActiveSessionBannerProps, TeacherDashboardPage(), PastSessionsTableProps, AnalyticsOverviewTab(), AnalyticsOverviewTabProps, TeacherQuickActions(), Props (+8 more)

### Community 41 - "classes/[id]/edit/page.tsx"
Cohesion: 0.08
Nodes (31): SEMESTER_OPTIONS, TeachersPage(), teacherColumns, AcademicClass, HistoryFilters(), HistoryFiltersProps, EnterpriseTableToolbar(), EnterpriseTableToolbarProps (+23 more)

### Community 42 - "get_redis"
Cohesion: 0.10
Nodes (16): rate_limiter(), dependency(), Sliding window rate limiter using Redis sorted sets. Keyed by IP address and…, connect_redis(), disconnect_redis(), get_redis(), Request, Any (+8 more)

### Community 43 - "schemas/admin.py"
Cohesion: 0.10
Nodes (29): AbsenteeAnomalyItem, AdminStatsResponse, AssignTeacherRequest, AuditLogResponse, BulkImportResponse, ClassBulkCreateRequest, ClassBulkItem, ClassCreate (+21 more)

### Community 44 - "SessionService"
Cohesion: 0.22
Nodes (7): start_session(), SessionResponse, SessionStart, notify_teacher_session_concluded(), SessionScheduler, Mark session as inactive, delete from Redis, and mark all unsubmitted students…, SessionService

### Community 45 - "reset_password_screen.dart"
Cohesion: 0.05
Nodes (53): class, Container, FormState, authProvider, resetPasswordProvider, build, _confirmPasswordController, createState (+45 more)

### Community 46 - "session_provider.dart"
Cohesion: 0.04
Nodes (52): dart:async, Duration?, AppEvents, _authErrorController, authErrorStream, broadcastAuthError, _adjustPollInterval, _api (+44 more)

### Community 47 - "api/student.py"
Cohesion: 0.17
Nodes (23): app_repositories_leave_repo, app_schemas_attendance, app_schemas_leave, app_services_attendance_attendance_queue_service, app_services_attendance_service, app_services_biometric_consent_service, app_services_gamification_service, app_services_student_service (+15 more)

### Community 48 - "analyze_attendance"
Cohesion: 0.45
Nodes (11): analyze_attendance(), async_mark_attendance(), mark_attendance(), post, UploadFile, _rate_limit_student(), Run AI scoring and validation without saving the attendance record. Returns…, register_face() (+3 more)

### Community 51 - "frontend/package.json"
Cohesion: 0.07
Nodes (27): eslintConfig, name, private, version, axios, clsx, eslint, eslint-config-next (+19 more)

### Community 52 - "user.dart"
Cohesion: 0.04
Nodes (46): int?, AppException, AuthException, message, NetworkException, ServerException, statusCode, toString (+38 more)

### Community 53 - "TenantDetailResponse"
Cohesion: 0.15
Nodes (14): get_tenant_details(), list_tenants(), put, update_tenant(), TenantDetailResponse, TenantResponse, TenantUpdateRequest, 2. Backend Service Updates (+6 more)

### Community 54 - "SuperAdminService"
Cohesion: 0.14
Nodes (18): add_tenant_admin(), create_global_broadcast(), delete_tenant(), get_system_health(), list_license_requests(), process_license_request(), provision_tenant(), Any (+10 more)

### Community 55 - "leave.py"
Cohesion: 0.29
Nodes (6): LeaveRequestApprove, LeaveRequestCreate, LeaveRequestListResponse, BaseModel, field_validator, date

### Community 56 - "face_registration_screen.dart"
Cohesion: 0.05
Nodes (44): CameraController?, blurScore, brightnessScore, camera, cameraError, capturePhoto, disposeCamera, initCamera (+36 more)

### Community 57 - "api/admin.py"
Cohesion: 0.10
Nodes (31): app_core_rate_limit, app_schemas_master_data, app_schemas_pagination, app_services_absentee_scanner, app_services_admin_service, export_audit_logs(), get_admin_stats(), get_audit_logs() (+23 more)

### Community 58 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, axios, class-variance-authority, clsx, @hookform/resolvers, leaflet, lucide-react, next (+18 more)

### Community 59 - "BulkImportModal.tsx"
Cohesion: 0.18
Nodes (20): getSampleCsv(), buildBatches(), buildBulkPayload(), BULK_BATCH_SIZE, BatchProgressItem, BulkImportEntityType, BulkImportSummary, ImportStage (+12 more)

### Community 60 - "GlassBadge.tsx"
Cohesion: 0.07
Nodes (32): EnrollHeader(), EnrollHeaderProps, EnrollStudentFilters(), EnrollStudentRow(), EnrollStudentRowProps, AnomalyCard(), AnomalyCardProps, getRiskLevel() (+24 more)

### Community 62 - "master_data.py"
Cohesion: 0.20
Nodes (11): ClassroomCreate, ClassroomResponse, ClassroomUpdate, DesignationCreate, DesignationResponse, DesignationUpdate, BaseModel, field_validator (+3 more)

### Community 63 - "theme.dart"
Cohesion: 0.04
Nodes (45): accentAmber, accentEmerald, accentPink, accentTeal, baseText, bgCanvas, bgPrimary, bgSecondary (+37 more)

### Community 64 - "pydantic"
Cohesion: 0.18
Nodes (10): patch, update_system_config(), PaginatedResponse, PaginationParams, BaseModel, T, BaseModel, SystemConfigResponse (+2 more)

### Community 65 - "package.json"
Cohesion: 0.10
Nodes (20): bin, dev, setup, dependencies, @prisma/client, description, name, private (+12 more)

### Community 66 - "preferences_service.dart"
Cohesion: 0.04
Nodes (44): getAttendanceTarget, getLowAttendanceThreshold, getNotifyClassStart, getNotifyLowAttendance, getNotifySyncDone, getNotifyWindowOpen, isFirstCameraUse, _keyAttendanceTarget (+36 more)

### Community 67 - "verification_step_content.dart"
Cohesion: 0.05
Nodes (40): VerificationStep, build, build, isCameraReady, onAnalyze, onCapture, onRetake, onSubmit (+32 more)

### Community 68 - "DesignationService"
Cohesion: 0.26
Nodes (3): DesignationService, Designation, Designation

### Community 69 - "dependencies.py"
Cohesion: 0.13
Nodes (16): _check_token_revoked(), get_current_student(), get_current_teacher(), get_current_user(), get_current_user_from_token(), get_tenant_context(), Student, Teacher (+8 more)

### Community 70 - "auth_repository.dart"
Cohesion: 0.06
Nodes (37): Dio, AuthApi, authApiProvider, changePassword, _dio, getProfile, login, logout (+29 more)

### Community 72 - "BiometricConsentService"
Cohesion: 0.32
Nodes (3): submit_biometric_consent(), BiometricConsentService, Any

### Community 73 - "geofence_verification_provider.dart"
Cohesion: 0.06
Nodes (35): AutoDisposeNotifier, dart:math, describeDistance, GeofenceCalculator, isWithinGeofence, describeDistance, ensurePermissionsGranted, getAveragedPosition (+27 more)

### Community 75 - "admin_service.py"
Cohesion: 0.08
Nodes (25): AcademicClass, app_api_ws, app_repositories_class_repo, app_repositories_enrollment_repo, app_repositories_student_repo, app_repositories_teacher_repo, app_schemas_admin, app_services_admin_audit_export_service (+17 more)

### Community 77 - "GamificationService"
Cohesion: 0.10
Nodes (12): AttendanceRecorder, Attendance, GamificationService, Return the active Redis client if available., Update a student's score in the Redis leaderboard., Fetch the leaderboard from Redis, falling back to DB if empty., Helper to compatibility-wrap recalculate_student_streak., Rebuild the leaderboard cache from DB data. (+4 more)

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
Cohesion: 0.20
Nodes (14): BroadcastNotificationModal(), BroadcastNotificationModalProps, INITIAL_FORM, AUDIENCE_OPTIONS, CampusBroadcastForm(), CampusBroadcastFormProps, CampusBroadcastPreview(), CampusBroadcastPreviewProps (+6 more)

### Community 82 - "timetable.ts"
Cohesion: 0.17
Nodes (13): StagingCellCard(), StagingCellCardProps, DAYS, TimetableWeeklyGrid(), TimetableWeeklyGridProps, ClashReport, CommitEntryItem, CommitTimetableRequest (+5 more)

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
Nodes (7): global_exception_handler(), Exception, Request, validation_exception_handler(), exception_handler, JSONResponse, RequestValidationError

### Community 104 - "Settings"
Cohesion: 0.33
Nodes (3): field_validator, Settings, BaseSettings

### Community 107 - "hive_service.dart"
Cohesion: 0.06
Nodes (35): @HiveType, Box, dart:convert, HiveObject, hashCode, OfflineAttendancePayloadAdapter, operator, read (+27 more)

### Community 108 - "react"
Cohesion: 0.05
Nodes (41): AuditDetailForensicsPage(), loadAuditLog(), AuditPage(), ClassesPage(), metadata, StudentsPage(), SecurityAuditPage(), metadata (+33 more)

### Community 109 - "websocket_service.dart"
Cohesion: 0.06
Nodes (34): computeRouterRedirect, null, authState, _channel, connect, disconnect, dispose, _maxReconnectAttempts (+26 more)

### Community 110 - "next.config.ts"
Cohesion: 0.33
Nodes (4): nextConfig, ref_path, @vitejs/plugin-react, vitest

### Community 111 - "attendance.dart"
Cohesion: 0.06
Nodes (33): activeSessionId, attendanceId, backgroundScore, classId, className, createdAt, faceScore, finalAiScore (+25 more)

### Community 112 - "router.dart"
Cohesion: 0.06
Nodes (32): GoRouter, notifier, notify, rootNavigatorKey, routerNotifierProvider, shellNavigatorKey, NavigatorState, package:smart_attendance_app/app/page_transitions.dart (+24 more)

### Community 113 - "smart_pass_provider.dart"
Cohesion: 0.07
Nodes (29): Duration get, attendanceStatus, className, enrollmentNumber, expiresAt, fromJson, isExpired, markedAt (+21 more)

### Community 114 - "glass_button.dart"
Cohesion: 0.07
Nodes (28): EdgeInsetsGeometry, background, border, build, _ButtonColors, fontSize, foreground, GlassButton (+20 more)

### Community 115 - "auth_provider.dart"
Cohesion: 0.07
Nodes (27): dio, _extractDetail, mapDioError, normalizedBaseUrl, storage, AuthStatus, _authErrorSubscription, AuthNotifier (+19 more)

### Community 116 - "flagged_detail_screen.dart"
Cohesion: 0.08
Nodes (28): attendanceRepositoryProvider, attendanceId, build, createState, dispose, FlaggedDetailScreen, _FlaggedDetailScreenState, initState (+20 more)

### Community 117 - "AttendanceTrendChart.tsx"
Cohesion: 0.22
Nodes (5): monthlyData, MonthlyDataPoint, breakdownData, BreakdownItem, recharts

### Community 119 - "attendance_provider.dart"
Cohesion: 0.07
Nodes (27): DateTimeFormatting, formattedDate, formattedDateTime, isSameDay, shortDate, StringFormatting, truncate, accuracy (+19 more)

### Community 120 - "List"
Cohesion: 0.07
Nodes (24): List, NotificationsNotifier, activeStepIndex, build, stepLabels, subtitle, title, VerificationStatusOverlay (+16 more)

### Community 122 - "result_config.dart"
Cohesion: 0.08
Nodes (24): background, color, error, face, flagged, icon, liveness, offline (+16 more)

### Community 123 - "leave_requests_screen.dart"
Cohesion: 0.08
Nodes (24): File?, build, createState, dispose, _endDate, _isSubmitting, LeaveRequestsScreen, _LeaveRequestsScreenState (+16 more)

### Community 124 - "typing"
Cohesion: 0.09
Nodes (30): app_core_logging_config, app_db_client, app_db_redis, app_repositories_attendance_repo, app_repositories_session_repo, app_repositories_system_config_repo, app_services_ai_orchestrator, app_services_attendance_attendance_notifier (+22 more)

### Community 125 - "Agent Guidelines & Engineering Standards"
Cohesion: 0.22
Nodes (8): 1. Environment & Configuration Sync, 2. No Hardcoding, 3. No Patches on Patches (Clean Code First), 4. File Structure & Quality Rules, 5. Version Control & Automated Delivery, 6. Database & Prisma Schema Standards, 7. Branching Strategy & Production Deployment Policy, Agent Guidelines & Engineering Standards

### Community 126 - "glass_input.dart"
Cohesion: 0.08
Nodes (24): FocusNode?, build, controller, FlaggedNoteForm, isSubmitting, noteSubmitted, onSubmit, build (+16 more)

### Community 127 - "SessionRepository"
Cohesion: 0.15
Nodes (6): LeaveRepository, datetime, SessionRepository, LeaveService, LeaveRequest, Session

### Community 128 - "student_api.dart"
Cohesion: 0.08
Nodes (23): dart:io, analyzeAttendance, confirmAttendance, createLeaveRequest, _dio, getLeaderboard, getMyAttendance, getMyClasses (+15 more)

### Community 129 - "secure_storage.dart"
Cohesion: 0.08
Nodes (23): DeviceInfoPlugin, FlutterSecureStorage, _deviceInfo, DeviceService, getDeviceUUID, _secureStorage, clearAll, getDeviceUUID (+15 more)

### Community 130 - "attendance_utils.dart"
Cohesion: 0.08
Nodes (24): calculateHighestStreak, calculateStreak, canMiss, computeAttendanceNeeds, computeSubjectPct, computeWeekPresent, countAbsent, countFlagged (+16 more)

### Community 131 - "constants.dart"
Cohesion: 0.08
Nodes (24): defineUrl, envUrl, kConnectTimeout, kGeofenceGraceMeters, kGpsAveragingSamples, kGpsTimeoutSeconds, kHiveBoxConfig, kHiveBoxNotifications (+16 more)

### Community 132 - "notification_api.dart"
Cohesion: 0.08
Nodes (23): category, createdAt, deleteNotification, _dio, fromJson, getNotifications, id, isRead (+15 more)

### Community 133 - "notification_service.dart"
Cohesion: 0.08
Nodes (23): WebSocketService, addNotification, _api, _box, clear, clearAll, deleteNotification, dispose (+15 more)

### Community 134 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:e2e, type-check

### Community 135 - "verification_preview_frame.dart"
Cohesion: 0.09
Nodes (20): bool get, double?, blurScore, brightnessScore, build, imagePath, isAnalyzingQuality, isPoorQuality (+12 more)

### Community 136 - "proxy.ts"
Cohesion: 0.67
Nodes (3): config, parseAuthCookie(), proxy()

### Community 138 - "security_audit_suite.py"
Cohesion: 0.14
Nodes (23): app_schemas_health, app_utils_geofencing, create_access_token(), decode_access_token(), Any, bcrypt, fastapi_testclient, jwt (+15 more)

### Community 139 - "history_provider.dart"
Cohesion: 0.10
Nodes (21): data, errorMessage, fetch, HistoryNotifier, HistoryState, isLoading, notifier, _repo (+13 more)

### Community 140 - "attendance_constants.dart"
Cohesion: 0.09
Nodes (21): kAttendanceTypeLocal, kAttendanceTypePush, kGoodScoreThreshold, kImagePickQuality, kMinBrightnessForPhoto, kMinSharpnessForPhoto, kNoteMaxChars, kOverallGoodPct (+13 more)

### Community 141 - "leave_request.dart"
Cohesion: 0.09
Nodes (21): approved, approvedBy, approverNote, createdAt, documentUrl, endDate, enrollmentNumber, fromJson (+13 more)

### Community 142 - "smart_pass_screen.dart"
Cohesion: 0.10
Nodes (21): smartPassProvider, build, _buildErrorBanner, _buildLiveScanner, _buildPermissionCard, _buildSuccessCard, _checkingPermission, createState (+13 more)

### Community 143 - "attendance_repository.dart"
Cohesion: 0.10
Nodes (20): analyzeAttendance, AttendanceRepository, AttendanceSubmitResult, confirmAttendance, getHistory, _hive, OfflineQueued, OnlineResult (+12 more)

### Community 144 - "offline_sync_service.dart"
Cohesion: 0.10
Nodes (19): NotificationService, _className, _connectivitySub, _deleteImageFile, _dio, dispose, _handleSyncError, _hive (+11 more)

### Community 145 - "DepartmentService"
Cohesion: 0.26
Nodes (3): DepartmentService, Department, Department

### Community 146 - "notification_tile.dart"
Cohesion: 0.11
Nodes (17): Map, LocalNotification, build, CalendarMonthGrid, focusedMonth, grouped, onSelectDate, selectedDate (+9 more)

### Community 147 - "reset_password_provider.dart"
Cohesion: 0.11
Nodes (18): PendingCountNotifier, AuthRepository, copyWith, email, errorMessage, isSubmitting, isSuccess, isValid (+10 more)

### Community 148 - "splash_screen.dart"
Cohesion: 0.12
Nodes (16): Animation, animation, build, hint, icon, label, ReviewScoreRow, score (+8 more)

### Community 149 - "main.dart"
Cohesion: 0.13
Nodes (15): @pragma, addNotification, callbackDispatcher, createHttpClient, _firebaseMessagingBackgroundHandler, initialize, initializeApp, main (+7 more)

### Community 150 - "device_change_dialog.dart"
Cohesion: 0.18
Nodes (13): dioProvider, deviceServiceProvider, build, createState, DeviceChangeDialog, _DeviceChangeDialogState, dispose, email (+5 more)

### Community 151 - "geofence_status_card.dart"
Cohesion: 0.14
Nodes (12): build, _buildChip, GeofenceDistanceMetrics, state, statusColor, build, GeofenceStatusCard, onRetry (+4 more)

### Community 152 - "logs.py"
Cohesion: 0.19
Nodes (8): app_schemas_log, ingest_log(), post, setup_logging(), LogEvent, BaseModel, field_validator, logging

### Community 153 - "permission_service.dart"
Cohesion: 0.15
Nodes (12): LocationPermission, checkAttendancePermissions, hasLocationAccess, isLocationServiceEnabled, isPermanentlyDenied, locationPermission, message, openAppSettings (+4 more)

### Community 154 - "dropdown-menu.tsx"
Cohesion: 0.15
Nodes (12): DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuSeparator, DropdownMenuSub (+4 more)

### Community 155 - "app_notification.dart"
Cohesion: 0.15
Nodes (12): body, category, copyWith, fromMap, id, isRead, link, severity (+4 more)

### Community 156 - "history_list_tab.dart"
Cohesion: 0.17
Nodes (12): build, createState, dispose, _filter, HistoryListTab, _HistoryListTabState, hState, ListStatusFilter (+4 more)

### Community 159 - "StudentCreate"
Cohesion: 0.31
Nodes (4): StudentCreate, StudentResponse, _check_db_connected(), StudentAdminService

### Community 160 - "logger.ts"
Cohesion: 0.50
Nodes (3): logger, LogLevel, PREFIX

### Community 161 - "student_stats.dart"
Cohesion: 0.18
Nodes (10): absentCount, attendancePercentage, currentStreak, excusedCount, flaggedCount, fromJson, highestStreak, presentCount (+2 more)

### Community 162 - "manifest.json"
Cohesion: 0.18
Nodes (10): background_color, description, display, icons, name, orientation, prefer_related_applications, short_name (+2 more)

### Community 163 - "register_fcm_token"
Cohesion: 0.20
Nodes (5): register_fcm_token(), submit_flagged_note(), FcmTokenRequest, field_validator, StudentAttendanceNoteRequest

### Community 165 - "resolve_frontend_url"
Cohesion: 0.33
Nodes (5): Request, Dynamically resolves the frontend base URL for email links, redirects, and…, resolve_frontend_url(), EmailService, Any

### Community 166 - "ActivityFilterBar.tsx"
Cohesion: 0.27
Nodes (8): ActivityCategory, ActivityFilterBar(), ActivityFilterBarProps, CATEGORIES, PRESETS, TimePresetFilter(), TimePresetFilterProps, TimeRangePreset

### Community 171 - "leaderboard_provider.dart"
Cohesion: 0.22
Nodes (9): StudentApi, _api, copyWith, data, errorMessage, fetch, isLoading, LeaderboardNotifier (+1 more)

### Community 173 - "leaderboard_item_card.dart"
Cohesion: 0.22
Nodes (8): LeaderboardEntry, build, _buildRankBadge, entry, isCurrentUser, LeaderboardItemCard, rank, package:smart_attendance_app/domain/models/leaderboard.dart

### Community 174 - "prepare_bulk_datasets.py"
Cohesion: 0.39
Nodes (6): clean_str(), process_classrooms_and_labs(), process_faculty_and_departments(), process_students(), process_subjects(), Script to transform raw datasets in temp/ into standard CSV files for bulk…

### Community 176 - "logger.dart"
Cohesion: 0.29
Nodes (6): AppLogger, debug, error, info, warn, package:flutter/foundation.dart

### Community 177 - "_SmartPassScreenState"
Cohesion: 0.33
Nodes (6): permissionServiceProvider, _checkPermissions, _requestPermissions, SmartPassScreen, _SmartPassScreenState, WidgetsBindingObserver

### Community 180 - "system_configuration.dart"
Cohesion: 0.33
Nodes (5): fromJson, isAiBackgroundValidationEnabled, isFaceRecognitionEnabled, isGpsVerificationEnabled, toJson

### Community 181 - "build"
Cohesion: 0.40
Nodes (5): build, Route /settings/goals, Route /settings/help, Route /settings/notifications, Route /settings/sync

### Community 182 - "location_exceptions.dart"
Cohesion: 0.50
Nodes (3): LocationException, message, toString

### Community 188 - "AdminService"
Cohesion: 0.09
Nodes (5): ClassResponse, TeacherResponse, AuditExportService, AdminService, Subject

### Community 192 - "button.tsx"
Cohesion: 0.24
Nodes (8): Badge(), BadgeProps, badgeVariants, Button, ButtonProps, buttonVariants, class-variance-authority, @radix-ui/react-slot

### Community 203 - "ai_orchestrator.py"
Cohesion: 0.05
Nodes (35): aiosmtplib, app_core_url_resolver, _load_liveness_model(), Any, Service Health & Connectivity Checker Checks AWS S3 and PostgreSQL RDS…, cleanup_s3(), _hash_password(), main() (+27 more)

## Knowledge Gaps
- **1533 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+1528 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2013 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **57 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Changes` connect `Changes` to `TenantDetailResponse`?**
  _High betweenness centrality (0.378) - this node is a cross-community bridge._
- **Why does `2. Backend Service Updates` connect `TenantDetailResponse` to `Changes`?**
  _High betweenness centrality (0.378) - this node is a cross-community bridge._
- **Are the 64 inferred relationships involving `AdminService` (e.g. with `assign_teacher()` and `bulk_create_classes()`) actually correct?**
  _`AdminService` has 64 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _1533 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `GlassButton.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.04194615021256495 - nodes in this community are weakly interconnected._
- **Should `getApiErrorMessage` be split into smaller, more focused modules?**
  _Cohesion score 0.02596053997923157 - nodes in this community are weakly interconnected._
- **Should `package:flutter_riverpod/flutter_riverpod.dart` be split into smaller, more focused modules?**
  _Cohesion score 0.028919089759797723 - nodes in this community are weakly interconnected._