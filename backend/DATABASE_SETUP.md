# Database Setup Guide - Phase II Smart Todo App

Complete guide for setting up the PostgreSQL database with SQLModel.

## Quick Start

### 1. Configure Environment

Ensure your `.env` file has the Neon PostgreSQL connection string:

```bash
DATABASE_URL=postgresql+asyncpg://user:password@host.neon.tech/todoapp
```

### 2. Activate Virtual Environment

**CMD:**
```cmd
cd backend
venv\Scripts\activate
```

**PowerShell:**
```powershell
cd backend
venv\Scripts\Activate.ps1
```

### 3. Test Connection

```cmd
python -m scripts.test_db_connection
```

### 4. Create Tables

```cmd
python -m scripts.init_db
```

### 5. Verify

```cmd
python -m scripts.test_db_connection
```

You should see: `✅ 'tasks' table exists`

---

## Database Model

### Task Model

**File:** `src/models/task.py`

```python
class Task(SQLModel, table=True):
    """
    Task database model
    Maps to 'tasks' table in PostgreSQL
    """
    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str = Field(min_length=1, max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=2000)
    status: TaskStatus = Field(default=TaskStatus.PENDING, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
```

### Task Status Enum

```python
class TaskStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
```

---

## Database Schema

### Tasks Table

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL CHECK (length(title) >= 1 AND length(title) <= 200),
    description TEXT CHECK (length(description) <= 2000),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes

To be created via Alembic migrations:

```sql
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_tasks_status_created_at ON tasks(status, created_at DESC);
```

---

## Scripts Reference

### 1. Test Database Connection

**Script:** `scripts/test_db_connection.py`

**Purpose:** Verifies connection to Neon PostgreSQL

**Usage:**
```cmd
python -m scripts.test_db_connection
```

**What it does:**
- Tests connection to database
- Shows PostgreSQL version
- Checks if `tasks` table exists
- Counts tasks in database

**Example Output:**
```
==============================================================
Database Connection Test
==============================================================

Database URL: postgresql+asyncpg://user:****@host.neon.tech/todoapp

Testing connection...
✅ Connection successful!

PostgreSQL Version: PostgreSQL 15.7 on x86_64-pc-linux-gnu

✅ 'tasks' table exists
   Tasks in database: 0

Database connection is working correctly!
```

### 2. Initialize Database

**Script:** `scripts/init_db.py`

**Purpose:** Creates database tables from SQLModel definitions

**Usage:**
```cmd
python -m scripts.init_db
```

**What it does:**
- Creates `tasks` table
- Applies SQLModel schema

**Warning:** This is for development only. Use Alembic migrations in production.

**Example Output:**
```
==============================================================
Database Initialization Script
==============================================================

Creating database tables...
✅ Database tables created successfully!

Tables created:
  - tasks (id, title, description, status, created_at, updated_at)
```

---

## Folder Structure

```
backend/
├── src/
│   ├── core/
│   │   └── config.py           # Settings & environment variables
│   ├── db/
│   │   └── session.py          # Database connection & session
│   ├── models/
│   │   ├── __init__.py         # Export models
│   │   └── task.py             # Task SQLModel
│   └── main.py
├── scripts/
│   ├── init_db.py              # Database initialization
│   └── test_db_connection.py  # Connection test
└── .env                        # Database credentials
```

---

## Configuration Details

### Settings (src/core/config.py)

```python
class Settings(BaseSettings):
    DATABASE_URL: str            # Required
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    SECRET_KEY: str              # Required
    ENV: str = "development"
```

### Database Session (src/db/session.py)

**Engine Configuration:**
- **Driver:** asyncpg (async PostgreSQL)
- **Pool Size:** 5 connections
- **Max Overflow:** 10 connections
- **Pool Pre-Ping:** Enabled (verify connections)
- **Echo:** Enabled in development

**Session Factory:**
- **Type:** AsyncSession
- **Expire on Commit:** False

---

## Windows Commands Reference

### PowerShell

