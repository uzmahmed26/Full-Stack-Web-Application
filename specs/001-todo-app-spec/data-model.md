# Data Model: Todo Application

**Feature**: 001-todo-app-spec
**Date**: 2025-12-13
**Purpose**: Define database schema and entity relationships for the Todo Application

## Overview

The Todo Application uses a relational data model centered around a single core entity: **Task**. The data model is designed to be simple, normalized, and extensible for future enhancements (e.g., user ownership, categories, tags).

**Database**: Neon PostgreSQL 15+
**ORM**: SQLModel (SQLAlchemy 2.0 + Pydantic)
**Schema Management**: Alembic migrations

## Core Entity: Task

### Entity Purpose
Represents a single todo item that users can create, read, update, and delete. Each task has a title, optional description, status indicator, and audit timestamps.

### Fields

| Field Name | Type | Constraints | Description | Source Requirement |
|-----------|------|-------------|-------------|-------------------|
| `id` | UUID | PRIMARY KEY, NOT NULL, DEFAULT uuid_generate_v4() | Unique identifier for the task | FR-017 (unique ID) |
| `title` | VARCHAR(200) | NOT NULL, CHECK (length(title) >= 1 AND length(title) <= 200) | Task title | FR-002, FR-017 (required, 1-200 chars) |
| `description` | TEXT | NULLABLE, CHECK (length(description) <= 2000) | Optional task description | FR-002, FR-017 (optional, max 2000 chars) |
| `status` | task_status (ENUM) | NOT NULL, DEFAULT 'pending' | Task completion status | FR-017 (status: pending/completed) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp | FR-017 (created timestamp, ISO 8601) |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last modification timestamp | FR-017 (updated timestamp, ISO 8601) |

### Custom Types

#### task_status ENUM
```sql
CREATE TYPE task_status AS ENUM ('pending', 'completed');
```

**Values**:
- `pending`: Task not yet completed (default)
- `completed`: Task marked as done

**Rationale**: Using ENUM enforces valid status values at the database level, preventing invalid states.

### Indexes

```sql
-- Primary key index (automatic)
CREATE UNIQUE INDEX idx_tasks_id ON tasks(id);

-- Status filter index (for filtering pending/completed tasks)
CREATE INDEX idx_tasks_status ON tasks(status);

-- Created timestamp index (for sorting by date)
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);

-- Composite index for status + created_at (optimizes filtered sorted queries)
CREATE INDEX idx_tasks_status_created_at ON tasks(status, created_at DESC);
```

**Index Justification**:
- `idx_tasks_id`: Primary key, used for lookups by ID
- `idx_tasks_status`: Supports User Story 4 (filter by status: pending/completed)
- `idx_tasks_created_at`: Supports sorting tasks by creation date (newest first)
- `idx_tasks_status_created_at`: Optimizes queries like "Get all pending tasks sorted by date" (common use case)

**Performance**: These indexes support SC-002 (load task list in under 2 seconds) and FR-019 (efficient queries).

### Constraints

1. **NOT NULL Constraints**:
   - `id`: Every task must have a unique identifier
   - `title`: Every task must have a title (cannot be empty)
   - `status`: Every task must have a status (defaults to pending)
   - `created_at`: Every task must have a creation timestamp
   - `updated_at`: Every task must have an update timestamp

2. **CHECK Constraints**:
   - `title`: Length between 1 and 200 characters (validates FR-017 requirement)
   - `description`: Length at most 2000 characters (validates FR-017 requirement)

3. **DEFAULT Constraints**:
   - `id`: Automatically generated UUID v4
   - `status`: Defaults to 'pending' for new tasks
   - `created_at`: Automatically set to current timestamp on insert
   - `updated_at`: Automatically set to current timestamp on insert, updated on modification

### Database Trigger: Auto-Update Timestamp

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to call function on UPDATE
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

**Rationale**: Ensures `updated_at` is automatically maintained without requiring application code to set it explicitly. Meets FR-017 (auto-updated timestamp).

## SQLModel Model Definition

### Backend Model (Python)

