'use client'

import { usePathname } from 'next/navigation'
import {
  useEffect,
  useState,
} from 'react'
import { locales } from '@/i18n/config'

type Dictionary = Record<string, any>

// Custom hook to get current locale from pathname
export function useLocale():
  | 'en'
  | 'fr'
  | 'ar' {
  const pathname = usePathname()
  const locale = pathname.split('/')[1]
  return (
    locales.includes(locale as any)
      ? locale
      : 'en'
  ) as 'en' | 'fr' | 'ar'
}

export function useTranslations() {
  const locale = useLocale()
  const [dict, setDict] =
    useState<Dictionary>({})
  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setLoading(true)
        const dictionary = await import(
          `@/messages/${locale}.json`
        )
        setDict(dictionary.default)
      } catch (error) {
        console.error(
          'Failed to load translations:',
          error
        )
        // Fallback to English
        const fallback = await import(
          '@/messages/en.json'
        )
        setDict(fallback.default)
      } finally {
        setLoading(false)
      }
    }

    loadDictionary()
  }, [locale])

  const t = (
    key: string,
    defaultValue?: string
  ): string => {
    const keys = key.split('.')
    let value = dict

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

  return { t, locale, loading }
}

// Common translations hook
export function useCommonTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`common.${key}`)
}

// Navigation translations hook
export function useNavigationTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`navigation.${key}`)
}

// Auth translations hook
export function useAuthTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`auth.${key}`)
}

// Dashboard translations hook
export function useDashboardTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`dashboard.${key}`)
}

// Products translations hook
export function useProductsTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`products.${key}`)
}

// Orders translations hook
export function useOrdersTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`orders.${key}`)
}

// Customers translations hook
export function useCustomersTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`customers.${key}`)
}

// Forms translations hook
export function useFormsTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`forms.${key}`)
}

// Messages translations hook
export function useMessagesTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`messages.${key}`)
}

// Dates translations hook
export function useDatesTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`dates.${key}`)
}

// Pagination translations hook
export function usePaginationTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`pagination.${key}`)
}

// Stores translations hook
export function useStoresTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`stores.${key}`)
}

// Collaborators translations hook
export function useCollaboratorsTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`collaborators.${key}`)
}

// Support translations hook
export function useSupportTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`support.${key}`)
}

// Settings translations hook
export function useSettingsTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`settings.${key}`)
}

// Payments translations hook
export function usePaymentsTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`payments.${key}`)
}

// Valuation translations hook
export function useValuationTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`valuation.${key}`)
}

// DLC translations hook
export function useDlcTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`dlc.${key}`)
}

// Donate translations hook
export function useDonateTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`donate.${key}`)
}

// Market translations hook
export function useMarketTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`market.${key}`)
}

// Offers translations hook
export function useOffersTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`offers.${key}`)
}

// Deal Pro translations hook
export function useDealProTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`dealPro.${key}`)
}

// Basket translations hook
export function useBasketTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`basket.${key}`)
}

// Historique translations hook
export function useHistoriqueTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`historique.${key}`)
}

// Statistics translations hook
export function useStatisticsTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`statistics.${key}`)
}

// Delivery translations hook
export function useDeliveryTranslations() {
  const { t } = useTranslations()
  return (key: string) =>
    t(`delivery.${key}`)
}
