/**
 * API Client
 * Handles all HTTP requests to the FastAPI backend
 *
 * Reference: /agents/frontend_subagent/README.md
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Task status enum
 */
export type TaskStatus = 'pending' | 'completed';

/**
 * Task interface matching backend TaskRead schema
 */
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

/**
 * Task create payload matching backend TaskCreate schema
 */
export interface TaskCreate {
  title: string;
  description?: string;
  status?: TaskStatus;
}

/**
 * Task update payload matching backend TaskUpdate schema
 */
export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

/**
 * Task list response matching backend TaskListResponse schema
 */
export interface TaskListResponse {
  data: Task[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

/**
 * API error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Handle API response and errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new ApiError(
      error.detail || `HTTP ${response.status}`,
      response.status,
      error
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/**
 * API Client class
 */
export const api = {
  /**
   * Fetch all tasks with optional filtering and pagination
   */
  async getTasks(params?: {
    limit?: number;
    offset?: number;
    status?: TaskStatus;
  }): Promise<TaskListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.status) searchParams.set('status', params.status);

    const url = `${API_BASE_URL}/tasks/?${searchParams}`;
    const response = await fetch(url);
    return handleResponse<TaskListResponse>(response);
  },

  /**
   * Get a single task by ID
   */
  async getTask(id: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    return handleResponse<Task>(response);
  },

  /**
   * Create a new task
   */
  async createTask(data: TaskCreate): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Task>(response);
  },

  /**
   * Update an existing task
   */
  async updateTask(id: string, data: TaskUpdate): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Task>(response);
  },

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};
