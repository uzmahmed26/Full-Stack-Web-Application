# Quick Start Guide: Todo Application Development

**Feature**: 001-todo-app-spec
**Date**: 2025-12-13
**Purpose**: Step-by-step guide to set up and run the Todo Application locally

## Prerequisites

Before starting development, ensure you have the following installed:

### Required Software

1. **Node.js** (v18.17 or higher)
   ```bash
   node --version  # Should be >= 18.17
   ```
   Download: https://nodejs.org/

2. **Python** (v3.11 or higher)
   ```bash
   python --version  # Should be >= 3.11
   ```
   Download: https://www.python.org/downloads/

3. **Git**
   ```bash
   git --version
   ```
   Download: https://git-scm.com/

4. **Package Managers**
   - npm (comes with Node.js)
   - pip (comes with Python)

### Recommended Tools

- **VS Code** or your preferred IDE
- **Postman** or **Thunder Client** for API testing
- **Neon CLI** (optional, for database management)

## Project Setup

### Step 1: Clone Repository (When Ready)

```bash
git clone <repository-url>
cd phase-2
git checkout 001-todo-app-spec
```

### Step 2: Project Structure

After implementation, the project will follow this structure:

```
phase-2/
├── backend/                # FastAPI backend
│   ├── src/
│   │   ├── api/           # API route handlers
│   │   │   ├── __init__.py
│   │   │   └── tasks.py   # Task endpoints
│   │   ├── models/        # SQLModel database models
│   │   │   ├── __init__.py
│   │   │   └── task.py    # Task model
│   │   ├── schemas/       # Pydantic request/response schemas
│   │   │   ├── __init__.py
│   │   │   └── task.py    # Task schemas
│   │   ├── services/      # Business logic layer
│   │   │   ├── __init__.py
│   │   │   └── task.py    # Task service
│   │   ├── db/            # Database configuration
│   │   │   ├── __init__.py
│   │   │   └── session.py # DB session management
│   │   ├── core/          # Core configuration
│   │   │   ├── __init__.py
│   │   │   └── config.py  # Settings & env vars
│   │   └── main.py        # FastAPI application entry
│   ├── tests/             # Backend tests
│   │   ├── unit/
│   │   ├── integration/
│   │   └── conftest.py
│   ├── alembic/           # Database migrations
│   │   ├── versions/
│   │   └── env.py
│   ├── requirements.txt   # Python dependencies
│   ├── pyproject.toml     # Python project config
│   └── .env.example       # Environment variables template
│
├── frontend/              # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   │   ├── layout.tsx # Root layout
│   │   │   └── page.tsx   # Home page (task list)
│   │   ├── components/    # React components
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskItem.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   └── DeleteConfirm.tsx
│   │   ├── lib/           # Utility functions
│   │   │   └── api.ts     # API client
│   │   ├── types/         # TypeScript types
│   │   │   └── task.ts    # Task interfaces
│   │   └── hooks/         # Custom React hooks
│   │       └── useTasks.ts # Task data fetching
│   ├── public/            # Static assets
│   ├── tests/             # Frontend tests
│   │   ├── unit/
│   │   └── e2e/
│   ├── package.json       # Node dependencies
│   ├── tsconfig.json      # TypeScript config
│   ├── next.config.js     # Next.js config
│   └── .env.local.example # Environment variables template
│
├── specs/                 # Feature specifications
│   └── 001-todo-app-spec/
│       ├── spec.md
│       ├── plan.md
│       ├── research.md
│       ├── data-model.md
│       ├── quickstart.md  # This file
│       └── contracts/
│
└── README.md              # Project overview
```

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Create Python Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

**Key Dependencies** (will be in requirements.txt):
```
fastapi==0.104.1
sqlmodel==0.0.14
uvicorn[standard]==0.24.0
asyncpg==0.29.0
alembic==1.12.1
pydantic==2.5.0
pydantic-settings==2.1.0
python-dotenv==1.0.0
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2
```

### Step 4: Set Up Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your values
```

**.env File Structure**:
```bash
# Database Configuration (from Neon)
DATABASE_URL=postgresql+asyncpg://user:password@host/database

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true  # Development only

# CORS Configuration (frontend URL)
CORS_ORIGINS=http://localhost:3000

