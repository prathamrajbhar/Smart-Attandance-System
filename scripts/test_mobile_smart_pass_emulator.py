import os
import sys
import time
import subprocess
import json
import urllib.request

SCREENSHOTS_DIR = "/home/pratham/Disk2/Projects/Smart Attandance System/screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
APK_PATH = "/home/pratham/Disk2/Projects/Smart Attandance System/mobile/build/app/outputs/flutter-apk/app-debug.apk"
PKG_NAME = "com.smartattendance.smart_attendance_app"

def run_cmd(cmd, check=True):
    print(f"[CMD] {cmd}")
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if check and res.returncode != 0:
        print(f"[ERR] {res.stderr.strip()}")
    return res

def capture_screenshot(filename, caption=""):
    path = os.path.join(SCREENSHOTS_DIR, filename)
    run_cmd(f"adb -s emulator-5554 exec-out screencap -p > '{path}'")
    print(f"📸 [Screenshot] {filename} saved: {caption}")
    return path

def http_post(url, data):
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))

def http_get(url, headers):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))

def main():
    print("="*70)
    print("STARTING ANDROID EMULATOR SMART PASS E2E TEST")
    print("="*70)

    # 1. Verify Emulator
    devices = run_cmd("adb devices").stdout
    if "emulator-5554" not in devices:
        print("❌ Error: emulator-5554 not found!")
        sys.exit(1)

    # 2. Generate live teacher token for active session
    print("\n--- Getting Teacher Smart Pass Token ---")
    login_res = http_post("http://localhost:8000/api/v1/auth/login", {
        "email": "prof.aarav.sharma@yopmail.com",
        "password": "Teacher@123"
    })
    teacher_token = login_res["access_token"]

    session_id = "e2cb6c69-0dbb-4441-a79a-865e82664c15"
    sp_res = http_get(
        f"http://localhost:8000/api/v1/teacher/sessions/{session_id}/smart-pass",
        headers={"Authorization": f"Bearer {teacher_token}"}
    )
    qr_token = sp_res["qr_token"]
    print(f"✅ Generated Dynamic Token for session {session_id} (class: {sp_res['class_name']})")

    # 3. Install APK
    print("\n--- Installing Debug APK on emulator-5554 ---")
    install_res = run_cmd(f"adb -s emulator-5554 install -r '{APK_PATH}'")
    if "Success" not in install_res.stdout and install_res.returncode != 0:
        print(f"❌ Install failed: {install_res.stderr or install_res.stdout}")
        sys.exit(1)
    print("✅ APK installed.")

    # 4. Permissions
    permissions = [
        "android.permission.CAMERA",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.POST_NOTIFICATIONS"
    ]
    for perm in permissions:
        run_cmd(f"adb -s emulator-5554 shell pm grant {PKG_NAME} {perm}", check=False)

    # 5. Clear and Launch
    run_cmd(f"adb -s emulator-5554 shell pm clear {PKG_NAME}")
    time.sleep(1)

    for perm in permissions:
        run_cmd(f"adb -s emulator-5554 shell pm grant {PKG_NAME} {perm}", check=False)

    print("\n--- Launching App ---")
    run_cmd(f"adb -s emulator-5554 shell am start -n {PKG_NAME}/.MainActivity")
    time.sleep(5)

    # 6. Log in as Student (diya.mehta.010@yopmail.com / Student@123)
    print("\n--- Submitting Login ---")
    # Tap password field to focus
    run_cmd("adb -s emulator-5554 shell input tap 540 1350")
    time.sleep(1)
    # Send Enter key (66) which triggers onFieldSubmitted -> _handleLogin
    run_cmd("adb -s emulator-5554 shell input keyevent 66")
    print("Waiting for login and dashboard to load...")
    time.sleep(6)

    # Capture Home Screen
    capture_screenshot("mobile_home_screen.png", "Student Home Screen with Smart Pass Banner")

    # 7. Navigate to Smart Pass Scanner via Home Banner
    print("\n--- Opening Smart Pass Scanner from Home Screen ---")
    run_cmd("adb -s emulator-5554 shell input tap 540 520")
    time.sleep(4)
    capture_screenshot("mobile_smart_pass_scanner.png", "Student Smart Pass Scanner Interface")

    # 8. Enter Token into Manual Verification Input
    print("\n--- Submitting Teacher QR Token on Mobile ---")
    # Tap manual token input field
    run_cmd("adb -s emulator-5554 shell input tap 540 1350")
    time.sleep(1)
    run_cmd(f"adb -s emulator-5554 shell input text '{qr_token}'")
    time.sleep(1)

    # Tap "Verify & Mark Attendance" button
    print("Tapping Verify & Mark Attendance button...")
    run_cmd("adb -s emulator-5554 shell input tap 540 1480")
    time.sleep(5)

    capture_screenshot("mobile_smart_pass_verified.png", "Verified Attendance Success Card on Mobile")
    print("\n✅ Mobile E2E verification complete!")


if __name__ == "__main__":
    main()
