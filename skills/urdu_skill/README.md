# Urdu Skill

## Skill Name

Urdu Language Support and Internationalization

## Role & Capabilities

Reusable skill for implementing comprehensive Urdu language support with RTL layout, translation management, and cultural localization.

**Capabilities:**
- Set up i18n infrastructure (next-intl or react-i18next)
- Create and maintain translation dictionaries
- Implement RTL (Right-to-Left) layout system
- Build language switcher component
- Handle mixed LTR/RTL content
- Localize dates, times, and numbers
- Configure Urdu web fonts
- Test UI in both English and Urdu modes
- Implement locale persistence across sessions
- Provide fallback mechanisms for missing translations

## Inputs

**Required Artifacts:**
- All user-facing text strings from components
- UI component structure and layout
- Current English text content
- Brand voice and tone guidelines

**Configuration:**
- Supported locales (en, ur)
- Default locale (en)
- Translation file structure
- Urdu font selection (Google Fonts recommended)
- Locale detection strategy (browser, localStorage, URL)

## Outputs

**Generated Artifacts:**
- `frontend/src/locales/en.json` - English translations
- `frontend/src/locales/ur.json` - Urdu translations
- `frontend/src/lib/i18n.ts` - i18n configuration
- `frontend/src/components/LanguageSwitcher.tsx` - Language toggle component
- `frontend/src/styles/rtl.css` - RTL-specific styling
- Documentation in `docs/i18n-guide.md`

**Updated Files:**
- All components updated to use translation keys
- Layout components updated with `dir` attribute handling
- CSS files updated with logical properties

## Reusable Behavior

### 1. i18n Setup Pattern

**Input:** Next.js application
**Output:** Configured i18n infrastructure

**Steps:**
1. Install i18n library: `npm install next-intl`
2. Create locale files in `frontend/src/locales/`
3. Configure middleware for locale detection
4. Wrap app with i18n provider
5. Create `useTranslations` hook wrapper

**Configuration Example:**
```typescript
// frontend/src/lib/i18n.ts
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => ({
  messages: (await import(`../locales/${locale}.json`)).default
}));
```

### 2. Translation File Pattern

**Input:** English text strings
**Output:** Structured translation files

**English (en.json):**
```json
{
  "app": {
    "title": "Todo Application",
    "tagline": "Manage your tasks efficiently"
  },
  "tasks": {
    "create": "Create Task",
    "title": "Title",
    "description": "Description",
    "status": {
      "pending": "Pending",
      "completed": "Completed"
    },
    "filter": {
      "all": "All Tasks",
      "pending": "Pending Only",
      "completed": "Completed Only"
    }
  },
  "errors": {
    "required": "This field is required",
    "network": "Network error. Please try again.",
    "notFound": "Task not found"
  }
}
```

**Urdu (ur.json):**
```json
{
  "app": {
    "title": "ٹوڈو ایپلیکیشن",
    "tagline": "اپنے کاموں کو مؤثر طریقے سے منظم کریں"
  },
  "tasks": {
    "create": "ٹاسک بنائیں",
    "title": "عنوان",
    "description": "تفصیل",
    "status": {
      "pending": "زیر التواء",
      "completed": "مکمل"
    },
    "filter": {
      "all": "تمام ٹاسکس",
      "pending": "صرف زیر التواء",
      "completed": "صرف مکمل شدہ"
    }
  },
  "errors": {
    "required": "یہ فیلڈ ضروری ہے",
    "network": "نیٹ ورک کی خرابی۔ براہ کرم دوبارہ کوشش کریں۔",
    "notFound": "ٹاسک نہیں ملا"
  }
}
```

### 3. Component Translation Pattern

**Input:** Component with hardcoded text
**Output:** Component using translation keys

**Before:**
```tsx
export default function TaskForm() {
  return (
    <form>
      <h2>Create Task</h2>
      <label>Title</label>
      <input placeholder="Enter task title" />
      <button>Save</button>
    </form>
  );
}
```

**After:**
```tsx
import {useTranslations} from 'next-intl';

export default function TaskForm() {
  const t = useTranslations('tasks');

  return (
    <form>
      <h2>{t('create')}</h2>
      <label>{t('title')}</label>
      <input placeholder={t('titlePlaceholder')} />
      <button>{t('save')}</button>
    </form>
  );
}
```

### 4. RTL Layout Pattern

**Input:** LTR-designed components
**Output:** Bidirectional-ready components

