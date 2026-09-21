# Graph Report - Smart Attandance System  (2026-09-21)

## Corpus Check
- 497 files · ~624,071 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 30 file(s) not represented in the graph (top: (none) 8, .xml 7, .example 5)

## Summary
- 4169 nodes · 9347 edges · 180 communities (131 shown, 49 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 323 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8ac49cfb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TeacherService
- getApiErrorMessage
- api.ts
- typing
- flagged_detail_screen.dart
- attendance_service.py
- api/student.py
- login/page.tsx
- types/index.ts
- react
- cn
- useAuthStore
- api/auth.py
- history_list_tab.dart
- package:smart_attendance_app/shared/widgets/animated_background.dart
- setup.mjs
- build
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
- test_core_and_middleware.py
- geofence_verification_provider.dart
- VoidCallback?
- login_screen.dart
- _handle_generic_err
- auth_repository.dart
- student_api.dart
- class_session_card.dart
- websocket_service.dart
- router.dart
- verification_screen.dart
- StudentRepository
- package:flutter/material.dart
- scanner/page.tsx
- verification_ai_review_card.dart
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
- attendance_provider.dart
- offline_sync_service.dart
- api/teacher.py
- result_config.dart
- package:flutter_riverpod/flutter_riverpod.dart
- glass_input.dart
- dependencies
- BulkImportModal.tsx
- attendance_utils.dart
- os
- package:smart_attendance_app/app/theme.dart
- List
- notification_api.dart
- scripts
- verification_camera_mixin.dart
- test_api_admin.py
- @playwright/test
- ActivityFilterBar.tsx
- attendance_constants.dart
- main.py
- app_db_client
- offline_payload.dart
- BasePage
- leaderboard.dart
- AttendanceRepository
- GamificationService
- devDependencies
- GeofenceMap.tsx
- compilerOptions
- menu_grid_item.dart
- test_api_auth.py
- 🚀 Key Features
- master_data.py
- smart_pass_provider.dart
- user.dart
- global_exception_handler
- leave_requests_screen.dart
- verification_step_bottom_bar.dart
- SessionService
- smart_pass_screen.dart
- conftest.py
- form.tsx
- test-fixtures.ts
- leave.py
- adb_mobile_screen_tester.py
- device_change_dialog.dart
- YopmailClient
- absentee_scanner.py
- AIOrchestrator
- dropdown-menu.tsx
- reset-password/page.tsx
- ConnectionManager
- reset_password_screen.dart
- AdminSetupService
- student_stats.dart
- face_registration_screen.dart
- manifest.json
- .send_email
- S3Service
- PageObjects
- glass_button.dart
- button.tsx
- AdminClassesPage
- AdminTeachersPage
- AdminVerificationSettingsPage
- AttendanceTrendChart.tsx
- SeedingConfig
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
- test_teacher_smart_pass_playwright.mjs
- ref_playwright
- summary_reporter.py
- Settings
- test_service_teacher.py
- logs.py
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
- next.config.ts
- TeacherReviewPage
- WebSocketClient
- MobileE2ERunner
- middleware.ts
- logger.ts
- location_exceptions.dart
- app/layout.tsx
- FlutterActivity
- frontend/README.md
- AnalyticsPage
- smart_attendance_app
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
2. `getApiErrorMessage()` - 136 edges
3. `AdminService` - 108 edges
4. `lucide-react` - 105 edges
5. `cn()` - 93 edges
6. `next` - 65 edges
7. `api` - 63 edges
8. `applyValidationErrorsToForm()` - 63 edges
9. `BasePage` - 57 edges
10. `react-hot-toast` - 55 edges

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

## Communities (180 total, 49 thin omitted)

### Community 0 - "TeacherService"
Cohesion: 0.12
Nodes (25): AbsentStudentItem, AcademicClassWithGeofenceResponse, AttendanceManualOverride, BulkMarkRequest, ClassAttendanceExportItem, ClassStatsResponse, DeviceChangeApprove, GeofenceResponse (+17 more)

### Community 1 - "getApiErrorMessage"
Cohesion: 0.04
Nodes (79): ForgotPasswordPage(), handleResend(), onSubmit(), LoginPage(), handleSuccessRedirect(), onSubmit(), OnboardingContent(), checkToken() (+71 more)

### Community 2 - "api.ts"
Cohesion: 0.11
Nodes (54): VerifyData, SEMESTER_OPTIONS, SystemConfig, colorVariants, colorVariants, ManualAttendanceStats(), ManualAttendanceStatsProps, AttendanceStatus (+46 more)

### Community 3 - "typing"
Cohesion: 0.08
Nodes (39): aiosmtplib, app_core_config, app_core_logging_config, app_core_security, app_core_url_resolver, app_db_redis, app_repositories_attendance_repo, app_repositories_class_repo (+31 more)

### Community 4 - "flagged_detail_screen.dart"
Cohesion: 0.04
Nodes (58): AttendanceHistoryItem, AnalyticsSubjectGoals, build, className, data, _GoalStat, present, subject (+50 more)

### Community 5 - "attendance_service.py"
Cohesion: 0.07
Nodes (33): AcademicClass, app_api_ws, app_repositories_geofence_repo, app_repositories_system_config_repo, app_services_ai_orchestrator, app_utils_geofencing, ClassRepository, GeofenceRepository (+25 more)

### Community 6 - "api/student.py"
Cohesion: 0.08
Nodes (52): app_api_dependencies, app_repositories_leave_repo, app_schemas_attendance, app_schemas_leave, app_services_attendance_service, app_services_student_service, analyze_attendance(), confirm_attendance() (+44 more)

### Community 7 - "login/page.tsx"
Cohesion: 0.04
Nodes (58): GENDER_OPTIONS, SEMESTER_OPTIONS, StudentFormFields(), StudentFormFieldsProps, EditStudentFormFields(), EditStudentFormFieldsProps, GENDER_OPTIONS, SEMESTER_OPTIONS (+50 more)

### Community 8 - "types/index.ts"
Cohesion: 0.06
Nodes (50): AdminDashboardPage(), ActiveSessionBanner(), ActiveSessionBannerProps, TeacherDashboardPage(), ActiveSessionsCard(), ActiveSessionsCardProps, SessionPreviewPage(), loadData() (+42 more)

### Community 9 - "react"
Cohesion: 0.05
Nodes (57): classColumns, EnrollHeader(), EnrollHeaderProps, EnrollStudentFilters(), EnrollStudentFiltersProps, EnrollStudentRow(), EnrollStudentRowProps, studentColumns (+49 more)

### Community 10 - "cn"
Cohesion: 0.05
Nodes (52): ManualAttendanceStudentRow(), ManualAttendanceStudentRowProps, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle (+44 more)

### Community 11 - "useAuthStore"
Cohesion: 0.06
Nodes (48): DashboardLayout(), BroadcastNotificationModal(), BroadcastNotificationModalProps, INITIAL_FORM, CommandItem, CommandPaletteModal(), CommandPaletteModalProps, Header() (+40 more)

### Community 12 - "api/auth.py"
Cohesion: 0.09
Nodes (43): app_services_auth_service, app_services_device_change_service, app_services_system_config_service, change_password(), complete_onboarding(), forgot_password(), get_me(), get_public_system_config() (+35 more)

### Community 13 - "history_list_tab.dart"
Cohesion: 0.05
Nodes (48): build, createState, desc, _expanded, FlaggedTroubleshootFaq, _FlaggedTroubleshootFaqState, icon, _TipItem (+40 more)

### Community 14 - "package:smart_attendance_app/shared/widgets/animated_background.dart"
Cohesion: 0.05
Nodes (49): AnalyticsScreen, _AnalyticsScreenState, build, createState, initState, historyProvider, build, _buildTabBtn (+41 more)

### Community 15 - "setup.mjs"
Cohesion: 0.07
Nodes (45): ref_node_child_process, ref_node_crypto, ref_node_fs, ref_node_path, ref_node_url, checkVenvPythonVersion(), createPython311Venv(), ensureBackendDirectories() (+37 more)

### Community 16 - "build"
Cohesion: 0.40
Nodes (5): build, Route /settings/goals, Route /settings/help, Route /settings/notifications, Route /settings/sync

### Community 17 - "seed_and_simulate.py"
Cohesion: 0.15
Nodes (16): argparse, httpx, playwright_async_api, random, re, rich_console, Admin Master Data Setup Automation. Configures institutional master data: -…, Automated Data-Seeding and Realistic User-Simulation Pipeline. Usage: python… (+8 more)

### Community 18 - "datetime"
Cohesion: 0.09
Nodes (30): app_schemas_health, app_schemas_notification, check_database(), check_redis(), check_s3(), get_health_status(), get, Response (+22 more)

### Community 19 - "main.dart"
Cohesion: 0.04
Nodes (44): @pragma, Duration?, HttpOverrides, defineUrl, envUrl, kConnectTimeout, kGeofenceGraceMeters, kGpsAveragingSamples (+36 more)

### Community 20 - "AdminService"
Cohesion: 0.07
Nodes (10): generate_temporary_password(), ClassResponse, TeacherResponse, AdminService, test_create_class_and_assign_teacher(), test_generate_temporary_password(), Classroom, Department (+2 more)

### Community 21 - "leave_request.dart"
Cohesion: 0.08
Nodes (24): LeaveRepository, LeaveService, approved, approvedBy, approverNote, createdAt, documentUrl, endDate (+16 more)

### Community 22 - "theme.dart"
Cohesion: 0.04
Nodes (45): accentAmber, accentEmerald, accentPink, accentTeal, baseText, bgCanvas, bgPrimary, bgSecondary (+37 more)

### Community 23 - "preferences_service.dart"
Cohesion: 0.04
Nodes (44): getAttendanceTarget, getLowAttendanceThreshold, getNotifyClassStart, getNotifyLowAttendance, getNotifySyncDone, getNotifyWindowOpen, isFirstCameraUse, _keyAttendanceTarget (+36 more)

### Community 24 - "notifications.py"
Cohesion: 0.09
Nodes (36): app_services_notification_service, broadcast_notification(), list_notifications(), mark_all_read(), mark_read(), delete, get, patch (+28 more)

### Community 25 - "verification_step_content.dart"
Cohesion: 0.04
Nodes (47): CameraController?, DateTimeFormatting, formattedDate, formattedDateTime, isSameDay, shortDate, StringFormatting, truncate (+39 more)

### Community 26 - "notification_service.dart"
Cohesion: 0.05
Nodes (39): Box, dart:convert, WebSocketService, addToQueue, cacheProfile, cacheSystemConfig, clearAll, _configBox (+31 more)

### Community 27 - "test_core_and_middleware.py"
Cohesion: 0.15
Nodes (19): RoleChecker, create_access_token(), decode_access_token(), hash_password(), Any, verify_password(), TestSmartAttendanceSuite, test_jwt_token_roundtrip() (+11 more)

### Community 28 - "geofence_verification_provider.dart"
Cohesion: 0.05
Nodes (45): AutoDisposeNotifier, dart:math, FlutterSecureStorage, describeDistance, GeofenceCalculator, isWithinGeofence, describeDistance, ensurePermissionsGranted (+37 more)

### Community 29 - "VoidCallback?"
Cohesion: 0.06
Nodes (27): build, controller, FlaggedNoteForm, isSubmitting, noteSubmitted, onSubmit, build, isSecondaryGhost (+19 more)

### Community 30 - "login_screen.dart"
Cohesion: 0.06
Nodes (36): AnimationController, class, authProvider, build, _confirmPasswordController, createState, dispose, ForceChangePasswordScreen (+28 more)

### Community 31 - "_handle_generic_err"
Cohesion: 0.17
Nodes (37): assign_teacher(), bulk_create_classes(), bulk_create_classrooms(), bulk_create_departments(), bulk_create_designations(), bulk_create_students(), bulk_create_subjects(), bulk_create_teachers() (+29 more)

### Community 32 - "auth_repository.dart"
Cohesion: 0.05
Nodes (44): DeviceInfoPlugin, Dio, AuthApi, authApiProvider, changePassword, _dio, getProfile, login (+36 more)

### Community 33 - "student_api.dart"
Cohesion: 0.06
Nodes (34): LeaderboardEntry, analyzeAttendance, confirmAttendance, createLeaveRequest, _dio, getLeaderboard, getMyAttendance, getMyClasses (+26 more)

### Community 34 - "class_session_card.dart"
Cohesion: 0.09
Nodes (23): ClassSession, build, _canMark, ClassSessionCard, _ClassSessionCardState, _countdownTimer, createState, didUpdateWidget (+15 more)

### Community 35 - "websocket_service.dart"
Cohesion: 0.06
Nodes (34): computeRouterRedirect, null, authState, _channel, connect, disconnect, dispose, _maxReconnectAttempts (+26 more)

### Community 36 - "router.dart"
Cohesion: 0.06
Nodes (34): ChangeNotifier, GoRouter, notifier, notify, rootNavigatorKey, RouterNotifier, routerNotifierProvider, shellNavigatorKey (+26 more)

### Community 37 - "verification_screen.dart"
Cohesion: 0.05
Nodes (52): ConsumerState, ConsumerStatefulWidget, hiveServiceProvider, preferencesServiceProvider, attendanceRepositoryProvider, attendanceVerificationProvider, geofenceVerificationProvider, FlaggedDetailScreen (+44 more)

### Community 38 - "StudentRepository"
Cohesion: 0.11
Nodes (8): EnrollmentRepository, Student, StudentRepository, Teacher, TeacherRepository, User, UserRepository, Enrollment

### Community 39 - "package:flutter/material.dart"
Cohesion: 0.06
Nodes (30): slideRightPage, slideUpPage, build, child, ShellScaffold, _tabPaths, LocalNotification, LeaveQuickActions (+22 more)

### Community 40 - "scanner/page.tsx"
Cohesion: 0.10
Nodes (18): AnomalyCard(), AnomalyCardProps, getRiskLevel(), WEEKDAYS, ScannerControls(), ScannerControlsProps, downloadCsv(), GeofenceControls() (+10 more)

### Community 41 - "verification_ai_review_card.dart"
Cohesion: 0.09
Nodes (21): Animation, AttendanceAnalysisResult, animation, build, hint, icon, label, ReviewScoreRow (+13 more)

### Community 42 - "attendance.dart"
Cohesion: 0.06
Nodes (33): activeSessionId, attendanceId, backgroundScore, classId, className, createdAt, faceScore, finalAiScore (+25 more)

### Community 43 - "schemas/admin.py"
Cohesion: 0.11
Nodes (25): AbsenteeAnomalyItem, AssignTeacherRequest, AuditLogResponse, ClassBulkCreateRequest, ClassBulkItem, ClassCreate, ClassroomBulkCreateRequest, ClassroomBulkItem (+17 more)

### Community 44 - "audit/page.tsx"
Cohesion: 0.09
Nodes (24): AuditPage(), ClassesPage(), StudentsPage(), TeachersPage(), ActivityDetailModal(), ActivityDetailModalProps, ActivityLogTable(), ActivityLogTableProps (+16 more)

### Community 45 - "app.dart"
Cohesion: 0.10
Nodes (25): build, createState, dispose, _handleNotificationClick, inferNotificationSeverity, _initializeFcm, initState, kSeverityInfo (+17 more)

### Community 46 - "Color"
Cohesion: 0.05
Nodes (35): Color, dart:ui, build, goodThreshold, label, value, VerificationQualityBar, build (+27 more)

### Community 47 - "geofence_radar_indicator.dart"
Cohesion: 0.07
Nodes (26): CustomPainter, GeofenceStatus, build, _buildChip, GeofenceDistanceMetrics, state, statusColor, build (+18 more)

### Community 48 - "auth_provider.dart"
Cohesion: 0.05
Nodes (42): dart:async, AppEvents, _authErrorController, authErrorStream, broadcastAuthError, AuthRepository, AuthStatus, _authErrorSubscription (+34 more)

### Community 49 - "session_provider.dart"
Cohesion: 0.07
Nodes (29): _adjustPollInterval, _api, classId, className, _currentInterval, dispose, errorMessage, fetchSessions (+21 more)

### Community 50 - "api/admin.py"
Cohesion: 0.16
Nodes (21): app_core_rate_limit, export_audit_logs(), get_admin_stats(), get_audit_logs(), get_class_by_id(), get_classes(), get_classroom(), get_classrooms() (+13 more)

### Community 51 - "frontend/package.json"
Cohesion: 0.07
Nodes (27): eslintConfig, name, private, version, axios, clsx, eslint, eslint-config-next (+19 more)

### Community 52 - "attendance_provider.dart"
Cohesion: 0.10
Nodes (20): accuracy, analysisResult, analyze, AttendanceNotifier, AttendanceVerificationState, confirm, copyWith, errorMessage (+12 more)

### Community 53 - "offline_sync_service.dart"
Cohesion: 0.04
Nodes (49): dart:io, HiveService, NotificationService, _className, _connectivitySub, _deleteImageFile, _dio, dispose (+41 more)

### Community 54 - "api/teacher.py"
Cohesion: 0.12
Nodes (33): app_services_leave_service, app_services_session_service, approve_device_change(), approve_leave(), bulk_mark_attendance(), export_class_attendance(), get_absent_students(), get_attendance_by_id() (+25 more)

### Community 55 - "result_config.dart"
Cohesion: 0.08
Nodes (24): background, color, error, face, flagged, icon, liveness, offline (+16 more)

### Community 56 - "package:flutter_riverpod/flutter_riverpod.dart"
Cohesion: 0.06
Nodes (41): ConsumerWidget, notificationsLoadingProvider, notificationsProvider, pendingCountProvider, leaderboardProvider, build, _buildBody, _buildUserSummaryCard (+33 more)

### Community 57 - "glass_input.dart"
Cohesion: 0.05
Nodes (37): FocusNode?, IconData?, icon, iconColor, onTap, pendingCount, ProfileSettingsList, _SettingTile (+29 more)

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
Nodes (34): asyncio, _load_liveness_model(), Any, Service Health & Connectivity Checker Checks AWS S3 and PostgreSQL RDS…, boto3, botocore_exceptions, cv2, deepface (+26 more)

### Community 62 - "package:smart_attendance_app/app/theme.dart"
Cohesion: 0.06
Nodes (37): build, HomeEmptyClasses, build, HomeWarningBanner, onTap, percentage, build, _buildEmpty (+29 more)

### Community 63 - "List"
Cohesion: 0.07
Nodes (24): int?, List, NotificationsNotifier, activeStepIndex, build, stepLabels, subtitle, title (+16 more)

### Community 64 - "notification_api.dart"
Cohesion: 0.08
Nodes (23): category, createdAt, deleteNotification, _dio, fromJson, getNotifications, id, isRead (+15 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (23): bin, dev, setup, description, name, private, scripts, backend:setup (+15 more)

### Community 66 - "verification_camera_mixin.dart"
Cohesion: 0.06
Nodes (33): PendingCountNotifier, blurScore, brightnessScore, camera, cameraError, disposeCamera, initCamera, isAnalyzingQuality (+25 more)

### Community 67 - "test_api_admin.py"
Cohesion: 0.11
Nodes (15): app_schemas_master_data, app_schemas_pagination, AdminStatsResponse, BulkImportResponse, DepartmentResponse, PaginatedResponse, PaginationParams, BaseModel (+7 more)

### Community 68 - "@playwright/test"
Cohesion: 0.12
Nodes (6): ClassInput, StudentInput, TeacherInput, TeacherAnalyticsPage, TeacherHistoryPage, @playwright/test

### Community 69 - "ActivityFilterBar.tsx"
Cohesion: 0.27
Nodes (8): ActivityCategory, ActivityFilterBar(), ActivityFilterBarProps, CATEGORIES, PRESETS, TimePresetFilter(), TimePresetFilterProps, TimeRangePreset

### Community 70 - "attendance_constants.dart"
Cohesion: 0.09
Nodes (21): kAttendanceTypeLocal, kAttendanceTypePush, kGoodScoreThreshold, kImagePickQuality, kMinBrightnessForPhoto, kMinSharpnessForPhoto, kNoteMaxChars, kOverallGoodPct (+13 more)

### Community 71 - "main.py"
Cohesion: 0.08
Nodes (27): app_api, app_middleware_request_logging, app_services_s3_service, app_services_scheduler, connect_db(), disconnect_db(), connect_redis(), disconnect_redis() (+19 more)

### Community 72 - "app_db_client"
Cohesion: 0.16
Nodes (5): app_db_client, datetime, SessionRepository, prisma_models, Session

### Community 73 - "offline_payload.dart"
Cohesion: 0.11
Nodes (19): @HiveType, HiveObject, hashCode, OfflineAttendancePayloadAdapter, operator, read, typeId, write (+11 more)

### Community 74 - "BasePage"
Cohesion: 0.13
Nodes (3): BasePage, TeacherClassesPage, TeacherLeavesPage

### Community 75 - "leaderboard.dart"
Cohesion: 0.12
Nodes (18): AppException, AuthException, message, NetworkException, ServerException, statusCode, toString, ValidationException (+10 more)

### Community 77 - "GamificationService"
Cohesion: 0.12
Nodes (10): GamificationService, Return the active Redis client if available., Update a student's score in the Redis leaderboard., Fetch the leaderboard from Redis, falling back to DB if empty., Helper to compatibility-wrap recalculate_student_streak., Rebuild the leaderboard cache from DB data., Recalculate student streak based on historical attendance logs and active…, Fetch top 10 students from Redis cache and load details from DB. (+2 more)

### Community 78 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, eslint, eslint-config-next, jsdom, @playwright/test, tailwindcss, @tailwindcss/postcss, @testing-library/dom (+11 more)

### Community 79 - "GeofenceMap.tsx"
Cohesion: 0.14
Nodes (10): Circle, GeofenceMap(), GeofenceMapProps, MapContainer, Marker, TileLayer, LocationSearchBar(), LocationSearchBarProps (+2 more)

### Community 80 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 81 - "menu_grid_item.dart"
Cohesion: 0.09
Nodes (20): build, categories, LeaveCategorySelector, onSelected, selectedCategory, build, currentIndex, GlassBottomNav (+12 more)

### Community 82 - "test_api_auth.py"
Cohesion: 0.11
Nodes (11): app_schemas_system_config, patch, update_system_config(), Token, BaseModel, SystemConfigResponse, SystemConfigUpdate, test_get_public_system_config() (+3 more)

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

### Community 87 - "global_exception_handler"
Cohesion: 0.38
Nodes (7): global_exception_handler(), Exception, Request, validation_exception_handler(), exception_handler, JSONResponse, RequestValidationError

### Community 88 - "leave_requests_screen.dart"
Cohesion: 0.08
Nodes (24): File?, build, createState, dispose, _endDate, _isSubmitting, LeaveRequestsScreen, _LeaveRequestsScreenState (+16 more)

### Community 89 - "verification_step_bottom_bar.dart"
Cohesion: 0.11
Nodes (18): VerificationStep, build, build, isCameraReady, onAnalyze, onCapture, onRetake, onSubmit (+10 more)

### Community 90 - "SessionService"
Cohesion: 0.26
Nodes (4): SessionStart, SessionScheduler, Mark session as inactive, delete from Redis, and mark all unsubmitted students…, SessionService

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

### Community 95 - "leave.py"
Cohesion: 0.29
Nodes (6): LeaveRequestApprove, LeaveRequestCreate, LeaveRequestListResponse, BaseModel, field_validator, date

### Community 96 - "adb_mobile_screen_tester.py"
Cohesion: 0.35
Nodes (11): adb(), key(), main(), tap(), type_text(), adb(), capture(), keyevent() (+3 more)

### Community 97 - "device_change_dialog.dart"
Cohesion: 0.18
Nodes (12): dioProvider, deviceServiceProvider, build, createState, _DeviceChangeDialogState, dispose, email, _isLoading (+4 more)

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
Cohesion: 0.19
Nodes (9): VerifyData, PasswordRequirementsChecklist(), PasswordRequirementsChecklistProps, usePasswordRules(), ResetPasswordStatusCard(), ResetPasswordStatusCardProps, StudentMobileAppCallout(), StudentMobileAppCalloutProps (+1 more)

### Community 104 - "reset_password_screen.dart"
Cohesion: 0.08
Nodes (28): Container, FormState, resetPasswordProvider, build, _buildInvalidCard, _buildLoadingCard, _buildResetForm, _confirmCtrl (+20 more)

### Community 105 - "AdminSetupService"
Cohesion: 0.18
Nodes (8): AdminSetupService, Any, AsyncClient, Creates classroom and laboratory venues., Logs into admin account and acquires JWT access token., Creates institutional departments., Creates academic designations., Creates academic subjects (Theory & Practical).

### Community 106 - "student_stats.dart"
Cohesion: 0.18
Nodes (10): absentCount, attendancePercentage, currentStreak, excusedCount, flaggedCount, fromJson, highestStreak, presentCount (+2 more)

### Community 107 - "face_registration_screen.dart"
Cohesion: 0.14
Nodes (16): registrationProvider, build, _cameraController, _cameraError, _capturedPath, _capturePhoto, createState, dispose (+8 more)

### Community 108 - "manifest.json"
Cohesion: 0.18
Nodes (10): background_color, description, display, icons, name, orientation, prefer_related_applications, short_name (+2 more)

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

### Community 118 - "SeedingConfig"
Cohesion: 0.23
Nodes (9): main(), run_pipeline(), BaseModel, SeedingConfig, _validate_local_url(), clean_database(), _hash_password(), Database Cleaner for Local Test Environment. Provides clean slate wiping for… (+1 more)

### Community 120 - "system_configuration.dart"
Cohesion: 0.33
Nodes (5): fromJson, isAiBackgroundValidationEnabled, isFaceRecognitionEnabled, isGpsVerificationEnabled, toJson

### Community 121 - "verification_preview_frame.dart"
Cohesion: 0.18
Nodes (10): bool get, double?, blurScore, brightnessScore, build, imagePath, isAnalyzingQuality, isPoorQuality (+2 more)

### Community 124 - "SessionSimulationService"
Cohesion: 0.29
Nodes (6): Any, AsyncClient, Acquires auth tokens for faculty members to drive session endpoints., Categorizes students into Exemplary (~60%), Irregular (~25%), and Defaulter…, Runs the multi-day attendance simulation across classes., SessionSimulationService

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
Cohesion: 0.05
Nodes (37): build, email, errorMessage, isFormValid, LoginErrorBanner, password, GlassAppBar, actionLabel (+29 more)

### Community 136 - "test_teacher_smart_pass_playwright.mjs"
Cohesion: 0.29
Nodes (4): frontend_node_modules_playwright_test_index, ref_fs, ref_path, @vitejs/plugin-react

### Community 138 - "summary_reporter.py"
Cohesion: 0.25
Nodes (7): rich, rich_panel, rich_table, print_final_summary(), Any, Summary Reporting & Terminal Dashboard Module. Renders final summary tables and…, Prints beautiful formatted terminal summary tables using rich.

### Community 139 - "Settings"
Cohesion: 0.33
Nodes (3): field_validator, Settings, BaseSettings

### Community 140 - "test_service_teacher.py"
Cohesion: 0.17
Nodes (14): app_schemas_teacher, app_services_gamification_service, app_services_teacher_service, BulkAttendanceRecord, asyncio, test_recalculate_streak_consecutive_present(), test_recalculate_streak_no_enrollments(), asyncio (+6 more)

### Community 141 - "logs.py"
Cohesion: 0.18
Nodes (9): app_schemas_common, app_schemas_log, ingest_log(), post, setup_logging(), LogEvent, BaseModel, field_validator (+1 more)

### Community 142 - "app_notification.dart"
Cohesion: 0.15
Nodes (12): body, category, copyWith, fromMap, id, isRead, link, severity (+4 more)

### Community 150 - "history_calendar_tab.dart"
Cohesion: 0.05
Nodes (43): Map, AttendanceHistoryResponse, AnalyticsKpiOverview, build, data, target, AnalyticsSubjectHeatmap, build (+35 more)

### Community 151 - "EdgeWorkflowsService"
Cohesion: 0.29
Nodes (5): EdgeWorkflowsService, Any, AsyncClient, Simulates student device changes and teacher resolution., Simulates student leave submissions and teacher review queue processing.

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
- **1452 isolated node(s):** `ClassInput`, `StudentInput`, `TeacherInput`, `eslintConfig`, `nextConfig` (+1447 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2021 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **49 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminService` connect `AdminService` to `typing`, `test_api_admin.py`, `attendance_service.py`, `StudentRepository`, `schemas/admin.py`, `api/auth.py`, `api/admin.py`, `test_service_admin.py`, `_handle_generic_err`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `api.ts`, `ActivityFilterBar.tsx`, `reset-password/page.tsx`, `login/page.tsx`, `types/index.ts`, `scanner/page.tsx`, `cn`, `useAuthStore`, `audit/page.tsx`, `dropdown-menu.tsx`, `GeofenceMap.tsx`, `button.tsx`, `frontend/package.json`, `AttendanceTrendChart.tsx`, `BulkImportModal.tsx`, `form.tsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `@playwright/test` connect `@playwright/test` to `AdminClassroomsPage`, `AdminDepartmentsPage`, `AdminDesignationsPage`, `AdminSubjectsPage`, `LoginPage`, `AdminAuditPage`, `AdminOverviewPage`, `AdminScannerPage`, `BulkImportComponent`, `ForgotPasswordPage`, `ResetPasswordPage`, `TeacherOverviewPage`, `TeacherReviewPage`, `frontend/package.json`, `BasePage`, `test-fixtures.ts`, `PageObjects`, `AdminVerificationSettingsPage`, `TeacherSessionsPage`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Are the 59 inferred relationships involving `AdminService` (e.g. with `assign_teacher()` and `bulk_create_classes()`) actually correct?**
  _`AdminService` has 59 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ClassInput`, `StudentInput`, `TeacherInput` to the rest of the system?**
  _1452 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TeacherService` be split into smaller, more focused modules?**
  _Cohesion score 0.11702127659574468 - nodes in this community are weakly interconnected._
- **Should `getApiErrorMessage` be split into smaller, more focused modules?**
  _Cohesion score 0.03793859649122807 - nodes in this community are weakly interconnected._