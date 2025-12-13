"""
API Routes
FastAPI route handlers for all endpoints
"""

from .tasks import router as tasks_router

__all__ = ["tasks_router"]
