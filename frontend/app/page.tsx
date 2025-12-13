'use client';

/**
 * Home Page
 * Main Todo App interface
 */

import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import VoiceCommand from '@/components/VoiceCommand';
import { useTranslation } from '@/hooks/useTranslation';

export default function Home() {
  const { t, setLanguage, language } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('app_title')}</h1>
              <p className="mt-1 text-sm text-gray-600">
                {t('app_description')}
              </p>
            </div>
            <div>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-sm rounded-md ${
                  language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ur')}
                className={`ml-2 px-3 py-1 text-sm rounded-md ${
                  language === 'ur' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Urdu
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Task Form */}
          <TaskForm />

          {/* Task List */}
          <TaskList />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm text-gray-500">
        <p>Phase II Smart Todo Application</p>
        <p className="mt-1">
          Built with Next.js + FastAPI + PostgreSQL
        </p>
      </footer>

      {/* Voice Command Button */}
      <VoiceCommand />
    </div>
  );
}
