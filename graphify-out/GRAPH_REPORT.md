# Graph Report - Smart Attandance System  (2026-09-23)

## Corpus Check
- 508 files · ~675,896 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 30 file(s) not represented in the graph (top: (none) 8, .xml 7, .example 5)

## Summary
- 4246 nodes · 9595 edges · 191 communities (145 shown, 46 thin omitted)
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
- history_calendar_tab.dart
- attendance_service.py
- api/student.py
- reset-password/page.tsx
- audit/page.tsx
- react
- cn
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
- package:smart_attendance_app/shared/widgets/glass_button.dart
- notification_service.dart
- List
- geofence_verification_provider.dart
- StudentRepository
- login_screen.dart
- _handle_generic_err
- Color
- student_api.dart
- class_session_card.dart
- websocket_service.dart
- router.dart
- verification_screen.dart
- history_screen.dart
- package:flutter/material.dart
- analytics/page.tsx
- typing
- attendance.dart
- schemas/admin.py
- sessions/page.tsx
- app.dart
- geofence_radar_indicator.dart
- secure_storage.dart
- auth_provider.dart
- session_provider.dart
- api/admin.py
- frontend/package.json
- app_api_dependencies
- attendance_repository.dart
- auth_repository.dart
- result_config.dart
- preferences_provider.dart
- glass_input.dart
- dependencies
- BulkImportModal.tsx
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
- get_redis
- SessionService
- hive_service.dart
- BasePage
- exceptions.dart
- AttendanceRepository
- GamificationService
- devDependencies
- GeofenceMap.tsx
- compilerOptions
- reset_password_screen.dart
- BroadcastNotificationModal.tsx
- 🚀 Key Features
- master_data.py
- smart_pass.dart
- user.dart
- location_service.dart
- leave_requests_screen.dart
- verification_preview_frame.dart
- home_screen.dart
- smart_pass_screen.dart
- conftest.py
- form.tsx
- test-fixtures.ts
- face_registration_screen.dart
- adb_mobile_screen_tester.py
- admin/dashboard/page.tsx
- YopmailClient
- run_absentee_scan
- AIOrchestrator
- dropdown-menu.tsx
- smart_pass_provider.dart
- ConnectionManager
- offline_sync_service.dart
- AdminSetupService
- student_stats.dart
- verification_step_content.dart
- manifest.json
- resolve_frontend_url
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
- models.ts
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
- permission_service.dart
- ref_playwright
- summary_reporter.py
- Settings
- scanner/page.tsx
- main.py
- SeedingConfig
- AdminAuditPage
- AdminOverviewPage
- AdminScannerPage
- BulkImportComponent
- ForgotPasswordPage
- ResetPasswordPage
- TeacherOverviewPage
- history_list_tab.dart
- EdgeWorkflowsService
- CommandPaletteModal.tsx
- login_error_banner.dart
- verification_camera_mixin.dart
- history/page.tsx
- authStore.ts
- WebSocketClient
- MobileE2ERunner
- middleware.ts
- logger.ts
- location_exceptions.dart
- app/layout.tsx
- FlutterActivity
- frontend/README.md
- streak_counter.dart
- smart_attendance_app
- adb_login_and_capture.py
- rules/graphify.md
- workflows/graphify.md
- backend/README.md
- DeepInteractiveRunner
- postcss.config.mjs
- global_exception_handler
- LogEvent
- ref_path
- seed/__init__.py
- AttendanceRepository
- DateTime?
- Exception
- LeaderboardResponse?
- T
- DashboardKpiStrip.tsx
- vitest
- LeaveRequestApprove
- NotificationItemRow.tsx

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

## Communities (191 total, 46 thin omitted)

### Community 0 - "test_api_teacher.py"
Cohesion: 0.12
Nodes (31): app_repositories_geofence_repo, AbsentStudentItem, AcademicClassWithGeofenceResponse, AttendanceManualOverride, AttendanceMatrixResponse, AttendanceMatrixSessionItem, AttendanceMatrixStudentItem, ClassAttendanceExportItem (+23 more)

### Community 1 - "getApiErrorMessage"
Cohesion: 0.04
Nodes (86): ForgotPasswordPage(), handleResend(), onSubmit(), LoginPage(), handleSuccessRedirect(), onSubmit(), OnboardingContent(), checkToken() (+78 more)

### Community 2 - "api.ts"
Cohesion: 0.11
Nodes (47): SystemConfig, TeacherFormProfile(), TeacherFormProfileProps, ManualAttendanceStats(), ManualAttendanceStatsProps, ForceChangePasswordData, ForceChangePasswordModalProps, forceChangePasswordSchema (+39 more)