**Root Layout with Direction:**
```tsx
import {NextIntlClientProvider} from 'next-intl';

export default function RootLayout({children, params: {locale}}) {
  const direction = locale === 'ur' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction}>
      <body>
        <NextIntlClientProvider locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**RTL-Aware CSS:**
```css
/* Use logical properties instead of directional */
.task-card {
  /* ❌ Don't use: margin-left, padding-right */
  /* ✅ Use: margin-inline-start, padding-inline-end */
  margin-inline-start: 1rem;
  padding-inline-end: 1rem;
  border-inline-start: 2px solid blue;
}

/* RTL-specific overrides if needed */
[dir="rtl"] .icon-arrow {
  transform: scaleX(-1); /* Flip arrows */
}
```

### 5. Language Switcher Pattern

**Input:** Current locale state
**Output:** Toggle component

```tsx
'use client';
import {useLocale} from 'next-intl';
import {useRouter, usePathname} from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    // Store preference
    localStorage.setItem('locale', newLocale);

    // Navigate to new locale path
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="language-switcher">
      <button
        onClick={() => switchLanguage('en')}
        className={locale === 'en' ? 'active' : ''}
      >
        English
      </button>
      <button
        onClick={() => switchLanguage('ur')}
        className={locale === 'ur' ? 'active' : ''}
      >
        اردو
      </button>
    </div>
  );
}
```

### 6. Urdu Font Setup Pattern

**Input:** Font requirements
**Output:** Configured web fonts

```tsx
// app/layout.tsx
import {Noto_Nastaliq_Urdu} from 'next/font/google';

const urduFont = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-urdu'
});

export default function RootLayout({children, params: {locale}}) {
  return (
    <html lang={locale} className={locale === 'ur' ? urduFont.variable : ''}>
      <body>{children}</body>
    </html>
  );
}
```

```css
/* styles/globals.css */
[lang="ur"] {
  font-family: var(--font-urdu), sans-serif;
}
```

## Implementation Notes

**Translation Best Practices:**
- Use nested keys with dot notation (e.g., `tasks.create`)
- Keep keys semantic (describe content, not UI position)
- Provide English as fallback for missing translations
- Use interpolation for dynamic content: `{name}`
- Handle pluralization (Urdu has different rules)
- Consider text expansion (Urdu text may be 20-30% longer)

**RTL Layout Checklist:**
- [ ] Text alignment (right-aligned for RTL)
- [ ] Padding/margin (use `inline-start`, `inline-end`)
- [ ] Flex direction (use `flex-row-reverse` for RTL)
- [ ] Grid template columns (reverse order)
- [ ] Icon placement (flip directional icons)
- [ ] Scroll direction (horizontal scrolling)
- [ ] Form field alignment
- [ ] Modal/dropdown positioning
- [ ] Navigation menu layout
- [ ] Date pickers and calendars

**Testing Checklist:**
- [ ] All text displays correctly in both languages
- [ ] No layout breaks when switching languages
- [ ] RTL layout mirrors LTR layout properly
- [ ] Mixed content (user input) displays correctly
- [ ] Language preference persists across sessions
- [ ] Fonts load correctly for Urdu text
- [ ] Form validation messages appear in selected language
- [ ] Error messages translated
- [ ] Date/time formats respect locale
- [ ] Number formats respect locale (Urdu uses Arabic numerals)

**Common Pitfalls:**
- Hardcoded strings in components
- Using `margin-left` instead of `margin-inline-start`
- Not flipping directional icons (arrows, carets)
- Forgetting to handle `dir` attribute on root element
- Not testing with actual Urdu speakers
- Assuming RTL is just CSS (requires semantic HTML changes)
- Not accounting for text expansion in UI design

## Locale Detection Priority

1. URL parameter (`/ur/tasks`)
2. localStorage (`locale: 'ur'`)
3. Browser language preference (`navigator.language`)
4. Default locale (`en`)

## Reference Files

- Architecture: `specs/001-todo-app-spec/plan.md` (i18n section)
- Tasks: `specs/001-todo-app-spec/tasks.md` (Bonus tasks B010-B018)

## Testing Scenarios

**Scenario 1: Language Switch**
1. User views app in English
2. Clicks "اردو" in language switcher
3. App reloads with Urdu content
4. Layout switches to RTL
5. Preference saved to localStorage

**Scenario 2: Mixed Content**
1. User creates task with English title in Urdu mode
2. Task displays correctly (LTR text in RTL layout)
3. User creates task with Urdu title in English mode
4. Task displays correctly (RTL text in LTR layout)

**Scenario 3: Persistence**
1. User selects Urdu language
2. User closes browser
3. User reopens application
4. App loads in Urdu (from localStorage)
