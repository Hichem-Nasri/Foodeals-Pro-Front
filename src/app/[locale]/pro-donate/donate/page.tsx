import { Metadata } from 'next'
import React from 'react'
import DonatePage from '@/containers/donate/doante'
import { getTranslations } from '@/i18n/config'

interface pageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: pageProps): Promise<Metadata> {
  const { locale } = await params
  const { t } = await getTranslations(locale)
  
  return {
    title: t('donate.pageTitle') + ' - ' + t('payments.foodeals'),
    description: 'Foodeals PRO Donate',
    icons: ['/favicon/donate.svg', '/favicon/favicon.svg'],
  }
}

const page: React.FC<pageProps> = () => {
  return <DonatePage />
}

export default page