### Community 3 - "package:flutter_riverpod/flutter_riverpod.dart"
Cohesion: 0.06
Nodes (43): ConsumerWidget, notificationsLoadingProvider, notificationsProvider, pendingCountProvider, leaderboardProvider, build, _buildBody, _buildUserSummaryCard (+35 more)

### Community 4 - "history_calendar_tab.dart"
Cohesion: 0.03
Nodes (65): AttendanceHistoryItem, AttendanceHistoryResponse, AnalyticsKpiOverview, build, data, target, AnalyticsSubjectGoals, build (+57 more)

### Community 5 - "attendance_service.py"
Cohesion: 0.07
Nodes (43): app_api_ws, app_services_ai_orchestrator, app_utils_geofencing, RoleChecker, create_access_token(), decode_access_token(), hash_password(), Any (+35 more)

### Community 6 - "api/student.py"
Cohesion: 0.09
Nodes (51): app_schemas_attendance, app_schemas_leave, app_schemas_student, app_services_student_service, get_current_student(), Student, analyze_attendance(), confirm_attendance() (+43 more)

### Community 7 - "reset-password/page.tsx"
Cohesion: 0.06
Nodes (37): VerifyData, VerifyData, EditTeacherFormFields(), EditTeacherFormFieldsProps, PasswordRequirementsChecklist(), PasswordRequirementsChecklistProps, usePasswordRules(), ResetPasswordStatusCard() (+29 more)

### Community 8 - "audit/page.tsx"
Cohesion: 0.10
Nodes (22): AuditPage(), ClassesPage(), StudentsPage(), TeachersPage(), ActivityDetailModal(), ActivityDetailModalProps, ActivityCategory, ActivityFilterBar() (+14 more)

### Community 9 - "react"
Cohesion: 0.06
Nodes (65): nextConfig, classColumns, EnrollHeader(), EnrollHeaderProps, EnrollStudentRow(), EnrollStudentRowProps, colorVariants, studentColumns (+57 more)

### Community 10 - "cn"
Cohesion: 0.05
Nodes (55): ManualAttendanceStudentRow(), ManualAttendanceStudentRowProps, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle (+47 more)

### Community 11 - "useAuthStore"
Cohesion: 0.29
Nodes (9): DashboardLayout(), CommandPaletteModal(), Header(), HeaderProps, NotificationPopover(), NotificationPopoverProps, Sidebar(), useNotifications() (+1 more)

### Community 12 - "api/auth.py"
Cohesion: 0.10
Nodes (39): app_services_auth_service, app_services_device_change_service, app_services_system_config_service, change_password(), complete_onboarding(), forgot_password(), get_me(), get_public_system_config() (+31 more)

### Community 13 - "verification_ai_review_card.dart"
Cohesion: 0.05
Nodes (42): Animation, AnimationController, AttendanceAnalysisResult, animation, build, hint, icon, label (+34 more)

### Community 14 - "api/teacher.py"
Cohesion: 0.11
Nodes (37): app_services_attendance_service, app_services_leave_service, app_services_session_service, approve_device_change(), approve_leave(), bulk_mark_attendance(), export_class_attendance(), get_absent_students() (+29 more)

### Community 15 - "setup.mjs"
Cohesion: 0.07
Nodes (45): ref_node_child_process, ref_node_crypto, ref_node_fs, ref_node_path, ref_node_url, checkVenvPythonVersion(), createPython311Venv(), ensureBackendDirectories() (+37 more)

### Community 16 - "classes/[id]/edit/page.tsx"
Cohesion: 0.09
Nodes (28): SEMESTER_OPTIONS, EnrollStudentFilters(), EnrollStudentFiltersProps, GENDER_OPTIONS, SEMESTER_OPTIONS, StudentFormFields(), StudentFormFieldsProps, EditStudentFormFields() (+20 more)

### Community 17 - "seed_and_simulate.py"
Cohesion: 0.14
Nodes (17): argparse, httpx, playwright_async_api, random, re, rich_console, rich_progress, Admin Master Data Setup Automation. Configures institutional master data: -… (+9 more)

### Community 18 - "test_api_auth.py"
Cohesion: 0.12
Nodes (8): app_schemas_system_config, patch, update_system_config(), BaseModel, SystemConfigResponse, SystemConfigUpdate, test_get_public_system_config(), test_logout_revokes_token()

### Community 19 - "main.dart"
Cohesion: 0.08
Nodes (23): @pragma, dart:async, HttpOverrides, AppEvents, _authErrorController, authErrorStream, broadcastAuthError, addNotification (+15 more)