# Logging
LOG_LEVEL=INFO
```

### Step 5: Set Up Neon PostgreSQL Database

1. **Sign up for Neon** (if not already done):
   - Visit: https://neon.tech/
   - Create account (free tier available)

2. **Create a New Project**:
   - Click "Create Project"
   - Project name: `todo-app-dev`
   - Region: Choose nearest to you

3. **Get Connection String**:
   - Copy the connection string from Neon dashboard
   - Format: `postgresql://user:password@host/database`
   - Replace in `.env`:
     ```bash
     DATABASE_URL=postgresql+asyncpg://user:password@host/database
     ```

4. **Create Development Branch** (optional):
   ```bash
   # Via Neon CLI or dashboard
   # Creates isolated database for development
   ```

### Step 6: Run Database Migrations

```bash
# Initialize Alembic (first time only)
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Create tasks table"

# Apply migrations
alembic upgrade head
```

**Verify Migration**:
```bash
# Connect to database and check tables
psql $DATABASE_URL
\dt  # Should show "tasks" table
```

### Step 7: Run Backend Server

```bash
# Start FastAPI server with auto-reload
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

**Verify Backend is Running**:
- Open browser: http://localhost:8000/docs (Swagger UI)
- Should see API documentation with all endpoints

### Step 8: Run Backend Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/unit/test_task_service.py
```

## Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
# From project root
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

**Key Dependencies** (will be in package.json):
```json
{
  "dependencies": {
    "next": "14.0.4",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "swr": "2.2.4",
    "typescript": "5.3.3"
  },
  "devDependencies": {
    "@types/node": "20.10.5",
    "@types/react": "18.2.45",
    "@types/react-dom": "18.2.18",
    "eslint": "8.56.0",
    "eslint-config-next": "14.0.4",
    "@playwright/test": "1.40.1",
    "jest": "29.7.0",
    "@testing-library/react": "14.1.2"
  }
}
```

### Step 3: Set Up Environment Variables

```bash
# Copy example env file
cp .env.local.example .env.local

# Edit .env.local with your values
```

**.env.local File Structure**:
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Note**: `NEXT_PUBLIC_` prefix exposes variable to browser.

### Step 4: Run Frontend Development Server

```bash
npm run dev
```

**Verify Frontend is Running**:
- Open browser: http://localhost:3000
- Should see Todo Application UI (once implemented)

### Step 5: Run Frontend Tests

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test:watch
```

## Development Workflow

### 1. Start Both Servers

**Terminal 1** (Backend):
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn src.main:app --reload
```

**Terminal 2** (Frontend):
```bash
cd frontend
npm run dev
```

### 2. Access Application

- **Frontend**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000/docs
- **Backend Alternative Docs**: http://localhost:8000/redoc

### 3. Making Changes

1. **Backend Changes**:
   - Edit Python files in `backend/src/`
   - Server auto-reloads on save
   - Test via Swagger UI or Postman

2. **Frontend Changes**:
   - Edit TypeScript/React files in `frontend/src/`
   - Page auto-refreshes on save (Hot Module Replacement)
   - Test in browser

3. **Database Schema Changes**:
   ```bash
   # Create migration
   cd backend
   alembic revision --autogenerate -m "Description of change"

   # Apply migration
   alembic upgrade head
   ```

### 4. Testing Changes

**Backend**:
```bash
cd backend
pytest  # Run all tests
```

**Frontend**:
```bash
cd frontend
npm test  # Run unit tests
npm run test:e2e  # Run E2E tests
```

## Common Commands Reference

### Backend Commands

```bash
# Activate virtual environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Install new dependency
pip install <package-name>
pip freeze > requirements.txt  # Update requirements

# Run server
uvicorn src.main:app --reload

# Run tests
pytest
pytest --cov=src
pytest -v  # Verbose output

# Database migrations
alembic revision --autogenerate -m "Message"
alembic upgrade head
alembic downgrade -1

# Format code
black src/
isort src/

# Lint code
flake8 src/
mypy src/
```

### Frontend Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start  # Run production build

# Run tests
npm test
npm run test:e2e
npm run test:watch

# Lint code
npm run lint

# Format code (if prettier configured)
npm run format

# Type check
npm run type-check
```

## Troubleshooting

### Backend Issues

**Issue**: `ModuleNotFoundError: No module named 'fastapi'`
**Solution**: Ensure virtual environment is activated and dependencies installed:
```bash
source venv/bin/activate
pip install -r requirements.txt
```

**Issue**: `Database connection failed`
**Solution**: Check DATABASE_URL in .env and verify Neon database is running:
```bash
echo $DATABASE_URL  # Verify URL is correct
psql $DATABASE_URL  # Test connection
```

**Issue**: `Alembic can't find models`
**Solution**: Ensure SQLModel models are imported in alembic/env.py:
```python
from src.models.task import Task
```

