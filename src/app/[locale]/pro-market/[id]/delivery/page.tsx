import DeliveryOrder from '@/containers/market/dashboard/details/delivery'
import React from 'react'

interface pageProps {
  params: Promise<{
    id: string
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
  const { id } = await params
  const { mode } = await searchParams
  return (
    <div>
      {/* <DeliveryOrders id={params.id} mode={searchParams.mode} order={null} /> */}
      <DeliveryOrder id={id} />
    </div>
  )
}

export default PageDeliveryOrders
