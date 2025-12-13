# ADR-001: Frontend Data Fetching with SWR

> **Scope**: Document decision cluster for frontend data fetching strategy. This ADR covers the caching library, data fetching patterns, and state management approach for server data in the React frontend.

- **Status:** Accepted
- **Date:** 2025-12-13
- **Feature:** 001-todo-app-spec
- **Context:** Frontend Data Management and API Integration

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: YES - Long-term impact on frontend architecture, data flow patterns, developer experience
     2) Alternatives: YES - Multiple viable options (React Query, RTK Query, plain fetch) with different tradeoffs
     3) Scope: YES - Cross-cutting concern affecting all API interactions, caching, and state management
-->

## Context

The Todo Application frontend needs a robust solution for fetching, caching, and synchronizing server state from the FastAPI backend. Key requirements include:

**Functional Needs:**
- Fetch tasks from GET /tasks endpoint with filtering and pagination
- Create, update, and delete tasks via REST API
- Display loading states during API operations (FR-006)
- Handle errors gracefully with user-friendly messages (FR-007)
- Support optimistic UI updates for perceived performance

**Non-Functional Needs:**
- Response times < 1-2 seconds for CRUD operations (SC-001 to SC-004)
- Automatic cache invalidation and revalidation
- Minimal boilerplate code for data fetching
- Type-safe integration with TypeScript
- Small bundle size impact (< 500KB total frontend)

**Constraints:**
- No authentication in MVP (simplifies caching strategy)
- Single-user mode (no multi-user cache invalidation complexity)
- Standard REST API (no GraphQL, no WebSockets)
- Next.js 14 with App Router and React Server Components

## Decision

We will use **SWR (stale-while-revalidate) v2.2+** as our frontend data fetching and caching library.

**Technology Stack:**
- **Data Fetching Library:** SWR 2.2+
- **HTTP Client:** Native fetch API
- **Cache Strategy:** Stale-while-revalidate with automatic revalidation
- **State Management:** SWR cache + React local state (no Redux/Zustand needed)
- **Hook Pattern:** Custom hooks wrapping SWR (useTasks, useCreateTask, etc.)

**Implementation Approach:**
1. **API Client Layer** (`lib/api.ts`): Type-safe wrapper around fetch with error handling
2. **Custom Hooks** (`hooks/useTasks.ts`): SWR-based hooks for CRUD operations
3. **Optimistic Updates**: Use SWR's `mutate()` for instant UI feedback
4. **Cache Keys**: URL-based keys with query parameters for filtering
5. **Revalidation Strategy**: Revalidate on focus, reconnect, and after mutations

**Key Files:**
- `frontend/lib/api.ts` - API client with TypeScript types
- `frontend/hooks/useTasks.ts` - SWR hooks (useTasks, useCreateTask, useUpdateTask, useDeleteTask, useToggleTask)
- `frontend/components/*` - Components consuming SWR hooks

## Consequences

### Positive

1. **Automatic Caching and Revalidation**
   - SWR automatically caches API responses
   - Auto-revalidates on window focus and network reconnect
   - Reduces unnecessary API calls, improves performance
   - Meets SC-002 target (< 2s for 100 tasks with caching)

2. **Excellent Developer Experience**
   - Minimal boilerplate: `const { tasks, isLoading, error } = useTasks()`
   - Built-in loading and error states
   - Automatic TypeScript inference
   - 13KB gzipped (very small bundle impact)

3. **Optimistic Updates**
   - `mutate()` function for instant UI feedback
   - Automatic rollback on errors
   - Perceived performance improvement (meets SC-001, SC-003, SC-004)

4. **Built-in Features**
   - Deduplication of concurrent requests
   - Pagination and infinite loading support
   - Request retry and error recovery
   - Focus tracking and revalidation

5. **Next.js Integration**
   - Official Vercel library, excellent Next.js support
   - Works seamlessly with React Server Components
   - SSR-friendly (no hydration mismatches)

6. **Type Safety**
   - Full TypeScript support
   - Type inference from fetch functions
   - Matches backend Pydantic schemas

### Negative

1. **Limited Query Composition**
   - Less powerful than React Query for complex query dependencies
   - No built-in query cancellation (must implement manually)
   - Not ideal for complex relational data (fine for MVP's simple Task entity)

2. **Cache Inspection**
   - No DevTools for cache inspection (unlike React Query DevTools)
   - Harder to debug cache issues in development
   - Mitigation: Use browser console and SWR's built-in logging

3. **Bundle Size Consideration**
   - 13KB gzipped (small but not zero)
   - For MVP with minimal API calls, could use plain fetch
   - Justified by DX improvements and automatic features

4. **Learning Curve**
   - Team needs to learn SWR-specific patterns (mutate, revalidate)
   - Different mental model than Redux or React Query
   - Mitigation: Well-documented, simple API

5. **No Built-in Mutations**
   - Must wrap POST/PATCH/DELETE manually (unlike React Query's useMutation)
   - Implementation: Custom hooks (useCreateTask, useUpdateTask, etc.)
   - Adds slight boilerplate but maintains flexibility

## Alternatives Considered

### Alternative 1: React Query (TanStack Query)

**Pros:**
- More powerful query management (query dependencies, query cancellation)
- Excellent DevTools for debugging
- Built-in mutation hooks (useMutation)
- Larger ecosystem and community
- Better for complex data relationships

**Cons:**
- Larger bundle size (~40KB gzipped vs SWR's 13KB)
- More complex API (queryClient, queryKeys, caching config)
- Steeper learning curve
- Overkill for MVP's simple CRUD operations

**Why Rejected:**
- Bundle size impact (40KB vs 13KB)
- Higher complexity not justified for simple Task CRUD
- SWR's simplicity better suits MVP scope
- React Query shines with complex queries (not needed here)

### Alternative 2: Redux Toolkit Query (RTK Query)

**Pros:**
- Integrated with Redux ecosystem
- Automatic API slice generation
- Strong TypeScript support with code generation
- Built-in caching and invalidation

**Cons:**
- Requires Redux setup (heavyweight for simple app)
- Much larger bundle size (~50KB+ with Redux core)
- More boilerplate (store setup, slices, reducers)
- Over-engineering for MVP without complex state

**Why Rejected:**
- No need for global state management in MVP (single-user, simple CRUD)
- Bundle size too large (50KB+ vs 13KB)
- Adds Redux complexity without clear benefits
- SWR's local cache sufficient for our needs

### Alternative 3: Plain Fetch with Manual Caching

**Pros:**
- Zero bundle size overhead
- Full control over caching logic
- No external dependencies
- Simplest possible implementation

**Cons:**
- Must implement caching, revalidation, deduplication manually
- More boilerplate code (loading states, error handling)
- No optimistic updates without custom implementation
- Harder to maintain and debug
- Team must reinvent features SWR provides

**Why Rejected:**
- Reinventing the wheel (caching, revalidation, deduplication)
- Higher maintenance burden
- Developer time cost > 13KB bundle size trade-off
- Risk of bugs in custom cache implementation

### Alternative 4: Apollo Client

**Pros:**
- Industry-standard for GraphQL
- Excellent caching and state management
- Strong TypeScript support

**Cons:**
- Designed for GraphQL (we use REST)
- Massive bundle size (~100KB+)
- Complete overkill for REST API

**Why Rejected:**
- We use REST, not GraphQL (SC-009: RESTful API)
- Bundle size far too large
- Completely mismatched technology

## Decision Rationale

**SWR wins on:**
1. **Simplicity**: Minimal API, low learning curve (critical for MVP velocity)
2. **Bundle Size**: 13KB is acceptable given frontend budget < 500KB
3. **DX**: Built-in loading/error states, automatic revalidation, optimistic updates
4. **Next.js Fit**: Official Vercel library, excellent Next.js integration
5. **Performance**: Automatic caching meets SC-001 to SC-004 targets
6. **Type Safety**: Full TypeScript support, type inference

**Trade-offs Accepted:**
- Slightly less powerful than React Query (acceptable for simple CRUD)
- No DevTools (acceptable with good logging and console debugging)
- Manual mutation wrappers (minimal boilerplate, maintains flexibility)

**Future Considerations:**
- If app grows complex (multi-entity relationships, complex queries), migrate to React Query
- If bundle size becomes critical, consider dropping SWR for plain fetch
- If authentication adds complexity, re-evaluate caching strategy

## References

- Feature Spec: `specs/001-todo-app-spec/spec.md`
- Implementation Plan: `specs/001-todo-app-spec/plan.md` (lines 31, 239-240, 376, 383, 567-614, 687, 750, 906-920)
- Related ADRs: None (first ADR)
- Implementation Evidence:
  - `frontend/lib/api.ts` - API client implementation
  - `frontend/hooks/useTasks.ts` - SWR hooks implementation
  - `frontend/components/TaskList.tsx` - SWR usage in components
  - PHR-005: Frontend Integration (`history/prompts/001-todo-app-spec/005-implement-frontend-integration.green.prompt.md`)
- SWR Documentation: https://swr.vercel.app/
- Decision Date: 2025-12-13 (during frontend integration phase)
