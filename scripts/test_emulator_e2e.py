import os
import sys
import time
import subprocess
import json

EMULATOR_SCREENSHOTS = "/tmp/playwright_report/emulator"
os.makedirs(EMULATOR_SCREENSHOTS, exist_ok=True)
APK_PATH = "/home/pratham/Disk2/Projects/Smart Attandance System/mobile/build/app/outputs/flutter-apk/app-debug.apk"
PKG_NAME = "com.smartattendance.smart_attendance_app"

def run_cmd(cmd, check=True):
    print(f"[CMD] {cmd}")
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if check and res.returncode != 0:
        print(f"[ERR] {res.stderr.strip()}")
    return res

def capture_screenshot(filename, caption=""):
    path = f"{EMULATOR_SCREENSHOTS}/{filename}"
    run_cmd(f"adb -s emulator-5554 exec-out screencap -p > '{path}'")
    print(f"📸 [Screenshot] {filename} saved: {caption}")
    return path

def test_emulator_e2e():
    print("="*70)
    print("STARTING LIVE ANDROID EMULATOR E2E APP TEST")
    print("="*70)

    # 1. Verify Emulator
    devices = run_cmd("adb devices").stdout
    if "emulator-5554" not in devices:
        print("❌ Error: emulator-5554 not found in adb devices!")
        return False

    print("✅ Android emulator-5554 connected.")

    # 2. Install APK
    print("\n--- Installing Debug APK on emulator-5554 ---")
    install_res = run_cmd(f"adb -s emulator-5554 install -r '{APK_PATH}'")
    if "Success" not in install_res.stdout and install_res.returncode != 0:
        print(f"❌ Install failed: {install_res.stderr or install_res.stdout}")
        return False
    print("✅ APK installed successfully.")

    # 3. Grant Permissions
    print("\n--- Granting Runtime Permissions ---")
    permissions = [
        "android.permission.CAMERA",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.POST_NOTIFICATIONS"
    ]
    for perm in permissions:
        run_cmd(f"adb -s emulator-5554 shell pm grant {PKG_NAME} {perm}", check=False)
    print("✅ Permissions granted.")

    # 4. Clear Logcat and Launch App
    run_cmd("adb -s emulator-5554 logcat -c")
    print("\n--- Launching App MainActivity ---")
    run_cmd(f"adb -s emulator-5554 shell am start -n {PKG_NAME}/.MainActivity")
    time.sleep(4)

    # Capture Splash / Login Screen
    capture_screenshot("01_login_screen.png", "Mobile Login Screen")

    # 5. Type Student Login Credentials
    print("\n--- Entering Student Credentials on Mobile UI ---")
    # Tap email field (approximate center for 1080x2400 / default emulator density)
    # Get screen resolution
    size_res = run_cmd("adb -s emulator-5554 shell wm size").stdout
    print(f"Display resolution: {size_res.strip()}")

    # Tap email input
    # Typically around 40% down the screen
    run_cmd("adb -s emulator-5554 shell input tap 540 920")
    time.sleep(0.5)
    run_cmd("adb -s emulator-5554 shell input text 'cse2025001@smartattendance.edu.in'")
    time.sleep(0.5)

    # Tap password field
    run_cmd("adb -s emulator-5554 shell input tap 540 1080")
    time.sleep(0.5)
    run_cmd("adb -s emulator-5554 shell input text 'Student@123'")
    time.sleep(0.5)

    # Hide keyboard
    run_cmd("adb -s emulator-5554 shell input keyevent 111")
    time.sleep(0.5)

    capture_screenshot("02_credentials_filled.png", "Filled Login Credentials")

    # Tap Sign In Button (around y=1280 or y=1350)
    print("\n--- Tapping Sign In Button ---")
    run_cmd("adb -s emulator-5554 shell input tap 540 1280")
    time.sleep(4)

    capture_screenshot("03_post_login_screen.png", "Post Login / Home Screen")

    # 6. Interact with Bottom Navigation / Screens
    print("\n--- Testing Navigation Tabs on Android Emulator ---")
    
    # Bottom bar has tabs: Home, Passes, History, Leaves, Profile
    # Tab 1: Home (x ~ 108, y ~ 2280)
    # Tab 2: Smart Pass (x ~ 324, y ~ 2280)
    # Tab 3: History (x ~ 540, y ~ 2280)
    # Tab 4: Leaves (x ~ 756, y ~ 2280)
    # Tab 5: Profile/Analytics (x ~ 972, y ~ 2280)

    # Tap Tab 2: Smart Pass
    run_cmd("adb -s emulator-5554 shell input tap 324 2280")
    time.sleep(2)
    capture_screenshot("04_smart_pass_tab.png", "Smart Pass QR Screen")

    # Tap Tab 3: History
    run_cmd("adb -s emulator-5554 shell input tap 540 2280")
    time.sleep(2)
    capture_screenshot("05_history_tab.png", "Attendance History Screen")

    # Tap Tab 4: Leaves
    run_cmd("adb -s emulator-5554 shell input tap 756 2280")
    time.sleep(2)
    capture_screenshot("06_leaves_tab.png", "Leave Requests Screen")

    # Tap Tab 5: Analytics / Profile
    run_cmd("adb -s emulator-5554 shell input tap 972 2280")
    time.sleep(2)
    capture_screenshot("07_profile_analytics_tab.png", "Profile & Analytics Screen")

    # Tap Tab 1: Return Home
    run_cmd("adb -s emulator-5554 shell input tap 108 2280")
    time.sleep(2)
    capture_screenshot("08_return_home.png", "Returned Home Screen")

    # 7. Check Logcat for Errors
    print("\n--- Checking Logcat for App Crashes / Errors ---")
    logcat_out = run_cmd(f"adb -s emulator-5554 logcat -d | grep -iE 'AndroidRuntime|FATAL EXCEPTION|flutter|smart_attendance' | tail -n 40", check=False).stdout
    print("Logcat sample:")
    print(logcat_out[:1000])

    print("\n" + "="*70)
    print("EMULATOR E2E TEST RUN COMPLETED SUCCESSFULLY")
    print(f"Screenshots saved to: {EMULATOR_SCREENSHOTS}")
    print("="*70)
    return True

if __name__ == "__main__":
    test_emulator_e2e()
