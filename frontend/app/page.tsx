'use client';

/**
 * Home Page
 * Professional Todo App Interface
 */

import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import VoiceCommand from '@/components/VoiceCommand';
import { TranslationProvider, useTranslation } from '@/contexts/TranslationContext';

function HomeContent() {
  const { t, setLanguage, language } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {/* Logo/Icon */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  {t('app_title')}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 hidden sm:block">
                  {t('app_description')}
                </p>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  language === 'en'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ur')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  language === 'ur'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                اردو
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Task Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TaskForm />
            </div>
          </div>

          {/* Right Column - Task List */}
          <div className="lg:col-span-2">
            <TaskList />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {t('footer_title')}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {t('footer_subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer"
                 className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {t('api_docs')}
              </a>
              <a href="http://localhost:8000/health" target="_blank" rel="noopener noreferrer"
                 className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {t('api_status')}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Voice Command Button */}
      <VoiceCommand />
    </div>
  );
}

export default function Home() {
  return (
    <TranslationProvider>
      <HomeContent />
    </TranslationProvider>
  );
}
