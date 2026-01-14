export const locales = [
  'en',
  'fr',
  'ar',
] as const
export type Locale =
  (typeof locales)[number]

export const defaultLocale: Locale =
  'en'

// Function to get translations on the server side
export async function getTranslations(
  locale: string
) {
  const messages = await import(
    `../messages/${locale}.json`
  ).catch(() => {
    // Fallback to default locale if the requested locale doesn't exist
    return import(
      `../messages/${defaultLocale}.json`
    )
  })

  const t = (
    key: string,
    defaultValue?: string
  ): string => {
    const keys = key.split('.')
    let value = messages.default

    for (const k of keys) {
      if (
        value &&
        typeof value === 'object' &&
        k in value
      ) {
        value = value[k]
      } else {
        return defaultValue || key
      }
    }

    return typeof value === 'string'
      ? value
      : defaultValue || key
  }

  return { t }
}
