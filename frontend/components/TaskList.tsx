/**
 * Task List Component - Professional Design
 * Displays list of tasks with advanced filtering and animations
 */

'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TaskStatus } from '@/lib/api';
import TaskItem from './TaskItem';
import { useTranslation } from '@/contexts/TranslationContext';

export default function TaskList() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<TaskStatus | undefined>(undefined);

  const { tasks, total, isLoading, isError, error } = useTasks(filter);

  // Filter stats
  const { tasks: allTasks } = useTasks();
  const { tasks: pendingTasks } = useTasks('pending');
  const { tasks: completedTasks } = useTasks('completed');

  if (isError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded-xl p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold text-red-700 dark:text-red-300">{t('error_loading')}</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error?.message || t('error_try_again')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 px-6 py-5 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{t('your_tasks')}</span>
            </h2>
            {!isLoading && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {total} {total !== 1 ? t('tasks_count_plural') : t('tasks_count')} {filter ? `(${filter})` : t('tasks_total')}
              </p>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter(undefined)}
              className={`group relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                filter === undefined
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:shadow-md border border-slate-200 dark:border-slate-600'
              }`}
            >
              <span className="flex items-center gap-2">
                {t('all')}
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                  filter === undefined
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                }`}>
                  {allTasks.length}
                </span>
              </span>
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`group relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                filter === 'pending'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:shadow-md border border-slate-200 dark:border-slate-600'
              }`}
            >
              <span className="flex items-center gap-2">
                {t('pending')}
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                  filter === 'pending'
                    ? 'bg-white/20 text-white'
                    : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                }`}>
                  {pendingTasks.length}
                </span>
              </span>
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`group relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                filter === 'completed'
                  ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:shadow-md border border-slate-200 dark:border-slate-600'
              }`}
            >
              <span className="flex items-center gap-2">
                {t('completed')}
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                  filter === 'completed'
                    ? 'bg-white/20 text-white'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                }`}>
                  {completedTasks.length}
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">{t('loading_tasks')}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-slate-400 dark:text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {filter === 'pending' ? t('no_pending_tasks') : filter === 'completed' ? t('no_completed_tasks') : t('no_tasks')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-center max-w-sm">
              {filter === 'pending' ? t('no_pending_message') : filter === 'completed' ? t('no_completed_message') : t('no_tasks_message')}
            </p>
          </div>
        )}

        {/* Task List with Stagger Animation */}
        {!isLoading && tasks.length > 0 && (
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TaskItem task={task} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
