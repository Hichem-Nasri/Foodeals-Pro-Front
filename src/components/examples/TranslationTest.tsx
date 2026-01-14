'use client'

import { useTranslations } from '@/hooks/useTranslations'

export const TranslationTest = () => {
  const { t, locale } = useTranslations()
  
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Translation Test</h2>
      <p>Current locale: {locale}</p>
      
      <div className="mt-4 space-y-2">
        <h3 className="font-medium">Navigation translations:</h3>
        <ul className="space-y-1">
          <li>Dashboard: {t('navigation.dashboard')}</li>
          <li>Products: {t('navigation.products')}</li>
          <li>Settings: {t('navigation.settings')}</li>
          <li>Support: {t('navigation.support')}</li>
          <li>Logout: {t('navigation.logout')}</li>
        </ul>
      </div>
      
      <div className="mt-4 space-y-2">
        <h3 className="font-medium">Header/Sidebar translations:</h3>
        <ul className="space-y-1">
          <li>My Profile: {t('header.myProfile')}</li>
          <li>Language: {t('sidebar.language')}</li>
          <li>Logout: {t('sidebar.logout')}</li>
        </ul>
      </div>
    </div>
  )
}
