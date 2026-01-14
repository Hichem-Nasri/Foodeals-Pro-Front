import { Metadata } from 'next'
import React from 'react'
import DonateStatsWrapper from '@/containers/donate/statistics'
import { getTranslations } from '@/i18n/config'

interface pageProps {
  params: Promise<{ locale: 'en' | 'fr' | 'ar' }>
}

export async function generateMetadata({ params }: pageProps): Promise<Metadata> {
  const { locale } = await params
  const { t } = await getTranslations(locale)
  
  return {
    title: `${t('donate.statistics.title')} - Donate`,
    description: 'Foodeals PRO Donate',
    icons: ['/favicon/donate.svg', '/favicon/favicon.svg'],
  }
}

const page: React.FC<pageProps> = () => {
  return <DonateStatsWrapper />
}

export default page
