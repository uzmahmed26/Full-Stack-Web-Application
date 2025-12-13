# API Contracts: Todo Application

**Feature**: 001-todo-app-spec
**Date**: 2025-12-13
**API Version**: 1.0.0
**Protocol**: REST + JSON

## Overview

This directory contains the API contract specifications for the Todo Application. The API follows RESTful principles and uses JSON for request/response payloads.

**Contract Files**:
- `openapi.yaml`: OpenAPI 3.1 specification (source of truth for API contract)

## API Design Principles

### 1. RESTful Architecture
- Resource-based URLs (`/tasks`, `/tasks/{id}`)
- Standard HTTP methods (GET, POST, PATCH, DELETE)
- Stateless requests (no server-side session storage)
- Proper HTTP status codes (2xx success, 4xx client errors, 5xx server errors)

### 2. JSON Data Format
- Request bodies: JSON (Content-Type: application/json)
- Response bodies: JSON (Content-Type: application/json)
- camelCase for field names (JavaScript/TypeScript convention)
- ISO 8601 timestamps in UTC (e.g., "2025-12-13T10:30:00Z")

### 3. HTTP Methods

| Method | Purpose | Idempotent | Safe |
|--------|---------|------------|------|
| GET | Retrieve resource(s) | Yes | Yes |
| POST | Create new resource | No | No |
| PATCH | Partial update | No | No |
| DELETE | Remove resource | Yes | No |

**Why PATCH instead of PUT?**
- PATCH allows partial updates (update only changed fields)
- PUT requires sending entire resource representation
- PATCH better matches user intent ("change status" not "replace entire task")

### 4. Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 OK | Success | GET, PATCH successful |
| 201 Created | Resource created | POST successful |
| 204 No Content | Success, no body | DELETE successful |
| 400 Bad Request | Invalid input | Validation failed |
| 404 Not Found | Resource doesn't exist | Task ID not found |
| 500 Internal Server Error | Server error | Unexpected errors |
| 503 Service Unavailable | Service down | Database unavailable |

### 5. Error Response Format

All error responses follow a consistent structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "optional field-specific info"
    }
  }
}
```

**Error Codes**:
- `VALIDATION_ERROR`: Input validation failed
- `NOT_FOUND`: Resource not found
- `INTERNAL_ERROR`: Unexpected server error

**Example Error Responses**:

```json
// Missing required field
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

// Task not found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Task with ID 550e8400-e29b-41d4-a716-446655440000 not found"
  }
}

// Database connection failed
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred. Please try again later."
  }
}
```

## API Endpoints

### Base URL
- Development: `http://localhost:8000`
- Production: `https://api.yourdomain.com`

### Endpoints Summary

| Method | Path | Purpose | Success Code |
|--------|------|---------|--------------|
| GET | `/tasks` | List all tasks (with filtering & pagination) | 200 |
| POST | `/tasks` | Create a new task | 201 |
| GET | `/tasks/{taskId}` | Get a single task | 200 |
| PATCH | `/tasks/{taskId}` | Update a task (partial) | 200 |
| DELETE | `/tasks/{taskId}` | Delete a task | 204 |
| GET | `/health` | Health check | 200 |

### 1. List Tasks

**Endpoint**: `GET /tasks`

**Query Parameters**:
- `status` (optional): Filter by task status (`pending` or `completed`)
- `limit` (optional): Number of tasks per page (default: 50, max: 100)
- `offset` (optional): Number of tasks to skip (default: 0)

**Example Requests**:
```bash
# Get all tasks
GET /tasks

# Get only pending tasks
GET /tasks?status=pending

# Get completed tasks with pagination
GET /tasks?status=completed&limit=20&offset=0
```

**Success Response (200 OK)**:
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread, coffee",
      "status": "pending",
      "createdAt": "2025-12-13T10:30:00Z",
      "updatedAt": "2025-12-13T10:30:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

**Meets Requirements**:
- FR-001: Display all tasks in list format
- FR-003: View all task details
- SC-002: Load task list in under 2 seconds

### 2. Create Task

**Endpoint**: `POST /tasks`

**Request Body**:
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, coffee",
  "status": "pending"
}
```

**Minimal Request** (only title required):
```json
{
  "title": "Buy groceries"
}
```

**Success Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, coffee",
  "status": "pending",
  "createdAt": "2025-12-13T10:30:00Z",
  "updatedAt": "2025-12-13T10:30:00Z"
}
```

**Headers**:
```
Location: /tasks/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json
```

**Validation Rules**:
- `title`: Required, 1-200 characters
- `description`: Optional, max 2000 characters
- `status`: Optional, defaults to `pending`, must be `pending` or `completed`

**Error Response (400 Bad Request)**:
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

