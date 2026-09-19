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
  return (
    "class_name,subject_code,teacher_email,classroom_name,semester,batch,max_students\n" +
    "CS-101-A,CS101,teacher@university.edu,A-101,1,2022-2026,60\n" +
    "MATH-201,MTH201,teacher@university.edu,B-204,3,2021-2025,45"
  );
}
