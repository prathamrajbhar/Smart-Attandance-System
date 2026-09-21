# Graph Report - Smart Attandance System  (2026-09-21)

## Corpus Check
- 496 files · ~600,185 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 30 file(s) not represented in the graph (top: (none) 8, .xml 7, .example 5)

## Summary
- 4143 nodes · 9300 edges · 188 communities (135 shown, 53 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 323 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `462b9042`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- api/teacher.py
- getApiErrorMessage
- api.ts
- typing
- package:smart_attendance_app/shared/widgets/glass_card.dart
- attendance_service.py
- api/student.py
- reset-password/page.tsx
- types/index.ts
- react
- cn
- useAuthStore
- api/auth.py
- verification_ai_review_card.dart
- package:smart_attendance_app/shared/widgets/animated_background.dart
- setup.mjs
- Color
- seed_and_simulate.py
- datetime
- main.dart
- AdminService
- AttendanceRepository
- theme.dart
- preferences_service.dart
- notifications.py
- verification_step_content.dart
- notification_service.dart
- StatelessWidget
- geofence_verification_provider.dart
- VoidCallback?
- login_screen.dart
- _handle_generic_err
- package:flutter_riverpod/flutter_riverpod.dart
- student_api.dart
- glass_button.dart
- websocket_service.dart
- router.dart
- verification_screen.dart
- smart_pass_provider.dart
- notifications_screen.dart
- StudentRepository
- package:flutter/material.dart
- attendance.dart
- schemas/admin.py
- audit/page.tsx
- app.dart
- package:smart_attendance_app/app/theme.dart
- package:smart_attendance_app/shared/widgets/glass_button.dart
- auth_provider.dart
- session_provider.dart
- api/admin.py
- frontend/package.json
- attendance_provider.dart
- attendance_repository.dart
- offline_sync_service.dart
- result_config.dart
- history_calendar_tab.dart
- glass_input.dart
- dependencies
- useBulkImportProcessor.ts
- attendance_utils.dart
- os
- String?
- glass_card.dart
- notification_api.dart
- scripts
- history_provider.dart
- test_api_admin.py
- @playwright/test
- enroll/page.tsx
- attendance_constants.dart
- db_cleaner.py
- GeofenceControls.tsx
- offline_payload.dart
- BasePage
- leaderboard.dart
- reset_password_screen.dart
- .get_leaderboard
- devDependencies
- GeofenceMap.tsx
- compilerOptions
- notification_tile.dart
- class_session_card.dart
- 🚀 Key Features
- master_data.py
- smart_pass.dart
- user.dart
- home_screen.dart
- leave_requests_screen.dart
- reset_password_provider.dart
- face_registration_screen.dart
- smart_pass_screen.dart
- conftest.py
- form.tsx
- test-fixtures.ts
- profile_settings_list.dart
- ai_orchestrator.py
- device_change_dialog.dart
- info_banner.dart
- absentee_scanner.py
- AIOrchestrator
- dropdown-menu.tsx
- app_notification.dart
- ConnectionManager
- leave_history_stats.dart
- verification_preview_frame.dart
- student_stats.dart
- verification_camera_mixin.dart
- manifest.json
- resolve_frontend_url
- S3Service
- PageObjects
- manual/page.tsx
- button.tsx
- AdminClassesPage
- AdminTeachersPage
- AdminVerificationSettingsPage
- AttendanceTrendChart.tsx
- Any
- TestRunner
- SystemConfigRepository
- dart:async
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
- WebSocketClient
- test_teacher_smart_pass_playwright.mjs
- adb_mobile_screen_tester.py
- .generate_student_specs
- Settings
- LeaveRequestCreate
- LogEvent
- SessionScheduler
- AdminAuditPage
- AdminOverviewPage
- AdminScannerPage
- BulkImportComponent
- ForgotPasswordPage
- ResetPasswordPage
- TeacherOverviewPage
- system_configuration.dart
- adb_login_and_capture.py
- MobileE2ERunner
- TeacherReviewPage
- summary_reporter.py
- .simulate_device_changes
- .onboard_teachers
- app/layout.tsx
- DashboardKpiStrip.tsx
- middleware.ts
- logger.ts
- location_exceptions.dart
- DeepInteractiveRunner
- FlutterActivity
- frontend/README.md
- AnalyticsPage
- smart_attendance_app
- .complete_onboarding_in_browser
- rules/graphify.md
- workflows/graphify.md
- backend/README.md
- next.config.ts
- postcss.config.mjs
- TeacherClassesPage
- .login_admin
- seed/__init__.py
- .fetch_onboarding_token_from_yopmail
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

## Communities (188 total, 53 thin omitted)

### Community 0 - "api/teacher.py"
Cohesion: 0.05
Nodes (76): app_schemas_attendance, app_schemas_leave, app_services_gamification_service, app_services_leave_service, app_services_session_service, app_services_teacher_service, approve_device_change(), approve_leave() (+68 more)

### Community 1 - "getApiErrorMessage"
Cohesion: 0.03
Nodes (88): ForgotPasswordPage(), handleResend(), onSubmit(), LoginPage(), handleSuccessRedirect(), onSubmit(), OnboardingContent(), checkToken() (+80 more)

### Community 2 - "api.ts"
Cohesion: 0.11
Nodes (54): VerifyData, SEMESTER_OPTIONS, SystemConfig, colorVariants, colorVariants, AcademicClass, BreadcrumbItem, GlassBreadcrumb() (+46 more)

### Community 3 - "typing"
Cohesion: 0.05
Nodes (64): aiosmtplib, app_api, app_core_config, app_core_logging_config, app_core_security, app_core_url_resolver, app_db_client, app_db_redis (+56 more)

### Community 4 - "package:smart_attendance_app/shared/widgets/glass_card.dart"
Cohesion: 0.03
Nodes (79): AttendanceHistoryItem, AttendanceHistoryResponse, AnalyticsKpiOverview, build, data, target, AnalyticsSubjectHeatmap, build (+71 more)

### Community 5 - "attendance_service.py"
Cohesion: 0.05
Nodes (52): AcademicClass, app_api_ws, app_repositories_geofence_repo, app_services_ai_orchestrator, app_services_system_config_service, app_utils_geofencing, RoleChecker, create_access_token() (+44 more)

### Community 6 - "api/student.py"
Cohesion: 0.07
Nodes (55): app_schemas_student, app_services_attendance_service, app_services_student_service, analyze_attendance(), confirm_attendance(), create_leave_request(), get_leaderboard(), get_my_attendance() (+47 more)

### Community 7 - "reset-password/page.tsx"
Cohesion: 0.04
Nodes (60): VerifyData, GENDER_OPTIONS, SEMESTER_OPTIONS, StudentFormFields(), StudentFormFieldsProps, EditStudentFormFields(), EditStudentFormFieldsProps, GENDER_OPTIONS (+52 more)

### Community 8 - "types/index.ts"
Cohesion: 0.05
Nodes (55): ActiveSessionBanner(), ActiveSessionBannerProps, TeacherDashboardPage(), ActiveSessionsCard(), ActiveSessionsCardProps, SessionRosterPage(), getRosterColumns(), GetRosterColumnsProps (+47 more)

### Community 9 - "react"
Cohesion: 0.08
Nodes (39): classColumns, studentColumns, teacherColumns, DeviceChangesPage(), ColumnProps, SessionLogItem, LeaveDocumentModal(), LeaveDocumentModalProps (+31 more)

### Community 10 - "cn"
Cohesion: 0.05
Nodes (52): ScannerControls(), ScannerControlsProps, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle (+44 more)

### Community 11 - "useAuthStore"
Cohesion: 0.07
Nodes (46): AdminDashboardPage(), DashboardLayout(), BroadcastNotificationModal(), BroadcastNotificationModalProps, INITIAL_FORM, CommandPaletteModal(), Header(), HeaderProps (+38 more)

### Community 12 - "api/auth.py"
Cohesion: 0.07
Nodes (41): app_schemas_system_config, app_services_auth_service, app_services_device_change_service, change_password(), complete_onboarding(), forgot_password(), get_me(), get_public_system_config() (+33 more)

### Community 13 - "verification_ai_review_card.dart"
Cohesion: 0.04
Nodes (53): AnimationController, CustomPainter, AttendanceAnalysisResult, GeofenceStatus, build, createState, desc, _expanded (+45 more)

### Community 14 - "package:smart_attendance_app/shared/widgets/animated_background.dart"
Cohesion: 0.05
Nodes (51): ConsumerWidget, leaderboardProvider, AnalyticsScreen, _AnalyticsScreenState, build, createState, initState, build (+43 more)

### Community 15 - "setup.mjs"
Cohesion: 0.07
Nodes (45): ref_node_child_process, ref_node_crypto, ref_node_fs, ref_node_path, ref_node_url, checkVenvPythonVersion(), createPython311Venv(), ensureBackendDirectories() (+37 more)

### Community 16 - "Color"
Cohesion: 0.04
Nodes (46): Animation, Color, IconData?, animation, build, hint, icon, label (+38 more)

### Community 17 - "seed_and_simulate.py"
Cohesion: 0.08
Nodes (34): argparse, BrowserContext, httpx, random, re, rich_console, AdminSetupService, AsyncClient (+26 more)

### Community 18 - "datetime"
Cohesion: 0.08
Nodes (33): app_api_dependencies, app_schemas_health, app_schemas_notification, check_database(), check_redis(), check_s3(), get_health_status(), get (+25 more)

### Community 19 - "main.dart"
Cohesion: 0.04
Nodes (44): @pragma, Duration?, HttpOverrides, defineUrl, envUrl, kConnectTimeout, kGeofenceGraceMeters, kGpsAveragingSamples (+36 more)

### Community 20 - "AdminService"
Cohesion: 0.08
Nodes (7): ClassResponse, TeacherResponse, AdminService, Classroom, Department, Designation, Subject

### Community 21 - "AttendanceRepository"
Cohesion: 0.06
Nodes (26): AttendanceRepository, Attendance, LeaveRepository, LeaveService, approved, approvedBy, approverNote, createdAt (+18 more)

### Community 22 - "theme.dart"
Cohesion: 0.04
Nodes (45): accentAmber, accentEmerald, accentPink, accentTeal, baseText, bgCanvas, bgPrimary, bgSecondary (+37 more)

### Community 23 - "preferences_service.dart"
Cohesion: 0.04
Nodes (44): getAttendanceTarget, getLowAttendanceThreshold, getNotifyClassStart, getNotifyLowAttendance, getNotifySyncDone, getNotifyWindowOpen, isFirstCameraUse, _keyAttendanceTarget (+36 more)

### Community 24 - "notifications.py"
Cohesion: 0.08
Nodes (40): app_schemas_common, app_services_notification_service, broadcast_notification(), list_notifications(), mark_all_read(), mark_read(), delete, get (+32 more)

### Community 25 - "verification_step_content.dart"
Cohesion: 0.05
Nodes (40): VerificationStep, build, build, isCameraReady, onAnalyze, onCapture, onRetake, onSubmit (+32 more)

### Community 26 - "notification_service.dart"
Cohesion: 0.05
Nodes (39): Box, dart:convert, WebSocketService, addToQueue, cacheProfile, cacheSystemConfig, clearAll, _configBox (+31 more)

### Community 27 - "StatelessWidget"
Cohesion: 0.05
Nodes (36): LeaderboardEntry, build, _buildRankBadge, entry, isCurrentUser, LeaderboardItemCard, rank, build (+28 more)

### Community 28 - "geofence_verification_provider.dart"
Cohesion: 0.06
Nodes (35): AutoDisposeNotifier, dart:math, describeDistance, GeofenceCalculator, isWithinGeofence, describeDistance, ensurePermissionsGranted, getAveragedPosition (+27 more)

### Community 29 - "VoidCallback?"
Cohesion: 0.05
Nodes (34): CameraController?, build, camera, cameraError, isCameraReady, onDismissTips, onRetryCamera, showTips (+26 more)

### Community 30 - "login_screen.dart"
Cohesion: 0.07
Nodes (36): class, authProvider, build, _confirmPasswordController, createState, dispose, ForceChangePasswordScreen, _ForceChangePasswordScreenState (+28 more)

### Community 31 - "_handle_generic_err"
Cohesion: 0.17
Nodes (37): assign_teacher(), bulk_create_classes(), bulk_create_classrooms(), bulk_create_departments(), bulk_create_designations(), bulk_create_students(), bulk_create_subjects(), bulk_create_teachers() (+29 more)

### Community 32 - "package:flutter_riverpod/flutter_riverpod.dart"
Cohesion: 0.06
Nodes (34): DeviceInfoPlugin, FlutterSecureStorage, AuthApi, _deviceInfo, DeviceService, getDeviceUUID, _secureStorage, clearAll (+26 more)

### Community 33 - "student_api.dart"
Cohesion: 0.06
Nodes (34): Dio, authApiProvider, changePassword, _dio, getProfile, login, logout, resetPassword (+26 more)

### Community 34 - "glass_button.dart"
Cohesion: 0.06
Nodes (33): List, build, className, history, HistorySubjectBreakdown, name, present, _SubStat (+25 more)

### Community 35 - "websocket_service.dart"
Cohesion: 0.06
Nodes (34): computeRouterRedirect, null, authState, _channel, connect, disconnect, dispose, _maxReconnectAttempts (+26 more)

### Community 36 - "router.dart"
Cohesion: 0.06
Nodes (34): ChangeNotifier, GoRouter, notifier, notify, rootNavigatorKey, RouterNotifier, routerNotifierProvider, shellNavigatorKey (+26 more)

### Community 37 - "verification_screen.dart"
Cohesion: 0.08
Nodes (34): ConsumerState, ConsumerStatefulWidget, hiveServiceProvider, preferencesServiceProvider, attendanceRepositoryProvider, attendanceVerificationProvider, geofenceVerificationProvider, FlaggedDetailScreen (+26 more)

### Community 38 - "smart_pass_provider.dart"
Cohesion: 0.07
Nodes (32): StudentApi, _api, copyWith, data, errorMessage, fetch, isLoading, LeaderboardNotifier (+24 more)

### Community 39 - "notifications_screen.dart"
Cohesion: 0.07
Nodes (32): notificationsLoadingProvider, notificationsProvider, pendingCountProvider, build, _getGreeting, _getInitials, HomeWelcomeCard, pendingCount (+24 more)

### Community 40 - "StudentRepository"
Cohesion: 0.09
Nodes (14): get_current_student(), get_current_teacher(), get_current_user(), Student, Teacher, User, EnrollmentRepository, Student (+6 more)

### Community 41 - "package:flutter/material.dart"
Cohesion: 0.07
Nodes (29): slideRightPage, slideUpPage, build, child, ShellScaffold, _tabPaths, AnalyticsSubjectGoals, build (+21 more)

### Community 42 - "attendance.dart"
Cohesion: 0.06
Nodes (33): activeSessionId, attendanceId, backgroundScore, classId, className, createdAt, faceScore, finalAiScore (+25 more)

### Community 43 - "schemas/admin.py"
Cohesion: 0.11
Nodes (25): AbsenteeAnomalyItem, AssignTeacherRequest, AuditLogResponse, ClassBulkCreateRequest, ClassBulkItem, ClassCreate, ClassroomBulkCreateRequest, ClassroomBulkItem (+17 more)

### Community 44 - "audit/page.tsx"
Cohesion: 0.10
Nodes (21): AuditPage(), ClassesPage(), StudentsPage(), TeachersPage(), ActivityCategory, ActivityFilterBar(), ActivityFilterBarProps, CATEGORIES (+13 more)

### Community 45 - "app.dart"
Cohesion: 0.09
Nodes (30): build, createState, dispose, _handleNotificationClick, inferNotificationSeverity, _initializeFcm, initState, kSeverityInfo (+22 more)

### Community 46 - "package:smart_attendance_app/app/theme.dart"
Cohesion: 0.07
Nodes (26): File?, build, categories, LeaveCategorySelector, onSelected, selectedCategory, build, LeaveDocumentUploader (+18 more)

### Community 47 - "package:smart_attendance_app/shared/widgets/glass_button.dart"
Cohesion: 0.07
Nodes (25): Container, FormState, build, _buildChip, GeofenceDistanceMetrics, state, statusColor, build (+17 more)

### Community 48 - "auth_provider.dart"
Cohesion: 0.07
Nodes (27): dio, _extractDetail, mapDioError, normalizedBaseUrl, storage, AuthStatus, _authErrorSubscription, AuthNotifier (+19 more)

### Community 49 - "session_provider.dart"
Cohesion: 0.07
Nodes (29): _adjustPollInterval, _api, classId, className, _currentInterval, dispose, errorMessage, fetchSessions (+21 more)

### Community 50 - "api/admin.py"
Cohesion: 0.12
Nodes (27): app_core_rate_limit, export_audit_logs(), get_admin_stats(), get_audit_logs(), get_class_by_id(), get_classes(), get_classroom(), get_classrooms() (+19 more)

### Community 51 - "frontend/package.json"
Cohesion: 0.07
Nodes (26): eslintConfig, name, private, version, axios, clsx, eslint, eslint-config-next (+18 more)

### Community 52 - "attendance_provider.dart"
Cohesion: 0.07
Nodes (27): DateTimeFormatting, formattedDate, formattedDateTime, isSameDay, shortDate, StringFormatting, truncate, accuracy (+19 more)

### Community 53 - "attendance_repository.dart"
Cohesion: 0.08
Nodes (26): dart:io, analyzeAttendance, AttendanceRepository, AttendanceSubmitResult, confirmAttendance, getHistory, _hive, OfflineQueued (+18 more)

### Community 54 - "offline_sync_service.dart"
Cohesion: 0.08
Nodes (26): HiveService, NotificationService, NotificationsNotifier, _className, _connectivitySub, _deleteImageFile, _dio, dispose (+18 more)

### Community 55 - "result_config.dart"
Cohesion: 0.08
Nodes (24): background, color, error, face, flagged, icon, liveness, offline (+16 more)

### Community 56 - "history_calendar_tab.dart"
Cohesion: 0.08
Nodes (25): build, _buildDayNames, _buildDayRecords, _buildHeader, createState, _focusedMonth, HistoryCalendarTab, _HistoryCalendarTabState (+17 more)

### Community 57 - "glass_input.dart"
Cohesion: 0.08
Nodes (24): FocusNode?, build, controller, FlaggedNoteForm, isSubmitting, noteSubmitted, onSubmit, build (+16 more)

### Community 58 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, axios, class-variance-authority, clsx, @hookform/resolvers, leaflet, lucide-react, next (+18 more)

### Community 59 - "useBulkImportProcessor.ts"
Cohesion: 0.17
Nodes (18): getSampleCsv(), buildBatches(), buildBulkPayload(), BULK_BATCH_SIZE, BatchProgressItem, BulkImportEntityType, BulkImportSummary, ImportStage (+10 more)

### Community 60 - "attendance_utils.dart"
Cohesion: 0.08
Nodes (24): calculateHighestStreak, calculateStreak, canMiss, computeAttendanceNeeds, computeSubjectPct, computeWeekPresent, countAbsent, countFlagged (+16 more)

### Community 61 - "os"
Cohesion: 0.20
Nodes (18): asyncio, json, os, playwright_async_api, capture_screenshot(), run_cmd(), test_emulator_e2e(), capture_screenshot() (+10 more)

### Community 62 - "String?"
Cohesion: 0.08
Nodes (21): dart:ui, int?, build, isSecondaryGhost, onPrimaryPressed, onSecondaryPressed, primaryIcon, primaryLabel (+13 more)

### Community 63 - "glass_card.dart"
Cohesion: 0.08
Nodes (21): EdgeInsetsGeometry, AnimatedBackground, build, child, actions, AppScaffold, body, build (+13 more)

### Community 64 - "notification_api.dart"
Cohesion: 0.08
Nodes (23): category, createdAt, deleteNotification, _dio, fromJson, getNotifications, id, isRead (+15 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (23): bin, dev, setup, description, name, private, scripts, backend:setup (+15 more)

### Community 66 - "history_provider.dart"
Cohesion: 0.10
Nodes (21): data, errorMessage, fetch, HistoryNotifier, HistoryState, isLoading, notifier, _repo (+13 more)

### Community 67 - "test_api_admin.py"
Cohesion: 0.12
Nodes (16): app_schemas_master_data, app_schemas_pagination, AdminStatsResponse, BulkImportResponse, DepartmentResponse, PaginatedResponse, PaginationParams, BaseModel (+8 more)

### Community 68 - "@playwright/test"
Cohesion: 0.12
Nodes (6): ClassInput, StudentInput, TeacherInput, TeacherAnalyticsPage, TeacherHistoryPage, @playwright/test

### Community 69 - "enroll/page.tsx"
Cohesion: 0.13
Nodes (17): EnrollHeader(), EnrollHeaderProps, EnrollStudentFilters(), EnrollStudentFiltersProps, EnrollStudentRow(), EnrollStudentRowProps, frontend_src_types_index_studentresponse, ClassCreate (+9 more)

### Community 70 - "attendance_constants.dart"
Cohesion: 0.09
Nodes (21): kAttendanceTypeLocal, kAttendanceTypePush, kGoodScoreThreshold, kImagePickQuality, kMinBrightnessForPhoto, kMinSharpnessForPhoto, kNoteMaxChars, kOverallGoodPct (+13 more)

### Community 71 - "db_cleaner.py"
Cohesion: 0.12
Nodes (16): connect_redis(), disconnect_redis(), Service Health & Connectivity Checker Checks AWS S3 and PostgreSQL RDS…, _hash_password(), Production Database Reset & Wipe Script =======================================…, reset_production_database(), bcrypt, boto3 (+8 more)

### Community 72 - "GeofenceControls.tsx"
Cohesion: 0.11
Nodes (16): AnomalyCard(), AnomalyCardProps, getRiskLevel(), WEEKDAYS, downloadCsv(), GeofenceControls(), GeofenceControlsProps, AnomalyResult (+8 more)

### Community 73 - "offline_payload.dart"
Cohesion: 0.11
Nodes (19): @HiveType, HiveObject, hashCode, OfflineAttendancePayloadAdapter, operator, read, typeId, write (+11 more)

### Community 74 - "BasePage"
Cohesion: 0.13
Nodes (3): BasePage, TeacherClassesPage, TeacherLeavesPage

### Community 75 - "leaderboard.dart"
Cohesion: 0.12
Nodes (18): AppException, AuthException, message, NetworkException, ServerException, statusCode, toString, ValidationException (+10 more)

### Community 76 - "reset_password_screen.dart"
Cohesion: 0.13
Nodes (19): resetPasswordProvider, build, _buildInvalidCard, _buildLoadingCard, _buildResetForm, _confirmCtrl, createState, dispose (+11 more)

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

### Community 81 - "notification_tile.dart"
Cohesion: 0.11
Nodes (17): Map, LocalNotification, build, CalendarMonthGrid, focusedMonth, grouped, onSelectDate, selectedDate (+9 more)

### Community 82 - "class_session_card.dart"
Cohesion: 0.11
Nodes (18): ClassSession, build, _canMark, ClassSessionCard, _ClassSessionCardState, _countdownTimer, createState, didUpdateWidget (+10 more)

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

### Community 87 - "home_screen.dart"
Cohesion: 0.14
Nodes (17): sessionProvider, build, createState, didChangeAppLifecycleState, dispose, HomeScreen, _HomeScreenState, initState (+9 more)

### Community 88 - "leave_requests_screen.dart"
Cohesion: 0.12
Nodes (17): build, createState, dispose, _endDate, _isSubmitting, LeaveRequestsScreen, _LeaveRequestsScreenState, _notesController (+9 more)

### Community 89 - "reset_password_provider.dart"
Cohesion: 0.12
Nodes (16): AuthRepository, copyWith, email, errorMessage, isSubmitting, isSuccess, isValid, isVerifying (+8 more)

### Community 90 - "face_registration_screen.dart"
Cohesion: 0.14
Nodes (16): registrationProvider, build, _cameraController, _cameraError, _capturedPath, _capturePhoto, createState, dispose (+8 more)

### Community 91 - "smart_pass_screen.dart"
Cohesion: 0.15
Nodes (16): smartPassProvider, build, _buildErrorBanner, _buildManualInputSection, _buildScannerViewfinder, _buildSuccessCard, createState, dispose (+8 more)

### Community 92 - "conftest.py"
Cohesion: 0.19
Nodes (13): AwaitableMock, mock_academic_class(), mock_admin_user(), mock_redis(), mock_student_profile(), mock_student_user(), mock_teacher_profile(), mock_teacher_user() (+5 more)

### Community 93 - "form.tsx"
Cohesion: 0.18
Nodes (13): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+5 more)

### Community 94 - "test-fixtures.ts"
Cohesion: 0.45
Nodes (4): frontend_e2e_fixtures_test_fixtures_expect, generateYopmail(), test, TEST_CREDENTIALS

### Community 95 - "profile_settings_list.dart"
Cohesion: 0.13
Nodes (14): build, icon, iconColor, onTap, pendingCount, ProfileSettingsList, _SettingTile, subtitle (+6 more)

### Community 96 - "ai_orchestrator.py"
Cohesion: 0.14
Nodes (11): _load_liveness_model(), Any, cv2, deepface, huggingface_hub, numpy, shutil, tensorflow (+3 more)

### Community 97 - "device_change_dialog.dart"
Cohesion: 0.18
Nodes (13): dioProvider, deviceServiceProvider, build, createState, DeviceChangeDialog, _DeviceChangeDialogState, dispose, email (+5 more)

### Community 98 - "info_banner.dart"
Cohesion: 0.14
Nodes (13): actionLabel, _BannerConfig, BannerSeverity, build, color, customIcon, icon, InfoBanner (+5 more)

### Community 99 - "absentee_scanner.py"
Cohesion: 0.24
Nodes (11): app_services_absentee_scanner, scan_absentee_anomalies(), _detect_pattern(), Any, run_absentee_scan(), _run_isolation_forest(), asyncio, test_run_absentee_scan_detects_outliers() (+3 more)

### Community 100 - "AIOrchestrator"
Cohesion: 0.29
Nodes (3): AIOrchestrator, _load_and_crop(), ndarray

### Community 101 - "dropdown-menu.tsx"
Cohesion: 0.15
Nodes (12): DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuSeparator, DropdownMenuSub (+4 more)

### Community 102 - "app_notification.dart"
Cohesion: 0.15
Nodes (12): body, category, copyWith, fromMap, id, isRead, link, severity (+4 more)

### Community 104 - "leave_history_stats.dart"
Cohesion: 0.18
Nodes (10): build, _buildItem, LeaveHistoryStats, leaves, build, leave, LeaveHistoryTile, _statusColor (+2 more)

### Community 105 - "verification_preview_frame.dart"
Cohesion: 0.18
Nodes (10): bool get, double?, blurScore, brightnessScore, build, imagePath, isAnalyzingQuality, isPoorQuality (+2 more)

### Community 106 - "student_stats.dart"
Cohesion: 0.18
Nodes (10): absentCount, attendancePercentage, currentStreak, excusedCount, flaggedCount, fromJson, highestStreak, presentCount (+2 more)

### Community 107 - "verification_camera_mixin.dart"
Cohesion: 0.18
Nodes (10): blurScore, brightnessScore, camera, cameraError, disposeCamera, initCamera, isAnalyzingQuality, isCameraReady (+2 more)

### Community 108 - "manifest.json"
Cohesion: 0.18
Nodes (10): background_color, description, display, icons, name, orientation, prefer_related_applications, short_name (+2 more)

### Community 109 - "resolve_frontend_url"
Cohesion: 0.33
Nodes (5): Request, Dynamically resolves the frontend base URL for email links, redirects, and…, resolve_frontend_url(), EmailService, Any

### Community 111 - "PageObjects"
Cohesion: 0.20
Nodes (3): PageObjects, TeacherDeviceChangesPage, TeacherProfilePage

### Community 112 - "manual/page.tsx"
Cohesion: 0.24
Nodes (7): ManualAttendanceStats(), ManualAttendanceStatsProps, ManualAttendanceStudentRow(), ManualAttendanceStudentRowProps, AttendanceStatus, frontend_src_types_index_bulkmarkrequest, SessionAttendanceResponse

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
Cohesion: 0.32
Nodes (3): Gets the system configuration. If it doesn't exist, creates a default one., SystemConfigRepository, SystemConfiguration

### Community 121 - "dart:async"
Cohesion: 0.25
Nodes (7): dart:async, AppEvents, _authErrorController, authErrorStream, broadcastAuthError, static final StreamController, static Stream

### Community 124 - "SessionSimulationService"
Cohesion: 0.39
Nodes (5): Any, Acquires auth tokens for faculty members to drive session endpoints., Categorizes students into Exemplary (~60%), Irregular (~25%), and Defaulter…, Runs the multi-day attendance simulation across classes., SessionSimulationService

### Community 125 - "Agent Guidelines & Engineering Standards"
Cohesion: 0.29
Nodes (6): 1. Environment & Configuration Sync, 2. No Hardcoding, 3. No Patches on Patches (Clean Code First), 4. File Structure & Quality Rules, 5. Version Control & Automated Delivery, Agent Guidelines & Engineering Standards

### Community 126 - "test_service_admin.py"
Cohesion: 0.38
Nodes (6): app_schemas_admin, app_services_admin_service, asyncio, test_admin_service_create_student(), test_admin_service_create_teacher(), test_admin_service_enroll_students()

### Community 127 - "global_exception_handler"
Cohesion: 0.38
Nodes (7): global_exception_handler(), Exception, Request, validation_exception_handler(), exception_handler, JSONResponse, RequestValidationError

### Community 134 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, start, test, test:watch

### Community 136 - "test_teacher_smart_pass_playwright.mjs"
Cohesion: 0.29
Nodes (4): ref_fs, ref_path, ref_playwright, @vitejs/plugin-react

### Community 137 - "adb_mobile_screen_tester.py"
Cohesion: 0.71
Nodes (6): adb(), capture(), keyevent(), main(), tap(), text()

### Community 138 - ".generate_student_specs"
Cohesion: 0.33
Nodes (4): Any, Builds student specification objects with PRNs and @yopmail.com emails., Creates cohorts for Division A and Division B in CSE., Enrolls students into appropriate theory sections and practical lab batches.

### Community 139 - "Settings"
Cohesion: 0.33
Nodes (3): field_validator, Settings, BaseSettings

### Community 140 - "LeaveRequestCreate"
Cohesion: 0.40
Nodes (3): LeaveRequestCreate, field_validator, date

### Community 141 - "LogEvent"
Cohesion: 0.47
Nodes (3): LogEvent, BaseModel, field_validator

### Community 150 - "system_configuration.dart"
Cohesion: 0.33
Nodes (5): fromJson, isAiBackgroundValidationEnabled, isFaceRecognitionEnabled, isGpsVerificationEnabled, toJson

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2002 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **53 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminService` connect `AdminService` to `typing`, `test_api_admin.py`, `attendance_service.py`, `api/student.py`, `StudentRepository`, `schemas/admin.py`, `api/auth.py`, `api/admin.py`, `test_service_admin.py`, `_handle_generic_err`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `getApiErrorMessage`, `api.ts`, `enroll/page.tsx`, `dropdown-menu.tsx`, `reset-password/page.tsx`, `types/index.ts`, `GeofenceControls.tsx`, `cn`, `useAuthStore`, `audit/page.tsx`, `GeofenceMap.tsx`, `manual/page.tsx`, `button.tsx`, `frontend/package.json`, `AttendanceTrendChart.tsx`, `useBulkImportProcessor.ts`, `form.tsx`, `DashboardKpiStrip.tsx`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `@playwright/test` connect `@playwright/test` to `AdminClassroomsPage`, `AdminDepartmentsPage`, `AdminDesignationsPage`, `AdminSubjectsPage`, `LoginPage`, `AdminAuditPage`, `AdminOverviewPage`, `AdminScannerPage`, `BulkImportComponent`, `ForgotPasswordPage`, `ResetPasswordPage`, `TeacherOverviewPage`, `TeacherReviewPage`, `frontend/package.json`, `BasePage`, `test-fixtures.ts`, `PageObjects`, `AdminVerificationSettingsPage`, `TeacherSessionsPage`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Are the 59 inferred relationships involving `AdminService` (e.g. with `assign_teacher()` and `bulk_create_classes()`) actually correct?**
  _`AdminService` has 59 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ClassInput`, `StudentInput`, `TeacherInput` to the rest of the system?**
  _1436 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `api/teacher.py` be split into smaller, more focused modules?**
  _Cohesion score 0.05471226021684737 - nodes in this community are weakly interconnected._
- **Should `getApiErrorMessage` be split into smaller, more focused modules?**
  _Cohesion score 0.034209134191500616 - nodes in this community are weakly interconnected._