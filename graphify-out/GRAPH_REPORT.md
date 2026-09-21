# Graph Report - Smart Attandance System  (2026-09-21)

## Corpus Check
- 502 files · ~658,585 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 30 file(s) not represented in the graph (top: (none) 8, .xml 7, .example 5)

## Summary
- 4214 nodes · 9507 edges · 185 communities (137 shown, 48 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 335 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7b6dc3cc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- api/teacher.py
- getApiErrorMessage
- api.ts
- package:smart_attendance_app/shared/widgets/animated_background.dart
- package:flutter/material.dart
- attendance_service.py
- api/student.py
- GlassInput.tsx
- lucide-react
- classes/[id]/edit/page.tsx
- react
- useAuthStore
- api/auth.py
- verification_ai_review_card.dart
- history_screen.dart
- setup.mjs
- package:flutter_riverpod/flutter_riverpod.dart
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
- app_scaffold.dart
- geofence_verification_provider.dart
- flagged_detail_screen.dart
- reset_password_screen.dart
- _handle_generic_err
- auth_repository.dart
- student_api.dart
- class_session_card.dart
- websocket_service.dart
- router.dart
- verification_screen.dart
- StudentRepository
- notification_tile.dart
- analytics/page.tsx
- verification_camera_mixin.dart
- attendance.dart
- schemas/admin.py
- audit/page.tsx
- app.dart
- Color
- geofence_radar_indicator.dart
- auth_provider.dart
- session_provider.dart
- api/admin.py
- frontend/package.json
- extensions.dart
- attendance_repository.dart
- home_screen.dart
- result_config.dart
- notifications_screen.dart
- glass_input.dart
- dependencies
- BulkImportModal.tsx
- attendance_utils.dart
- os
- smart_pass_provider.dart
- package:smart_attendance_app/app/theme.dart
- notification_api.dart
- scripts
- attendance_provider.dart
- test_api_admin.py
- @playwright/test
- ConsumerState
- attendance_constants.dart
- typing
- models.ts
- offline_payload.dart
- BasePage
- leaderboard.dart
- AttendanceRepository
- GamificationService
- devDependencies
- GeofenceMap.tsx
- compilerOptions
- profile_settings_list.dart
- test_api_auth.py
- 🚀 Key Features
- master_data.py
- smart_pass.dart
- user.dart
- global_exception_handler
- leave_requests_screen.dart
- build
- SessionService
- smart_pass_screen.dart
- conftest.py
- form.tsx
- test-fixtures.ts
- ai_orchestrator.py
- adb_mobile_screen_tester.py
- device_change_dialog.dart
- YopmailClient
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
- permission_service.dart
- TestRunner
- get_redis
- verification_preview_frame.dart
- TeacherSessionsPage
- E2ETestRunner
- SessionSimulationService
- Agent Guidelines & Engineering Standards
- AuthService
- StudentEnrollmentService
- AdminStudentsPage
- AdminClassroomsPage
- AdminDepartmentsPage
- AdminDesignationsPage
- AdminSubjectsPage
- LoginPage
- scripts
- StatelessWidget
- MessageResponse
- ref_playwright
- summary_reporter.py
- Settings
- leaderboard_item_card.dart
- LogEvent
- app_notification.dart
- AdminAuditPage
- AdminOverviewPage
- AdminScannerPage
- BulkImportComponent
- ForgotPasswordPage
- ResetPasswordPage
- TeacherOverviewPage
- history_calendar_tab.dart
- .simulate_device_changes
- next.config.ts
- TeacherReviewPage
- LeaveDocumentModal.tsx
- streak_counter.dart
- WebSocketClient
- MobileE2ERunner
- middleware.ts
- logger.ts
- location_exceptions.dart
- app/layout.tsx
- FlutterActivity
- frontend/README.md
- check_services.py
- smart_attendance_app
- adb_login_and_capture.py
- rules/graphify.md
- workflows/graphify.md
- backend/README.md
- DeepInteractiveRunner
- postcss.config.mjs
- ReviewQueuePage
- seed/__init__.py
- AttendanceRepository
- DateTime?
- Exception
- LeaderboardResponse?
- T

## God Nodes (most connected - your core abstractions)
1. `react` - 152 edges
2. `getApiErrorMessage()` - 146 edges
3. `lucide-react` - 109 edges
4. `AdminService` - 108 edges
5. `cn()` - 93 edges
6. `next` - 65 edges
7. `api` - 65 edges
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

## Communities (185 total, 48 thin omitted)

### Community 0 - "api/teacher.py"
Cohesion: 0.08
Nodes (65): app_services_leave_service, approve_device_change(), approve_leave(), bulk_mark_attendance(), export_class_attendance(), get_absent_students(), get_attendance_by_id(), get_class_attendance_matrix() (+57 more)

### Community 1 - "getApiErrorMessage"
Cohesion: 0.03
Nodes (89): ForgotPasswordPage(), handleResend(), onSubmit(), LoginPage(), handleSuccessRedirect(), onSubmit(), OnboardingContent(), checkToken() (+81 more)

### Community 2 - "api.ts"
Cohesion: 0.10
Nodes (57): SystemConfig, colorVariants, colorVariants, AcademicClass, ManualAttendanceStats(), ManualAttendanceStatsProps, AttendanceStatus, BulkImportModal() (+49 more)

### Community 3 - "package:smart_attendance_app/shared/widgets/animated_background.dart"
Cohesion: 0.08
Nodes (32): ConsumerWidget, leaderboardProvider, build, _buildBody, _buildUserSummaryCard, LeaderboardScreen, AnalyticsLeaderboardTile, build (+24 more)

### Community 4 - "package:flutter/material.dart"
Cohesion: 0.04
Nodes (69): AttendanceHistoryItem, AttendanceHistoryResponse, AnalyticsKpiOverview, build, data, target, AnalyticsSubjectGoals, build (+61 more)

### Community 5 - "attendance_service.py"
Cohesion: 0.09
Nodes (39): app_api_ws, app_repositories_class_repo, app_repositories_geofence_repo, app_services_ai_orchestrator, app_utils_geofencing, create_access_token(), decode_access_token(), Any (+31 more)

### Community 6 - "api/student.py"
Cohesion: 0.06
Nodes (60): app_schemas_attendance, app_schemas_leave, app_services_attendance_service, app_services_student_service, analyze_attendance(), confirm_attendance(), create_leave_request(), get_leaderboard() (+52 more)

### Community 7 - "GlassInput.tsx"
Cohesion: 0.05
Nodes (50): VerifyData, GENDER_OPTIONS, SEMESTER_OPTIONS, StudentFormFields(), StudentFormFieldsProps, EditStudentFormFields(), EditStudentFormFieldsProps, GENDER_OPTIONS (+42 more)

### Community 8 - "lucide-react"
Cohesion: 0.05
Nodes (50): AdminDashboardPage(), TeacherClassesPage(), ActiveSessionBanner(), ActiveSessionBannerProps, ActiveSessionsCard(), ActiveSessionsCardProps, SessionRosterPage(), getRosterColumns() (+42 more)

### Community 9 - "classes/[id]/edit/page.tsx"
Cohesion: 0.06
Nodes (39): classColumns, SEMESTER_OPTIONS, EnrollHeader(), EnrollHeaderProps, EnrollStudentFilters(), EnrollStudentFiltersProps, EnrollStudentRowProps, ClassesPage() (+31 more)

### Community 10 - "react"
Cohesion: 0.04
Nodes (67): EnrollStudentRow(), ScannerControlsProps, AcademicClass, HistoryFilters(), HistoryFiltersProps, ManualAttendanceStudentRow(), ManualAttendanceStudentRowProps, Button (+59 more)

### Community 11 - "useAuthStore"
Cohesion: 0.05
Nodes (50): frontend_node_modules_playwright_test_index, DashboardLayout(), BroadcastNotificationModal(), BroadcastNotificationModalProps, INITIAL_FORM, CommandPaletteModal(), Header(), HeaderProps (+42 more)

### Community 12 - "api/auth.py"
Cohesion: 0.14
Nodes (24): app_services_auth_service, app_services_device_change_service, app_services_system_config_service, change_password(), get_me(), get_public_system_config(), get, User (+16 more)

### Community 13 - "verification_ai_review_card.dart"
Cohesion: 0.04
Nodes (58): Animation, AnimationController, AttendanceAnalysisResult, build, createState, desc, _expanded, FlaggedTroubleshootFaq (+50 more)

### Community 14 - "history_screen.dart"
Cohesion: 0.10
Nodes (24): AnalyticsScreen, _AnalyticsScreenState, build, createState, initState, historyProvider, build, _buildTabBtn (+16 more)

### Community 15 - "setup.mjs"
Cohesion: 0.07
Nodes (45): ref_node_child_process, ref_node_crypto, ref_node_fs, ref_node_path, ref_node_url, checkVenvPythonVersion(), createPython311Venv(), ensureBackendDirectories() (+37 more)

### Community 16 - "package:flutter_riverpod/flutter_riverpod.dart"
Cohesion: 0.07
Nodes (30): Box, dart:convert, Dio, addToQueue, cacheProfile, cacheSystemConfig, clearAll, _configBox (+22 more)

### Community 17 - "seed_and_simulate.py"
Cohesion: 0.12
Nodes (25): argparse, httpx, random, re, rich_console, Admin Master Data Setup Automation. Configures institutional master data: -…, main(), Automated Data-Seeding and Realistic User-Simulation Pipeline. Usage: python… (+17 more)

### Community 18 - "datetime"
Cohesion: 0.06
Nodes (44): app_api_dependencies, app_schemas_health, app_schemas_notification, app_services_gamification_service, app_services_teacher_service, check_database(), check_redis(), check_s3() (+36 more)

### Community 19 - "main.dart"
Cohesion: 0.08
Nodes (24): @pragma, dart:async, HttpOverrides, AppEvents, _authErrorController, authErrorStream, broadcastAuthError, addNotification (+16 more)

### Community 20 - "AdminService"
Cohesion: 0.08
Nodes (6): ClassResponse, AdminService, Classroom, Department, Designation, Subject

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
Nodes (36): VerificationStep, isCameraReady, onAnalyze, onCapture, onRetake, onSubmit, showTips, step (+28 more)

### Community 26 - "notification_service.dart"
Cohesion: 0.08
Nodes (23): WebSocketService, addNotification, _api, _box, clear, clearAll, deleteNotification, dispose (+15 more)

### Community 27 - "app_scaffold.dart"
Cohesion: 0.10
Nodes (17): build, child, ShellScaffold, _tabPaths, AnimatedBackground, build, child, actions (+9 more)

### Community 28 - "geofence_verification_provider.dart"
Cohesion: 0.05
Nodes (46): AutoDisposeNotifier, dart:math, FlutterSecureStorage, describeDistance, GeofenceCalculator, isWithinGeofence, describeDistance, ensurePermissionsGranted (+38 more)

### Community 29 - "flagged_detail_screen.dart"
Cohesion: 0.06
Nodes (29): attendanceId, build, createState, dispose, initState, _isLoading, _isSubmitting, item (+21 more)

### Community 30 - "reset_password_screen.dart"
Cohesion: 0.05
Nodes (50): FormState, authProvider, resetPasswordProvider, build, _confirmPasswordController, createState, dispose, ForceChangePasswordScreen (+42 more)

### Community 31 - "_handle_generic_err"
Cohesion: 0.17
Nodes (37): assign_teacher(), bulk_create_classes(), bulk_create_classrooms(), bulk_create_departments(), bulk_create_designations(), bulk_create_students(), bulk_create_subjects(), bulk_create_teachers() (+29 more)

### Community 32 - "auth_repository.dart"
Cohesion: 0.05
Nodes (43): dart:io, DeviceInfoPlugin, AuthApi, authApiProvider, changePassword, _dio, getProfile, login (+35 more)

### Community 33 - "student_api.dart"
Cohesion: 0.07
Nodes (26): analyzeAttendance, confirmAttendance, createLeaveRequest, _dio, getLeaderboard, getMyAttendance, getMyClasses, getMyLeaves (+18 more)

### Community 34 - "class_session_card.dart"
Cohesion: 0.04
Nodes (45): Duration?, defineUrl, envUrl, kConnectTimeout, kGeofenceGraceMeters, kGpsAveragingSamples, kGpsTimeoutSeconds, kHiveBoxConfig (+37 more)

### Community 35 - "websocket_service.dart"
Cohesion: 0.06
Nodes (34): computeRouterRedirect, null, authState, _channel, connect, disconnect, dispose, _maxReconnectAttempts (+26 more)

### Community 36 - "router.dart"
Cohesion: 0.06
Nodes (34): ChangeNotifier, GoRouter, notifier, notify, rootNavigatorKey, RouterNotifier, routerNotifierProvider, shellNavigatorKey (+26 more)

### Community 37 - "verification_screen.dart"
Cohesion: 0.11
Nodes (22): hiveServiceProvider, attendanceVerificationProvider, geofenceVerificationProvider, capturePhoto, _aiStepIndex, _aiSteps, _aiStepTimer, _analyzePhoto (+14 more)

### Community 38 - "StudentRepository"
Cohesion: 0.07
Nodes (21): app_repositories_teacher_repo, _check_token_revoked(), get_current_student(), get_current_teacher(), get_current_user(), get_current_user_from_token(), Student, Teacher (+13 more)

### Community 39 - "notification_tile.dart"
Cohesion: 0.11
Nodes (17): Map, LocalNotification, build, CalendarMonthGrid, focusedMonth, grouped, onSelectDate, selectedDate (+9 more)

### Community 40 - "analytics/page.tsx"
Cohesion: 0.05
Nodes (43): AnomalyCard(), AnomalyCardProps, getRiskLevel(), WEEKDAYS, ScannerControls(), ActiveTab, AnalyticsOverviewTab(), AnalyticsOverviewTabProps (+35 more)

### Community 41 - "verification_camera_mixin.dart"
Cohesion: 0.11
Nodes (16): blurScore, brightnessScore, camera, cameraError, disposeCamera, initCamera, isAnalyzingQuality, isCameraReady (+8 more)

### Community 42 - "attendance.dart"
Cohesion: 0.06
Nodes (33): activeSessionId, attendanceId, backgroundScore, classId, className, createdAt, faceScore, finalAiScore (+25 more)

### Community 43 - "schemas/admin.py"
Cohesion: 0.11
Nodes (25): AbsenteeAnomalyItem, AssignTeacherRequest, AuditLogResponse, ClassBulkCreateRequest, ClassBulkItem, ClassCreate, ClassroomBulkCreateRequest, ClassroomBulkItem (+17 more)

### Community 44 - "audit/page.tsx"
Cohesion: 0.14
Nodes (19): AuditPage(), ActivityDetailModal(), ActivityDetailModalProps, ActivityCategory, ActivityFilterBar(), ActivityFilterBarProps, CATEGORIES, ActivityLogTable() (+11 more)

### Community 45 - "app.dart"
Cohesion: 0.11
Nodes (24): build, createState, dispose, _handleNotificationClick, inferNotificationSeverity, _initializeFcm, initState, kSeverityInfo (+16 more)

### Community 46 - "Color"
Cohesion: 0.04
Nodes (44): Color, dart:ui, IconData?, animation, build, hint, icon, label (+36 more)

### Community 47 - "geofence_radar_indicator.dart"
Cohesion: 0.13
Nodes (14): CustomPainter, GeofenceStatus, build, color, createState, dispose, _iconForStatus, initState (+6 more)

### Community 48 - "auth_provider.dart"
Cohesion: 0.06
Nodes (35): AuthRepository, AuthStatus, _authErrorSubscription, AuthNotifier, AuthStateData, changePassword, checkInitialAuth, copyWith (+27 more)

### Community 49 - "session_provider.dart"
Cohesion: 0.07
Nodes (29): _adjustPollInterval, _api, classId, className, _currentInterval, dispose, errorMessage, fetchSessions (+21 more)

### Community 50 - "api/admin.py"
Cohesion: 0.14
Nodes (23): app_core_rate_limit, export_audit_logs(), get_admin_stats(), get_audit_logs(), get_class_by_id(), get_classes(), get_classroom(), get_classrooms() (+15 more)

### Community 51 - "frontend/package.json"
Cohesion: 0.07
Nodes (25): eslintConfig, name, private, version, axios, clsx, eslint, eslint-config-next (+17 more)

### Community 52 - "extensions.dart"
Cohesion: 0.22
Nodes (8): DateTimeFormatting, formattedDate, formattedDateTime, isSameDay, shortDate, StringFormatting, truncate, String? get

### Community 53 - "attendance_repository.dart"
Cohesion: 0.10
Nodes (20): analyzeAttendance, AttendanceRepository, AttendanceSubmitResult, confirmAttendance, getHistory, _hive, OfflineQueued, OnlineResult (+12 more)

### Community 54 - "home_screen.dart"
Cohesion: 0.14
Nodes (17): sessionProvider, build, createState, didChangeAppLifecycleState, dispose, HomeScreen, _HomeScreenState, initState (+9 more)

### Community 55 - "result_config.dart"
Cohesion: 0.10
Nodes (19): background, color, error, face, flagged, icon, liveness, offline (+11 more)

### Community 56 - "notifications_screen.dart"
Cohesion: 0.09
Nodes (26): notificationsLoadingProvider, notificationsProvider, pendingCountProvider, build, _getGreeting, _getInitials, pendingCount, user (+18 more)

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

### Community 61 - "os"
Cohesion: 0.20
Nodes (18): asyncio, json, os, playwright_async_api, capture_screenshot(), run_cmd(), test_emulator_e2e(), capture_screenshot() (+10 more)

### Community 62 - "smart_pass_provider.dart"
Cohesion: 0.09
Nodes (23): build, _buildEmpty, _buildError, _buildList, leaveHistoryProvider, LeaveHistoryScreen, listResponse, response (+15 more)

### Community 63 - "package:smart_attendance_app/app/theme.dart"
Cohesion: 0.05
Nodes (32): slideRightPage, slideUpPage, build, _buildChip, GeofenceDistanceMetrics, state, statusColor, build (+24 more)

### Community 64 - "notification_api.dart"
Cohesion: 0.08
Nodes (23): category, createdAt, deleteNotification, _dio, fromJson, getNotifications, id, isRead (+15 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (23): bin, dev, setup, description, name, private, scripts, backend:setup (+15 more)

### Community 66 - "attendance_provider.dart"
Cohesion: 0.05
Nodes (42): PendingCountNotifier, accuracy, analysisResult, analyze, AttendanceNotifier, AttendanceVerificationState, confirm, copyWith (+34 more)

### Community 67 - "test_api_admin.py"
Cohesion: 0.12
Nodes (14): app_schemas_master_data, app_schemas_pagination, AdminStatsResponse, BulkImportResponse, DepartmentResponse, PaginatedResponse, PaginationParams, BaseModel (+6 more)

### Community 68 - "@playwright/test"
Cohesion: 0.12
Nodes (6): ClassInput, StudentInput, TeacherInput, TeacherAnalyticsPage, TeacherHistoryPage, @playwright/test

### Community 69 - "ConsumerState"
Cohesion: 0.17
Nodes (15): ConsumerState, ConsumerStatefulWidget, preferencesServiceProvider, attendanceRepositoryProvider, FlaggedDetailScreen, _FlaggedDetailScreenState, _loadItem, VerificationCameraMixin (+7 more)

### Community 70 - "attendance_constants.dart"
Cohesion: 0.09
Nodes (21): kAttendanceTypeLocal, kAttendanceTypePush, kGoodScoreThreshold, kImagePickQuality, kMinBrightnessForPhoto, kMinSharpnessForPhoto, kNoteMaxChars, kOverallGoodPct (+13 more)

### Community 71 - "typing"
Cohesion: 0.05
Nodes (52): app_api, app_core_config, app_core_logging_config, app_core_security, app_db_client, app_db_redis, app_middleware_request_logging, app_repositories_student_repo (+44 more)

### Community 72 - "models.ts"
Cohesion: 0.19
Nodes (11): DeviceChangesPage(), DeviceChangeTable(), DeviceChangeTableProps, ClassCreate, ClassroomCreate, DepartmentCreate, DesignationCreate, DeviceChangeRequest (+3 more)

### Community 73 - "offline_payload.dart"
Cohesion: 0.10
Nodes (20): @HiveType, class, HiveObject, hashCode, OfflineAttendancePayloadAdapter, operator, read, typeId (+12 more)

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

### Community 81 - "profile_settings_list.dart"
Cohesion: 0.07
Nodes (26): build, categories, LeaveCategorySelector, onSelected, selectedCategory, build, icon, iconColor (+18 more)

### Community 82 - "test_api_auth.py"
Cohesion: 0.12
Nodes (9): app_schemas_system_config, Token, BaseModel, SystemConfigResponse, SystemConfigUpdate, test_get_public_system_config(), test_login_success(), test_login_with_student_enrollment_id() (+1 more)

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

### Community 87 - "global_exception_handler"
Cohesion: 0.38
Nodes (7): global_exception_handler(), Exception, Request, validation_exception_handler(), exception_handler, JSONResponse, RequestValidationError

### Community 88 - "leave_requests_screen.dart"
Cohesion: 0.09
Nodes (22): File?, build, createState, dispose, _endDate, _isSubmitting, _notesController, _pickDate (+14 more)

### Community 89 - "build"
Cohesion: 0.50
Nodes (4): build, build, Route /history, Route /home

### Community 90 - "SessionService"
Cohesion: 0.09
Nodes (14): AcademicClass, ClassRepository, GeofenceRepository, datetime, SessionRepository, SessionResponse, SessionStart, notify_teacher_session_concluded() (+6 more)

### Community 91 - "smart_pass_screen.dart"
Cohesion: 0.09
Nodes (26): permissionServiceProvider, smartPassProvider, build, _buildErrorBanner, _buildLiveScanner, _buildPermissionCard, _buildSuccessCard, _checkingPermission (+18 more)

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
Cohesion: 0.14
Nodes (11): _load_liveness_model(), Any, cv2, deepface, huggingface_hub, numpy, shutil, tensorflow (+3 more)

### Community 96 - "adb_mobile_screen_tester.py"
Cohesion: 0.71
Nodes (6): adb(), capture(), keyevent(), main(), tap(), text()

### Community 97 - "device_change_dialog.dart"
Cohesion: 0.16
Nodes (14): dioProvider, deviceServiceProvider, build, createState, DeviceChangeDialog, _DeviceChangeDialogState, dispose, email (+6 more)

### Community 98 - "YopmailClient"
Cohesion: 0.14
Nodes (10): BrowserContext, Page, Any, AsyncClient, Provisions faculty accounts with @yopmail.com emails and verifies them., Creates academic classes and links teachers and rooms., TeacherOnboardingService, Automates Yopmail web UI to extract the onboarding/reset token. (+2 more)

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
Cohesion: 0.06
Nodes (32): List, NotificationService, NotificationsNotifier, _className, _connectivitySub, _deleteImageFile, _dio, dispose (+24 more)

### Community 105 - "AdminSetupService"
Cohesion: 0.18
Nodes (8): AdminSetupService, Any, AsyncClient, Creates classroom and laboratory venues., Logs into admin account and acquires JWT access token., Creates institutional departments., Creates academic designations., Creates academic subjects (Theory & Practical).

### Community 106 - "student_stats.dart"
Cohesion: 0.18
Nodes (10): absentCount, attendancePercentage, currentStreak, excusedCount, flaggedCount, fromJson, highestStreak, presentCount (+2 more)

### Community 107 - "String?"
Cohesion: 0.04
Nodes (52): CameraController?, build, isSecondaryGhost, onPrimaryPressed, onSecondaryPressed, primaryIcon, primaryLabel, secondaryIcon (+44 more)

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
Cohesion: 0.04
Nodes (45): EdgeInsetsGeometry, build, HomeWarningBanner, onTap, percentage, AtRiskBanner, attendancePercentage, build (+37 more)

### Community 113 - "badge.tsx"
Cohesion: 0.50
Nodes (4): Badge(), BadgeProps, badgeVariants, class-variance-authority

### Community 117 - "AttendanceTrendChart.tsx"
Cohesion: 0.22
Nodes (5): monthlyData, MonthlyDataPoint, breakdownData, BreakdownItem, recharts

### Community 118 - "permission_service.dart"
Cohesion: 0.15
Nodes (12): LocationPermission, checkAttendancePermissions, hasLocationAccess, isLocationServiceEnabled, isPermanentlyDenied, locationPermission, message, openAppSettings (+4 more)

### Community 120 - "get_redis"
Cohesion: 0.12
Nodes (14): app_repositories_system_config_repo, rate_limiter(), dependency(), Sliding window rate limiter using Redis sorted sets. Keyed by IP address and…, get_redis(), Gets the system configuration. If it doesn't exist, creates a default one., SystemConfigRepository, SystemConfigService (+6 more)

### Community 121 - "verification_preview_frame.dart"
Cohesion: 0.18
Nodes (10): bool get, double?, blurScore, brightnessScore, build, imagePath, isAnalyzingQuality, isPoorQuality (+2 more)

### Community 124 - "SessionSimulationService"
Cohesion: 0.29
Nodes (6): Any, AsyncClient, Acquires auth tokens for faculty members to drive session endpoints., Categorizes students into Exemplary (~60%), Irregular (~25%), and Defaulter…, Runs the multi-day attendance simulation across classes., SessionSimulationService

### Community 125 - "Agent Guidelines & Engineering Standards"
Cohesion: 0.29
Nodes (6): 1. Environment & Configuration Sync, 2. No Hardcoding, 3. No Patches on Patches (Clean Code First), 4. File Structure & Quality Rules, 5. Version Control & Automated Delivery, Agent Guidelines & Engineering Standards

### Community 126 - "AuthService"
Cohesion: 0.12
Nodes (17): app_schemas_admin, app_schemas_student, app_services_admin_service, generate_temporary_password(), hash_password(), StudentCreate, StudentResponse, field_validator (+9 more)

### Community 127 - "StudentEnrollmentService"
Cohesion: 0.27
Nodes (6): Any, AsyncClient, Builds student specification objects with PRNs and @yopmail.com emails., Creates cohorts for Division A and Division B in CSE., Enrolls students into appropriate theory sections and practical lab batches., StudentEnrollmentService

### Community 134 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, start, test, test:watch

### Community 135 - "StatelessWidget"
Cohesion: 0.04
Nodes (42): build, email, errorMessage, isFormValid, LoginErrorBanner, password, HomeEmptyClasses, build (+34 more)

### Community 136 - "MessageResponse"
Cohesion: 0.49
Nodes (10): complete_onboarding(), forgot_password(), login(), logout(), post, Request, _rate_limit(), request_device_change() (+2 more)

### Community 138 - "summary_reporter.py"
Cohesion: 0.25
Nodes (7): rich, rich_panel, rich_table, print_final_summary(), Any, Summary Reporting & Terminal Dashboard Module. Renders final summary tables and…, Prints beautiful formatted terminal summary tables using rich.

### Community 139 - "Settings"
Cohesion: 0.33
Nodes (3): field_validator, Settings, BaseSettings

### Community 140 - "leaderboard_item_card.dart"
Cohesion: 0.22
Nodes (8): LeaderboardEntry, build, _buildRankBadge, entry, isCurrentUser, LeaderboardItemCard, rank, package:smart_attendance_app/domain/models/leaderboard.dart

### Community 141 - "LogEvent"
Cohesion: 0.32
Nodes (5): ingest_log(), post, LogEvent, BaseModel, field_validator

### Community 142 - "app_notification.dart"
Cohesion: 0.15
Nodes (12): body, category, copyWith, fromMap, id, isRead, link, severity (+4 more)

### Community 150 - "history_calendar_tab.dart"
Cohesion: 0.07
Nodes (30): Container, build, _buildDayNames, _buildDayRecords, _buildHeader, createState, _focusedMonth, HistoryCalendarTab (+22 more)

### Community 151 - ".simulate_device_changes"
Cohesion: 0.40
Nodes (3): Any, Simulates student device changes and teacher resolution., Simulates student leave submissions and teacher review queue processing.

### Community 155 - "LeaveDocumentModal.tsx"
Cohesion: 0.36
Nodes (6): LeaveDocumentModal(), LeaveDocumentModalProps, LeaveReviewDialog(), LeaveReviewDialogProps, PendingLeaveItem, frontend_src_types_index_pendingleaveitem

### Community 156 - "streak_counter.dart"
Cohesion: 0.25
Nodes (7): build, _buildCompactView, _buildFullView, currentStreak, highestStreak, isCompact, StreakCounter

### Community 159 - "middleware.ts"
Cohesion: 0.67
Nodes (3): config, middleware(), parseAuthCookie()

### Community 160 - "logger.ts"
Cohesion: 0.50
Nodes (3): logger, LogLevel, PREFIX

### Community 161 - "location_exceptions.dart"
Cohesion: 0.50
Nodes (3): LocationException, message, toString

### Community 165 - "check_services.py"
Cohesion: 0.29
Nodes (4): Service Health & Connectivity Checker Checks AWS S3 and PostgreSQL RDS…, botocore_exceptions, dotenv, socket

### Community 167 - "adb_login_and_capture.py"
Cohesion: 0.80
Nodes (5): adb(), key(), main(), tap(), type_text()

## Knowledge Gaps
- **1460 isolated node(s):** `ClassInput`, `StudentInput`, `TeacherInput`, `eslintConfig`, `nextConfig` (+1455 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2030 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **48 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminService` connect `AdminService` to `StudentRepository`, `schemas/admin.py`, `AttendanceRepository`, `api/admin.py`, `SessionService`, `AuthService`, `_handle_generic_err`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `getApiErrorMessage`, `api.ts`, `dropdown-menu.tsx`, `reset-password/page.tsx`, `GlassInput.tsx`, `lucide-react`, `classes/[id]/edit/page.tsx`, `analytics/page.tsx`, `useAuthStore`, `audit/page.tsx`, `models.ts`, `BulkImportModal.tsx`, `GeofenceMap.tsx`, `badge.tsx`, `frontend/package.json`, `AttendanceTrendChart.tsx`, `LeaveDocumentModal.tsx`, `form.tsx`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `@playwright/test` connect `@playwright/test` to `AdminClassroomsPage`, `AdminDepartmentsPage`, `AdminDesignationsPage`, `AdminSubjectsPage`, `LoginPage`, `AdminAuditPage`, `AdminOverviewPage`, `AdminScannerPage`, `BulkImportComponent`, `ForgotPasswordPage`, `ResetPasswordPage`, `TeacherOverviewPage`, `TeacherReviewPage`, `frontend/package.json`, `BasePage`, `test-fixtures.ts`, `PageObjects`, `AdminVerificationSettingsPage`, `TeacherSessionsPage`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Are the 59 inferred relationships involving `AdminService` (e.g. with `assign_teacher()` and `bulk_create_classes()`) actually correct?**
  _`AdminService` has 59 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ClassInput`, `StudentInput`, `TeacherInput` to the rest of the system?**
  _1460 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `api/teacher.py` be split into smaller, more focused modules?**
  _Cohesion score 0.07643467643467644 - nodes in this community are weakly interconnected._
- **Should `getApiErrorMessage` be split into smaller, more focused modules?**
  _Cohesion score 0.03350379121847999 - nodes in this community are weakly interconnected._