### Community 20 - "AdminService"
Cohesion: 0.06
Nodes (12): generate_temporary_password(), ClassResponse, StudentResponse, TeacherResponse, AdminService, test_create_class_and_assign_teacher(), test_create_student_admin(), test_generate_temporary_password() (+4 more)

### Community 21 - "package:smart_attendance_app/app/theme.dart"
Cohesion: 0.05
Nodes (46): build, controller, FlaggedNoteForm, isSubmitting, noteSubmitted, onSubmit, build, GeofenceStatusCard (+38 more)

### Community 22 - "theme.dart"
Cohesion: 0.04
Nodes (45): accentAmber, accentEmerald, accentPink, accentTeal, baseText, bgCanvas, bgPrimary, bgSecondary (+37 more)

### Community 23 - "preferences_service.dart"
Cohesion: 0.08
Nodes (24): getAttendanceTarget, getLowAttendanceThreshold, getNotifyClassStart, getNotifyLowAttendance, getNotifySyncDone, getNotifyWindowOpen, isFirstCameraUse, _keyAttendanceTarget (+16 more)

### Community 24 - "notifications.py"
Cohesion: 0.05
Nodes (58): app_schemas_common, app_schemas_health, app_schemas_notification, app_services_notification_service, broadcast_notification(), list_notifications(), mark_all_read(), mark_read() (+50 more)

### Community 25 - "package:smart_attendance_app/shared/widgets/glass_button.dart"
Cohesion: 0.05
Nodes (39): Container, FormState, VerificationStep, build, build, isSecondaryGhost, onPrimaryPressed, onSecondaryPressed (+31 more)

### Community 26 - "notification_service.dart"
Cohesion: 0.08
Nodes (23): WebSocketService, addNotification, _api, _box, clear, clearAll, deleteNotification, dispose (+15 more)

### Community 27 - "List"
Cohesion: 0.04
Nodes (49): int?, List, NotificationsNotifier, currentStreak, fromJson, leaderboard, LeaderboardEntry, LeaderboardResponse (+41 more)

### Community 28 - "geofence_verification_provider.dart"
Cohesion: 0.12
Nodes (16): AutoDisposeNotifier, accuracy, build, copyWith, distanceMeters, errorMessage, GeofenceVerificationNotifier, GeofenceVerificationState (+8 more)

### Community 29 - "StudentRepository"
Cohesion: 0.07
Nodes (13): AcademicClass, ClassRepository, EnrollmentRepository, GeofenceRepository, datetime, SessionRepository, Student, StudentRepository (+5 more)

### Community 30 - "login_screen.dart"
Cohesion: 0.09
Nodes (27): class, authProvider, build, _confirmPasswordController, createState, dispose, ForceChangePasswordScreen, _ForceChangePasswordScreenState (+19 more)

### Community 31 - "_handle_generic_err"
Cohesion: 0.17
Nodes (37): assign_teacher(), bulk_create_classes(), bulk_create_classrooms(), bulk_create_departments(), bulk_create_designations(), bulk_create_students(), bulk_create_subjects(), bulk_create_teachers() (+29 more)

### Community 32 - "Color"
Cohesion: 0.06
Nodes (31): Color, build, goodThreshold, label, value, VerificationQualityBar, build, color (+23 more)

### Community 33 - "student_api.dart"
Cohesion: 0.06
Nodes (34): LeaderboardEntry, analyzeAttendance, confirmAttendance, createLeaveRequest, _dio, getLeaderboard, getMyAttendance, getMyClasses (+26 more)

### Community 34 - "class_session_card.dart"
Cohesion: 0.05
Nodes (41): Duration?, defineUrl, envUrl, kConnectTimeout, kGeofenceGraceMeters, kGpsAveragingSamples, kGpsTimeoutSeconds, kHiveBoxConfig (+33 more)

### Community 35 - "websocket_service.dart"
Cohesion: 0.06
Nodes (30): authState, _channel, connect, disconnect, dispose, _maxReconnectAttempts, _messageController, messageStream (+22 more)

### Community 36 - "router.dart"
Cohesion: 0.06
Nodes (34): ChangeNotifier, GoRouter, notifier, notify, rootNavigatorKey, RouterNotifier, routerNotifierProvider, shellNavigatorKey (+26 more)

### Community 37 - "verification_screen.dart"
Cohesion: 0.09
Nodes (32): ConsumerState, ConsumerStatefulWidget, hiveServiceProvider, preferencesServiceProvider, attendanceVerificationProvider, geofenceVerificationProvider, capturePhoto, VerificationCameraMixin (+24 more)

