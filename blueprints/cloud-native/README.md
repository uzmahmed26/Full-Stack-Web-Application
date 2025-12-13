# Cloud-Native Blueprint for the Smart Todo App

This document outlines a reusable, cloud-native blueprint for deploying and managing the Smart Todo App. It is designed to be scalable, maintainable, and ready for automated CI/CD pipelines.

## 1. Core Principles

- **Environment-Agnostic:** The same artifacts can be deployed across `development`, `staging`, and `production` environments with only configuration changes.
- **Stateless Services:** Both the frontend and backend services are designed to be stateless, allowing for horizontal scaling. State is managed by the database and other backing services.
- **Configuration as Code:** Environment variables and service configurations are managed externally and injected at runtime, not hard-coded.
- **Agent-Driven Automation:** Agent Skills are integrated into the deployment and operational lifecycle to automate common tasks.

## 2. Folder Structure

This blueprint assumes the following structure within the project root:

```
/
├── blueprints/
│   └── cloud-native/
│       └── README.md         # This file
├── frontend/                 # Next.js application
│   ├── .env.development
│   ├── .env.production
│   └── ...
├── backend/                  # FastAPI application
│   ├── .env.development
│   └── .env.production
│   └── ...
├── agents/                   # Reusable subagents
│   ├── frontend_subagent/
│   ├── backend_subagent/
│   └── db_subagent/
└── skills/                   # Reusable agent skills
    ├── crud_api_skill/
    ├── validation_skill/
    └── notification_skill/
```

## 3. Environment Variable Management

- **`.env` Files:** Each service (`frontend`, `backend`) uses `.env` files for local development. These files are **NOT** committed to version control.
  - `frontend/.env.development`
  - `backend/.env.development`
- **Cloud Provider Secrets Management:** For `staging` and `production`, environment variables will be injected by the cloud provider's secrets management service (e.g., AWS Secrets Manager, Google Secret Manager, Vercel Environment Variables).

### Example `.env` for Backend

```ini
# backend/.env.development
DATABASE_URL="postgresql://user:password@localhost:5432/todo_db"
SECRET_KEY="a-very-secret-key"
CORS_ORIGINS="http://localhost:3000"
```

### Example `.env` for Frontend

```ini
# frontend/.env.development
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

## 4. Database Connection Setup

- **Connection URL:** The database connection is managed via a single `DATABASE_URL` environment variable.
- **Neon PostgreSQL:** For production, this URL will point to a Neon serverless PostgreSQL instance.
- **Local Development:** For local development, this URL can point to a local PostgreSQL instance running in Docker.
- **DB Subagent Integration:** The `db_subagent` is responsible for:
  - Reading the `DATABASE_URL`.
  - Providing a connection pool to the FastAPI application.
  - Generating and applying migrations based on schema changes.

## 5. Subagent & Skill Integration Points

### Build & Deployment Pipeline

1.  **CI Trigger:** A push to the `main` branch triggers the CI/CD pipeline.
2.  **Validation Skill:** The `validation_skill` is used to validate the syntax and structure of configuration files (`.env`, `package.json`, `requirements.txt`).
3.  **Frontend Subagent:**
    - Runs `npm install` and `npm run build` for the Next.js app.
    - Prepares the static assets for deployment.
4.  **Backend Subagent:**
    - Creates a Python virtual environment and installs dependencies from `requirements.txt`.
    - Prepares the FastAPI application for containerization or serverless deployment.
5.  **DB Subagent:**
    - Compares the current schema with the models to generate migration scripts.
    - **(Manual Gate):** A manual approval step is required before applying migrations to `staging` or `production`.
6.  **Deployment:**
    - **Frontend:** Deployed to a static hosting provider like Vercel or Netlify.
    - **Backend:** Containerized using Docker and deployed to a container orchestration service (e.g., Kubernetes, AWS ECS) or a serverless platform (e.g., AWS Lambda, Google Cloud Run).

### Operational Tasks

- **CRUD API Skill:** Can be used to build an admin interface or a CLI for managing application data directly, bypassing the UI.
- **Notification Skill:** Integrated into the backend to send emails or push notifications on specific events (e.g., task completion, due date reminders).

## 6. Containerization (Docker)

While not implemented yet, the blueprint is ready for containerization.

### Backend `Dockerfile` (Example)

```dockerfile
# Dockerfile for backend
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./src /app/src

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend `Dockerfile` (Example)

```dockerfile
# Dockerfile for frontend
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Production image, copy static files from build stage
FROM node:20-alpine
WORKDIR /app
COPY --from=0 /app/.next ./.next
COPY --from=0 /app/public ./public
COPY --from=0 /app/package.json ./package.json

CMD ["npm", "start"]
```

## 7. Deployment Instructions

1.  **Configure Environments:** Set up environment variables for `development`, `staging`, and `production` in your chosen cloud provider and locally.
2.  **Set up CI/CD:** Configure a CI/CD pipeline (e.g., using GitHub Actions) to follow the steps outlined in section 5.
3.  **Initial Deployment:**
    - Manually trigger the pipeline for the first deployment.
    - Verify that the frontend and backend are accessible and communicating with each other.
    - Verify that the database migrations have been applied correctly.
4.  **Automated Deployments:** Subsequent pushes to the `main` branch will automatically deploy to `staging`. A manual promotion step will be required to deploy to `production`.
