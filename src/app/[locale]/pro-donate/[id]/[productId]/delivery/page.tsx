import DeliveryOrder from '@/containers/market/dashboard/details/delivery'
import { getTranslations } from '@/i18n/config'
import React from 'react'

interface pageProps {
  params: Promise<{
    locale: string
    id: string
    productId: string
  }>
  searchParams: Promise<{
    mode: string
  }>
}

const PageDeliveryOrders: React.FC<
  pageProps
> = async ({
  params,
  searchParams,
}) => {
  const { locale, id, productId } = await params
  const { mode } = await searchParams
  const { t } = await getTranslations(locale)
  
  // TODO: check which id to use
  return (
    <div>
      {/* <DeliveryOrders id={params.id} mode={searchParams.mode} order={null} /> */}
      <DeliveryOrder id={id} />
    </div>
  )
}

export default PageDeliveryOrders
