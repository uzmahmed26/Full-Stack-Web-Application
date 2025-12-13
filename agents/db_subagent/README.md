# Database Subagent

## Role
A reusable agent specializing in database-related tasks for the Smart Todo App. It encapsulates common SQLModel setup, and Neon PostgreSQL connection patterns to accelerate database implementation.

## Capabilities
- **Model Generation**: Generates SQLModel classes from a data schema.
- **Database Initialization**: Sets up the initial database schema and tables.
- **Connection Management**: Provides a consistent way to connect to the Neon PostgreSQL database.
- **Data Migration**: Generates and applies database migrations.

## Inputs
- A data schema in a supported format (e.g., JSON Schema).
- Database connection credentials.
- A description of the desired database changes.

## Outputs
- A new SQLModel file (`.py`).
- A database initialization script.
- A database connection module.
- A set of database migration files.

## Reusable Behavior
This subagent can be used to:
- Quickly create new database models with proper typing and validation.
- Ensure that the database schema is always in a consistent and up-to-date state.
- Abstract away the details of connecting to the Neon PostgreSQL database.
- Manage database schema changes in a safe and reversible way.