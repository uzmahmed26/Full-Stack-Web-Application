# Smart Todo Application - Complete Running Guide

## Quick Start (Application is Already Running!)

Your application is currently running and ready to use:

- **Backend API**: http://localhost:8000
- **Frontend UI**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs (Swagger UI)
- **Health Check**: http://localhost:8000/health

Open http://localhost:3000 in your browser to start using the Todo app!

---

## Application Status

✅ **Database**: Initialized (Neon PostgreSQL with `tasks` table)
✅ **Backend**: Running on port 8000
✅ **Frontend**: Running on port 3000
✅ **End-to-end test**: Passed (task created and retrieved successfully)

---

## Project Structure

```
phase-2/
├── backend/                  # FastAPI backend
│   ├── src/
│   │   ├── api/             # API route handlers
│   │   │   └── tasks.py     # Task CRUD endpoints
│   │   ├── models/          # SQLModel ORM models
│   │   │   └── task.py      # Task database model
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   │   └── task.py      # Task DTOs
│   │   ├── services/        # Business logic layer
│   │   │   └── task.py      # Task service (CRUD operations)
│   │   ├── db/              # Database configuration
│   │   │   └── session.py   # Database session management
│   │   ├── core/            # Core configuration
│   │   │   └── config.py    # Settings and environment variables
│   │   └── main.py          # FastAPI application entry point
│   ├── tests/               # Backend tests
│   │   ├── unit/            # Unit tests (service layer)
│   │   └── integration/     # Integration tests (API layer)
│   ├── scripts/             # Utility scripts
│   │   └── init_db.py       # Database initialization
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables (configured)
│
├── frontend/                # Next.js frontend
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page (main UI)
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── TaskForm.tsx     # Create task form
│   │   ├── TaskItem.tsx     # Individual task card
│   │   └── TaskList.tsx     # Task list with filtering
│   ├── hooks/               # Custom React hooks
│   │   └── useTasks.ts      # SWR-based data fetching hooks
│   ├── lib/                 # Utilities
│   │   └── api.ts           # API client (TypeScript)
│   ├── package.json         # Node dependencies
│   └── .env.local           # Environment variables (configured)
│
└── history/                 # Project documentation
    ├── adr/                 # Architecture Decision Records
    │   ├── 001-frontend-data-fetching-with-swr.md
    │   └── 002-clean-architecture-backend-pattern.md
    └── prompts/             # Prompt History Records
```

---

## Full Setup Instructions (For Fresh Setup)

### Prerequisites

- **Python 3.11+** (for backend)
- **Node.js 18+** (for frontend)
- **PostgreSQL** (Neon cloud database configured)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Verify .env file is configured
# DATABASE_URL should point to your Neon PostgreSQL database
# (Already configured: postgresql+asyncpg://neondb_owner@ep-falling-darkness...)

# Initialize database tables (creates tasks table and taskstatus ENUM)
python -m scripts.init_db

# Start backend server
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will be available at:**
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies (already installed)
npm install

# Verify .env.local is configured
# NEXT_PUBLIC_API_URL should be http://localhost:8000

# Start frontend development server
npm run dev
```

**Frontend will be available at:**
- App: http://localhost:3000

---

## API Endpoints

### Base URL: `http://localhost:8000`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| **GET** | `/` | Root endpoint (API info) | None |
| **GET** | `/health` | Health check | None |
| **GET** | `/tasks/` | List all tasks (paginated) | None |
| **POST** | `/tasks/` | Create new task | `{"title": "string", "description": "string?", "status": "pending\|completed"}` |
| **GET** | `/tasks/{id}` | Get single task | None |
| **PATCH** | `/tasks/{id}` | Update task (partial) | `{"title"?: "string", "description"?: "string", "status"?: "pending\|completed"}` |
| **DELETE** | `/tasks/{id}` | Delete task | None |

### Query Parameters (GET /tasks/)

- `limit` (int, default: 10): Number of tasks to return
- `offset` (int, default: 0): Offset for pagination
- `status` (enum: "pending" | "completed"): Filter by status

---

## Testing the Application

### 1. Test Backend API (using curl)

```bash
# Health check
curl http://localhost:8000/health

# Create a task
curl -X POST http://localhost:8000/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, eggs, bread", "status": "pending"}'

# List all tasks
curl http://localhost:8000/tasks/

# Get specific task (replace {id} with actual task ID)
curl http://localhost:8000/tasks/{id}

# Update task
curl -X PATCH http://localhost:8000/tasks/{id} \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Delete task
curl -X DELETE http://localhost:8000/tasks/{id}
```

### 2. Test Frontend UI

