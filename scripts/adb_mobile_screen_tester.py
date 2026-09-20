#!/usr/bin/env python3
import os
import subprocess
import time

DEVICE = "emulator-5554"
PKG = "com.smartattendance.smart_attendance_app"
SCREENSHOT_DIR = "/home/pratham/Disk2/Projects/Smart Attandance System/screenshots"

def adb(cmd):
    full_cmd = f"adb -s {DEVICE} {cmd}"
    return subprocess.run(full_cmd, shell=True, capture_output=True, text=True)

def tap(x, y):
    adb(f"shell input tap {x} {y}")
    time.sleep(1)

def keyevent(key):
    adb(f"shell input keyevent {key}")
    time.sleep(0.5)

def text(t):
    adb(f'shell input text "{t}"')
    time.sleep(1)

def capture(filename):
    os.makedirs(SCREENSHOT_DIR, exist_ok=True)
    remote = f"/sdcard/{filename}"
    local = os.path.join(SCREENSHOT_DIR, filename)
    adb(f"shell screencap -p {remote}")
    adb(f"pull {remote} {local}")
    print(f"Captured: {local}")

def main():
    print("Starting ADB Mobile UI Test & Screenshot Sequence...")
    # Force stop and relaunch
    adb(f"shell am force-stop {PKG}")
    time.sleep(1)
    adb(f"shell monkey -p {PKG} -c android.intent.category.LAUNCHER 1")
    time.sleep(3)

    # Dismiss notification permission if present
    adb("shell input tap 540 1330")
    time.sleep(2)

    # Capture Login Screen
    capture("01_login_light_screen.png")

    # Tap email field and type
    tap(400, 1220)
    text("cse2025001@smartattendance.edu.in")
    
    # Tap password field and type
    tap(400, 1460)
    text("Student@123")

    # Dismiss keyboard
    keyevent(4)
    time.sleep(1)

    # Tap Sign In button
    tap(540, 1680)
    time.sleep(4)

    # Capture Home Screen
    capture("02_home_dashboard.png")

    # Tab 1: History
    tap(405, 2320)
    time.sleep(2)
    capture("03_history_screen.png")

    # Tab 2: Analytics
    tap(675, 2320)
    time.sleep(2)
    capture("04_analytics_screen.png")

    # Tap Leaderboard card inside Analytics (around y=1500)
    tap(540, 1500)
    time.sleep(2)
    capture("05_leaderboard_screen.png")
    
    # Go back to Analytics
    tap(80, 160) # app bar back button
    time.sleep(1)

    # Tab 3: More / Profile tab
    tap(945, 2320)
    time.sleep(2)
    capture("06_more_screen.png")

    print("UI Automation & Screenshot capture completed!")

if __name__ == "__main__":
    main()