### Community 38 - "history_screen.dart"
Cohesion: 0.09
Nodes (27): AnalyticsScreen, _AnalyticsScreenState, build, createState, initState, historyProvider, build, _buildTabBtn (+19 more)

### Community 39 - "package:flutter/material.dart"
Cohesion: 0.07
Nodes (28): slideRightPage, slideUpPage, build, child, ShellScaffold, _tabPaths, LocalNotification, build (+20 more)

### Community 40 - "analytics/page.tsx"
Cohesion: 0.06
Nodes (39): ActiveTab, TeacherClassesPage(), LeaveDocumentModal(), LeaveDocumentModalProps, LeaveReviewDialog(), LeaveReviewDialogProps, AnalyticsOverviewTab(), AnalyticsOverviewTabProps (+31 more)

### Community 41 - "typing"
Cohesion: 0.13
Nodes (16): app_db_client, check_database(), check_redis(), check_s3(), get_health_status(), get, Response, AttendanceAnalyzeResponse (+8 more)

### Community 42 - "attendance.dart"
Cohesion: 0.06
Nodes (33): activeSessionId, attendanceId, backgroundScore, classId, className, createdAt, faceScore, finalAiScore (+25 more)

### Community 43 - "schemas/admin.py"
Cohesion: 0.11
Nodes (25): AbsenteeAnomalyItem, AssignTeacherRequest, AuditLogResponse, ClassBulkCreateRequest, ClassBulkItem, ClassCreate, ClassroomBulkCreateRequest, ClassroomBulkItem (+17 more)

### Community 44 - "sessions/page.tsx"
Cohesion: 0.13
Nodes (17): ActiveSessionBanner(), ActiveSessionBannerProps, TeacherDashboardPage(), ActiveSessionsCard(), ActiveSessionsCardProps, PastSessionsTable(), PastSessionsTableProps, SmartPassGeneratorModal() (+9 more)

### Community 45 - "app.dart"
Cohesion: 0.11
Nodes (24): build, createState, dispose, _handleNotificationClick, inferNotificationSeverity, _initializeFcm, initState, kSeverityInfo (+16 more)

### Community 46 - "geofence_radar_indicator.dart"
Cohesion: 0.09
Nodes (22): CustomPainter, GeofenceStatus, build, _buildChip, GeofenceDistanceMetrics, state, statusColor, build (+14 more)

### Community 47 - "secure_storage.dart"
Cohesion: 0.12
Nodes (15): FlutterSecureStorage, describeDistance, GeofenceCalculator, isWithinGeofence, clearAll, getDeviceUUID, getRole, getToken (+7 more)

### Community 48 - "auth_provider.dart"
Cohesion: 0.05
Nodes (41): dio, dioProvider, _extractDetail, mapDioError, normalizedBaseUrl, storage, deviceServiceProvider, AuthStatus (+33 more)

### Community 49 - "session_provider.dart"
Cohesion: 0.06
Nodes (33): computeRouterRedirect, null, _adjustPollInterval, _api, classId, className, _currentInterval, dispose (+25 more)

### Community 50 - "api/admin.py"
Cohesion: 0.16
Nodes (21): app_core_rate_limit, export_audit_logs(), get_admin_stats(), get_audit_logs(), get_class_by_id(), get_classes(), get_classroom(), get_classrooms() (+13 more)

### Community 51 - "frontend/package.json"
Cohesion: 0.07
Nodes (25): eslintConfig, name, private, version, axios, clsx, eslint, eslint-config-next (+17 more)

### Community 52 - "app_api_dependencies"
Cohesion: 0.21
Nodes (13): app_api_dependencies, app_schemas_search, app_services_search_service, global_search(), get, User, GlobalSearchResponse, BaseModel (+5 more)

### Community 53 - "attendance_repository.dart"
Cohesion: 0.08
Nodes (26): dart:io, analyzeAttendance, AttendanceRepository, AttendanceSubmitResult, confirmAttendance, getHistory, _hive, OfflineQueued (+18 more)

### Community 54 - "auth_repository.dart"
Cohesion: 0.10
Nodes (19): DeviceInfoPlugin, _deviceInfo, DeviceService, getDeviceUUID, _secureStorage, SecureStorageService, _authApi, authRepositoryProvider (+11 more)

### Community 55 - "result_config.dart"
Cohesion: 0.08
Nodes (24): background, color, error, face, flagged, icon, liveness, offline (+16 more)

### Community 56 - "preferences_provider.dart"
Cohesion: 0.11
Nodes (19): PreferencesService, attendanceTarget, copyWith, isLoading, _load, lowAttendanceThreshold, notifyClassStart, notifyLowAttendance (+11 more)

