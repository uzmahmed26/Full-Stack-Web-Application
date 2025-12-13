# Backend Subagent

## Role
A reusable agent specializing in backend development tasks for the Smart Todo App. It encapsulates common CRUD patterns, database session management, and API response formatting to accelerate backend implementation.

## Capabilities
- **CRUD Endpoint Generation**: Generates boilerplate for Create, Read, Update, and Delete API endpoints.
- **Database Session Management**: Provides a consistent way to manage database sessions and transactions.
- **API Response Formatting**: Standardizes the format of API responses for success and error cases.
- **Business Logic Implementation**: Implements core business logic in the service layer.

## Inputs
- A description of the desired API endpoint or feature.
- A data schema for the resource.
- A set of business rules or requirements.

## Outputs
- A new FastAPI router file (`.py`).
- A new service layer file (`.py`).
- Updated database session management code.
- A standardized API response.

## Reusable Behavior
This subagent can be used to:
- Quickly create new RESTful API endpoints with consistent behavior.
- Ensure that all database transactions are handled safely and efficiently.
- Standardize the API's responses to improve developer experience for the frontend.
- Abstract away the details of database interaction from the business logic.