```python
from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class TaskStatus(str, Enum):
    """Task completion status enumeration."""
    PENDING = "pending"
    COMPLETED = "completed"


class TaskBase(SQLModel):
    """Base task model with shared fields for creation and updates."""
    title: str = Field(
        min_length=1,
        max_length=200,
        description="Task title (required, 1-200 characters)"
    )
    description: Optional[str] = Field(
        default=None,
        max_length=2000,
        description="Task description (optional, max 2000 characters)"
    )
    status: TaskStatus = Field(
        default=TaskStatus.PENDING,
        description="Task completion status"
    )


class Task(TaskBase, table=True):
    """Database task model (ORM)."""
    __tablename__ = "tasks"

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        nullable=False,
        description="Unique task identifier"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Creation timestamp (UTC)"
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Last update timestamp (UTC)"
    )


class TaskCreate(TaskBase):
    """Schema for creating a new task (API request)."""
    # Inherits title, description, status from TaskBase
    # Status defaults to PENDING if not provided
    pass


class TaskUpdate(SQLModel):
    """Schema for updating an existing task (API request)."""
    title: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=200,
        description="Updated task title"
    )
    description: Optional[str] = Field(
        default=None,
        max_length=2000,
        description="Updated task description"
    )
    status: Optional[TaskStatus] = Field(
        default=None,
        description="Updated task status"
    )


class TaskRead(TaskBase):
    """Schema for reading a task (API response)."""
    id: UUID
    created_at: datetime
    updated_at: datetime
```

**Model Explanation**:
- `TaskBase`: Shared fields for creation and reading
- `Task`: Database ORM model with table definition
- `TaskCreate`: API request schema for creating tasks
- `TaskUpdate`: API request schema for partial updates (PATCH)
- `TaskRead`: API response schema for returning tasks

**Validation**: Pydantic (via SQLModel) automatically validates:
- Title length (1-200 chars)
- Description length (max 2000 chars)
- Status enum values (only 'pending' or 'completed')
- Field types (string, UUID, datetime, enum)

This meets FR-010 (backend validation), FR-022 (parameterized queries via ORM), and SC-016 (100% request validation).

## Database Schema (PostgreSQL DDL)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create task status enum
CREATE TYPE task_status AS ENUM ('pending', 'completed');

-- Create tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL CHECK (length(title) >= 1 AND length(title) <= 200),
    description TEXT CHECK (length(description) <= 2000),
    status task_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_tasks_status_created_at ON tasks(status, created_at DESC);

-- Create trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE tasks IS 'Todo tasks table';
COMMENT ON COLUMN tasks.id IS 'Unique task identifier (UUID v4)';
COMMENT ON COLUMN tasks.title IS 'Task title (required, 1-200 characters)';
COMMENT ON COLUMN tasks.description IS 'Task description (optional, max 2000 characters)';
COMMENT ON COLUMN tasks.status IS 'Task completion status (pending or completed)';
COMMENT ON COLUMN tasks.created_at IS 'Creation timestamp (UTC, auto-generated)';
COMMENT ON COLUMN tasks.updated_at IS 'Last update timestamp (UTC, auto-updated)';
```

## Data Flow & State Transitions

### Task Lifecycle

```
┌─────────────┐
│   CREATE    │
│  (POST)     │
└──────┬──────┘
       │
       ↓
┌─────────────────┐     UPDATE (PATCH)      ┌─────────────────┐
│  status:        │ ───────────────────────→ │  status:        │
│  pending        │                          │  completed      │
│  (default)      │ ←─────────────────────── │                 │
└─────────────────┘     UPDATE (PATCH)      └─────────────────┘
       │                                              │
       │                                              │
       ↓                                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       DELETE                                 │
│                   (with confirmation)                        │
└─────────────────────────────────────────────────────────────┘
```

### Status Transitions

| From State | To State | Trigger | Validation |
|-----------|----------|---------|-----------|
| N/A | `pending` | Task creation (POST /tasks) | Title required (1-200 chars) |
| `pending` | `completed` | User marks task complete (PATCH /tasks/{id}) | Valid task ID exists |
| `completed` | `pending` | User reopens task (PATCH /tasks/{id}) | Valid task ID exists |
| Any | Deleted | User deletes task (DELETE /tasks/{id}) | Valid task ID exists, confirmation provided |

**Validation Rules**:
1. Task cannot be created without a title
2. Task status can only be 'pending' or 'completed'
3. Timestamps are immutable by users (created_at), auto-updated (updated_at)
4. Task ID is immutable after creation

## Example Data

### Sample Task (Pending)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, coffee",
  "status": "pending",
  "created_at": "2025-12-13T10:30:00Z",
  "updated_at": "2025-12-13T10:30:00Z"
}
```

