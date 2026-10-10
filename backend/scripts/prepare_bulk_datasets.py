#!/usr/bin/env python3
"""
Script to transform raw datasets in temp/ into standard CSV files for bulk import.
Outputs to:
  - asset/dataset/
  - asset/datasets/

All user emails (students, faculty) are formatted with @yopmail.com.
Includes branch, gender, name_initials, and departmental relations.
"""

import csv
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
TEMP_DIR = BASE_DIR / "temp"
OUTPUT_DIRS = [
    BASE_DIR / "asset" / "dataset",
    BASE_DIR / "asset" / "datasets",
]

def ensure_dirs():
    for d in OUTPUT_DIRS:
        d.mkdir(parents=True, exist_ok=True)

def clean_str(s: str) -> str:
    if not s:
        return ""
    return re.sub(r"\s+", " ", str(s)).strip()

def process_students():
    src = TEMP_DIR / "students.csv"
    if not src.exists():
        print(f"File not found: {src}")
        return

    records = []
    seen_enrollments = set()

    dept_map = {
        "CE": "CSE",
        "IoT-IT": "IT",
        "IT": "IT",
        "CSE": "CSE",
    }

    with open(src, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            enr = clean_str(row.get("Enrollment No.", ""))
            if not enr or enr in seen_enrollments:
                continue
            seen_enrollments.add(enr)

            branch = clean_str(row.get("Branch", ""))
            gender = clean_str(row.get("Gender", "")).upper()
            raw_name = clean_str(row.get("Name of Student", ""))
            parts = raw_name.title().split()
            if len(parts) == 0:
                first_name, last_name = "Student", "User"
            elif len(parts) == 1:
                first_name, last_name = parts[0], parts[0]
            elif len(parts) == 2:
                first_name, last_name = parts[1], parts[0]
            else:
                first_name = " ".join(parts[1:])
                last_name = parts[0]

            email = f"{enr.lower()}@yopmail.com"
            dept_code = dept_map.get(branch, "CSE")

            records.append({
                "email": email,
                "enrollment_number": enr,
                "first_name": first_name,
                "last_name": last_name,
                "gender": gender,
                "branch": branch,
                "department_id": dept_code,
            })

    for out_dir in OUTPUT_DIRS:
        out_file = out_dir / "students.csv"
        with open(out_file, mode="w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=["email", "enrollment_number", "first_name", "last_name", "gender", "branch", "department_id"])
            writer.writeheader()
            writer.writerows(records)

    print(f"Processed {len(records)} students -> students.csv")

def process_faculty_and_departments():
    src = TEMP_DIR / "faculty.csv"
    if not src.exists():
        print(f"File not found: {src}")
        return

    teachers = []
    departments_set = set()
    designations_set = set()
    dept_heads = {}
    seen_emails = set()
    seen_emp_ids = set()

    dept_code_map = {
        "Computer Engineering": "CSE",
        "Information Technology": "IT",
        "Electronics & Communication": "ECE",
        "Mechanical Engineering": "MECH",
        "Civil Engineering": "CIVIL",
        "Electrical Engineering": "EE",
        "Mechatronics Engineering": "MTR",
        "Automobile Engineering": "AUTO",
        "Biomedical Engineering": "BME",
        "Biotechnology Engineering": "BT",
        "Chemical Engineering": "CHEM",
        "Petrochemical Engineering": "PETRO",
        "Humanity and Basic Science": "HBS",
    }

    designation_code_map = {
        "Professor": "PROF",
        "Associate Professor": "ASSOC_PROF",
        "Assistant Professor": "ASST_PROF",
        "Adjunct Professor": "ADJ_PROF",
        "Industrial Relations & Associate Professor": "IR_ASSOC_PROF",
        "HEAD PG": "HEAD_PG",
    }

    with open(src, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader, start=1):
            name = clean_str(row.get("name", ""))
            title = clean_str(row.get("title", ""))
            orig_email = clean_str(row.get("email", ""))
            initials = clean_str(row.get("name_initials", "")).upper()
            dept = clean_str(row.get("department", ""))

            if dept:
                departments_set.add(dept)
                if "Professor" in title and dept not in dept_heads:
                    dept_heads[dept] = name

            if title:
                designations_set.add(title)

            # Generate unique yopmail email
            if "@" in orig_email:
                local_part = orig_email.split("@")[0].lower()
            elif initials:
                local_part = initials.lower()
            else:
                local_part = f"faculty{idx}"

            clean_local = "".join(c for c in local_part if c.isalnum() or c in "._-")
            email = f"{clean_local}@yopmail.com"
            if email in seen_emails:
                email = f"{clean_local}.{idx}@yopmail.com"
            seen_emails.add(email)

            # Generate unique employee ID
            emp_id = f"FAC-{initials}" if initials else f"FAC-{idx:03d}"
            if emp_id in seen_emp_ids or len(emp_id) < 3:
                emp_id = f"FAC-{idx:03d}"
            seen_emp_ids.add(emp_id)

            # Name splitting
            clean_name = name
            for prefix in ["Dr.", "Prof.", "Dr", "Prof", "Mr.", "Ms.", "Mrs."]:
                if clean_name.startswith(prefix + " "):
                    clean_name = clean_name[len(prefix) + 1:].strip()

            parts = clean_name.split()
            if len(parts) == 0:
                fn, ln = "Faculty", "Member"
            elif len(parts) == 1:
                fn, ln = parts[0], parts[0]
            elif len(parts) == 2:
                fn, ln = parts[0], parts[1]
            else:
                fn, ln = parts[0], " ".join(parts[1:])

            dept_code = dept_code_map.get(dept, "")
            desig_code = designation_code_map.get(title, "")

            teachers.append({
                "email": email,
                "employee_id": emp_id,
                "first_name": fn,
                "last_name": ln,
                "name_initials": initials,
                "department_id": dept_code,
                "designation_id": desig_code,
            })

    # Write teachers.csv
    for out_dir in OUTPUT_DIRS:
        out_file = out_dir / "teachers.csv"
        with open(out_file, mode="w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=["email", "employee_id", "first_name", "last_name", "name_initials", "department_id", "designation_id"])
            writer.writeheader()
            writer.writerows(teachers)
    print(f"Processed {len(teachers)} teachers -> teachers.csv")

    # Write departments.csv
    dept_records = []
    for d in sorted(departments_set):
        code = dept_code_map.get(d, "".join(w[0] for w in d.split() if w[0].isalnum()).upper())
        head = dept_heads.get(d, "")
        desc = f"Department of {d}"
        dept_records.append({
            "name": d,
            "code": code,
            "head": head,
            "description": desc
        })

    for out_dir in OUTPUT_DIRS:
        out_file = out_dir / "departments.csv"
        with open(out_file, mode="w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=["name", "code", "head", "description"])
            writer.writeheader()
            writer.writerows(dept_records)
    print(f"Processed {len(dept_records)} departments -> departments.csv")

    # Write designations.csv
    desig_records = []
    for title in sorted(designations_set):
        code = designation_code_map.get(title, "".join(w[0] for w in title.split() if w[0].isalnum()).upper())
        desig_records.append({
            "name": title,
            "code": code,
            "description": f"Faculty position - {title}"
        })

    for out_dir in OUTPUT_DIRS:
        out_file = out_dir / "designations.csv"
        with open(out_file, mode="w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=["name", "code", "description"])
            writer.writeheader()
            writer.writerows(desig_records)
    print(f"Processed {len(desig_records)} designations -> designations.csv")

def process_subjects():
    src = TEMP_DIR / "subject.csv"
    if not src.exists():
        print(f"File not found: {src}")
        return

    subjects_map = {}
    branch_dept_map = {
        "ce": "CSE",
        "ce-ai": "CSE",
        "it": "IT",
        "ece": "ECE",
        "me": "MECH",
        "csbs": "CSE",
    }

    with open(src, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            code = clean_str(row.get("subject_code", ""))
            name = clean_str(row.get("subject_name", ""))
            branch = clean_str(row.get("branch", ""))
            branch_slug = clean_str(row.get("branch_slug", "")).lower()
            semester = clean_str(row.get("semester", ""))
            subtype = clean_str(row.get("subject_type", ""))

            # Filter out invalid entries or generic table headers
            if not code or not name or len(code) < 2 or name.lower() in ["teaching scheme", "scheme"]:
                continue

            if code not in subjects_map:
                desc_parts = []
                if branch:
                    desc_parts.append(branch.title())
                if semester:
                    desc_parts.append(f"Semester {semester}")
                if subtype:
                    desc_parts.append(f"({subtype})")
                description = " - ".join(desc_parts) if desc_parts else "Academic Course Subject"
                dept_code = branch_dept_map.get(branch_slug, "")

                subjects_map[code] = {
                    "name": name,
                    "code": code,
                    "description": description[:490],
                    "department_id": dept_code,
                }

    subjects_records = sorted(subjects_map.values(), key=lambda x: x["code"])

    for out_dir in OUTPUT_DIRS:
        out_file = out_dir / "subjects.csv"
        with open(out_file, mode="w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=["name", "code", "description", "department_id"])
            writer.writeheader()
            writer.writerows(subjects_records)
    print(f"Processed {len(subjects_records)} subjects -> subjects.csv")

def process_classrooms_and_labs():
    classroom_src = TEMP_DIR / "classroom.csv"
    lab_src = TEMP_DIR / "lab.csv"

    classrooms = []
    seen = set()

    if classroom_src.exists():
        with open(classroom_src, mode="r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                cid = clean_str(row.get("classroom_id", ""))
                if cid and cid not in seen:
                    seen.add(cid)
                    name = f"Room {cid}"
                    building = "Main Academic Block"
                    capacity = 60
                    classrooms.append({
                        "name": name,
                        "building": building,
                        "capacity": capacity
                    })

    if lab_src.exists():
        with open(lab_src, mode="r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                lid = clean_str(row.get("lab_id", ""))
                if lid and lid not in seen:
                    seen.add(lid)
                    name = f"Lab {lid}"
                    building = "Engineering Lab Complex"
                    capacity = 40
                    classrooms.append({
                        "name": name,
                        "building": building,
                        "capacity": capacity
                    })

    for out_dir in OUTPUT_DIRS:
        out_file = out_dir / "classrooms.csv"
        with open(out_file, mode="w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=["name", "building", "capacity"])
            writer.writeheader()
            writer.writerows(classrooms)
    print(f"Processed {len(classrooms)} classrooms & labs -> classrooms.csv")

if __name__ == "__main__":
    ensure_dirs()
    process_students()
    process_faculty_and_departments()
    process_subjects()
    process_classrooms_and_labs()
    print("All datasets processed successfully!")
