# Implementation Plan: Todo Application with Full-Stack Architecture

**Branch**: `001-todo-app-spec` | **Date**: 2025-12-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-todo-app-spec/spec.md`

## Summary

This plan outlines the architectural design and implementation approach for a Cloud-Ready Todo Application. The application enables users to create, read, update, and delete tasks through a responsive web interface, backed by a RESTful API and PostgreSQL database. The architecture follows a three-tier pattern with strict separation of concerns:

- **Frontend (Next.js 14+)**: React-based UI with server-side rendering for optimal performance and SEO
- **Backend (FastAPI)**: High-performance async Python API with automatic OpenAPI documentation
- **Database (Neon PostgreSQL 15+)**: Serverless PostgreSQL with ACID compliance and cloud-native features

**Key Technical Approach**:
1. **Technology Stack**: Next.js (frontend), FastAPI (backend), SQLModel (ORM), Neon PostgreSQL (database)
2. **API Architecture**: RESTful endpoints with JSON payloads, comprehensive validation, structured error responses
3. **Data Model**: Single `Task` entity with UUID primary keys, ENUM status, and automatic timestamps
4. **Security**: Triple-layer validation (frontend/backend/database), parameterized queries, HTTPS, CORS restrictions
5. **Scalability**: Stateless backend, connection pooling, horizontal scaling support, serverless deployment
6. **Testing**: TDD workflow with unit, integration, and E2E tests across all layers

**Performance Targets**: Sub-second response times for all CRUD operations, supporting 100+ concurrent users and 100K+ tasks.

## Technical Context

**Language/Version**:
- Frontend: TypeScript 5.x with Next.js 14+
- Backend: Python 3.11+

**Primary Dependencies**:
- Frontend: React 18.2, Next.js 14, SWR 2.2, TypeScript 5.3
- Backend: FastAPI 0.104+, SQLModel 0.0.14+, Uvicorn 0.24+, AsyncPG 0.29+, Alembic 1.12+, Pydantic 2.5+

**Storage**: Neon PostgreSQL 15+ (serverless, cloud-native)

**Testing**:
- Frontend: Jest 29.7, React Testing Library 14.1, Playwright 1.40 (E2E)
- Backend: pytest 7.4, pytest-asyncio 0.21, httpx 0.25 (API testing)

**Target Platform**:
- Frontend: Modern web browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- Backend: Linux server (containerized or serverless)
- Deployment: Vercel (frontend), AWS Lambda/Google Cloud Run/Docker (backend), Neon (database)

**Project Type**: Web application (frontend + backend + database)

**Performance Goals**:
- Task creation: < 1 second (p95) - SC-001
- Task list load: < 2 seconds for 100 tasks - SC-002
- Task update: < 1 second (p95) - SC-003
- Task deletion: < 1 second (p95) - SC-004
- API endpoint response: < 200ms (p95)
- Backend throughput: 1000+ requests/minute
- Concurrent users: 100+

**Constraints**:
- Frontend bundle size: < 500KB compressed
- Backend memory: < 512MB per instance
- Database query time: < 50ms for CRUD operations
- Zero data loss during normal operations (ACID compliance)
- 99% uptime target

**Scale/Scope**:
- MVP users: Individual professionals (single-user mode, no authentication)
- Task capacity: 100,000+ tasks per database
- Future scale: Multi-user support with authentication (designed for but not implemented in MVP)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Note**: The constitution file (`.specify/memory/constitution.md`) is a template without specific project principles defined. The following gates apply general software engineering best practices:

### General Engineering Principles

#### ✅ Principle 1: Separation of Concerns
**Status**: PASS

**Evidence**:
- Three-tier architecture: Frontend (UI), Backend (API), Database (Persistence)
- Each layer has clear responsibilities defined in specifications
- No mixing of concerns (e.g., no database logic in frontend, no UI logic in backend)

#### ✅ Principle 2: Test-First Development (TDD)
**Status**: PASS

**Evidence**:
- Specification defines test requirements: FR-001 to FR-023 all testable
- Test frameworks identified: Jest (frontend), pytest (backend)
- Tasks will follow red-green-refactor cycle
- Acceptance criteria defined for all user stories

#### ✅ Principle 3: Security by Default
**Status**: PASS

**Evidence**:
- Input validation at all layers (frontend, backend, database)
- Parameterized queries via SQLModel ORM (SC-014: zero SQL injection)
- HTTPS in production (SC-015)
- CORS restrictions to specific origins
- Error sanitization (don't expose technical details)
- 100% request validation (SC-016)

#### ✅ Principle 4: Performance First
**Status**: PASS

**Evidence**:
- Success criteria define performance targets (SC-001 to SC-004, SC-010)
- Database indexing strategy defined (status, created_at, composite)
- Async architecture (FastAPI, Next.js Server Components)
- Connection pooling (Neon PgBouncer)
- Code splitting (Next.js automatic)

#### ✅ Principle 5: Cloud-Native Design
**Status**: PASS

**Evidence**:
- Stateless backend (SC-018: horizontal scaling)
- Environment variable configuration
- Serverless deployment support (Vercel, Lambda, Neon)
- Health check endpoints (/health)
- Container-ready architecture

#### ✅ Principle 6: Simplicity (YAGNI - You Aren't Gonna Need It)
**Status**: PASS

**Evidence**:
- MVP scope clearly defined (no auth, no collaboration, no real-time)
- Single entity data model (Task)
- Standard REST API (no GraphQL, no WebSockets)
- Out of Scope section defines 15 excluded features
- No premature optimization (start simple, optimize if needed)

### Gate Summary

| Principle | Status | Rationale |
|-----------|--------|-----------|
| Separation of Concerns | ✅ PASS | Three-tier architecture with clear boundaries |
| Test-First Development | ✅ PASS | TDD workflow, test frameworks identified |
| Security by Default | ✅ PASS | Triple-layer validation, parameterized queries, HTTPS |
| Performance First | ✅ PASS | Performance targets, indexing, async architecture |
| Cloud-Native Design | ✅ PASS | Stateless, scalable, container-ready |
| Simplicity (YAGNI) | ✅ PASS | MVP scope, single entity, standard patterns |

**Overall Gate Status**: ✅ PASS - Ready to proceed to Phase 0 (Research)

**Re-check After Phase 1**: ✅ PASS - Design maintains all principles

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-app-spec/
├── spec.md              # Feature specification (/sp.specify output)
├── plan.md              # This file (/sp.plan output)
├── research.md          # Technology research & decisions (Phase 0)
├── data-model.md        # Database schema & entity design (Phase 1)
├── quickstart.md        # Development setup guide (Phase 1)
├── contracts/           # API contracts (Phase 1)
│   ├── openapi.yaml     # OpenAPI 3.1 specification
│   └── README.md        # API documentation
├── checklists/          # Quality validation
│   └── requirements.md  # Spec quality checklist (completed)
└── tasks.md             # Implementation tasks (/sp.tasks output - NOT YET CREATED)
```

### Source Code (repository root)

**Structure Decision**: Web application (frontend + backend + database)

Rationale: Specification requires three distinct layers (FR-001 to FR-008 = frontend, FR-009 to FR-015 = backend, FR-016 to FR-020 = database). Separating frontend and backend into distinct projects enables:
- Independent deployment and scaling (SC-018, SC-019)
- Technology-specific tooling and testing
- Clear API contract boundary (contracts/)
- Parallel development by frontend/backend teams

