import { BulkImportEntityType } from "./bulk-types";

export function getSampleCsv(entityType: BulkImportEntityType): string {
  if (entityType === "students") {
    return (
      "email,enrollment_number,first_name,last_name\n" +
      "alex.carter@university.edu,STU-2026-001,Alex,Carter\n" +
      "brooke.hayes@university.edu,STU-2026-002,Brooke,Hayes\n" +
      "connor.reed@university.edu,STU-2026-003,Connor,Reed"
    );
  }
  if (entityType === "teachers") {
    return (
      "email,employee_id,first_name,last_name\n" +
      "alan.turing@university.edu,FAC-2026-001,Alan,Turing\n" +
      "ada.lovelace@university.edu,FAC-2026-002,Ada,Lovelace\n" +
      "grace.hopper@university.edu,FAC-2026-003,Grace,Hopper"
    );
  }
  if (entityType === "classes") {
    return (
      "class_name,subject_code,teacher_email,classroom_name,semester,batch,max_students\n" +
      "CS-101-A,CS101,teacher@university.edu,A-101,1,2022-2026,60\n" +
      "MATH-201,MTH201,teacher@university.edu,B-204,3,2021-2025,45"
    );
  }
  if (entityType === "departments") {
    return (
      "name,code,head,description\n" +
      "Computer Science & Engineering,CSE,Dr. Alan Turing,Department of Computing and AI\n" +
      "Electronics & Communication,ECE,Dr. Claude Shannon,Department of Electronics and Signal Processing\n" +
      "Mechanical Engineering,MECH,Dr. James Watt,Department of Mechanical Sciences"
    );
  }
  if (entityType === "subjects") {
    return (
      "name,code,description\n" +
      "Data Structures & Algorithms,CS201,Core Computer Science Subject\n" +
      "Database Management Systems,CS301,Relational and NoSQL Databases\n" +
      "Artificial Intelligence,CS401,Machine Learning and Deep Learning Concepts"
    );
  }
  if (entityType === "classrooms") {
    return (
      "name,building,capacity\n" +
      "Room 101,Block A,60\n" +
      "CS Lab 204,Technology Block,45\n" +
      "Main Auditorium,Central Campus,250"
    );
  }
  return (
    "name,code,description\n" +
    "Assistant Professor,ASST_PROF,Entry level faculty role\n" +
    "Associate Professor,ASSOC_PROF,Senior research and teaching faculty\n" +
    "Professor & Head of Department,HOD,Department Chair"
  );
}

