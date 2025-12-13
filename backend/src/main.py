"""
FastAPI Backend - Phase II Smart Todo Application
Main application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import tasks_router

# Initialize FastAPI app
app = FastAPI(
    title="Smart Todo API",
    description="Backend API for Phase II Smart Todo Application",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
# TODO: Update CORS_ORIGINS from environment variable in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks_router)


@app.get("/")
async def root():
    """
    Root endpoint - API health check

    Returns:
        dict: Welcome message and API status
    """
    return {
        "message": "Smart Todo API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint

    Returns:
        dict: API health status
    """
    return {
        "status": "healthy",
        "service": "Smart Todo API"
    }
