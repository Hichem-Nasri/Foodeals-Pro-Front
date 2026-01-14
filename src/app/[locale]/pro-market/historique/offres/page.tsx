import HistoriqueOffersPageWrapper from '../_components/HistoriqueOffersPageWrapper'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  
  // You can dynamically set metadata based on locale
  const titles = {
    en: 'Offers History',
    fr: 'Historique des offres',
    ar: 'تاريخ العروض'
  } as const
  
  return {
    title: titles[locale as keyof typeof titles] || titles.en,
  }
}

export default function OffresHisrotyPge() {
  return (
    <div className='flex h-full flex-col gap-4 pb-4 max-lg:px-2'>
      <HistoriqueOffersPageWrapper />
    </div>
  )
}
