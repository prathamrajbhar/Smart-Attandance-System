# Graph Report - Smart Attandance System  (2026-10-04)

## Corpus Check
- 631 files · ~725,438 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 38 file(s) not represented in the graph (top: (none) 9, .csv 7, .xml 7)

## Summary
- 5015 nodes · 12020 edges · 217 communities (164 shown, 53 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 515 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8455566c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- List
- getApiErrorMessage
- api/admin.py
- GlassBadge.tsx
- package:flutter/material.dart
- student_service.py
- test_api_student.py
- notifications_screen.dart
- api/timetable.py
- useAuthStore
- react
- reset_password_screen.dart
- api/auth.py
- geofence_status_card.dart
- test_api_teacher.py
- setup.mjs
- verification_step_bottom_bar.dart
- geofence_verification_provider.dart
- smart_pass_provider.dart
- auth_provider.dart
- api/teacher.py
- ApiClient
- theme.dart
- preferences_service.dart
- notifications.py
- StatelessWidget
- notification_service.dart
- verification_screen.dart
- result_config.dart
- get_logger
- useDebounce
- _handle_generic_err
- ServiceHealth
- history_calendar_tab.dart
- AttendanceService
- websocket_service.dart
- router.dart
- package:smart_attendance_app/shared/widgets/animated_background.dart
- analytics/page.tsx
- Sidebar.tsx
- types/index.ts
- reset-password/page.tsx
- attendance.dart
- test_api_admin.py
- package:flutter_riverpod/flutter_riverpod.dart
- app_api_dependencies
- constants.dart
- api/student.py
- leave_requests_screen.dart
- session_provider.dart
- test_comprehensive_security.py
- frontend/package.json
- lucide-react
- create_access_token
- api/super_admin.py
- typing
- conftest.py
- test_api_auth.py
- dependencies
- BulkImportModal.tsx
- attendance_utils.dart
- preferences_provider.dart
- master_data.py
- SuperAdminPage
- GlobalSearchResponse
- scripts
- attendance_provider.dart
- history_provider.dart
- BasePage
- get_redis
- attendance_constants.dart
- SessionService
- global_exception_handler
- offline_payload.dart
- TeacherClassesPage
- TeacherRepository
- offline_sync_service.dart
- GamificationService
- devDependencies
- GeofenceMap.tsx
- compilerOptions
- useNotifications.ts
- TimetableWeeklyGrid.tsx
- 🚀 Key Features
- notification_service.py
- Color
- help_screen.dart
- glass_button.dart
- face_registration_screen.dart
- verification_ai_review_card.dart
- leave_request.dart
- smart_pass_screen.dart
- SCIMService
- form.tsx
- test-fixtures.ts
- AdminSetupService
- test_notifications.py
- TeacherHistoryPage
- TeacherLeavesPage
- adb_login_and_capture.py
- ai_orchestrator.py
- seed/config.py
- vitest
- ConnectionManager
- Settings
- test_enterprise_features.py
- student_stats.dart
- verification_step_content.dart
- manifest.json
- StudentRepository
- next.config.ts
- PageObjects
- app_notification.dart
- AdminClassesPage
- AdminTeachersPage
- AdminVerificationSettingsPage
- AttendanceTrendChart.tsx
- seed_and_simulate.py
- TestRunner
- S3Service
- decode_access_token
- TeacherSessionsPage
- E2ETestRunner
- AuthService
- Agent Guidelines & Engineering Standards
- device_change_dialog.dart
- LeaveRepository
- AdminStudentsPage
- AdminClassroomsPage
- AdminDepartmentsPage
- SystemConfigService
- flagged_detail_screen.dart
- app.dart
- scripts
- SeedingConfig
- proxy.ts
- ref_playwright
- security_audit_suite.py
- test_core_and_middleware.py
- attendance.py
- auth_repository.dart
- permission_service.dart
- AdminAuditPage
- AdminOverviewPage
- ClassroomService
- test_super_admin.py
- SubjectService
- ResetPasswordPage
- test_service_teacher.py
- leave.py
- user.dart
- SessionSimulationService
- SessionRepository
- dropdown-menu.tsx
- StudentEnrollmentService
- DepartmentService
- WebSocketClient
- MobileE2ERunner
- enroll/page.tsx
- logger.ts
- location_exceptions.dart
- AdminScannerPage
- FlutterActivity
- frontend/README.md
- exceptions.dart
- smart_attendance_app
- summary_reporter.py
- rules/graphify.md
- workflows/graphify.md
- backend/README.md
- LogEvent
- postcss.config.mjs
- notification_api.dart
- EdgeWorkflowsService
- ref_path
- seed/__init__.py
- CommandPaletteModal.tsx
- AttendanceRepository
- DateTime?
- Exception
- LeaderboardResponse?
- T
- AdminService
- frontend-e2e-specs-17-anno-013f2-wide-broadcast-announcement/error-context.md
- frontend-e2e-specs-17-anno-299ca-s-with-notification-filters/error-context.md
- frontend-e2e-specs-17-anno-d5bc0-rifies-dispatch-history-log/error-context.md
- button.tsx
- TeacherProfilePage
- TeacherReviewPage
- PaginatedResponse
- .onboard_teachers
- app_middleware_request_logging
- app/layout.tsx
- DesignationService
- AdminDesignationsPage
- next
- glass_input.dart
- os
- run_absentee_scan
- CampusBroadcastPreview.tsx
- BulkImportComponent
- ForgotPasswordPage
- .complete_onboarding_in_browser
- TeacherService
- GeofenceControls.tsx
- common.py
- ManualAttendancePage
- frontend_src_types_index_tenantprovisionrequest
- frontend_src_types_index_tenantstatus
- frontend_src_types_index_tenantupdaterequest
- StagingCellCard.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 208 edges
2. `getApiErrorMessage()` - 176 edges
3. `lucide-react` - 152 edges
4. `AdminService` - 114 edges
5. `cn()` - 99 edges
6. `next` - 92 edges
7. `GlassButton()` - 76 edges
8. `react-hot-toast` - 75 edges
9. `api` - 75 edges
10. `applyValidationErrorsToForm()` - 65 edges

## Surprising Connections (you probably didn't know these)
- `vector_8_password_entropy_and_salting()` --calls--> `hash_password()`  [INFERRED]
  scripts/security_audit_suite.py → backend/app/core/security.py
- `vector_8_password_entropy_and_salting()` --calls--> `verify_password()`  [INFERRED]
  scripts/security_audit_suite.py → backend/app/core/security.py
- `vector_10_suspended_tenant_lockout()` --calls--> `create_access_token()`  [INFERRED]
  scripts/security_audit_suite.py → backend/app/core/security.py
- `vector_3_rbac_student_privilege_escalation()` --calls--> `create_access_token()`  [INFERRED]
  scripts/security_audit_suite.py → backend/app/core/security.py
- `vector_4_rbac_admin_to_super_admin()` --calls--> `create_access_token()`  [INFERRED]
  scripts/security_audit_suite.py → backend/app/core/security.py

## Import Cycles
- None detected.

## Communities (217 total, 53 thin omitted)

### Community 0 - "List"
Cohesion: 0.04
Nodes (41): int?, List, currentStreak, fromJson, leaderboard, LeaderboardEntry, LeaderboardResponse, name (+33 more)

### Community 1 - "getApiErrorMessage"
Cohesion: 0.03
Nodes (96): ForgotPasswordPage(), handleResend(), onSubmit(), LoginPage(), handleSuccessRedirect(), onSubmit(), OnboardingContent(), checkToken() (+88 more)

### Community 2 - "api/admin.py"
Cohesion: 0.13
Nodes (26): app_core_rate_limit, export_audit_logs(), get_admin_stats(), get_audit_logs(), get_class_by_id(), get_classes(), get_classroom(), get_classrooms() (+18 more)

### Community 3 - "GlassBadge.tsx"
Cohesion: 0.04
Nodes (73): INITIAL_FORM, SuperAdminDashboardPage(), PlatformHealthPage(), TenantDetailPage(), AuditDetailModal(), AuditDetailModalProps, AuditFilterBar(), AuditFilterBarProps (+65 more)

### Community 4 - "package:flutter/material.dart"
Cohesion: 0.02
Nodes (115): LeaderboardEntry, slideRightPage, slideUpPage, AttendanceHistoryItem, AttendanceHistoryResponse, AnalyticsKpiOverview, build, data (+107 more)

### Community 5 - "student_service.py"
Cohesion: 0.18
Nodes (17): app_repositories_geofence_repo, app_utils_geofencing, GeofenceRepository, GeofenceValidator, calculate_haversine_distance(), GPSCoordinate, is_within_geofence(), Validates if student is within the classroom geofence, accounting for GPS… (+9 more)

### Community 6 - "test_api_student.py"
Cohesion: 0.10
Nodes (19): app_schemas_attendance, app_schemas_leave, FcmTokenRequest, LeaderboardEntry, LeaderboardResponse, BaseModel, field_validator, SmartPassResponse (+11 more)

### Community 7 - "notifications_screen.dart"
Cohesion: 0.07
Nodes (32): notificationsLoadingProvider, notificationsProvider, pendingCountProvider, build, build, _getGreeting, _getInitials, pendingCount (+24 more)

### Community 8 - "api/timetable.py"
Cohesion: 0.06
Nodes (63): app_schemas_timetable, app_services_ai_timetable_parser, app_services_timetable_qa_service, app_services_timetable_service, commit_timetable(), create_teacher_substitution(), get_cohort_timetable(), get_student_today_schedule() (+55 more)

### Community 9 - "useAuthStore"
Cohesion: 0.15
Nodes (15): metadata, AdminDashboardPage(), DashboardLayout(), SuspendedPage(), Footer(), Header(), Sidebar(), usePlatformWebSocket() (+7 more)

### Community 10 - "react"
Cohesion: 0.03
Nodes (69): EnrollStudentRow(), metadata, ScannerControls(), ScannerControlsProps, metadata, metadata, ManualAttendanceStudentRow(), ManualAttendanceStudentRowProps (+61 more)

### Community 11 - "reset_password_screen.dart"
Cohesion: 0.04
Nodes (57): class, Container, FormState, authProvider, resetPasswordProvider, build, _confirmPasswordController, createState (+49 more)

### Community 12 - "api/auth.py"
Cohesion: 0.10
Nodes (38): app_services_auth_service, app_services_device_change_service, change_password(), complete_onboarding(), forgot_password(), get_me(), get_public_system_config(), get_sso_config() (+30 more)

### Community 13 - "geofence_status_card.dart"
Cohesion: 0.14
Nodes (12): build, _buildChip, GeofenceDistanceMetrics, state, statusColor, build, GeofenceStatusCard, onRetry (+4 more)

### Community 14 - "test_api_teacher.py"
Cohesion: 0.12
Nodes (30): AbsentStudentItem, AcademicClassWithGeofenceResponse, AttendanceManualOverride, AttendanceMatrixResponse, AttendanceMatrixSessionItem, AttendanceMatrixStudentItem, ClassAttendanceExportItem, ClassStatsResponse (+22 more)

### Community 15 - "setup.mjs"
Cohesion: 0.07
Nodes (45): ref_node_child_process, ref_node_crypto, ref_node_fs, ref_node_path, ref_node_url, checkVenvPythonVersion(), createPython311Venv(), ensureBackendDirectories() (+37 more)

### Community 16 - "verification_step_bottom_bar.dart"
Cohesion: 0.11
Nodes (18): VerificationStep, build, build, isCameraReady, onAnalyze, onCapture, onRetake, onSubmit (+10 more)

### Community 17 - "geofence_verification_provider.dart"
Cohesion: 0.04
Nodes (50): AutoDisposeNotifier, dart:math, FlutterSecureStorage, describeDistance, GeofenceCalculator, isWithinGeofence, describeDistance, ensurePermissionsGranted (+42 more)

### Community 18 - "smart_pass_provider.dart"
Cohesion: 0.07
Nodes (29): Duration get, attendanceStatus, className, enrollmentNumber, expiresAt, fromJson, isExpired, markedAt (+21 more)

### Community 19 - "auth_provider.dart"
Cohesion: 0.06
Nodes (35): AuthRepository, AuthStatus, _authErrorSubscription, AuthNotifier, AuthStateData, changePassword, checkInitialAuth, copyWith (+27 more)

### Community 20 - "api/teacher.py"
Cohesion: 0.14
Nodes (33): app_repositories_leave_repo, app_services_attendance_service, app_services_leave_service, app_services_session_service, approve_device_change(), approve_leave(), bulk_mark_attendance(), export_class_attendance() (+25 more)

### Community 21 - "ApiClient"
Cohesion: 0.10
Nodes (34): argparse, main(), parse_arguments(), ApiClient, Any, Exception, Authenticate user against /auth/login and store JWT access token., SeederApiError (+26 more)

### Community 22 - "theme.dart"
Cohesion: 0.04
Nodes (45): accentAmber, accentEmerald, accentPink, accentTeal, baseText, bgCanvas, bgPrimary, bgSecondary (+37 more)

### Community 23 - "preferences_service.dart"
Cohesion: 0.08
Nodes (24): getAttendanceTarget, getLowAttendanceThreshold, getNotifyClassStart, getNotifyLowAttendance, getNotifySyncDone, getNotifyWindowOpen, isFirstCameraUse, _keyAttendanceTarget (+16 more)

### Community 24 - "notifications.py"
Cohesion: 0.13
Nodes (26): app_schemas_common, app_services_notification_service, broadcast_notification(), bulk_delete_notifications(), clear_all_notifications(), mark_all_read(), mark_read(), delete (+18 more)

### Community 25 - "StatelessWidget"
Cohesion: 0.04
Nodes (47): build, email, errorMessage, isFormValid, LoginErrorBanner, password, HomeEmptyClasses, ProfileQuickActions (+39 more)

### Community 26 - "notification_service.dart"
Cohesion: 0.05
Nodes (39): Box, dart:convert, WebSocketService, addToQueue, cacheProfile, cacheSystemConfig, clearAll, _configBox (+31 more)

### Community 27 - "verification_screen.dart"
Cohesion: 0.05
Nodes (59): ConsumerState, ConsumerStatefulWidget, hiveServiceProvider, preferencesServiceProvider, attendanceVerificationProvider, geofenceVerificationProvider, VerificationCameraMixin, _aiStepIndex (+51 more)

### Community 28 - "result_config.dart"
Cohesion: 0.10
Nodes (19): background, color, error, face, flagged, icon, liveness, offline (+11 more)

### Community 29 - "get_logger"
Cohesion: 0.04
Nodes (63): aiosmtplib, app_api, app_core_config, app_core_logging_config, app_core_url_resolver, app_repositories_attendance_repo, app_repositories_student_repo, app_repositories_teacher_repo (+55 more)

### Community 30 - "useDebounce"
Cohesion: 0.17
Nodes (13): AdminNotificationsPage(), SuperAdminNotificationsPage(), SuperAdminTenantsPage(), LeavesPage(), TeacherNotificationsPage(), NotificationFeedList(), NotificationFeedListProps, NotificationFilterBar() (+5 more)

### Community 31 - "_handle_generic_err"
Cohesion: 0.15
Nodes (40): assign_teacher(), bulk_create_classes(), bulk_create_classrooms(), bulk_create_departments(), bulk_create_designations(), bulk_create_students(), bulk_create_subjects(), bulk_create_teachers() (+32 more)

### Community 32 - "ServiceHealth"
Cohesion: 0.15
Nodes (18): check_database(), check_redis(), check_s3(), get_health_status(), get, Response, BaseModel, ServiceHealth (+10 more)

### Community 33 - "history_calendar_tab.dart"
Cohesion: 0.08
Nodes (25): build, _buildDayNames, _buildDayRecords, _buildHeader, createState, _focusedMonth, HistoryCalendarTab, _HistoryCalendarTabState (+17 more)

### Community 34 - "AttendanceService"
Cohesion: 0.18
Nodes (8): AttendanceQueueService, Any, AttendanceSubmission, CachedSession, datetime, AttendanceService, Attendance, test_async_attendance_queue()

### Community 35 - "websocket_service.dart"
Cohesion: 0.06
Nodes (34): computeRouterRedirect, null, authState, _channel, connect, disconnect, dispose, _maxReconnectAttempts (+26 more)

### Community 36 - "router.dart"
Cohesion: 0.06
Nodes (34): ChangeNotifier, GoRouter, notifier, notify, rootNavigatorKey, RouterNotifier, routerNotifierProvider, shellNavigatorKey (+26 more)

### Community 37 - "package:smart_attendance_app/shared/widgets/animated_background.dart"
Cohesion: 0.05
Nodes (58): ConsumerWidget, AnalyticsScreen, _AnalyticsScreenState, build, createState, initState, ResultScreen, historyProvider (+50 more)

### Community 38 - "analytics/page.tsx"
Cohesion: 0.06
Nodes (38): AnomalyCard(), AnomalyCardProps, getRiskLevel(), WEEKDAYS, ActiveTab, AnalyticsOverviewTab(), AnalyticsOverviewTabProps, AttendanceMatrixTable() (+30 more)

### Community 39 - "Sidebar.tsx"
Cohesion: 0.15
Nodes (16): AdminNavSection(), AdminNavSectionProps, adminLinks, NavItem, setupLinks, superAdminLinks, teacherLinks, teacherReportLinks (+8 more)

### Community 40 - "types/index.ts"
Cohesion: 0.05
Nodes (48): AuditPage(), ActiveSessionBanner(), ActiveSessionBannerProps, TeacherDashboardPage(), LeaveDocumentModalProps, LeaveReviewDialogProps, PastSessionsTable(), PastSessionsTableProps (+40 more)

### Community 41 - "reset-password/page.tsx"
Cohesion: 0.03
Nodes (74): VerifyData, VerifyData, GENDER_OPTIONS, SEMESTER_OPTIONS, StudentFormFields(), StudentFormFieldsProps, EditStudentFormFields(), EditStudentFormFieldsProps (+66 more)

### Community 42 - "attendance.dart"
Cohesion: 0.06
Nodes (33): activeSessionId, attendanceId, backgroundScore, classId, className, createdAt, faceScore, finalAiScore (+25 more)

### Community 43 - "test_api_admin.py"
Cohesion: 0.08
Nodes (33): app_schemas_master_data, app_schemas_pagination, AbsenteeAnomalyItem, AdminStatsResponse, AssignTeacherRequest, AuditLogResponse, BulkImportResponse, ClassBulkCreateRequest (+25 more)

### Community 44 - "package:flutter_riverpod/flutter_riverpod.dart"
Cohesion: 0.06
Nodes (38): analyzeAttendance, confirmAttendance, createLeaveRequest, _dio, getLeaderboard, getMyAttendance, getMyClasses, getMyLeaves (+30 more)

### Community 45 - "app_api_dependencies"
Cohesion: 0.10
Nodes (20): app_api_dependencies, Verify that get_all_departments receives the tenant_id., Users without tenantId must be rejected with 403 Forbidden., Verify that system config read and write pass the active tenant_id., Verify that an admin from Tenant A cannot view a student belonging to Tenant B., Verify that an admin from Tenant A cannot view a teacher belonging to Tenant B., Verify that an admin from Tenant A cannot delete a department belonging to…, Verify that get_all_students receives the exact tenant_id of the logged-in… (+12 more)

### Community 46 - "constants.dart"
Cohesion: 0.04
Nodes (46): @pragma, HttpOverrides, defineUrl, envUrl, kConnectTimeout, kGeofenceGraceMeters, kGpsAveragingSamples, kGpsTimeoutSeconds (+38 more)

### Community 47 - "api/student.py"
Cohesion: 0.19
Nodes (30): app_services_student_service, analyze_attendance(), async_mark_attendance(), confirm_attendance(), create_leave_request(), get_attendance_job_status(), get_biometric_consent_status(), get_leaderboard() (+22 more)

### Community 48 - "leave_requests_screen.dart"
Cohesion: 0.09
Nodes (22): File?, build, createState, dispose, _endDate, _isSubmitting, _notesController, _pickDate (+14 more)

### Community 49 - "session_provider.dart"
Cohesion: 0.04
Nodes (52): dart:async, Duration?, AppEvents, _authErrorController, authErrorStream, broadcastAuthError, _adjustPollInterval, _api (+44 more)

### Community 50 - "test_comprehensive_security.py"
Cohesion: 0.11
Nodes (18): app_schemas_health, app_schemas_notification, asyncio, Verify Smart Pass tokens expire and reject expired replay attempts., Verify SCIM endpoints reject requests without a valid bearer token., Verify password reset tokens require valid email and reject invalid tokens., Verify forged JWTs with algorithm 'none' or wrong secrets fail decoding., Verify STUDENT role tokens cannot access Admin or Super-Admin endpoints. (+10 more)

### Community 51 - "frontend/package.json"
Cohesion: 0.07
Nodes (26): eslintConfig, name, private, version, axios, clsx, eslint, eslint-config-next (+18 more)

### Community 52 - "lucide-react"
Cohesion: 0.06
Nodes (59): classColumns, EnrollStudentRowProps, ClassesPage(), StudentsPage(), studentColumns, TeachersPage(), teacherColumns, ReviewQueuePage() (+51 more)

### Community 53 - "create_access_token"
Cohesion: 0.14
Nodes (20): create_access_token(), Any, active_teacher_token(), asyncio, fixture, Layer 2 QA: Middleware blocks downstream API calls for suspended tenant context., Layer 2 QA: Middleware allows downstream API calls for active tenant context., Layer 3 QA: Custom domain routing immediately blocks when tenant is suspended. (+12 more)

### Community 54 - "api/super_admin.py"
Cohesion: 0.08
Nodes (45): app_schemas_super_admin, app_services_super_admin_service, add_tenant_admin(), create_global_broadcast(), get_all_users(), get_global_audit_logs(), get_platform_stats(), get_system_health() (+37 more)

### Community 55 - "typing"
Cohesion: 0.11
Nodes (15): app_db_client, app_db_redis, app_repositories_class_repo, app_repositories_enrollment_repo, app_repositories_session_repo, app_repositories_system_config_repo, app_services_s3_service, HealthResponse (+7 more)

### Community 56 - "conftest.py"
Cohesion: 0.14
Nodes (18): AwaitableMock, clear_dependency_overrides(), mock_academic_class(), mock_admin_user(), mock_redis(), mock_student_profile(), mock_student_user(), mock_teacher_profile() (+10 more)

### Community 57 - "test_api_auth.py"
Cohesion: 0.12
Nodes (8): app_schemas_system_config, BaseModel, SystemConfigResponse, SystemConfigUpdate, test_get_public_system_config(), test_login_success(), test_login_with_student_enrollment_id(), test_logout_revokes_token()

### Community 58 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, axios, class-variance-authority, clsx, @hookform/resolvers, leaflet, lucide-react, next (+18 more)

### Community 59 - "BulkImportModal.tsx"
Cohesion: 0.18
Nodes (20): getSampleCsv(), buildBatches(), buildBulkPayload(), BULK_BATCH_SIZE, BatchProgressItem, BulkImportEntityType, BulkImportSummary, ImportStage (+12 more)

### Community 60 - "attendance_utils.dart"
Cohesion: 0.08
Nodes (24): calculateHighestStreak, calculateStreak, canMiss, computeAttendanceNeeds, computeSubjectPct, computeWeekPresent, countAbsent, countFlagged (+16 more)

### Community 61 - "preferences_provider.dart"
Cohesion: 0.10
Nodes (20): PreferencesService, attendanceTarget, copyWith, isLoading, _load, lowAttendanceThreshold, notifyClassStart, notifyLowAttendance (+12 more)

### Community 62 - "master_data.py"
Cohesion: 0.20
Nodes (11): ClassroomCreate, ClassroomResponse, ClassroomUpdate, DesignationCreate, DesignationResponse, DesignationUpdate, BaseModel, field_validator (+3 more)

### Community 64 - "GlobalSearchResponse"
Cohesion: 0.22
Nodes (12): app_schemas_search, app_services_search_service, global_search(), get, User, GlobalSearchResponse, BaseModel, SearchResultItem (+4 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (23): bin, dev, setup, description, name, private, scripts, backend:setup (+15 more)

### Community 66 - "attendance_provider.dart"
Cohesion: 0.07
Nodes (27): DateTimeFormatting, formattedDate, formattedDateTime, isSameDay, shortDate, StringFormatting, truncate, accuracy (+19 more)

### Community 67 - "history_provider.dart"
Cohesion: 0.09
Nodes (24): NotificationsNotifier, PendingCountNotifier, data, errorMessage, fetch, HistoryNotifier, HistoryState, isLoading (+16 more)

### Community 68 - "BasePage"
Cohesion: 0.11
Nodes (5): ClassInput, StudentInput, TeacherInput, BasePage, @playwright/test

### Community 69 - "get_redis"
Cohesion: 0.15
Nodes (13): rate_limiter(), dependency(), Sliding window rate limiter using Redis sorted sets. Keyed by IP address and…, connect_redis(), disconnect_redis(), get_redis(), Request, _hash_password() (+5 more)

### Community 70 - "attendance_constants.dart"
Cohesion: 0.09
Nodes (21): kAttendanceTypeLocal, kAttendanceTypePush, kGoodScoreThreshold, kImagePickQuality, kMinBrightnessForPhoto, kMinSharpnessForPhoto, kNoteMaxChars, kOverallGoodPct (+13 more)

### Community 71 - "SessionService"
Cohesion: 0.22
Nodes (7): start_session(), SessionResponse, SessionStart, SessionScheduler, Mark session as inactive, delete from Redis, and mark all unsubmitted students…, SessionService, test_start_and_stop_session()

### Community 72 - "global_exception_handler"
Cohesion: 0.38
Nodes (7): global_exception_handler(), Exception, Request, validation_exception_handler(), exception_handler, JSONResponse, RequestValidationError

### Community 73 - "offline_payload.dart"
Cohesion: 0.11
Nodes (19): @HiveType, HiveObject, hashCode, OfflineAttendancePayloadAdapter, operator, read, typeId, write (+11 more)

### Community 75 - "TeacherRepository"
Cohesion: 0.12
Nodes (8): AcademicClass, ClassRepository, EnrollmentRepository, Teacher, TeacherRepository, User, UserRepository, Enrollment

### Community 76 - "offline_sync_service.dart"
Cohesion: 0.04
Nodes (49): Dio, HiveService, NotificationService, _className, _connectivitySub, _deleteImageFile, _dio, dispose (+41 more)

### Community 77 - "GamificationService"
Cohesion: 0.10
Nodes (15): app_services_gamification_service, GamificationService, Return the active Redis client if available., Update a student's score in the Redis leaderboard., Fetch the leaderboard from Redis, falling back to DB if empty., Helper to compatibility-wrap recalculate_student_streak., Rebuild the leaderboard cache from DB data., Recalculate student streak based on historical attendance logs and active… (+7 more)

### Community 78 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, eslint, eslint-config-next, jsdom, @playwright/test, tailwindcss, @tailwindcss/postcss, @testing-library/dom (+11 more)

### Community 79 - "GeofenceMap.tsx"
Cohesion: 0.13
Nodes (11): Circle, GeofenceMap(), GeofenceMapProps, MapContainer, Marker, TileLayer, LocationSearchBar(), LocationSearchBarProps (+3 more)

### Community 80 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 81 - "useNotifications.ts"
Cohesion: 0.12
Nodes (23): BroadcastNotificationModal(), BroadcastNotificationModalProps, INITIAL_FORM, formatRelativeTime(), getCategoryIcon(), NotificationFeedItem(), NotificationFeedItemProps, NotificationStatsGridProps (+15 more)

### Community 82 - "TimetableWeeklyGrid.tsx"
Cohesion: 0.47
Nodes (5): DAYS, TimetableWeeklyGrid(), TimetableWeeklyGridProps, ParsedTimeSlot, TimetableEntryDetail

### Community 83 - "🚀 Key Features"
Cohesion: 0.11
Nodes (18): 1. Multi-Layered AI Verification, 1. Prerequisites, 2. Dynamic Location & Geofencing, 2. One-Command Setup, 3. Hardware Device Binding (Anti-Proxy), 3. Running Development Servers, 4. Offline Smart Pass (Encrypted Fallback), 5. Automated Outlier Scanning & Absentee Analytics (+10 more)

### Community 84 - "notification_service.py"
Cohesion: 0.20
Nodes (15): list_notifications(), get, Retrieve notifications for the current authenticated user + active role…, broadcast_announcement(), create_in_app_notification(), get_user_notifications(), notify_student_attendance_flagged(), notify_student_attendance_reviewed() (+7 more)

### Community 85 - "Color"
Cohesion: 0.03
Nodes (59): Animation, Color, IconData?, animation, build, hint, icon, label (+51 more)

### Community 86 - "help_screen.dart"
Cohesion: 0.12
Nodes (15): build, child, ShellScaffold, _tabPaths, answer, build, createState, _expanded (+7 more)

### Community 87 - "glass_button.dart"
Cohesion: 0.04
Nodes (50): EdgeInsetsGeometry, build, isSecondaryGhost, onPrimaryPressed, onSecondaryPressed, primaryIcon, primaryLabel, secondaryIcon (+42 more)

### Community 88 - "face_registration_screen.dart"
Cohesion: 0.14
Nodes (16): registrationProvider, build, _cameraController, _cameraError, _capturedPath, _capturePhoto, createState, dispose (+8 more)

### Community 89 - "verification_ai_review_card.dart"
Cohesion: 0.04
Nodes (57): AnimationController, CustomPainter, AttendanceAnalysisResult, GeofenceStatus, build, createState, desc, _expanded (+49 more)

### Community 90 - "leave_request.dart"
Cohesion: 0.09
Nodes (21): approved, approvedBy, approverNote, createdAt, documentUrl, endDate, enrollmentNumber, fromJson (+13 more)

### Community 91 - "smart_pass_screen.dart"
Cohesion: 0.09
Nodes (27): permissionServiceProvider, smartPassProvider, build, _buildErrorBanner, _buildLiveScanner, _buildPermissionCard, _buildSuccessCard, _checkingPermission (+19 more)

### Community 92 - "SCIMService"
Cohesion: 0.21
Nodes (15): create_scim_user(), delete_scim_user(), get_scim_user(), get_service_provider_config(), list_scim_users(), Any, delete, get (+7 more)

### Community 93 - "form.tsx"
Cohesion: 0.18
Nodes (13): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+5 more)

### Community 94 - "test-fixtures.ts"
Cohesion: 0.29
Nodes (4): frontend_e2e_fixtures_test_fixtures_expect, generateYopmail(), test, TEST_CREDENTIALS

### Community 95 - "AdminSetupService"
Cohesion: 0.18
Nodes (8): AdminSetupService, Any, AsyncClient, Creates academic subjects (Theory & Practical)., Creates classroom and laboratory venues., Logs into admin account and acquires JWT access token., Creates institutional departments., Creates academic designations.

### Community 96 - "test_notifications.py"
Cohesion: 0.23
Nodes (13): NotificationListResponse, NotificationResponse, BaseModel, test_notifications_crud(), MockAdminUser, MockUser, test_admin_broadcast_success(), test_get_notifications_empty() (+5 more)

### Community 99 - "adb_login_and_capture.py"
Cohesion: 0.80
Nodes (5): adb(), key(), main(), tap(), type_text()

### Community 100 - "ai_orchestrator.py"
Cohesion: 0.12
Nodes (12): AIOrchestrator, _load_and_crop(), _load_liveness_model(), Any, cv2, deepface, huggingface_hub, ndarray (+4 more)

### Community 101 - "seed/config.py"
Cohesion: 0.19
Nodes (10): httpx, rich_console, rich_progress, Admin Master Data Setup Automation. Configures institutional master data: -…, get_config(), Configuration and Safety Guardrails for Seeding Simulation. Supports local…, Edge Workflow Simulation Module. Simulates authentic edge journeys: 1. Students…, Academic Semester Session & Student Behavior Simulation. Simulates 15-30… (+2 more)

### Community 102 - "vitest"
Cohesion: 0.22
Nodes (9): AdminQuickActions(), QuickActionItem, mockAdminProfile, mockDeviceChangeRequest, mockStudentProfile, mockTeacherProfile, Role, @testing-library/react (+1 more)

### Community 103 - "ConnectionManager"
Cohesion: 0.11
Nodes (11): app_api_ws, app_services_realtime_bus, ConnectionManager, Any, Publish real-time event to distributed Redis PubSub channel., RealtimeBus, asyncio, test_connection_manager_delegation() (+3 more)

### Community 104 - "Settings"
Cohesion: 0.33
Nodes (3): field_validator, Settings, BaseSettings

### Community 105 - "test_enterprise_features.py"
Cohesion: 0.21
Nodes (12): app_services_attendance_attendance_queue_service, app_services_biometric_consent_service, app_services_scim_service, app_services_sso_service, Any, SSOService, asyncio, test_biometric_photo_purging_gdpr() (+4 more)

### Community 106 - "student_stats.dart"
Cohesion: 0.18
Nodes (10): absentCount, attendancePercentage, currentStreak, excusedCount, flaggedCount, fromJson, highestStreak, presentCount (+2 more)

### Community 107 - "verification_step_content.dart"
Cohesion: 0.03
Nodes (65): bool get, CameraController?, dart:ui, double?, blurScore, brightnessScore, camera, cameraError (+57 more)

### Community 108 - "manifest.json"
Cohesion: 0.18
Nodes (10): background_color, description, display, icons, name, orientation, prefer_related_applications, short_name (+2 more)

### Community 109 - "StudentRepository"
Cohesion: 0.08
Nodes (15): app_services_ai_orchestrator, app_services_attendance_attendance_notifier, app_services_attendance_attendance_recorder, app_services_attendance_geofence_validator, app_services_attendance_models, app_services_system_config_service, AttendanceRepository, Attendance (+7 more)

### Community 111 - "PageObjects"
Cohesion: 0.08
Nodes (6): PageObjects, AdminSubjectsPage, LoginPage, TeacherAnalyticsPage, TeacherDeviceChangesPage, TeacherOverviewPage

### Community 113 - "app_notification.dart"
Cohesion: 0.05
Nodes (36): Map, body, category, copyWith, fromMap, id, isRead, link (+28 more)

### Community 117 - "AttendanceTrendChart.tsx"
Cohesion: 0.22
Nodes (5): monthlyData, MonthlyDataPoint, breakdownData, BreakdownItem, recharts

### Community 118 - "seed_and_simulate.py"
Cohesion: 0.23
Nodes (10): playwright_async_api, main(), Automated Data-Seeding and Realistic User-Simulation Pipeline. Usage: python…, run_pipeline(), AsyncClient, Teacher Onboarding & Class Assignment Module. Onboards faculty members using…, TeacherOnboardingService, Yopmail Browser Automation & Onboarding UI Handler. Simulates authentic user… (+2 more)

### Community 120 - "S3Service"
Cohesion: 0.16
Nodes (4): BiometricConsentService, Any, UploadFile, S3Service

### Community 121 - "decode_access_token"
Cohesion: 0.28
Nodes (9): decode_access_token(), TestSmartAttendanceSuite, test_invalid_auth_token_rejected(), test_public_health_endpoint(), test_expired_token_handling(), test_jwt_token_generation_and_decoding(), test_password_hashing_and_verification(), test_smart_pass_token_payload() (+1 more)

### Community 124 - "AuthService"
Cohesion: 0.09
Nodes (27): app_core_security, app_schemas_student, app_services_admin_audit_export_service, app_services_admin_bulk_import_service, app_services_admin_class_admin_service, app_services_admin_classroom_service, app_services_admin_department_service, app_services_admin_designation_service (+19 more)

### Community 125 - "Agent Guidelines & Engineering Standards"
Cohesion: 0.25
Nodes (7): 1. Environment & Configuration Sync, 2. No Hardcoding, 3. No Patches on Patches (Clean Code First), 4. File Structure & Quality Rules, 5. Version Control & Automated Delivery, 6. Database & Prisma Schema Standards, Agent Guidelines & Engineering Standards

### Community 126 - "device_change_dialog.dart"
Cohesion: 0.16
Nodes (14): dioProvider, deviceServiceProvider, build, createState, DeviceChangeDialog, _DeviceChangeDialogState, dispose, email (+6 more)

### Community 127 - "LeaveRepository"
Cohesion: 0.33
Nodes (3): LeaveRepository, LeaveService, LeaveRequest

### Community 131 - "SystemConfigService"
Cohesion: 0.16
Nodes (11): patch, update_system_config(), Gets the system configuration for the specified tenant. If it doesn't exist,…, SystemConfigRepository, SystemConfigService, fromJson, isAiBackgroundValidationEnabled, isFaceRecognitionEnabled (+3 more)

### Community 132 - "flagged_detail_screen.dart"
Cohesion: 0.12
Nodes (17): attendanceRepositoryProvider, attendanceId, build, createState, dispose, FlaggedDetailScreen, _FlaggedDetailScreenState, initState (+9 more)

### Community 133 - "app.dart"
Cohesion: 0.11
Nodes (24): build, createState, dispose, _handleNotificationClick, inferNotificationSeverity, _initializeFcm, initState, kSeverityInfo (+16 more)

### Community 134 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, start, test, test:watch

### Community 135 - "SeedingConfig"
Cohesion: 0.20
Nodes (8): BrowserContext, BaseModel, SeedingConfig, _validate_local_url(), clean_database(), _hash_password(), Database Cleaner for Local Test Environment. Provides clean slate wiping for…, Wipes all domain records and resets base system config & root admin.

### Community 136 - "proxy.ts"
Cohesion: 0.67
Nodes (3): config, parseAuthCookie(), proxy()

### Community 138 - "security_audit_suite.py"
Cohesion: 0.26
Nodes (13): main(), Enterprise Security Audit & Penetration Verification Suite Executes 10…, run_vector(), vector_10_suspended_tenant_lockout(), vector_1_security_headers(), vector_2_jwt_tampering(), vector_3_rbac_student_privilege_escalation(), vector_4_rbac_admin_to_super_admin() (+5 more)

### Community 139 - "test_core_and_middleware.py"
Cohesion: 0.18
Nodes (9): RoleChecker, verify_password(), Verify password hashing produces distinct salts and resists matching empty…, test_password_hash_security(), test_generate_temporary_password(), test_jwt_token_roundtrip(), test_password_hashing_and_verification(), test_role_checker() (+1 more)

### Community 140 - "attendance.py"
Cohesion: 0.33
Nodes (7): AttendanceAnalyzeResponse, AttendanceAsyncEnqueueResponse, AttendanceJobStatusResponse, AttendanceMarkResponse, AttendanceReview, BaseModel, field_validator

### Community 141 - "auth_repository.dart"
Cohesion: 0.04
Nodes (47): dart:io, DeviceInfoPlugin, AuthApi, authApiProvider, changePassword, _dio, getProfile, login (+39 more)

### Community 142 - "permission_service.dart"
Cohesion: 0.15
Nodes (12): LocationPermission, checkAttendancePermissions, hasLocationAccess, isLocationServiceEnabled, isPermanentlyDenied, locationPermission, message, openAppSettings (+4 more)

### Community 145 - "ClassroomService"
Cohesion: 0.26
Nodes (3): ClassroomService, Classroom, Classroom

### Community 146 - "test_super_admin.py"
Cohesion: 0.23
Nodes (12): asyncio, fixture, student_token(), super_admin_token(), test_super_admin_create_global_broadcast(), test_super_admin_get_broadcast_history(), test_super_admin_provision_tenant(), test_super_admin_provision_tenant_multiple_admins() (+4 more)

### Community 147 - "SubjectService"
Cohesion: 0.26
Nodes (3): Subject, Subject, SubjectService

### Community 149 - "test_service_teacher.py"
Cohesion: 0.31
Nodes (9): app_schemas_teacher, app_services_teacher_service, BulkAttendanceRecord, BulkMarkRequest, GeofenceUpsert, asyncio, test_teacher_service_bulk_mark(), test_teacher_service_manual_override() (+1 more)

### Community 150 - "leave.py"
Cohesion: 0.29
Nodes (6): LeaveRequestApprove, LeaveRequestCreate, LeaveRequestListResponse, BaseModel, field_validator, date

### Community 151 - "user.dart"
Cohesion: 0.10
Nodes (20): accessToken, email, enrollmentNumber, faceRegistered, firstName, fromJson, hasFaceRegistered, id (+12 more)

### Community 152 - "SessionSimulationService"
Cohesion: 0.26
Nodes (7): Any, AsyncClient, Runs the multi-day attendance simulation across classes with live progress., Acquires auth tokens for faculty members to drive session endpoints., Categorizes students into Exemplary (~60%), Irregular (~25%), and Defaulter…, Simulates 1 class session: start -> bulk mark -> stop., SessionSimulationService

### Community 153 - "SessionRepository"
Cohesion: 0.33
Nodes (3): datetime, SessionRepository, Session

### Community 154 - "dropdown-menu.tsx"
Cohesion: 0.15
Nodes (12): DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuSeparator, DropdownMenuSub (+4 more)

### Community 155 - "StudentEnrollmentService"
Cohesion: 0.27
Nodes (6): Any, AsyncClient, Builds student specification objects with PRNs and @yopmail.com emails., Creates cohorts for Division A and Division B in CSE., Enrolls students into appropriate theory sections and practical lab batches., StudentEnrollmentService

### Community 156 - "DepartmentService"
Cohesion: 0.26
Nodes (3): DepartmentService, Department, Department

### Community 159 - "enroll/page.tsx"
Cohesion: 0.36
Nodes (6): EnrollHeader(), EnrollHeaderProps, EnrollStudentFilters(), EnrollStudentFiltersProps, frontend_src_types_index_classresponse, ClassResponse

### Community 160 - "logger.ts"
Cohesion: 0.50
Nodes (3): logger, LogLevel, PREFIX

### Community 161 - "location_exceptions.dart"
Cohesion: 0.50
Nodes (3): LocationException, message, toString

### Community 165 - "exceptions.dart"
Cohesion: 0.33
Nodes (8): AppException, AuthException, message, NetworkException, ServerException, statusCode, toString, ValidationException

### Community 167 - "summary_reporter.py"
Cohesion: 0.25
Nodes (7): rich, rich_panel, rich_table, print_final_summary(), Any, Summary Reporting & Terminal Dashboard Module. Renders final summary tables and…, Prints beautiful formatted terminal summary tables using rich.

### Community 171 - "LogEvent"
Cohesion: 0.32
Nodes (5): ingest_log(), post, LogEvent, BaseModel, field_validator

### Community 173 - "notification_api.dart"
Cohesion: 0.08
Nodes (23): category, createdAt, deleteNotification, _dio, fromJson, getNotifications, id, isRead (+15 more)

### Community 174 - "EdgeWorkflowsService"
Cohesion: 0.29
Nodes (5): EdgeWorkflowsService, Any, AsyncClient, Simulates student device changes and teacher resolution., Simulates student leave submissions and teacher review queue processing.

### Community 175 - "ref_path"
Cohesion: 0.25
Nodes (4): frontend_node_modules_playwright_test_index, ref_fs, ref_path, @vitejs/plugin-react

### Community 177 - "CommandPaletteModal.tsx"
Cohesion: 0.32
Nodes (5): getCommandIcon(), CommandPaletteModal(), CommandPaletteModalProps, GlobalSearchResponse, SearchResultItem

### Community 188 - "AdminService"
Cohesion: 0.07
Nodes (12): app_schemas_admin, app_services_admin_service, ClassCreate, ClassResponse, AuditExportService, ClassAdminService, AdminService, test_create_class_and_assign_teacher() (+4 more)

### Community 189 - "frontend-e2e-specs-17-anno-013f2-wide-broadcast-announcement/error-context.md"
Cohesion: 0.40
Nodes (4): Error details, Instructions, Test info, Test source

### Community 190 - "frontend-e2e-specs-17-anno-299ca-s-with-notification-filters/error-context.md"
Cohesion: 0.40
Nodes (4): Error details, Instructions, Test info, Test source

### Community 191 - "frontend-e2e-specs-17-anno-d5bc0-rifies-dispatch-history-log/error-context.md"
Cohesion: 0.40
Nodes (4): Error details, Instructions, Test info, Test source

### Community 192 - "button.tsx"
Cohesion: 0.24
Nodes (8): Badge(), BadgeProps, badgeVariants, Button, ButtonProps, buttonVariants, class-variance-authority, @radix-ui/react-slot

### Community 195 - "PaginatedResponse"
Cohesion: 0.38
Nodes (5): PaginatedResponse, PaginationParams, BaseModel, T, test_audit_logs_and_export()

### Community 196 - ".onboard_teachers"
Cohesion: 0.40
Nodes (3): Any, Provisions faculty accounts with @yopmail.com emails and verifies them., Creates academic classes and links teachers and rooms.

### Community 199 - "DesignationService"
Cohesion: 0.26
Nodes (3): DesignationService, Designation, Designation

### Community 201 - "next"
Cohesion: 0.08
Nodes (72): SEVERITY_VARIANT, SEMESTER_OPTIONS, INITIAL_FORM, SystemConfig, CohortSummary, DAYS, colorVariants, colorVariants (+64 more)

### Community 202 - "glass_input.dart"
Cohesion: 0.08
Nodes (24): FocusNode?, build, controller, FlaggedNoteForm, isSubmitting, noteSubmitted, onSubmit, build (+16 more)

### Community 203 - "os"
Cohesion: 0.07
Nodes (37): asyncio, Service Health & Connectivity Checker Checks AWS S3 and PostgreSQL RDS…, boto3, botocore_config, botocore_exceptions, dotenv, json, mimetypes (+29 more)

### Community 204 - "run_absentee_scan"
Cohesion: 0.31
Nodes (9): app_services_absentee_scanner, scan_absentee_anomalies(), _detect_pattern(), Any, run_absentee_scan(), _run_isolation_forest(), asyncio, test_run_absentee_scan_detects_outliers() (+1 more)

### Community 205 - "CampusBroadcastPreview.tsx"
Cohesion: 0.43
Nodes (6): CampusBroadcastFormProps, CampusBroadcastPreview(), CampusBroadcastPreviewProps, getCategoryLabel(), getPriorityBadge(), NotificationBroadcastCreate

### Community 210 - "GeofenceControls.tsx"
Cohesion: 0.33
Nodes (5): downloadCsv(), GeofenceControls(), GeofenceControlsProps, AttendanceExportRow, frontend_src_types_index_attendanceexportrow

### Community 211 - "common.py"
Cohesion: 0.53
Nodes (5): BulkActionCountResponse, BaseModel, ValidationErrorDetail, ValidationErrorEnvelope, ValidationErrorEnvelopeBody

### Community 216 - "StagingCellCard.tsx"
Cohesion: 0.67
Nodes (3): StagingCellCard(), StagingCellCardProps, StagedCell

## Knowledge Gaps
- **1522 isolated node(s):** `SeederConfig`, `ClassInput`, `StudentInput`, `TeacherInput`, `eslintConfig` (+1517 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2201 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **53 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `getApiErrorMessage`, `GlassBadge.tsx`, `useAuthStore`, `dropdown-menu.tsx`, `useDebounce`, `enroll/page.tsx`, `analytics/page.tsx`, `Sidebar.tsx`, `types/index.ts`, `reset-password/page.tsx`, `CommandPaletteModal.tsx`, `frontend/package.json`, `lucide-react`, `BulkImportModal.tsx`, `button.tsx`, `next`, `CampusBroadcastPreview.tsx`, `GeofenceMap.tsx`, `useNotifications.ts`, `GeofenceControls.tsx`, `TimetableWeeklyGrid.tsx`, `StagingCellCard.tsx`, `form.tsx`, `vitest`, `AttendanceTrendChart.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `AdminService` connect `AdminService` to `api/admin.py`, `DesignationService`, `TeacherRepository`, `StudentRepository`, `ClassroomService`, `DepartmentService`, `SubjectService`, `AuthService`, `_handle_generic_err`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `@playwright/test` connect `BasePage` to `frontend/package.json`, `test-fixtures.ts`, `SuperAdminPage`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Are the 67 inferred relationships involving `AdminService` (e.g. with `assign_teacher()` and `bulk_create_classes()`) actually correct?**
  _`AdminService` has 67 INFERRED edges - model-reasoned connections that need verification._
- **What connects `SeederConfig`, `ClassInput`, `StudentInput` to the rest of the system?**
  _1522 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `List` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._
- **Should `getApiErrorMessage` be split into smaller, more focused modules?**
  _Cohesion score 0.03185328185328185 - nodes in this community are weakly interconnected._