### Community 57 - "glass_input.dart"
Cohesion: 0.06
Nodes (32): FocusNode?, Map, build, CalendarMonthGrid, focusedMonth, grouped, onSelectDate, selectedDate (+24 more)

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
Cohesion: 0.07
Nodes (36): asyncio, _load_liveness_model(), Any, Service Health & Connectivity Checker Checks AWS S3 and PostgreSQL RDS…, boto3, botocore_config, botocore_exceptions, cv2 (+28 more)

### Community 62 - "history_provider.dart"
Cohesion: 0.09
Nodes (23): PendingCountNotifier, data, errorMessage, fetch, HistoryNotifier, HistoryState, isLoading, notifier (+15 more)

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

### Community 69 - "flagged_detail_screen.dart"
Cohesion: 0.05
Nodes (45): attendanceRepositoryProvider, attendanceId, build, createState, dispose, FlaggedDetailScreen, _FlaggedDetailScreenState, initState (+37 more)

### Community 70 - "attendance_constants.dart"
Cohesion: 0.09
Nodes (21): kAttendanceTypeLocal, kAttendanceTypePush, kGoodScoreThreshold, kImagePickQuality, kMinBrightnessForPhoto, kMinSharpnessForPhoto, kNoteMaxChars, kOverallGoodPct (+13 more)

### Community 71 - "get_redis"
Cohesion: 0.06
Nodes (47): aiosmtplib, app_core_config, app_core_logging_config, app_core_security, app_core_url_resolver, app_db_redis, app_repositories_attendance_repo, app_repositories_class_repo (+39 more)

### Community 72 - "SessionService"
Cohesion: 0.22
Nodes (7): start_session(), SessionResponse, SessionStart, SessionScheduler, Mark session as inactive, delete from Redis, and mark all unsubmitted students…, SessionService, test_start_and_stop_session()

### Community 73 - "hive_service.dart"
Cohesion: 0.06
Nodes (35): @HiveType, Box, dart:convert, HiveObject, hashCode, OfflineAttendancePayloadAdapter, operator, read (+27 more)

### Community 74 - "BasePage"
Cohesion: 0.13
Nodes (3): BasePage, TeacherClassesPage, TeacherLeavesPage

### Community 75 - "exceptions.dart"
Cohesion: 0.33
Nodes (8): AppException, AuthException, message, NetworkException, ServerException, statusCode, toString, ValidationException

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

### Community 81 - "reset_password_screen.dart"
Cohesion: 0.13
Nodes (19): resetPasswordProvider, build, _buildInvalidCard, _buildLoadingCard, _buildResetForm, _confirmCtrl, createState, dispose (+11 more)

### Community 82 - "BroadcastNotificationModal.tsx"
Cohesion: 0.20
Nodes (11): BroadcastNotificationModal(), BroadcastNotificationModalProps, INITIAL_FORM, NotificationTabs(), NotificationTabsProps, TABS, NotificationBroadcastCreate, NotificationCategory (+3 more)

### Community 83 - "🚀 Key Features"
Cohesion: 0.11
Nodes (18): 1. Multi-Layered AI Verification, 1. Prerequisites, 2. Dynamic Location & Geofencing, 2. One-Command Setup, 3. Hardware Device Binding (Anti-Proxy), 3. Running Development Servers, 4. Offline Smart Pass (Encrypted Fallback), 5. Automated Outlier Scanning & Absentee Analytics (+10 more)

### Community 84 - "master_data.py"
Cohesion: 0.20
Nodes (11): ClassroomCreate, ClassroomResponse, ClassroomUpdate, DesignationCreate, DesignationResponse, DesignationUpdate, BaseModel, field_validator (+3 more)

### Community 85 - "smart_pass.dart"
Cohesion: 0.12
Nodes (15): Duration get, attendanceStatus, className, enrollmentNumber, expiresAt, fromJson, isExpired, markedAt (+7 more)

### Community 86 - "user.dart"
Cohesion: 0.06
Nodes (29): body, category, copyWith, fromMap, id, isRead, link, severity (+21 more)

### Community 87 - "location_service.dart"
Cohesion: 0.13
Nodes (15): dart:math, describeDistance, ensurePermissionsGranted, getAveragedPosition, getHighlyAccuratePosition, isWithinGeofence, LocationService, currentLocationProvider (+7 more)

### Community 88 - "leave_requests_screen.dart"
Cohesion: 0.08
Nodes (24): File?, build, createState, dispose, _endDate, _isSubmitting, LeaveRequestsScreen, _LeaveRequestsScreenState (+16 more)

### Community 89 - "verification_preview_frame.dart"
Cohesion: 0.09
Nodes (20): bool get, double?, blurScore, brightnessScore, build, imagePath, isAnalyzingQuality, isPoorQuality (+12 more)

