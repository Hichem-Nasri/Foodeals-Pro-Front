import { getDeal } from '@/actions/market'
import Error from '@/app/[locale]/error'
import MobileHeader from '@/components/utils/MobileHeader'
import DealOffers from '@/containers/market/offers/deal'
import {
  DealType,
  defaultDeal,
} from '@/types/market-pro-type'
import api from '@/utils/api'
import { error } from 'console'
import { get } from 'http'
import React from 'react'
import { getTranslations } from '@/i18n/config'

interface pageProps {
  params: Promise<{
    id: string
    locale: string
  }>
}

const page: React.FC<
  pageProps
> = async ({ params }) => {
  const { id, locale } = await params
  const { t } = await getTranslations(locale)
  const deal = await getDeal(id)
  return (
    <>
      <MobileHeader header={t('offers.form.title')} />
      {!deal ? (
        <Error message={t('offers.messages.dealNotFound', 'Deal not found')} />
      ) : (
        <DealOffers
          deal={deal}
          id={id == 'create' ? '' : id}
          locale={locale}
        />
      )}
    </>
  )
}

export default page