1. Open http://localhost:3000 in your browser
2. You should see the Smart Todo App interface
3. Try these actions:
   - **Create a task**: Enter title and description, click "Add Task"
   - **Filter tasks**: Click "All", "Pending", or "Completed" tabs
   - **Complete a task**: Click the checkbox next to a task
   - **Delete a task**: Click the delete button (trash icon)

### 3. Run Automated Tests

```bash
# Backend tests (29 tests: 13 unit + 16 integration)
cd backend
pytest -v

# Expected output: 29 passed
```

---

## Development Workflow

### Backend Development

```bash
cd backend

# Run in development mode with auto-reload
uvicorn src.main:app --reload

# Run tests
pytest

# Run specific test file
pytest tests/unit/test_task_service.py -v

# Code formatting
black src/ tests/
isort src/ tests/

# Linting
flake8 src/ tests/
mypy src/
```

### Frontend Development

```bash
cd frontend

# Development server (auto-reloads on file changes)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint
```

---

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql+asyncpg://neondb_owner:password@ep-host.neon.tech/neondb

# API Server
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true

# CORS
CORS_ORIGINS=http://localhost:3000

# Environment
ENV=development
LOG_LEVEL=INFO
```

### Frontend (.env.local)

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'sqlmodel'`
**Solution**: Install dependencies: `pip install -r requirements.txt`

**Problem**: `asyncpg.exceptions.InvalidPasswordError`
**Solution**: Check `DATABASE_URL` in `.env` file, verify Neon database credentials

**Problem**: Port 8000 already in use
**Solution**:
```bash
# Kill existing process
lsof -ti:8000 | xargs kill -9  # Unix/Mac
netstat -ano | findstr :8000   # Windows (find PID, then: taskkill /PID <PID> /F)

# Or use different port
uvicorn src.main:app --port 8001
```

### Frontend Issues

**Problem**: `EADDRINUSE: address already in use :::3000`
**Solution**:
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9  # Unix/Mac
netstat -ano | findstr :3000   # Windows (find PID, then: taskkill /PID <PID> /F)
```

**Problem**: API requests failing (CORS errors)
**Solution**: Verify backend is running on port 8000 and `NEXT_PUBLIC_API_URL` is set correctly in `.env.local`

**Problem**: Frontend shows blank page
**Solution**:
1. Check browser console for errors
2. Verify backend is running: `curl http://localhost:8000/health`
3. Restart frontend: `Ctrl+C` then `npm run dev`

### Database Issues

**Problem**: Tables not created
**Solution**: Run initialization script: `python -m scripts.init_db`

**Problem**: Connection timeout
**Solution**:
1. Check internet connection (Neon is cloud-hosted)
2. Verify DATABASE_URL in `.env`
3. Check Neon dashboard for database status

---

## Current Application State

✅ **Backend dependencies**: Installed
✅ **Frontend dependencies**: Installed
✅ **Database schema**: Initialized (tasks table + taskstatus ENUM)
✅ **Backend server**: Running on http://localhost:8000
✅ **Frontend server**: Running on http://localhost:3000
✅ **End-to-end functionality**: Verified (task CRUD working)

**Test Task Created:**
- ID: `dc3dc401-bb10-4219-9f80-ed669fff95db`
- Title: "Test Task from Setup"
- Description: "This task was created during initial setup verification"
- Status: pending

---

## Architecture Documentation

For detailed architecture decisions and rationale:

- **ADR-001**: Frontend Data Fetching with SWR
  `history/adr/001-frontend-data-fetching-with-swr.md`

- **ADR-002**: Clean Architecture Backend Pattern (3-Layer)
  `history/adr/002-clean-architecture-backend-pattern.md`

- **Backend Implementation**: `backend/CRUD_IMPLEMENTATION.md`
- **API Documentation**: `backend/API_DOCUMENTATION.md`
- **Frontend Integration**: `frontend/INTEGRATION_GUIDE.md`

---

## Next Steps

1. **Use the application**: Open http://localhost:3000 and start creating tasks!

2. **Explore the API**: Visit http://localhost:8000/docs for interactive API documentation

3. **Run tests**: `cd backend && pytest -v` to verify all 29 tests pass

4. **Future enhancements** (optional):
   - Add authentication (JWT-based)
   - Implement task editing
   - Add search functionality
   - Deploy to production (Vercel + Cloud Run + Neon)

---

## Quick Commands Reference

```bash
# Backend
cd backend
python -m scripts.init_db          # Initialize database
uvicorn src.main:app --reload      # Start server
pytest -v                          # Run tests

# Frontend
cd frontend
npm run dev                        # Start dev server
npm run build                      # Production build

# API Testing
curl http://localhost:8000/health  # Health check
curl http://localhost:8000/tasks/  # List tasks
```

---

**Congratulations! Your Smart Todo Application is fully set up and running.** 🎉

Open http://localhost:3000 in your browser to start using it!
