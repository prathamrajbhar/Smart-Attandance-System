import random
from typing import Any, Dict, List
try:
    from faker import Faker
    fake = Faker(["en_IN", "en_US"])
    Faker.seed(2026)
except ImportError:
    class _SimpleFake:
        _first_names = ["Aarav", "Vihaan", "Aditya", "Rohan", "Ananya", "Diya", "Priya", "Neha", "Ishaan", "Kavya"]
        _last_names = ["Sharma", "Verma", "Patel", "Joshi", "Mehta", "Nair", "Reddy", "Singh", "Gupta", "Kumar"]

        def first_name(self) -> str:
            return random.choice(self._first_names)

        def last_name(self) -> str:
            return random.choice(self._last_names)

    fake = _SimpleFake()



def generate_institution_data() -> Dict[str, Any]:
    institutions = [
        ("Apex Institute of Technology", "apex-tech", "COLLEGE", 1500),
        ("St. Xavier's Senior Secondary School", "xavier-school", "SCHOOL", 800),
        ("Pinnacle Medical & Engineering Coaching", "pinnacle-prep", "COACHING_CENTER", 400),
    ]
    name, slug, t_type, license_count = random.choice(institutions)
    suffix = random.randint(10, 99)
    admin_first = fake.first_name()
    admin_last = fake.last_name()
    return {
        "name": f"{name} {suffix}",
        "slug": f"{slug}-{suffix}",
        "type": t_type,
        "license_count": license_count,
        "admin_name": f"Dr. {admin_first} {admin_last}",
        "admin_email": f"director.{admin_first.lower()}.{suffix}@yopmail.com",
    }


def get_preset_departments() -> List[Dict[str, str]]:
    return [
        {"name": "Computer Science & Engineering", "code": "CSE", "description": "Core computer engineering and computing"},
        {"name": "Artificial Intelligence & Data Science", "code": "AIDS", "description": "Machine learning, AI, and big data systems"},
        {"name": "Electronics & Communication", "code": "ECE", "description": "Signal processing, circuits, and telecommunications"},
    ]


def get_preset_designations() -> List[Dict[str, str]]:
    return [
        {"name": "Professor & Dean", "code": "PROF_DEAN", "description": "Senior tenured faculty and department leadership"},
        {"name": "Associate Professor", "code": "ASSOC_PROF", "description": "Senior lecturer and research coordinator"},
        {"name": "Assistant Professor", "code": "ASST_PROF", "description": "Undergraduate course instructor"},
    ]


def get_preset_classrooms() -> List[Dict[str, Any]]:
    return [
        {"name": "Turing Lecture Hall 101", "building": "Engineering Block A"},
        {"name": "Ramanujan Computing Lab 202", "building": "Advanced Tech Wing"},
        {"name": "Shannon Seminar Room 305", "building": "Innovation Tower"},
    ]


def get_preset_subjects() -> List[Dict[str, str]]:
    return [
        {"name": "Distributed Systems & Cloud Computing", "code": "CS601", "description": "Microservices, consensus algorithms, and event streaming"},
        {"name": "Deep Learning & Neural Networks", "code": "AI502", "description": "Backpropagation, transformers, and CNN architectures"},
        {"name": "Embedded Systems & IoT Networks", "code": "EC404", "description": "Microcontrollers, RTOS, and edge sensors"},
    ]


def generate_teacher_payload(dept_id: str, desig_id: str, index: int) -> Dict[str, Any]:
    first = fake.first_name()
    last = fake.last_name()
    return {
        "first_name": first,
        "last_name": last,
        "email": f"prof.{first.lower()}.{last.lower()}{index}@yopmail.com",
        "employee_id": f"FAC-2026-{index:03d}",
        "phone": f"+9198{random.randint(10000000, 99999999)}",
        "password": "Teacher@123",
        "department_id": dept_id,
        "designation_id": desig_id,
        "qualification": random.choice(["Ph.D. in Computer Science", "M.Tech in Distributed Systems", "Ph.D. in AI & Robotics"]),
        "specialization": random.choice(["Cloud Computing", "Computer Vision", "Cybersecurity", "Distributed Consensus"]),
        "experience_years": random.randint(4, 18),
    }


def generate_student_payload(dept_id: str, index: int) -> Dict[str, Any]:
    first = fake.first_name()
    last = fake.last_name()
    gender = random.choice(["Male", "Female"])
    sem = random.choice([4, 6])
    batch = "2022-2026" if sem == 6 else "2023-2027"
    return {
        "first_name": first,
        "last_name": last,
        "email": f"student.{first.lower()}.{last.lower()}{index}@yopmail.com",
        "enrollment_number": f"EN2024-{index:04d}",
        "phone": f"+9197{random.randint(10000000, 99999999)}",
        "password": "Student@123",
        "gender": gender,
        "semester": sem,
        "batch": batch,
        "department_id": dept_id,
    }


def generate_leave_payload(class_id: str) -> Dict[str, Any]:
    reasons = [
        "Attending IEEE International Conference on Edge AI and Edge Devices",
        "Hospitalization due to severe acute respiratory viral fever (medical note provided)",
        "Representing University in Inter-State Hackathon Grand Finale",
        "Family bereavement requiring immediate travel out of state",
    ]
    return {
        "class_id": class_id,
        "reason": random.choice(reasons),
        "start_date": "2026-10-10",
        "end_date": "2026-10-12",
    }
