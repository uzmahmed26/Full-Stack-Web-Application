"""
Task API Routes
REST API endpoints for task CRUD operations

Reference: /skills/crud_api_skill/README.md
"""

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.session import get_session
from ..models.task import TaskStatus
from ..schemas.task import TaskCreate, TaskUpdate, TaskRead, TaskListResponse
from ..services.task import TaskService

# Create router with prefix and tags
router = APIRouter(
    prefix="/tasks",
    tags=["tasks"]
)


@router.post(
    "/",
    response_model=TaskRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new task",
    description="Creates a new task with the provided title, optional description, and status"
)
async def create_task(
    task_data: TaskCreate,
    session: AsyncSession = Depends(get_session)
) -> TaskRead:
    """
    Create a new task

    **Request Body:**
    - **title** (required): Task title (1-200 characters)
    - **description** (optional): Task description (max 2000 characters)
    - **status** (optional): Task status (defaults to "pending")

    **Returns:**
    - Created task with generated ID and timestamps

    **Example:**
    ```json
    {
        "title": "Buy groceries",
        "description": "Get milk, eggs, and bread",
        "status": "pending"
    }
    ```
    """
    service = TaskService(session)
    task = await service.create(task_data)
    return TaskRead.model_validate(task)


@router.get(
    "/",
    response_model=TaskListResponse,
    summary="List all tasks",
    description="Retrieves a paginated list of tasks with optional status filtering"
)
async def list_tasks(
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
        description="Number of tasks to return (max 100)"
    ),
    offset: int = Query(
        default=0,
        ge=0,
        description="Number of tasks to skip"
    ),
    status: Optional[TaskStatus] = Query(
        default=None,
        description="Filter by task status (pending or completed)"
    ),
    session: AsyncSession = Depends(get_session)
) -> TaskListResponse:
    """
    List tasks with pagination and optional filtering

    **Query Parameters:**
    - **limit** (optional): Number of tasks per page (1-100, default: 10)
    - **offset** (optional): Number of tasks to skip (default: 0)
    - **status** (optional): Filter by status ("pending" or "completed")

    **Returns:**
    - Paginated list of tasks with metadata

    **Example:**
    ```
    GET /tasks?limit=20&offset=0&status=pending
    ```
    """
    service = TaskService(session)
    tasks, total = await service.list(limit=limit, offset=offset, status=status)

    return TaskListResponse(
        data=[TaskRead.model_validate(task) for task in tasks],
        total=total,
        limit=limit,
        offset=offset,
        has_more=(offset + limit) < total
    )


@router.get(
    "/{task_id}",
    response_model=TaskRead,
    summary="Get a single task",
    description="Retrieves a specific task by its ID"
)
async def get_task(
    task_id: UUID,
    session: AsyncSession = Depends(get_session)
) -> TaskRead:
    """
    Get a task by ID

    **Path Parameters:**
    - **task_id**: UUID of the task

    **Returns:**
    - Task details

    **Raises:**
    - **404 Not Found**: If task with given ID doesn't exist

    **Example:**
    ```
    GET /tasks/123e4567-e89b-12d3-a456-426614174000
    ```
    """
    service = TaskService(session)
    task = await service.get(task_id)

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )

    return TaskRead.model_validate(task)


@router.patch(
    "/{task_id}",
    response_model=TaskRead,
    summary="Update a task",
    description="Updates an existing task with partial data (only provided fields are updated)"
)
async def update_task(
    task_id: UUID,
    task_data: TaskUpdate,
    session: AsyncSession = Depends(get_session)
) -> TaskRead:
    """
    Update a task (partial update)

    **Path Parameters:**
    - **task_id**: UUID of the task to update

    **Request Body (all fields optional):**
    - **title**: Updated task title
    - **description**: Updated task description
    - **status**: Updated task status

    **Returns:**
    - Updated task

    **Raises:**
    - **404 Not Found**: If task with given ID doesn't exist

    **Example:**
    ```json
    {
        "status": "completed"
    }
    ```
    """
    service = TaskService(session)
    task = await service.update(task_id, task_data)

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )

    return TaskRead.model_validate(task)


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a task",
    description="Deletes a task by its ID"
)
async def delete_task(
    task_id: UUID,
    session: AsyncSession = Depends(get_session)
) -> None:
    """
    Delete a task

    **Path Parameters:**
    - **task_id**: UUID of the task to delete

    **Returns:**
    - No content (204 status code)

    **Raises:**
    - **404 Not Found**: If task with given ID doesn't exist

    **Example:**
    ```
    DELETE /tasks/123e4567-e89b-12d3-a456-426614174000
    ```
    """
    service = TaskService(session)
    deleted = await service.delete(task_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )
