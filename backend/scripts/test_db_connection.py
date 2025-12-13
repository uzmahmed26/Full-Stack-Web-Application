"""
Database Connection Test Script

Tests the connection to Neon PostgreSQL database.

Usage:
    python -m scripts.test_db_connection
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path to import src modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from src.db.session import async_engine
from src.core.config import settings


async def test_connection():
    """Test database connection"""
    print("=" * 60)
    print("Database Connection Test")
    print("=" * 60)
    print()

    # Display connection info (mask password)
    db_url = settings.DATABASE_URL
    if "@" in db_url:
        # Mask password in connection string
        parts = db_url.split("@")
        credentials = parts[0].split("//")[1]
        if ":" in credentials:
            user = credentials.split(":")[0]
            masked_url = db_url.replace(credentials, f"{user}:****")
            print(f"Database URL: {masked_url}")
        else:
            print(f"Database URL: {db_url}")
    else:
        print(f"Database URL: {db_url}")
    print()

    try:
        print("Testing connection...")
        async with async_engine.connect() as conn:
            # Execute simple query
            result = await conn.execute(text("SELECT version()"))
            version = result.scalar()

            print("✅ Connection successful!")
            print()
            print(f"PostgreSQL Version: {version}")
            print()

            # Test if tasks table exists
            result = await conn.execute(
                text("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tasks')")
            )
            table_exists = result.scalar()

            if table_exists:
                print("✅ 'tasks' table exists")

                # Count rows
                result = await conn.execute(text("SELECT COUNT(*) FROM tasks"))
                count = result.scalar()
                print(f"   Tasks in database: {count}")
            else:
                print("⚠️  'tasks' table does not exist yet")
                print("   Run: python -m scripts.init_db")

            print()
            print("Database connection is working correctly!")

    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print()
        print("Troubleshooting:")
        print("  1. Check your .env file exists and has DATABASE_URL set")
        print("  2. Verify Neon database credentials are correct")
        print("  3. Ensure your IP is allowed in Neon project settings")
        print("  4. Check DATABASE_URL format: postgresql+asyncpg://user:password@host/database")
        sys.exit(1)
    finally:
        # Close connection
        await async_engine.dispose()


if __name__ == "__main__":
    asyncio.run(test_connection())
