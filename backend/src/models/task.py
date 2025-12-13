"""
Task Model
SQLModel definition for the tasks table

Based on: /specs/001-todo-app-spec/data-model.md
"""

from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class TaskStatus(str, Enum):
    """
    Task status enumeration
    Represents the completion state of a task
    """
    PENDING = "pending"
    COMPLETED = "completed"


class Task(SQLModel, table=True):
    """
    Task database model

    Represents a single todo item in the database.

    Fields:
        id: Unique identifier (UUID)
        title: Task title (1-200 characters, required)
        description: Optional task description (max 2000 characters)
        status: Task completion status (pending/completed)
        created_at: Timestamp when task was created
        updated_at: Timestamp when task was last modified

    Indexes:
        - Primary key on id
        - Index on status (for filtering)
        - Index on created_at (for sorting)
        - Composite index on (status, created_at) for filtered sorted queries
    """

    __tablename__ = "tasks"

    # Primary Key
    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        nullable=False,
        description="Unique identifier for the task"
    )

    # Required Fields
    title: str = Field(
        min_length=1,
        max_length=200,
        nullable=False,
        description="Task title (1-200 characters)"
    )

    # Optional Fields
    description: Optional[str] = Field(
        default=None,
        max_length=2000,
        nullable=True,
        description="Optional task description (max 2000 characters)"
    )

    # Status Field
    status: TaskStatus = Field(
        default=TaskStatus.PENDING,
        nullable=False,
        description="Task completion status (pending or completed)"
    )

    # Audit Timestamps
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Timestamp when task was created (UTC)"
    )

    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Timestamp when task was last updated (UTC)"
    )

    class Config:
        """SQLModel configuration"""
        json_schema_extra = {
            "example": {
                "title": "Buy groceries",
                "description": "Get milk, eggs, and bread from the store",
                "status": "pending"
            }
        }


# Note: Database indexes and triggers should be created via Alembic migrations
# See /specs/001-todo-app-spec/data-model.md for index definitions:
#
# CREATE INDEX idx_tasks_status ON tasks(status);
# CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
# CREATE INDEX idx_tasks_status_created_at ON tasks(status, created_at DESC);
#
# Trigger for auto-updating updated_at:
# CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
# FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
