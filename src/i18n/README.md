# Internationalization (i18n) Setup

This project uses the official Next.js internationalization approach with locale-based routing to support Arabic (ar), English (en), and French (fr) languages.

## Architecture Overview

### Routing Structure

- Uses dynamic routes with `[locale]` segments: `/en/page`, `/fr/page`, `/ar/page`
- Automatic locale detection and redirection via middleware
- RTL support for Arabic language

### Key Files

#### 1. Middleware (`src/middleware.ts`)

- Detects user's preferred language from `Accept-Language` header
- Redirects routes without locale prefix to the appropriate locale
- Handles locale validation and fallback to default locale (English)

#### 2. Locale Configuration (`src/i18n/config.ts`)

```typescript
export const locales = [
  'en',
  'fr',
  'ar',
] as const
export const defaultLocale: Locale =
  'en'
```

#### 3. Dictionary System (`src/app/[locale]/dictionaries.ts`)

- Server-only imports for translation files
- Dynamic loading based on locale parameter
- Type-safe dictionary access

#### 4. Translation Files (`src/messages/`)

```
src/messages/
├── en.json (English translations)
├── fr.json (French translations)
└── ar.json (Arabic translations)
```

### Components

#### LocaleLink (`src/components/utils/LocaleLink.tsx`)

```tsx
import LocaleLink from '@/components/utils/LocaleLink'

;<LocaleLink
  href='/dashboard'
  locale='fr'
>
  Tableau de bord
</LocaleLink>
```

#### LanguageSwitcher (`src/components/utils/LanguageSwitcher.tsx`)

```tsx
import LanguageSwitcher from '@/components/utils/LanguageSwitcher'

;<LanguageSwitcher />
```

### Hooks

#### Server-side (in pages and layouts)

```tsx
import { getDictionary } from './dictionaries'

export default async function Page({
  params,
}: {
  params: Promise<{
    locale: 'en' | 'fr' | 'ar'
  }>
}) {
  const { locale } = await params
  const dict =
    await getDictionary(locale)

  return <h1>{dict.welcome}</h1>
}
```

#### Client-side (in components)

```tsx
import { useTranslations } from '@/hooks/useTranslations'

export default function MyComponent() {
  const { t, locale } =
    useTranslations()

  return <p>{t('common.welcome')}</p>
}
```

### RTL Support

Arabic language automatically enables RTL layout:

```tsx
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

Tailwind CSS RTL plugin is configured for RTL-specific styling.

### URL Structure

- `/` → Redirects to `/en/` (or user's preferred locale)
- `/en/dashboard` → English dashboard
- `/fr/dashboard` → French dashboard
- `/ar/dashboard` → Arabic dashboard (RTL)

### Adding New Translations

1. Add the key-value pair to all language files:

   ```json
   // src/messages/en.json
   {
     "newSection": {
       "newKey": "English text"
     }
   }
   ```

2. Use in components:
   ```tsx
   const { t } = useTranslations()
   return (
     <span>
       {t('newSection.newKey')}
     </span>
   )
   ```

### Adding New Languages

1. Add locale to `src/i18n/config.ts`:

   ```typescript
   export const locales = [
     'en',
     'fr',
     'ar',
     'es',
   ] as const
   ```

2. Create translation file: `src/messages/es.json`

3. Update dictionaries import in `src/app/[locale]/dictionaries.ts`:

   ```typescript
   const dictionaries = {
     // ... existing
     es: () =>
       import(
         '@/messages/es.json'
       ).then(
         (module) => module.default
       ),
   }
   ```

4. Update LanguageSwitcher component with new language info

### Best Practices

1. **Use nested keys** for better organization:

   ```json
   {
     "dashboard": {
       "title": "Dashboard",
       "stats": {
         "orders": "Total Orders"
       }
     }
   }
   ```

2. **Provide fallbacks** for missing translations:

   ```tsx
   t(
     'key.that.might.not.exist',
     'Fallback text'
   )
   ```

3. **Keep translations synchronized** across all language files

4. **Use descriptive keys** rather than English text as keys

### Static Generation

All locales are pre-generated at build time using `generateStaticParams`:

```tsx
export async function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }))
}
```

This setup follows the official Next.js 15 internationalization patterns and provides a robust, type-safe translation system without external dependencies.
