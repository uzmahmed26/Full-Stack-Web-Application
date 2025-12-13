# Implementation Tasks: Cloud-Ready Todo Application

**Feature**: 001-todo-app-spec
**Branch**: `001-todo-app-spec`
**Created**: 2025-12-13
**Status**: Ready for Implementation

## Overview

This document breaks down the implementation of the Cloud-Ready Todo Application into atomic, testable tasks following Test-Driven Development (TDD) principles. Tasks are organized by user story priority (P1 → P2 → P3 → P4) to enable incremental delivery of value.

**Technology Stack**:
- Frontend: Next.js 14, TypeScript 5.x, React 18, SWR 2.2
- Backend: FastAPI 0.104+, Python 3.11+, SQLModel 0.0.14+, Uvicorn 0.24+
- Database: Neon PostgreSQL 15+, Alembic 1.12+
- Testing: pytest 7.4 (backend), Jest 29.7 + Playwright 1.40 (frontend)

**Architecture**: Three-tier (Frontend → Backend → Database)

---

## Task Statistics

- **Total Tasks**: 85
- **Setup & Foundational**: 15 tasks
- **User Story 1 (P1 - MVP)**: 28 tasks
- **User Story 2 (P2)**: 16 tasks
- **User Story 3 (P3)**: 12 tasks
- **User Story 4 (P4)**: 8 tasks
- **Polish & Deployment**: 6 tasks
- **Parallel Opportunities**: 52 tasks marked [P]

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)
**User Story 1 (P1) ONLY**: Create and View Tasks
- Complete all Phase 1 (Setup), Phase 2 (Foundational), and Phase 3 (US1) tasks
- Deliver independently testable increment: Users can create tasks and view them in a list
- Total MVP tasks: 43 tasks (Setup + Foundational + US1)

### Incremental Delivery
After MVP, deliver each user story independently:
1. **Phase 4 (US2)**: Add task status updates and editing (16 tasks)
2. **Phase 5 (US3)**: Add task deletion with confirmation (12 tasks)
3. **Phase 6 (US4)**: Add filtering and search (8 tasks)
4. **Phase 7 (Polish)**: Final polish and deployment (6 tasks)

### TDD Workflow
Each implementation task follows: **RED → GREEN → REFACTOR**
1. **RED**: Write failing test first
2. **GREEN**: Implement minimal code to pass test
3. **REFACTOR**: Improve code quality while keeping tests green

---

## Phase 1: Setup & Project Initialization

**Goal**: Set up project structure, dependencies, and development environment

**Duration Estimate**: 2-3 hours

### Backend Setup

- [ ] T001 [P] Create backend directory structure per plan.md (backend/src/{api,models,schemas,services,db,core}/, backend/tests/{unit,integration}/, backend/alembic/)
- [ ] T002 [P] Create backend/requirements.txt with dependencies (fastapi, sqlmodel, uvicorn, asyncpg, alembic, pydantic, pydantic-settings, pytest, pytest-asyncio, httpx)
- [ ] T003 [P] Create backend/pyproject.toml with project metadata and tool configurations
- [ ] T004 [P] Create backend/.env.example with environment variable templates (DATABASE_URL, API_HOST, API_PORT, CORS_ORIGINS, LOG_LEVEL, ENV)
- [ ] T005 [P] Create backend/.gitignore with Python patterns (venv/, __pycache__/, .env, *.pyc, .pytest_cache/)
- [ ] T006 Create Python virtual environment and install dependencies (python -m venv venv, pip install -r requirements.txt)

### Frontend Setup

- [ ] T007 [P] Initialize Next.js 14 project with TypeScript in frontend/ directory (npx create-next-app@latest frontend --typescript --app --tailwind)
- [ ] T008 [P] Install frontend dependencies (npm install swr)
- [ ] T009 [P] Create frontend/.env.local.example with environment variable templates (NEXT_PUBLIC_API_URL)
- [ ] T010 [P] Update frontend/.gitignore with Next.js patterns (.next/, node_modules/, .env.local)
- [ ] T011 [P] Create frontend directory structure (src/{app,components,lib,types,hooks}/, tests/{unit,e2e}/)