### Community 90 - "home_screen.dart"
Cohesion: 0.15
Nodes (16): sessionProvider, build, createState, didChangeAppLifecycleState, dispose, HomeScreen, _HomeScreenState, initState (+8 more)

### Community 91 - "smart_pass_screen.dart"
Cohesion: 0.09
Nodes (27): permissionServiceProvider, smartPassProvider, build, _buildErrorBanner, _buildLiveScanner, _buildPermissionCard, _buildSuccessCard, _checkingPermission (+19 more)

### Community 92 - "conftest.py"
Cohesion: 0.11
Nodes (23): app_services_teacher_service, BulkAttendanceRecord, BulkMarkRequest, AwaitableMock, mock_academic_class(), mock_admin_user(), mock_redis(), mock_student_profile() (+15 more)

### Community 93 - "form.tsx"
Cohesion: 0.18
Nodes (13): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+5 more)

### Community 94 - "test-fixtures.ts"
Cohesion: 0.45
Nodes (4): frontend_e2e_fixtures_test_fixtures_expect, generateYopmail(), test, TEST_CREDENTIALS

### Community 95 - "face_registration_screen.dart"
Cohesion: 0.14
Nodes (16): registrationProvider, build, _cameraController, _cameraError, _capturedPath, _capturePhoto, createState, dispose (+8 more)

### Community 96 - "adb_mobile_screen_tester.py"
Cohesion: 0.71
Nodes (6): adb(), capture(), keyevent(), main(), tap(), text()

### Community 97 - "admin/dashboard/page.tsx"
Cohesion: 0.21
Nodes (11): AdminDashboardPage(), AdminQuickActions(), QuickActionItem, formatEventName(), formatRelativeTime(), SystemEventsCard(), SystemNodesCard(), SystemNodesCardProps (+3 more)

### Community 98 - "YopmailClient"
Cohesion: 0.14
Nodes (10): BrowserContext, Page, Any, AsyncClient, Provisions faculty accounts with @yopmail.com emails and verifies them., Creates academic classes and links teachers and rooms., TeacherOnboardingService, Automates Yopmail web UI to extract the onboarding/reset token. (+2 more)

### Community 99 - "run_absentee_scan"
Cohesion: 0.31
Nodes (9): app_services_absentee_scanner, scan_absentee_anomalies(), _detect_pattern(), Any, run_absentee_scan(), _run_isolation_forest(), asyncio, test_run_absentee_scan_detects_outliers() (+1 more)

### Community 100 - "AIOrchestrator"
Cohesion: 0.29
Nodes (3): AIOrchestrator, _load_and_crop(), ndarray

### Community 101 - "dropdown-menu.tsx"
Cohesion: 0.15
Nodes (12): DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuSeparator, DropdownMenuSub (+4 more)

### Community 102 - "smart_pass_provider.dart"
Cohesion: 0.14
Nodes (14): SmartPass, SmartPassScanResult, _api, copyWith, _deviceService, errorMessage, isLoading, _locationService (+6 more)

### Community 104 - "offline_sync_service.dart"
Cohesion: 0.05
Nodes (39): Dio, AuthApi, authApiProvider, changePassword, _dio, getProfile, login, logout (+31 more)

### Community 105 - "AdminSetupService"
Cohesion: 0.18
Nodes (8): AdminSetupService, Any, AsyncClient, Creates academic subjects (Theory & Practical)., Creates classroom and laboratory venues., Logs into admin account and acquires JWT access token., Creates institutional departments., Creates academic designations.

### Community 106 - "student_stats.dart"
Cohesion: 0.18
Nodes (10): absentCount, attendancePercentage, currentStreak, excusedCount, flaggedCount, fromJson, highestStreak, presentCount (+2 more)

### Community 107 - "verification_step_content.dart"
Cohesion: 0.05
Nodes (44): CameraController?, dart:ui, build, camera, cameraError, isCameraReady, onDismissTips, onRetryCamera (+36 more)

### Community 108 - "manifest.json"
Cohesion: 0.18
Nodes (10): background_color, description, display, icons, name, orientation, prefer_related_applications, short_name (+2 more)

### Community 109 - "resolve_frontend_url"
Cohesion: 0.33
Nodes (5): Request, Dynamically resolves the frontend base URL for email links, redirects, and…, resolve_frontend_url(), EmailService, Any

### Community 111 - "PageObjects"
Cohesion: 0.13
Nodes (4): PageObjects, TeacherDeviceChangesPage, TeacherProfilePage, TeacherReviewPage

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

