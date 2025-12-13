# ADR-002: Clean Architecture Backend Pattern

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2025-12-13
- **Feature:** 001-todo-app-spec
- **Context:** The backend requires a structured, maintainable, and scalable architecture to support the REST API for the todo application. The current approach of placing all logic within route handlers is not sustainable as the application grows in complexity.

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security?
     2) Alternatives: Multiple viable options considered with tradeoffs?
     3) Scope: Cross-cutting concern (not an isolated detail)?
     If any are false, prefer capturing as a PHR note instead of an ADR. -->

## Decision

We will adopt a 3-layer Clean Architecture pattern, separating concerns into:
1.  **API Layer (`api/`)**: Handles HTTP requests, validation, and serialization. It is the entry point for all incoming requests.
2.  **Service Layer (`services/`)**: Contains the core business logic, orchestrating data access and external service calls. It is completely independent of the API layer's transport mechanism.
3.  **Data Layer (`models/`, `db/`)**: Manages data access and persistence, abstracting the database interactions from the service layer.

<!-- For technology stacks, list all components:
     - Framework: Next.js 14 (App Router)
     - Styling: Tailwind CSS v3
     - Deployment: Vercel
     - State Management: React Context (start simple)
-->

## Consequences

### Positive

- **Improved Testability**: Each layer can be tested in isolation. Business logic is decoupled from the web framework, allowing for simpler unit tests.
- **Enhanced Maintainability**: Clear separation of concerns makes the codebase easier to understand, modify, and debug.
- **Increased Scalability**: The modular design allows individual layers to be scaled or replaced independently without impacting the entire system.

### Negative

- **Increased Boilerplate**: Requires more files and classes to implement a single feature, which can slow down initial development for simple endpoints.
- **Higher Learning Curve**: Developers unfamiliar with the pattern will need time to understand the structure and data flow.

## Alternatives Considered

- **Monolithic Routes**: Placing all logic directly within the API route handlers. This is simpler for small projects but quickly becomes unmanageable.
- **Fat Controllers/Services**: A single service layer that contains all business and data access logic. This is a step up from monolithic routes but still leads to large, hard-to-test classes.
- **Repository-Only Pattern**: Using a repository layer to abstract data access but leaving business logic in the API layer. This improves data access abstraction but fails to properly separate business logic.

## References

- Feature Spec: `specs/001-todo-app-spec/spec.md`
- Implementation Plan: `specs/001-todo-app-spec/plan.md`
- Related ADRs: `history/adr/001-frontend-data-fetching-with-swr.md`
- Evaluator Evidence: <!-- link to eval notes/PHR showing graders and outcomes -->
