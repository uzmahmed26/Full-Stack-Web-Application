/**
 * Custom React Hook for Task Management
 * Uses SWR for data fetching with automatic revalidation
 *
 * Reference: /agents/frontend_subagent/README.md (API Integration Pattern)
 */

import useSWR, { mutate } from 'swr';
import { api, Task, TaskCreate, TaskUpdate, TaskStatus, ApiError } from '@/lib/api';

/**
 * Hook for fetching and managing tasks
 */
export function useTasks(status?: TaskStatus) {
  // Generate cache key based on filter
  const cacheKey = status ? `/tasks?status=${status}` : '/tasks';

  // Fetch tasks with SWR
  const { data, error, isLoading } = useSWR(
    cacheKey,
    () => api.getTasks({ status, limit: 100 }),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    tasks: data?.data || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    error: error as ApiError,
  };
}

/**
 * Hook for creating a new task
 */
export function useCreateTask() {
  const createTask = async (data: TaskCreate) => {
    try {
      const newTask = await api.createTask(data);

      // Optimistically update all task lists
      mutate(
        (key) => typeof key === 'string' && key.startsWith('/tasks'),
        undefined,
        { revalidate: true }
      );

      return newTask;
    } catch (error) {
      throw error;
    }
  };

  return { createTask };
}

/**
 * Hook for updating a task
 */
export function useUpdateTask() {
  const updateTask = async (id: string, data: TaskUpdate) => {
    try {
      const updatedTask = await api.updateTask(id, data);

      // Optimistically update all task lists
      mutate(
        (key) => typeof key === 'string' && key.startsWith('/tasks'),
        undefined,
        { revalidate: true }
      );

      return updatedTask;
    } catch (error) {
      throw error;
    }
  };

  return { updateTask };
}

/**
 * Hook for deleting a task
 */
export function useDeleteTask() {
  const deleteTask = async (id: string) => {
    try {
      await api.deleteTask(id);

      // Optimistically update all task lists
      mutate(
        (key) => typeof key === 'string' && key.startsWith('/tasks'),
        undefined,
        { revalidate: true }
      );
    } catch (error) {
      throw error;
    }
  };

  return { deleteTask };
}

/**
 * Hook for toggling task status (pending <-> completed)
 */
export function useToggleTask() {
  const { updateTask } = useUpdateTask();

  const toggleTask = async (task: Task) => {
    const newStatus: TaskStatus = task.status === 'pending' ? 'completed' : 'pending';
    return updateTask(task.id, { status: newStatus });
  };

  return { toggleTask };
}
