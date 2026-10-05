import csv

# Classroom CSV
classrooms = []
# 001 to 009
for i in range(1, 10):
    classrooms.append(f"{i:03d}")
# 100 to 109
for i in range(100, 110):
    classrooms.append(str(i))
# 200 to 209
for i in range(200, 210):
    classrooms.append(str(i))

with open('classroom.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['classroom_id'])
    for room in classrooms:
        writer.writerow([room])

print(f"classroom.csv created with {len(classrooms)} rooms")

# Lab CSV - first 5 rooms (001-005) with A, B, C variants
# Also include 100-109 and 200-209 with A, B, C variants
labs = []
# 001-005
for i in range(1, 6):
    for suffix in ['A', 'B', 'C']:
        labs.append(f"{i:03d}-{suffix}")
# 100-109
for i in range(100, 110):
    for suffix in ['A', 'B', 'C']:
        labs.append(f"{i}-{suffix}")
# 200-209
for i in range(200, 210):
    for suffix in ['A', 'B', 'C']:
        labs.append(f"{i}-{suffix}")

with open('lab.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['lab_id'])
    for lab in labs:
        writer.writerow([lab])

print(f"lab.csv created with {len(labs)} labs")