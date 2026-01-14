import 'server-only'

const dictionaries = {
  en: () =>
    import('@/messages/en.json').then(
      (module) => module.default
    ),
  fr: () =>
    import('@/messages/fr.json').then(
      (module) => module.default
    ),
  ar: () =>
    import('@/messages/ar.json').then(
      (module) => module.default
    ),
}

export const getDictionary = async (
  locale: 'en' | 'fr' | 'ar'
) => {
  try {
    console.log(
      '=== DEBUG getDictionary ==='
    )
    console.log(
      'Raw locale:',
      JSON.stringify(locale)
    )
    console.log(
      'Locale type:',
      typeof locale
    )
    console.log('Locale value:', locale)

    // Force fallback to English for now to debug
    const safeLocale =
      locale &&
      typeof locale === 'string' &&
      ['en', 'fr', 'ar'].includes(
        locale
      )
        ? (locale as 'en' | 'fr' | 'ar')
        : 'en'

    console.log(
      'Using safe locale:',
      safeLocale
    )
    console.log(
      'Dictionary function exists:',
      typeof dictionaries[safeLocale]
    )

    const result =
      await dictionaries[safeLocale]()
    console.log(
      'Dictionary loaded successfully for:',
      safeLocale
    )
    return result
  } catch (error) {
    console.error(
      `Error in getDictionary:`,
      error
    )
    // Ultimate fallback
    return await dictionaries['en']()
  }
}
