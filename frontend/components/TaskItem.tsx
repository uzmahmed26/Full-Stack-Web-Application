/**
 * Task Item Component - Professional Design
 * Individual task card with enhanced UX and animations
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
  const [isToggling, setIsToggling] = useState(false);

  const { toggleTask } = useToggleTask();
  const { deleteTask } = useDeleteTask();

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await toggleTask(task);
    } catch (error) {
      console.error('Failed to toggle task:', error);
    } finally {
      setTimeout(() => setIsToggling(false), 300);
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
  const createdDate = new Date(task.created_at);
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: createdDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });

  return (
    <div className={`group relative bg-white dark:bg-slate-800 rounded-xl shadow-md border-2 transition-all duration-300 overflow-hidden ${
      isPending
        ? 'border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg'
        : 'border-green-200 dark:border-green-900/50 hover:border-green-300 dark:hover:border-green-800 bg-gradient-to-br from-white to-green-50/30 dark:from-slate-800 dark:to-green-900/10'
    }`}>
      {/* Status Indicator Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
        isPending
          ? 'bg-gradient-to-b from-orange-500 to-orange-600'
          : 'bg-gradient-to-b from-green-500 to-green-600'
      }`} />

      <div className="flex items-start gap-4 p-5 pl-6">
        {/* Custom Checkbox */}
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className="flex-shrink-0 mt-1 transition-transform duration-200 hover:scale-110 active:scale-95"
          aria-label={isPending ? 'Mark as completed' : 'Mark as pending'}
        >
          <div
            className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
              isPending
                ? 'border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-slate-900'
                : 'bg-gradient-to-br from-green-500 to-green-600 border-green-500 shadow-lg shadow-green-500/30'
            }`}
          >
            {!isPending && (
              <svg
                className="w-5 h-5 text-white animate-fade-in"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
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
            className={`text-base font-semibold transition-all duration-300 ${
              isPending
                ? 'text-slate-900 dark:text-slate-100'
                : 'text-slate-500 dark:text-slate-400 line-through opacity-75'
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              className={`mt-2 text-sm leading-relaxed transition-all duration-300 ${
                isPending
                  ? 'text-slate-600 dark:text-slate-400'
                  : 'text-slate-400 dark:text-slate-500 line-through opacity-60'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Metadata */}
          <div className="mt-3 flex items-center gap-4 text-xs">
            <span className={`flex items-center gap-1.5 ${
              isPending
                ? 'text-slate-500 dark:text-slate-400'
                : 'text-slate-400 dark:text-slate-500'
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formattedDate}</span>
            </span>

            <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md font-medium ${
              isPending
                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                isPending ? 'bg-orange-500' : 'bg-green-500'
              }`} />
              <span className="text-xs font-semibold">{isPending ? 'Pending' : 'Completed'}</span>
            </span>
          </div>
        </div>

        {/* Delete Button */}
        <div className="flex-shrink-0">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
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
            <div className="flex gap-2 animate-fade-in">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:from-slate-400 disabled:to-slate-400 transform hover:scale-105 active:scale-95"
              >
                {isDeleting ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  'Delete'
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold px-3 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
