# Graph Report - Smart Attandance System  (2026-10-03)

## Corpus Check
- 562 files · ~686,723 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 31 file(s) not represented in the graph (top: (none) 9, .xml 7, .example 5)

## Summary
- 4529 nodes · 10443 edges · 195 communities (144 shown, 51 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 399 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8455566c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- test_api_teacher.py
- getApiErrorMessage
- api.ts
- ProvisionTenantModal.tsx
- package:smart_attendance_app/shared/widgets/glass_card.dart
- create_access_token
- api/student.py
- classes/[id]/edit/page.tsx
- get_current_user
- enroll/page.tsx
- cn
- attendance_service.py
- api/auth.py
- class_session_card.dart
- api/teacher.py
- setup.mjs
- verification_ai_review_card.dart
- smart_pass_provider.dart
- result_config.dart
- auth_repository.dart
- AdminService
- ApiClient
- theme.dart
- preferences_service.dart
- notifications.py
- verification_step_content.dart
- notification_service.dart
- ai_orchestrator.py
- leaderboard_screen.dart
- StudentRepository
- login_screen.dart
- _handle_generic_err
- StatelessWidget
- types/index.ts
- main.dart
- websocket_service.dart
- router.dart
- verification_screen.dart
- home_screen.dart
- menu_grid_item.dart
- analytics/page.tsx
- typing
- attendance.dart
- test_api_admin.py
- audit/page.tsx
- master_data.py
- app.dart
- secure_storage.dart
- auth_provider.dart
- session_provider.dart
- api/admin.py
- frontend/package.json
- react
- package:flutter_riverpod/flutter_riverpod.dart
- AuthService
- StudentCreate
- notification_tile.dart
- glass_input.dart
- dependencies
- BulkImportModal.tsx
- attendance_utils.dart
- seed_and_simulate.py
- geofence_status_card.dart
- SuperAdminPage
- notification_api.dart
- scripts
- attendance_provider.dart
- adb_login_and_capture.py
- BasePage
- flagged_detail_screen.dart
- attendance_constants.dart
- resolve_frontend_url
- SessionService
- offline_payload.dart
- TeacherClassesPage
- DeepInteractiveRunner
- AttendanceRepository
- GamificationService
- devDependencies
- GeofenceMap.tsx
- compilerOptions
- glass_button.dart
- offline_sync_service.dart
- 🚀 Key Features
- TeacherService
- smart_pass.dart
- os
- SuperAdminTenantsPage
- leave_requests_screen.dart
- build
- leave_request.dart
- smart_pass_screen.dart
- conftest.py
- form.tsx
- test-fixtures.ts
- preferences_provider.dart
- adb_mobile_screen_tester.py
- TeacherHistoryPage
- TeacherLeavesPage
- run_absentee_scan
- AIOrchestrator
- dropdown-menu.tsx
- datetime
- ConnectionManager
- reset_password_screen.dart
- student_api.dart
- student_stats.dart
- String?
- manifest.json
- package:flutter/material.dart
- S3Service
- PageObjects
- history_list_tab.dart
- badge.tsx
- AdminClassesPage
- AdminTeachersPage
- AdminVerificationSettingsPage
- AttendanceTrendChart.tsx
- db_cleaner.py
- TestRunner
- SystemConfigService
- BroadcastNotificationModal.tsx
- TeacherSessionsPage
- E2ETestRunner
- SessionSimulationService
- Agent Guidelines & Engineering Standards
- TeacherCreate
- .generate_student_specs
- AdminStudentsPage
- AdminClassroomsPage
- AdminDepartmentsPage
- AdminDesignationsPage
- AdminSubjectsPage
- LoginPage
- scripts
- device_change_dialog.dart
- leaderboard.dart
- ref_playwright
- AdminSetupService
- Settings
- permission_service.dart
- get_redis
- scanner/page.tsx
- AdminAuditPage
- AdminOverviewPage
- Sidebar.tsx
- BulkImportComponent
- ForgotPasswordPage
- ResetPasswordPage
- TeacherOverviewPage
- history_provider.dart
- CommandPaletteModal.tsx
- test_mobile_smart_pass_emulator.py
- authStore.ts
- app_notification.dart
- vitest
- useAuthStore
- WebSocketClient
- MobileE2ERunner
- middleware.ts
- logger.ts
- location_exceptions.dart
- app/layout.tsx
- FlutterActivity
- frontend/README.md
- summary_reporter.py
- smart_attendance_app
- NotificationItemRow.tsx
- rules/graphify.md
- workflows/graphify.md
- backend/README.md
- (auth)/layout.tsx
- postcss.config.mjs
- global_exception_handler
- .simulate_device_changes
- ref_path
- seed/__init__.py
- .onboard_teachers
- AttendanceRepository
- DateTime?
- Exception
- LeaderboardResponse?
- T
- PasswordRequirementsChecklist.tsx
- .complete_onboarding_in_browser
- LeaveRequestCreate
- PaginatedResponse
- RouterNotifier
- constants.dart
- app_middleware_request_logging

## God Nodes (most connected - your core abstractions)
1. `react` - 166 edges
2. `getApiErrorMessage()` - 149 edges
3. `lucide-react` - 117 edges
4. `AdminService` - 115 edges
5. `cn()` - 95 edges
6. `next` - 72 edges
7. `api` - 67 edges
8. `applyValidationErrorsToForm()` - 63 edges
9. `TeacherService` - 61 edges
10. `react-hot-toast` - 60 edges

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

## Communities (195 total, 51 thin omitted)

### Community 0 - "test_api_teacher.py"
Cohesion: 0.12
Nodes (31): app_schemas_attendance, app_schemas_leave, AbsentStudentItem, AcademicClassWithGeofenceResponse, AttendanceManualOverride, AttendanceMatrixResponse, AttendanceMatrixSessionItem, AttendanceMatrixStudentItem (+23 more)

### Community 1 - "getApiErrorMessage"
Cohesion: 0.03
Nodes (77): ForgotPasswordPage(), handleResend(), onSubmit(), LoginPage(), handleSuccessRedirect(), onSubmit(), OnboardingContent(), checkToken() (+69 more)

### Community 2 - "api.ts"
Cohesion: 0.07
Nodes (79): VerifyData, VerifyData, CreateClassroomPage(), onSubmit(), CreateDepartmentPage(), onSubmit(), CreateDesignationPage(), onSubmit() (+71 more)

### Community 3 - "ProvisionTenantModal.tsx"
Cohesion: 0.08
Nodes (39): SuperAdminDashboardPage(), ProvisionTenantModal(), handleSubmit(), ProvisionTenantModalProps, SuperAdminKpiStrip(), SuperAdminKpiStripProps, TenantFilterBar(), statusToVariant() (+31 more)

### Community 4 - "package:smart_attendance_app/shared/widgets/glass_card.dart"
Cohesion: 0.02
Nodes (98): AttendanceHistoryItem, AttendanceHistoryResponse, AnalyticsKpiOverview, build, data, target, AnalyticsSubjectGoals, build (+90 more)

### Community 5 - "create_access_token"
Cohesion: 0.11
Nodes (31): app_repositories_geofence_repo, app_utils_geofencing, create_access_token(), decode_access_token(), Any, verify_password(), GeofenceRepository, GeofenceValidator (+23 more)

### Community 6 - "api/student.py"
Cohesion: 0.07
Nodes (52): app_schemas_student, app_services_student_service, get_current_student(), Student, analyze_attendance(), confirm_attendance(), create_leave_request(), get_leaderboard() (+44 more)

### Community 7 - "classes/[id]/edit/page.tsx"
Cohesion: 0.07
Nodes (37): SEMESTER_OPTIONS, GENDER_OPTIONS, SEMESTER_OPTIONS, StudentFormFields(), StudentFormFieldsProps, EditStudentFormFields(), EditStudentFormFieldsProps, GENDER_OPTIONS (+29 more)

### Community 8 - "get_current_user"
Cohesion: 0.25
Nodes (6): get_current_teacher(), get_current_user(), Teacher, User, RoleChecker, test_role_checker()

### Community 9 - "enroll/page.tsx"
Cohesion: 0.10
Nodes (21): EnrollHeader(), EnrollHeaderProps, EnrollStudentFilters(), EnrollStudentFiltersProps, EnrollStudentRow(), EnrollStudentRowProps, DeviceChangesPage(), DeviceChangeTable() (+13 more)

### Community 10 - "cn"
Cohesion: 0.06
Nodes (47): ManualAttendanceStudentRow(), ManualAttendanceStudentRowProps, Button, ButtonProps, buttonVariants, Card, CardContent, CardDescription (+39 more)

### Community 11 - "attendance_service.py"
Cohesion: 0.08
Nodes (20): app_repositories_attendance_repo, app_repositories_enrollment_repo, app_repositories_leave_repo, app_repositories_session_repo, app_services_ai_orchestrator, app_services_attendance_attendance_notifier, app_services_attendance_attendance_recorder, app_services_attendance_geofence_validator (+12 more)

### Community 12 - "api/auth.py"
Cohesion: 0.07
Nodes (44): app_schemas_system_config, app_services_auth_service, app_services_device_change_service, change_password(), complete_onboarding(), forgot_password(), get_me(), get_public_system_config() (+36 more)

### Community 13 - "class_session_card.dart"
Cohesion: 0.07
Nodes (28): bool get, blurScore, brightnessScore, build, imagePath, isAnalyzingQuality, isPoorQuality, VerificationPreviewFrame (+20 more)

### Community 14 - "api/teacher.py"
Cohesion: 0.10
Nodes (39): app_services_attendance_service, app_services_leave_service, app_services_session_service, approve_device_change(), approve_leave(), bulk_mark_attendance(), export_class_attendance(), get_absent_students() (+31 more)

### Community 15 - "setup.mjs"
Cohesion: 0.07
Nodes (45): ref_node_child_process, ref_node_crypto, ref_node_fs, ref_node_path, ref_node_url, checkVenvPythonVersion(), createPython311Venv(), ensureBackendDirectories() (+37 more)

### Community 16 - "verification_ai_review_card.dart"
Cohesion: 0.03
Nodes (73): Animation, AnimationController, CustomPainter, AttendanceAnalysisResult, GeofenceStatus, build, createState, desc (+65 more)

### Community 17 - "smart_pass_provider.dart"
Cohesion: 0.05
Nodes (47): AutoDisposeNotifier, dart:math, StudentApi, describeDistance, GeofenceCalculator, isWithinGeofence, describeDistance, ensurePermissionsGranted (+39 more)

### Community 18 - "result_config.dart"
Cohesion: 0.08
Nodes (24): background, color, error, face, flagged, icon, liveness, offline (+16 more)

### Community 19 - "auth_repository.dart"
Cohesion: 0.06
Nodes (34): dart:io, DeviceInfoPlugin, dio, _extractDetail, mapDioError, normalizedBaseUrl, storage, _deviceInfo (+26 more)

### Community 20 - "AdminService"
Cohesion: 0.05
Nodes (23): app_services_admin_audit_export_service, app_services_admin_bulk_import_service, app_services_admin_class_admin_service, app_services_admin_classroom_service, app_services_admin_department_service, app_services_admin_designation_service, app_services_admin_student_admin_service, app_services_admin_subject_service (+15 more)

### Community 21 - "ApiClient"
Cohesion: 0.11
Nodes (33): argparse, main(), parse_arguments(), ApiClient, Any, Exception, Authenticate user against /auth/login and store JWT access token., SeederApiError (+25 more)

### Community 22 - "theme.dart"
Cohesion: 0.04
Nodes (45): accentAmber, accentEmerald, accentPink, accentTeal, baseText, bgCanvas, bgPrimary, bgSecondary (+37 more)

### Community 23 - "preferences_service.dart"
Cohesion: 0.08
Nodes (24): getAttendanceTarget, getLowAttendanceThreshold, getNotifyClassStart, getNotifyLowAttendance, getNotifySyncDone, getNotifyWindowOpen, isFirstCameraUse, _keyAttendanceTarget (+16 more)

### Community 24 - "notifications.py"
Cohesion: 0.08
Nodes (38): app_schemas_common, app_schemas_notification, app_services_notification_service, broadcast_notification(), list_notifications(), mark_all_read(), mark_read(), delete (+30 more)

### Community 25 - "verification_step_content.dart"
Cohesion: 0.05
Nodes (40): VerificationStep, build, build, isCameraReady, onAnalyze, onCapture, onRetake, onSubmit (+32 more)

### Community 26 - "notification_service.dart"
Cohesion: 0.08
Nodes (23): WebSocketService, addNotification, _api, _box, clear, clearAll, deleteNotification, dispose (+15 more)

### Community 27 - "ai_orchestrator.py"
Cohesion: 0.18
Nodes (9): _load_liveness_model(), Any, cv2, deepface, huggingface_hub, numpy, shutil, tensorflow_keras_applications_mobilenet (+1 more)

### Community 28 - "leaderboard_screen.dart"
Cohesion: 0.10
Nodes (19): LeaderboardEntry, leaderboardProvider, build, _buildBody, _buildUserSummaryCard, LeaderboardScreen, AnalyticsLeaderboardTile, build (+11 more)

### Community 29 - "StudentRepository"
Cohesion: 0.09
Nodes (12): AcademicClass, ClassRepository, EnrollmentRepository, Student, StudentRepository, Teacher, TeacherRepository, User (+4 more)

### Community 30 - "login_screen.dart"
Cohesion: 0.04
Nodes (60): class, FormState, notificationsLoadingProvider, notificationsProvider, pendingCountProvider, authProvider, build, _confirmPasswordController (+52 more)

### Community 31 - "_handle_generic_err"
Cohesion: 0.17
Nodes (37): assign_teacher(), bulk_create_classes(), bulk_create_classrooms(), bulk_create_departments(), bulk_create_designations(), bulk_create_students(), bulk_create_subjects(), bulk_create_teachers() (+29 more)

### Community 32 - "StatelessWidget"
Cohesion: 0.03
Nodes (74): Color, IconData?, build, goodThreshold, label, value, VerificationQualityBar, HomeEmptyClasses (+66 more)

### Community 33 - "types/index.ts"
Cohesion: 0.06
Nodes (49): TeacherClassesPage(), ActiveSessionBanner(), ActiveSessionBannerProps, TeacherDashboardPage(), ActiveSessionsCard(), ActiveSessionsCardProps, SessionRosterPage(), getRosterColumns() (+41 more)

### Community 34 - "main.dart"
Cohesion: 0.06
Nodes (29): @pragma, dart:async, HttpOverrides, AppEvents, _authErrorController, authErrorStream, broadcastAuthError, addNotification (+21 more)

### Community 35 - "websocket_service.dart"
Cohesion: 0.06
Nodes (34): computeRouterRedirect, null, authState, _channel, connect, disconnect, dispose, _maxReconnectAttempts (+26 more)

### Community 36 - "router.dart"
Cohesion: 0.06
Nodes (32): GoRouter, notifier, notify, rootNavigatorKey, routerNotifierProvider, shellNavigatorKey, NavigatorState, package:smart_attendance_app/app/page_transitions.dart (+24 more)

### Community 37 - "verification_screen.dart"
Cohesion: 0.05
Nodes (46): ConsumerState, double?, hiveServiceProvider, preferencesServiceProvider, attendanceVerificationProvider, geofenceVerificationProvider, ResultScreen, blurScore (+38 more)

### Community 38 - "home_screen.dart"
Cohesion: 0.04
Nodes (61): ConsumerStatefulWidget, ConsumerWidget, AnalyticsScreen, _AnalyticsScreenState, build, createState, initState, VerificationScreen (+53 more)

### Community 39 - "menu_grid_item.dart"
Cohesion: 0.09
Nodes (20): build, categories, LeaveCategorySelector, onSelected, selectedCategory, build, currentIndex, GlassBottomNav (+12 more)

### Community 40 - "analytics/page.tsx"
Cohesion: 0.07
Nodes (38): ActiveTab, LeaveDocumentModal(), LeaveDocumentModalProps, LeaveReviewDialog(), LeaveReviewDialogProps, AnalyticsOverviewTab(), AnalyticsOverviewTabProps, AttendanceMatrixTable() (+30 more)

### Community 41 - "typing"
Cohesion: 0.11
Nodes (18): app_api_dependencies, app_db_client, app_schemas_search, app_services_search_service, global_search(), get, User, GlobalSearchResponse (+10 more)

### Community 42 - "attendance.dart"
Cohesion: 0.06
Nodes (33): activeSessionId, attendanceId, backgroundScore, classId, className, createdAt, faceScore, finalAiScore (+25 more)

### Community 43 - "test_api_admin.py"
Cohesion: 0.07
Nodes (35): app_schemas_master_data, app_schemas_pagination, AbsenteeAnomalyItem, AdminStatsResponse, AssignTeacherRequest, AuditLogResponse, BulkImportResponse, ClassBulkCreateRequest (+27 more)

### Community 44 - "audit/page.tsx"
Cohesion: 0.10
Nodes (23): AuditPage(), ClassesPage(), StudentsPage(), TeachersPage(), ActivityDetailModal(), ActivityDetailModalProps, ActivityCategory, ActivityFilterBar() (+15 more)

### Community 45 - "master_data.py"
Cohesion: 0.20
Nodes (11): ClassroomCreate, ClassroomResponse, ClassroomUpdate, DesignationCreate, DesignationResponse, DesignationUpdate, BaseModel, field_validator (+3 more)

### Community 46 - "app.dart"
Cohesion: 0.10
Nodes (25): build, createState, dispose, _handleNotificationClick, inferNotificationSeverity, _initializeFcm, initState, kSeverityInfo (+17 more)

### Community 47 - "secure_storage.dart"
Cohesion: 0.17
Nodes (11): FlutterSecureStorage, clearAll, getDeviceUUID, getRole, getToken, saveDeviceUUID, saveToken, saveUserRole (+3 more)

### Community 48 - "auth_provider.dart"
Cohesion: 0.06
Nodes (35): AuthRepository, AuthStatus, _authErrorSubscription, AuthNotifier, AuthStateData, changePassword, checkInitialAuth, copyWith (+27 more)

### Community 49 - "session_provider.dart"
Cohesion: 0.07
Nodes (29): _adjustPollInterval, _api, classId, className, _currentInterval, dispose, errorMessage, fetchSessions (+21 more)

### Community 50 - "api/admin.py"
Cohesion: 0.16
Nodes (21): app_core_rate_limit, export_audit_logs(), get_admin_stats(), get_audit_logs(), get_class_by_id(), get_classes(), get_classroom(), get_classrooms() (+13 more)

### Community 51 - "frontend/package.json"
Cohesion: 0.07
Nodes (25): eslintConfig, name, private, version, axios, clsx, eslint, eslint-config-next (+17 more)

### Community 52 - "react"
Cohesion: 0.05
Nodes (52): nextConfig, classColumns, metadata, colorVariants, studentColumns, colorVariants, teacherColumns, metadata (+44 more)

### Community 53 - "package:flutter_riverpod/flutter_riverpod.dart"
Cohesion: 0.06
Nodes (37): Box, dart:convert, Dio, AuthApi, authApiProvider, changePassword, _dio, getProfile (+29 more)

### Community 54 - "AuthService"
Cohesion: 0.11
Nodes (26): app_core_security, app_schemas_super_admin, app_services_super_admin_service, get_platform_stats(), get_tenant_details(), list_tenants(), provision_tenant(), get (+18 more)

### Community 55 - "StudentCreate"
Cohesion: 0.18
Nodes (5): field_validator, StudentCreate, StudentResponse, StudentAdminService, test_create_student_admin()

### Community 56 - "notification_tile.dart"
Cohesion: 0.11
Nodes (17): Map, LocalNotification, build, CalendarMonthGrid, focusedMonth, grouped, onSelectDate, selectedDate (+9 more)

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

### Community 61 - "seed_and_simulate.py"
Cohesion: 0.10
Nodes (28): BrowserContext, httpx, re, rich_console, rich_progress, Admin Master Data Setup Automation. Configures institutional master data: -…, main(), Automated Data-Seeding and Realistic User-Simulation Pipeline. Usage: python… (+20 more)

### Community 62 - "geofence_status_card.dart"
Cohesion: 0.14
Nodes (12): build, _buildChip, GeofenceDistanceMetrics, state, statusColor, build, GeofenceStatusCard, onRetry (+4 more)

### Community 64 - "notification_api.dart"
Cohesion: 0.08
Nodes (23): category, createdAt, deleteNotification, _dio, fromJson, getNotifications, id, isRead (+15 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (23): bin, dev, setup, description, name, private, scripts, backend:setup (+15 more)

### Community 66 - "attendance_provider.dart"
Cohesion: 0.07
Nodes (27): DateTimeFormatting, formattedDate, formattedDateTime, isSameDay, shortDate, StringFormatting, truncate, accuracy (+19 more)

### Community 67 - "adb_login_and_capture.py"
Cohesion: 0.80
Nodes (5): adb(), key(), main(), tap(), type_text()

### Community 68 - "BasePage"
Cohesion: 0.11
Nodes (5): ClassInput, StudentInput, TeacherInput, BasePage, @playwright/test

### Community 69 - "flagged_detail_screen.dart"
Cohesion: 0.08
Nodes (28): attendanceRepositoryProvider, attendanceId, build, createState, dispose, FlaggedDetailScreen, _FlaggedDetailScreenState, initState (+20 more)

### Community 70 - "attendance_constants.dart"
Cohesion: 0.09
Nodes (21): kAttendanceTypeLocal, kAttendanceTypePush, kGoodScoreThreshold, kImagePickQuality, kMinBrightnessForPhoto, kMinSharpnessForPhoto, kNoteMaxChars, kOverallGoodPct (+13 more)

### Community 71 - "resolve_frontend_url"
Cohesion: 0.33
Nodes (5): Request, Dynamically resolves the frontend base URL for email links, redirects, and…, resolve_frontend_url(), EmailService, Any

### Community 72 - "SessionService"
Cohesion: 0.22
Nodes (7): start_session(), SessionResponse, SessionStart, SessionScheduler, Mark session as inactive, delete from Redis, and mark all unsubmitted students…, SessionService, test_start_and_stop_session()

### Community 73 - "offline_payload.dart"
Cohesion: 0.11
Nodes (19): @HiveType, HiveObject, hashCode, OfflineAttendancePayloadAdapter, operator, read, typeId, write (+11 more)

### Community 76 - "AttendanceRepository"
Cohesion: 0.16
Nodes (5): AttendanceRepository, Attendance, LeaveRepository, LeaveService, LeaveRequest

### Community 77 - "GamificationService"
Cohesion: 0.10
Nodes (13): GamificationService, Return the active Redis client if available., Update a student's score in the Redis leaderboard., Fetch the leaderboard from Redis, falling back to DB if empty., Helper to compatibility-wrap recalculate_student_streak., Rebuild the leaderboard cache from DB data., Recalculate student streak based on historical attendance logs and active…, Fetch top 10 students from Redis cache and load details from DB. (+5 more)

### Community 78 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, eslint, eslint-config-next, jsdom, @playwright/test, tailwindcss, @tailwindcss/postcss, @testing-library/dom (+11 more)

### Community 79 - "GeofenceMap.tsx"
Cohesion: 0.13
Nodes (11): Circle, GeofenceMap(), GeofenceMapProps, MapContainer, Marker, TileLayer, LocationSearchBar(), LocationSearchBarProps (+3 more)

### Community 80 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 81 - "glass_button.dart"
Cohesion: 0.07
Nodes (28): EdgeInsetsGeometry, background, border, build, _ButtonColors, fontSize, foreground, GlassButton (+20 more)

### Community 82 - "offline_sync_service.dart"
Cohesion: 0.05
Nodes (39): NotificationService, _className, _connectivitySub, _deleteImageFile, _dio, dispose, _handleSyncError, _hive (+31 more)

### Community 83 - "🚀 Key Features"
Cohesion: 0.11
Nodes (18): 1. Multi-Layered AI Verification, 1. Prerequisites, 2. Dynamic Location & Geofencing, 2. One-Command Setup, 3. Hardware Device Binding (Anti-Proxy), 3. Running Development Servers, 4. Offline Smart Pass (Encrypted Fallback), 5. Automated Outlier Scanning & Absentee Analytics (+10 more)

### Community 84 - "TeacherService"
Cohesion: 0.17
Nodes (11): app_schemas_teacher, app_services_teacher_service, BulkAttendanceRecord, BulkMarkRequest, GeofenceUpsert, datetime, TeacherService, asyncio (+3 more)

### Community 85 - "smart_pass.dart"
Cohesion: 0.05
Nodes (34): Duration get, attendanceStatus, className, enrollmentNumber, expiresAt, fromJson, isExpired, markedAt (+26 more)

### Community 86 - "os"
Cohesion: 0.17
Nodes (14): asyncio, connect_redis(), _hash_password(), Production Database Reset & Wipe Script =======================================…, reset_production_database(), os, playwright_async_api, Redis (+6 more)

### Community 88 - "leave_requests_screen.dart"
Cohesion: 0.08
Nodes (24): File?, build, createState, dispose, _endDate, _isSubmitting, LeaveRequestsScreen, _LeaveRequestsScreenState (+16 more)

### Community 89 - "build"
Cohesion: 0.40
Nodes (5): build, Route /settings/goals, Route /settings/help, Route /settings/notifications, Route /settings/sync

### Community 90 - "leave_request.dart"
Cohesion: 0.09
Nodes (21): approved, approvedBy, approverNote, createdAt, documentUrl, endDate, enrollmentNumber, fromJson (+13 more)

### Community 91 - "smart_pass_screen.dart"
Cohesion: 0.09
Nodes (27): permissionServiceProvider, smartPassProvider, build, _buildErrorBanner, _buildLiveScanner, _buildPermissionCard, _buildSuccessCard, _checkingPermission (+19 more)

### Community 92 - "conftest.py"
Cohesion: 0.17
Nodes (15): AwaitableMock, clear_dependency_overrides(), mock_academic_class(), mock_admin_user(), mock_redis(), mock_student_profile(), mock_student_user(), mock_teacher_profile() (+7 more)

### Community 93 - "form.tsx"
Cohesion: 0.17
Nodes (14): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+6 more)

### Community 94 - "test-fixtures.ts"
Cohesion: 0.33
Nodes (4): frontend_e2e_fixtures_test_fixtures_expect, generateYopmail(), test, TEST_CREDENTIALS

### Community 95 - "preferences_provider.dart"
Cohesion: 0.10
Nodes (20): PreferencesService, attendanceTarget, copyWith, isLoading, _load, lowAttendanceThreshold, notifyClassStart, notifyLowAttendance (+12 more)

### Community 96 - "adb_mobile_screen_tester.py"
Cohesion: 0.71
Nodes (6): adb(), capture(), keyevent(), main(), tap(), text()

### Community 99 - "run_absentee_scan"
Cohesion: 0.31
Nodes (9): app_services_absentee_scanner, scan_absentee_anomalies(), _detect_pattern(), Any, run_absentee_scan(), _run_isolation_forest(), asyncio, test_run_absentee_scan_detects_outliers() (+1 more)

### Community 100 - "AIOrchestrator"
Cohesion: 0.29
Nodes (3): AIOrchestrator, _load_and_crop(), ndarray

### Community 101 - "dropdown-menu.tsx"
Cohesion: 0.15
Nodes (12): DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuSeparator, DropdownMenuSub (+4 more)

### Community 102 - "datetime"
Cohesion: 0.06
Nodes (47): app_schemas_health, check_database(), check_redis(), check_s3(), get_health_status(), get, Response, HealthResponse (+39 more)

### Community 103 - "ConnectionManager"
Cohesion: 0.11
Nodes (11): app_api_ws, app_services_realtime_bus, ConnectionManager, Any, Publish real-time event to distributed Redis PubSub channel., RealtimeBus, asyncio, test_connection_manager_delegation() (+3 more)

### Community 104 - "reset_password_screen.dart"
Cohesion: 0.13
Nodes (19): resetPasswordProvider, build, _buildInvalidCard, _buildLoadingCard, _buildResetForm, _confirmCtrl, createState, dispose (+11 more)

### Community 105 - "student_api.dart"
Cohesion: 0.11
Nodes (17): analyzeAttendance, confirmAttendance, createLeaveRequest, _dio, getLeaderboard, getMyAttendance, getMyClasses, getMyLeaves (+9 more)

### Community 106 - "student_stats.dart"
Cohesion: 0.18
Nodes (10): absentCount, attendancePercentage, currentStreak, excusedCount, flaggedCount, fromJson, highestStreak, presentCount (+2 more)

### Community 107 - "String?"
Cohesion: 0.03
Nodes (65): CameraController?, dart:ui, build, isSecondaryGhost, onPrimaryPressed, onSecondaryPressed, primaryIcon, primaryLabel (+57 more)

### Community 108 - "manifest.json"
Cohesion: 0.18
Nodes (10): background_color, description, display, icons, name, orientation, prefer_related_applications, short_name (+2 more)

### Community 109 - "package:flutter/material.dart"
Cohesion: 0.04
Nodes (53): slideRightPage, slideUpPage, build, email, errorMessage, isFormValid, LoginErrorBanner, password (+45 more)

### Community 111 - "PageObjects"
Cohesion: 0.09
Nodes (6): PageObjects, AdminScannerPage, TeacherAnalyticsPage, TeacherDeviceChangesPage, TeacherProfilePage, TeacherReviewPage

### Community 112 - "history_list_tab.dart"
Cohesion: 0.06
Nodes (32): Container, build, child, ShellScaffold, _tabPaths, build, createState, dispose (+24 more)

### Community 113 - "badge.tsx"
Cohesion: 0.50
Nodes (4): Badge(), BadgeProps, badgeVariants, class-variance-authority

### Community 117 - "AttendanceTrendChart.tsx"
Cohesion: 0.22
Nodes (5): monthlyData, MonthlyDataPoint, breakdownData, BreakdownItem, recharts

### Community 118 - "db_cleaner.py"
Cohesion: 0.15
Nodes (10): Service Health & Connectivity Checker Checks AWS S3 and PostgreSQL RDS…, bcrypt, boto3, botocore_exceptions, dotenv, clean_database(), _hash_password(), Database Cleaner for Local Test Environment. Provides clean slate wiping for… (+2 more)

### Community 120 - "SystemConfigService"
Cohesion: 0.15
Nodes (11): patch, update_system_config(), Gets the system configuration. If it doesn't exist, creates a default one., SystemConfigRepository, SystemConfigService, fromJson, isAiBackgroundValidationEnabled, isFaceRecognitionEnabled (+3 more)

### Community 121 - "BroadcastNotificationModal.tsx"
Cohesion: 0.20
Nodes (11): BroadcastNotificationModal(), BroadcastNotificationModalProps, INITIAL_FORM, NotificationTabs(), NotificationTabsProps, TABS, NotificationBroadcastCreate, NotificationCategory (+3 more)

### Community 124 - "SessionSimulationService"
Cohesion: 0.26
Nodes (7): Any, AsyncClient, Runs the multi-day attendance simulation across classes with live progress., Acquires auth tokens for faculty members to drive session endpoints., Categorizes students into Exemplary (~60%), Irregular (~25%), and Defaulter…, Simulates 1 class session: start -> bulk mark -> stop., SessionSimulationService

### Community 125 - "Agent Guidelines & Engineering Standards"
Cohesion: 0.29
Nodes (6): 1. Environment & Configuration Sync, 2. No Hardcoding, 3. No Patches on Patches (Clean Code First), 4. File Structure & Quality Rules, 5. Version Control & Automated Delivery, Agent Guidelines & Engineering Standards

### Community 126 - "TeacherCreate"
Cohesion: 0.15
Nodes (10): app_schemas_admin, app_services_admin_service, field_validator, TeacherCreate, TeacherResponse, TeacherAdminService, asyncio, test_admin_service_create_student() (+2 more)

### Community 127 - ".generate_student_specs"
Cohesion: 0.33
Nodes (4): Any, Builds student specification objects with PRNs and @yopmail.com emails., Creates cohorts for Division A and Division B in CSE., Enrolls students into appropriate theory sections and practical lab batches.

### Community 134 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, start, test, test:watch

### Community 135 - "device_change_dialog.dart"
Cohesion: 0.18
Nodes (13): dioProvider, deviceServiceProvider, build, createState, DeviceChangeDialog, _DeviceChangeDialogState, dispose, email (+5 more)

### Community 136 - "leaderboard.dart"
Cohesion: 0.11
Nodes (19): int?, AppException, AuthException, message, NetworkException, ServerException, statusCode, toString (+11 more)

### Community 138 - "AdminSetupService"
Cohesion: 0.18
Nodes (8): AdminSetupService, Any, AsyncClient, Creates academic subjects (Theory & Practical)., Creates classroom and laboratory venues., Logs into admin account and acquires JWT access token., Creates institutional departments., Creates academic designations.

### Community 139 - "Settings"
Cohesion: 0.33
Nodes (3): field_validator, Settings, BaseSettings

### Community 140 - "permission_service.dart"
Cohesion: 0.15
Nodes (12): LocationPermission, checkAttendancePermissions, hasLocationAccess, isLocationServiceEnabled, isPermanentlyDenied, locationPermission, message, openAppSettings (+4 more)

### Community 141 - "get_redis"
Cohesion: 0.05
Nodes (65): aiosmtplib, app_api, app_core_config, app_core_logging_config, app_core_url_resolver, app_db_redis, app_repositories_class_repo, app_repositories_student_repo (+57 more)

### Community 142 - "scanner/page.tsx"
Cohesion: 0.26
Nodes (8): AnomalyCard(), AnomalyCardProps, getRiskLevel(), WEEKDAYS, ScannerControls(), ScannerControlsProps, AnomalyResult, frontend_src_types_index_anomalyresult

### Community 145 - "Sidebar.tsx"
Cohesion: 0.27
Nodes (9): adminLinks, NavItem, setupLinks, superAdminLinks, teacherLinks, teacherReportLinks, SidebarProps, SuperAdminNavSection() (+1 more)

### Community 150 - "history_provider.dart"
Cohesion: 0.07
Nodes (33): List, NotificationsNotifier, PendingCountNotifier, _api, copyWith, data, errorMessage, fetch (+25 more)

### Community 151 - "CommandPaletteModal.tsx"
Cohesion: 0.27
Nodes (6): getCommandIcon(), CommandPaletteModal(), CommandPaletteModalProps, useDebounce(), GlobalSearchResponse, SearchResultItem

### Community 152 - "test_mobile_smart_pass_emulator.py"
Cohesion: 0.33
Nodes (9): capture_screenshot(), run_cmd(), test_emulator_e2e(), capture_screenshot(), http_get(), http_post(), main(), run_cmd() (+1 more)

### Community 153 - "authStore.ts"
Cohesion: 0.27
Nodes (8): SidebarUserFooter(), SidebarUserFooterProps, AuthActions, AuthState, AuthStore, cookieStorage, UserProfile, zustand

### Community 154 - "app_notification.dart"
Cohesion: 0.15
Nodes (12): body, category, copyWith, fromMap, id, isRead, link, severity (+4 more)

### Community 155 - "vitest"
Cohesion: 0.36
Nodes (6): mockAdminProfile, mockDeviceChangeRequest, mockStudentProfile, mockTeacherProfile, Role, vitest

### Community 156 - "useAuthStore"
Cohesion: 0.31
Nodes (9): AdminDashboardPage(), DashboardLayout(), Header(), HeaderProps, NotificationPopover(), NotificationPopoverProps, Sidebar(), useNotifications() (+1 more)

### Community 159 - "middleware.ts"
Cohesion: 0.67
Nodes (3): config, middleware(), parseAuthCookie()

### Community 160 - "logger.ts"
Cohesion: 0.50
Nodes (3): logger, LogLevel, PREFIX

### Community 161 - "location_exceptions.dart"
Cohesion: 0.50
Nodes (3): LocationException, message, toString

### Community 165 - "summary_reporter.py"
Cohesion: 0.25
Nodes (7): rich, rich_panel, rich_table, print_final_summary(), Any, Summary Reporting & Terminal Dashboard Module. Renders final summary tables and…, Prints beautiful formatted terminal summary tables using rich.

### Community 167 - "NotificationItemRow.tsx"
Cohesion: 0.43
Nodes (6): formatRelativeTime(), getIcon(), NotificationItemRow(), NotificationItemRowProps, UseNotificationsReturn, NotificationItem

### Community 173 - "global_exception_handler"
Cohesion: 0.38
Nodes (7): global_exception_handler(), Exception, Request, validation_exception_handler(), exception_handler, JSONResponse, RequestValidationError

### Community 174 - ".simulate_device_changes"
Cohesion: 0.40
Nodes (3): Any, Simulates student device changes and teacher resolution., Simulates student leave submissions and teacher review queue processing.

### Community 175 - "ref_path"
Cohesion: 0.25
Nodes (4): frontend_node_modules_playwright_test_index, ref_fs, ref_path, @vitejs/plugin-react

### Community 177 - ".onboard_teachers"
Cohesion: 0.40
Nodes (3): Any, Provisions faculty accounts with @yopmail.com emails and verifies them., Creates academic classes and links teachers and rooms.

### Community 188 - "PasswordRequirementsChecklist.tsx"
Cohesion: 0.67
Nodes (3): PasswordRequirementsChecklist(), PasswordRequirementsChecklistProps, usePasswordRules()

### Community 190 - "LeaveRequestCreate"
Cohesion: 0.40
Nodes (3): LeaveRequestCreate, field_validator, date

### Community 191 - "PaginatedResponse"
Cohesion: 0.38
Nodes (5): PaginatedResponse, PaginationParams, BaseModel, T, test_audit_logs_and_export()

### Community 193 - "constants.dart"
Cohesion: 0.09
Nodes (22): Duration?, defineUrl, envUrl, kConnectTimeout, kGeofenceGraceMeters, kGpsAveragingSamples, kGpsTimeoutSeconds, kHiveBoxConfig (+14 more)

## Knowledge Gaps
- **1470 isolated node(s):** `SeederConfig`, `ClassInput`, `StudentInput`, `TeacherInput`, `eslintConfig` (+1465 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2080 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **51 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `getApiErrorMessage`, `api.ts`, `ProvisionTenantModal.tsx`, `classes/[id]/edit/page.tsx`, `enroll/page.tsx`, `cn`, `scanner/page.tsx`, `Sidebar.tsx`, `CommandPaletteModal.tsx`, `authStore.ts`, `useAuthStore`, `types/index.ts`, `NotificationItemRow.tsx`, `analytics/page.tsx`, `(auth)/layout.tsx`, `audit/page.tsx`, `frontend/package.json`, `BulkImportModal.tsx`, `PasswordRequirementsChecklist.tsx`, `GeofenceMap.tsx`, `form.tsx`, `dropdown-menu.tsx`, `badge.tsx`, `AttendanceTrendChart.tsx`, `BroadcastNotificationModal.tsx`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `AdminService` connect `AdminService` to `test_api_admin.py`, `api/admin.py`, `AuthService`, `StudentCreate`, `StudentRepository`, `TeacherCreate`, `_handle_generic_err`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `@playwright/test` connect `BasePage` to `frontend/package.json`, `test-fixtures.ts`, `SuperAdminPage`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Are the 68 inferred relationships involving `AdminService` (e.g. with `assign_teacher()` and `bulk_create_classes()`) actually correct?**
  _`AdminService` has 68 INFERRED edges - model-reasoned connections that need verification._
- **What connects `SeederConfig`, `ClassInput`, `StudentInput` to the rest of the system?**
  _1470 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `test_api_teacher.py` be split into smaller, more focused modules?**
  _Cohesion score 0.1207897793263647 - nodes in this community are weakly interconnected._
- **Should `getApiErrorMessage` be split into smaller, more focused modules?**
  _Cohesion score 0.030235162374020158 - nodes in this community are weakly interconnected._