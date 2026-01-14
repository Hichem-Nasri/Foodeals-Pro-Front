import React from 'react'
import MarketStatsWrapper from './MarketStatsWrapper'
import MobileHeader from '@/components/utils/MobileHeader'
import { getTranslations } from '@/i18n/config'

interface MarketStatsPageProps {
  params: Promise<{ locale: string }>
}

export default async function MarketStatsPage({ params }: MarketStatsPageProps) {
  const { locale } = await params
  const { t } = await getTranslations(locale)

  return (
    <div>
      <MobileHeader header={t('statistics.title')} />
      <MarketStatsWrapper />
    </div>
  )
}
