import HistoriqueOrdersPageWrapper from '../_components/HistoriqueOrdersPageWrapper'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  
  // You can dynamically set metadata based on locale
  const titles = {
    en: 'Orders History',
    fr: 'Historique des commandes',
    ar: 'تاريخ الطلبات'
  } as const
  
  return {
    title: titles[locale as keyof typeof titles] || titles.en,
  }
}

export default function OrdersHistoryPage() {
  return (
    <div className='flex h-full flex-col gap-4 pb-4 max-lg:px-2'>
      <HistoriqueOrdersPageWrapper />
    </div>
  )
}
