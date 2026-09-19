import 'dart:async';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:smart_attendance_app/app/app.dart';
import 'package:smart_attendance_app/core/constants.dart';
import 'package:smart_attendance_app/data/local/hive_service.dart';
import 'package:smart_attendance_app/data/local/offline_sync_service.dart';
import 'package:smart_attendance_app/data/local/notification_service.dart';
import 'package:smart_attendance_app/utils/logger.dart';
import 'package:workmanager/workmanager.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return super.createHttpClient(context)
      ..badCertificateCallback = (X509Certificate cert, String host, int port) {
        final configuredUri = Uri.tryParse(kApiBaseUrl);
        final targetHost = configuredUri?.host.toLowerCase() ?? '';
        final reqHost = host.toLowerCase();

        if (targetHost.isNotEmpty) {
          if (reqHost == targetHost) return true;
          final domainParts = targetHost.split('.');
          if (domainParts.length >= 2) {
            final parentDomain = domainParts.sublist(domainParts.length - 2).join('.');
            if (reqHost.endsWith(parentDomain)) return true;
          }
        }
        if (reqHost == 'localhost' ||
            reqHost == '10.0.2.2' ||
            reqHost.startsWith('127.0.0.1') ||
            reqHost.startsWith('192.168.')) {
          return true;
        }
        return false;
      };
  }
}

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  final notificationService = NotificationService();
  await notificationService.initialize();
  await notificationService.addNotification(
    title: message.notification?.title ?? 'Notification',
    body: message.notification?.body ?? '',
    severity: inferNotificationSeverity(message.data),
    source: 'push',
  );
}

@pragma('vm:entry-point')
void callbackDispatcher() {
  Workmanager().executeTask((task, inputData) async {
    try {
      WidgetsFlutterBinding.ensureInitialized();
      HttpOverrides.global = AppHttpOverrides();
      try {
        await dotenv.load(fileName: ".env");
      } catch (_) {}

      final hiveService = HiveService();
      await hiveService.initialize();

      final notificationService = NotificationService();
      await notificationService.initialize();

      final container = ProviderContainer(
        overrides: [
          hiveServiceProvider.overrideWithValue(hiveService),
          notificationServiceProvider.overrideWithValue(notificationService),
        ],
      );

      final syncService = container.read(offlineSyncServiceProvider);
      await syncService.syncQueue();
      return Future.value(true);
    } catch (e) {
      AppLogger.error('Workmanager sync failed: $e');
      return Future.value(false);
    }
  });
}

Future<void> main() async {
  await runZonedGuarded(() async {
    WidgetsFlutterBinding.ensureInitialized();
    HttpOverrides.global = AppHttpOverrides();

    try {
      await dotenv.load(fileName: ".env");
    } catch (e) {
      AppLogger.warn('Could not load .env file, using default configuration: $e');
    }

    FlutterError.onError = (FlutterErrorDetails details) {
      FlutterError.presentError(details);
      AppLogger.error(
        'Uncaught Flutter framework error: ${details.exception}',
        context: {'stack': details.stack?.toString()},
      );
      if (kReleaseMode) {
        Zone.current.handleUncaughtError(
          details.exception,
          details.stack ?? StackTrace.current,
        );
      }
    };

    await SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitUp,
    ]);

    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Colors.black,
      systemNavigationBarIconBrightness: Brightness.light,
    ));

    final hiveService = HiveService();
    await hiveService.initialize();

    final notificationService = NotificationService();
    await notificationService.initialize();

    try {
      await Firebase.initializeApp();
      FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
      await FirebaseMessaging.instance.requestPermission();
    } catch (e) {
      AppLogger.error('Firebase init failed: $e');
    }

    Workmanager().initialize(callbackDispatcher);
    Workmanager().registerPeriodicTask(
      "offline-sync-task",
      "syncQueue",
      frequency: const Duration(minutes: 15),
      constraints: Constraints(networkType: NetworkType.connected),
    );

    runApp(
      ProviderScope(
        overrides: [
          hiveServiceProvider.overrideWithValue(hiveService),
          notificationServiceProvider.overrideWithValue(notificationService),
        ],
        child: const SmartAttendanceApp(),
      ),
    );
  }, (error, stackTrace) {
    AppLogger.error(
      'Unhandled zoned error: $error',
      context: {'stack': stackTrace.toString()},
    );
  });
}