### Frontend Issues

**Issue**: `Cannot connect to API`
**Solution**: Verify backend is running and NEXT_PUBLIC_API_URL is correct:
```bash
# Check backend is running
curl http://localhost:8000/health

# Check environment variable
echo $NEXT_PUBLIC_API_URL
```

**Issue**: `npm install fails`
**Solution**: Clear npm cache and retry:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Issue**: `TypeScript errors in API calls`
**Solution**: Regenerate TypeScript types from OpenAPI spec:
```bash
npx openapi-typescript ../specs/001-todo-app-spec/contracts/openapi.yaml -o src/types/api.ts
```

### Database Issues

**Issue**: `Table doesn't exist`
**Solution**: Run migrations:
```bash
cd backend
alembic upgrade head
```

**Issue**: `Migration conflicts`
**Solution**: Rollback and reapply:
```bash
alembic downgrade -1
alembic upgrade head
```

## API Testing with Postman

### Import OpenAPI Spec

1. Open Postman
2. Click "Import"
3. Select `specs/001-todo-app-spec/contracts/openapi.yaml`
4. Postman will create collection with all endpoints

### Example Requests

**Create Task**:
```
POST http://localhost:8000/tasks
Body (JSON):
{
  "title": "Test task",
  "description": "Testing via Postman"
}
```

**List Tasks**:
```
GET http://localhost:8000/tasks
```

**Update Task**:
```
PATCH http://localhost:8000/tasks/{taskId}
Body (JSON):
{
  "status": "completed"
}
```

**Delete Task**:
```
DELETE http://localhost:8000/tasks/{taskId}
```

## Database Management

### View Data via psql

```bash
# Connect to database
psql $DATABASE_URL

# View all tasks
SELECT * FROM tasks;

# View pending tasks
SELECT * FROM tasks WHERE status = 'pending';

# Count tasks by status
SELECT status, COUNT(*) FROM tasks GROUP BY status;

# Exit psql
\q
```

### Reset Database (Development Only)

```bash
# Downgrade all migrations
alembic downgrade base

# Re-apply all migrations
alembic upgrade head

# Or drop all tables manually (nuclear option)
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
alembic upgrade head
```

## Environment Variables Cheat Sheet

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql+asyncpg://user:pass@host/db |
| API_HOST | Host to bind server | 0.0.0.0 |
| API_PORT | Port to bind server | 8000 |
| API_RELOAD | Enable auto-reload | true |
| CORS_ORIGINS | Allowed frontend origins | http://localhost:3000 |
| LOG_LEVEL | Logging level | INFO |

### Frontend (.env.local)

| Variable | Description | Example |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API URL | http://localhost:8000 |

## Next Steps

After setup is complete:

1. **Review Specifications**:
   - Read `specs/001-todo-app-spec/spec.md` (requirements)
   - Read `specs/001-todo-app-spec/plan.md` (architecture)
   - Read `specs/001-todo-app-spec/data-model.md` (database schema)
   - Read `specs/001-todo-app-spec/contracts/README.md` (API documentation)

2. **Generate Tasks**:
   ```bash
   /sp.tasks
   ```
   This will create `tasks.md` with implementation tasks

3. **Start Implementation** (TDD workflow):
   - Write tests first (red)
   - Implement feature (green)
   - Refactor (refactor)
   - Repeat

4. **Track Progress**:
   - Check off tasks in `tasks.md` as completed
   - Create PRs for review
   - Update documentation as needed

## Additional Resources

### Documentation

- **FastAPI**: https://fastapi.tiangolo.com/
- **Next.js**: https://nextjs.org/docs
- **SQLModel**: https://sqlmodel.tiangolo.com/
- **Neon PostgreSQL**: https://neon.tech/docs
- **SWR**: https://swr.vercel.app/
- **Alembic**: https://alembic.sqlalchemy.org/

### Tools

- **Swagger UI**: http://localhost:8000/docs (auto-generated)
- **ReDoc**: http://localhost:8000/redoc (auto-generated)
- **Neon Dashboard**: https://console.neon.tech/
- **Postman**: https://www.postman.com/

---

**Quick Start Status**: COMPLETE
**Ready for Development**: YES (after repository setup and task generation)
