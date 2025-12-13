# API Documentation - Smart Todo App

Complete reference for all CRUD API endpoints.

## Base URL

**Development:** `http://localhost:8000`

**API Documentation:**
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tasks/` | Create a new task |
| GET | `/tasks/` | List all tasks (with pagination) |
| GET | `/tasks/{id}` | Get a single task |
| PATCH | `/tasks/{id}` | Update a task (partial) |
| DELETE | `/tasks/{id}` | Delete a task |

---

## 1. Create Task

**Endpoint:** `POST /tasks/`

**Description:** Creates a new task with the provided data.

**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Get milk, eggs, and bread",
  "status": "pending"
}
```

**Fields:**
- `title` (required): Task title (1-200 characters)
- `description` (optional): Task description (max 2000 characters)
- `status` (optional): Task status - `"pending"` or `"completed"` (defaults to `"pending"`)

**Response:** `201 Created`
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Buy groceries",
  "description": "Get milk, eggs, and bread",
  "status": "pending",
  "created_at": "2025-12-13T10:00:00Z",
  "updated_at": "2025-12-13T10:00:00Z"
}
```

**Example (curl):**
```bash
curl -X POST http://localhost:8000/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Get milk, eggs, and bread"}'
```

**Example (Python):**
```python
import requests

response = requests.post(
    "http://localhost:8000/tasks/",
    json={"title": "Buy groceries", "description": "Get milk, eggs, and bread"}
)
task = response.json()
print(f"Created task: {task['id']}")
```

---

## 2. List Tasks

**Endpoint:** `GET /tasks/`

**Description:** Retrieves a paginated list of tasks with optional filtering.

**Query Parameters:**
- `limit` (optional): Number of tasks per page (1-100, default: 10)
- `offset` (optional): Number of tasks to skip (default: 0)
- `status` (optional): Filter by status - `"pending"` or `"completed"`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Buy groceries",
      "description": "Get milk, eggs, and bread",
      "status": "pending",
      "created_at": "2025-12-13T10:00:00Z",
      "updated_at": "2025-12-13T10:00:00Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0,
  "has_more": false
}
```

**Example (curl):**
```bash
# Get all tasks
curl http://localhost:8000/tasks/

# Get pending tasks only
curl "http://localhost:8000/tasks/?status=pending"

# Get page 2 (10 tasks per page)
curl "http://localhost:8000/tasks/?limit=10&offset=10"
```

**Example (Python):**
```python
import requests

# Get pending tasks
response = requests.get(
    "http://localhost:8000/tasks/",
    params={"status": "pending", "limit": 20}
)
data = response.json()
print(f"Total pending tasks: {data['total']}")
for task in data['data']:
    print(f"- {task['title']}")
```

---

## 3. Get Single Task

**Endpoint:** `GET /tasks/{id}`

**Description:** Retrieves a specific task by its ID.

**Path Parameters:**
- `id`: UUID of the task

**Response:** `200 OK`
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Buy groceries",
  "description": "Get milk, eggs, and bread",
  "status": "pending",
  "created_at": "2025-12-13T10:00:00Z",
  "updated_at": "2025-12-13T10:00:00Z"
}
```

**Error Response:** `404 Not Found`
```json
{
  "detail": "Task with id 123e4567-e89b-12d3-a456-426614174000 not found"
}
```

**Example (curl):**
```bash
curl http://localhost:8000/tasks/123e4567-e89b-12d3-a456-426614174000
```

---

## 4. Update Task

**Endpoint:** `PATCH /tasks/{id}`

**Description:** Updates an existing task. All fields are optional (partial update).

**Path Parameters:**
- `id`: UUID of the task to update

**Request Body (all fields optional):**
```json
{
  "title": "Buy groceries and cook dinner",
  "description": "Updated description",
  "status": "completed"
}
```

**Response:** `200 OK`
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Buy groceries and cook dinner",
  "description": "Updated description",
  "status": "completed",
  "created_at": "2025-12-13T10:00:00Z",
  "updated_at": "2025-12-13T10:30:00Z"
}
```

