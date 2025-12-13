# Internationalization (i18n)

This directory contains the files for the internationalization (i18n) of the Smart Todo App frontend.

## How it Works

The i18n system is designed to be simple and extensible. It uses JSON files for each language and a custom React hook (`useTranslation`) to provide translations to the components.

- **`en.json`**: Contains the English translations (default language).
- **`ur.json`**: Contains the Urdu translations.
- **`index.ts`**: Exports the translations.
- **`../../hooks/useTranslation.ts`**: A custom hook that provides the `t` function to components for translating strings.

## How to Use

To use translations in a component, import the `useTranslation` hook:

```typescript
import { useTranslation } from '../hooks/useTranslation';

const MyComponent = () => {
  const { t, setLanguage, language } = useTranslation();

  return (
    <div>
      <h1>{t('app_title')}</h1>
      <p>{t('app_description')}</p>
      <button onClick={() => setLanguage('en')}>English</button>
      <button onClick={() => setLanguage('ur')}>Urdu</button>
    </div>
  );
};
```

The `t` function takes a key from the JSON language files and returns the corresponding translated string. If a key is not found in the currently selected language, it will fall back to the default language (English).

## How to Add a New Language

1.  **Create a new JSON file:** Create a new file in the `frontend/i18n` directory with the language code as the filename (e.g., `fr.json` for French).
2.  **Add translations:** Copy the keys from `en.json` and provide the translations for the new language.
3.  **Update `index.ts`:** Import the new language file and add it to the `translations` object in `frontend/i18n/index.ts`.

```typescript
import en from './en.json';
import ur from './ur.json';
import fr from './fr.json'; // 1. Import the new language

export const translations = {
  en,
  ur,
  fr, // 2. Add it to the exports
};
```
That's it! The `useTranslation` hook will automatically pick up the new language.