### Community 121 - "models.ts"
Cohesion: 0.20
Nodes (11): DeviceChangesPage(), DeviceChangeTable(), DeviceChangeTableProps, ClassCreate, ClassroomCreate, DepartmentCreate, DesignationCreate, DeviceChangeRequest (+3 more)

### Community 124 - "SessionSimulationService"
Cohesion: 0.26
Nodes (7): Any, AsyncClient, Runs the multi-day attendance simulation across classes with live progress., Acquires auth tokens for faculty members to drive session endpoints., Categorizes students into Exemplary (~60%), Irregular (~25%), and Defaulter…, Simulates 1 class session: start -> bulk mark -> stop., SessionSimulationService

### Community 125 - "Agent Guidelines & Engineering Standards"
Cohesion: 0.29
Nodes (6): 1. Environment & Configuration Sync, 2. No Hardcoding, 3. No Patches on Patches (Clean Code First), 4. File Structure & Quality Rules, 5. Version Control & Automated Delivery, Agent Guidelines & Engineering Standards

### Community 126 - "test_service_admin.py"
Cohesion: 0.14
Nodes (10): app_schemas_admin, app_services_admin_service, field_validator, StudentCreate, field_validator, TeacherCreate, asyncio, test_admin_service_create_student() (+2 more)

### Community 127 - "StudentEnrollmentService"
Cohesion: 0.27
Nodes (6): Any, AsyncClient, Builds student specification objects with PRNs and @yopmail.com emails., Creates cohorts for Division A and Division B in CSE., Enrolls students into appropriate theory sections and practical lab batches., StudentEnrollmentService

### Community 134 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, start, test, test:watch

### Community 135 - "StatelessWidget"
Cohesion: 0.03
Nodes (59): IconData?, build, icon, iconColor, onTap, pendingCount, ProfileSettingsList, _SettingTile (+51 more)

### Community 136 - "permission_service.dart"
Cohesion: 0.15
Nodes (12): LocationPermission, checkAttendancePermissions, hasLocationAccess, isLocationServiceEnabled, isPermanentlyDenied, locationPermission, message, openAppSettings (+4 more)

### Community 138 - "summary_reporter.py"
Cohesion: 0.25
Nodes (7): rich, rich_panel, rich_table, print_final_summary(), Any, Summary Reporting & Terminal Dashboard Module. Renders final summary tables and…, Prints beautiful formatted terminal summary tables using rich.

### Community 139 - "Settings"
Cohesion: 0.33
Nodes (3): field_validator, Settings, BaseSettings

### Community 140 - "scanner/page.tsx"
Cohesion: 0.26
Nodes (8): AnomalyCard(), AnomalyCardProps, getRiskLevel(), WEEKDAYS, ScannerControls(), ScannerControlsProps, AnomalyResult, frontend_src_types_index_anomalyresult

### Community 141 - "main.py"
Cohesion: 0.09
Nodes (25): app_api, app_middleware_request_logging, app_services_s3_service, app_services_scheduler, connect_db(), disconnect_db(), connect_redis(), disconnect_redis() (+17 more)

### Community 142 - "SeedingConfig"
Cohesion: 0.23
Nodes (9): main(), run_pipeline(), BaseModel, SeedingConfig, _validate_local_url(), clean_database(), _hash_password(), Database Cleaner for Local Test Environment. Provides clean slate wiping for… (+1 more)

### Community 150 - "history_list_tab.dart"
Cohesion: 0.06
Nodes (36): build, createState, desc, _expanded, FlaggedTroubleshootFaq, _FlaggedTroubleshootFaqState, icon, _TipItem (+28 more)

### Community 151 - "EdgeWorkflowsService"
Cohesion: 0.29
Nodes (5): EdgeWorkflowsService, Any, AsyncClient, Simulates student device changes and teacher resolution., Simulates student leave submissions and teacher review queue processing.

### Community 152 - "CommandPaletteModal.tsx"
Cohesion: 0.31
Nodes (5): getCommandIcon(), CommandPaletteModalProps, useDebounce(), GlobalSearchResponse, SearchResultItem

### Community 153 - "login_error_banner.dart"
Cohesion: 0.25
Nodes (7): build, email, errorMessage, isFormValid, LoginErrorBanner, password, package:smart_attendance_app/features/auth/widgets/device_change_dialog.dart

### Community 154 - "verification_camera_mixin.dart"
Cohesion: 0.11
Nodes (16): blurScore, brightnessScore, camera, cameraError, disposeCamera, initCamera, isAnalyzingQuality, isCameraReady (+8 more)