```text
phase-2/
├── backend/                     # FastAPI backend application
│   ├── src/                     # Source code
│   │   ├── api/                 # API route handlers (controllers)
│   │   │   ├── __init__.py
│   │   │   └── tasks.py         # Task CRUD endpoints
│   │   ├── models/              # SQLModel ORM models
│   │   │   ├── __init__.py
│   │   │   └── task.py          # Task database model
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   │   ├── __init__.py
│   │   │   └── task.py          # TaskCreate, TaskUpdate, TaskRead
│   │   ├── services/            # Business logic layer
│   │   │   ├── __init__.py
│   │   │   └── task.py          # Task service (CRUD operations)
│   │   ├── db/                  # Database configuration
│   │   │   ├── __init__.py
│   │   │   └── session.py       # Database session management
│   │   ├── core/                # Core configuration
│   │   │   ├── __init__.py
│   │   │   ├── config.py        # Settings (env vars, Pydantic BaseSettings)
│   │   │   └── exceptions.py   # Custom exception handlers
│   │   └── main.py              # FastAPI application entry point
│   ├── tests/                   # Backend tests
│   │   ├── unit/                # Unit tests (services, models)
│   │   │   ├── test_task_service.py
│   │   │   └── test_task_model.py
│   │   ├── integration/         # Integration tests (API + DB)
│   │   │   └── test_task_api.py
│   │   └── conftest.py          # Pytest fixtures
│   ├── alembic/                 # Database migrations
│   │   ├── versions/            # Migration files
│   │   │   └── 001_create_tasks_table.py
│   │   ├── env.py               # Alembic environment config
│   │   └── script.py.mako       # Migration template
│   ├── requirements.txt         # Python dependencies
│   ├── pyproject.toml           # Python project configuration
│   ├── .env.example             # Environment variables template
│   ├── .gitignore               # Git ignore rules
│   ├── Dockerfile               # Container image (optional)
│   └── README.md                # Backend documentation
│
├── frontend/                    # Next.js frontend application
│   ├── src/                     # Source code
│   │   ├── app/                 # Next.js App Router (Next 14+)
│   │   │   ├── layout.tsx       # Root layout component
│   │   │   ├── page.tsx         # Home page (task list)
│   │   │   └── globals.css      # Global styles
│   │   ├── components/          # React components
│   │   │   ├── TaskList.tsx     # Task list container
│   │   │   ├── TaskItem.tsx     # Individual task display
│   │   │   ├── TaskForm.tsx     # Create/edit task form
│   │   │   ├── DeleteConfirm.tsx # Delete confirmation dialog
│   │   │   └── ErrorBoundary.tsx # Error boundary
│   │   ├── lib/                 # Utility functions
│   │   │   ├── api.ts           # API client (fetch wrapper)
│   │   │   └── validation.ts    # Client-side validation
│   │   ├── types/               # TypeScript type definitions
│   │   │   ├── task.ts          # Task interfaces
│   │   │   └── api.ts           # Generated from OpenAPI (auto-generated)
│   │   └── hooks/               # Custom React hooks
│   │       └── useTasks.ts      # SWR hook for task data fetching
│   ├── public/                  # Static assets
│   │   └── favicon.ico
│   ├── tests/                   # Frontend tests
│   │   ├── unit/                # Unit tests (components, hooks)
│   │   │   ├── TaskList.test.tsx
│   │   │   └── useTasks.test.ts
│   │   └── e2e/                 # End-to-end tests (Playwright)
│   │       └── tasks.spec.ts
│   ├── package.json             # Node dependencies
│   ├── tsconfig.json            # TypeScript configuration
│   ├── next.config.js           # Next.js configuration
│   ├── jest.config.js           # Jest configuration
│   ├── playwright.config.ts     # Playwright configuration
│   ├── .env.local.example       # Environment variables template
│   ├── .gitignore               # Git ignore rules
│   ├── Dockerfile               # Container image (optional)
│   └── README.md                # Frontend documentation
│
├── specs/                       # Feature specifications (existing)
│   └── 001-todo-app-spec/
│
├── .specify/                    # Spec-Kit Plus framework (existing)
│   ├── templates/
│   ├── scripts/
│   └── memory/
│
├── history/                     # Prompt history records (existing)
│   └── prompts/
│
├── .gitignore                   # Root git ignore
└── README.md                    # Project overview
```

**Directory Responsibilities**:

**Backend**:
- `api/`: Route handlers, endpoint definitions, request/response handling
- `models/`: SQLModel ORM models (database tables)
- `schemas/`: Pydantic validation schemas (request/response DTOs)
- `services/`: Business logic, database operations (CRUD)
- `db/`: Database connection, session management
- `core/`: Configuration, settings, exception handlers
- `tests/`: Unit and integration tests

**Frontend**:
- `app/`: Next.js pages using App Router (route structure)
- `components/`: Reusable React components (presentational + container)
- `lib/`: Utility functions, API client, helpers
- `types/`: TypeScript interfaces and types
- `hooks/`: Custom React hooks (data fetching, state management)
- `tests/`: Unit tests (Jest) and E2E tests (Playwright)

## System Architecture

### 1. Three-Tier Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│                      (Next.js 14 Frontend)                       │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  TaskList    │  │  TaskForm    │  │DeleteConfirm │         │
│  │  Component   │  │  Component   │  │   Dialog     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                  │                  │                  │
│         └──────────────────┼──────────────────┘                  │
│                            │                                     │
│                   ┌────────▼────────┐                           │
│                   │   SWR / API     │                           │
│                   │     Client      │                           │
│                   └────────┬────────┘                           │
└────────────────────────────┼──────────────────────────────────┘
                             │
                    HTTP/JSON │ (CORS, HTTPS in prod)
                             │
┌────────────────────────────▼──────────────────────────────────┐
│                      APPLICATION LAYER                          │
│                      (FastAPI Backend)                          │
│                                                                  │
│  ┌──────────────┐         ┌──────────────┐                     │
│  │   API Routes │ ───────→│   Services   │                     │
│  │  (tasks.py)  │         │  (task.py)   │                     │
│  └──────────────┘         └──────┬───────┘                     │
│         │                         │                             │
│         │                         │                             │
│  ┌──────▼──────┐          ┌──────▼────────┐                   │
│  │   Pydantic  │          │   SQLModel    │                   │
│  │ Validation  │          │   ORM Layer   │                   │
│  └─────────────┘          └──────┬────────┘                   │
└────────────────────────────────┼─────────────────────────────┘
                                  │
                      SQL Queries │ (Parameterized, Async)
                                  │
┌─────────────────────────────────▼─────────────────────────────┐
│                         DATA LAYER                              │
│                  (Neon PostgreSQL 15+)                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                     tasks Table                           │ │
│  │  ┌────┬───────┬─────────────┬────────┬────────┬────────┐ │ │
│  │  │ id │ title │ description │ status │created │updated │ │ │
│  │  │(PK)│VARCHAR│    TEXT     │ ENUM   │  TSTZ  │  TSTZ  │ │ │
│  │  └────┴───────┴─────────────┴────────┴────────┴────────┘ │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Layer Responsibilities

#### Presentation Layer (Frontend - Next.js)

**Responsibilities**:
1. **User Interface Rendering**:
   - Display task list (FR-001: list format)
   - Render create/edit forms (FR-002: create with title/description)
   - Show delete confirmation dialogs (FR-005: confirmation step)
   - Display loading states (FR-006: loading indicators)
   - Show error messages (FR-007: user-friendly errors)

