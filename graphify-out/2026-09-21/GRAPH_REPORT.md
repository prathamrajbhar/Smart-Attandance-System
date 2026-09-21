# Graph Report - Smart Attandance System  (2026-09-21)

## Corpus Check
- 496 files · ~600,629 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 30 file(s) not represented in the graph (top: (none) 8, .xml 7, .example 5)

## Summary
- 4139 nodes · 9308 edges · 182 communities (136 shown, 46 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 323 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c855f5b1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TeacherService
- getApiErrorMessage
- api.ts
- get_logger
- history_calendar_tab.dart
- attendance_service.py
- api/student.py
- reset-password/page.tsx
- types/index.ts
- react
- cn
- useAuthStore
- api/auth.py
- verification_ai_review_card.dart
- history_screen.dart
- setup.mjs
- StatelessWidget
- seed_and_simulate.py
- test_api_auth.py
- main.dart
- ._log_action
- leave_request.dart
- theme.dart
- preferences_service.dart
- notifications.py
- verification_step_content.dart
- notification_service.dart
- sessions/page.tsx
- geofence_verification_provider.dart
- verification_camera_frame.dart
- class_session_card.dart
- _handle_generic_err
- auth_repository.dart
- student_api.dart
- String?
- websocket_service.dart
- router.dart
- verification_screen.dart
- package:flutter_riverpod/flutter_riverpod.dart
- package:flutter/material.dart
- flagged_detail_screen.dart
- package:smart_attendance_app/app/theme.dart
- attendance.dart
- schemas/admin.py
- audit/page.tsx
- app.dart
- Color
- geofence_status_card.dart
- auth_provider.dart
- session_provider.dart
- api/admin.py
- frontend/package.json
- attendance_provider.dart
- offline_sync_service.dart
- api/teacher.py
- result_config.dart
- package:smart_attendance_app/shared/widgets/animated_background.dart
- glass_input.dart
- dependencies
- useBulkImportProcessor.ts
- attendance_utils.dart
- os
- geofence_radar_indicator.dart
- VoidCallback?
- notification_api.dart
- scripts
- history_provider.dart
- test_api_admin.py
- @playwright/test
- history/page.tsx
- attendance_constants.dart
- main.py
- GeofenceControls.tsx
- offline_payload.dart
- BasePage
- leaderboard.dart
- AttendanceRepository
- GamificationService
- devDependencies
- GeofenceMap.tsx
- compilerOptions
- notification_tile.dart
- secure_storage.dart
- 🚀 Key Features
- master_data.py
- smart_pass_provider.dart
- user.dart
- LeaveRepository
- leave_requests_screen.dart
- reset_password_provider.dart
- SessionService
- smart_pass_screen.dart
- conftest.py
- form.tsx
- test-fixtures.ts
- typing
- SeedingConfig
- device_change_dialog.dart
- authProvider
- absentee_scanner.py
- SessionRepository
- dropdown-menu.tsx
- verification_step_bottom_bar.dart
- ConnectionManager
- reset_password_screen.dart
- verification_preview_frame.dart
- student_stats.dart
- face_registration_screen.dart
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
- AdminSetupService
- TestRunner
- SystemConfigService
- home_screen.dart
- TeacherSessionsPage
- E2ETestRunner
- SessionSimulationService
- Agent Guidelines & Engineering Standards
- test_service_admin.py
- models.ts
- AdminStudentsPage
- AdminClassroomsPage
- AdminDepartmentsPage
- AdminDesignationsPage
- AdminSubjectsPage
- LoginPage
- scripts
- info_banner.dart
- vitest
- ref_playwright
- StudentEnrollmentService
- Settings
- test_api_teacher.py
- LogEvent
- app_notification.dart
- AdminAuditPage
- AdminOverviewPage
- AdminScannerPage
- BulkImportComponent
- ForgotPasswordPage
- ResetPasswordPage
- TeacherOverviewPage
- history_list_tab.dart
- verification_camera_mixin.dart
- streak_counter.dart
- TeacherReviewPage
- summary_reporter.py
- EdgeWorkflowsService
- YopmailClient
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

## Communities (182 total, 46 thin omitted)

### Community 0 - "TeacherService"
Cohesion: 0.14
Nodes (23): app_services_teacher_service, AbsentStudentItem, AcademicClassWithGeofenceResponse, AttendanceManualOverride, BulkAttendanceRecord, BulkMarkRequest, ClassAttendanceExportItem, ClassStatsResponse (+15 more)

### Community 1 - "getApiErrorMessage"
Cohesion: 0.03
Nodes (77): ForgotPasswordPage(), handleResend(), onSubmit(), LoginPage(), handleSuccessRedirect(), onSubmit(), OnboardingContent(), checkToken() (+69 more)

### Community 2 - "api.ts"
Cohesion: 0.11
Nodes (55): SEMESTER_OPTIONS, SystemConfig, TeacherFormProfile(), TeacherFormProfileProps, ManualAttendanceStatsProps, ForceChangePasswordData, ForceChangePasswordModal(), onSubmit() (+47 more)

### Community 3 - "get_logger"
Cohesion: 0.05
Nodes (43): app_api_dependencies, app_core_logging_config, app_core_security, app_db_redis, app_repositories_attendance_repo, app_repositories_class_repo, app_repositories_enrollment_repo, app_repositories_leave_repo (+35 more)

### Community 4 - "history_calendar_tab.dart"
Cohesion: 0.04
Nodes (57): AttendanceHistoryItem, AttendanceHistoryResponse, AnalyticsKpiOverview, build, data, target, AnalyticsSubjectGoals, build (+49 more)

### Community 5 - "attendance_service.py"
Cohesion: 0.09
Nodes (37): app_api_ws, app_repositories_geofence_repo, app_services_ai_orchestrator, app_services_system_config_service, app_utils_geofencing, RoleChecker, create_access_token(), decode_access_token() (+29 more)

### Community 6 - "api/student.py"
Cohesion: 0.08
Nodes (54): app_schemas_attendance, app_schemas_leave, app_services_attendance_service, app_services_student_service, analyze_attendance(), confirm_attendance(), create_leave_request(), get_leaderboard() (+46 more)

### Community 7 - "reset-password/page.tsx"
Cohesion: 0.06
Nodes (34): VerifyData, VerifyData, PasswordRequirementsChecklist(), PasswordRequirementsChecklistProps, usePasswordRules(), ResetPasswordStatusCard(), ResetPasswordStatusCardProps, StudentMobileAppCallout() (+26 more)

### Community 8 - "types/index.ts"
Cohesion: 0.06
Nodes (48): AdminDashboardPage(), LeaveDocumentModal(), LeaveDocumentModalProps, LeaveReviewDialog(), LeaveReviewDialogProps, SessionRosterPage(), getRosterColumns(), GetRosterColumnsProps (+40 more)

### Community 9 - "react"
Cohesion: 0.07
Nodes (45): nextConfig, classColumns, EnrollHeader(), EnrollHeaderProps, EnrollStudentFilters(), EnrollStudentFiltersProps, EnrollStudentRow(), EnrollStudentRowProps (+37 more)

### Community 10 - "cn"
Cohesion: 0.06
Nodes (48): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Dialog, DialogClose (+40 more)

### Community 11 - "useAuthStore"
Cohesion: 0.07
Nodes (46): DashboardLayout(), BroadcastNotificationModal(), BroadcastNotificationModalProps, INITIAL_FORM, CommandItem, CommandPaletteModal(), CommandPaletteModalProps, Header() (+38 more)

### Community 12 - "api/auth.py"
Cohesion: 0.10
Nodes (41): app_services_auth_service, app_services_device_change_service, change_password(), complete_onboarding(), forgot_password(), get_me(), get_public_system_config(), login() (+33 more)

### Community 13 - "verification_ai_review_card.dart"
Cohesion: 0.04
Nodes (52): AnimationController, AttendanceAnalysisResult, build, createState, desc, _expanded, FlaggedTroubleshootFaq, _FlaggedTroubleshootFaqState (+44 more)

### Community 14 - "history_screen.dart"
Cohesion: 0.07
Nodes (37): ConsumerWidget, AnalyticsScreen, _AnalyticsScreenState, build, createState, initState, ResultScreen, historyProvider (+29 more)

### Community 15 - "setup.mjs"
Cohesion: 0.07
Nodes (45): ref_node_child_process, ref_node_crypto, ref_node_fs, ref_node_path, ref_node_url, checkVenvPythonVersion(), createPython311Venv(), ensureBackendDirectories() (+37 more)

### Community 16 - "StatelessWidget"
Cohesion: 0.04
Nodes (47): IconData?, HomeEmptyClasses, build, icon, iconColor, onTap, pendingCount, ProfileSettingsList (+39 more)

### Community 17 - "seed_and_simulate.py"
Cohesion: 0.15
Nodes (16): argparse, httpx, playwright_async_api, random, re, rich_console, Admin Master Data Setup Automation. Configures institutional master data: -…, Automated Data-Seeding and Realistic User-Simulation Pipeline. Usage: python… (+8 more)

### Community 18 - "test_api_auth.py"
Cohesion: 0.05
Nodes (40): app_schemas_health, app_schemas_notification, app_schemas_system_config, app_services_s3_service, check_database(), check_redis(), check_s3(), get_health_status() (+32 more)

### Community 19 - "main.dart"
Cohesion: 0.04
Nodes (44): @pragma, Duration?, HttpOverrides, defineUrl, envUrl, kConnectTimeout, kGeofenceGraceMeters, kGpsAveragingSamples (+36 more)

### Community 20 - "._log_action"
Cohesion: 0.08
Nodes (7): generate_temporary_password(), ClassResponse, field_validator, TeacherCreate, TeacherResponse, test_create_class_and_assign_teacher(), test_generate_temporary_password()

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
Nodes (39): app_schemas_common, app_services_notification_service, broadcast_notification(), list_notifications(), mark_all_read(), mark_read(), delete, get (+31 more)

### Community 25 - "verification_step_content.dart"
Cohesion: 0.09
Nodes (22): aiStepIndex, aiSteps, analysisResult, blurScore, brightnessScore, build, camera, cameraError (+14 more)

### Community 26 - "notification_service.dart"
Cohesion: 0.05
Nodes (39): Box, dart:convert, WebSocketService, addToQueue, cacheProfile, cacheSystemConfig, clearAll, _configBox (+31 more)

### Community 27 - "sessions/page.tsx"
Cohesion: 0.07
Nodes (34): AnomalyCard(), AnomalyCardProps, getRiskLevel(), WEEKDAYS, TeacherClassesPage(), ActiveSessionBanner(), ActiveSessionBannerProps, TeacherDashboardPage() (+26 more)

### Community 28 - "geofence_verification_provider.dart"
Cohesion: 0.06
Nodes (35): AutoDisposeNotifier, dart:math, describeDistance, GeofenceCalculator, isWithinGeofence, describeDistance, ensurePermissionsGranted, getAveragedPosition (+27 more)

### Community 29 - "verification_camera_frame.dart"
Cohesion: 0.11
Nodes (17): CameraController?, build, camera, cameraError, isCameraReady, onDismissTips, onRetryCamera, showTips (+9 more)

### Community 30 - "class_session_card.dart"
Cohesion: 0.04
Nodes (46): class, Container, FormState, _confirmPasswordController, createState, dispose, _formKey, _newPasswordController (+38 more)

### Community 31 - "_handle_generic_err"
Cohesion: 0.17
Nodes (37): assign_teacher(), bulk_create_classes(), bulk_create_classrooms(), bulk_create_departments(), bulk_create_designations(), bulk_create_students(), bulk_create_subjects(), bulk_create_teachers() (+29 more)

### Community 32 - "auth_repository.dart"
Cohesion: 0.05
Nodes (43): DeviceInfoPlugin, Dio, AuthApi, authApiProvider, changePassword, _dio, getProfile, login (+35 more)

### Community 33 - "student_api.dart"
Cohesion: 0.08
Nodes (23): dart:io, analyzeAttendance, confirmAttendance, createLeaveRequest, _dio, getLeaderboard, getMyAttendance, getMyClasses (+15 more)

### Community 34 - "String?"
Cohesion: 0.06
Nodes (31): List, NotificationsNotifier, activeStepIndex, build, stepLabels, subtitle, title, VerificationStatusOverlay (+23 more)

### Community 35 - "websocket_service.dart"
Cohesion: 0.06
Nodes (30): authState, _channel, connect, disconnect, dispose, _maxReconnectAttempts, _messageController, messageStream (+22 more)

### Community 36 - "router.dart"
Cohesion: 0.06
Nodes (34): ChangeNotifier, GoRouter, notifier, notify, rootNavigatorKey, RouterNotifier, routerNotifierProvider, shellNavigatorKey (+26 more)

### Community 37 - "verification_screen.dart"
Cohesion: 0.07
Nodes (39): ConsumerState, ConsumerStatefulWidget, hiveServiceProvider, preferencesServiceProvider, attendanceRepositoryProvider, attendanceVerificationProvider, geofenceVerificationProvider, FlaggedDetailScreen (+31 more)

### Community 38 - "package:flutter_riverpod/flutter_riverpod.dart"
Cohesion: 0.13
Nodes (16): StudentApi, _api, copyWith, data, errorMessage, fetch, isLoading, LeaderboardNotifier (+8 more)

### Community 39 - "package:flutter/material.dart"
Cohesion: 0.06
Nodes (30): slideRightPage, slideUpPage, build, child, ShellScaffold, _tabPaths, build, email (+22 more)

### Community 40 - "flagged_detail_screen.dart"
Cohesion: 0.08
Nodes (24): attendanceId, build, createState, dispose, initState, _isLoading, _isSubmitting, item (+16 more)

### Community 41 - "package:smart_attendance_app/app/theme.dart"
Cohesion: 0.06
Nodes (37): build, build, _buildItem, LeaveHistoryStats, leaves, build, leave, LeaveHistoryTile (+29 more)

### Community 42 - "attendance.dart"
Cohesion: 0.06
Nodes (33): activeSessionId, attendanceId, backgroundScore, classId, className, createdAt, faceScore, finalAiScore (+25 more)

### Community 43 - "schemas/admin.py"
Cohesion: 0.11
Nodes (25): AbsenteeAnomalyItem, AssignTeacherRequest, AuditLogResponse, ClassBulkCreateRequest, ClassBulkItem, ClassCreate, ClassroomBulkCreateRequest, ClassroomBulkItem (+17 more)

### Community 44 - "audit/page.tsx"
Cohesion: 0.09
Nodes (26): AuditPage(), ClassesPage(), StudentsPage(), TeachersPage(), ActivityDetailModal(), ActivityDetailModalProps, ActivityCategory, ActivityFilterBar() (+18 more)

### Community 45 - "app.dart"
Cohesion: 0.09
Nodes (30): build, createState, dispose, _handleNotificationClick, inferNotificationSeverity, _initializeFcm, initState, kSeverityInfo (+22 more)

### Community 46 - "Color"
Cohesion: 0.05
Nodes (37): Animation, Color, dart:ui, animation, build, hint, icon, label (+29 more)

### Community 47 - "geofence_status_card.dart"
Cohesion: 0.14
Nodes (12): build, _buildChip, GeofenceDistanceMetrics, state, statusColor, build, GeofenceStatusCard, onRetry (+4 more)

### Community 48 - "auth_provider.dart"
Cohesion: 0.07
Nodes (26): dart:async, AppEvents, _authErrorController, authErrorStream, broadcastAuthError, AuthStatus, _authErrorSubscription, AuthNotifier (+18 more)

### Community 49 - "session_provider.dart"
Cohesion: 0.06
Nodes (33): computeRouterRedirect, null, _adjustPollInterval, _api, classId, className, _currentInterval, dispose (+25 more)

### Community 50 - "api/admin.py"
Cohesion: 0.08
Nodes (26): app_core_rate_limit, export_audit_logs(), get_admin_stats(), get_audit_logs(), get_class_by_id(), get_classes(), get_classroom(), get_classrooms() (+18 more)

### Community 51 - "frontend/package.json"
Cohesion: 0.08
Nodes (25): eslintConfig, name, private, version, axios, clsx, eslint, eslint-config-next (+17 more)

### Community 52 - "attendance_provider.dart"
Cohesion: 0.07
Nodes (27): DateTimeFormatting, formattedDate, formattedDateTime, isSameDay, shortDate, StringFormatting, truncate, accuracy (+19 more)

### Community 53 - "offline_sync_service.dart"
Cohesion: 0.05
Nodes (43): HiveService, NotificationService, _className, _connectivitySub, _deleteImageFile, _dio, dispose, _handleSyncError (+35 more)

### Community 54 - "api/teacher.py"
Cohesion: 0.12
Nodes (33): app_services_leave_service, app_services_session_service, approve_device_change(), approve_leave(), bulk_mark_attendance(), export_class_attendance(), get_absent_students(), get_attendance_by_id() (+25 more)

### Community 55 - "result_config.dart"
Cohesion: 0.08
Nodes (24): background, color, error, face, flagged, icon, liveness, offline (+16 more)

### Community 56 - "package:smart_attendance_app/shared/widgets/animated_background.dart"
Cohesion: 0.04
Nodes (46): LeaderboardEntry, _buildBody, _buildUserSummaryCard, build, _buildRankBadge, entry, isCurrentUser, LeaderboardItemCard (+38 more)

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
Cohesion: 0.06
Nodes (48): asyncio, _load_liveness_model(), Any, Service Health & Connectivity Checker Checks AWS S3 and PostgreSQL RDS…, boto3, botocore_config, botocore_exceptions, cv2 (+40 more)

### Community 62 - "geofence_radar_indicator.dart"
Cohesion: 0.13
Nodes (14): CustomPainter, GeofenceStatus, build, color, createState, dispose, _iconForStatus, initState (+6 more)

### Community 63 - "VoidCallback?"
Cohesion: 0.05
Nodes (36): EdgeInsetsGeometry, build, isSecondaryGhost, onPrimaryPressed, onSecondaryPressed, primaryIcon, primaryLabel, secondaryIcon (+28 more)

### Community 64 - "notification_api.dart"
Cohesion: 0.08
Nodes (23): category, createdAt, deleteNotification, _dio, fromJson, getNotifications, id, isRead (+15 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (23): bin, dev, setup, description, name, private, scripts, backend:setup (+15 more)

### Community 66 - "history_provider.dart"
Cohesion: 0.09
Nodes (23): PendingCountNotifier, data, errorMessage, fetch, HistoryNotifier, HistoryState, isLoading, notifier (+15 more)

### Community 67 - "test_api_admin.py"
Cohesion: 0.11
Nodes (15): app_schemas_master_data, app_schemas_pagination, AdminStatsResponse, BulkImportResponse, DepartmentResponse, PaginatedResponse, PaginationParams, BaseModel (+7 more)

### Community 68 - "@playwright/test"
Cohesion: 0.12
Nodes (6): ClassInput, StudentInput, TeacherInput, TeacherAnalyticsPage, TeacherHistoryPage, @playwright/test

### Community 69 - "history/page.tsx"
Cohesion: 0.08
Nodes (25): GENDER_OPTIONS, SEMESTER_OPTIONS, StudentFormFields(), StudentFormFieldsProps, EditStudentFormFields(), EditStudentFormFieldsProps, GENDER_OPTIONS, SEMESTER_OPTIONS (+17 more)

### Community 70 - "attendance_constants.dart"
Cohesion: 0.09
Nodes (21): kAttendanceTypeLocal, kAttendanceTypePush, kGoodScoreThreshold, kImagePickQuality, kMinBrightnessForPhoto, kMinSharpnessForPhoto, kNoteMaxChars, kOverallGoodPct (+13 more)

### Community 71 - "main.py"
Cohesion: 0.07
Nodes (33): app_api, app_core_config, app_middleware_request_logging, app_services_scheduler, connect_db(), disconnect_db(), connect_redis(), disconnect_redis() (+25 more)

### Community 72 - "GeofenceControls.tsx"
Cohesion: 0.21
Nodes (8): ScannerControls(), ScannerControlsProps, downloadCsv(), GeofenceControls(), GeofenceControlsProps, GlassSlider(), GlassSliderProps, frontend_src_types_index_attendanceexportrow

### Community 73 - "offline_payload.dart"
Cohesion: 0.11
Nodes (19): @HiveType, HiveObject, hashCode, OfflineAttendancePayloadAdapter, operator, read, typeId, write (+11 more)

### Community 74 - "BasePage"
Cohesion: 0.13
Nodes (3): BasePage, TeacherClassesPage, TeacherLeavesPage

### Community 75 - "leaderboard.dart"
Cohesion: 0.11
Nodes (19): int?, AppException, AuthException, message, NetworkException, ServerException, statusCode, toString (+11 more)

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

### Community 81 - "notification_tile.dart"
Cohesion: 0.07
Nodes (24): Map, LocalNotification, build, CalendarMonthGrid, focusedMonth, grouped, onSelectDate, selectedDate (+16 more)

### Community 82 - "secure_storage.dart"
Cohesion: 0.17
Nodes (11): FlutterSecureStorage, clearAll, getDeviceUUID, getRole, getToken, saveDeviceUUID, saveToken, saveUserRole (+3 more)

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

### Community 87 - "LeaveRepository"
Cohesion: 0.33
Nodes (3): LeaveRepository, LeaveService, LeaveRequest

### Community 88 - "leave_requests_screen.dart"
Cohesion: 0.08
Nodes (24): File?, build, createState, dispose, _endDate, _isSubmitting, LeaveRequestsScreen, _LeaveRequestsScreenState (+16 more)

### Community 89 - "reset_password_provider.dart"
Cohesion: 0.12
Nodes (16): AuthRepository, copyWith, email, errorMessage, isSubmitting, isSuccess, isValid, isVerifying (+8 more)

### Community 90 - "SessionService"
Cohesion: 0.15
Nodes (9): AcademicClass, start_session(), ClassRepository, SessionResponse, SessionStart, SessionScheduler, Mark session as inactive, delete from Redis, and mark all unsubmitted students…, SessionService (+1 more)

### Community 91 - "smart_pass_screen.dart"
Cohesion: 0.19
Nodes (12): smartPassProvider, build, _buildErrorBanner, _buildScannerViewfinder, _buildSuccessCard, createState, _infoRow, SmartPassScreen (+4 more)

### Community 92 - "conftest.py"
Cohesion: 0.19
Nodes (13): AwaitableMock, mock_academic_class(), mock_admin_user(), mock_redis(), mock_student_profile(), mock_student_user(), mock_teacher_profile(), mock_teacher_user() (+5 more)

### Community 93 - "form.tsx"
Cohesion: 0.18
Nodes (13): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+5 more)

### Community 94 - "test-fixtures.ts"
Cohesion: 0.45
Nodes (4): frontend_e2e_fixtures_test_fixtures_expect, generateYopmail(), test, TEST_CREDENTIALS

### Community 95 - "typing"
Cohesion: 0.13
Nodes (9): app_db_client, LeaveRequestCreate, field_validator, date, datetime, prisma_models, pydantic, pydantic_settings (+1 more)

### Community 96 - "SeedingConfig"
Cohesion: 0.23
Nodes (9): main(), run_pipeline(), BaseModel, SeedingConfig, _validate_local_url(), clean_database(), _hash_password(), Database Cleaner for Local Test Environment. Provides clean slate wiping for… (+1 more)

### Community 97 - "device_change_dialog.dart"
Cohesion: 0.16
Nodes (14): dioProvider, deviceServiceProvider, build, createState, DeviceChangeDialog, _DeviceChangeDialogState, dispose, email (+6 more)

### Community 98 - "authProvider"
Cohesion: 0.12
Nodes (22): notificationsLoadingProvider, notificationsProvider, pendingCountProvider, authProvider, build, _handleSubmit, build, _handleLogin (+14 more)

### Community 99 - "absentee_scanner.py"
Cohesion: 0.24
Nodes (11): app_services_absentee_scanner, scan_absentee_anomalies(), _detect_pattern(), Any, run_absentee_scan(), _run_isolation_forest(), asyncio, test_run_absentee_scan_detects_outliers() (+3 more)

### Community 100 - "SessionRepository"
Cohesion: 0.12
Nodes (8): GeofenceRepository, datetime, SessionRepository, AIOrchestrator, _load_and_crop(), Geofence, ndarray, Session

### Community 101 - "dropdown-menu.tsx"
Cohesion: 0.15
Nodes (12): DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuSeparator, DropdownMenuSub (+4 more)

### Community 102 - "verification_step_bottom_bar.dart"
Cohesion: 0.11
Nodes (18): VerificationStep, build, build, isCameraReady, onAnalyze, onCapture, onRetake, onSubmit (+10 more)

### Community 104 - "reset_password_screen.dart"
Cohesion: 0.13
Nodes (19): resetPasswordProvider, build, _buildInvalidCard, _buildLoadingCard, _buildResetForm, _confirmCtrl, createState, dispose (+11 more)

### Community 105 - "verification_preview_frame.dart"
Cohesion: 0.18
Nodes (10): bool get, double?, blurScore, brightnessScore, build, imagePath, isAnalyzingQuality, isPoorQuality (+2 more)

### Community 106 - "student_stats.dart"
Cohesion: 0.18
Nodes (10): absentCount, attendancePercentage, currentStreak, excusedCount, flaggedCount, fromJson, highestStreak, presentCount (+2 more)

### Community 107 - "face_registration_screen.dart"
Cohesion: 0.14
Nodes (16): registrationProvider, build, _cameraController, _cameraError, _capturedPath, _capturePhoto, createState, dispose (+8 more)

### Community 108 - "manifest.json"
Cohesion: 0.18
Nodes (10): background_color, description, display, icons, name, orientation, prefer_related_applications, short_name (+2 more)

### Community 109 - "email_service.py"
Cohesion: 0.17
Nodes (10): aiosmtplib, app_core_url_resolver, Request, Dynamically resolves the frontend base URL for email links, redirects, and…, resolve_frontend_url(), EmailService, Any, email_mime_multipart (+2 more)

### Community 111 - "PageObjects"
Cohesion: 0.20
Nodes (3): PageObjects, TeacherDeviceChangesPage, TeacherProfilePage

### Community 112 - "glass_button.dart"
Cohesion: 0.12
Nodes (16): background, border, build, _ButtonColors, foreground, GlassButton, GlassButtonVariant, height (+8 more)

### Community 113 - "button.tsx"
Cohesion: 0.24
Nodes (8): Badge(), BadgeProps, badgeVariants, Button, ButtonProps, buttonVariants, class-variance-authority, @radix-ui/react-slot

### Community 117 - "AttendanceTrendChart.tsx"
Cohesion: 0.22
Nodes (5): monthlyData, MonthlyDataPoint, breakdownData, BreakdownItem, recharts

### Community 118 - "AdminSetupService"
Cohesion: 0.18
Nodes (8): AdminSetupService, Any, AsyncClient, Creates classroom and laboratory venues., Logs into admin account and acquires JWT access token., Creates institutional departments., Creates academic designations., Creates academic subjects (Theory & Practical).

### Community 120 - "SystemConfigService"
Cohesion: 0.14
Nodes (12): app_repositories_system_config_repo, patch, update_system_config(), Gets the system configuration. If it doesn't exist, creates a default one., SystemConfigRepository, SystemConfigService, fromJson, isAiBackgroundValidationEnabled (+4 more)

### Community 121 - "home_screen.dart"
Cohesion: 0.16
Nodes (15): sessionProvider, createState, didChangeAppLifecycleState, dispose, HomeScreen, _HomeScreenState, initState, package:smart_attendance_app/features/home/providers/session_provider.dart (+7 more)

### Community 124 - "SessionSimulationService"
Cohesion: 0.29
Nodes (6): Any, AsyncClient, Acquires auth tokens for faculty members to drive session endpoints., Categorizes students into Exemplary (~60%), Irregular (~25%), and Defaulter…, Runs the multi-day attendance simulation across classes., SessionSimulationService

### Community 125 - "Agent Guidelines & Engineering Standards"
Cohesion: 0.29
Nodes (6): 1. Environment & Configuration Sync, 2. No Hardcoding, 3. No Patches on Patches (Clean Code First), 4. File Structure & Quality Rules, 5. Version Control & Automated Delivery, Agent Guidelines & Engineering Standards

### Community 126 - "test_service_admin.py"
Cohesion: 0.17
Nodes (9): app_schemas_admin, app_services_admin_service, field_validator, StudentCreate, asyncio, test_admin_service_create_student(), test_admin_service_create_teacher(), test_admin_service_enroll_students() (+1 more)

### Community 127 - "models.ts"
Cohesion: 0.19
Nodes (11): DeviceChangesPage(), DeviceChangeTable(), DeviceChangeTableProps, ClassCreate, ClassroomCreate, DepartmentCreate, DesignationCreate, DeviceChangeRequest (+3 more)

### Community 134 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, start, test, test:watch

### Community 135 - "info_banner.dart"
Cohesion: 0.14
Nodes (13): actionLabel, _BannerConfig, BannerSeverity, build, color, customIcon, icon, InfoBanner (+5 more)

### Community 136 - "vitest"
Cohesion: 0.20
Nodes (6): frontend_node_modules_playwright_test_index, ref_fs, ref_path, @testing-library/jest-dom, @vitejs/plugin-react, vitest

### Community 138 - "StudentEnrollmentService"
Cohesion: 0.27
Nodes (6): Any, AsyncClient, Builds student specification objects with PRNs and @yopmail.com emails., Creates cohorts for Division A and Division B in CSE., Enrolls students into appropriate theory sections and practical lab batches., StudentEnrollmentService

### Community 139 - "Settings"
Cohesion: 0.33
Nodes (3): field_validator, Settings, BaseSettings

### Community 140 - "test_api_teacher.py"
Cohesion: 0.19
Nodes (6): GeofenceResponse, SmartPassVerifyResponse, TeacherSmartPassResponse, test_get_session_smart_pass(), test_upsert_geofence(), test_verify_smart_pass()

### Community 141 - "LogEvent"
Cohesion: 0.32
Nodes (5): ingest_log(), post, LogEvent, BaseModel, field_validator

### Community 142 - "app_notification.dart"
Cohesion: 0.15
Nodes (12): body, category, copyWith, fromMap, id, isRead, link, severity (+4 more)

### Community 150 - "history_list_tab.dart"
Cohesion: 0.17
Nodes (12): build, createState, dispose, _filter, HistoryListTab, _HistoryListTabState, hState, ListStatusFilter (+4 more)

### Community 151 - "verification_camera_mixin.dart"
Cohesion: 0.18
Nodes (10): blurScore, brightnessScore, camera, cameraError, disposeCamera, initCamera, isAnalyzingQuality, isCameraReady (+2 more)

### Community 152 - "streak_counter.dart"
Cohesion: 0.25
Nodes (7): build, _buildCompactView, _buildFullView, currentStreak, highestStreak, isCompact, StreakCounter

### Community 154 - "summary_reporter.py"
Cohesion: 0.25
Nodes (7): rich, rich_panel, rich_table, print_final_summary(), Any, Summary Reporting & Terminal Dashboard Module. Renders final summary tables and…, Prints beautiful formatted terminal summary tables using rich.

### Community 155 - "EdgeWorkflowsService"
Cohesion: 0.29
Nodes (5): EdgeWorkflowsService, Any, AsyncClient, Simulates student device changes and teacher resolution., Simulates student leave submissions and teacher review queue processing.

### Community 156 - "YopmailClient"
Cohesion: 0.14
Nodes (10): BrowserContext, Page, Any, AsyncClient, Provisions faculty accounts with @yopmail.com emails and verifies them., Creates academic classes and links teachers and rooms., TeacherOnboardingService, Automates Yopmail web UI to extract the onboarding/reset token. (+2 more)

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
- **1433 isolated node(s):** `ClassInput`, `StudentInput`, `TeacherInput`, `eslintConfig`, `nextConfig` (+1428 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1999 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **46 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminService` connect `api/admin.py` to `get_logger`, `test_api_admin.py`, `schemas/admin.py`, `api/auth.py`, `._log_action`, `SessionService`, `test_service_admin.py`, `_handle_generic_err`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `api.ts`, `history/page.tsx`, `dropdown-menu.tsx`, `reset-password/page.tsx`, `types/index.ts`, `GeofenceControls.tsx`, `useBulkImportProcessor.ts`, `useAuthStore`, `audit/page.tsx`, `cn`, `GeofenceMap.tsx`, `button.tsx`, `frontend/package.json`, `AttendanceTrendChart.tsx`, `sessions/page.tsx`, `form.tsx`, `models.ts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `@playwright/test` connect `@playwright/test` to `AdminClassroomsPage`, `AdminDepartmentsPage`, `AdminDesignationsPage`, `AdminSubjectsPage`, `LoginPage`, `AdminAuditPage`, `AdminOverviewPage`, `AdminScannerPage`, `BulkImportComponent`, `ForgotPasswordPage`, `ResetPasswordPage`, `TeacherOverviewPage`, `TeacherReviewPage`, `frontend/package.json`, `BasePage`, `test-fixtures.ts`, `PageObjects`, `AdminVerificationSettingsPage`, `TeacherSessionsPage`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Are the 59 inferred relationships involving `AdminService` (e.g. with `assign_teacher()` and `bulk_create_classes()`) actually correct?**
  _`AdminService` has 59 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ClassInput`, `StudentInput`, `TeacherInput` to the rest of the system?**
  _1433 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TeacherService` be split into smaller, more focused modules?**
  _Cohesion score 0.1423076923076923 - nodes in this community are weakly interconnected._
- **Should `getApiErrorMessage` be split into smaller, more focused modules?**
  _Cohesion score 0.030855539971949508 - nodes in this community are weakly interconnected._