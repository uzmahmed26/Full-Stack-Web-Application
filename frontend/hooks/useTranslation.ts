import { useState, useCallback } from 'react';
import { translations } from '../i18n';

type Language = keyof typeof translations;

const defaultLanguage: Language = 'en';

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  const t = useCallback(
    (key: string): string => {
      const lang = translations[language];
      if (lang && (lang as any)[key]) {
        return (lang as any)[key];
      }
      // Fallback to default language if key is not found in the current language
      const defaultLang = translations[defaultLanguage];
      if (defaultLang && (defaultLang as any)[key]) {
        return (defaultLang as any)[key];
      }
      return key;
    },
    [language]
  );

  return { t, setLanguage, language };
};
