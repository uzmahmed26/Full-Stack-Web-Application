/**
 * Translation Context - Centralized translation state management
 * Provides a single source of truth for language selection across all components
 */

'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { translations } from '@/i18n';

type Language = keyof typeof translations;

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

/**
 * Translation Provider Component
 * Wraps the app to provide translation functionality to all child components
 */
export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  /**
   * Translation function - converts translation keys to localized strings
   * Falls back to English if key not found in selected language
   */
  const t = useCallback(
    (key: string): string => {
      const lang = translations[language];
      if (lang && (lang as any)[key]) {
        return (lang as any)[key];
      }
      // Fallback to English if key not found
      const defaultLang = translations['en'];
      if (defaultLang && (defaultLang as any)[key]) {
        return (defaultLang as any)[key];
      }
      // Return key itself if not found anywhere (for debugging)
      return key;
    },
    [language]
  );

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

/**
 * useTranslation Hook
 * Access translation functionality in any component
 * Must be used within TranslationProvider
 */
export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}
