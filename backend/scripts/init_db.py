"""
Database Initialization Script

Creates all database tables based on SQLModel definitions.

WARNING: This is for development/testing only.
In production, use Alembic migrations for schema management.

Usage:
    python -m scripts.init_db
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path to import src modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.db.session import init_db, async_engine
from src.models import Task  # Import models to register them


async def main():
    """Initialize database tables"""
    print("=" * 60)
    print("Database Initialization Script")
    print("=" * 60)
    print()

    try:
        print("Creating database tables...")
        await init_db()
        print("✅ Database tables created successfully!")
        print()
        print("Tables created:")
        print("  - tasks (id, title, description, status, created_at, updated_at)")
        print()
        print("Next steps:")
        print("  1. Verify tables in your Neon dashboard")
        print("  2. Set up Alembic for migrations: alembic init alembic")
        print("  3. Create initial migration: alembic revision --autogenerate -m 'Initial tables'")
        print("  4. Apply migration: alembic upgrade head")
        print()

    except Exception as e:
        print(f"❌ Error creating database tables: {e}")
        sys.exit(1)
    finally:
        # Close database connections
        await async_engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