**Meets Requirements**:
- FR-002: Create new tasks with title (description optional)
- FR-010: Validate all incoming requests
- SC-001: Task appears in under 1 second

### 3. Get Single Task

**Endpoint**: `GET /tasks/{taskId}`

**Path Parameters**:
- `taskId`: UUID of the task

**Example Request**:
```bash
GET /tasks/550e8400-e29b-41d4-a716-446655440000
```

**Success Response (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, coffee",
  "status": "pending",
  "createdAt": "2025-12-13T10:30:00Z",
  "updatedAt": "2025-12-13T10:30:00Z"
}
```

**Error Response (404 Not Found)**:
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Task with ID 550e8400-e29b-41d4-a716-446655440000 not found"
  }
}
```

**Meets Requirements**:
- FR-003: View all task details
- FR-011: Return appropriate HTTP status codes

### 4. Update Task

**Endpoint**: `PATCH /tasks/{taskId}`

**Path Parameters**:
- `taskId`: UUID of the task

**Request Body** (all fields optional, send only fields to update):
```json
{
  "title": "Buy groceries and cook dinner",
  "description": "Milk, eggs, bread, coffee, chicken",
  "status": "completed"
}
```

**Example Requests**:

```bash
# Mark task as completed
PATCH /tasks/550e8400-e29b-41d4-a716-446655440000
{
  "status": "completed"
}

# Update title only
PATCH /tasks/550e8400-e29b-41d4-a716-446655440000
{
  "title": "Buy groceries and cook dinner"
}

# Update multiple fields
PATCH /tasks/550e8400-e29b-41d4-a716-446655440000
{
  "title": "Buy groceries and cook dinner",
  "description": "Updated description",
  "status": "completed"
}
```

**Success Response (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries and cook dinner",
  "description": "Milk, eggs, bread, coffee, chicken",
  "status": "completed",
  "createdAt": "2025-12-13T10:30:00Z",
  "updatedAt": "2025-12-13T15:45:00Z"
}
```

**Note**: `updatedAt` is automatically updated by the database trigger.

**Validation Rules**:
- `title`: If provided, 1-200 characters
- `description`: If provided, max 2000 characters
- `status`: If provided, must be `pending` or `completed`

**Meets Requirements**:
- FR-004: Update task title, description, and status
- FR-010: Validate all incoming requests
- SC-003: Status change reflected in under 1 second

### 5. Delete Task

**Endpoint**: `DELETE /tasks/{taskId}`

**Path Parameters**:
- `taskId`: UUID of the task

**Example Request**:
```bash
DELETE /tasks/550e8400-e29b-41d4-a716-446655440000
```

**Success Response (204 No Content)**:
- No response body
- HTTP status code 204 indicates success

**Error Response (404 Not Found)**:
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Task with ID 550e8400-e29b-41d4-a716-446655440000 not found"
  }
}
```

**Meets Requirements**:
- FR-005: Delete tasks
- FR-011: Return appropriate HTTP status codes
- SC-004: Deletion completes in under 1 second

**Note**: Frontend should show confirmation dialog before calling DELETE (FR-005: "with confirmation step").

### 6. Health Check

**Endpoint**: `GET /health`

**Example Request**:
```bash
GET /health
```

**Success Response (200 OK)**:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-13T10:30:00Z"
}
```

**Unhealthy Response (503 Service Unavailable)**:
```json
{
  "status": "unhealthy",
  "error": "Database connection failed"
}
```

**Purpose**:
- Load balancer health checks
- Monitoring system probes
- Deployment readiness checks

**Meets Requirements**:
- Cloud Readiness: Health check endpoints for load balancers (Monitoring & Observability section)

## Data Models

### Task

**Schema**:
```typescript
interface Task {
  id: string;              // UUID v4
  title: string;           // 1-200 characters
  description: string | null;  // Optional, max 2000 characters
  status: "pending" | "completed";
  createdAt: string;       // ISO 8601 timestamp (UTC)
  updatedAt: string;       // ISO 8601 timestamp (UTC)
}
```

### TaskCreate

**Schema**:
```typescript
interface TaskCreate {
  title: string;           // Required, 1-200 characters
  description?: string | null;  // Optional, max 2000 characters
  status?: "pending" | "completed";  // Optional, defaults to "pending"
}
```

### TaskUpdate

**Schema**:
```typescript
interface TaskUpdate {
  title?: string;          // Optional, 1-200 characters if provided
  description?: string | null;  // Optional, max 2000 characters if provided
  status?: "pending" | "completed";  // Optional
}
```

### Error

**Schema**:
```typescript
interface Error {
  error: {
    code: "VALIDATION_ERROR" | "NOT_FOUND" | "INTERNAL_ERROR";
    message: string;
    details?: {
      [key: string]: any;
    };
  };
}
```

## Request/Response Examples

### Example 1: Creating a Task

**Request**:
```http
POST /tasks HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, coffee"
}
```

**Response**:
```http
HTTP/1.1 201 Created
Location: /tasks/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, coffee",
  "status": "pending",
  "createdAt": "2025-12-13T10:30:00Z",
  "updatedAt": "2025-12-13T10:30:00Z"
}
```

### Example 2: Listing Pending Tasks

**Request**:
```http
GET /tasks?status=pending&limit=20 HTTP/1.1
Host: localhost:8000
```

**Response**:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread, coffee",
      "status": "pending",
      "createdAt": "2025-12-13T10:30:00Z",
      "updatedAt": "2025-12-13T10:30:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

### Example 3: Marking Task as Completed

**Request**:
```http
PATCH /tasks/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "status": "completed"
}
```

**Response**:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, coffee",
  "status": "completed",
  "createdAt": "2025-12-13T10:30:00Z",
  "updatedAt": "2025-12-13T15:45:00Z"
}
```

