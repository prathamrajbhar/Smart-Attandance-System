# Plan: Remove Classroom Capacity and Class MaxStudents System

## Objective
Remove the capacity field from the Classroom model and the maxStudents field from the AcademicClass model, as they are no longer needed.

## Changes Required

### 1. Prisma Schema (`backend/prisma/schema.prisma`)
- Remove `capacity` field from `Classroom` model (line 319)
- Remove `maxStudents` field from `AcademicClass` model (line 190)

### 2. Pydantic Schemas
#### `backend/app/schemas/admin.py`
- Remove `max_students` field from:
  - `ClassCreate` (line 15)
  - `ClassUpdate` (line 32)
  - `ClassResponse` (line 71)
  - `ClassBulkItem` (line 196)

#### `backend/app/schemas/master_data.py`
- Remove `capacity` field from:
  - `ClassroomCreate` (line 45)
  - `ClassroomUpdate` (line 58)
  - `ClassroomResponse` (line 72)

### 3. Services
#### `backend/app/services/admin/classroom_service.py`
- Remove `capacity` parameter from `create_classroom` method (line 19)
- Remove `capacity` from the data dictionary (line 20)
- Update docstring if necessary

#### `backend/app/services/admin/class_admin_service.py`
- Remove `max_students` parameter from `create_class` method (implicitly via `ClassCreate` schema, but we need to update the method signature if it's explicitly used? Actually, the method takes `data: ClassCreate`, so after schema change, the parameter will no longer have max_students. However, we also need to remove the usage in the method body:
  - Line 35: remove `"maxStudents": data.max_students,`
  - Line 47: remove `max_students=cls.maxStudents,` from ClassResponse creation
  - Line 85: same as line 47
  - Line 126: remove `"max_students": "maxStudents",` from mapping
  - Line 134: remove `max_students=cls.maxStudents,`
  - Line 158: remove `max_students=cls.maxStudents,`
- Similarly for `update_class` method:
  - Line 126: mapping already noted
  - Line 134: remove `max_students=cls.maxStudents,`
  - Line 158: remove `max_students=cls.maxStudents,`

#### `backend/app/services/admin/bulk_import_service.py`
- In `bulk_create_classes` method, line 244: remove `"maxStudents": item.max_students,`

#### `backend/app/services/admin_service.py`
- The `create_classroom` method calls `ClassroomService.create_classroom` with capacity; after updating the service, we need to remove the capacity argument.
- Line 171: remove `capacity` parameter
- Line 172: remove `capacity` argument
- Line 260: remove `capacity=item.capacity,`

### 4. API Routes (`backend/app/api/admin.py`)
- The endpoints use the Pydantic models, so after schema updates, the request/response bodies will automatically not include the fields. However, we need to ensure that the endpoints do not manually handle the fields.
- Specifically:
  - `create_classroom` endpoint (line 662): passes `data.capacity` to `admin_service.create_classroom` -> after service update, we need to remove this argument.
  - `get_classroom` endpoint: returns `ClassroomResponse` which will no longer have capacity (already updated in schema)
  - `update_classroom` endpoint (line 673): passes `data.capacity` via `data.model_dump(exclude_unset=True)` -> after schema update, capacity will not be in the data if not provided, but we should ensure that the endpoint does not require capacity. Since the update method in service will not accept capacity, we need to make sure that the capacity field is not sent in the request. This is handled by the schema update (the update model will no longer have capacity). So we just need to update the service to ignore capacity if passed (but better to remove from the schema so it's not sent at all).

### 5. Test Fixtures (`backend/tests/conftest.py`)
- Remove `capacity` from the mock classroom fixture (line 143)
- Remove `maxStudents` from the mock academic class fixture (line 152)

### 6. Seed Data (`backend/scripts/seeder/data_generator.py`)
- Remove `capacity` from the preset classrooms (lines 60-62)

### 7. Prisma Migration
After updating the schema, run:
```bash
prisma migrate dev --name remove_capacity_and_maxstudents
```
(or the appropriate migration command for the environment)

### 8. Verification
- Ensure all tests pass.
- Verify that the API endpoints no longer accept or return capacity/maxStudents fields.
- Check that the database schema has been updated (columns removed).

## Notes
- The `tenant.maxAllowedStudents` field (in Tenant model) is unrelated and should be retained.
- No business logic was found that enforces classroom capacity or class maxStudents for enrollment limits; therefore, removal should not affect functional requirements.
- Ensure to update any documentation or comments that reference these fields.

## Steps to Execute
1. Update Prisma schema.
2. Update Pydantic schemas.
3. Update services.
4. Update API routes.
5. Update test fixtures.
6. Update seed data.
7. Run Prisma migration.
8. Run tests to verify.