import { getOrderById } from '@/actions/market'
import Error from '@/app/[locale]/error'
import Grid from '@/components/utils/Grid'
import MobileHeader from '@/components/utils/MobileHeader'
import DetailsOrders from '@/containers/market/dashboard/details'
import CancelOrder from '@/containers/market/dashboard/details/CancelOrder'
import { useTitle } from '@/context/TitleContext'
import { PaymentMethodEnum } from '@/types/GlobalType'
import { capitalize } from '@/utils/utils'
import React from 'react'

interface pageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    mode: string
  }>
}

const PageDetailsOrders: React.FC<
  pageProps
> = async ({
  params,
  searchParams,
}) => {
  const { mode } = await searchParams
  const { id } = await params
  const data = await getOrderById(id)
  return (
    <div>
      <MobileHeader
        header={
          `Détails du produit` +
          (data?.orderStatus ==
          'CANCELED'
            ? `${' annulée'}`
            : '')
        }
      />
      {!data ? (
        <Error message='Commandes non trouvées' />
      ) : (
        <DetailsOrders
          id={id}
          creationDate={
            new Date(data.orderDate)
          }
          totalQuanity={
            data.quantity! || 0
          }
          productImages={
            data.photosProducts
          }
          productName={data.title!}
          productDescription={
            data.description!
          }
          price={data.priceOrder}
          color='green'
          contactEmail={
            data.emailClient || ''
          }
          contactPhone={
            data.phoneClient || ''
          }
          contactName={
            capitalize(data.client) ||
            ''
          }
          orderDate={new Date()}
          paymentMethod={
            data.typePayment as PaymentMethodEnum
          }
          deliveryManName={
            data.DeliveryBoyName ||
            'Foodeals delivery'
          }
          deliveryManEmail={
            data.deliveryBoyEmail || ''
          }
          deliveryManPhone={
            data.deliveryBoyPhone || ''
          }
          destinationAddress={
            data.deliveryAdress
          }
          deliveryCompanyName='Foodeals delivery'
          deliveryCompanyAvatar='/images/symbole-foodeals.svg'
          status={
            data.orderStatus ==
            'IN_PROGRESS'
              ? 'PENDING'
              : data.orderStatus ==
                  'COMPLETED'
                ? 'DELIVERED'
                : 'CANCELED'
          }
          modality={data.modality}
          cancellationReason={
            data.cancellationReason ||
            ''
          }
          cancellationSubject={
            data.cancellationSubject ||
            ''
          }
          attachements={
            data.attechementFile || ''
          }
          // status='CANCELED'
          // status='DELIVERED'
        />
      )}
      {/* <DetailsOrders id={params.id} mode={searchParams.mode} order={null} /> */}
      {/* <CancelOrder id={params.id} /> */}
    </div>
  )
}

export default PageDetailsOrders