### Database Setup

- [ ] T012 Sign up for Neon PostgreSQL account and create project "todo-app-dev"
- [ ] T013 Copy Neon connection string to backend/.env as DATABASE_URL (postgresql+asyncpg://...)
- [ ] T014 Initialize Alembic in backend/alembic/ (cd backend && alembic init alembic)
- [ ] T015 Configure Alembic env.py to import SQLModel models and use DATABASE_URL from settings

---

## Phase 2: Foundational Layer (Database & Core Backend)

**Goal**: Implement database schema, core models, and backend infrastructure that all user stories depend on

**Duration Estimate**: 3-4 hours

**Independent Test**: Database connection works, migrations apply successfully, core infrastructure is operational

### Database Schema & Models

- [ ] T016 [P] Write unit test for Task model validation in backend/tests/unit/test_task_model.py (test_task_model_valid_creation, test_task_model_invalid_title_length, test_task_status_enum)
- [ ] T017 Implement Task SQLModel in backend/src/models/task.py (TaskStatus enum, Task table model with id, title, description, status, created_at, updated_at)
- [ ] T018 [P] Write unit tests for TaskCreate schema in backend/tests/unit/test_task_schema.py (test_task_create_valid, test_task_create_missing_title, test_task_create_title_too_long)
- [ ] T019 [P] Implement Pydantic schemas in backend/src/schemas/task.py (TaskBase, TaskCreate, TaskUpdate, TaskRead)
- [ ] T020 Create Alembic migration for tasks table in backend/alembic/versions/001_create_tasks_table.py (CREATE TABLE with UUID, VARCHAR(200), TEXT, task_status ENUM, TIMESTAMPTZ, indexes, trigger)
- [ ] T021 Apply Alembic migration to Neon database (alembic upgrade head)
- [ ] T022 Verify database schema in Neon console (psql connection, \dt to list tables, \d tasks to describe table)

### Backend Core Infrastructure

- [ ] T023 [P] Implement settings configuration in backend/src/core/config.py (Settings class with BaseSettings, load from .env)
- [ ] T024 [P] Implement database session management in backend/src/db/session.py (create_async_engine, AsyncSession dependency, get_session function)
- [ ] T025 [P] Implement custom exceptions in backend/src/core/exceptions.py (TaskNotFoundError, ValidationError, DatabaseError)
- [ ] T026 [P] Implement exception handlers in backend/src/main.py (HTTP exception handler, validation error handler, database error handler)
- [ ] T027 [P] Write unit test for settings in backend/tests/unit/test_config.py (test_settings_load_from_env, test_settings_defaults)
- [ ] T028 Create FastAPI application in backend/src/main.py (app instance, CORS middleware, exception handlers, health check endpoint)
- [ ] T029 [P] Write integration test for health endpoint in backend/tests/integration/test_health.py (test_health_endpoint_returns_200, test_health_endpoint_checks_database)
- [ ] T030 Verify backend server starts successfully (uvicorn src.main:app --reload, access http://localhost:8000/docs)

---

## Phase 3: User Story 1 (P1) - Create and View Tasks

**Priority**: P1 (MVP - Highest Priority)

**Goal**: Users can create new tasks with title and description, and view all tasks in a list

**Why This First**: Core value proposition - users must be able to capture and see their tasks. Without this, the application has no purpose.

**Independent Test**: Create a task via UI, verify it appears in the list, refresh browser, confirm task persists (FR-001, FR-002, FR-003, SC-001, SC-002)

**Duration Estimate**: 6-8 hours

### Backend API - Create Task (POST /tasks)

- [ ] T031 [P] [US1] Write unit test for TaskService.create in backend/tests/unit/test_task_service.py (test_create_task_success, test_create_task_empty_title, test_create_task_title_too_long)
- [ ] T032 [US1] Implement TaskService.create in backend/src/services/task.py (async def create, validate input, save to database via session, return Task)
- [ ] T033 [P] [US1] Write integration test for POST /tasks endpoint in backend/tests/integration/test_task_api.py (test_create_task_201, test_create_task_400_missing_title, test_create_task_400_title_too_long)
- [ ] T034 [US1] Implement POST /tasks endpoint in backend/src/api/tasks.py (async def create_task, use TaskService, return 201 with Location header)
- [ ] T035 [US1] Register tasks router in backend/src/main.py (app.include_router(tasks_router))
- [ ] T036 [US1] Manual test: Create task via Swagger UI at http://localhost:8000/docs (verify 201 response, check database with psql)

### Backend API - List Tasks (GET /tasks)

- [ ] T037 [P] [US1] Write unit test for TaskService.get_all in backend/tests/unit/test_task_service.py (test_get_all_tasks_empty, test_get_all_tasks_with_data, test_get_all_tasks_pagination)
- [ ] T038 [US1] Implement TaskService.get_all in backend/src/services/task.py (async def get_all, query with limit/offset, return List[Task] and total count)
- [ ] T039 [P] [US1] Write integration test for GET /tasks endpoint in backend/tests/integration/test_task_api.py (test_get_tasks_200_empty, test_get_tasks_200_with_data, test_get_tasks_pagination)
- [ ] T040 [US1] Implement GET /tasks endpoint in backend/src/api/tasks.py (async def list_tasks, query params: limit/offset, return 200 with data and meta)
- [ ] T041 [US1] Manual test: List tasks via Swagger UI (create multiple tasks, verify pagination works)

### Backend API - Get Single Task (GET /tasks/{id})

- [ ] T042 [P] [US1] Write unit test for TaskService.get_by_id in backend/tests/unit/test_task_service.py (test_get_task_by_id_success, test_get_task_by_id_not_found)
- [ ] T043 [US1] Implement TaskService.get_by_id in backend/src/services/task.py (async def get_by_id, query by UUID, raise TaskNotFoundError if not found)
- [ ] T044 [P] [US1] Write integration test for GET /tasks/{id} endpoint in backend/tests/integration/test_task_api.py (test_get_task_200, test_get_task_404)
- [ ] T045 [US1] Implement GET /tasks/{id} endpoint in backend/src/api/tasks.py (async def get_task, return 200 or 404)

### Frontend - API Client

- [ ] T046 [P] [US1] Create TypeScript types in frontend/src/types/task.ts (Task interface, TaskCreate interface, TaskStatus type, PaginatedResponse interface)
- [ ] T047 [P] [US1] Implement API client base in frontend/src/lib/api.ts (fetchTasks, createTask functions with fetch, error handling, JSON parsing)
- [ ] T048 [P] [US1] Write unit tests for API client in frontend/tests/unit/lib/api.test.ts (test_fetchTasks_success, test_createTask_success, test_api_error_handling)

### Frontend - Data Fetching Hook

- [ ] T049 [P] [US1] Implement useTasks hook in frontend/src/hooks/useTasks.ts (use SWR for fetching, mutations for create, error handling, loading states)
- [ ] T050 [P] [US1] Write unit tests for useTasks hook in frontend/tests/unit/hooks/useTasks.test.ts (test_useTasks_loading, test_useTasks_success, test_useTasks_error, test_createTask_mutation)

### Frontend - UI Components

- [ ] T051 [P] [US1] Create TaskForm component in frontend/src/components/TaskForm.tsx (form with title/description inputs, validation, submit handler, loading state, error display)
- [ ] T052 [P] [US1] Write unit tests for TaskForm in frontend/tests/unit/components/TaskForm.test.tsx (test_form_renders, test_form_validation, test_form_submit, test_form_error_display)
- [ ] T053 [P] [US1] Create TaskItem component in frontend/src/components/TaskItem.tsx (display task title, description, status, created date)
- [ ] T054 [P] [US1] Write unit tests for TaskItem in frontend/tests/unit/components/TaskItem.test.tsx (test_task_item_renders, test_task_item_displays_all_fields)
- [ ] T055 [P] [US1] Create TaskList component in frontend/src/components/TaskList.tsx (map over tasks array, render TaskItem for each, empty state message)
- [ ] T056 [P] [US1] Write unit tests for TaskList in frontend/tests/unit/components/TaskList.test.tsx (test_task_list_empty_state, test_task_list_renders_tasks)
- [ ] T057 [US1] Create main page in frontend/src/app/page.tsx (use useTasks hook, render TaskForm and TaskList, loading indicator, error handling)
- [ ] T058 [US1] Create root layout in frontend/src/app/layout.tsx (HTML structure, metadata, global styles)

### Frontend - Styling

- [ ] T059 [P] [US1] Add global styles in frontend/src/app/globals.css (reset, typography, colors, layout utilities)
- [ ] T060 [P] [US1] Style TaskForm component (form layout, input fields, button styles, error messages)
- [ ] T061 [P] [US1] Style TaskList and TaskItem components (list layout, card design, spacing, responsive design)

### Integration Testing (US1)

- [ ] T062 [US1] Write E2E test for create task flow in frontend/tests/e2e/create-task.spec.ts (test_user_creates_task_and_sees_in_list using Playwright)
- [ ] T063 [US1] Write E2E test for view tasks flow in frontend/tests/e2e/view-tasks.spec.ts (test_user_views_task_list, test_empty_state_message)
- [ ] T064 [US1] Write E2E test for persistence in frontend/tests/e2e/persistence.spec.ts (test_task_persists_after_refresh)

### US1 Validation

- [ ] T065 [US1] Run all backend tests for US1 (pytest backend/tests/ -v -k "test_create_task or test_get_task")
- [ ] T066 [US1] Run all frontend unit tests for US1 (npm test -- --testPathPattern="TaskForm|TaskList|TaskItem|useTasks|api")
- [ ] T067 [US1] Run all E2E tests for US1 (npx playwright test create-task view-tasks persistence)
- [ ] T068 [US1] Manual end-to-end test following acceptance scenarios (create task, view in list, refresh browser, verify persistence)

---

## Phase 4: User Story 2 (P2) - Update Task Status

**Priority**: P2 (Second Priority)

**Goal**: Users can mark tasks as complete/pending and edit task details (title, description)

**Why After US1**: Builds on task creation and viewing by adding state management and updates

**Independent Test**: Create a task (US1), change its status from pending to completed, verify change persists after page refresh (FR-004, SC-003)

**Duration Estimate**: 4-5 hours

**Dependencies**: Requires US1 complete (task creation and viewing must work)

### Backend API - Update Task (PATCH /tasks/{id})

- [ ] T069 [P] [US2] Write unit test for TaskService.update in backend/tests/unit/test_task_service.py (test_update_task_success, test_update_task_not_found, test_update_task_partial)
- [ ] T070 [US2] Implement TaskService.update in backend/src/services/task.py (async def update, fetch existing task, apply partial updates, save to database)
- [ ] T071 [P] [US2] Write integration test for PATCH /tasks/{id} endpoint in backend/tests/integration/test_task_api.py (test_update_task_200, test_update_task_404, test_update_task_400_invalid_status)
- [ ] T072 [US2] Implement PATCH /tasks/{id} endpoint in backend/src/api/tasks.py (async def update_task, use TaskService, return 200 with updated task)

### Frontend - Update Functionality

- [ ] T073 [P] [US2] Add updateTask function to API client in frontend/src/lib/api.ts (PATCH request with TaskUpdate payload)
- [ ] T074 [P] [US2] Add updateTask mutation to useTasks hook in frontend/src/hooks/useTasks.ts (SWR mutate with optimistic updates)
- [ ] T075 [P] [US2] Add status checkbox to TaskItem component in frontend/src/components/TaskItem.tsx (checkbox for pending/completed toggle, onClick handler)
- [ ] T076 [P] [US2] Add edit mode to TaskForm component in frontend/src/components/TaskForm.tsx (accept existing task prop, populate fields, submit updates instead of creates)
- [ ] T077 [P] [US2] Add edit button to TaskItem component in frontend/src/components/TaskItem.tsx (button to trigger edit mode, pass task to TaskForm)
- [ ] T078 [P] [US2] Add cancel button to TaskForm in edit mode in frontend/src/components/TaskForm.tsx (revert to create mode, clear form)

### Frontend - Optimistic Updates

- [ ] T079 [P] [US2] Implement optimistic status toggle in TaskItem (update local state immediately, revert on error)
- [ ] T080 [US2] Update page.tsx to handle edit mode state in frontend/src/app/page.tsx (state for selected task, pass to TaskForm, handle edit complete)

### Integration Testing (US2)

- [ ] T081 [US2] Write E2E test for toggle task status in frontend/tests/e2e/update-task.spec.ts (test_user_toggles_task_status_to_completed)
- [ ] T082 [US2] Write E2E test for edit task in frontend/tests/e2e/update-task.spec.ts (test_user_edits_task_title_and_description)
- [ ] T083 [US2] Write E2E test for cancel edit in frontend/tests/e2e/update-task.spec.ts (test_user_cancels_edit_and_task_unchanged)

### US2 Validation

- [ ] T084 [US2] Run all tests for US2 (backend: pytest -k "update_task", frontend: npm test + E2E)

---

## Phase 5: User Story 3 (P3) - Delete Tasks

**Priority**: P3 (Third Priority)

**Goal**: Users can delete tasks with confirmation dialog to prevent accidental deletion

**Why After US2**: Task cleanup is important but not critical for initial value delivery

**Independent Test**: Create a task (US1), delete it with confirmation, verify it no longer appears in list or database (FR-005, SC-004)

**Duration Estimate**: 3-4 hours

**Dependencies**: Requires US1 complete (task creation and viewing must work)

### Backend API - Delete Task (DELETE /tasks/{id})

- [ ] T085 [P] [US3] Write unit test for TaskService.delete in backend/tests/unit/test_task_service.py (test_delete_task_success, test_delete_task_not_found)
- [ ] T086 [US3] Implement TaskService.delete in backend/src/services/task.py (async def delete, fetch existing task, delete from database)
- [ ] T087 [P] [US3] Write integration test for DELETE /tasks/{id} endpoint in backend/tests/integration/test_task_api.py (test_delete_task_204, test_delete_task_404)
- [ ] T088 [US3] Implement DELETE /tasks/{id} endpoint in backend/src/api/tasks.py (async def delete_task, use TaskService, return 204 No Content)

### Frontend - Delete Functionality

- [ ] T089 [P] [US3] Add deleteTask function to API client in frontend/src/lib/api.ts (DELETE request to /tasks/{id})
- [ ] T090 [P] [US3] Add deleteTask mutation to useTasks hook in frontend/src/hooks/useTasks.ts (SWR mutate with optimistic delete)
- [ ] T091 [P] [US3] Create DeleteConfirmDialog component in frontend/src/components/DeleteConfirmDialog.tsx (modal with confirm/cancel buttons, task title display)
- [ ] T092 [P] [US3] Write unit tests for DeleteConfirmDialog in frontend/tests/unit/components/DeleteConfirmDialog.test.tsx (test_dialog_renders, test_confirm_button_calls_onConfirm, test_cancel_button_calls_onCancel)
- [ ] T093 [P] [US3] Add delete button to TaskItem component in frontend/src/components/TaskItem.tsx (button to trigger delete confirmation)
- [ ] T094 [US3] Add delete confirmation state to page.tsx in frontend/src/app/page.tsx (state for dialog open/close, selected task for deletion, handle confirm/cancel)

### Integration Testing (US3)

- [ ] T095 [US3] Write E2E test for delete task in frontend/tests/e2e/delete-task.spec.ts (test_user_deletes_task_with_confirmation)
- [ ] T096 [US3] Write E2E test for cancel delete in frontend/tests/e2e/delete-task.spec.ts (test_user_cancels_delete_and_task_remains)

### US3 Validation

- [ ] T097 [US3] Run all tests for US3 (backend: pytest -k "delete_task", frontend: npm test + E2E)

---

## Phase 6: User Story 4 (P4) - Filter and Search Tasks

**Priority**: P4 (Fourth Priority - Enhancement)

**Goal**: Users can filter tasks by status (pending/completed) and search by keywords in title/description

**Why Last**: Findability enhancement that builds on core CRUD operations, useful for power users with many tasks

**Independent Test**: Create multiple tasks with different statuses and titles, use filter/search controls, verify only matching tasks appear (FR-019)

**Duration Estimate**: 3-4 hours

**Dependencies**: Requires US1 complete (task viewing must work to filter/search)

### Backend API - Filter Tasks (GET /tasks?status=)

- [ ] T098 [P] [US4] Update TaskService.get_all to support status filter in backend/src/services/task.py (add status parameter, WHERE clause in query)
- [ ] T099 [P] [US4] Write integration test for GET /tasks?status= in backend/tests/integration/test_task_api.py (test_get_tasks_filter_by_status_pending, test_get_tasks_filter_by_status_completed)
- [ ] T100 [US4] Update GET /tasks endpoint to accept status query param in backend/src/api/tasks.py (add status to query parameters)

### Frontend - Filter UI

- [ ] T101 [P] [US4] Create FilterControls component in frontend/src/components/FilterControls.tsx (radio buttons or dropdown for All/Pending/Completed)
- [ ] T102 [P] [US4] Write unit tests for FilterControls in frontend/tests/unit/components/FilterControls.test.tsx (test_filter_controls_render, test_filter_change_calls_onChange)
- [ ] T103 [US4] Update useTasks hook to accept status filter parameter in frontend/src/hooks/useTasks.ts (pass status to API call)
- [ ] T104 [US4] Add FilterControls to page.tsx and wire to useTasks in frontend/src/app/page.tsx (state for selected filter, pass to useTasks hook)

### Integration Testing (US4)

- [ ] T105 [US4] Write E2E test for filter tasks in frontend/tests/e2e/filter-tasks.spec.ts (test_user_filters_pending_tasks, test_user_filters_completed_tasks, test_user_clears_filter)

### US4 Validation

- [ ] T106 [US4] Run all tests for US4 (backend: pytest -k "filter", frontend: npm test + E2E)

---

## Phase 7: Polish & Deployment

**Goal**: Final polish, error handling improvements, and deployment preparation

**Duration Estimate**: 2-3 hours

### Error Handling & UX Polish

- [ ] T107 [P] Create ErrorBoundary component in frontend/src/components/ErrorBoundary.tsx (catch React errors, display friendly message)
- [ ] T108 [P] Add loading skeletons to TaskList in frontend/src/components/TaskList.tsx (skeleton cards while loading)
- [ ] T109 [P] Add toast notifications for success/error in frontend/src/lib/toast.ts (success: "Task created", error: "Failed to save task")
- [ ] T110 [P] Implement request debouncing for rapid operations in frontend/src/hooks/useTasks.ts (prevent duplicate creates/updates)

### Deployment Preparation

- [ ] T111 [P] Create Dockerfile for backend in backend/Dockerfile (Python 3.11 slim, copy requirements and src, expose 8000, CMD uvicorn)
- [ ] T112 [P] Create Dockerfile for frontend in frontend/Dockerfile (Node 18 alpine, npm ci, npm build, expose 3000, CMD npm start)

---

## Dependency Graph

### User Story Completion Order

```
Setup (Phase 1)
  ↓
Foundational (Phase 2)
  ↓
├─→ US1 (P1) - Create and View Tasks [INDEPENDENT - MVP]
│     ↓
├─→ US2 (P2) - Update Task Status [DEPENDS ON: US1]
│     ↓
├─→ US3 (P3) - Delete Tasks [DEPENDS ON: US1]
│     ↓
└─→ US4 (P4) - Filter and Search [DEPENDS ON: US1]
      ↓
    Polish (Phase 7)
```

**Critical Path**: Setup → Foundational → US1 (43 tasks for MVP)

**Parallel Opportunities**:
- US2, US3, US4 can be implemented in parallel after US1 is complete (they all depend only on US1, not on each other)
- Within each user story, backend and frontend tasks can be developed in parallel once API contract is defined

---

## Parallel Execution Examples

### Phase 1 (Setup)
**Parallel Tracks**:
- Track 1: T001-T006 (Backend setup)
- Track 2: T007-T011 (Frontend setup)
- Track 3: T012-T015 (Database setup)

All tracks can run simultaneously.

### Phase 2 (Foundational)
**Parallel Tracks**:
- Track 1: T016-T019 (Models and schemas with tests)
- Track 2: T023-T027 (Core infrastructure with tests)

After T020-T022 (migrations) complete, Track 1 and Track 2 can run in parallel.

### Phase 3 (US1)
**Parallel Tracks**:
- Track 1: T031-T036 (Backend POST /tasks API)
- Track 2: T037-T041 (Backend GET /tasks API)
- Track 3: T042-T045 (Backend GET /tasks/{id} API)
- Track 4: T046-T050 (Frontend API client and hooks)
- Track 5: T051-T061 (Frontend components and styling)

Tracks 1-3 can run in parallel. Track 4 can start after any backend API is defined. Track 5 can start after Track 4 completes.

### Phase 4 (US2)
**Parallel Tracks**:
- Track 1: T069-T072 (Backend PATCH API)
- Track 2: T073-T080 (Frontend update functionality)

Track 2 can start after backend API contract is defined (T071-T072).

### Phase 5 (US3)
**Parallel Tracks**:
- Track 1: T085-T088 (Backend DELETE API)
- Track 2: T089-T094 (Frontend delete functionality)

Track 2 can start after backend API contract is defined (T087-T088).

### Phase 6 (US4)
**Parallel Tracks**:
- Track 1: T098-T100 (Backend filter API)
- Track 2: T101-T104 (Frontend filter UI)

Track 2 can start after backend API contract is defined (T099-T100).

---

## Testing Strategy

### Unit Tests
- **Backend**: pytest for models, schemas, services
- **Frontend**: Jest + React Testing Library for components, hooks, utilities

### Integration Tests
- **Backend**: pytest + httpx for API endpoints with real database (test database)
- **Frontend**: Jest for API client integration

### E2E Tests
- **Full Stack**: Playwright for end-to-end user flows (create, view, update, delete, filter)

### Test Coverage Targets
- **Backend Services**: 90%+ coverage
- **Backend API Endpoints**: 100% coverage
- **Frontend Components**: 80%+ coverage
- **Frontend Hooks**: 90%+ coverage
- **E2E Critical Paths**: 100% (all user stories tested end-to-end)

---

## Acceptance Criteria Summary

### User Story 1 (P1) - MVP
- ✅ User can create a task with title (description optional)
- ✅ Task appears immediately in the task list
- ✅ Task persists after browser refresh
- ✅ Empty state message shown when no tasks exist
- ✅ Error message shown when backend is unreachable
- ✅ All API endpoints return appropriate HTTP status codes
- ✅ Performance: Task creation in < 1 second (SC-001)
- ✅ Performance: Task list loads in < 2 seconds for 100 tasks (SC-002)

### User Story 2 (P2)
- ✅ User can toggle task status (pending ↔ completed)
- ✅ User can edit task title and description
- ✅ User can cancel edit and task reverts to original state
- ✅ Changes persist after browser refresh
- ✅ Error message shown when update fails
- ✅ Performance: Task update in < 1 second (SC-003)

### User Story 3 (P3)
- ✅ User can delete a task
- ✅ Confirmation dialog shown before deletion
- ✅ User can cancel deletion and task remains
- ✅ Task removed from UI and database
- ✅ Error message shown when delete fails
- ✅ Performance: Task deletion in < 1 second (SC-004)

### User Story 4 (P4)
- ✅ User can filter tasks by status (All, Pending, Completed)
- ✅ Filtered results show only matching tasks
- ✅ User can clear filter to show all tasks

---

## Bonus Tasks (Optional Enhancements)

These tasks are NOT required for MVP but can enhance the application for future iterations:

### Subagent Implementation Opportunities
- **Backend Subagent**: Automate implementation of backend/src/services/, backend/src/api/, backend/tests/ using plan.md and contracts/
- **Frontend Subagent**: Automate implementation of frontend/src/components/, frontend/src/hooks/ using plan.md and contracts/
- **Database Subagent**: Automate creation of Alembic migrations from data-model.md
- **Testing Subagent**: Automate generation of unit/integration tests from acceptance criteria in spec.md

### Cloud-Native Deployment
- **Task D01**: Set up GitHub Actions CI/CD pipeline (.github/workflows/backend.yml, .github/workflows/frontend.yml)
- **Task D02**: Deploy backend to Google Cloud Run or AWS Lambda
- **Task D03**: Deploy frontend to Vercel
- **Task D04**: Set up Neon database branching for dev/staging/prod environments
- **Task D05**: Configure environment variables in cloud provider (Vercel env vars, Cloud Run secrets)
- **Task D06**: Set up monitoring with Sentry for error tracking
- **Task D07**: Implement structured logging with log aggregation (CloudWatch, Stackdriver)

### Internationalization (i18n)
- **Task I01**: Add i18n support for Urdu language in frontend (next-i18next or next-intl)
- **Task I02**: Create translation files (en.json, ur.json) for UI text
- **Task I03**: Add language switcher component in frontend/src/components/LanguageSwitcher.tsx
- **Task I04**: Update all components to use translated strings
- **Task I05**: Test RTL (right-to-left) layout for Urdu language

### Voice Commands
- **Task V01**: Add Web Speech API integration in frontend/src/lib/speech.ts (SpeechRecognition API)
- **Task V02**: Create VoiceInput component in frontend/src/components/VoiceInput.tsx (microphone button, recording state, transcription display)
- **Task V03**: Add voice command parsing (e.g., "Create task buy groceries", "Complete task one", "Delete task two")
- **Task V04**: Integrate VoiceInput with TaskForm for hands-free task creation
- **Task V05**: Add voice feedback using Speech Synthesis API (read task list, confirm actions)

---

## Notes

### Task ID Format
- **T001-T015**: Setup & Initialization
- **T016-T030**: Foundational Layer (Database & Core Backend)
- **T031-T068**: User Story 1 (P1 - Create and View Tasks)
- **T069-T084**: User Story 2 (P2 - Update Task Status)
- **T085-T097**: User Story 3 (P3 - Delete Tasks)
- **T098-T106**: User Story 4 (P4 - Filter and Search)
- **T107-T112**: Polish & Deployment

### Parallelization Markers
- **[P]**: Task can be executed in parallel with other [P] tasks in the same phase (different files, no dependencies)
- **No [P]**: Task must be executed sequentially or has dependencies on previous tasks

### User Story Markers
- **[US1]**: Task belongs to User Story 1 (Create and View Tasks)
- **[US2]**: Task belongs to User Story 2 (Update Task Status)
- **[US3]**: Task belongs to User Story 3 (Delete Tasks)
- **[US4]**: Task belongs to User Story 4 (Filter and Search)

### TDD Workflow Reminder
For every implementation task:
1. **RED**: Write the test first (it will fail because code doesn't exist yet)
2. **GREEN**: Write minimal code to make the test pass
3. **REFACTOR**: Clean up the code while keeping tests green

Example for T031:
- RED: Write `test_create_task_success` that calls `TaskService.create()` - it fails because `create()` doesn't exist
- GREEN: Implement `TaskService.create()` with minimal logic to make test pass
- REFACTOR: Extract common patterns, improve naming, add error handling

---

**Document Status**: Ready for Implementation
**Next Step**: Start with Phase 1 (Setup) tasks T001-T015, then proceed to Phase 2 (Foundational), then Phase 3 (US1) for MVP delivery
