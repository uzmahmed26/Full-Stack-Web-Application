/**
 * Task Item Component
 * Individual task card with complete/delete actions
 */

'use client';

import { useState } from 'react';
import { Task } from '@/lib/api';
import { useToggleTask, useDeleteTask } from '@/hooks/useTasks';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { toggleTask } = useToggleTask();
  const { deleteTask } = useDeleteTask();

  const handleToggle = async () => {
    try {
      await toggleTask(task);
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
    } catch (error) {
      console.error('Failed to delete task:', error);
      setIsDeleting(false);
    }
  };

  const isPending = task.status === 'pending';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition">
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className="flex-shrink-0 mt-1"
          aria-label={isPending ? 'Mark as completed' : 'Mark as pending'}
        >
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
              isPending
                ? 'border-gray-300 hover:border-blue-500'
                : 'bg-blue-600 border-blue-600'
            }`}
          >
            {!isPending && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </div>
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-medium ${
              isPending ? 'text-gray-900' : 'text-gray-500 line-through'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={`mt-1 text-sm ${
                isPending ? 'text-gray-600' : 'text-gray-400 line-through'
              }`}
            >
              {task.description}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-400">
            Created {new Date(task.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Delete Button */}
        <div className="flex-shrink-0">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-gray-400 hover:text-red-600 transition p-1"
              aria-label="Delete task"
              disabled={isDeleting}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          ) : (
            <div className="flex gap-1">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition disabled:bg-gray-400"
              >
                {isDeleting ? '...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-xs bg-gray-300 hover:bg-gray-400 text-gray-700 px-2 py-1 rounded transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