### Community 155 - "history/page.tsx"
Cohesion: 0.21
Nodes (9): ColumnProps, getSessionLogColumns(), SessionLogItem, AcademicClass, HistoryFilters(), HistoryFiltersProps, AcademicClass, HistoryPage() (+1 more)

### Community 156 - "authStore.ts"
Cohesion: 0.17
Nodes (14): adminLinks, NavItem, setupLinks, teacherLinks, teacherReportLinks, SidebarProps, SidebarUserFooter(), SidebarUserFooterProps (+6 more)

### Community 159 - "middleware.ts"
Cohesion: 0.67
Nodes (3): config, middleware(), parseAuthCookie()

### Community 160 - "logger.ts"
Cohesion: 0.50
Nodes (3): logger, LogLevel, PREFIX

### Community 161 - "location_exceptions.dart"
Cohesion: 0.50
Nodes (3): LocationException, message, toString

### Community 165 - "streak_counter.dart"
Cohesion: 0.25
Nodes (7): build, _buildCompactView, _buildFullView, currentStreak, highestStreak, isCompact, StreakCounter

### Community 167 - "adb_login_and_capture.py"
Cohesion: 0.80
Nodes (5): adb(), key(), main(), tap(), type_text()

### Community 173 - "global_exception_handler"
Cohesion: 0.38
Nodes (7): global_exception_handler(), Exception, Request, validation_exception_handler(), exception_handler, JSONResponse, RequestValidationError

### Community 174 - "LogEvent"
Cohesion: 0.32
Nodes (5): ingest_log(), post, LogEvent, BaseModel, field_validator

### Community 175 - "ref_path"
Cohesion: 0.25
Nodes (4): frontend_node_modules_playwright_test_index, ref_fs, ref_path, @vitejs/plugin-react

### Community 189 - "vitest"
Cohesion: 0.33
Nodes (7): mockAdminProfile, mockDeviceChangeRequest, mockStudentProfile, mockTeacherProfile, Role, @testing-library/react, vitest

### Community 190 - "LeaveRequestApprove"
Cohesion: 0.32
Nodes (5): LeaveRequestApprove, LeaveRequestCreate, BaseModel, field_validator, date

### Community 191 - "NotificationItemRow.tsx"
Cohesion: 0.43
Nodes (6): formatRelativeTime(), getIcon(), NotificationItemRow(), NotificationItemRowProps, UseNotificationsReturn, NotificationItem

## Knowledge Gaps
- **1460 isolated node(s):** `ClassInput`, `StudentInput`, `TeacherInput`, `eslintConfig`, `nextConfig` (+1455 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2039 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **46 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminService` connect `AdminService` to `get_redis`, `schemas/admin.py`, `api/auth.py`, `api/admin.py`, `StudentRepository`, `test_service_admin.py`, `_handle_generic_err`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `getApiErrorMessage`, `api.ts`, `reset-password/page.tsx`, `audit/page.tsx`, `cn`, `useAuthStore`, `scanner/page.tsx`, `classes/[id]/edit/page.tsx`, `CommandPaletteModal.tsx`, `history/page.tsx`, `authStore.ts`, `analytics/page.tsx`, `sessions/page.tsx`, `frontend/package.json`, `BulkImportModal.tsx`, `DashboardKpiStrip.tsx`, `NotificationItemRow.tsx`, `GeofenceMap.tsx`, `BroadcastNotificationModal.tsx`, `form.tsx`, `admin/dashboard/page.tsx`, `dropdown-menu.tsx`, `button.tsx`, `AttendanceTrendChart.tsx`, `models.ts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `@playwright/test` connect `@playwright/test` to `AdminClassroomsPage`, `AdminDepartmentsPage`, `AdminDesignationsPage`, `AdminSubjectsPage`, `LoginPage`, `BasePage`, `AdminAuditPage`, `AdminOverviewPage`, `AdminScannerPage`, `BulkImportComponent`, `ForgotPasswordPage`, `AdminVerificationSettingsPage`, `ResetPasswordPage`, `TeacherOverviewPage`, `PageObjects`, `frontend/package.json`, `TeacherSessionsPage`, `test-fixtures.ts`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Are the 59 inferred relationships involving `AdminService` (e.g. with `assign_teacher()` and `bulk_create_classes()`) actually correct?**
  _`AdminService` has 59 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ClassInput`, `StudentInput`, `TeacherInput` to the rest of the system?**
  _1460 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `test_api_teacher.py` be split into smaller, more focused modules?**
  _Cohesion score 0.12070874861572536 - nodes in this community are weakly interconnected._
- **Should `getApiErrorMessage` be split into smaller, more focused modules?**
  _Cohesion score 0.03559870550161812 - nodes in this community are weakly interconnected._