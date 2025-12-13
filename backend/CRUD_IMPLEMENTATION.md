# CRUD API Implementation - Smart Todo App

Complete implementation of CRUD operations following clean architecture principles.

## Architecture Overview

The implementation follows a **3-layer architecture**:

```
┌─────────────────────────────────────────────────────────┐
│                     API Layer (Routes)                   │
│  - FastAPI endpoints                                     │
│  - Request/response handling                             │
│  - HTTP status codes                                     │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────┐
│                  Service Layer (Business Logic)          │
│  - CRUD operations                                       │
│  - Validation                                            │
│  - Error handling                                        │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────┐
│                   Data Layer (Database)                  │
│  - SQLModel ORM                                          │
│  - PostgreSQL database                                   │
│  - Async sessions                                        │
└─────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
backend/src/
├── api/
│   ├── __init__.py
│   └── tasks.py              # API endpoints (routes)
├── schemas/
│   ├── __init__.py
│   └── task.py               # Pydantic request/response models
├── services/
│   ├── __init__.py
│   └── task.py               # Business logic
├── models/
│   ├── __init__.py
│   └── task.py               # SQLModel database models
├── db/
│   ├── __init__.py
│   └── session.py            # Database session management
├── core/
│   ├── __init__.py
│   └── config.py             # Configuration & settings
└── main.py                   # FastAPI app initialization
```

---

## Layer Explanations

### 1. Schemas Layer (`src/schemas/task.py`)

**Purpose:** Define request and response data structures using Pydantic.

**Files:** `TaskCreate`, `TaskUpdate`, `TaskRead`, `TaskListResponse`

**Example:**
```python
class TaskCreate(BaseModel):
    """Schema for creating a task"""
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(max_length=2000)
    status: Optional[TaskStatus] = Field(default=TaskStatus.PENDING)
```

**Why this layer?**
- ✅ Validates incoming requests
- ✅ Defines response structure
- ✅ Separate from database models (can differ)
- ✅ Auto-generates OpenAPI documentation

---

### 2. Service Layer (`src/services/task.py`)

**Purpose:** Contains business logic for CRUD operations.

**Class:** `TaskService`

**Methods:**
- `create(task_data)` - Create new task
- `get(task_id)` - Get single task
- `list(limit, offset, status)` - List tasks with pagination
- `update(task_id, task_data)` - Update task (partial)
- `delete(task_id)` - Delete task

**Example:**
```python
class TaskService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, task_data: TaskCreate) -> Task:
        task = Task(**task_data.model_dump())
        self.session.add(task)
        await self.session.commit()
        await self.session.refresh(task)
        return task
```

**Why this layer?**
- ✅ Keeps routes thin (single responsibility)
- ✅ Reusable business logic
- ✅ Easy to test in isolation
- ✅ Hides database implementation details

---

### 3. API Layer (`src/api/tasks.py`)

**Purpose:** Define HTTP endpoints and handle requests/responses.

**Router:** `/tasks` prefix

**Endpoints:**
- `POST /tasks/` - Create task
- `GET /tasks/` - List tasks
- `GET /tasks/{id}` - Get task
- `PATCH /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

**Example:**
```python
@router.post("/", response_model=TaskRead, status_code=201)
async def create_task(
    task_data: TaskCreate,
    session: AsyncSession = Depends(get_session)
) -> TaskRead:
    service = TaskService(session)
    task = await service.create(task_data)
    return TaskRead.model_validate(task)
```

**Why this layer?**
- ✅ Handles HTTP concerns (status codes, headers)
- ✅ Injects dependencies (database session)
- ✅ Converts between schemas and models
- ✅ Returns proper error responses

---

## Data Flow Example

### Creating a Task (POST /tasks/)

```
1. Client Request:
   POST /tasks/
   {"title": "Buy milk", "description": "From store"}

2. API Layer (tasks.py):
   - Validates request with TaskCreate schema
   - Creates TaskService instance
   - Calls service.create()

3. Service Layer (task.py):
   - Creates Task model instance
   - Adds to database session
   - Commits transaction
   - Returns created task

4. API Layer:
   - Converts Task to TaskRead schema
   - Returns JSON response with 201 status

5. Client Response:
   {
     "id": "123e4567-...",
     "title": "Buy milk",
     "description": "From store",
     "status": "pending",
     "created_at": "2025-12-13T10:00:00Z",
     "updated_at": "2025-12-13T10:00:00Z"
   }
```

---

## Testing Strategy

### Unit Tests (`tests/unit/test_task_service.py`)

**What:** Test service layer in isolation

**Scope:** TaskService methods

**Database:** In-memory SQLite

**Example:**
```python
async def test_create_task(test_session):
    service = TaskService(test_session)
    task_data = TaskCreate(title="Test")
    task = await service.create(task_data)
    assert task.title == "Test"
