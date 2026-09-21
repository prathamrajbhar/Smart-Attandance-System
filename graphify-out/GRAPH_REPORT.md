# Graph Report - Smart Attandance System  (2026-09-21)

## Corpus Check
- 508 files · ~675,165 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 30 file(s) not represented in the graph (top: (none) 8, .xml 7, .example 5)

## Summary
- 4241 nodes · 9586 edges · 189 communities (140 shown, 49 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 339 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `46a33c19`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- api/teacher.py
- getApiErrorMessage
- api.ts
- package:smart_attendance_app/shared/widgets/animated_background.dart
- package:smart_attendance_app/shared/widgets/glass_card.dart
- attendance_service.py
- api/student.py
- GlassInput.tsx
- types/index.ts
- admin/classes/page.tsx
- cn
- react
- api/auth.py
- verification_ai_review_card.dart
- history_screen.dart
- setup.mjs
- GlassBadge.tsx
- seed_and_simulate.py
- test_api_auth.py
- main.dart
- AdminService
- package:flutter/material.dart
- theme.dart
- preferences_service.dart
- notifications.py
- verification_step_content.dart
- notification_service.dart
- List
- geofence_verification_provider.dart
- VoidCallback?
- login_screen.dart
- _handle_generic_err
- package:flutter_riverpod/flutter_riverpod.dart
- student_api.dart
- class_session_card.dart
- websocket_service.dart
- router.dart
- verification_screen.dart
- StudentRepository
- notification_tile.dart
- lucide-react
- test_core_and_middleware.py
- attendance.dart
- schemas/admin.py
- package:smart_attendance_app/app/theme.dart
- app.dart
- stat_tile.dart
- secure_storage.dart
- auth_provider.dart
- session_provider.dart
- api/admin.py
- frontend/package.json
- app_api_dependencies
- attendance_repository.dart
- home_screen.dart
- result_config.dart
- notifications_screen.dart
- glass_input.dart
- dependencies
- useBulkImportProcessor.ts
- attendance_utils.dart
- os
- smart_pass_provider.dart
- package:smart_attendance_app/shared/widgets/glass_button.dart
- notification_api.dart
- scripts
- attendance_provider.dart
- test_api_admin.py
- @playwright/test
- ConsumerStatefulWidget
- attendance_constants.dart
- typing
- reset_password_screen.dart
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
- smart_pass.dart
- user.dart
- global_exception_handler
- leave_requests_screen.dart
- leave_history_screen.dart
- help_screen.dart
- smart_pass_screen.dart
- conftest.py
- form.tsx
- test-fixtures.ts
- ai_orchestrator.py
- adb_mobile_screen_tester.py
- device_change_dialog.dart
- YopmailClient
- pytest
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
- button.tsx
- AdminClassesPage
- AdminTeachersPage
- AdminVerificationSettingsPage
- AttendanceTrendChart.tsx
- reset_password_provider.dart
- TestRunner
- system_configuration.dart
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
- StatelessWidget
- face_registration_screen.dart
- ref_playwright
- summary_reporter.py
- Settings
- leaderboard_item_card.dart
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
- .simulate_device_changes
- next.config.ts
- TeacherReviewPage
- history/page.tsx
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
- history_provider.dart
- ref_path
- seed/__init__.py
- login_error_banner.dart
- AttendanceRepository
- DateTime?
- Exception
- LeaderboardResponse?
- T
- DashboardKpiStrip.tsx

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

## Communities (189 total, 49 thin omitted)

### Community 0 - "api/teacher.py"
Cohesion: 0.05
Nodes (85): app_repositories_geofence_repo, app_services_leave_service, app_services_session_service, app_services_teacher_service, approve_device_change(), approve_leave(), bulk_mark_attendance(), export_class_attendance() (+77 more)

### Community 1 - "getApiErrorMessage"
Cohesion: 0.03
Nodes (90): ForgotPasswordPage(), handleResend(), onSubmit(), LoginPage(), handleSuccessRedirect(), onSubmit(), OnboardingContent(), checkToken() (+82 more)

### Community 2 - "api.ts"
Cohesion: 0.10
Nodes (60): SystemConfig, colorVariants, colorVariants, ActiveSessionsCard(), ActiveSessionsCardProps, ManualAttendanceStats(), ManualAttendanceStatsProps, AttendanceStatus (+52 more)

### Community 3 - "package:smart_attendance_app/shared/widgets/animated_background.dart"
Cohesion: 0.08
Nodes (33): ConsumerWidget, leaderboardProvider, build, _buildBody, _buildUserSummaryCard, LeaderboardScreen, AnalyticsLeaderboardTile, ResultScreen (+25 more)

### Community 4 - "package:smart_attendance_app/shared/widgets/glass_card.dart"
Cohesion: 0.03
Nodes (73): AttendanceHistoryItem, AttendanceHistoryResponse, AnalyticsKpiOverview, build, data, target, AnalyticsSubjectGoals, build (+65 more)

### Community 5 - "attendance_service.py"
Cohesion: 0.07
Nodes (31): AcademicClass, app_api_ws, app_services_ai_orchestrator, app_utils_geofencing, ClassRepository, GeofenceRepository, datetime, SessionRepository (+23 more)

### Community 6 - "api/student.py"
Cohesion: 0.07
Nodes (55): app_schemas_attendance, app_schemas_leave, app_schemas_student, app_services_attendance_service, app_services_student_service, get_current_student(), Student, analyze_attendance() (+47 more)

### Community 7 - "GlassInput.tsx"
Cohesion: 0.05
Nodes (63): VerifyData, SEMESTER_OPTIONS, GENDER_OPTIONS, SEMESTER_OPTIONS, StudentFormFields(), StudentFormFieldsProps, EditStudentFormFields(), EditStudentFormFieldsProps (+55 more)

### Community 8 - "types/index.ts"
Cohesion: 0.06
Nodes (47): AuditPage(), ClassesPage(), AdminDashboardPage(), StudentsPage(), TeachersPage(), ActivityDetailModal(), ActivityDetailModalProps, ActivityCategory (+39 more)

### Community 9 - "admin/classes/page.tsx"
Cohesion: 0.09
Nodes (29): classColumns, EnrollHeader(), EnrollHeaderProps, EnrollStudentFilters(), EnrollStudentFiltersProps, EnrollStudentRow(), EnrollStudentRowProps, studentColumns (+21 more)

### Community 10 - "cn"
Cohesion: 0.05
Nodes (53): ManualAttendanceStudentRow(), ManualAttendanceStudentRowProps, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle (+45 more)

### Community 11 - "react"
Cohesion: 0.06
Nodes (38): DashboardLayout(), AdminQuickActions(), QuickActionItem, getCommandIcon(), CommandPaletteModal(), CommandPaletteModalProps, Header(), HeaderProps (+30 more)

### Community 12 - "api/auth.py"
Cohesion: 0.09
Nodes (41): app_services_auth_service, app_services_device_change_service, app_services_system_config_service, change_password(), complete_onboarding(), forgot_password(), get_me(), get_public_system_config() (+33 more)

### Community 13 - "verification_ai_review_card.dart"
Cohesion: 0.04
Nodes (49): Animation, AnimationController, CustomPainter, AttendanceAnalysisResult, build, color, createState, dispose (+41 more)

### Community 14 - "history_screen.dart"
Cohesion: 0.11
Nodes (22): AnalyticsScreen, _AnalyticsScreenState, build, createState, initState, historyProvider, build, _buildTabBtn (+14 more)

### Community 15 - "setup.mjs"
Cohesion: 0.07
Nodes (45): ref_node_child_process, ref_node_crypto, ref_node_fs, ref_node_path, ref_node_url, checkVenvPythonVersion(), createPython311Venv(), ensureBackendDirectories() (+37 more)

### Community 16 - "GlassBadge.tsx"
Cohesion: 0.08
Nodes (26): AnomalyCard(), AnomalyCardProps, getRiskLevel(), WEEKDAYS, ScannerControls(), ScannerControlsProps, SessionRosterPage(), getRosterColumns() (+18 more)

### Community 17 - "seed_and_simulate.py"
Cohesion: 0.12
Nodes (25): argparse, httpx, random, re, rich_console, Admin Master Data Setup Automation. Configures institutional master data: -…, main(), Automated Data-Seeding and Realistic User-Simulation Pipeline. Usage: python… (+17 more)

### Community 18 - "test_api_auth.py"
Cohesion: 0.06
Nodes (38): app_schemas_health, app_schemas_notification, app_schemas_system_config, check_database(), check_redis(), check_s3(), get_health_status(), get (+30 more)

### Community 19 - "main.dart"
Cohesion: 0.08
Nodes (23): @pragma, HttpOverrides, addNotification, AppHttpOverrides, callbackDispatcher, createHttpClient, _firebaseMessagingBackgroundHandler, initialize (+15 more)

### Community 20 - "AdminService"
Cohesion: 0.06
Nodes (13): generate_temporary_password(), ClassResponse, StudentCreate, StudentResponse, TeacherResponse, AdminService, test_create_class_and_assign_teacher(), test_create_student_admin() (+5 more)

### Community 21 - "package:flutter/material.dart"
Cohesion: 0.07
Nodes (26): Color, dart:ui, build, goodThreshold, label, value, VerificationQualityBar, build (+18 more)

### Community 22 - "theme.dart"
Cohesion: 0.04
Nodes (45): accentAmber, accentEmerald, accentPink, accentTeal, baseText, bgCanvas, bgPrimary, bgSecondary (+37 more)

### Community 23 - "preferences_service.dart"
Cohesion: 0.04
Nodes (44): getAttendanceTarget, getLowAttendanceThreshold, getNotifyClassStart, getNotifyLowAttendance, getNotifySyncDone, getNotifyWindowOpen, isFirstCameraUse, _keyAttendanceTarget (+36 more)

### Community 24 - "notifications.py"
Cohesion: 0.09
Nodes (38): app_services_notification_service, broadcast_notification(), list_notifications(), mark_all_read(), mark_read(), delete, get, patch (+30 more)

### Community 25 - "verification_step_content.dart"
Cohesion: 0.05
Nodes (36): VerificationStep, isCameraReady, onAnalyze, onCapture, onRetake, onSubmit, showTips, step (+28 more)

### Community 26 - "notification_service.dart"
Cohesion: 0.05
Nodes (39): Box, dart:convert, WebSocketService, addToQueue, cacheProfile, cacheSystemConfig, clearAll, _configBox (+31 more)

### Community 27 - "List"
Cohesion: 0.06
Nodes (27): List, build, className, history, HistorySubjectBreakdown, name, present, _SubStat (+19 more)

### Community 28 - "geofence_verification_provider.dart"
Cohesion: 0.06
Nodes (35): AutoDisposeNotifier, dart:math, describeDistance, GeofenceCalculator, isWithinGeofence, describeDistance, ensurePermissionsGranted, getAveragedPosition (+27 more)

### Community 29 - "VoidCallback?"
Cohesion: 0.08
Nodes (21): build, highestStreak, history, HomeAttendanceOverview, onTapAnalytics, overallPct, build, HomeWarningBanner (+13 more)

### Community 30 - "login_screen.dart"
Cohesion: 0.09
Nodes (27): class, authProvider, build, _confirmPasswordController, createState, dispose, ForceChangePasswordScreen, _ForceChangePasswordScreenState (+19 more)

### Community 31 - "_handle_generic_err"
Cohesion: 0.17
Nodes (37): assign_teacher(), bulk_create_classes(), bulk_create_classrooms(), bulk_create_departments(), bulk_create_designations(), bulk_create_students(), bulk_create_subjects(), bulk_create_teachers() (+29 more)

### Community 32 - "package:flutter_riverpod/flutter_riverpod.dart"
Cohesion: 0.06
Nodes (34): Dio, AuthApi, authApiProvider, changePassword, _dio, getProfile, login, logout (+26 more)

### Community 33 - "student_api.dart"
Cohesion: 0.07
Nodes (26): analyzeAttendance, confirmAttendance, createLeaveRequest, _dio, getLeaderboard, getMyAttendance, getMyClasses, getMyLeaves (+18 more)

### Community 34 - "class_session_card.dart"
Cohesion: 0.05
Nodes (41): Duration?, defineUrl, envUrl, kConnectTimeout, kGeofenceGraceMeters, kGpsAveragingSamples, kGpsTimeoutSeconds, kHiveBoxConfig (+33 more)

### Community 35 - "websocket_service.dart"
Cohesion: 0.06
Nodes (34): computeRouterRedirect, null, authState, _channel, connect, disconnect, dispose, _maxReconnectAttempts (+26 more)

### Community 36 - "router.dart"
Cohesion: 0.06
Nodes (34): ChangeNotifier, GoRouter, notifier, notify, rootNavigatorKey, RouterNotifier, routerNotifierProvider, shellNavigatorKey (+26 more)

### Community 37 - "verification_screen.dart"
Cohesion: 0.09
Nodes (30): ConsumerState, hiveServiceProvider, preferencesServiceProvider, attendanceVerificationProvider, geofenceVerificationProvider, build, VerificationCameraMixin, _aiStepIndex (+22 more)

### Community 38 - "StudentRepository"
Cohesion: 0.15
Nodes (4): Student, StudentRepository, Teacher, TeacherRepository

### Community 39 - "notification_tile.dart"
Cohesion: 0.06
Nodes (31): File?, Map, LocalNotification, build, CalendarMonthGrid, focusedMonth, grouped, onSelectDate (+23 more)

### Community 40 - "lucide-react"
Cohesion: 0.06
Nodes (43): ActiveTab, ActiveSessionBanner(), ActiveSessionBannerProps, TeacherDashboardPage(), LeaveDocumentModal(), LeaveDocumentModalProps, LeaveReviewDialog(), LeaveReviewDialogProps (+35 more)

### Community 41 - "test_core_and_middleware.py"
Cohesion: 0.15
Nodes (19): RoleChecker, create_access_token(), decode_access_token(), hash_password(), Any, verify_password(), TestSmartAttendanceSuite, test_jwt_token_roundtrip() (+11 more)

### Community 42 - "attendance.dart"
Cohesion: 0.06
Nodes (33): activeSessionId, attendanceId, backgroundScore, classId, className, createdAt, faceScore, finalAiScore (+25 more)

### Community 43 - "schemas/admin.py"
Cohesion: 0.11
Nodes (25): AbsenteeAnomalyItem, AssignTeacherRequest, AuditLogResponse, ClassBulkCreateRequest, ClassBulkItem, ClassCreate, ClassroomBulkCreateRequest, ClassroomBulkItem (+17 more)

### Community 44 - "package:smart_attendance_app/app/theme.dart"
Cohesion: 0.08
Nodes (24): slideRightPage, slideUpPage, build, LeaveQuickActions, build, _getInitials, profile, ProfileHeaderCard (+16 more)

### Community 45 - "app.dart"
Cohesion: 0.09
Nodes (30): build, createState, dispose, _handleNotificationClick, inferNotificationSeverity, _initializeFcm, initState, kSeverityInfo (+22 more)

### Community 46 - "stat_tile.dart"
Cohesion: 0.15
Nodes (12): build, _buildCompact, _buildMinimal, _buildPill, color, icon, label, onTap (+4 more)

### Community 47 - "secure_storage.dart"
Cohesion: 0.07
Nodes (25): dart:io, DeviceInfoPlugin, FlutterSecureStorage, _deviceInfo, DeviceService, getDeviceUUID, _secureStorage, clearAll (+17 more)

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

### Community 52 - "app_api_dependencies"
Cohesion: 0.16
Nodes (17): app_api_dependencies, app_schemas_search, app_services_search_service, get_current_teacher(), get_current_user(), Teacher, User, global_search() (+9 more)

### Community 53 - "attendance_repository.dart"
Cohesion: 0.10
Nodes (20): analyzeAttendance, AttendanceRepository, AttendanceSubmitResult, confirmAttendance, getHistory, _hive, OfflineQueued, OnlineResult (+12 more)

### Community 54 - "home_screen.dart"
Cohesion: 0.15
Nodes (16): sessionProvider, build, createState, didChangeAppLifecycleState, dispose, HomeScreen, _HomeScreenState, initState (+8 more)

### Community 55 - "result_config.dart"
Cohesion: 0.10
Nodes (19): background, color, error, face, flagged, icon, liveness, offline (+11 more)

### Community 56 - "notifications_screen.dart"
Cohesion: 0.09
Nodes (27): notificationsLoadingProvider, notificationsProvider, pendingCountProvider, build, _getGreeting, _getInitials, HomeWelcomeCard, pendingCount (+19 more)

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
Cohesion: 0.20
Nodes (18): asyncio, json, os, playwright_async_api, capture_screenshot(), run_cmd(), test_emulator_e2e(), capture_screenshot() (+10 more)

### Community 62 - "smart_pass_provider.dart"
Cohesion: 0.09
Nodes (24): NotificationsNotifier, PendingCountNotifier, copyWith, errorMessage, RegistrationNotifier, RegistrationState, RegistrationStatus, _repo (+16 more)

### Community 63 - "package:smart_attendance_app/shared/widgets/glass_button.dart"
Cohesion: 0.07
Nodes (25): build, _buildChip, GeofenceDistanceMetrics, state, statusColor, build, GeofenceStatusCard, onRetry (+17 more)

### Community 64 - "notification_api.dart"
Cohesion: 0.08
Nodes (23): category, createdAt, deleteNotification, _dio, fromJson, getNotifications, id, isRead (+15 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (23): bin, dev, setup, description, name, private, scripts, backend:setup (+15 more)

### Community 66 - "attendance_provider.dart"
Cohesion: 0.07
Nodes (27): DateTimeFormatting, formattedDate, formattedDateTime, isSameDay, shortDate, StringFormatting, truncate, accuracy (+19 more)

### Community 67 - "test_api_admin.py"
Cohesion: 0.13
Nodes (13): app_schemas_master_data, app_schemas_pagination, AdminStatsResponse, BulkImportResponse, DepartmentResponse, PaginatedResponse, PaginationParams, BaseModel (+5 more)

### Community 68 - "@playwright/test"
Cohesion: 0.12
Nodes (6): ClassInput, StudentInput, TeacherInput, TeacherAnalyticsPage, TeacherHistoryPage, @playwright/test

### Community 69 - "ConsumerStatefulWidget"
Cohesion: 0.14
Nodes (14): ConsumerStatefulWidget, attendanceRepositoryProvider, FlaggedDetailScreen, _FlaggedDetailScreenState, _loadItem, VerificationScreen, build, createState (+6 more)

### Community 70 - "attendance_constants.dart"
Cohesion: 0.09
Nodes (21): kAttendanceTypeLocal, kAttendanceTypePush, kGoodScoreThreshold, kImagePickQuality, kMinBrightnessForPhoto, kMinSharpnessForPhoto, kNoteMaxChars, kOverallGoodPct (+13 more)

### Community 71 - "typing"
Cohesion: 0.06
Nodes (39): app_core_logging_config, app_core_security, app_db_client, app_db_redis, app_repositories_attendance_repo, app_repositories_class_repo, app_repositories_enrollment_repo, app_repositories_leave_repo (+31 more)

### Community 72 - "reset_password_screen.dart"
Cohesion: 0.12
Nodes (20): FormState, resetPasswordProvider, build, _buildInvalidCard, _buildLoadingCard, _buildResetForm, _confirmCtrl, createState (+12 more)

### Community 73 - "offline_payload.dart"
Cohesion: 0.11
Nodes (19): @HiveType, HiveObject, hashCode, OfflineAttendancePayloadAdapter, operator, read, typeId, write (+11 more)

### Community 74 - "BasePage"
Cohesion: 0.13
Nodes (3): BasePage, TeacherClassesPage, TeacherLeavesPage

### Community 75 - "leaderboard.dart"
Cohesion: 0.12
Nodes (18): AppException, AuthException, message, NetworkException, ServerException, statusCode, toString, ValidationException (+10 more)

### Community 76 - "AttendanceRepository"
Cohesion: 0.06
Nodes (26): AttendanceRepository, Attendance, LeaveRepository, LeaveService, approved, approvedBy, approverNote, createdAt (+18 more)

### Community 77 - "GamificationService"
Cohesion: 0.10
Nodes (14): app_services_gamification_service, GamificationService, Return the active Redis client if available., Update a student's score in the Redis leaderboard., Fetch the leaderboard from Redis, falling back to DB if empty., Helper to compatibility-wrap recalculate_student_streak., Rebuild the leaderboard cache from DB data., Recalculate student streak based on historical attendance logs and active… (+6 more)

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
Cohesion: 0.05
Nodes (38): IconData?, build, icon, iconColor, onTap, pendingCount, ProfileSettingsList, _SettingTile (+30 more)

### Community 82 - "BroadcastNotificationModal.tsx"
Cohesion: 0.15
Nodes (16): BroadcastNotificationModalProps, INITIAL_FORM, formatRelativeTime(), getIcon(), NotificationItemRow(), NotificationItemRowProps, NotificationTabs(), NotificationTabsProps (+8 more)

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
Cohesion: 0.12
Nodes (17): build, createState, dispose, _endDate, _isSubmitting, LeaveRequestsScreen, _LeaveRequestsScreenState, _notesController (+9 more)

### Community 89 - "leave_history_screen.dart"
Cohesion: 0.12
Nodes (17): build, _buildEmpty, _buildError, _buildList, leaveHistoryProvider, LeaveHistoryScreen, listResponse, response (+9 more)

### Community 90 - "help_screen.dart"
Cohesion: 0.12
Nodes (15): build, child, ShellScaffold, _tabPaths, answer, build, createState, _expanded (+7 more)

### Community 91 - "smart_pass_screen.dart"
Cohesion: 0.06
Nodes (39): LocationPermission, checkAttendancePermissions, hasLocationAccess, isLocationServiceEnabled, isPermanentlyDenied, locationPermission, message, openAppSettings (+31 more)

### Community 92 - "conftest.py"
Cohesion: 0.19
Nodes (13): AwaitableMock, mock_academic_class(), mock_admin_user(), mock_redis(), mock_student_profile(), mock_student_user(), mock_teacher_profile(), mock_teacher_user() (+5 more)

### Community 93 - "form.tsx"
Cohesion: 0.18
Nodes (13): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+5 more)

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

### Community 99 - "pytest"
Cohesion: 0.22
Nodes (12): app_services_absentee_scanner, scan_absentee_anomalies(), _detect_pattern(), Any, run_absentee_scan(), _run_isolation_forest(), asyncio, test_run_absentee_scan_detects_outliers() (+4 more)

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
Nodes (8): AdminSetupService, Any, AsyncClient, Creates classroom and laboratory venues., Logs into admin account and acquires JWT access token., Creates institutional departments., Creates academic designations., Creates academic subjects (Theory & Practical).

### Community 106 - "student_stats.dart"
Cohesion: 0.18
Nodes (10): absentCount, attendancePercentage, currentStreak, excusedCount, flaggedCount, fromJson, highestStreak, presentCount (+2 more)

### Community 107 - "String?"
Cohesion: 0.06
Nodes (36): CameraController?, int?, blurScore, brightnessScore, camera, cameraError, capturePhoto, disposeCamera (+28 more)

### Community 108 - "manifest.json"
Cohesion: 0.18
Nodes (10): background_color, description, display, icons, name, orientation, prefer_related_applications, short_name (+2 more)

### Community 109 - "email_service.py"
Cohesion: 0.15
Nodes (12): aiosmtplib, app_core_config, app_core_url_resolver, Request, Dynamically resolves the frontend base URL for email links, redirects, and…, resolve_frontend_url(), EmailService, Any (+4 more)

### Community 111 - "PageObjects"
Cohesion: 0.20
Nodes (3): PageObjects, TeacherDeviceChangesPage, TeacherProfilePage

### Community 112 - "glass_button.dart"
Cohesion: 0.07
Nodes (28): EdgeInsetsGeometry, background, border, build, _ButtonColors, fontSize, foreground, GlassButton (+20 more)

### Community 113 - "button.tsx"
Cohesion: 0.24
Nodes (8): Badge(), BadgeProps, badgeVariants, Button, ButtonProps, buttonVariants, class-variance-authority, @radix-ui/react-slot

### Community 117 - "AttendanceTrendChart.tsx"
Cohesion: 0.22
Nodes (5): monthlyData, MonthlyDataPoint, breakdownData, BreakdownItem, recharts

### Community 118 - "reset_password_provider.dart"
Cohesion: 0.12
Nodes (16): AuthRepository, copyWith, email, errorMessage, isSubmitting, isSuccess, isValid, isVerifying (+8 more)

### Community 120 - "system_configuration.dart"
Cohesion: 0.33
Nodes (5): fromJson, isAiBackgroundValidationEnabled, isFaceRecognitionEnabled, isGpsVerificationEnabled, toJson

### Community 121 - "verification_preview_frame.dart"
Cohesion: 0.12
Nodes (15): bool get, double?, blurScore, brightnessScore, build, imagePath, isAnalyzingQuality, isPoorQuality (+7 more)

### Community 124 - "SessionSimulationService"
Cohesion: 0.29
Nodes (6): Any, AsyncClient, Acquires auth tokens for faculty members to drive session endpoints., Categorizes students into Exemplary (~60%), Irregular (~25%), and Defaulter…, Runs the multi-day attendance simulation across classes., SessionSimulationService

### Community 125 - "Agent Guidelines & Engineering Standards"
Cohesion: 0.29
Nodes (6): 1. Environment & Configuration Sync, 2. No Hardcoding, 3. No Patches on Patches (Clean Code First), 4. File Structure & Quality Rules, 5. Version Control & Automated Delivery, Agent Guidelines & Engineering Standards

### Community 126 - "test_service_admin.py"
Cohesion: 0.21
Nodes (9): app_schemas_admin, app_services_admin_service, field_validator, TeacherCreate, asyncio, test_admin_service_create_student(), test_admin_service_create_teacher(), test_admin_service_enroll_students() (+1 more)

### Community 127 - "StudentEnrollmentService"
Cohesion: 0.27
Nodes (6): Any, AsyncClient, Builds student specification objects with PRNs and @yopmail.com emails., Creates cohorts for Division A and Division B in CSE., Enrolls students into appropriate theory sections and practical lab batches., StudentEnrollmentService

### Community 134 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, start, test, test:watch

### Community 135 - "StatelessWidget"
Cohesion: 0.09
Nodes (23): GlassAppBar, actionLabel, _BannerConfig, BannerSeverity, build, color, customIcon, icon (+15 more)

### Community 136 - "face_registration_screen.dart"
Cohesion: 0.14
Nodes (16): registrationProvider, build, _cameraController, _cameraError, _capturedPath, _capturePhoto, createState, dispose (+8 more)

### Community 138 - "summary_reporter.py"
Cohesion: 0.25
Nodes (7): rich, rich_panel, rich_table, print_final_summary(), Any, Summary Reporting & Terminal Dashboard Module. Renders final summary tables and…, Prints beautiful formatted terminal summary tables using rich.

### Community 139 - "Settings"
Cohesion: 0.33
Nodes (3): field_validator, Settings, BaseSettings

### Community 140 - "leaderboard_item_card.dart"
Cohesion: 0.22
Nodes (8): LeaderboardEntry, build, _buildRankBadge, entry, isCurrentUser, LeaderboardItemCard, rank, package:smart_attendance_app/domain/models/leaderboard.dart

### Community 141 - "main.py"
Cohesion: 0.06
Nodes (36): app_api, app_middleware_request_logging, app_schemas_common, app_schemas_log, app_services_s3_service, app_services_scheduler, ingest_log(), post (+28 more)

### Community 142 - "app_notification.dart"
Cohesion: 0.15
Nodes (12): body, category, copyWith, fromMap, id, isRead, link, severity (+4 more)

### Community 150 - "history_calendar_tab.dart"
Cohesion: 0.05
Nodes (41): Container, build, createState, desc, _expanded, FlaggedTroubleshootFaq, _FlaggedTroubleshootFaqState, icon (+33 more)

### Community 151 - ".simulate_device_changes"
Cohesion: 0.40
Nodes (3): Any, Simulates student device changes and teacher resolution., Simulates student leave submissions and teacher review queue processing.

### Community 155 - "history/page.tsx"
Cohesion: 0.21
Nodes (9): ColumnProps, getSessionLogColumns(), SessionLogItem, AcademicClass, HistoryFilters(), HistoryFiltersProps, AcademicClass, HistoryPage() (+1 more)

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
Nodes (4): Service Health & Connectivity Checker Checks AWS S3 and PostgreSQL RDS…, boto3, dotenv, socket

### Community 167 - "adb_login_and_capture.py"
Cohesion: 0.80
Nodes (5): adb(), key(), main(), tap(), type_text()

### Community 174 - "history_provider.dart"
Cohesion: 0.17
Nodes (12): data, errorMessage, fetch, HistoryNotifier, HistoryState, isLoading, notifier, _repo (+4 more)

### Community 175 - "ref_path"
Cohesion: 0.25
Nodes (4): frontend_node_modules_playwright_test_index, ref_fs, ref_path, @vitejs/plugin-react

### Community 177 - "login_error_banner.dart"
Cohesion: 0.25
Nodes (7): build, email, errorMessage, isFormValid, LoginErrorBanner, password, package:smart_attendance_app/features/auth/widgets/device_change_dialog.dart

## Knowledge Gaps
- **1460 isolated node(s):** `ClassInput`, `StudentInput`, `TeacherInput`, `eslintConfig`, `nextConfig` (+1455 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2036 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **49 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminService` connect `AdminService` to `attendance_service.py`, `StudentRepository`, `typing`, `schemas/admin.py`, `api/auth.py`, `api/admin.py`, `test_service_admin.py`, `_handle_generic_err`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `getApiErrorMessage`, `api.ts`, `GlassInput.tsx`, `types/index.ts`, `admin/classes/page.tsx`, `cn`, `GlassBadge.tsx`, `history/page.tsx`, `lucide-react`, `frontend/package.json`, `useBulkImportProcessor.ts`, `DashboardKpiStrip.tsx`, `GeofenceMap.tsx`, `BroadcastNotificationModal.tsx`, `form.tsx`, `dropdown-menu.tsx`, `reset-password/page.tsx`, `button.tsx`, `AttendanceTrendChart.tsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `@playwright/test` connect `@playwright/test` to `AdminClassroomsPage`, `AdminDepartmentsPage`, `AdminDesignationsPage`, `AdminSubjectsPage`, `LoginPage`, `AdminAuditPage`, `AdminOverviewPage`, `AdminScannerPage`, `BulkImportComponent`, `ForgotPasswordPage`, `ResetPasswordPage`, `TeacherOverviewPage`, `TeacherReviewPage`, `frontend/package.json`, `BasePage`, `test-fixtures.ts`, `PageObjects`, `AdminVerificationSettingsPage`, `TeacherSessionsPage`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Are the 59 inferred relationships involving `AdminService` (e.g. with `assign_teacher()` and `bulk_create_classes()`) actually correct?**
  _`AdminService` has 59 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ClassInput`, `StudentInput`, `TeacherInput` to the rest of the system?**
  _1460 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `api/teacher.py` be split into smaller, more focused modules?**
  _Cohesion score 0.051403094676108055 - nodes in this community are weakly interconnected._
- **Should `getApiErrorMessage` be split into smaller, more focused modules?**
  _Cohesion score 0.03374870197300104 - nodes in this community are weakly interconnected._