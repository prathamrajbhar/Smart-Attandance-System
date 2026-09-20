#!/usr/bin/env python3
import subprocess
import time

DEVICE = "emulator-5554"

def adb(cmd):
    full_cmd = f'adb -s {DEVICE} {cmd}'
    res = subprocess.run(full_cmd, shell=True, capture_output=True, text=True)
    return res

def tap(x, y):
    adb(f"shell input tap {x} {y}")
    time.sleep(1)

def key(k):
    adb(f"shell input keyevent {k}")
    time.sleep(0.3)

def type_text(t):
    adb(f'shell input text "{t}"')
    time.sleep(0.8)

def main():
    print("Resetting app...")
    adb("shell am force-stop com.smartattendance.smart_attendance_app")
    time.sleep(1)
    adb("shell monkey -p com.smartattendance.smart_attendance_app -c android.intent.category.LAUNCHER 1")
    time.sleep(4)

    # Dismiss notification dialog if any
    tap(540, 1330)
    time.sleep(1)

    print("Focusing email field...")
    tap(400, 500)
    time.sleep(1)
    # Clear any text in email
    for _ in range(50):
        key(67) # DEL
    type_text("cse2025001@smartattendance.edu.in")
    
    print("Moving to password field...")
    # Tab to next field
    key(61)
    time.sleep(0.5)
    for _ in range(30):
        key(67)
    type_text("Student@123")
    
    print("Dismissing keyboard...")
    key(111) # ESC / BACK
    time.sleep(1)

    print("Tapping Sign In...")
    tap(540, 700)
    time.sleep(5)

    print("Capturing post-login screen...")
    adb('shell screencap -p /sdcard/02_home_dashboard.png')
    adb('pull /sdcard/02_home_dashboard.png "./screenshots/02_home_dashboard.png"')
    print("Done!")

if __name__ == "__main__":
    main()