```

**Coverage:**
- ✅ Create task with valid data
- ✅ Create task with minimal data
- ✅ Get existing task
- ✅ Get non-existent task
- ✅ List tasks with pagination
- ✅ List tasks with status filter
- ✅ Update task (full and partial)
- ✅ Delete task

---

### Integration Tests (`tests/integration/test_task_api.py`)

**What:** Test complete API endpoints

**Scope:** Full request/response cycle

**Database:** In-memory SQLite

**Example:**
```python
async def test_create_task(client):
    response = await client.post(
        "/tasks/",
        json={"title": "Test"}
    )
    assert response.status_code == 201
    assert response.json()["title"] == "Test"
```

**Coverage:**
- ✅ All CRUD endpoints (POST, GET, PATCH, DELETE)
- ✅ Pagination and filtering
- ✅ Validation errors (422)
- ✅ Not found errors (404)
- ✅ Complete workflow (create → read → update → delete)

---

## Running Tests

### Install Test Dependencies

Dependencies already in `requirements.txt`:
- pytest
- pytest-asyncio
- httpx (for async HTTP testing)

### Run All Tests

```cmd
cd backend
venv\Scripts\activate
pytest
```

### Run Specific Test Files

```cmd
# Unit tests only
pytest tests/unit/

# Integration tests only
pytest tests/integration/

# Specific file
pytest tests/unit/test_task_service.py

# Specific test
pytest tests/unit/test_task_service.py::test_create_task
```

### Run with Verbose Output

```cmd
pytest -v
```

### Run with Coverage

```cmd
pytest --cov=src --cov-report=html
```

Then open `htmlcov/index.html` in browser.

---

## API Usage Examples

### 1. Start the Server

```cmd
cd backend
venv\Scripts\activate
uvicorn src.main:app --reload
```

Server runs at: `http://localhost:8000`

### 2. Access API Documentation

**Swagger UI:** `http://localhost:8000/docs`
- Interactive API testing
- Try endpoints directly in browser

**ReDoc:** `http://localhost:8000/redoc`
- Clean API reference documentation

### 3. Test with curl

```bash
# Create task
curl -X POST http://localhost:8000/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Get milk and eggs"}'

# List all tasks
curl http://localhost:8000/tasks/

# Get specific task (replace ID)
curl http://localhost:8000/tasks/YOUR-TASK-ID

# Update task status
curl -X PATCH http://localhost:8000/tasks/YOUR-TASK-ID \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Delete task
curl -X DELETE http://localhost:8000/tasks/YOUR-TASK-ID
```

### 4. Test with Python

```python
import requests

BASE_URL = "http://localhost:8000"

# Create task
response = requests.post(
    f"{BASE_URL}/tasks/",
    json={
        "title": "Buy groceries",
        "description": "Get milk and eggs"
    }
)
task = response.json()
print(f"Created: {task['id']}")

# List tasks
response = requests.get(f"{BASE_URL}/tasks/")
tasks = response.json()
print(f"Total tasks: {tasks['total']}")

# Update task
task_id = task['id']
response = requests.patch(
    f"{BASE_URL}/tasks/{task_id}",
    json={"status": "completed"}
)
print(f"Updated: {response.json()['status']}")

# Delete task
response = requests.delete(f"{BASE_URL}/tasks/{task_id}")
print(f"Deleted: {response.status_code == 204}")
```

---

## Validation Examples

### Valid Requests

```json
// Minimal (title only)
{"title": "Task"}

// Full
{
  "title": "Buy groceries",
  "description": "Get milk, eggs, bread",
  "status": "pending"
}

// Partial update
{"status": "completed"}
```

### Invalid Requests (422 Error)

```json
// Empty title
{"title": ""}

// Title too long (> 200 chars)
{"title": "x" * 201}

// Description too long (> 2000 chars)
{"description": "x" * 2001}

// Invalid status
{"status": "invalid_status"}
```

---

## Clean Architecture Benefits

### ✅ Separation of Concerns
- Routes handle HTTP
- Services handle business logic
- Models handle data persistence

### ✅ Testability
- Unit tests: Test services in isolation
- Integration tests: Test full API flow
- Mock dependencies easily

### ✅ Maintainability
- Each layer has single responsibility
- Changes in one layer don't affect others
- Easy to locate and fix bugs

### ✅ Reusability
- Service methods can be called from multiple routes
- Schemas can be shared across endpoints
- Models are database-agnostic

### ✅ Scalability
- Add new endpoints without touching services
- Add new business logic without touching routes
- Swap database without changing API

---

## Next Steps

### For Development
1. ✅ CRUD API implemented
2. ✅ Tests passing
3. **Next:** Connect frontend to API

### For Production
1. Add authentication/authorization
2. Set up Alembic migrations
3. Add request rate limiting
4. Add logging and monitoring
5. Deploy to cloud (Vercel + Cloud Run)

---

## Reference

- **Schemas:** `src/schemas/task.py`
- **Services:** `src/services/task.py`
- **Routes:** `src/api/tasks.py`
- **Models:** `src/models/task.py`
- **Tests (Unit):** `tests/unit/test_task_service.py`
- **Tests (Integration):** `tests/integration/test_task_api.py`
- **API Docs:** `API_DOCUMENTATION.md`
- **Backend Guide:** `/agents/backend_subagent/README.md`
- **CRUD Patterns:** `/skills/crud_api_skill/README.md`
