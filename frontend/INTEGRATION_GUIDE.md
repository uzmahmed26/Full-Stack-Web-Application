# Frontend-Backend Integration Guide

Complete guide for running and testing the integrated Todo application.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                 Next.js Frontend (Port 3000)             │
│  - React Components (TaskForm, TaskList, TaskItem)      │
│  - Custom Hooks (useTasks)                              │
│  - API Client (lib/api.ts)                              │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ HTTP Requests (REST API)
                        │
                        ↓
┌─────────────────────────────────────────────────────────┐
│              FastAPI Backend (Port 8000)                 │
│  - CRUD API Endpoints (/tasks)                          │
│  - Service Layer (TaskService)                          │
│  - SQLModel ORM                                          │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────┐
│                Neon PostgreSQL Database                  │
│  - tasks table                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Folder Structure

### Frontend (`frontend/`)

```
frontend/
├── app/
│   ├── page.tsx                  # ✅ Main page (updated)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── TaskForm.tsx              # ✅ NEW - Create task form
│   ├── TaskList.tsx              # ✅ NEW - Display tasks
│   └── TaskItem.tsx              # ✅ NEW - Individual task card
├── hooks/
│   └── useTasks.ts               # ✅ NEW - Custom hooks for task management
├── lib/
│   └── api.ts                    # ✅ NEW - API client
├── .env.local                    # ✅ NEW - Environment variables
├── tailwind.config.js
├── package.json
└── tsconfig.json
```

### Backend (`backend/`)

```
backend/
├── src/
│   ├── api/tasks.py              # API endpoints
│   ├── services/task.py          # Business logic
│   ├── models/task.py            # Database models
│   ├── schemas/task.py           # Request/response schemas
│   └── main.py                   # FastAPI app
└── ...
```

---

## Setup Instructions

### 1. Start Backend Server

**Terminal 1:**
```cmd
cd backend
venv\Scripts\activate
uvicorn src.main:app --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345]
INFO:     Started server process [67890]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Verify Backend:**
- API Root: http://localhost:8000/
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### 2. Start Frontend Server

**Terminal 2:**
```cmd
cd frontend
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.0.10
- Local:        http://localhost:3000
- Ready in 1.5s
```

**Verify Frontend:**
- Open browser: http://localhost:3000
- You should see the Smart Todo App interface

---

## Component Breakdown

### 1. API Client (`lib/api.ts`)

**Purpose:** Handles all HTTP communication with the backend

**Key Functions:**
- `api.getTasks()` - Fetch all tasks
- `api.createTask()` - Create new task
- `api.updateTask()` - Update existing task
- `api.deleteTask()` - Delete task

**Example:**
```typescript
import { api } from '@/lib/api';

// Create task
const task = await api.createTask({
  title: "Buy milk",
  description: "From the store"
});

// List tasks
const response = await api.getTasks({ status: 'pending' });
console.log(response.data); // Array of tasks
```

---

### 2. Custom Hooks (`hooks/useTasks.ts`)

**Purpose:** React hooks for data fetching with SWR

**Hooks:**
- `useTasks(status?)` - Fetch and cache tasks
- `useCreateTask()` - Create task with auto-revalidation
- `useUpdateTask()` - Update task with auto-revalidation
- `useDeleteTask()` - Delete task with auto-revalidation
- `useToggleTask()` - Toggle task status (pending ↔ completed)

**Example:**
```typescript
import { useTasks, useCreateTask } from '@/hooks/useTasks';

function MyComponent() {
  const { tasks, isLoading } = useTasks('pending');
  const { createTask } = useCreateTask();

  const handleCreate = async () => {
    await createTask({ title: "New task" });
    // List automatically refreshes!
  };
}
```

**Why SWR?**
- ✅ Automatic caching
- ✅ Auto-revalidation on focus/reconnect
- ✅ Optimistic updates
- ✅ Loading and error states

---

### 3. TaskForm Component

**Purpose:** Form for creating new tasks

**Features:**
- Title input (required, max 200 chars)
- Description textarea (optional, max 2000 chars)
- Character counters
- Validation
- Error handling
- Loading state

**User Flow:**
1. User enters task title
2. Optionally adds description
3. Clicks "Create Task"
4. Form clears on success
5. New task appears in list automatically

---

### 4. TaskList Component

**Purpose:** Display tasks with filtering

**Features:**
- Filter buttons (All, Pending, Completed)
- Task count badges
- Loading state (spinner)
- Empty state (no tasks message)
- Auto-refresh on data changes

**Filters:**
- **All** - Show all tasks
- **Pending** - Show only pending tasks
- **Completed** - Show only completed tasks

---

### 5. TaskItem Component

**Purpose:** Individual task card

**Features:**
- Checkbox to toggle status (pending ↔ completed)
- Strike-through for completed tasks
- Delete button with confirmation
- Timestamp display
- Responsive design

**Actions:**
- Click checkbox → Toggle task status
- Click delete → Show confirmation
- Click "Delete" in confirmation → Remove task
- Click "Cancel" → Cancel deletion

---

## Data Flow Examples

### Creating a Task

```
1. User types "Buy milk" in TaskForm

2. User clicks "Create Task"

3. TaskForm calls createTask()
   ↓
4. Hook calls api.createTask({ title: "Buy milk" })
   ↓
5. HTTP POST to http://localhost:8000/tasks/
   ↓
6. Backend creates task in database
   ↓
7. Backend returns task with ID
   ↓
8. Hook triggers SWR revalidation
   ↓
