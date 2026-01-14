import MobileHeader from '@/components/utils/MobileHeader'
import DetailsProductRecovery, {
  DetailsRecoveryT,
} from '@/containers/donate/home/details/DetailsProductRecovery'
import { PaymentMethodEnum } from '@/types/GlobalType'
import { getTranslations } from '@/i18n/config'
import api from '@/utils/api'
import React from 'react'

interface pageProps {
  params: Promise<{
    locale: string
    id: string
    productId: string
  }>
}

const getDetailsData = async (
  id: string,
  productId: string
): Promise<DetailsRecoveryT | null> => {
  try {
    if (!id || !productId) return null
    const res = await api.get(
      `/donates/product/${id}/${productId}`
    )
    if (res.status === 200) {
      return {
        ...res.data,
        RemindingDate:
          new Date().toISOString(),
        orderDate:
          new Date().toISOString(),
        deliveryStatus: 'PENDING',
      }
    }
    throw new Error(
      'Erreur lors de la récupération des données'
    )
  } catch (error) {
    console.log('error', error)
    return null
  }
}

const page: React.FC<
  pageProps
> = async ({ params }) => {
  const { locale, id, productId } = await params
  const { t } = await getTranslations(locale)
  const data = await getDetailsData(
    id,
    productId
  )
  return (
    <>
      <MobileHeader
        header={t('donate.productDetails.title')}
      />
      <DetailsProductRecovery
        {...data!}
        donateId={id}
      />
    </>
  )
}

export default page
