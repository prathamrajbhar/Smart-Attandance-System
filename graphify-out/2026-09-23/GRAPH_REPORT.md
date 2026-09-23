# Graph Report - Smart Attandance System  (2026-09-22)

## Corpus Check
- 508 files · ~675,570 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 30 file(s) not represented in the graph (top: (none) 8, .xml 7, .example 5)

## Summary
- 4244 nodes · 9591 edges · 193 communities (145 shown, 48 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 339 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `37e10af8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- test_api_teacher.py
- getApiErrorMessage
- api.ts
- package:flutter_riverpod/flutter_riverpod.dart
- package:smart_attendance_app/shared/widgets/glass_card.dart
- attendance_service.py
- api/student.py
- onboarding/page.tsx
- admin/dashboard/page.tsx
- lucide-react
- react
- useAuthStore
- api/auth.py
- verification_ai_review_card.dart
- api/teacher.py
- setup.mjs
- classes/[id]/edit/page.tsx
- seed_and_simulate.py
- test_api_auth.py
- main.dart
- AdminService
- package:smart_attendance_app/app/theme.dart
- theme.dart
- preferences_service.dart
- notifications.py
- verification_step_content.dart
- notification_service.dart
- List
- geofence_verification_provider.dart
- app_db_client
- reset_password_screen.dart
- _handle_generic_err
- hive_service.dart
- student_api.dart
- constants.dart
- websocket_service.dart
- router.dart
- verification_screen.dart
- StudentRepository
- notification_tile.dart
- types/index.ts
- typing
- attendance.dart
- schemas/admin.py
- build
- app.dart
- menu_grid_item.dart
- secure_storage.dart
- auth_provider.dart
- session_provider.dart
- api/admin.py
- frontend/package.json
- leave_request.dart
- attendance_repository.dart
- auth_repository.dart
- result_config.dart
- class_session_card.dart
- glass_input.dart
- dependencies
- useBulkImportProcessor.ts
- attendance_utils.dart
- os
- history_provider.dart
- TeacherService
- notification_api.dart
- scripts
- attendance_provider.dart
- test_api_admin.py
- @playwright/test
- flagged_detail_screen.dart
- attendance_constants.dart
- get_logger
- SessionService
- offline_payload.dart
- BasePage
- leaderboard.dart
- AttendanceRepository
- GamificationService
- devDependencies
- GeofenceMap.tsx
- compilerOptions
- profile_settings_list.dart
- BroadcastNotificationModal.tsx
- 🚀 Key Features
- master_data.py
- smart_pass_provider.dart
- user.dart
- test_service_teacher.py
- leave_requests_screen.dart
- leave_history_screen.dart
- notification_service.py
- smart_pass_screen.dart
- conftest.py
- form.tsx
- test-fixtures.ts
- ai_orchestrator.py
- adb_mobile_screen_tester.py
- device_change_dialog.dart
- .complete_onboarding_in_browser
- absentee_scanner.py
- AIOrchestrator
- dropdown-menu.tsx
- reset-password/page.tsx
- ConnectionManager
- offline_sync_service.dart
- AdminSetupService
- student_stats.dart
- String?
- manifest.json
- email_service.py
- S3Service
- PageObjects
- glass_button.dart
- badge.tsx
- AdminClassesPage
- AdminTeachersPage
- AdminVerificationSettingsPage
- AttendanceTrendChart.tsx
- reset_password_provider.dart
- TestRunner
- SystemConfigRepository
- verification_preview_frame.dart
- TeacherSessionsPage
- E2ETestRunner
- SessionSimulationService
- Agent Guidelines & Engineering Standards
- test_service_admin.py
- StudentEnrollmentService
- AdminStudentsPage
- AdminClassroomsPage
- AdminDepartmentsPage
- AdminDesignationsPage
- AdminSubjectsPage
- LoginPage
- scripts
- info_banner.dart
- auth_api.dart
- ref_playwright
- summary_reporter.py
- Settings
- package:flutter/material.dart
- main.py
- app_notification.dart
- AdminAuditPage
- AdminOverviewPage
- AdminScannerPage
- BulkImportComponent
- ForgotPasswordPage
- ResetPasswordPage
- TeacherOverviewPage
- history_calendar_tab.dart
- EdgeWorkflowsService
- CommandPaletteModal.tsx
- TeacherReviewPage
- verification_camera_mixin.dart
- history/page.tsx
- Sidebar.tsx
- WebSocketClient
- MobileE2ERunner
- middleware.ts
- logger.ts
- location_exceptions.dart
- app/layout.tsx
- FlutterActivity
- frontend/README.md
- s3_service.py
- smart_attendance_app
- adb_login_and_capture.py
- rules/graphify.md
- workflows/graphify.md
- backend/README.md
- DeepInteractiveRunner
- postcss.config.mjs
- extensions.dart
- LogEvent
- ref_path
- seed/__init__.py
- authStore.ts
- AttendanceRepository
- DateTime?
- Exception
- LeaderboardResponse?
- T
- DashboardKpiStrip.tsx
- useNotifications.test.ts
- LeaveRequestCreate
- NotificationItemRow.tsx
- build

## God Nodes (most connected - your core abstractions)
1. `react` - 153 edges
2. `getApiErrorMessage()` - 146 edges
3. `lucide-react` - 110 edges
4. `AdminService` - 108 edges
5. `cn()` - 93 edges
6. `api` - 66 edges
7. `next` - 65 edges
8. `applyValidationErrorsToForm()` - 63 edges
9. `TeacherService` - 61 edges
10. `BasePage` - 57 edges

## Surprising Connections (you probably didn't know these)
- `clean_database()` --calls--> `connect_redis()`  [INFERRED]
  scripts/seed/db_cleaner.py → backend/app/db/redis.py
- `clean_database()` --calls--> `disconnect_redis()`  [INFERRED]
  scripts/seed/db_cleaner.py → backend/app/db/redis.py
- `create_student()` --uses--> `StudentCreate`  [INFERRED]
  backend/app/api/admin.py → backend/app/schemas/student.py
- `create_student()` --uses--> `AdminService`  [INFERRED]
  backend/app/api/admin.py → backend/app/services/admin_service.py
- `create_teacher()` --uses--> `TeacherCreate`  [INFERRED]
  backend/app/api/admin.py → backend/app/schemas/teacher.py

## Import Cycles
- None detected.

## Communities (193 total, 48 thin omitted)

### Community 0 - "test_api_teacher.py"
Cohesion: 0.13
Nodes (29): AbsentStudentItem, AcademicClassWithGeofenceResponse, AttendanceManualOverride, AttendanceMatrixResponse, AttendanceMatrixSessionItem, AttendanceMatrixStudentItem, ClassAttendanceExportItem, ClassStatsResponse (+21 more)

### Community 1 - "getApiErrorMessage"
Cohesion: 0.04
Nodes (87): ForgotPasswordPage(), handleResend(), onSubmit(), LoginPage(), handleSuccessRedirect(), onSubmit(), OnboardingContent(), checkToken() (+79 more)

### Community 2 - "api.ts"
Cohesion: 0.09
Nodes (58): nextConfig, SystemConfig, colorVariants, colorVariants, ActiveSessionsCard(), ActiveSessionsCardProps, ManualAttendanceStats(), ManualAttendanceStatsProps (+50 more)

### Community 3 - "package:flutter_riverpod/flutter_riverpod.dart"
Cohesion: 0.03
Nodes (84): ConsumerWidget, notificationsLoadingProvider, notificationsProvider, pendingCountProvider, AnalyticsScreen, _AnalyticsScreenState, build, createState (+76 more)

### Community 4 - "package:smart_attendance_app/shared/widgets/glass_card.dart"
Cohesion: 0.03
Nodes (84): Color, AttendanceHistoryItem, AttendanceHistoryResponse, AnalyticsKpiOverview, build, data, target, AnalyticsSubjectGoals (+76 more)

### Community 5 - "attendance_service.py"
Cohesion: 0.08
Nodes (39): app_api_ws, app_repositories_geofence_repo, app_services_ai_orchestrator, app_services_system_config_service, app_utils_geofencing, RoleChecker, create_access_token(), decode_access_token() (+31 more)

### Community 6 - "api/student.py"
Cohesion: 0.07
Nodes (55): app_schemas_attendance, app_schemas_leave, app_services_attendance_service, app_services_gamification_service, app_services_student_service, analyze_attendance(), confirm_attendance(), create_leave_request() (+47 more)

### Community 7 - "onboarding/page.tsx"
Cohesion: 0.06
Nodes (40): VerifyData, GENDER_OPTIONS, SEMESTER_OPTIONS, StudentFormFields(), StudentFormFieldsProps, EditStudentFormFields(), EditStudentFormFieldsProps, GENDER_OPTIONS (+32 more)

### Community 8 - "admin/dashboard/page.tsx"
Cohesion: 0.08
Nodes (32): AuditPage(), ActivityDetailModal(), ActivityDetailModalProps, ActivityCategory, ActivityFilterBar(), ActivityFilterBarProps, CATEGORIES, ActivityLogTable() (+24 more)

### Community 9 - "lucide-react"
Cohesion: 0.09
Nodes (34): classColumns, EnrollStudentRowProps, ClassesPage(), StudentsPage(), studentColumns, TeachersPage(), teacherColumns, LeaveDocumentModal() (+26 more)

### Community 10 - "react"
Cohesion: 0.04
Nodes (66): EnrollStudentRow(), ScannerControlsProps, ManualAttendanceStudentRow(), ManualAttendanceStudentRowProps, GetRosterColumnsProps, Button, ButtonProps, buttonVariants (+58 more)

### Community 11 - "useAuthStore"
Cohesion: 0.31
Nodes (9): AdminDashboardPage(), DashboardLayout(), Header(), HeaderProps, NotificationPopover(), NotificationPopoverProps, Sidebar(), useNotifications() (+1 more)

### Community 12 - "api/auth.py"
Cohesion: 0.10
Nodes (40): app_services_auth_service, app_services_device_change_service, change_password(), complete_onboarding(), forgot_password(), get_me(), get_public_system_config(), login() (+32 more)

### Community 13 - "verification_ai_review_card.dart"
Cohesion: 0.04
Nodes (50): Animation, AnimationController, CustomPainter, AttendanceAnalysisResult, GeofenceStatus, build, color, createState (+42 more)

### Community 14 - "api/teacher.py"
Cohesion: 0.11
Nodes (37): app_services_leave_service, app_services_session_service, approve_device_change(), approve_leave(), bulk_mark_attendance(), export_class_attendance(), get_absent_students(), get_attendance_by_id() (+29 more)

### Community 15 - "setup.mjs"
Cohesion: 0.07
Nodes (45): ref_node_child_process, ref_node_crypto, ref_node_fs, ref_node_path, ref_node_url, checkVenvPythonVersion(), createPython311Venv(), ensureBackendDirectories() (+37 more)

### Community 16 - "classes/[id]/edit/page.tsx"
Cohesion: 0.10
Nodes (26): SEMESTER_OPTIONS, EnrollHeader(), EnrollHeaderProps, EnrollStudentFilters(), EnrollStudentFiltersProps, GlassSelect(), AssignTeacherFormData, assignTeacherSchema (+18 more)

### Community 17 - "seed_and_simulate.py"
Cohesion: 0.08
Nodes (32): argparse, BrowserContext, httpx, random, re, rich_console, rich_progress, Admin Master Data Setup Automation. Configures institutional master data: -… (+24 more)

### Community 18 - "test_api_auth.py"
Cohesion: 0.12
Nodes (8): app_schemas_system_config, BaseModel, SystemConfigResponse, SystemConfigUpdate, test_get_public_system_config(), test_login_success(), test_login_with_student_enrollment_id(), test_logout_revokes_token()

### Community 19 - "main.dart"
Cohesion: 0.09
Nodes (22): @pragma, HttpOverrides, addNotification, AppHttpOverrides, callbackDispatcher, createHttpClient, _firebaseMessagingBackgroundHandler, initialize (+14 more)

### Community 20 - "AdminService"
Cohesion: 0.06
Nodes (13): generate_temporary_password(), ClassResponse, StudentCreate, StudentResponse, TeacherResponse, AdminService, test_create_class_and_assign_teacher(), test_create_student_admin() (+5 more)

### Community 21 - "package:smart_attendance_app/app/theme.dart"
Cohesion: 0.03
Nodes (64): build, _buildChip, GeofenceDistanceMetrics, state, statusColor, build, GeofenceStatusCard, onRetry (+56 more)

### Community 22 - "theme.dart"
Cohesion: 0.04
Nodes (45): accentAmber, accentEmerald, accentPink, accentTeal, baseText, bgCanvas, bgPrimary, bgSecondary (+37 more)

### Community 23 - "preferences_service.dart"
Cohesion: 0.04
Nodes (44): getAttendanceTarget, getLowAttendanceThreshold, getNotifyClassStart, getNotifyLowAttendance, getNotifySyncDone, getNotifyWindowOpen, isFirstCameraUse, _keyAttendanceTarget (+36 more)

### Community 24 - "notifications.py"
Cohesion: 0.05
Nodes (59): app_api_dependencies, app_schemas_common, app_schemas_health, app_schemas_notification, app_schemas_search, app_services_notification_service, app_services_search_service, broadcast_notification() (+51 more)

### Community 25 - "verification_step_content.dart"
Cohesion: 0.05
Nodes (36): VerificationStep, isCameraReady, onAnalyze, onCapture, onRetake, onSubmit, showTips, step (+28 more)

### Community 26 - "notification_service.dart"
Cohesion: 0.08
Nodes (23): WebSocketService, addNotification, _api, _box, clear, clearAll, deleteNotification, dispose (+15 more)

### Community 27 - "List"
Cohesion: 0.08
Nodes (23): List, activeStepIndex, build, stepLabels, subtitle, title, VerificationStatusOverlay, build (+15 more)

### Community 28 - "geofence_verification_provider.dart"
Cohesion: 0.06
Nodes (35): AutoDisposeNotifier, dart:math, describeDistance, GeofenceCalculator, isWithinGeofence, describeDistance, ensurePermissionsGranted, getAveragedPosition (+27 more)

### Community 29 - "app_db_client"
Cohesion: 0.10
Nodes (9): AcademicClass, app_db_client, ClassRepository, GeofenceRepository, datetime, SessionRepository, Geofence, prisma_models (+1 more)

### Community 30 - "reset_password_screen.dart"
Cohesion: 0.04
Nodes (66): class, ConsumerState, ConsumerStatefulWidget, FormState, authProvider, resetPasswordProvider, build, _confirmPasswordController (+58 more)

### Community 31 - "_handle_generic_err"
Cohesion: 0.17
Nodes (37): assign_teacher(), bulk_create_classes(), bulk_create_classrooms(), bulk_create_departments(), bulk_create_designations(), bulk_create_students(), bulk_create_subjects(), bulk_create_teachers() (+29 more)

### Community 32 - "hive_service.dart"
Cohesion: 0.07
Nodes (26): Box, dart:convert, addToQueue, cacheProfile, cacheSystemConfig, clearAll, _configBox, getCachedProfile (+18 more)

### Community 33 - "student_api.dart"
Cohesion: 0.08
Nodes (23): dart:io, analyzeAttendance, confirmAttendance, createLeaveRequest, _dio, getLeaderboard, getMyAttendance, getMyClasses (+15 more)

### Community 34 - "constants.dart"
Cohesion: 0.09
Nodes (21): defineUrl, envUrl, kConnectTimeout, kGeofenceGraceMeters, kGpsAveragingSamples, kGpsTimeoutSeconds, kHiveBoxConfig, kHiveBoxNotifications (+13 more)

### Community 35 - "websocket_service.dart"
Cohesion: 0.06
Nodes (34): computeRouterRedirect, null, authState, _channel, connect, disconnect, dispose, _maxReconnectAttempts (+26 more)

### Community 36 - "router.dart"
Cohesion: 0.06
Nodes (34): ChangeNotifier, GoRouter, notifier, notify, rootNavigatorKey, RouterNotifier, routerNotifierProvider, shellNavigatorKey (+26 more)

### Community 37 - "verification_screen.dart"
Cohesion: 0.09
Nodes (31): hiveServiceProvider, preferencesServiceProvider, attendanceVerificationProvider, geofenceVerificationProvider, capturePhoto, VerificationCameraMixin, _aiStepIndex, _aiSteps (+23 more)

### Community 39 - "notification_tile.dart"
Cohesion: 0.11
Nodes (17): Map, LocalNotification, build, CalendarMonthGrid, focusedMonth, grouped, onSelectDate, selectedDate (+9 more)

### Community 40 - "types/index.ts"
Cohesion: 0.04
Nodes (76): AnomalyCard(), AnomalyCardProps, getRiskLevel(), WEEKDAYS, ScannerControls(), ActiveTab, TeacherClassesPage(), ActiveSessionBanner() (+68 more)

### Community 41 - "typing"
Cohesion: 0.15
Nodes (17): app_core_config, check_database(), check_redis(), check_s3(), get_health_status(), get, Response, HealthResponse (+9 more)

### Community 42 - "attendance.dart"
Cohesion: 0.06
Nodes (33): activeSessionId, attendanceId, backgroundScore, classId, className, createdAt, faceScore, finalAiScore (+25 more)

### Community 43 - "schemas/admin.py"
Cohesion: 0.11
Nodes (25): AbsenteeAnomalyItem, AssignTeacherRequest, AuditLogResponse, ClassBulkCreateRequest, ClassBulkItem, ClassCreate, ClassroomBulkCreateRequest, ClassroomBulkItem (+17 more)

### Community 44 - "build"
Cohesion: 0.29
Nodes (8): build, build, build, build, Route /leave/history, Route /leave/request, Route /notifications, Route /smart-pass

### Community 45 - "app.dart"
Cohesion: 0.10
Nodes (25): build, createState, dispose, _handleNotificationClick, inferNotificationSeverity, _initializeFcm, initState, kSeverityInfo (+17 more)

### Community 46 - "menu_grid_item.dart"
Cohesion: 0.09
Nodes (20): build, categories, LeaveCategorySelector, onSelected, selectedCategory, build, currentIndex, GlassBottomNav (+12 more)

### Community 47 - "secure_storage.dart"
Cohesion: 0.17
Nodes (11): FlutterSecureStorage, clearAll, getDeviceUUID, getRole, getToken, saveDeviceUUID, saveToken, saveUserRole (+3 more)

### Community 48 - "auth_provider.dart"
Cohesion: 0.07
Nodes (27): dio, _extractDetail, mapDioError, normalizedBaseUrl, storage, AuthStatus, _authErrorSubscription, AuthNotifier (+19 more)

### Community 49 - "session_provider.dart"
Cohesion: 0.07
Nodes (29): _adjustPollInterval, _api, classId, className, _currentInterval, dispose, errorMessage, fetchSessions (+21 more)

### Community 50 - "api/admin.py"
Cohesion: 0.14
Nodes (23): app_core_rate_limit, export_audit_logs(), get_admin_stats(), get_audit_logs(), get_class_by_id(), get_classes(), get_classroom(), get_classrooms() (+15 more)

### Community 51 - "frontend/package.json"
Cohesion: 0.07
Nodes (26): eslintConfig, name, private, version, axios, clsx, eslint, eslint-config-next (+18 more)

### Community 52 - "leave_request.dart"
Cohesion: 0.09
Nodes (21): approved, approvedBy, approverNote, createdAt, documentUrl, endDate, enrollmentNumber, fromJson (+13 more)

### Community 53 - "attendance_repository.dart"
Cohesion: 0.10
Nodes (20): analyzeAttendance, AttendanceRepository, AttendanceSubmitResult, confirmAttendance, getHistory, _hive, OfflineQueued, OnlineResult (+12 more)

### Community 54 - "auth_repository.dart"
Cohesion: 0.10
Nodes (19): DeviceInfoPlugin, _deviceInfo, DeviceService, getDeviceUUID, _secureStorage, SecureStorageService, _authApi, authRepositoryProvider (+11 more)

### Community 55 - "result_config.dart"
Cohesion: 0.08
Nodes (24): background, color, error, face, flagged, icon, liveness, offline (+16 more)

### Community 56 - "class_session_card.dart"
Cohesion: 0.11
Nodes (18): Duration?, ClassSession, _canMark, ClassSessionCard, _ClassSessionCardState, _countdownTimer, createState, didUpdateWidget (+10 more)

### Community 57 - "glass_input.dart"
Cohesion: 0.08
Nodes (24): FocusNode?, build, controller, FlaggedNoteForm, isSubmitting, noteSubmitted, onSubmit, build (+16 more)

### Community 58 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, axios, class-variance-authority, clsx, @hookform/resolvers, leaflet, lucide-react, next (+18 more)

### Community 59 - "useBulkImportProcessor.ts"
Cohesion: 0.16
Nodes (19): getSampleCsv(), buildBatches(), buildBulkPayload(), BULK_BATCH_SIZE, BatchProgressItem, BulkImportEntityType, BulkImportSummary, ImportStage (+11 more)

### Community 60 - "attendance_utils.dart"
Cohesion: 0.08
Nodes (24): calculateHighestStreak, calculateStreak, canMiss, computeAttendanceNeeds, computeSubjectPct, computeWeekPresent, countAbsent, countFlagged (+16 more)

### Community 61 - "os"
Cohesion: 0.17
Nodes (20): asyncio, json, os, playwright_async_api, capture_screenshot(), run_cmd(), test_emulator_e2e(), capture_screenshot() (+12 more)

### Community 62 - "history_provider.dart"
Cohesion: 0.07
Nodes (33): StudentApi, NotificationsNotifier, PendingCountNotifier, _api, copyWith, data, errorMessage, fetch (+25 more)

### Community 63 - "TeacherService"
Cohesion: 0.26
Nodes (4): GeofenceUpsert, datetime, TeacherService, test_teacher_service_upsert_geofence()

### Community 64 - "notification_api.dart"
Cohesion: 0.08
Nodes (23): category, createdAt, deleteNotification, _dio, fromJson, getNotifications, id, isRead (+15 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (23): bin, dev, setup, description, name, private, scripts, backend:setup (+15 more)

### Community 66 - "attendance_provider.dart"
Cohesion: 0.11
Nodes (19): accuracy, analysisResult, analyze, AttendanceNotifier, AttendanceVerificationState, confirm, copyWith, errorMessage (+11 more)

### Community 67 - "test_api_admin.py"
Cohesion: 0.13
Nodes (13): app_schemas_master_data, app_schemas_pagination, AdminStatsResponse, BulkImportResponse, DepartmentResponse, PaginatedResponse, PaginationParams, BaseModel (+5 more)

### Community 68 - "@playwright/test"
Cohesion: 0.12
Nodes (6): ClassInput, StudentInput, TeacherInput, TeacherAnalyticsPage, TeacherHistoryPage, @playwright/test

### Community 69 - "flagged_detail_screen.dart"
Cohesion: 0.12
Nodes (17): attendanceRepositoryProvider, attendanceId, build, createState, dispose, FlaggedDetailScreen, _FlaggedDetailScreenState, initState (+9 more)

### Community 70 - "attendance_constants.dart"
Cohesion: 0.09
Nodes (21): kAttendanceTypeLocal, kAttendanceTypePush, kGoodScoreThreshold, kImagePickQuality, kMinBrightnessForPhoto, kMinSharpnessForPhoto, kNoteMaxChars, kOverallGoodPct (+13 more)

### Community 71 - "get_logger"
Cohesion: 0.08
Nodes (35): app_core_logging_config, app_core_security, app_db_redis, app_repositories_class_repo, app_repositories_student_repo, app_repositories_system_config_repo, app_repositories_teacher_repo, app_repositories_user_repo (+27 more)

### Community 72 - "SessionService"
Cohesion: 0.20
Nodes (8): start_session(), SessionResponse, SessionStart, notify_teacher_session_concluded(), SessionScheduler, Mark session as inactive, delete from Redis, and mark all unsubmitted students…, SessionService, test_start_and_stop_session()

### Community 73 - "offline_payload.dart"
Cohesion: 0.11
Nodes (19): @HiveType, HiveObject, hashCode, OfflineAttendancePayloadAdapter, operator, read, typeId, write (+11 more)

### Community 74 - "BasePage"
Cohesion: 0.13
Nodes (3): BasePage, TeacherClassesPage, TeacherLeavesPage

### Community 75 - "leaderboard.dart"
Cohesion: 0.11
Nodes (19): int?, AppException, AuthException, message, NetworkException, ServerException, statusCode, toString (+11 more)

### Community 76 - "AttendanceRepository"
Cohesion: 0.10
Nodes (11): app_repositories_attendance_repo, app_repositories_enrollment_repo, app_repositories_leave_repo, app_repositories_session_repo, AttendanceRepository, Attendance, EnrollmentRepository, LeaveRepository (+3 more)

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

### Community 81 - "profile_settings_list.dart"
Cohesion: 0.06
Nodes (29): Container, build, child, ShellScaffold, _tabPaths, build, icon, iconColor (+21 more)

### Community 82 - "BroadcastNotificationModal.tsx"
Cohesion: 0.19
Nodes (13): BroadcastNotificationModal(), BroadcastNotificationModalProps, INITIAL_FORM, NotificationTabs(), NotificationTabsProps, TABS, UseNotificationsReturn, NotificationBroadcastCreate (+5 more)

### Community 83 - "🚀 Key Features"
Cohesion: 0.11
Nodes (18): 1. Multi-Layered AI Verification, 1. Prerequisites, 2. Dynamic Location & Geofencing, 2. One-Command Setup, 3. Hardware Device Binding (Anti-Proxy), 3. Running Development Servers, 4. Offline Smart Pass (Encrypted Fallback), 5. Automated Outlier Scanning & Absentee Analytics (+10 more)

### Community 84 - "master_data.py"
Cohesion: 0.20
Nodes (11): ClassroomCreate, ClassroomResponse, ClassroomUpdate, DesignationCreate, DesignationResponse, DesignationUpdate, BaseModel, field_validator (+3 more)

### Community 85 - "smart_pass_provider.dart"
Cohesion: 0.07
Nodes (29): Duration get, attendanceStatus, className, enrollmentNumber, expiresAt, fromJson, isExpired, markedAt (+21 more)

### Community 86 - "user.dart"
Cohesion: 0.11
Nodes (17): accessToken, email, enrollmentNumber, faceRegistered, firstName, fromJson, hasFaceRegistered, id (+9 more)

### Community 87 - "test_service_teacher.py"
Cohesion: 0.21
Nodes (12): app_services_teacher_service, BulkAttendanceRecord, BulkMarkRequest, asyncio, test_recalculate_streak_consecutive_present(), test_recalculate_streak_no_enrollments(), asyncio, test_teacher_service_bulk_mark() (+4 more)

### Community 88 - "leave_requests_screen.dart"
Cohesion: 0.08
Nodes (24): File?, build, createState, dispose, _endDate, _isSubmitting, LeaveRequestsScreen, _LeaveRequestsScreenState (+16 more)

### Community 89 - "leave_history_screen.dart"
Cohesion: 0.09
Nodes (21): build, _buildEmpty, _buildError, _buildList, leaveHistoryProvider, LeaveHistoryScreen, listResponse, response (+13 more)

### Community 90 - "notification_service.py"
Cohesion: 0.26
Nodes (10): Confirm a previously analyzed submission using its review token. Decodes the…, broadcast_announcement(), create_in_app_notification(), notify_student_attendance_flagged(), notify_student_attendance_reviewed(), notify_student_leave_status(), notify_teacher_attendance_flagged(), Any (+2 more)

### Community 91 - "smart_pass_screen.dart"
Cohesion: 0.06
Nodes (39): LocationPermission, checkAttendancePermissions, hasLocationAccess, isLocationServiceEnabled, isPermanentlyDenied, locationPermission, message, openAppSettings (+31 more)

### Community 92 - "conftest.py"
Cohesion: 0.19
Nodes (13): AwaitableMock, mock_academic_class(), mock_admin_user(), mock_redis(), mock_student_profile(), mock_student_user(), mock_teacher_profile(), mock_teacher_user() (+5 more)

### Community 93 - "form.tsx"
Cohesion: 0.17
Nodes (14): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+6 more)

### Community 94 - "test-fixtures.ts"
Cohesion: 0.45
Nodes (4): frontend_e2e_fixtures_test_fixtures_expect, generateYopmail(), test, TEST_CREDENTIALS

### Community 95 - "ai_orchestrator.py"
Cohesion: 0.18
Nodes (9): _load_liveness_model(), Any, cv2, deepface, huggingface_hub, numpy, shutil, tensorflow_keras_applications_mobilenet (+1 more)

### Community 96 - "adb_mobile_screen_tester.py"
Cohesion: 0.71
Nodes (6): adb(), capture(), keyevent(), main(), tap(), text()

### Community 97 - "device_change_dialog.dart"
Cohesion: 0.16
Nodes (14): dioProvider, deviceServiceProvider, build, createState, DeviceChangeDialog, _DeviceChangeDialogState, dispose, email (+6 more)

### Community 99 - "absentee_scanner.py"
Cohesion: 0.24
Nodes (11): app_services_absentee_scanner, scan_absentee_anomalies(), _detect_pattern(), Any, run_absentee_scan(), _run_isolation_forest(), asyncio, test_run_absentee_scan_detects_outliers() (+3 more)

### Community 100 - "AIOrchestrator"
Cohesion: 0.29
Nodes (3): AIOrchestrator, _load_and_crop(), ndarray

### Community 101 - "dropdown-menu.tsx"
Cohesion: 0.15
Nodes (12): DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuSeparator, DropdownMenuSub (+4 more)

### Community 102 - "reset-password/page.tsx"
Cohesion: 0.17
Nodes (10): VerifyData, PasswordRequirementsChecklist(), PasswordRequirementsChecklistProps, usePasswordRules(), ResetPasswordStatusCard(), ResetPasswordStatusCardProps, StudentMobileAppCallout(), StudentMobileAppCalloutProps (+2 more)

### Community 104 - "offline_sync_service.dart"
Cohesion: 0.07
Nodes (26): dart:async, AppEvents, _authErrorController, authErrorStream, broadcastAuthError, NotificationService, _className, _connectivitySub (+18 more)

### Community 105 - "AdminSetupService"
Cohesion: 0.18
Nodes (8): AdminSetupService, Any, AsyncClient, Creates academic subjects (Theory & Practical)., Creates classroom and laboratory venues., Logs into admin account and acquires JWT access token., Creates institutional departments., Creates academic designations.

### Community 106 - "student_stats.dart"
Cohesion: 0.18
Nodes (10): absentCount, attendancePercentage, currentStreak, excusedCount, flaggedCount, fromJson, highestStreak, presentCount (+2 more)

### Community 107 - "String?"
Cohesion: 0.03
Nodes (59): CameraController?, dart:ui, build, isSecondaryGhost, onPrimaryPressed, onSecondaryPressed, primaryIcon, primaryLabel (+51 more)

### Community 108 - "manifest.json"
Cohesion: 0.18
Nodes (10): background_color, description, display, icons, name, orientation, prefer_related_applications, short_name (+2 more)

### Community 109 - "email_service.py"
Cohesion: 0.18
Nodes (10): aiosmtplib, app_core_url_resolver, Request, Dynamically resolves the frontend base URL for email links, redirects, and…, resolve_frontend_url(), EmailService, Any, email_mime_multipart (+2 more)

### Community 111 - "PageObjects"
Cohesion: 0.20
Nodes (3): PageObjects, TeacherDeviceChangesPage, TeacherProfilePage

### Community 112 - "glass_button.dart"
Cohesion: 0.07
Nodes (28): EdgeInsetsGeometry, background, border, build, _ButtonColors, fontSize, foreground, GlassButton (+20 more)

### Community 113 - "badge.tsx"
Cohesion: 0.50
Nodes (4): Badge(), BadgeProps, badgeVariants, class-variance-authority

### Community 117 - "AttendanceTrendChart.tsx"
Cohesion: 0.22
Nodes (5): monthlyData, MonthlyDataPoint, breakdownData, BreakdownItem, recharts

### Community 118 - "reset_password_provider.dart"
Cohesion: 0.12
Nodes (16): AuthRepository, copyWith, email, errorMessage, isSubmitting, isSuccess, isValid, isVerifying (+8 more)

### Community 120 - "SystemConfigRepository"
Cohesion: 0.16
Nodes (8): Gets the system configuration. If it doesn't exist, creates a default one., SystemConfigRepository, fromJson, isAiBackgroundValidationEnabled, isFaceRecognitionEnabled, isGpsVerificationEnabled, SystemConfiguration, toJson

### Community 121 - "verification_preview_frame.dart"
Cohesion: 0.18
Nodes (10): bool get, double?, blurScore, brightnessScore, build, imagePath, isAnalyzingQuality, isPoorQuality (+2 more)

### Community 124 - "SessionSimulationService"
Cohesion: 0.26
Nodes (7): Any, AsyncClient, Runs the multi-day attendance simulation across classes with live progress., Acquires auth tokens for faculty members to drive session endpoints., Categorizes students into Exemplary (~60%), Irregular (~25%), and Defaulter…, Simulates 1 class session: start -> bulk mark -> stop., SessionSimulationService

### Community 125 - "Agent Guidelines & Engineering Standards"
Cohesion: 0.29
Nodes (6): 1. Environment & Configuration Sync, 2. No Hardcoding, 3. No Patches on Patches (Clean Code First), 4. File Structure & Quality Rules, 5. Version Control & Automated Delivery, Agent Guidelines & Engineering Standards

### Community 126 - "test_service_admin.py"
Cohesion: 0.23
Nodes (8): app_schemas_admin, app_services_admin_service, field_validator, TeacherCreate, asyncio, test_admin_service_create_student(), test_admin_service_create_teacher(), test_admin_service_enroll_students()

### Community 127 - "StudentEnrollmentService"
Cohesion: 0.27
Nodes (6): Any, AsyncClient, Builds student specification objects with PRNs and @yopmail.com emails., Creates cohorts for Division A and Division B in CSE., Enrolls students into appropriate theory sections and practical lab batches., StudentEnrollmentService

### Community 134 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, start, test, test:watch

### Community 135 - "info_banner.dart"
Cohesion: 0.06
Nodes (32): IconData?, actionLabel, _BannerConfig, BannerSeverity, build, color, customIcon, icon (+24 more)

### Community 136 - "auth_api.dart"
Cohesion: 0.18
Nodes (10): Dio, AuthApi, authApiProvider, changePassword, _dio, getProfile, login, logout (+2 more)

### Community 138 - "summary_reporter.py"
Cohesion: 0.25
Nodes (7): rich, rich_panel, rich_table, print_final_summary(), Any, Summary Reporting & Terminal Dashboard Module. Renders final summary tables and…, Prints beautiful formatted terminal summary tables using rich.

### Community 139 - "Settings"
Cohesion: 0.33
Nodes (3): field_validator, Settings, BaseSettings

### Community 140 - "package:flutter/material.dart"
Cohesion: 0.09
Nodes (24): LeaderboardEntry, slideRightPage, slideUpPage, leaderboardProvider, build, _buildBody, _buildUserSummaryCard, LeaderboardScreen (+16 more)

### Community 141 - "main.py"
Cohesion: 0.07
Nodes (33): app_api, app_middleware_request_logging, app_services_s3_service, app_services_scheduler, connect_db(), disconnect_db(), connect_redis(), disconnect_redis() (+25 more)

### Community 142 - "app_notification.dart"
Cohesion: 0.15
Nodes (12): body, category, copyWith, fromMap, id, isRead, link, severity (+4 more)

### Community 150 - "history_calendar_tab.dart"
Cohesion: 0.05
Nodes (45): build, createState, desc, _expanded, FlaggedTroubleshootFaq, _FlaggedTroubleshootFaqState, icon, _TipItem (+37 more)

### Community 151 - "EdgeWorkflowsService"
Cohesion: 0.29
Nodes (5): EdgeWorkflowsService, Any, AsyncClient, Simulates student device changes and teacher resolution., Simulates student leave submissions and teacher review queue processing.

### Community 152 - "CommandPaletteModal.tsx"
Cohesion: 0.27
Nodes (6): getCommandIcon(), CommandPaletteModal(), CommandPaletteModalProps, useDebounce(), GlobalSearchResponse, SearchResultItem

### Community 154 - "verification_camera_mixin.dart"
Cohesion: 0.18
Nodes (10): blurScore, brightnessScore, camera, cameraError, disposeCamera, initCamera, isAnalyzingQuality, isCameraReady (+2 more)

### Community 155 - "history/page.tsx"
Cohesion: 0.21
Nodes (9): ColumnProps, getSessionLogColumns(), SessionLogItem, AcademicClass, HistoryFilters(), HistoryFiltersProps, AcademicClass, HistoryPage() (+1 more)

### Community 156 - "Sidebar.tsx"
Cohesion: 0.33
Nodes (7): adminLinks, NavItem, setupLinks, teacherLinks, teacherReportLinks, SidebarProps, SidebarUserFooter()

### Community 159 - "middleware.ts"
Cohesion: 0.67
Nodes (3): config, middleware(), parseAuthCookie()

### Community 160 - "logger.ts"
Cohesion: 0.50
Nodes (3): logger, LogLevel, PREFIX

### Community 161 - "location_exceptions.dart"
Cohesion: 0.50
Nodes (3): LocationException, message, toString

### Community 165 - "s3_service.py"
Cohesion: 0.18
Nodes (8): Service Health & Connectivity Checker Checks AWS S3 and PostgreSQL RDS…, boto3, botocore_config, botocore_exceptions, dotenv, mimetypes, socket, uuid

### Community 167 - "adb_login_and_capture.py"
Cohesion: 0.80
Nodes (5): adb(), key(), main(), tap(), type_text()

### Community 173 - "extensions.dart"
Cohesion: 0.22
Nodes (8): DateTimeFormatting, formattedDate, formattedDateTime, isSameDay, shortDate, StringFormatting, truncate, String? get

### Community 174 - "LogEvent"
Cohesion: 0.32
Nodes (5): ingest_log(), post, LogEvent, BaseModel, field_validator

### Community 175 - "ref_path"
Cohesion: 0.25
Nodes (4): frontend_node_modules_playwright_test_index, ref_fs, ref_path, @vitejs/plugin-react

### Community 177 - "authStore.ts"
Cohesion: 0.36
Nodes (6): SidebarUserFooterProps, AuthActions, AuthState, AuthStore, cookieStorage, UserProfile

### Community 189 - "useNotifications.test.ts"
Cohesion: 0.39
Nodes (5): mockAdminProfile, mockDeviceChangeRequest, mockStudentProfile, mockTeacherProfile, Role

### Community 190 - "LeaveRequestCreate"
Cohesion: 0.40
Nodes (3): LeaveRequestCreate, field_validator, date

### Community 191 - "NotificationItemRow.tsx"
Cohesion: 0.60
Nodes (4): formatRelativeTime(), getIcon(), NotificationItemRow(), NotificationItemRowProps

### Community 192 - "build"
Cohesion: 0.50
Nodes (4): build, build, Route /history, Route /home

## Knowledge Gaps
- **1460 isolated node(s):** `ClassInput`, `StudentInput`, `TeacherInput`, `eslintConfig`, `nextConfig` (+1455 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2038 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **48 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminService` connect `AdminService` to `StudentRepository`, `get_logger`, `schemas/admin.py`, `AttendanceRepository`, `api/auth.py`, `api/admin.py`, `app_db_client`, `test_service_admin.py`, `_handle_generic_err`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `getApiErrorMessage`, `api.ts`, `onboarding/page.tsx`, `admin/dashboard/page.tsx`, `lucide-react`, `useAuthStore`, `classes/[id]/edit/page.tsx`, `CommandPaletteModal.tsx`, `history/page.tsx`, `Sidebar.tsx`, `types/index.ts`, `authStore.ts`, `frontend/package.json`, `useBulkImportProcessor.ts`, `DashboardKpiStrip.tsx`, `NotificationItemRow.tsx`, `GeofenceMap.tsx`, `BroadcastNotificationModal.tsx`, `form.tsx`, `dropdown-menu.tsx`, `reset-password/page.tsx`, `badge.tsx`, `AttendanceTrendChart.tsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `@playwright/test` connect `@playwright/test` to `AdminClassroomsPage`, `AdminDepartmentsPage`, `AdminDesignationsPage`, `AdminSubjectsPage`, `LoginPage`, `AdminAuditPage`, `AdminOverviewPage`, `AdminScannerPage`, `BulkImportComponent`, `ForgotPasswordPage`, `ResetPasswordPage`, `TeacherOverviewPage`, `TeacherReviewPage`, `frontend/package.json`, `BasePage`, `test-fixtures.ts`, `PageObjects`, `AdminVerificationSettingsPage`, `TeacherSessionsPage`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Are the 59 inferred relationships involving `AdminService` (e.g. with `assign_teacher()` and `bulk_create_classes()`) actually correct?**
  _`AdminService` has 59 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ClassInput`, `StudentInput`, `TeacherInput` to the rest of the system?**
  _1460 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `test_api_teacher.py` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `getApiErrorMessage` be split into smaller, more focused modules?**
  _Cohesion score 0.03534798534798535 - nodes in this community are weakly interconnected._