9. TaskList automatically refreshes
   ↓
10. New task appears in the list
```

### Toggling Task Status

```
1. User clicks checkbox on "Buy milk"

2. TaskItem calls toggleTask(task)
   ↓
3. Hook calls api.updateTask(id, { status: "completed" })
   ↓
4. HTTP PATCH to http://localhost:8000/tasks/{id}
   ↓
5. Backend updates task in database
   ↓
6. Backend returns updated task
   ↓
7. Hook triggers SWR revalidation
   ↓
8. Task UI updates with strike-through
```

### Deleting a Task

```
1. User clicks delete icon

2. Confirmation buttons appear

3. User clicks "Delete"

4. TaskItem calls deleteTask(id)
   ↓
5. HTTP DELETE to http://localhost:8000/tasks/{id}
   ↓
6. Backend deletes task from database
   ↓
7. Backend returns 204 No Content
   ↓
8. Hook triggers SWR revalidation
   ↓
9. Task disappears from list
```

---

## Testing the Integration

### Manual Testing Steps

#### 1. Create Task
1. Open http://localhost:3000
2. Enter "Buy groceries" in title
3. Click "Create Task"
4. ✅ Task appears in list immediately

#### 2. Mark as Completed
1. Click checkbox on "Buy groceries"
2. ✅ Task text gets strike-through
3. ✅ Checkbox shows checkmark
4. Click "Completed" filter
5. ✅ Task appears in completed list

#### 3. Filter Tasks
1. Create tasks with different statuses
2. Click "All" → See all tasks
3. Click "Pending" → See only pending
4. Click "Completed" → See only completed
5. ✅ Counts update correctly

#### 4. Delete Task
1. Click delete icon on any task
2. ✅ Confirmation buttons appear
3. Click "Delete"
4. ✅ Task disappears from list
5. ✅ Total count decreases

#### 5. Error Handling
1. Try creating task with empty title
2. ✅ Error message appears
3. Stop backend server
4. Try creating a task
5. ✅ Error message shows "Failed to create task"

---

## Troubleshooting

### Issue 1: CORS Error

**Error:** `Access to fetch at 'http://localhost:8000/tasks/' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:** Backend CORS is already configured in `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

If still seeing errors, verify backend is running on port 8000.

---

### Issue 2: API Connection Failed

**Error:** `Failed to fetch` or `Network request failed`

**Possible Causes:**
1. Backend not running
2. Wrong API URL in `.env.local`

**Solution:**
1. Check backend is running: http://localhost:8000/
2. Verify `.env.local` has: `NEXT_PUBLIC_API_URL=http://localhost:8000`
3. Restart frontend after changing `.env.local`

---

### Issue 3: Tasks Not Appearing

**Symptoms:** Form submits but list stays empty

**Debug Steps:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Create a task
4. Check if POST request succeeded (201 status)
5. Check if GET request returned tasks

**Common Fixes:**
- Clear browser cache
- Restart both servers
- Check database has tasks: http://localhost:8000/docs → Try GET /tasks

---

### Issue 4: Hooks Not Working

**Error:** `Error: Invalid hook call`

**Solution:** Make sure all components using hooks are marked with `'use client'`:
```typescript
'use client';  // This line is required!

import { useTasks } from '@/hooks/useTasks';
```

---

## Environment Variables

### Frontend (`.env.local`)

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Note:** Must be prefixed with `NEXT_PUBLIC_` to be accessible in browser.

### Backend (`.env`)

```bash
DATABASE_URL=postgresql+asyncpg://user:pass@host/db
SECRET_KEY=your-secret-key
```

---

## API Endpoints Used

| Method | Endpoint | Component | Purpose |
|--------|----------|-----------|---------|
| GET | `/tasks/` | TaskList | Fetch all tasks |
| POST | `/tasks/` | TaskForm | Create new task |
| PATCH | `/tasks/{id}` | TaskItem | Update task status |
| DELETE | `/tasks/{id}` | TaskItem | Delete task |

---

## Next Steps

### Completed ✅
- ✅ API client layer
- ✅ Custom React hooks with SWR
- ✅ Task form component
- ✅ Task list component
- ✅ Task item component
- ✅ Filtering (All, Pending, Completed)
- ✅ CRUD operations working
- ✅ Responsive UI with Tailwind CSS

### Future Enhancements (Not Required Now)
- 🔮 Authentication/Authorization
- 🔮 Task editing (inline or modal)
- 🔮 Task search functionality
- 🔮 Urdu language support (i18n)
- 🔮 Voice commands
- 🔮 Due dates and priorities
- 🔮 Drag-and-drop reordering

---

## Reference

- **API Documentation:** `backend/API_DOCUMENTATION.md`
- **Backend Implementation:** `backend/CRUD_IMPLEMENTATION.md`
- **Frontend Subagent:** `/agents/frontend_subagent/README.md`
- **Backend Subagent:** `/agents/backend_subagent/README.md`
- **Spec:** `/specs/001-todo-app-spec/spec.md`

---

## Quick Commands

### Start Both Servers

**Terminal 1 (Backend):**
```cmd
cd backend && venv\Scripts\activate && uvicorn src.main:app --reload
```

**Terminal 2 (Frontend):**
```cmd
cd frontend && npm run dev
```

### Test API Directly

```bash
# Create task
curl -X POST http://localhost:8000/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Task"}'

# List tasks
curl http://localhost:8000/tasks/
```

### Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

---

**Status:** ✅ Frontend-Backend Integration Complete
**Last Updated:** 2025-12-13
