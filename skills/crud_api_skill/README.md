# CRUD API Skill

## Role
A reusable skill for handling Create, Read, Update, and Delete (CRUD) operations for any resource.

## Capabilities
- **Create**: Creates a new resource.
- **Read**: Reads a single resource or a list of resources.
- **Update**: Updates an existing resource.
- **Delete**: Deletes a resource.
- **Filtering and Pagination**: Provides options for filtering and paginating lists of resources.

## Inputs
- The type of resource to operate on.
- The data for the resource.
- The ID of the resource (for Read, Update, and Delete operations).
- Filtering and pagination options.

## Outputs
- The created or updated resource.
- A list of resources.
- A success or error message.

## Reusable Behavior
This skill can be used by any agent that needs to perform CRUD operations on a resource. It can be configured to work with different database backends and API frameworks.