```powershell
# Navigate to backend
cd backend

# Activate virtual environment
venv\Scripts\Activate.ps1

# Check .env file
Get-Content .env

# Test connection
python -m scripts.test_db_connection

# Create tables
python -m scripts.init_db

# Deactivate virtual environment
deactivate
```

### CMD

```cmd
REM Navigate to backend
cd backend

REM Activate virtual environment
venv\Scripts\activate

REM Check .env file
type .env

REM Test connection
python -m scripts.test_db_connection

REM Create tables
python -m scripts.init_db

REM Deactivate virtual environment
deactivate
```

---

## Troubleshooting

### Issue 1: Connection Failed - Authentication

**Error:** `password authentication failed for user "xxx"`

**Solutions:**
1. Verify credentials in `.env` match Neon dashboard
2. Check for typos in username/password
3. Ensure no extra spaces in `.env`
4. Regenerate password in Neon if needed

### Issue 2: Connection Failed - Network

**Error:** `could not connect to server`

**Solutions:**
1. Check if Neon database is active (not suspended)
2. Verify IP allowlist in Neon project settings
3. Test internet connection
4. Try accessing Neon dashboard to wake database

### Issue 3: Module Not Found

**Error:** `ModuleNotFoundError: No module named 'src'`

**Solutions:**
1. Ensure you're in `backend/` directory
2. Use `python -m scripts.xxx` (not `python scripts/xxx.py`)
3. Virtual environment must be activated

### Issue 4: DATABASE_URL Not Set

**Error:** `ValidationError: DATABASE_URL field required`

**Solutions:**
1. Create `.env` file: `copy .env.example .env`
2. Edit `.env` and add `DATABASE_URL`
3. Verify `.env` is in `backend/` directory

### Issue 5: Table Already Exists

**Error:** `Table 'tasks' already exists`

**Solution:** This is okay! Tables are already created. You can:
1. Skip to next step (implementation)
2. Or drop and recreate via Neon SQL Editor:
   ```sql
   DROP TABLE tasks;
   ```

---

## Next Steps

### Option A: Quick Development

1. ✅ Tables are created
2. Start implementing CRUD endpoints
3. Reference `/skills/crud_api_skill` for patterns

### Option B: Production-Ready (Recommended)

1. Set up Alembic migrations:
   ```cmd
   alembic init alembic
   ```

2. Configure `alembic.ini`:
   ```ini
   sqlalchemy.url = driver://user:pass@host/dbname
   ```
   Or use `env.py` to load from `.env`

3. Create initial migration:
   ```cmd
   alembic revision --autogenerate -m "Initial tables"
   ```

4. Apply migration:
   ```cmd
   alembic upgrade head
   ```

5. For all future schema changes, use Alembic migrations

---

## Database Operations Cheat Sheet

### Python Scripts

```cmd
# Test connection
python -m scripts.test_db_connection

# Create tables
python -m scripts.init_db
```

### SQL Queries (Neon SQL Editor or psql)

```sql
-- List all tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Check tasks table structure
\d tasks

-- Query all tasks
SELECT * FROM tasks;

-- Count tasks
SELECT COUNT(*) FROM tasks;

-- Insert test task
INSERT INTO tasks (title, description, status)
VALUES ('Test Task', 'This is a test', 'pending');

-- Query by status
SELECT * FROM tasks WHERE status = 'pending';

-- Delete all tasks
TRUNCATE TABLE tasks;

-- Drop tasks table
DROP TABLE tasks;
```

---

## Reference Documentation

- **Data Model Specification:** `/specs/001-todo-app-spec/data-model.md`
- **Database Subagent Guide:** `/agents/db_subagent/README.md`
- **Backend Setup:** `/agents/backend_subagent/README.md`
- **Architecture Plan:** `/specs/001-todo-app-spec/plan.md`

---

## Status

✅ **Database models created**
✅ **Connection configuration ready**
✅ **Test scripts available**
✅ **Initialization script ready**

**Ready for:** CRUD API implementation or Alembic migration setup
