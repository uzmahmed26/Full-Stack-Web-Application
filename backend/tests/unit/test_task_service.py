"""
Unit Tests for TaskService
Tests business logic in isolation
"""

import pytest
from uuid import uuid4

from src.services.task import TaskService
from src.schemas.task import TaskCreate, TaskUpdate
from src.models.task import TaskStatus


@pytest.mark.asyncio
async def test_create_task(test_session):
    """Test creating a new task"""
    service = TaskService(test_session)

    # Create task
    task_data = TaskCreate(
        title="Test Task",
        description="This is a test task",
        status=TaskStatus.PENDING
    )
    task = await service.create(task_data)

    # Assertions
    assert task.id is not None
    assert task.title == "Test Task"
    assert task.description == "This is a test task"
    assert task.status == TaskStatus.PENDING
    assert task.created_at is not None
    assert task.updated_at is not None


@pytest.mark.asyncio
async def test_create_task_with_defaults(test_session):
    """Test creating task with minimal data (uses defaults)"""
    service = TaskService(test_session)

    task_data = TaskCreate(title="Minimal Task")
    task = await service.create(task_data)

    assert task.title == "Minimal Task"
    assert task.description is None
    assert task.status == TaskStatus.PENDING


@pytest.mark.asyncio
async def test_get_task(test_session):
    """Test getting a task by ID"""
    service = TaskService(test_session)

    # Create task
    task_data = TaskCreate(title="Get Test")
    created_task = await service.create(task_data)

    # Get task
    retrieved_task = await service.get(created_task.id)

    assert retrieved_task is not None
    assert retrieved_task.id == created_task.id
    assert retrieved_task.title == "Get Test"


@pytest.mark.asyncio
async def test_get_nonexistent_task(test_session):
    """Test getting a task that doesn't exist"""
    service = TaskService(test_session)

    # Try to get non-existent task
    task = await service.get(uuid4())

    assert task is None


@pytest.mark.asyncio
async def test_list_tasks(test_session):
    """Test listing tasks"""
    service = TaskService(test_session)

    # Create multiple tasks
    await service.create(TaskCreate(title="Task 1"))
    await service.create(TaskCreate(title="Task 2"))
    await service.create(TaskCreate(title="Task 3"))

    # List all tasks
    tasks, total = await service.list(limit=10, offset=0)

    assert len(tasks) == 3
    assert total == 3


@pytest.mark.asyncio
async def test_list_tasks_with_pagination(test_session):
    """Test listing tasks with pagination"""
    service = TaskService(test_session)

    # Create 5 tasks
    for i in range(5):
        await service.create(TaskCreate(title=f"Task {i+1}"))

    # Get first page (2 tasks)
    tasks, total = await service.list(limit=2, offset=0)
    assert len(tasks) == 2
    assert total == 5

    # Get second page (2 tasks)
    tasks, total = await service.list(limit=2, offset=2)
    assert len(tasks) == 2
    assert total == 5


@pytest.mark.asyncio
async def test_list_tasks_with_status_filter(test_session):
    """Test listing tasks filtered by status"""
    service = TaskService(test_session)

    # Create tasks with different statuses
    await service.create(TaskCreate(title="Pending 1", status=TaskStatus.PENDING))
    await service.create(TaskCreate(title="Pending 2", status=TaskStatus.PENDING))
    await service.create(TaskCreate(title="Completed 1", status=TaskStatus.COMPLETED))

    # List pending tasks
    tasks, total = await service.list(status=TaskStatus.PENDING)
    assert len(tasks) == 2
    assert total == 2

    # List completed tasks
    tasks, total = await service.list(status=TaskStatus.COMPLETED)
    assert len(tasks) == 1
    assert total == 1


@pytest.mark.asyncio
async def test_update_task(test_session):
    """Test updating a task"""
    service = TaskService(test_session)

    # Create task
    task = await service.create(TaskCreate(title="Original Title"))

    # Update task
    update_data = TaskUpdate(
        title="Updated Title",
        status=TaskStatus.COMPLETED
    )
    updated_task = await service.update(task.id, update_data)

    assert updated_task is not None
    assert updated_task.title == "Updated Title"
    assert updated_task.status == TaskStatus.COMPLETED
    assert updated_task.updated_at > task.updated_at


@pytest.mark.asyncio
async def test_update_partial_task(test_session):
    """Test partial update (only some fields)"""
    service = TaskService(test_session)

    # Create task
    task = await service.create(TaskCreate(
        title="Original",
        description="Original description"
    ))

    # Update only status
    update_data = TaskUpdate(status=TaskStatus.COMPLETED)
    updated_task = await service.update(task.id, update_data)

    assert updated_task.title == "Original"  # Unchanged
    assert updated_task.description == "Original description"  # Unchanged
    assert updated_task.status == TaskStatus.COMPLETED  # Changed


@pytest.mark.asyncio
async def test_update_nonexistent_task(test_session):
    """Test updating a task that doesn't exist"""
    service = TaskService(test_session)

    update_data = TaskUpdate(title="Updated")
    result = await service.update(uuid4(), update_data)

    assert result is None


@pytest.mark.asyncio
async def test_delete_task(test_session):
    """Test deleting a task"""
    service = TaskService(test_session)

    # Create task
    task = await service.create(TaskCreate(title="To Delete"))

    # Delete task
    deleted = await service.delete(task.id)
    assert deleted is True

    # Verify task is deleted
    retrieved = await service.get(task.id)
    assert retrieved is None


@pytest.mark.asyncio
async def test_delete_nonexistent_task(test_session):
    """Test deleting a task that doesn't exist"""
    service = TaskService(test_session)

    deleted = await service.delete(uuid4())
    assert deleted is False
