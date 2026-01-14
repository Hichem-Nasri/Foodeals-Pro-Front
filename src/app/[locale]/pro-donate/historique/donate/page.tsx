import DonateHistory from '@/containers/donate/historic/donate'
import { getTranslations } from '@/i18n/config'
import React from 'react'

interface pageProps {
  params: Promise<{
    locale: 'en' | 'fr' | 'ar'
  }>
}

const page: React.FC<pageProps> = async ({ params }) => {
  const { locale } = await params
  const { t } = await getTranslations(locale)

  return <DonateHistory />
}

export default page
