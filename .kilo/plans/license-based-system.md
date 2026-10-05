# License Based System Plan

## Objective
Replace the existing "Maximum Student Limit" with a license-based system where:
- Super admin allocates licenses to tenants.
- Each license allows one user (student or teacher) to be added to the tenant.
- Tenant admins can request more licenses.
- Super admin can approve or reject license requests.
- Remove the `maxAllowedStudents` field and replace with license tracking.

## Changes

### 1. Database Schema Updates
#### Prisma Schema (`backend/prisma/schema.prisma`)
- Remove field: `maxAllowedStudents Int @default(500) @map("max_allowed_students")`
- Add field: `licenseCount Int @default(0)` (or maybe a sensible default like 20 for trial?)
- We will keep the `@map` attribute if needed for column name, but we can keep it as `license_count` in DB? Let's use `@map("license_count")` to match snake_case.

#### New Model: LicenseRequest
```prisma
model LicenseRequest {
  id            String   @id @default(uuid())
  tenant        Tenant   @relation(fields: [tenantId], references: [id])
  tenantId      String
  requestedBy   User     @relation(fields: [requestedById], references: [id])
  requestedById String
  requestedCount Int      // Number of additional licenses requested
  status        LicenseRequestStatus @default(PENDING)
  processedBy   User?    @relation("ProcessedBy", fields: [processedById], references: [id])
  processedById String?
  processedAt   DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@map("license_requests")
}

enum LicenseRequestStatus {
  PENDING
  APPROVED
  REJECTED
}
```

### 2. Backend Service Updates

#### DTOs (`backend/app/schemas/super_admin.py`)
- Rename `max_allowed_students` to `license_count` in:
  - `TenantProvisionRequest`
  - `TenantUpdateRequest`
  - `TenantResponse`
  - `TenantDetailResponse`
- Update field definitions accordingly (keep validation: ge=0? or ge=1? We'll decide).

#### SuperAdminService (`backend/app/services/super_admin_service.py`)
- `provision_tenant`: 
  - Use `data.license_count` instead of `data.max_allowed_students` when creating tenant.
  - Return `license_count` in the response.
- `get_all_tenants`:
  - Instead of returning `max_allowed_students`, return `license_count`.
  - We may also want to return current usage (count of students + teachers) for info? Not required but could be useful.
- `get_tenant_by_id`:
  - Return `license_count`.
- `update_tenant`:
  - Handle `data.license_count` to update `licenseCount` field.

#### BulkImportService (`backend/app/services/admin/bulk_import_service.py`)
- In `bulk_create_students`:
  - Replace the check against `maxAllowedStudents` with a check against license limit.
  - Compute current usage: count of users in tenant with role IN ('STUDENT', 'TEACHER').
  - Check if `current_count + len(students) <= tenant.licenseCount`.
  - Update error message to reflect license capacity.
- In `bulk_create_teachers`:
  - Similarly, check against license limit (current usage + new teachers <= licenseCount).

#### StudentAdminService (`backend/app/services/admin/student_admin_service.py`)
- In `create_student`:
  - Replace the check against `maxAllowedStudents` with license limit check.
  - Compute current usage (students + teachers) and check if `current_count + 1 <= tenant.licenseCount`.

#### TeacherAdminService (`backend/app/services/admin/teacher_admin_service.py`)
- Add a similar check in `create_teacher`:
  - Compute current usage (students + teachers) and check if `current_count + 1 <= tenant.licenseCount`.

#### License Request Workflow
We need to add new methods in SuperAdminService (or a new service) for:
- `create_license_request(tenant_id, requested_by_user_id, requested_count)`: creates a LicenseRequest with status PENDING.
- `get_license_requests(status?: LicenseRequestStatus)`: returns list of requests (maybe filtered by status).
- `process_license_request(request_id, super_admin_user_id, approve: bool)`: 
  - If approve: increase tenant's licenseCount by requestedCount, set request status to APPROVED, set processedBy and processedAt.
  - If reject: set status to REJECTED, set processedBy and processedAt.
  - Return updated request.

We also need to add API endpoints in the super admin controller (if exists) or create new ones. However, we are not given the controller structure. We assume there is a super admin controller that routes to the service. We'll need to update the controller accordingly.

Since we are only planning, we note that the controller changes are needed.

### 3. Frontend Updates
#### TenantTable.tsx (`frontend/src/components/super-admin/TenantTable.tsx`)
- Replace the display of `max_allowed_students` with `license_count`.
- Update any tooltip or label accordingly.

#### Tenant Provisioning and Update Forms
- Update the forms to use `license_count` field instead of `max_allowed_students`.

#### License Request UI
- For tenant admins: a page/dialog to request more licenses (input for number, submit button).
- For super admin: a page to view and manage license requests (approve/reject).

### 4. Testing
- Update tests in:
  - `backend/tests/test_super_admin.py`
  - `backend/tests/test_tenant_suspension_qa.py`
  - `backend/tests/test_enterprise_features.py`
  - Any other tests that use `maxAllowedStudents`.

### 5. Migration
- Create a new Prisma migration to:
  - Remove `maxAllowedStudents` column.
  - Add `licenseCount` column with default value.
  - Create the `LicenseRequest` table and `LicenseRequestStatus` enum.

### 6. Notes
- We assume that only STUDENT and TEACHER roles consume licenses. ADMIN, TENANT_ADMIN, SUPER_ADMIN, etc. do not.
- The license count represents the total number of STUDENT and TEACHER users allowed in the tenant.
- When checking license usage, we count users by role, not by the existence of student/teacher profiles (though they should correspond).
- We need to ensure that the license count is never set below the current usage (validation in update_tenant and when processing license requests? Actually, we should allow reducing license count only if current usage <= new count. Otherwise, we should reject.

## Open Questions
1. What should be the default license count for new tenants? 0 or a trial number?
2. Should we allow licensing for other roles (like admins)? Probably not, as per the requirement.
3. How to handle existing data? We'll set licenseCount to 0 for existing tenants and require super admin to allocate licenses via requests? Or we can migrate based on current maxAllowedStudents? We could migrate by setting licenseCount equal to maxAllowedStudents for existing tenants. This seems reasonable.

## Implementation Steps
1. Update Prisma schema and generate migration.
2. Update DTOs and services.
3. Add LicenseRequest model and related service methods.
4. Update frontend.
5. Write tests.
6. Create migration script for existing data (if needed).
