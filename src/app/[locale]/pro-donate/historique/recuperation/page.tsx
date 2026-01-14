import RecoveryDonateHistory from '@/containers/donate/historic/recovery'
import { getTranslations } from '@/i18n/config'
import React from 'react'

interface HistoryRecoveryPageProps {
  params: Promise<{
    locale: 'en' | 'fr' | 'ar'
  }>
}

const HistoryRecoveryPage: React.FC<HistoryRecoveryPageProps> = async ({ params }) => {
  const { locale } = await params
  const { t } = await getTranslations(locale)

  return <RecoveryDonateHistory />
}

export default HistoryRecoveryPage
