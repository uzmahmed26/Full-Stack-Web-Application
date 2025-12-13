"""
Task Service
Business logic for task CRUD operations

Reference: /agents/backend_subagent/README.md (Service Layer Pattern)
"""

from datetime import datetime
from typing import List, Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlmodel import col

from ..models.task import Task, TaskStatus
from ..schemas.task import TaskCreate, TaskUpdate


class TaskService:
    """
    Service class for task business logic

    Handles all CRUD operations for tasks with proper validation
    and error handling.
    """

    def __init__(self, session: AsyncSession):
        """
        Initialize service with database session

        Args:
            session: Async database session
        """
        self.session = session

    async def create(self, task_data: TaskCreate) -> Task:
        """
        Create a new task

        Args:
            task_data: Task creation data

        Returns:
            Created task with generated ID and timestamps

        Example:
            task = await service.create(TaskCreate(title="Buy milk"))
        """
        # Create task instance from schema
        task = Task(
            title=task_data.title,
            description=task_data.description,
            status=task_data.status or TaskStatus.PENDING
        )

        # Add to session and commit
        self.session.add(task)
        await self.session.commit()
        await self.session.refresh(task)

        return task

    async def get(self, task_id: UUID) -> Optional[Task]:
        """
        Get a single task by ID

        Args:
            task_id: UUID of the task

        Returns:
            Task if found, None otherwise

        Example:
            task = await service.get(task_id)
            if task is None:
                raise HTTPException(404, "Task not found")
        """
        statement = select(Task).where(Task.id == task_id)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def list(
        self,
        limit: int = 10,
        offset: int = 0,
        status: Optional[TaskStatus] = None
    ) -> tuple[List[Task], int]:
        """
        List tasks with pagination and optional filtering

        Args:
            limit: Maximum number of tasks to return (default: 10)
            offset: Number of tasks to skip (default: 0)
            status: Filter by status (optional)

        Returns:
            Tuple of (tasks, total_count)

        Example:
            tasks, total = await service.list(limit=20, status=TaskStatus.PENDING)
        """
        # Build query with optional status filter
        statement = select(Task)
        if status:
            statement = statement.where(Task.status == status)

        # Order by created_at descending (newest first)
        statement = statement.order_by(col(Task.created_at).desc())

        # Apply pagination
        statement = statement.limit(limit).offset(offset)

        # Execute query
        result = await self.session.execute(statement)
        tasks = result.scalars().all()

        # Get total count for pagination metadata
        count_statement = select(func.count()).select_from(Task)
        if status:
            count_statement = count_statement.where(Task.status == status)

        count_result = await self.session.execute(count_statement)
        total = count_result.scalar_one()

        return list(tasks), total

    async def update(self, task_id: UUID, task_data: TaskUpdate) -> Optional[Task]:
        """
        Update an existing task (partial update)

        Args:
            task_id: UUID of the task to update
            task_data: Task update data (only provided fields are updated)

        Returns:
            Updated task if found, None otherwise

        Example:
            task = await service.update(task_id, TaskUpdate(status=TaskStatus.COMPLETED))
        """
        # Get existing task
        task = await self.get(task_id)
        if task is None:
            return None

        # Update only provided fields
        update_data = task_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)

        # Update the updated_at timestamp
        task.updated_at = datetime.utcnow()

        # Commit changes
        self.session.add(task)
        await self.session.commit()
        await self.session.refresh(task)

        return task

    async def delete(self, task_id: UUID) -> bool:
        """
        Delete a task

        Args:
            task_id: UUID of the task to delete

        Returns:
            True if task was deleted, False if not found

        Example:
            deleted = await service.delete(task_id)
            if not deleted:
                raise HTTPException(404, "Task not found")
        """
        task = await self.get(task_id)
        if task is None:
            return False

        await self.session.delete(task)
        await self.session.commit()

        return True
