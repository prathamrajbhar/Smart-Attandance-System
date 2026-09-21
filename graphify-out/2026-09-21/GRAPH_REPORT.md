# Graph Report - Smart Attandance System  (2026-09-21)

## Corpus Check
- 496 files · ~600,236 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 30 file(s) not represented in the graph (top: (none) 8, .xml 7, .example 5)

## Summary
- 4144 nodes · 9300 edges · 177 communities (131 shown, 46 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 323 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a5e12b2f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- api/teacher.py
- getApiErrorMessage
- next
- typing
- package:flutter/material.dart
- attendance_service.py
- api/student.py
- reset-password/page.tsx
- types/index.ts
- lucide-react
- cn
- useAuthStore
- api/auth.py
- verification_ai_review_card.dart
- package:flutter_riverpod/flutter_riverpod.dart
- setup.mjs
- StatelessWidget
- seed_and_simulate.py
- datetime
- main.dart
- AdminService
- leave_request.dart
- theme.dart
- preferences_service.dart
- notifications.py
- verification_step_content.dart
- notification_service.dart
- login_error_banner.dart
- geofence_verification_provider.dart
- String?
- reset_password_screen.dart
- _handle_generic_err
- auth_repository.dart
- student_api.dart
- glass_button.dart
- websocket_service.dart
- router.dart
- verification_screen.dart
- smart_pass_provider.dart
- package:go_router/go_router.dart
- flagged_detail_screen.dart
- hive_service.dart
- attendance.dart
- schemas/admin.py
- admin/classes/page.tsx
- app.dart
- constants.dart
- geofence_status_card.dart
- auth_provider.dart
- session_provider.dart
- api/admin.py
- frontend/package.json
- attendance_provider.dart
- attendance_repository.dart
- offline_sync_service.dart
- result_config.dart
- State
- glass_input.dart
- dependencies
- BulkImportModal.tsx
- attendance_utils.dart
- sys
- geofence_radar_indicator.dart
- glass_card.dart
- notification_api.dart
- scripts
- history_list_tab.dart
- test_api_admin.py
- @playwright/test
- classes/[id]/edit/page.tsx
- attendance_constants.dart
- main.py
- react
- offline_payload.dart
- BasePage
- leaderboard.dart
- AttendanceRepository
- .get_leaderboard
- devDependencies
- GeofenceMap.tsx
- compilerOptions
- app_notification.dart
- secure_storage.dart
- 🚀 Key Features
- master_data.py
- smart_pass.dart
- user.dart
- LeaveRepository
- leave_requests_screen.dart
- reset_password_provider.dart
- ClassRepository
- smart_pass_screen.dart
- conftest.py
- form.tsx
- test-fixtures.ts
- build
- os
- device_change_dialog.dart
- SessionRepository
- run_absentee_scan
- AIOrchestrator
- dropdown-menu.tsx
- pulsing_dot.dart
- ConnectionManager
- extensions.dart
- verification_preview_frame.dart
- student_stats.dart
- flagged_troubleshoot_faq.dart
- manifest.json
- email_service.py
- S3Service
- PageObjects
- offlineSyncServiceProvider
- button.tsx
- AdminClassesPage
- AdminTeachersPage
- AdminVerificationSettingsPage
- AttendanceTrendChart.tsx
- Any
- TestRunner
- SystemConfigRepository
- _GeofenceRadarIndicatorState
- TeacherSessionsPage
- E2ETestRunner
- SessionSimulationService
- Agent Guidelines & Engineering Standards
- test_service_admin.py
- global_exception_handler
- AdminStudentsPage
- AdminClassroomsPage
- AdminDepartmentsPage
- AdminDesignationsPage
- AdminSubjectsPage
- LoginPage
- scripts
- RouterNotifier
- vitest
- ref_playwright
- .generate_student_specs
- Settings
- LogEvent
- SessionScheduler
- AdminAuditPage
- AdminOverviewPage
- AdminScannerPage
- BulkImportComponent
- ForgotPasswordPage
- ResetPasswordPage
- TeacherOverviewPage
- adb_login_and_capture.py
- TeacherReviewPage
- summary_reporter.py
- .simulate_device_changes
- .onboard_teachers
- middleware.ts
- logger.ts
- location_exceptions.dart
- FlutterActivity
- frontend/README.md
- AnalyticsPage
- smart_attendance_app
- .complete_onboarding_in_browser
- rules/graphify.md
- workflows/graphify.md
- backend/README.md
- postcss.config.mjs
- seed/__init__.py
- AttendanceRepository
- DateTime?
- Exception
- LeaderboardResponse?
- T

## God Nodes (most connected - your core abstractions)
1. `react` - 148 edges
2. `getApiErrorMessage()` - 134 edges
3. `AdminService` - 108 edges
4. `lucide-react` - 104 edges
5. `cn()` - 93 edges
6. `next` - 65 edges
7. `api` - 63 edges
8. `applyValidationErrorsToForm()` - 63 edges
9. `BasePage` - 57 edges
10. `react-hot-toast` - 54 edges

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

## Communities (177 total, 46 thin omitted)

### Community 0 - "api/teacher.py"
Cohesion: 0.06
Nodes (68): app_services_leave_service, approve_device_change(), approve_leave(), bulk_mark_attendance(), export_class_attendance(), get_absent_students(), get_attendance_by_id(), get_class_stats() (+60 more)

### Community 1 - "getApiErrorMessage"
Cohesion: 0.03
Nodes (90): ForgotPasswordPage(), handleResend(), onSubmit(), LoginPage(), handleSuccessRedirect(), onSubmit(), OnboardingContent(), checkToken() (+82 more)

### Community 2 - "next"
Cohesion: 0.10
Nodes (46): nextConfig, colorVariants, TeacherFormProfile(), TeacherFormProfileProps, EditTeacherFormFields(), EditTeacherFormFieldsProps, colorVariants, ManualAttendanceStatsProps (+38 more)

### Community 3 - "typing"
Cohesion: 0.05
Nodes (50): app_api_dependencies, app_core_logging_config, app_core_security, app_db_client, app_db_redis, app_repositories_attendance_repo, app_repositories_enrollment_repo, app_repositories_leave_repo (+42 more)

### Community 4 - "package:flutter/material.dart"
Cohesion: 0.03
Nodes (101): AttendanceHistoryItem, AttendanceHistoryResponse, AnalyticsKpiOverview, build, data, target, AnalyticsSubjectGoals, build (+93 more)

### Community 5 - "attendance_service.py"
Cohesion: 0.07
Nodes (43): app_api_ws, app_repositories_class_repo, app_repositories_geofence_repo, app_services_ai_orchestrator, app_services_system_config_service, app_utils_geofencing, RoleChecker, create_access_token() (+35 more)

### Community 6 - "api/student.py"
Cohesion: 0.07
Nodes (54): app_schemas_attendance, app_schemas_leave, app_services_attendance_service, app_services_student_service, analyze_attendance(), confirm_attendance(), create_leave_request(), get_leaderboard() (+46 more)

### Community 7 - "reset-password/page.tsx"
Cohesion: 0.06
Nodes (38): VerifyData, VerifyData, PasswordRequirementsChecklist(), PasswordRequirementsChecklistProps, usePasswordRules(), ResetPasswordStatusCard(), ResetPasswordStatusCardProps, StudentMobileAppCallout() (+30 more)

### Community 8 - "types/index.ts"
Cohesion: 0.06
Nodes (40): ActiveSessionBanner(), ActiveSessionBannerProps, LeaveDocumentModal(), LeaveDocumentModalProps, LeaveReviewDialog(), LeaveReviewDialogProps, ActiveSessionsCard(), ActiveSessionsCardProps (+32 more)

### Community 9 - "lucide-react"
Cohesion: 0.08
Nodes (52): SystemConfig, TeacherClassesPage(), ColumnProps, getSessionLogColumns(), SessionLogItem, AcademicClass, ReviewQueuePage(), ManualAttendanceStats() (+44 more)

### Community 10 - "cn"
Cohesion: 0.06
Nodes (48): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Dialog, DialogClose (+40 more)

### Community 11 - "useAuthStore"
Cohesion: 0.05
Nodes (49): AdminDashboardPage(), DashboardLayout(), BroadcastNotificationModal(), BroadcastNotificationModalProps, INITIAL_FORM, CommandItem, CommandPaletteModal(), CommandPaletteModalProps (+41 more)

### Community 12 - "api/auth.py"
Cohesion: 0.10
Nodes (39): app_services_auth_service, app_services_device_change_service, change_password(), complete_onboarding(), forgot_password(), get_me(), get_public_system_config(), login() (+31 more)

### Community 13 - "verification_ai_review_card.dart"
Cohesion: 0.05
Nodes (39): Animation, AnimationController, AttendanceAnalysisResult, animation, build, hint, icon, label (+31 more)

### Community 14 - "package:flutter_riverpod/flutter_riverpod.dart"
Cohesion: 0.04
Nodes (73): ConsumerWidget, LeaderboardEntry, leaderboardProvider, AnalyticsScreen, _AnalyticsScreenState, build, createState, initState (+65 more)

### Community 15 - "setup.mjs"
Cohesion: 0.07
Nodes (45): ref_node_child_process, ref_node_crypto, ref_node_fs, ref_node_path, ref_node_url, checkVenvPythonVersion(), createPython311Venv(), ensureBackendDirectories() (+37 more)

### Community 16 - "StatelessWidget"
Cohesion: 0.02
Nodes (97): Color, IconData?, build, isSecondaryGhost, onPrimaryPressed, onSecondaryPressed, primaryIcon, primaryLabel (+89 more)

### Community 17 - "seed_and_simulate.py"
Cohesion: 0.08
Nodes (36): argparse, asyncio, BrowserContext, httpx, random, re, rich_console, AdminSetupService (+28 more)

### Community 18 - "datetime"
Cohesion: 0.04
Nodes (51): app_schemas_health, app_schemas_notification, app_schemas_system_config, app_services_gamification_service, app_services_teacher_service, patch, update_system_config(), check_database() (+43 more)

### Community 19 - "main.dart"
Cohesion: 0.09
Nodes (22): @pragma, HttpOverrides, addNotification, AppHttpOverrides, callbackDispatcher, createHttpClient, _firebaseMessagingBackgroundHandler, initialize (+14 more)

### Community 20 - "AdminService"
Cohesion: 0.06
Nodes (13): generate_temporary_password(), hash_password(), ClassResponse, StudentResponse, TeacherResponse, AdminService, test_create_class_and_assign_teacher(), test_create_student_admin() (+5 more)

### Community 21 - "leave_request.dart"
Cohesion: 0.09
Nodes (21): approved, approvedBy, approverNote, createdAt, documentUrl, endDate, enrollmentNumber, fromJson (+13 more)

### Community 22 - "theme.dart"
Cohesion: 0.04
Nodes (45): accentAmber, accentEmerald, accentPink, accentTeal, baseText, bgCanvas, bgPrimary, bgSecondary (+37 more)

### Community 23 - "preferences_service.dart"
Cohesion: 0.04
Nodes (44): getAttendanceTarget, getLowAttendanceThreshold, getNotifyClassStart, getNotifyLowAttendance, getNotifySyncDone, getNotifyWindowOpen, isFirstCameraUse, _keyAttendanceTarget (+36 more)

### Community 24 - "notifications.py"
Cohesion: 0.08
Nodes (38): app_schemas_common, app_services_notification_service, broadcast_notification(), list_notifications(), mark_all_read(), mark_read(), delete, get (+30 more)

### Community 25 - "verification_step_content.dart"
Cohesion: 0.05
Nodes (40): VerificationStep, build, build, isCameraReady, onAnalyze, onCapture, onRetake, onSubmit (+32 more)

### Community 26 - "notification_service.dart"
Cohesion: 0.08
Nodes (23): WebSocketService, addNotification, _api, _box, clear, clearAll, deleteNotification, dispose (+15 more)

### Community 27 - "login_error_banner.dart"
Cohesion: 0.25
Nodes (7): build, email, errorMessage, isFormValid, LoginErrorBanner, password, package:smart_attendance_app/features/auth/widgets/device_change_dialog.dart

### Community 28 - "geofence_verification_provider.dart"
Cohesion: 0.06
Nodes (35): AutoDisposeNotifier, dart:math, describeDistance, GeofenceCalculator, isWithinGeofence, describeDistance, ensurePermissionsGranted, getAveragedPosition (+27 more)

### Community 29 - "String?"
Cohesion: 0.04
Nodes (48): CameraController?, dart:ui, blurScore, brightnessScore, camera, cameraError, disposeCamera, initCamera (+40 more)

### Community 30 - "reset_password_screen.dart"
Cohesion: 0.04
Nodes (65): class, Container, FormState, notificationsProvider, pendingCountProvider, authProvider, resetPasswordProvider, build (+57 more)

### Community 31 - "_handle_generic_err"
Cohesion: 0.17
Nodes (37): assign_teacher(), bulk_create_classes(), bulk_create_classrooms(), bulk_create_departments(), bulk_create_designations(), bulk_create_students(), bulk_create_subjects(), bulk_create_teachers() (+29 more)

### Community 32 - "auth_repository.dart"
Cohesion: 0.12
Nodes (15): HiveService, _hive, refresh, _authApi, authRepositoryProvider, changePassword, _computeAuthStatus, getCachedProfile (+7 more)

### Community 33 - "student_api.dart"
Cohesion: 0.08
Nodes (23): dart:io, analyzeAttendance, confirmAttendance, createLeaveRequest, _dio, getLeaderboard, getMyAttendance, getMyClasses (+15 more)

### Community 34 - "glass_button.dart"
Cohesion: 0.04
Nodes (41): int?, List, NotificationsNotifier, activeStepIndex, build, stepLabels, subtitle, title (+33 more)

### Community 35 - "websocket_service.dart"
Cohesion: 0.05
Nodes (37): DeviceInfoPlugin, authState, _channel, connect, disconnect, dispose, _maxReconnectAttempts, _messageController (+29 more)

### Community 36 - "router.dart"
Cohesion: 0.06
Nodes (32): GoRouter, notifier, notify, rootNavigatorKey, routerNotifierProvider, shellNavigatorKey, NavigatorState, package:smart_attendance_app/app/page_transitions.dart (+24 more)

### Community 37 - "verification_screen.dart"
Cohesion: 0.05
Nodes (52): ConsumerState, hiveServiceProvider, preferencesServiceProvider, attendanceVerificationProvider, geofenceVerificationProvider, ResultScreen, capturePhoto, VerificationCameraMixin (+44 more)

### Community 38 - "smart_pass_provider.dart"
Cohesion: 0.07
Nodes (33): StudentApi, DeviceService, PendingCountNotifier, _api, copyWith, data, errorMessage, fetch (+25 more)

### Community 39 - "package:go_router/go_router.dart"
Cohesion: 0.08
Nodes (25): slideRightPage, slideUpPage, build, child, ShellScaffold, _tabPaths, build, _getGreeting (+17 more)

### Community 40 - "flagged_detail_screen.dart"
Cohesion: 0.08
Nodes (28): attendanceRepositoryProvider, attendanceId, build, createState, dispose, FlaggedDetailScreen, _FlaggedDetailScreenState, initState (+20 more)

### Community 41 - "hive_service.dart"
Cohesion: 0.09
Nodes (21): Box, dart:convert, addToQueue, cacheProfile, cacheSystemConfig, clearAll, _configBox, getCachedProfile (+13 more)

### Community 42 - "attendance.dart"
Cohesion: 0.06
Nodes (33): activeSessionId, attendanceId, backgroundScore, classId, className, createdAt, faceScore, finalAiScore (+25 more)

### Community 43 - "schemas/admin.py"
Cohesion: 0.11
Nodes (25): AbsenteeAnomalyItem, AssignTeacherRequest, AuditLogResponse, ClassBulkCreateRequest, ClassBulkItem, ClassCreate, ClassroomBulkCreateRequest, ClassroomBulkItem (+17 more)

### Community 44 - "admin/classes/page.tsx"
Cohesion: 0.05
Nodes (48): AuditPage(), classColumns, EnrollHeader(), EnrollHeaderProps, EnrollStudentRow(), EnrollStudentRowProps, ClassesPage(), StudentsPage() (+40 more)

### Community 45 - "app.dart"
Cohesion: 0.14
Nodes (18): build, createState, _handleNotificationClick, inferNotificationSeverity, _initializeFcm, kSeverityInfo, _pendingRoute, SmartAttendanceApp (+10 more)

### Community 46 - "constants.dart"
Cohesion: 0.09
Nodes (21): defineUrl, envUrl, kConnectTimeout, kGeofenceGraceMeters, kGpsAveragingSamples, kGpsTimeoutSeconds, kHiveBoxConfig, kHiveBoxNotifications (+13 more)

### Community 47 - "geofence_status_card.dart"
Cohesion: 0.14
Nodes (12): build, _buildChip, GeofenceDistanceMetrics, state, statusColor, build, GeofenceStatusCard, onRetry (+4 more)

### Community 48 - "auth_provider.dart"
Cohesion: 0.06
Nodes (31): computeRouterRedirect, null, dio, _extractDetail, mapDioError, normalizedBaseUrl, storage, AuthStatus (+23 more)

### Community 49 - "session_provider.dart"
Cohesion: 0.04
Nodes (46): Duration?, _adjustPollInterval, _api, classId, className, ClassSession, _currentInterval, dispose (+38 more)

### Community 50 - "api/admin.py"
Cohesion: 0.16
Nodes (21): app_core_rate_limit, export_audit_logs(), get_admin_stats(), get_audit_logs(), get_class_by_id(), get_classes(), get_classroom(), get_classrooms() (+13 more)

### Community 51 - "frontend/package.json"
Cohesion: 0.08
Nodes (25): eslintConfig, name, private, version, axios, clsx, eslint, eslint-config-next (+17 more)

### Community 52 - "attendance_provider.dart"
Cohesion: 0.11
Nodes (19): accuracy, analysisResult, analyze, AttendanceNotifier, AttendanceVerificationState, confirm, copyWith, errorMessage (+11 more)

### Community 53 - "attendance_repository.dart"
Cohesion: 0.10
Nodes (20): analyzeAttendance, AttendanceRepository, AttendanceSubmitResult, confirmAttendance, getHistory, _hive, OfflineQueued, OnlineResult (+12 more)

### Community 54 - "offline_sync_service.dart"
Cohesion: 0.07
Nodes (26): dart:async, AppEvents, _authErrorController, authErrorStream, broadcastAuthError, NotificationService, _className, _connectivitySub (+18 more)

### Community 55 - "result_config.dart"
Cohesion: 0.10
Nodes (19): background, color, error, face, flagged, icon, liveness, offline (+11 more)

### Community 56 - "State"
Cohesion: 0.20
Nodes (14): FlaggedTroubleshootFaq, _FlaggedTroubleshootFaqState, HistoryCalendarTab, _HistoryCalendarTabState, HistoryListTab, _HistoryListTabState, HistorySessionTile, _HistorySessionTileState (+6 more)

### Community 57 - "glass_input.dart"
Cohesion: 0.08
Nodes (24): FocusNode?, build, controller, FlaggedNoteForm, isSubmitting, noteSubmitted, onSubmit, build (+16 more)

### Community 58 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, axios, class-variance-authority, clsx, @hookform/resolvers, leaflet, lucide-react, next (+18 more)

### Community 59 - "BulkImportModal.tsx"
Cohesion: 0.19
Nodes (19): getSampleCsv(), buildBatches(), buildBulkPayload(), BULK_BATCH_SIZE, BatchProgressItem, BulkImportEntityType, BulkImportSummary, ImportStage (+11 more)

### Community 60 - "attendance_utils.dart"
Cohesion: 0.08
Nodes (24): calculateHighestStreak, calculateStreak, canMiss, computeAttendanceNeeds, computeSubjectPct, computeWeekPresent, countAbsent, countFlagged (+16 more)

### Community 61 - "sys"
Cohesion: 0.10
Nodes (24): json, playwright_async_api, adb(), capture(), keyevent(), main(), tap(), text() (+16 more)

### Community 62 - "geofence_radar_indicator.dart"
Cohesion: 0.13
Nodes (14): CustomPainter, GeofenceStatus, build, color, createState, dispose, _iconForStatus, initState (+6 more)

### Community 63 - "glass_card.dart"
Cohesion: 0.06
Nodes (28): EdgeInsetsGeometry, AnimatedBackground, build, child, actions, AppScaffold, body, build (+20 more)

### Community 64 - "notification_api.dart"
Cohesion: 0.05
Nodes (40): Dio, AuthApi, authApiProvider, changePassword, _dio, getProfile, login, logout (+32 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (23): bin, dev, setup, description, name, private, scripts, backend:setup (+15 more)

### Community 66 - "history_list_tab.dart"
Cohesion: 0.09
Nodes (22): data, errorMessage, fetch, HistoryNotifier, HistoryState, isLoading, notifier, _repo (+14 more)

### Community 67 - "test_api_admin.py"
Cohesion: 0.13
Nodes (13): app_schemas_master_data, app_schemas_pagination, AdminStatsResponse, BulkImportResponse, DepartmentResponse, PaginatedResponse, PaginationParams, BaseModel (+5 more)

### Community 68 - "@playwright/test"
Cohesion: 0.12
Nodes (6): ClassInput, StudentInput, TeacherInput, TeacherAnalyticsPage, TeacherHistoryPage, @playwright/test

### Community 69 - "classes/[id]/edit/page.tsx"
Cohesion: 0.07
Nodes (32): SEMESTER_OPTIONS, EnrollStudentFilters(), EnrollStudentFiltersProps, GENDER_OPTIONS, SEMESTER_OPTIONS, StudentFormFields(), StudentFormFieldsProps, EditStudentFormFields() (+24 more)

### Community 70 - "attendance_constants.dart"
Cohesion: 0.09
Nodes (21): kAttendanceTypeLocal, kAttendanceTypePush, kGoodScoreThreshold, kImagePickQuality, kMinBrightnessForPhoto, kMinSharpnessForPhoto, kNoteMaxChars, kOverallGoodPct (+13 more)

### Community 71 - "main.py"
Cohesion: 0.08
Nodes (28): app_api, app_middleware_request_logging, app_services_s3_service, app_services_scheduler, setup_logging(), connect_db(), disconnect_db(), connect_redis() (+20 more)

### Community 72 - "react"
Cohesion: 0.08
Nodes (17): AnomalyCard(), AnomalyCardProps, getRiskLevel(), WEEKDAYS, ScannerControls(), ScannerControlsProps, DashboardKpiItem, DashboardKpiStripProps (+9 more)

### Community 73 - "offline_payload.dart"
Cohesion: 0.11
Nodes (19): @HiveType, HiveObject, hashCode, OfflineAttendancePayloadAdapter, operator, read, typeId, write (+11 more)

### Community 74 - "BasePage"
Cohesion: 0.13
Nodes (3): BasePage, TeacherClassesPage, TeacherLeavesPage

### Community 75 - "leaderboard.dart"
Cohesion: 0.12
Nodes (18): AppException, AuthException, message, NetworkException, ServerException, statusCode, toString, ValidationException (+10 more)

### Community 77 - ".get_leaderboard"
Cohesion: 0.11
Nodes (9): Return the active Redis client if available., Update a student's score in the Redis leaderboard., Fetch the leaderboard from Redis, falling back to DB if empty., Helper to compatibility-wrap recalculate_student_streak., Rebuild the leaderboard cache from DB data., Recalculate student streak based on historical attendance logs and active…, Fetch top 10 students from Redis cache and load details from DB., Fetch rank and points for a specific user from Redis. (+1 more)

### Community 78 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, eslint, eslint-config-next, jsdom, @playwright/test, tailwindcss, @tailwindcss/postcss, @testing-library/dom (+11 more)

### Community 79 - "GeofenceMap.tsx"
Cohesion: 0.13
Nodes (11): Circle, GeofenceMap(), GeofenceMapProps, MapContainer, Marker, TileLayer, LocationSearchBar(), LocationSearchBarProps (+3 more)

### Community 80 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 81 - "app_notification.dart"
Cohesion: 0.05
Nodes (36): Map, body, category, copyWith, fromMap, id, isRead, link (+28 more)

### Community 82 - "secure_storage.dart"
Cohesion: 0.17
Nodes (11): FlutterSecureStorage, clearAll, getDeviceUUID, getRole, getToken, saveDeviceUUID, saveToken, saveUserRole (+3 more)

### Community 83 - "🚀 Key Features"
Cohesion: 0.11
Nodes (18): 1. Multi-Layered AI Verification, 1. Prerequisites, 2. Dynamic Location & Geofencing, 2. One-Command Setup, 3. Hardware Device Binding (Anti-Proxy), 3. Running Development Servers, 4. Offline Smart Pass (Encrypted Fallback), 5. Automated Outlier Scanning & Absentee Analytics (+10 more)

### Community 84 - "master_data.py"
Cohesion: 0.20
Nodes (11): ClassroomCreate, ClassroomResponse, ClassroomUpdate, DesignationCreate, DesignationResponse, DesignationUpdate, BaseModel, field_validator (+3 more)

### Community 85 - "smart_pass.dart"
Cohesion: 0.11
Nodes (17): Duration get, attendanceStatus, className, enrollmentNumber, expiresAt, fromJson, isExpired, markedAt (+9 more)

### Community 86 - "user.dart"
Cohesion: 0.11
Nodes (17): accessToken, email, enrollmentNumber, faceRegistered, firstName, fromJson, hasFaceRegistered, id (+9 more)

### Community 87 - "LeaveRepository"
Cohesion: 0.33
Nodes (3): LeaveRepository, LeaveService, LeaveRequest

### Community 88 - "leave_requests_screen.dart"
Cohesion: 0.06
Nodes (35): ConsumerStatefulWidget, File?, notificationsLoadingProvider, build, createState, dispose, _endDate, _isSubmitting (+27 more)

### Community 89 - "reset_password_provider.dart"
Cohesion: 0.12
Nodes (16): AuthRepository, copyWith, email, errorMessage, isSubmitting, isSuccess, isValid, isVerifying (+8 more)

### Community 90 - "ClassRepository"
Cohesion: 0.27
Nodes (4): AcademicClass, ClassRepository, GeofenceRepository, Geofence

### Community 91 - "smart_pass_screen.dart"
Cohesion: 0.16
Nodes (15): smartPassProvider, build, _buildErrorBanner, _buildManualInputSection, _buildScannerViewfinder, _buildSuccessCard, createState, dispose (+7 more)

### Community 92 - "conftest.py"
Cohesion: 0.19
Nodes (13): AwaitableMock, mock_academic_class(), mock_admin_user(), mock_redis(), mock_student_profile(), mock_student_user(), mock_teacher_profile(), mock_teacher_user() (+5 more)

### Community 93 - "form.tsx"
Cohesion: 0.18
Nodes (13): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+5 more)

### Community 94 - "test-fixtures.ts"
Cohesion: 0.45
Nodes (4): frontend_e2e_fixtures_test_fixtures_expect, generateYopmail(), test, TEST_CREDENTIALS

### Community 95 - "build"
Cohesion: 0.40
Nodes (5): build, Route /settings/goals, Route /settings/help, Route /settings/notifications, Route /settings/sync

### Community 96 - "os"
Cohesion: 0.08
Nodes (21): _load_liveness_model(), Any, Service Health & Connectivity Checker Checks AWS S3 and PostgreSQL RDS…, boto3, botocore_exceptions, cv2, deepface, dotenv (+13 more)

### Community 97 - "device_change_dialog.dart"
Cohesion: 0.18
Nodes (13): dioProvider, deviceServiceProvider, build, createState, DeviceChangeDialog, _DeviceChangeDialogState, dispose, email (+5 more)

### Community 98 - "SessionRepository"
Cohesion: 0.29
Nodes (3): datetime, SessionRepository, Session

### Community 99 - "run_absentee_scan"
Cohesion: 0.31
Nodes (9): app_services_absentee_scanner, scan_absentee_anomalies(), _detect_pattern(), Any, run_absentee_scan(), _run_isolation_forest(), asyncio, test_run_absentee_scan_detects_outliers() (+1 more)

### Community 100 - "AIOrchestrator"
Cohesion: 0.29
Nodes (3): AIOrchestrator, _load_and_crop(), ndarray

### Community 101 - "dropdown-menu.tsx"
Cohesion: 0.15
Nodes (12): DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuSeparator, DropdownMenuSub (+4 more)

### Community 102 - "pulsing_dot.dart"
Cohesion: 0.22
Nodes (9): build, color, _controller, createState, dispose, initState, PulsingDot, _PulsingDotState (+1 more)

### Community 104 - "extensions.dart"
Cohesion: 0.22
Nodes (8): DateTimeFormatting, formattedDate, formattedDateTime, isSameDay, shortDate, StringFormatting, truncate, String? get

### Community 105 - "verification_preview_frame.dart"
Cohesion: 0.18
Nodes (10): bool get, double?, blurScore, brightnessScore, build, imagePath, isAnalyzingQuality, isPoorQuality (+2 more)

### Community 106 - "student_stats.dart"
Cohesion: 0.18
Nodes (10): absentCount, attendancePercentage, currentStreak, excusedCount, flaggedCount, fromJson, highestStreak, presentCount (+2 more)

### Community 107 - "flagged_troubleshoot_faq.dart"
Cohesion: 0.25
Nodes (7): build, createState, desc, _expanded, icon, _TipItem, title

### Community 108 - "manifest.json"
Cohesion: 0.18
Nodes (10): background_color, description, display, icons, name, orientation, prefer_related_applications, short_name (+2 more)

### Community 109 - "email_service.py"
Cohesion: 0.16
Nodes (11): aiosmtplib, app_core_config, app_core_url_resolver, Request, Dynamically resolves the frontend base URL for email links, redirects, and…, resolve_frontend_url(), EmailService, Any (+3 more)

### Community 111 - "PageObjects"
Cohesion: 0.20
Nodes (3): PageObjects, TeacherDeviceChangesPage, TeacherProfilePage

### Community 112 - "offlineSyncServiceProvider"
Cohesion: 0.33
Nodes (6): dispose, initState, offlineSyncServiceProvider, configRepositoryProvider, initState, _triggerSync

### Community 113 - "button.tsx"
Cohesion: 0.24
Nodes (8): Badge(), BadgeProps, badgeVariants, Button, ButtonProps, buttonVariants, class-variance-authority, @radix-ui/react-slot

### Community 117 - "AttendanceTrendChart.tsx"
Cohesion: 0.22
Nodes (5): monthlyData, MonthlyDataPoint, breakdownData, BreakdownItem, recharts

### Community 118 - "Any"
Cohesion: 0.22
Nodes (5): Any, Creates classroom and laboratory venues., Creates institutional departments., Creates academic designations., Creates academic subjects (Theory & Practical).

### Community 120 - "SystemConfigRepository"
Cohesion: 0.16
Nodes (8): Gets the system configuration. If it doesn't exist, creates a default one., SystemConfigRepository, fromJson, isAiBackgroundValidationEnabled, isFaceRecognitionEnabled, isGpsVerificationEnabled, SystemConfiguration, toJson

### Community 121 - "_GeofenceRadarIndicatorState"
Cohesion: 0.40
Nodes (5): GeofenceRadarIndicator, _GeofenceRadarIndicatorState, VerificationAiReviewCard, _VerificationAiReviewCardState, SingleTickerProviderStateMixin

### Community 124 - "SessionSimulationService"
Cohesion: 0.29
Nodes (6): Any, AsyncClient, Acquires auth tokens for faculty members to drive session endpoints., Categorizes students into Exemplary (~60%), Irregular (~25%), and Defaulter…, Runs the multi-day attendance simulation across classes., SessionSimulationService

### Community 125 - "Agent Guidelines & Engineering Standards"
Cohesion: 0.29
Nodes (6): 1. Environment & Configuration Sync, 2. No Hardcoding, 3. No Patches on Patches (Clean Code First), 4. File Structure & Quality Rules, 5. Version Control & Automated Delivery, Agent Guidelines & Engineering Standards

### Community 126 - "test_service_admin.py"
Cohesion: 0.14
Nodes (10): app_schemas_admin, app_services_admin_service, field_validator, StudentCreate, field_validator, TeacherCreate, asyncio, test_admin_service_create_student() (+2 more)

### Community 127 - "global_exception_handler"
Cohesion: 0.38
Nodes (7): global_exception_handler(), Exception, Request, validation_exception_handler(), exception_handler, JSONResponse, RequestValidationError

### Community 134 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, start, test, test:watch

### Community 136 - "vitest"
Cohesion: 0.20
Nodes (6): frontend_node_modules_playwright_test_index, ref_fs, ref_path, @testing-library/jest-dom, @vitejs/plugin-react, vitest

### Community 138 - ".generate_student_specs"
Cohesion: 0.33
Nodes (4): Any, Builds student specification objects with PRNs and @yopmail.com emails., Creates cohorts for Division A and Division B in CSE., Enrolls students into appropriate theory sections and practical lab batches.

### Community 139 - "Settings"
Cohesion: 0.33
Nodes (3): field_validator, Settings, BaseSettings

### Community 141 - "LogEvent"
Cohesion: 0.32
Nodes (5): ingest_log(), post, LogEvent, BaseModel, field_validator

### Community 151 - "adb_login_and_capture.py"
Cohesion: 0.80
Nodes (5): adb(), key(), main(), tap(), type_text()

### Community 154 - "summary_reporter.py"
Cohesion: 0.40
Nodes (4): rich, rich_panel, rich_table, Summary Reporting & Terminal Dashboard Module. Renders final summary tables and…

### Community 155 - ".simulate_device_changes"
Cohesion: 0.40
Nodes (3): Any, Simulates student device changes and teacher resolution., Simulates student leave submissions and teacher review queue processing.

### Community 156 - ".onboard_teachers"
Cohesion: 0.40
Nodes (3): Any, Provisions faculty accounts with @yopmail.com emails and verifies them., Creates academic classes and links teachers and rooms.

### Community 159 - "middleware.ts"
Cohesion: 0.67
Nodes (3): config, middleware(), parseAuthCookie()

### Community 160 - "logger.ts"
Cohesion: 0.50
Nodes (3): logger, LogLevel, PREFIX

### Community 161 - "location_exceptions.dart"
Cohesion: 0.50
Nodes (3): LocationException, message, toString

## Knowledge Gaps
- **1436 isolated node(s):** `ClassInput`, `StudentInput`, `TeacherInput`, `eslintConfig`, `nextConfig` (+1431 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2003 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **46 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminService` connect `AdminService` to `typing`, `schemas/admin.py`, `api/auth.py`, `api/admin.py`, `ClassRepository`, `test_service_admin.py`, `_handle_generic_err`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `getApiErrorMessage`, `next`, `classes/[id]/edit/page.tsx`, `dropdown-menu.tsx`, `reset-password/page.tsx`, `types/index.ts`, `lucide-react`, `cn`, `useAuthStore`, `admin/classes/page.tsx`, `GeofenceMap.tsx`, `button.tsx`, `frontend/package.json`, `AttendanceTrendChart.tsx`, `BulkImportModal.tsx`, `form.tsx`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `@playwright/test` connect `@playwright/test` to `AdminClassroomsPage`, `AdminDepartmentsPage`, `AdminDesignationsPage`, `AdminSubjectsPage`, `LoginPage`, `AdminAuditPage`, `AdminOverviewPage`, `AdminScannerPage`, `BulkImportComponent`, `ForgotPasswordPage`, `ResetPasswordPage`, `TeacherOverviewPage`, `TeacherReviewPage`, `frontend/package.json`, `BasePage`, `test-fixtures.ts`, `PageObjects`, `AdminVerificationSettingsPage`, `TeacherSessionsPage`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Are the 59 inferred relationships involving `AdminService` (e.g. with `assign_teacher()` and `bulk_create_classes()`) actually correct?**
  _`AdminService` has 59 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ClassInput`, `StudentInput`, `TeacherInput` to the rest of the system?**
  _1436 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `api/teacher.py` be split into smaller, more focused modules?**
  _Cohesion score 0.05958499904816295 - nodes in this community are weakly interconnected._
- **Should `getApiErrorMessage` be split into smaller, more focused modules?**
  _Cohesion score 0.03292383292383293 - nodes in this community are weakly interconnected._