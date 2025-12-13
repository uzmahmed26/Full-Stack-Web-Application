# Backend - Smart Todo Application

FastAPI backend service for Phase II Smart Todo Application.

## Quick Start

### 1. Create Virtual Environment (Windows)

**CMD:**
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
```

**PowerShell:**
```powershell
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
```

### 2. Install Dependencies

```cmd
pip install -r requirements.txt
```

### 3. Configure Environment

```cmd
copy .env.example .env
```

Edit `.env` and update:
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `SECRET_KEY` - Generate using: `openssl rand -hex 32`

### 4. Run Development Server

```cmd
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Access API Documentation

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Root:** http://localhost:8000/

## Project Structure

```
backend/
├── src/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── api/                 # API route handlers (to be created)
│   ├── models/              # SQLModel database models (to be created)
│   ├── schemas/             # Pydantic request/response schemas (to be created)
│   ├── services/            # Business logic layer (to be created)
│   ├── db/                  # Database configuration (to be created)
│   └── core/                # Core configuration (to be created)
├── tests/                   # Test files (to be created)
├── alembic/                 # Database migrations (to be created)
├── requirements.txt         # Python dependencies
├── .env.example             # Environment variables template
├── .env                     # Your environment variables (not in git)
├── .gitignore
└── README.md                # This file
```

## Technology Stack

- **Framework:** FastAPI 0.104.1
- **Server:** Uvicorn 0.24.0
- **ORM:** SQLModel 0.0.14
- **Database:** PostgreSQL (via Neon)
- **Driver:** asyncpg 0.29.0
- **Migrations:** Alembic 1.12.1
- **Testing:** pytest 7.4.3

## Available Endpoints

### Current Endpoints

- `GET /` - Root endpoint (welcome message)
- `GET /health` - Health check

### Planned Endpoints (from spec)

- `GET /tasks` - List all tasks
- `POST /tasks` - Create new task
- `GET /tasks/{id}` - Get single task
- `PATCH /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

## Development Workflow

### Install Dependencies
```cmd
pip install -r requirements.txt
```

### Run Server
```cmd
uvicorn src.main:app --reload
```

### Run Tests
```cmd
pytest
pytest --cov=src
```

### Format Code
```cmd
black src/
isort src/
```

### Type Check
```cmd
mypy src/
```

## Reference Documentation

- **Architecture:** `/specs/001-todo-app-spec/plan.md`
- **API Contracts:** `/specs/001-todo-app-spec/contracts/openapi.yaml`
- **Data Model:** `/specs/001-todo-app-spec/data-model.md`
- **Tasks:** `/specs/001-todo-app-spec/tasks.md`
- **Backend Subagent:** `/agents/backend_subagent/README.md`
- **CRUD API Skill:** `/skills/crud_api_skill/README.md`

## Next Steps

1. Set up database connection in `src/db/session.py`
2. Create SQLModel models in `src/models/`
3. Set up Alembic migrations
4. Implement CRUD API endpoints in `src/api/`
5. Write tests in `tests/`

## Troubleshooting

### Virtual Environment Not Activating

**PowerShell Execution Policy:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Module Not Found Errors

Ensure virtual environment is activated:
```cmd
venv\Scripts\activate
pip install -r requirements.txt
```

### Database Connection Errors

Check `.env` file:
- `DATABASE_URL` format: `postgresql+asyncpg://user:password@host/database`
- Verify Neon database is accessible

## Status

✅ **Backend scaffolding complete**
✅ **FastAPI app initialized**
✅ **Dependencies defined**
✅ **Environment template created**

**Ready for:** Implementation of database models, API endpoints, and business logic.