**Error Response:** `404 Not Found` (if task doesn't exist)

**Example (curl) - Mark task as completed:**
```bash
curl -X PATCH http://localhost:8000/tasks/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

**Example (Python):**
```python
import requests

task_id = "123e4567-e89b-12d3-a456-426614174000"
response = requests.patch(
    f"http://localhost:8000/tasks/{task_id}",
    json={"status": "completed"}
)
updated_task = response.json()
print(f"Task status: {updated_task['status']}")
```

---

## 5. Delete Task

**Endpoint:** `DELETE /tasks/{id}`

**Description:** Deletes a task by its ID.

**Path Parameters:**
- `id`: UUID of the task to delete

**Response:** `204 No Content` (empty body)

**Error Response:** `404 Not Found` (if task doesn't exist)

**Example (curl):**
```bash
curl -X DELETE http://localhost:8000/tasks/123e4567-e89b-12d3-a456-426614174000
```

**Example (Python):**
```python
import requests

task_id = "123e4567-e89b-12d3-a456-426614174000"
response = requests.delete(f"http://localhost:8000/tasks/{task_id}")

if response.status_code == 204:
    print("Task deleted successfully")
```

---

## Error Responses

### Validation Error (422)

Returned when request data is invalid.

```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "String should have at least 1 characters",
      "type": "string_too_short"
    }
  ]
}
```

### Not Found (404)

Returned when a task with the given ID doesn't exist.

```json
{
  "detail": "Task with id 123e4567-e89b-12d3-a456-426614174000 not found"
}
```

---

## Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET or PATCH request |
| 201 | Created | Successful POST request |
| 204 | No Content | Successful DELETE request |
| 404 | Not Found | Task with given ID not found |
| 422 | Validation Error | Invalid request data |
| 500 | Server Error | Internal server error |

---

## Data Types

### Task Status Enum

Valid values:
- `"pending"` - Task not yet completed (default)
- `"completed"` - Task marked as done

### UUID

All task IDs are UUIDs in string format:
```
123e4567-e89b-12d3-a456-426614174000
```

### DateTime

All timestamps are in ISO 8601 format (UTC):
```
2025-12-13T10:00:00Z
```

---

## Testing Endpoints

### Using Swagger UI

1. Start the server: `uvicorn src.main:app --reload`
2. Open browser: `http://localhost:8000/docs`
3. Click "Try it out" on any endpoint
4. Fill in parameters and click "Execute"

### Using curl

```bash
# Create task
curl -X POST http://localhost:8000/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Task"}'

# List tasks
curl http://localhost:8000/tasks/

# Get task (replace with actual ID from create response)
curl http://localhost:8000/tasks/YOUR-TASK-ID

# Update task
curl -X PATCH http://localhost:8000/tasks/YOUR-TASK-ID \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Delete task
curl -X DELETE http://localhost:8000/tasks/YOUR-TASK-ID
```

### Using Python requests

```python
import requests

BASE_URL = "http://localhost:8000"

# Create
task = requests.post(f"{BASE_URL}/tasks/", json={"title": "Test"}).json()
task_id = task["id"]

# Read
task = requests.get(f"{BASE_URL}/tasks/{task_id}").json()

# Update
task = requests.patch(f"{BASE_URL}/tasks/{task_id}", json={"status": "completed"}).json()

# Delete
requests.delete(f"{BASE_URL}/tasks/{task_id}")
```

---

## Reference

- **Data Model:** `/specs/001-todo-app-spec/data-model.md`
- **API Contract:** `/specs/001-todo-app-spec/contracts/openapi.yaml`
- **Backend Guide:** `/agents/backend_subagent/README.md`
- **CRUD Patterns:** `/skills/crud_api_skill/README.md`