2. **User Interaction Handling**:
   - Capture form input (title, description, status)
   - Handle button clicks (add, edit, delete, toggle status)
   - Implement optimistic UI updates (perceived performance)
   - Manage client-side routing (Next.js navigation)

3. **Client-Side Validation**:
   - Title required, 1-200 characters (HTML5 + React validation)
   - Description max 2000 characters
   - Instant feedback on invalid input

4. **API Communication**:
   - HTTP requests to backend (GET, POST, PATCH, DELETE)
   - JSON request/response handling
   - Error handling and retry logic
   - Data caching (SWR)

**Key Components**:
- `TaskList`: Container for displaying all tasks
- `TaskItem`: Individual task row with actions
- `TaskForm`: Form for creating/editing tasks
- `DeleteConfirm`: Modal dialog for delete confirmation
- `useTasks`: SWR hook for data fetching and mutations

**Does NOT**:
- Access database directly (no DB connection in browser)
- Implement business logic (defer to backend)
- Store sensitive data (no secrets in client code)

#### Application Layer (Backend - FastAPI)

**Responsibilities**:
1. **API Endpoint Exposure**:
   - RESTful routes (GET /tasks, POST /tasks, PATCH /tasks/{id}, DELETE /tasks/{id})
   - Request routing and HTTP method handling
   - Auto-generated API documentation (Swagger/ReDoc)

2. **Request Validation**:
   - Pydantic schema validation (FR-010: validate all requests)
   - Type checking (title: string, status: enum)
   - Constraint validation (title length, description length)
   - Return 400 Bad Request for invalid input

3. **Business Logic**:
   - CRUD operations coordination (create, read, update, delete)
   - Status transitions (pending ↔ completed)
   - Timestamp management (created_at, updated_at)

4. **Database Abstraction**:
   - Database session management
   - ORM queries via SQLModel
   - Transaction handling
   - Connection pooling

