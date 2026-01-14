'use client'
import { useHistoriqueTranslations, useTranslations } from '@/hooks/useTranslations'

/**
 * Example component demonstrating how to use translations in the historique section
 * This file shows various ways to implement translations for the history pages
 */
export default function TranslationUsageExample() {
  // Method 1: Use the specific historique translation hook
  const t = useHistoriqueTranslations()
  
  // Method 2: Use the general translations hook with full path
  const { t: tGeneral } = useTranslations()

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Translation Usage Examples</h2>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Using useHistoriqueTranslations hook:</h3>
        <p>Title: {t('title')}</p>
        <p>Offers Title: {t('offers.title')}</p>
        <p>Orders Title: {t('orders.title')}</p>
        <p>Delivered Tab: {t('tabs.delivered')}</p>
        <p>Cancelled Tab: {t('tabs.cancelled')}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Using general useTranslations hook:</h3>
        <p>Title: {tGeneral('historique.title')}</p>
        <p>Offers Title: {tGeneral('historique.offers.title')}</p>
        <p>Orders Title: {tGeneral('historique.orders.title')}</p>
        <p>Load Error: {tGeneral('historique.messages.loadError')}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">With fallback values:</h3>
        <p>With fallback: {tGeneral('historique.nonexistent.key', 'Default fallback text')}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Status translations:</h3>
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
            {t('status.delivered')}
          </span>
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
            {t('status.cancelled')}
          </span>
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
            {t('status.pending')}
          </span>
        </div>
      </div>
    </div>
  )
}
