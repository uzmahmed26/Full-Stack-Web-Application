# Deployment Skill

## Skill Name

Cloud Deployment and DevOps Automation

## Role & Capabilities

Reusable skill for deploying the Todo Application to cloud platforms with proper containerization, CI/CD pipelines, and infrastructure as code.

**Capabilities:**
- Create Dockerfiles for backend and frontend
- Configure Docker Compose for local multi-container setup
- Set up Vercel deployment for Next.js frontend
- Deploy FastAPI backend to Google Cloud Run or AWS Lambda
- Configure Neon PostgreSQL database with branching
- Implement GitHub Actions CI/CD pipelines
- Write infrastructure as code (Terraform/Pulumi)
- Set up environment variable management
- Configure health checks and monitoring
- Implement automated testing in CI pipeline

## Inputs

**Required Artifacts:**
- Backend application code (`backend/src/`)
- Frontend application code (`frontend/src/`)
- Environment variable templates (`.env.example`)
- Database migration scripts (`alembic/versions/`)
- Test suites (`backend/tests/`, `frontend/tests/`)

**Configuration:**
- Cloud provider credentials (Vercel, GCP, AWS)
- Neon database connection string
- Domain name (optional, for custom domains)
- Environment names (dev, staging, production)
- Resource limits (CPU, memory, auto-scaling)

## Outputs

**Generated Artifacts:**
- `backend/Dockerfile` - Backend container definition
- `frontend/Dockerfile` - Frontend container definition (if not using Vercel)
- `docker-compose.yml` - Local development orchestration
- `.github/workflows/ci.yml` - GitHub Actions CI pipeline
- `.github/workflows/deploy-backend.yml` - Backend deployment pipeline
- `.github/workflows/deploy-frontend.yml` - Frontend deployment pipeline
- `terraform/` or `pulumi/` - Infrastructure as code
- Deployment documentation in `docs/deployment.md`

**Deployed Services:**
- Frontend: Vercel (vercel.app domain)
- Backend: Cloud Run (run.app domain) or Lambda
- Database: Neon PostgreSQL (managed)
- Monitoring: Cloud provider metrics + Sentry (optional)

## Reusable Behavior

### 1. Backend Dockerfile Pattern

**Input:** FastAPI application with dependencies
**Output:** Production-ready Docker image

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/

# Run migrations and start server
CMD alembic upgrade head && uvicorn src.main:app --host 0.0.0.0 --port $PORT
```

**Behavior:**
- Use slim Python base image for smaller size
- Install dependencies in separate layer for caching
- Run database migrations on startup
- Expose port via environment variable
- Use production ASGI server (uvicorn)

### 2. Frontend Dockerfile Pattern (if needed)

**Input:** Next.js application
**Output:** Production-ready Docker image

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

CMD ["npm", "start"]
```

**Behavior:**
- Multi-stage build for smaller final image
- Install production dependencies only
- Build Next.js application
- Serve with production server

### 3. Docker Compose Pattern

**Input:** Backend and frontend services
**Output:** Local development environment

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    env_file:
      - ./frontend/.env.local
    depends_on:
      - backend

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5432:5432"
```

### 4. GitHub Actions CI Pipeline

**Input:** Code changes pushed to repository
**Output:** Automated testing and deployment

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r backend/requirements.txt
      - run: pytest backend/tests/

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
        working-directory: frontend
      - run: npm test
        working-directory: frontend
```

### 5. Vercel Deployment Pattern

**Input:** Next.js repository
**Output:** Deployed frontend application

**Steps:**
1. Connect GitHub repository to Vercel
2. Configure build settings (auto-detected for Next.js)
3. Set environment variables (NEXT_PUBLIC_API_URL)
4. Enable automatic deployments on push
5. Configure custom domain (optional)

### 6. Cloud Run Deployment Pattern

**Input:** Backend Docker image
**Output:** Deployed backend API

**Steps:**
1. Build and push Docker image to GCR/Artifact Registry
2. Deploy to Cloud Run with environment variables
3. Set minimum/maximum instances for auto-scaling
4. Configure custom domain and HTTPS
5. Enable Cloud Run health checks

## Implementation Notes

**Best Practices:**
- Use multi-stage Docker builds to reduce image size
- Never commit secrets or credentials to repository
- Use environment variables for all configuration
- Implement health check endpoints (`/health`)
- Enable HTTPS in production (Vercel and Cloud Run do this automatically)
- Set resource limits (CPU, memory) to control costs
- Use database branching (Neon) for staging environments
- Implement zero-downtime deployments (rolling updates)
- Monitor application performance and errors (Sentry, CloudWatch)
- Set up automated backups for production database
- Use semantic versioning for releases
- Tag Docker images with git commit SHA

**Security Checklist:**
- [ ] No secrets in source code
- [ ] Environment variables encrypted in CI/CD
- [ ] HTTPS enforced for all endpoints
- [ ] CORS configured correctly
- [ ] Database uses SSL connections
- [ ] API rate limiting enabled
- [ ] Security headers configured (CSP, HSTS)
- [ ] Dependencies scanned for vulnerabilities

**Cost Optimization:**
- Use free tiers where possible (Vercel, Neon, Cloud Run)
- Set auto-scaling minimums to 0 for development
- Use serverless for backend to avoid idle costs
- Enable connection pooling for database
- Optimize Docker images for faster cold starts
- Use CDN for static assets (Vercel does this automatically)

## Deployment Environments

### Development
- **Frontend:** Local (npm run dev) or Vercel preview
- **Backend:** Local (uvicorn --reload) or Cloud Run staging
- **Database:** Neon development branch
- **Purpose:** Active development and testing

### Staging
- **Frontend:** Vercel preview deployment (per PR)
- **Backend:** Cloud Run staging service
- **Database:** Neon staging branch
- **Purpose:** Pre-production testing and QA

### Production
- **Frontend:** Vercel production (main branch)
- **Backend:** Cloud Run production service
- **Database:** Neon main branch
- **Purpose:** Live user traffic

## Health Check Implementation

**Backend Health Endpoint:**
```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "version": "1.0.0"
    }
```

**Database Health Check:**
```python
@app.get("/health/db")
async def database_health(session: AsyncSession = Depends(get_session)):
    try:
        await session.execute("SELECT 1")
        return {"database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=503, detail="Database unavailable")
```

## Monitoring Alerts

**Key Metrics to Monitor:**
- Response time (p50, p95, p99)
- Error rate (5xx errors)
- Request volume (requests per second)
- Database connection pool usage
- Memory and CPU utilization
- Cold start latency (serverless)

**Alert Thresholds:**
- Error rate > 5% for 5 minutes
- p95 latency > 1 second for 5 minutes
- Memory usage > 90% for 10 minutes
- Database connections > 80% of pool size

## Reference Files

- Architecture: `specs/001-todo-app-spec/plan.md` (Deployment section)
- Quickstart: `specs/001-todo-app-spec/quickstart.md`
- Tasks: `specs/001-todo-app-spec/tasks.md` (Bonus deployment tasks)