5. **Error Handling**:
   - Catch exceptions (database errors, validation errors)
   - Return structured error responses (JSON with code/message/details)
   - Log errors for debugging (FR-015: log all requests and errors)
   - Sanitize error messages (don't expose technical details to client)

6. **Cross-Cutting Concerns**:
   - CORS middleware (allow frontend origin)
   - Logging middleware (request/response logging)
   - Performance monitoring (request timing)

**Key Modules**:
- `api/tasks.py`: Route handlers (GET, POST, PATCH, DELETE)
- `services/task.py`: Business logic (CRUD operations)
- `schemas/task.py`: Request/response validation (TaskCreate, TaskUpdate, TaskRead)
- `models/task.py`: ORM model (Task table definition)
- `db/session.py`: Database session management

**Does NOT**:
- Render HTML (API only, no templates)
- Store session state (stateless for horizontal scaling)
- Perform long-running tasks synchronously (use async)

#### Data Layer (Database - Neon PostgreSQL)

**Responsibilities**:
1. **Data Persistence**:
   - Store task records durably (ACID compliance)
   - Enforce schema constraints (NOT NULL, CHECK, ENUM)
   - Maintain referential integrity (future: foreign keys)

2. **Data Retrieval**:
   - Execute queries efficiently (< 50ms for CRUD)
   - Use indexes for fast lookups (id, status, created_at)
   - Support filtering (WHERE status = 'pending')
   - Support sorting (ORDER BY created_at DESC)
   - Support pagination (LIMIT/OFFSET)

3. **Data Integrity**:
   - Primary key uniqueness (UUID collision prevention)
   - Constraint enforcement (title length, status enum)
   - Atomic transactions (all-or-nothing updates)
   - Automatic timestamp updates (trigger for updated_at)

4. **Concurrency**:
   - Handle multiple connections (connection pooling)
   - Lock management (prevent concurrent update conflicts)
   - Transaction isolation (read committed)

**Key Database Objects**:
- `tasks` table: Primary data storage
- `task_status` enum: Status constraint
- Indexes: id (PK), status, created_at, composite (status + created_at)
- Trigger: `update_tasks_updated_at` (auto-update updated_at)

**Does NOT**:
- Expose direct access to frontend (backend-only access)
- Perform complex business logic (simple CRUD)
- Send notifications (no triggers calling external APIs)

### 3. Data Flow Between Layers

#### Create Task Flow (POST /tasks)

```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Clicks "Add Task", enters title "Buy groceries"
     │
┌────▼─────────────────────────────────┐
│  Frontend (React)                     │
├───────────────────────────────────────┤
│  2. Client-side validation            │
│     - Title required? ✓               │
│     - Title 1-200 chars? ✓            │
│  3. Optimistic UI update              │
│     - Add task to local state         │
│     - Show loading indicator          │
│  4. POST /tasks                       │
│     { "title": "Buy groceries" }      │
└────┬──────────────────────────────────┘
     │ HTTP/JSON
┌────▼──────────────────────────────────┐
│  Backend (FastAPI)                    │
├───────────────────────────────────────┤
│  5. Route handler (POST /tasks)       │
│     - Parse JSON request              │
│  6. Pydantic validation               │
│     - TaskCreate schema               │
│     - Title required? ✓               │
│     - Title length valid? ✓           │
│  7. Service layer (create_task)       │
│     - Create Task ORM instance        │
│     - Set title, status=pending       │
│  8. Database session                  │
│     - session.add(task)               │
│     - session.commit()                │
└────┬──────────────────────────────────┘
     │ SQL INSERT
┌────▼──────────────────────────────────┐
│  Database (PostgreSQL)                │
├───────────────────────────────────────┤
│  9. Execute INSERT                    │
│     INSERT INTO tasks (id, title,     │
│       description, status,            │
│       created_at, updated_at)         │
│     VALUES (uuid_generate_v4(),       │
│       'Buy groceries', NULL,          │
│       'pending', NOW(), NOW())        │
│     RETURNING *;                      │
│  10. Return inserted row              │
└────┬──────────────────────────────────┘
     │ Task record
┌────▼──────────────────────────────────┐
│  Backend (FastAPI)                    │
├───────────────────────────────────────┤
│  11. Convert ORM → Pydantic           │
│      TaskRead schema                  │
│  12. Return HTTP 201 Created          │
│      { "id": "uuid", "title": ...,    │
│        "status": "pending", ... }     │
└────┬──────────────────────────────────┘
     │ JSON Response
┌────▼──────────────────────────────────┐
│  Frontend (React)                     │
├───────────────────────────────────────┤
│  13. Update local state               │
│      - Replace optimistic with real   │
│      - Clear loading indicator        │
│  14. Render updated task list         │
└────┬──────────────────────────────────┘
     │
┌────▼─────┐
│  User    │ Sees task "Buy groceries" with status "pending"
└──────────┘
```

**Performance**: Targets < 1 second end-to-end (SC-001)

#### Read Tasks Flow (GET /tasks)

```
┌──────────┐
│  User    │ Opens application or refreshes page
└────┬─────┘
     │
┌────▼─────────────────────────────────┐
│  Frontend (React)                     │
├───────────────────────────────────────┤
│  1. Component mount (useEffect)       │
│  2. useTasks hook triggers            │
│  3. Check SWR cache                   │
│     - Hit? Return cached data         │
│     - Miss? Fetch from API            │
│  4. GET /tasks                        │
└────┬──────────────────────────────────┘
     │ HTTP GET
┌────▼──────────────────────────────────┐
│  Backend (FastAPI)                    │
├───────────────────────────────────────┤
│  5. Route handler (GET /tasks)        │
│     - Parse query params (status,     │
│       limit, offset)                  │
│  6. Service layer (get_tasks)         │
│     - Build database query            │
│     - Apply filters (status)          │
│     - Apply sorting (created_at DESC) │
│     - Apply pagination (limit/offset) │
└────┬──────────────────────────────────┘
     │ SQL SELECT
┌────▼──────────────────────────────────┐
│  Database (PostgreSQL)                │
├───────────────────────────────────────┤
│  7. Execute SELECT                    │
│     SELECT * FROM tasks               │
│     WHERE status = 'pending'          │
│     ORDER BY created_at DESC          │
│     LIMIT 50 OFFSET 0;                │
│  8. Use indexes for performance       │
│     - idx_tasks_status_created_at     │
│  9. Return result set                 │
└────┬──────────────────────────────────┘
     │ Task records
┌────▼──────────────────────────────────┐
│  Backend (FastAPI)                    │
├───────────────────────────────────────┤
│  10. Convert ORM → Pydantic           │
│      List[TaskRead]                   │
│  11. Build pagination metadata        │
│      - total count                    │
│      - hasMore flag                   │
│  12. Return HTTP 200 OK               │
│      { "data": [...], "meta": {...} } │
└────┬──────────────────────────────────┘
     │ JSON Response
┌────▼──────────────────────────────────┐
│  Frontend (React)                     │
├───────────────────────────────────────┤
│  13. SWR caches response              │
│  14. Update component state           │
│  15. Render task list                 │
└────┬──────────────────────────────────┘
     │
┌────▼─────┐
│  User    │ Sees all pending tasks sorted by date
└──────────┘
```

**Performance**: Targets < 2 seconds for 100 tasks (SC-002)

#### Update Task Status Flow (PATCH /tasks/{id})

```
┌──────────┐
│  User    │ Clicks checkbox to mark task as completed
└────┬─────┘
     │
┌────▼─────────────────────────────────┐
│  Frontend (React)                     │
├───────────────────────────────────────┤
│  1. Optimistic UI update              │
│     - Toggle status in local state    │
│     - Visual feedback (checkbox)      │
│  2. PATCH /tasks/{taskId}             │
│     { "status": "completed" }         │
└────┬──────────────────────────────────┘
     │ HTTP PATCH
┌────▼──────────────────────────────────┐
│  Backend (FastAPI)                    │
├───────────────────────────────────────┤
│  3. Route handler (PATCH /tasks/{id}) │
│     - Extract task ID from path       │
│     - Parse JSON body                 │
│  4. Pydantic validation               │
│     - TaskUpdate schema               │
│     - Status is valid enum? ✓         │
│  5. Service layer (update_task)       │
│     - Fetch task by ID                │
│     - Task exists? Check 404          │
│     - Update status field             │
│     - updated_at auto-updated         │
│  6. Database session                  │
│     - session.commit()                │
└────┬──────────────────────────────────┘
     │ SQL UPDATE
┌────▼──────────────────────────────────┐
│  Database (PostgreSQL)                │
├───────────────────────────────────────┤
│  7. Execute UPDATE                    │
│     UPDATE tasks                      │
│     SET status = 'completed'          │
│     WHERE id = 'uuid'                 │
│     RETURNING *;                      │
│  8. Trigger fires                     │
│     - Auto-update updated_at          │
│  9. Return updated row                │
└────┬──────────────────────────────────┘
     │ Updated task record
┌────▼──────────────────────────────────┐
│  Backend (FastAPI)                    │
├───────────────────────────────────────┤
│  10. Convert ORM → Pydantic           │
│      TaskRead schema                  │
│  11. Return HTTP 200 OK               │
│      { "id": "uuid", "status":        │
│        "completed", "updated_at": ... }│
└────┬──────────────────────────────────┘
     │ JSON Response
┌────▼──────────────────────────────────┐
│  Frontend (React)                     │
├───────────────────────────────────────┤
│  12. Revalidate SWR cache             │
│      - Replace optimistic with real   │
│  13. Render updated task              │
└────┬──────────────────────────────────┘
     │
┌────▼─────┐
│  User    │ Sees task marked as completed with updated timestamp
└──────────┘
```

**Performance**: Targets < 1 second (SC-003)

#### Delete Task Flow (DELETE /tasks/{id})

```
┌──────────┐
│  User    │ Clicks delete button, confirms in dialog
└────┬─────┘
     │
┌────▼─────────────────────────────────┐
│  Frontend (React)                     │
├───────────────────────────────────────┤
│  1. Show confirmation dialog          │
│     "Delete 'Buy groceries'?"         │
│  2. User confirms                     │
│  3. Optimistic UI update              │
│     - Remove task from local state    │
│     - Show undo option (optional)     │
│  4. DELETE /tasks/{taskId}            │
└────┬──────────────────────────────────┘
     │ HTTP DELETE
┌────▼──────────────────────────────────┐
│  Backend (FastAPI)                    │
├───────────────────────────────────────┤
│  5. Route handler (DELETE /tasks/{id})│
│     - Extract task ID from path       │
│  6. Service layer (delete_task)       │
│     - Fetch task by ID                │
│     - Task exists? Check 404          │
│     - Delete task                     │
│  7. Database session                  │
│     - session.delete(task)            │
│     - session.commit()                │
└────┬──────────────────────────────────┘
     │ SQL DELETE
┌────▼──────────────────────────────────┐
│  Database (PostgreSQL)                │
├───────────────────────────────────────┤
│  8. Execute DELETE                    │
│     DELETE FROM tasks                 │
│     WHERE id = 'uuid';                │
│  9. Return affected rows (1)          │
└────┬──────────────────────────────────┘
     │ Success
┌────▼──────────────────────────────────┐
│  Backend (FastAPI)                    │
├───────────────────────────────────────┤
│  10. Return HTTP 204 No Content       │
└────┬──────────────────────────────────┘
     │ Empty Response
┌────▼──────────────────────────────────┐
│  Frontend (React)                     │
├───────────────────────────────────────┤
│  11. Revalidate SWR cache             │
│      - Confirm optimistic delete      │
│  12. Render updated task list         │
│      - Task removed                   │
└────┬──────────────────────────────────┘
     │
┌────▼─────┐
│  User    │ Task no longer visible in list
└──────────┘
```

**Performance**: Targets < 1 second (SC-004)

## API Architecture

### API Style: REST (Representational State Transfer)

**Decision**: RESTful API following standard HTTP conventions

**Principles**:
1. **Resource-Based URLs**: `/tasks` (collection), `/tasks/{id}` (individual)
2. **Standard HTTP Methods**: GET (read), POST (create), PATCH (update), DELETE (remove)
3. **Stateless**: No server-side session storage, each request is independent
4. **JSON Payloads**: All requests and responses use `application/json`
5. **HTTP Status Codes**: Meaningful status codes (200, 201, 400, 404, 500)
6. **HATEOAS** (optional future): Hypermedia links in responses

### Endpoint Structure (High-Level)

| Method | Path | Purpose | Request Body | Success Response |
|--------|------|---------|--------------|------------------|
| GET | `/tasks` | List all tasks (filtered, paginated) | None | 200 OK + task array |
| POST | `/tasks` | Create new task | TaskCreate JSON | 201 Created + task |
| GET | `/tasks/{taskId}` | Get single task | None | 200 OK + task |
| PATCH | `/tasks/{taskId}` | Update task (partial) | TaskUpdate JSON | 200 OK + updated task |
| DELETE | `/tasks/{taskId}` | Delete task | None | 204 No Content |
| GET | `/health` | Health check | None | 200 OK + status |

**URL Design**:
- Base path: `/` (no `/api/v1/` prefix in MVP, can add later)
- Resource noun (plural): `/tasks` not `/task`
- Resource identifier: UUID in path `/tasks/{taskId}`
- Query parameters for filtering: `/tasks?status=pending`
- Query parameters for pagination: `/tasks?limit=50&offset=0`

### Request/Response Responsibility

#### Requests (Client → Server)

**Frontend Responsibilities**:
1. **Construct Valid Requests**:
   - Correct HTTP method (GET, POST, PATCH, DELETE)
   - Valid URL with required path parameters
   - JSON body with required fields (POST/PATCH)
   - Proper headers (`Content-Type: application/json`)

2. **Client-Side Validation** (UX Enhancement):
   - Check required fields before sending (title)
   - Validate field lengths (title 1-200, description max 2000)
   - Validate field types (status enum)
   - Show validation errors immediately

3. **Error Handling**:
   - Catch network errors (backend unreachable)
   - Parse error responses (JSON with error code/message)
   - Display user-friendly error messages
   - Implement retry logic for transient errors

**Example Request**:
```javascript
// Create task
await fetch('http://localhost:8000/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Buy groceries',
    description: 'Milk, eggs, bread'
  })
});
```

#### Responses (Server → Client)

**Backend Responsibilities**:
1. **Validate Requests** (Security):
   - Server-side validation (authoritative source of truth)
   - Check required fields (title)
   - Validate field lengths and types
   - Return 400 Bad Request for invalid input

2. **Process Business Logic**:
   - Execute CRUD operations
   - Apply default values (status defaults to 'pending')
   - Generate UUIDs, timestamps
   - Handle database transactions

3. **Return Structured Responses**:
   - Appropriate HTTP status code
   - JSON body with data or error
   - Consistent response format
   - Pagination metadata (for list endpoints)

**Success Response Format**:
```json
// Single resource (GET /tasks/{id}, POST, PATCH)
{
  "id": "uuid",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "pending",
  "createdAt": "2025-12-13T10:30:00Z",
  "updatedAt": "2025-12-13T10:30:00Z"
}

// Collection (GET /tasks)
{
  "data": [ /* array of tasks */ ],
  "meta": {
    "total": 42,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

**Error Response Format**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Task title is required",
    "details": {
      "field": "title",
      "constraint": "required"
    }
  }
}
```

## State & Data Management

### Where Data is Stored

#### 1. Source of Truth: PostgreSQL Database
- **Permanent Storage**: All task data persisted in `tasks` table
- **ACID Guarantees**: Durability, consistency (SC-006: zero data loss)
- **Location**: Neon cloud-hosted PostgreSQL
- **Backup**: Neon automatic backups (point-in-time recovery)

#### 2. Backend Application State (Transient)
- **Database Connections**: Connection pool managed by SQLModel/SQLAlchemy
- **Request Context**: Per-request data (request ID, user agent, etc.)
- **No Session Storage**: Stateless design (SC-018: horizontal scaling)

#### 3. Frontend Application State (Temporary)
- **SWR Cache**: In-memory cache of API responses (client-side)
  - Cached data: Task list, individual task details
  - Cache invalidation: Automatic revalidation on mutations
  - Cache duration: Configurable (default: revalidate on focus)

- **React Component State**: Local UI state
  - Form input values (title, description)
  - Loading indicators (isLoading, isSubmitting)
  - Error messages (errorMessage)
  - UI-only state (dialog open/closed, selected filters)

- **Browser Storage** (optional future):
  - LocalStorage: Draft tasks (prevent data loss on accidental close)
  - SessionStorage: Session-specific UI preferences

### How Data Moves

#### 1. User → Frontend → Backend → Database (Create/Update/Delete)
```
User Input
  ↓ (React event handler)
React Component State
  ↓ (Form submission)
API Client (fetch/axios)
  ↓ (HTTP Request: POST/PATCH/DELETE)
Backend API Endpoint
  ↓ (Pydantic validation)
Service Layer (business logic)
  ↓ (SQLModel ORM)
Database (INSERT/UPDATE/DELETE)
```

#### 2. Database → Backend → Frontend → User (Read)
```
Database (SELECT query)
  ↓ (SQLModel ORM)
Service Layer (fetch data)
  ↓ (Convert ORM → Pydantic)
Backend API Endpoint (JSON response)
  ↓ (HTTP Response: 200 OK)
SWR Cache (store in memory)
  ↓ (Return cached data)
React Component (render)
  ↓ (React render cycle)
User (sees UI)
```

#### 3. Optimistic Updates (Perceived Performance)
```
User clicks "Mark Complete"
  ↓ (Immediately)
Update Local State (optimistic)
  ↓ (Visual feedback)
User sees completed task ✓
  ║
  ║ (Background)
  ↓
Send PATCH request to backend
  ↓
Database updated
  ↓
Response returns
  ↓
Confirm or rollback optimistic update
```

**Rollback on Error**:
- If backend returns error (404, 500), revert optimistic update
- Show error message to user
- Keep task in previous state

### Error Handling Strategy

#### 1. Error Types

| Error Type | HTTP Status | Where Handled | Example |
|-----------|-------------|---------------|---------|
| Validation Error | 400 | Backend (Pydantic) | Title missing, invalid status |
| Not Found Error | 404 | Backend (Service layer) | Task ID doesn't exist |
| Database Error | 500 | Backend (Exception handler) | Connection timeout, constraint violation |
| Network Error | N/A | Frontend (API client) | Backend unreachable |

#### 2. Backend Error Handling

```python
# api/tasks.py
from fastapi import HTTPException

@app.post("/tasks")
async def create_task(task: TaskCreate):
    try:
        # Pydantic validates automatically
        result = await task_service.create(task)
        return result
    except ValidationError as e:
        # Pydantic validation failed
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": str(e),
                    "details": e.errors()
                }
            }
        )
    except DatabaseError as e:
        # Database connection failed
        logger.error(f"Database error: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": {
                    "code": "INTERNAL_ERROR",
                    "message": "An unexpected error occurred"
                }
            }
        )
```

**Error Sanitization**: Never expose:
- Database connection strings
- Stack traces (log only, don't return to client)
- Internal file paths
- Sensitive data (passwords, tokens)

#### 3. Frontend Error Handling

```typescript
// lib/api.ts
async function createTask(data: TaskCreate): Promise<Task> {
  try {
    const response = await fetch('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(error.error);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      // Backend error (validation, not found, etc.)
      throw error;
    } else {
      // Network error (backend unreachable)
      throw new NetworkError('Unable to connect to server');
    }
  }
}

// components/TaskForm.tsx
const handleSubmit = async (data) => {
  try {
    await createTask(data);
    setSuccessMessage('Task created successfully');
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR') {
      setErrorMessage(`Invalid input: ${error.message}`);
    } else if (error instanceof NetworkError) {
      setErrorMessage('Cannot connect to server. Please try again.');
    } else {
      setErrorMessage('An unexpected error occurred.');
    }
  }
};
```

**User-Friendly Messages** (SC-012):
- `VALIDATION_ERROR`: "Task title must be between 1 and 200 characters"
- `NOT_FOUND`: "Task not found. It may have been deleted."
- `INTERNAL_ERROR`: "Something went wrong. Please try again later."
- `NetworkError`: "Unable to connect to server. Check your connection."

#### 4. Error Recovery Strategies

| Scenario | Strategy |
|----------|----------|
| Validation error | Show inline form errors, keep user input |
| Task not found (404) | Show message, redirect to task list |
| Network error | Show retry button, cache failed request |
| Database unavailable (503) | Show maintenance message, retry after delay |
| Optimistic update fails | Rollback local state, show error |

## Security & Environment Strategy

### Environment Variables Usage

#### Backend Environment Variables

**File**: `backend/.env`

```bash
# Database Configuration
DATABASE_URL=postgresql+asyncpg://user:password@ep-host.neon.tech/database?sslmode=require

# API Server Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true  # Development only, false in production

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com

# Logging Configuration
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR, CRITICAL

# Application Configuration
ENV=development  # development, staging, production
```

**Loading Environment Variables** (backend):
```python
# core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_reload: bool = False
    cors_origins: list[str] = []
    log_level: str = "INFO"
    env: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()
```

#### Frontend Environment Variables

**File**: `frontend/.env.local`

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Feature Flags (future)
# NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

**Note**: `NEXT_PUBLIC_` prefix exposes variable to browser (client-side). Never put secrets in `NEXT_PUBLIC_` variables.

**Loading Environment Variables** (frontend):
```typescript
// lib/config.ts
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
};
```

#### Environment-Specific Configuration

| Environment | DATABASE_URL | CORS_ORIGINS | LOG_LEVEL | API_RELOAD |
|-------------|--------------|--------------|-----------|------------|
| Development | Local Neon branch | http://localhost:3000 | DEBUG | true |
| Staging | Staging Neon branch | https://staging.yourdomain.com | INFO | false |
| Production | Production Neon DB | https://yourdomain.com | WARNING | false |

### API Security Basics

#### 1. Input Validation (SC-016: 100% validation)

**Triple-Layer Validation**:

**Layer 1: Frontend (Client-Side)**
```typescript
// Client-side validation (UX improvement, not security)
const validateTitle = (title: string) => {
  if (!title || title.length < 1) {
    return 'Title is required';
  }
  if (title.length > 200) {
    return 'Title must be 200 characters or less';
  }
  return null;
};
```

**Layer 2: Backend (Server-Side - Authoritative)**
```python
# Pydantic schema validation (automatic via FastAPI)
class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    status: TaskStatus = TaskStatus.PENDING
```

**Layer 3: Database (Schema Constraints)**
```sql
-- Database constraints (defense in depth)
CREATE TABLE tasks (
    title VARCHAR(200) NOT NULL
        CHECK (length(title) >= 1 AND length(title) <= 200),
    description TEXT
        CHECK (length(description) <= 2000),
    status task_status NOT NULL DEFAULT 'pending'
);
```

#### 2. SQL Injection Prevention (SC-014: zero SQL injection)

**Use ORM (SQLModel) with Parameterized Queries**:
```python
# ✅ SECURE: ORM uses parameterized queries
task = await session.get(Task, task_id)

# ✅ SECURE: SQLModel filters use parameterization
tasks = await session.exec(
    select(Task).where(Task.status == "pending")
)

# ❌ INSECURE: Never use raw SQL with string formatting
# query = f"SELECT * FROM tasks WHERE id = '{task_id}'"  # SQL injection!
```

#### 3. HTTPS in Production (SC-015)

**Development**: HTTP (localhost)
**Production**: HTTPS only

**Backend Configuration**:
```python
# Redirect HTTP to HTTPS in production
if settings.env == "production":
    app.add_middleware(HTTPSRedirectMiddleware)
```

**Frontend Configuration**:
```typescript
// Use HTTPS API URL in production
const apiUrl = process.env.NODE_ENV === 'production'
  ? 'https://api.yourdomain.com'
  : 'http://localhost:8000';
```

#### 4. CORS (Cross-Origin Resource Sharing)

**Restrict to Allowed Origins**:
```python
# main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,  # NOT ["*"]
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Content-Type"],
)
```

**Environment-Specific**:
- Development: `allow_origins=["http://localhost:3000"]`
- Production: `allow_origins=["https://yourdomain.com"]`

#### 5. Error Message Sanitization

**Don't Expose Technical Details**:
```python
# ✅ SECURE: Sanitized error message
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}

# ❌ INSECURE: Exposes database details
{
  "error": {
    "message": "psycopg2.OperationalError: FATAL: password authentication failed for user 'admin'"
  }
}
```

**Logging Strategy**:
- Log full error details server-side (for debugging)
- Return sanitized messages to client
- Never log sensitive data (passwords, tokens)

#### 6. Rate Limiting (Production)

**Add Rate Limiting Middleware** (future enhancement):
```python
# Future: Add rate limiting
from slowapi import Limiter

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/tasks")
@limiter.limit("100/minute")
async def create_task(...):
    ...
```

**Alternative**: Use API Gateway rate limiting (AWS API Gateway, Cloudflare)

#### 7. Security Headers

**Add Security Headers** (production):
```python
# middleware/security.py
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000"
    return response
```

### Database Access Control

#### 1. Backend-Only Access

**Firewall Rules**:
- Database accessible only from backend server IP
- No direct public access to PostgreSQL port (5432)
- Use Neon's built-in connection pooling (PgBouncer)

**Neon Configuration**:
```
# Backend can connect
Allowed IPs: [Backend server IP, GitHub Actions runners for migrations]

# Frontend CANNOT connect
Frontend → Backend API → Database (indirect access only)
```

#### 2. Least Privilege Principle

**Database User Permissions**:
```sql
-- Create application user with minimal permissions
CREATE USER todo_app_user WITH PASSWORD 'secure_password';

-- Grant only necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON tasks TO todo_app_user;

-- Revoke dangerous permissions
REVOKE CREATE, DROP, ALTER ON DATABASE todo_db FROM todo_app_user;
```

#### 3. Connection String Security

**Secure Storage**:
- Store `DATABASE_URL` in environment variable (not in code)
- Use secrets management in production (AWS Secrets Manager, Azure Key Vault, Neon connection string in Vercel env vars)
- Rotate database password periodically

**Example Secure Connection**:
```python
# ✅ SECURE: Load from environment variable
from core.config import settings
engine = create_async_engine(settings.database_url)

# ❌ INSECURE: Hardcoded connection string
# engine = create_async_engine("postgresql://user:pass@host/db")  # Never do this!
```

#### 4. Database Connection Pooling

**Use Connection Pool**:
```python
# db/session.py
from sqlmodel.ext.asyncio.session import AsyncEngine

engine = create_async_engine(
    settings.database_url,
    echo=False,  # Disable SQL logging in production
    pool_size=20,  # Max connections
    max_overflow=10,  # Additional connections if pool full
    pool_pre_ping=True,  # Test connection before use
)
```

**Benefits**:
- Reuses connections (faster)
- Limits concurrent connections (prevents overload)
- Handles connection failures gracefully

## Scalability & Cloud Readiness

### Horizontal Scalability Considerations

#### 1. Stateless Backend Design (SC-018)

**No Server-Side Session Storage**:
- All request data in HTTP headers/body/params
- No session cookies (for MVP without auth)
- Future: JWT tokens for authentication (stateless)

**Benefits**:
- Multiple backend instances can handle requests
- Load balancer can route to any instance
- Instances can be added/removed dynamically

**Example Load Balancing**:
```
User Request
  ↓
Load Balancer (AWS ALB, Nginx)
  ├──→ Backend Instance 1
  ├──→ Backend Instance 2
  └──→ Backend Instance 3
       ↓
Neon PostgreSQL (connection pooling)
```

#### 2. Database Connection Pooling (FR-020)

**Neon Built-In Pooling**:
- PgBouncer connection pooler included
- Pool mode: Transaction pooling (recommended for serverless)
- Max connections: Configurable per project

**Backend Configuration**:
```python
# Use Neon pooling connection string
DATABASE_URL=postgresql+asyncpg://user:pass@pooler.neon.tech/db
```

**Scaling Pattern**:
- Each backend instance: 20 connections (pool_size=20)
- 5 backend instances: 100 total connections
- Neon handles pooling across all instances

#### 3. Caching Strategy (Future Optimization)

**Current**: No caching (MVP simplicity)

**Future Enhancements**:
- **Client-Side Cache**: SWR (already implemented)
- **HTTP Cache**: Cache-Control headers for GET /tasks
- **Application Cache**: Redis for frequently accessed tasks
- **Database Cache**: PostgreSQL query cache (automatic)

**When to Add**:
- If response times exceed targets (> 200ms p95)
- If database CPU usage > 70%
- If read:write ratio > 10:1

#### 4. Auto-Scaling Configuration

**Backend** (Serverless deployment):
```yaml
# AWS Lambda / Google Cloud Run / Azure Functions
min_instances: 1
max_instances: 100
scale_trigger: CPU > 70% or Request queue > 10
scale_down: After 5 minutes idle
```

**Database** (Neon auto-scaling):
- Compute: Auto-scales based on workload
- Storage: Auto-scales as data grows
- Auto-suspend: After 5 minutes inactivity (free tier)

### Cloud Deployment Readiness

#### 1. Containerization (Docker)

**Backend Dockerfile**:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./src ./src
COPY ./alembic ./alembic
COPY alembic.ini .

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Frontend Dockerfile**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### 2. Deployment Options

| Component | Option 1 (Serverless) | Option 2 (Container) | Recommendation |
|-----------|----------------------|---------------------|----------------|
| Frontend | Vercel | AWS ECS, Cloud Run | Vercel (best Next.js support) |
| Backend | AWS Lambda, Cloud Run | AWS ECS, Cloud Run | Cloud Run (flexibility) |
| Database | Neon (serverless) | Neon (serverless) | Neon (cost-effective) |

**Recommended Stack**:
- Frontend: Vercel (automatic deployments, Edge CDN, zero config)
- Backend: Google Cloud Run (containerized, auto-scaling, pay-per-use)
- Database: Neon PostgreSQL (serverless, auto-scaling, free tier)

#### 3. Infrastructure as Code (IaC)

**Terraform Example** (backend deployment):
```hcl
resource "google_cloud_run_service" "backend" {
  name     = "todo-backend"
  location = "us-central1"

  template {
    spec {
      containers {
        image = "gcr.io/project/todo-backend:latest"
        env {
          name  = "DATABASE_URL"
          value = var.database_url
        }
      }
    }
  }
}
```

**GitHub Actions CI/CD**:
```yaml
name: Deploy Backend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t backend ./backend
      - name: Deploy to Cloud Run
        run: gcloud run deploy ...
```

#### 4. Monitoring & Observability

**Health Checks**:
```python
@app.get("/health")
async def health_check():
    try:
        # Check database connection
        await session.execute(text("SELECT 1"))
        return {"status": "healthy", "timestamp": datetime.utcnow()}
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={"status": "unhealthy", "error": str(e)}
        )
```

**Logging**:
```python
import structlog

logger = structlog.get_logger()

@app.middleware("http")
async def log_requests(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time

    logger.info(
        "request_completed",
        method=request.method,
        path=request.url.path,
        status_code=response.status_code,
        duration_ms=duration * 1000,
    )
    return response
```

**Metrics** (future):
- Request count, latency (p50, p95, p99)
- Error rate (4xx, 5xx)
- Database query time
- Active connections

**Tools**:
- **Errors**: Sentry (error tracking)
- **Logs**: Cloudflare Logs, AWS CloudWatch
- **Metrics**: Prometheus + Grafana, Datadog
- **Tracing**: OpenTelemetry (future)

#### 5. Cost Optimization

**Free Tier Targets** (MVP):
- Neon: 0.5GB storage, 300 hours compute (free)
- Vercel: Unlimited deployments, 100GB bandwidth (free)
- Cloud Run: 2M requests/month (free)

**Estimated Monthly Costs** (100 users):
- Frontend (Vercel): $0 (within free tier)
- Backend (Cloud Run): $0-5 (mostly free tier)
- Database (Neon): $0-10 (small dataset)
- **Total**: < $20/month

**Cost Scaling** (1000 users):
- Frontend: $20 (pro plan)
- Backend: $30 (higher request volume)
- Database: $25 (more compute)
- **Total**: ~$75/month

### Separation of Concerns

#### 1. Layered Architecture Enforcement

**Dependency Direction**:
```
Frontend → Backend API (HTTP)
Backend API → Services (function calls)
Services → Models/ORM (function calls)
Models/ORM → Database (SQL)
```

**No Bypass**:
- Frontend NEVER accesses database directly
- Frontend NEVER imports backend code
- Backend NEVER renders UI
- Database NEVER contains business logic

#### 2. API as Contract Boundary

**OpenAPI Specification**:
- Single source of truth for API contract
- Frontend generates TypeScript types from spec
- Backend implementation validates against spec
- Contract tests ensure compliance

**Benefits**:
- Frontend and backend teams work independently
- API changes are explicit and versioned
- Type safety across stack

#### 3. Modular Code Organization

**Backend Modules**:
- `api/`: HTTP layer (routes, request/response)
- `services/`: Business logic (stateless functions)
- `models/`: Data layer (ORM, database access)
- `schemas/`: Validation (Pydantic models)
- `core/`: Configuration (settings, exceptions)

**Frontend Modules**:
- `app/`: Routing and pages
- `components/`: UI components (reusable)
- `lib/`: Utilities (API client, helpers)
- `hooks/`: Data fetching and state management
- `types/`: TypeScript interfaces

**No Cross-Module Dependencies** (within layer):
- `api/tasks.py` should NOT import `api/users.py`
- `components/TaskList.tsx` should NOT import `components/UserProfile.tsx`
- Exception: Shared utilities (`lib/`, `core/`)

## Subagent Opportunities

### Overview

Subagents are specialized AI assistants that can handle specific development tasks autonomously. This section identifies areas where subagents can accelerate implementation while maintaining code quality.

### 1. Backend Agent (Python/FastAPI Specialist)

**Responsibilities**:
- Implement FastAPI route handlers (api/tasks.py)
- Write service layer business logic (services/task.py)
- Create Pydantic schemas (schemas/task.py)
- Write SQLModel ORM models (models/task.py)
- Implement exception handlers (core/exceptions.py)
- Write backend unit and integration tests (pytest)

**Skills Required**:
- Python 3.11+ syntax and best practices
- FastAPI framework (routes, dependencies, middleware)
- SQLModel ORM (queries, relationships)
- Async/await patterns
- Pydantic validation
- pytest testing

**Example Tasks**:
- "Implement GET /tasks endpoint with pagination and filtering"
- "Write service layer for task CRUD operations"
- "Create integration tests for task API endpoints"
- "Add error handling for database connection failures"

**Inputs**:
- `contracts/openapi.yaml` (API specification)
- `data-model.md` (database schema)
- `spec.md` (functional requirements)

**Outputs**:
- Working backend code (api/, services/, models/, schemas/)
- Unit tests (tests/unit/)
- Integration tests (tests/integration/)

### 2. Frontend Agent (React/Next.js Specialist)

**Responsibilities**:
- Implement Next.js pages and layouts (app/)
- Create React components (components/)
- Write custom hooks (hooks/useTasks.ts)
- Implement API client (lib/api.ts)
- Add client-side validation (lib/validation.ts)
- Write frontend unit and E2E tests (Jest, Playwright)

**Skills Required**:
- TypeScript 5.x syntax
- React 18 (hooks, components, state management)
- Next.js 14 App Router
- SWR data fetching
- CSS/Tailwind for styling
- Jest and Playwright testing

**Example Tasks**:
- "Implement TaskList component with filtering and sorting"
- "Create TaskForm component with validation"
- "Write useTasks hook with SWR for data fetching"
- "Add E2E test for creating and completing a task"

**Inputs**:
- `contracts/openapi.yaml` (API specification)
- `spec.md` (UI requirements: FR-001 to FR-008)
- OpenAPI-generated TypeScript types (types/api.ts)

**Outputs**:
- Working frontend code (app/, components/, lib/, hooks/)
- Unit tests (tests/unit/)
- E2E tests (tests/e2e/)

### 3. Database Agent (SQL/PostgreSQL Specialist)

**Responsibilities**:
- Create database migration files (Alembic)
- Write SQL schema definitions
- Create indexes for performance
- Implement database triggers (e.g., update_updated_at)
- Write database seed data (development)
- Optimize slow queries (EXPLAIN ANALYZE)

**Skills Required**:
- PostgreSQL 15+ syntax and features
- Alembic migrations
- SQL performance optimization
- Database indexing strategies
- Database constraints and triggers

**Example Tasks**:
- "Create Alembic migration for tasks table with indexes"
- "Implement trigger for auto-updating updated_at timestamp"
- "Write seed data for 1000 sample tasks (development)"
- "Optimize query performance for filtering pending tasks"

**Inputs**:
- `data-model.md` (database schema)
- `spec.md` (data requirements: FR-016 to FR-020)

**Outputs**:
- Alembic migration files (alembic/versions/)
- SQL scripts (seeds/, migrations/)
- Performance optimization reports

### 4. Testing Agent (QA Specialist)

**Responsibilities**:
- Write unit tests for backend services
- Write integration tests for API endpoints
- Write frontend component tests
- Write E2E tests for user flows
- Implement test fixtures and mocks
- Generate test coverage reports

**Skills Required**:
- pytest (backend testing)
- Jest + React Testing Library (frontend unit tests)
- Playwright (E2E testing)
- Test-driven development (TDD)
- Mocking and stubbing

**Example Tasks**:
- "Write unit tests for task service CRUD operations"
- "Create integration tests for POST /tasks endpoint"
- "Implement E2E test for complete task workflow (create → update → delete)"
- "Generate test coverage report and identify gaps"

**Inputs**:
- `spec.md` (acceptance scenarios for each user story)
- Implemented code (backend/, frontend/)

**Outputs**:
- Test files (tests/)
- Test coverage reports
- Test documentation

### 5. DevOps Agent (Deployment Specialist)

**Responsibilities**:
- Create Dockerfiles for backend and frontend
- Write CI/CD pipeline configurations (GitHub Actions)
- Set up environment variable templates (.env.example)
- Configure deployment scripts
- Implement health check endpoints
- Create infrastructure as code (Terraform)

**Skills Required**:
- Docker containerization
- CI/CD pipelines (GitHub Actions, GitLab CI)
- Cloud platforms (Vercel, AWS, GCP)
- Infrastructure as Code (Terraform, CloudFormation)
- Shell scripting

**Example Tasks**:
- "Create Dockerfile for FastAPI backend with multi-stage build"
- "Write GitHub Actions workflow for automated deployment"
- "Set up Vercel deployment configuration for Next.js frontend"
- "Create Terraform configuration for Cloud Run deployment"

**Inputs**:
- `quickstart.md` (deployment requirements)
- `spec.md` (cloud readiness requirements)

**Outputs**:
- Dockerfiles
- CI/CD configurations (.github/workflows/)
- IaC files (Terraform, etc.)
- Deployment documentation

### 6. Documentation Agent (Technical Writer)

**Responsibilities**:
- Write API documentation (beyond OpenAPI)
- Create developer onboarding guides
- Document architecture decisions
- Write code comments (when necessary)
- Generate README files
- Create troubleshooting guides

**Skills Required**:
- Technical writing
- Markdown formatting
- API documentation
- Architecture diagrams (Mermaid, PlantUML)

**Example Tasks**:
- "Write comprehensive README for backend setup"
- "Create troubleshooting guide for common errors"
- "Document environment variable configuration"
- "Generate architecture diagram for data flow"

**Inputs**:
- All specification files (spec.md, plan.md, data-model.md, contracts/)
- Implemented code

**Outputs**:
- README files
- Documentation files (docs/)
- Code comments (inline)

### Subagent Coordination Strategy

**Parallel Execution**:
- Backend Agent and Frontend Agent work simultaneously (different directories)
- Database Agent completes migrations before Backend Agent runs integration tests
- Testing Agent runs after implementation agents complete

**Sequential Dependencies**:
```
1. Database Agent (create schema)
     ↓
2. Backend Agent + Frontend Agent (parallel)
     ↓
3. Testing Agent (validate integration)
     ↓
4. DevOps Agent (deploy)
     ↓
5. Documentation Agent (finalize docs)
```

**Communication via Artifacts**:
- OpenAPI spec (contracts/openapi.yaml): Shared contract
- TypeScript types (types/api.ts): Generated from OpenAPI
- Environment variables (.env.example): Shared configuration
- Test fixtures (tests/conftest.py): Shared test data

## Complexity Tracking

**No complexity violations identified.** All architectural decisions follow standard best practices and industry conventions:

- Three-tier architecture: Standard pattern, no unnecessary layers
- Technology choices: Mature, well-documented frameworks (Next.js, FastAPI, PostgreSQL)
- Data model: Single entity (Task), no over-normalization
- API design: RESTful conventions, no custom protocols
- Testing strategy: Standard TDD with pytest/Jest, no custom frameworks
- Deployment: Standard containerization and serverless patterns

**Simplicity Principles Followed**:
- YAGNI: No features beyond MVP scope
- DRY: Shared validation logic, reusable components
- KISS: Straightforward CRUD operations, no complex state machines
- Separation of Concerns: Clear layer boundaries, no cross-cutting code

---

**Plan Status**: COMPLETE
**Gates Passed**: ✅ All constitution checks passed
**Artifacts Generated**:
- ✅ research.md (Phase 0 - Technology research)
- ✅ data-model.md (Phase 1 - Database schema)
- ✅ contracts/openapi.yaml (Phase 1 - API specification)
- ✅ contracts/README.md (Phase 1 - API documentation)
- ✅ quickstart.md (Phase 1 - Setup guide)
- ✅ plan.md (This file - Complete architectural plan)

**Ready for Next Phase**: YES → `/sp.tasks` to generate implementation tasks

**Validation**:
- Meets all functional requirements (FR-001 to FR-023)
- Satisfies all success criteria (SC-001 to SC-019)
- Addresses all non-functional requirements (Performance, Security, Scalability, Cloud Readiness)
- Follows specification out-of-scope boundaries (no auth, no collaboration, no real-time)
- Implements all user stories (P1 to P4) with defined architecture

**Next Command**: `/sp.tasks` - Break down this plan into testable implementation tasks following TDD workflow
