"""
Integration Tests for Task API Endpoints
Tests complete request/response cycle with database
"""

import pytest
from uuid import uuid4


@pytest.mark.asyncio
async def test_create_task(client):
    """Test POST /tasks endpoint"""
    # Create task
    response = await client.post(
        "/tasks/",
        json={
            "title": "Integration Test Task",
            "description": "Testing the API",
            "status": "pending"
        }
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Integration Test Task"
    assert data["description"] == "Testing the API"
    assert data["status"] == "pending"
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


@pytest.mark.asyncio
async def test_create_task_minimal(client):
    """Test creating task with minimal data"""
    response = await client.post(
        "/tasks/",
        json={"title": "Minimal Task"}
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Minimal Task"
    assert data["description"] is None
    assert data["status"] == "pending"


@pytest.mark.asyncio
async def test_create_task_invalid_title_too_long(client):
    """Test creating task with title exceeding max length"""
    response = await client.post(
        "/tasks/",
        json={"title": "x" * 201}  # Max is 200
    )

    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_create_task_invalid_title_empty(client):
    """Test creating task with empty title"""
    response = await client.post(
        "/tasks/",
        json={"title": ""}
    )

    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_list_tasks_empty(client):
    """Test GET /tasks when no tasks exist"""
    response = await client.get("/tasks/")

    assert response.status_code == 200
    data = response.json()
    assert data["data"] == []
    assert data["total"] == 0
    assert data["limit"] == 10
    assert data["offset"] == 0
    assert data["has_more"] is False


@pytest.mark.asyncio
async def test_list_tasks(client):
    """Test GET /tasks endpoint with multiple tasks"""
    # Create tasks
    await client.post("/tasks/", json={"title": "Task 1"})
    await client.post("/tasks/", json={"title": "Task 2"})
    await client.post("/tasks/", json={"title": "Task 3"})

    # List tasks
    response = await client.get("/tasks/")

    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]) == 3
    assert data["total"] == 3
    assert data["has_more"] is False


@pytest.mark.asyncio
async def test_list_tasks_with_pagination(client):
    """Test GET /tasks with pagination parameters"""
    # Create 5 tasks
    for i in range(5):
        await client.post("/tasks/", json={"title": f"Task {i+1}"})

    # Get first page (2 tasks)
    response = await client.get("/tasks/?limit=2&offset=0")
    data = response.json()
    assert len(data["data"]) == 2
    assert data["total"] == 5
    assert data["has_more"] is True

    # Get second page
    response = await client.get("/tasks/?limit=2&offset=2")
    data = response.json()
    assert len(data["data"]) == 2
    assert data["total"] == 5


@pytest.mark.asyncio
async def test_list_tasks_with_status_filter(client):
    """Test GET /tasks with status filter"""
    # Create tasks with different statuses
    await client.post("/tasks/", json={"title": "Pending 1", "status": "pending"})
    await client.post("/tasks/", json={"title": "Pending 2", "status": "pending"})
    await client.post("/tasks/", json={"title": "Completed 1", "status": "completed"})

    # Filter by pending
    response = await client.get("/tasks/?status=pending")
    data = response.json()
    assert len(data["data"]) == 2
    assert data["total"] == 2

    # Filter by completed
    response = await client.get("/tasks/?status=completed")
    data = response.json()
    assert len(data["data"]) == 1
    assert data["total"] == 1


@pytest.mark.asyncio
async def test_get_task(client):
    """Test GET /tasks/{id} endpoint"""
    # Create task
    create_response = await client.post(
        "/tasks/",
        json={"title": "Get Test"}
    )
    task_id = create_response.json()["id"]

    # Get task
    response = await client.get(f"/tasks/{task_id}")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == task_id
    assert data["title"] == "Get Test"


@pytest.mark.asyncio
async def test_get_nonexistent_task(client):
    """Test GET /tasks/{id} for non-existent task"""
    fake_id = str(uuid4())
    response = await client.get(f"/tasks/{fake_id}")

    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_update_task(client):
    """Test PATCH /tasks/{id} endpoint"""
    # Create task
    create_response = await client.post(
        "/tasks/",
        json={"title": "Original Title", "description": "Original"}
    )
    task_id = create_response.json()["id"]

    # Update task
    response = await client.patch(
        f"/tasks/{task_id}",
        json={
            "title": "Updated Title",
            "status": "completed"
        }
    )

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["description"] == "Original"  # Unchanged
    assert data["status"] == "completed"


@pytest.mark.asyncio
async def test_update_task_partial(client):
    """Test partial update (only status)"""
    # Create task
    create_response = await client.post(
        "/tasks/",
        json={"title": "Task", "description": "Description"}
    )
    task_id = create_response.json()["id"]

    # Update only status
    response = await client.patch(
        f"/tasks/{task_id}",
        json={"status": "completed"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Task"  # Unchanged
    assert data["description"] == "Description"  # Unchanged
    assert data["status"] == "completed"  # Changed


@pytest.mark.asyncio
async def test_update_nonexistent_task(client):
    """Test PATCH /tasks/{id} for non-existent task"""
    fake_id = str(uuid4())
    response = await client.patch(
        f"/tasks/{fake_id}",
        json={"title": "Updated"}
    )

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_task(client):
    """Test DELETE /tasks/{id} endpoint"""
    # Create task
    create_response = await client.post(
        "/tasks/",
        json={"title": "To Delete"}
    )
    task_id = create_response.json()["id"]

    # Delete task
    response = await client.delete(f"/tasks/{task_id}")
    assert response.status_code == 204

    # Verify task is deleted
    get_response = await client.get(f"/tasks/{task_id}")
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_delete_nonexistent_task(client):
    """Test DELETE /tasks/{id} for non-existent task"""
    fake_id = str(uuid4())
    response = await client.delete(f"/tasks/{fake_id}")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_complete_task_workflow(client):
    """Test complete CRUD workflow"""
    # 1. Create task
    create_response = await client.post(
        "/tasks/",
        json={"title": "Workflow Test", "status": "pending"}
    )
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]

    # 2. Read task
    get_response = await client.get(f"/tasks/{task_id}")
    assert get_response.status_code == 200
    assert get_response.json()["status"] == "pending"

    # 3. Update task
    update_response = await client.patch(
        f"/tasks/{task_id}",
        json={"status": "completed"}
    )
    assert update_response.status_code == 200
    assert update_response.json()["status"] == "completed"

    # 4. List tasks (should contain our task)
    list_response = await client.get("/tasks/")
    assert list_response.status_code == 200
    assert list_response.json()["total"] >= 1

    # 5. Delete task
    delete_response = await client.delete(f"/tasks/{task_id}")
    assert delete_response.status_code == 204

    # 6. Verify deletion
    final_get_response = await client.get(f"/tasks/{task_id}")
    assert final_get_response.status_code == 404
