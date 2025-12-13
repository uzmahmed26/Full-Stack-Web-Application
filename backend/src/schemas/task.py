"""
Task Schemas
Pydantic models for Task API request/response validation

Based on: /specs/001-todo-app-spec/data-model.md
Reference: /skills/crud_api_skill/README.md
"""

from datetime import datetime
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, Field

from ..models.task import TaskStatus


# Request Schemas


class TaskCreate(BaseModel):
    """
    Schema for creating a new task
    Used in: POST /tasks
    """

    title: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Task title (1-200 characters)",
        examples=["Buy groceries"]
    )
    description: Optional[str] = Field(
        default=None,
        max_length=2000,
        description="Optional task description (max 2000 characters)",
        examples=["Get milk, eggs, and bread from the store"]
    )
    status: Optional[TaskStatus] = Field(
        default=TaskStatus.PENDING,
        description="Task status (defaults to pending)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Buy groceries",
                "description": "Get milk, eggs, and bread",
                "status": "pending"
            }
        }


class TaskUpdate(BaseModel):
    """
    Schema for updating an existing task (partial update)
    Used in: PATCH /tasks/{id}

    All fields are optional for partial updates
    """

    title: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=200,
        description="Updated task title"
    )
    description: Optional[str] = Field(
        default=None,
        max_length=2000,
        description="Updated task description"
    )
    status: Optional[TaskStatus] = Field(
        default=None,
        description="Updated task status"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "status": "completed"
            }
        }


# Response Schemas


class TaskRead(BaseModel):
    """
    Schema for task response
    Used in: All GET endpoints and mutations

    Returns complete task data including timestamps
    """

    id: UUID = Field(description="Unique task identifier")
    title: str = Field(description="Task title")
    description: Optional[str] = Field(description="Task description")
    status: TaskStatus = Field(description="Task status (pending/completed)")
    created_at: datetime = Field(description="Creation timestamp (UTC)")
    updated_at: datetime = Field(description="Last update timestamp (UTC)")

    class Config:
        from_attributes = True  # Allows creating from ORM models
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "title": "Buy groceries",
                "description": "Get milk, eggs, and bread",
                "status": "pending",
                "created_at": "2025-12-13T10:00:00Z",
                "updated_at": "2025-12-13T10:00:00Z"
            }
        }


class TaskListResponse(BaseModel):
    """
    Schema for paginated task list response
    Used in: GET /tasks

    Includes metadata for pagination
    """

    data: List[TaskRead] = Field(description="List of tasks")
    total: int = Field(description="Total number of tasks matching filters")
    limit: int = Field(description="Number of tasks per page")
    offset: int = Field(description="Number of tasks skipped")
    has_more: bool = Field(description="Whether more tasks are available")

    class Config:
        json_schema_extra = {
            "example": {
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
                "has_more": False
            }
        }