### Example 4: Deleting a Task

**Request**:
```http
DELETE /tasks/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Host: localhost:8000
```

**Response**:
```http
HTTP/1.1 204 No Content
```

### Example 5: Validation Error

**Request**:
```http
POST /tasks HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "description": "Missing title"
}
```

**Response**:
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

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

## CORS Configuration

**Development**:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 3600
```

**Production**:
```
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 3600
```

**Security Note**: Restrict CORS to specific frontend origin (not wildcard `*`).

## API Versioning Strategy

**Current Approach**: Version in URL path (future consideration)
- Example: `/v1/tasks`, `/v2/tasks`
- For MVP, version is implicit (1.0.0) and not in URL

**Breaking Changes**: When breaking changes are needed:
1. Increment major version (v1 → v2)
2. Maintain v1 for backward compatibility (6-12 months)
3. Deprecation notice in v1 responses (header: `X-API-Deprecation: v1 will be sunset on 2026-06-01`)

## TypeScript Type Generation

Generate TypeScript types from OpenAPI schema for frontend type safety:

```bash
# Using openapi-typescript
npx openapi-typescript contracts/openapi.yaml -o src/types/api.ts
```

**Benefits**:
- Type safety across frontend and backend
- Auto-completion in IDE
- Compile-time validation of API calls
- Single source of truth (OpenAPI spec)

## Contract Testing

### Backend Contract Tests (pytest)
Validate that FastAPI implementation matches OpenAPI spec:

```python
def test_create_task_returns_201():
    response = client.post("/tasks", json={"title": "Test task"})
    assert response.status_code == 201
    assert "id" in response.json()
    assert response.json()["title"] == "Test task"
```

### Frontend Contract Tests (Jest)
Validate that frontend calls match expected API contract:

```typescript
test("createTask sends correct request format", () => {
  const taskData = { title: "Test task" };
  // Mock API call and validate request structure
  expect(mockRequest).toHaveBeenCalledWith("/tasks", {
    method: "POST",
    body: JSON.stringify(taskData)
  });
});
```

## Performance Targets

From specification success criteria:

| Operation | Target (p95) | Requirement |
|-----------|--------------|-------------|
| Create task | < 1 second | SC-001 |
| Load task list (100 tasks) | < 2 seconds | SC-002 |
| Update task status | < 1 second | SC-003 |
| Delete task | < 1 second | SC-004 |
| API endpoint response | < 200ms | Performance section |

**Monitoring**: Track these metrics in production with monitoring tools (e.g., Sentry, New Relic, CloudWatch).

## Security Considerations

1. **Input Validation**: All requests validated via Pydantic models (SC-016: 100% validation)
2. **SQL Injection Prevention**: SQLModel uses parameterized queries (SC-014)
3. **HTTPS**: Use HTTPS in production (SC-015)
4. **Error Message Sanitization**: Don't expose technical details to clients (FR-014)
5. **CORS**: Restrict to allowed origins only
6. **Rate Limiting**: Add in production (via API Gateway or middleware)

## Future Enhancements (Out of Scope for MVP)

1. **Authentication**: Add Bearer token or OAuth2 (securitySchemes in OpenAPI)
2. **Pagination**: Cursor-based pagination for better performance with large datasets
3. **Filtering**: Advanced filters (e.g., search by title, filter by date range)
4. **Sorting**: Configurable sort order (by title, date, status)
5. **Batch Operations**: Bulk create, update, delete
6. **Field Selection**: Sparse fieldsets (e.g., `?fields=id,title`)
7. **WebSockets**: Real-time updates for collaborative features
8. **GraphQL**: Alternative API pattern for flexible data fetching

---

**Contract Status**: COMPLETE
**Validated Against**: FR-009 to FR-015, FR-021, FR-023, all Success Criteria
**Ready for Implementation**: YES