### Sample Task (Completed)
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "title": "Write project specification",
  "description": null,
  "status": "completed",
  "created_at": "2025-12-12T09:00:00Z",
  "updated_at": "2025-12-13T14:45:00Z"
}
```

## Database Queries

### Common Query Patterns

#### 1. Get All Tasks (Sorted by Creation Date, Newest First)
```sql
SELECT * FROM tasks
ORDER BY created_at DESC
LIMIT 50 OFFSET 0;
```
**Index Used**: `idx_tasks_created_at`
**Performance**: O(log n) with index

#### 2. Get Tasks by Status (e.g., Pending Tasks)
```sql
SELECT * FROM tasks
WHERE status = 'pending'
ORDER BY created_at DESC
LIMIT 50 OFFSET 0;
```
**Index Used**: `idx_tasks_status_created_at` (composite index)
**Performance**: O(log n) with index

#### 3. Get Single Task by ID
```sql
SELECT * FROM tasks
WHERE id = '550e8400-e29b-41d4-a716-446655440000';
```
**Index Used**: Primary key index
**Performance**: O(1) hash lookup

#### 4. Create Task
```sql
INSERT INTO tasks (title, description, status)
VALUES ('Buy groceries', 'Milk, eggs, bread', 'pending')
RETURNING *;
```
**Performance**: O(1) insert + index updates

#### 5. Update Task Status
```sql
UPDATE tasks
SET status = 'completed'
WHERE id = '550e8400-e29b-41d4-a716-446655440000'
RETURNING *;
```
**Note**: `updated_at` automatically updated via trigger
**Performance**: O(1) update + index updates

#### 6. Update Task Details (Partial Update)
```sql
UPDATE tasks
SET title = 'Buy groceries and cook dinner',
    description = 'Milk, eggs, bread, coffee, chicken'
WHERE id = '550e8400-e29b-41d4-a716-446655440000'
RETURNING *;
```
**Performance**: O(1) update

#### 7. Delete Task
```sql
DELETE FROM tasks
WHERE id = '550e8400-e29b-41d4-a716-446655440000';
```
**Performance**: O(1) delete + index updates

#### 8. Count Tasks by Status
```sql
SELECT status, COUNT(*) as count
FROM tasks
GROUP BY status;
```
**Index Used**: `idx_tasks_status`
**Performance**: O(n) but optimized with index

#### 9. Search Tasks by Title (Simple LIKE)
```sql
SELECT * FROM tasks
WHERE title ILIKE '%grocery%'
ORDER BY created_at DESC;
```
**Note**: For User Story 4 (P4 - Search). ILIKE is case-insensitive.
**Performance**: O(n) without full-text search (acceptable for MVP, optimize later if needed)

## Future Extensibility

The current data model is designed to support future enhancements without breaking changes:

### 1. User Ownership (Multi-Tenancy)
Add `user_id` column when authentication is implemented:
```sql
ALTER TABLE tasks ADD COLUMN user_id UUID REFERENCES users(id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

### 2. Task Metadata (Flexible Attributes)
Add JSONB column for extensibility:
```sql
ALTER TABLE tasks ADD COLUMN metadata JSONB DEFAULT '{}';
CREATE INDEX idx_tasks_metadata ON tasks USING GIN(metadata);
```
**Use Cases**: Tags, priority, due date, attachments (without schema changes)

### 3. Soft Deletes (Audit Trail)
Add `deleted_at` column instead of hard deletes:
```sql
ALTER TABLE tasks ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;
CREATE INDEX idx_tasks_deleted_at ON tasks(deleted_at) WHERE deleted_at IS NULL;
```
**Benefit**: Enables "undo delete" and maintains audit history

### 4. Task Categories/Tags (Many-to-Many)
Add separate tables for categories and task-category relationships:
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE task_categories (
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, category_id)
);
```

### 5. Task History (Audit Log)
Add audit table for tracking changes:
```sql
CREATE TABLE task_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    field_name VARCHAR(50) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Data Validation Summary

| Validation Type | Location | Implementation | Requirement |
|----------------|----------|----------------|-------------|
| Title required | Database | NOT NULL constraint | FR-002, FR-017 |
| Title length (1-200) | Database + Backend + Frontend | CHECK constraint, Pydantic, HTML5 | FR-017 |
| Description length (max 2000) | Database + Backend + Frontend | CHECK constraint, Pydantic, HTML5 | FR-017 |
| Status enum | Database + Backend | ENUM type, Pydantic Enum | FR-017 |
| UUID format | Backend | Pydantic UUID type | FR-017 |
| Timestamp format | Database + Backend | TIMESTAMPTZ, datetime | FR-017 (ISO 8601) |

**Defense in Depth**: Triple validation (frontend → backend → database) ensures data integrity and security (SC-016).

## Migration Strategy

### Initial Migration (via Alembic)
```bash
# Create migration
alembic revision --autogenerate -m "Create tasks table"

# Apply migration
alembic upgrade head
```

### Rollback Strategy
```bash
# Rollback last migration
alembic downgrade -1

# Rollback to specific version
alembic downgrade <revision_id>
```

### Migration Best Practices
1. Never modify existing migrations (create new ones)
2. Test migrations on staging before production
3. Backup database before applying migrations
4. Use Neon branching for testing migrations in isolation

---

**Data Model Status**: COMPLETE
**Schema Validated Against**: FR-016 to FR-020, FR-022, SC-006, SC-009, SC-014
**Ready for API Contract Generation**: YES
