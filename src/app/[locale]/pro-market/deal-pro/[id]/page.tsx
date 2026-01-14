import { getDealPro } from '@/actions/market'
import Error from '@/app/[locale]/error'
import MobileHeader from '@/components/utils/MobileHeader'
import CreatDealPro from '@/containers/market/dealpro/create'
import DetailsDealPro from '@/containers/market/dealpro/details'
import React from 'react'
import { getTranslations } from '@/i18n/config'

interface pageProps {
  params: Promise<{
    id: string
    locale: string
  }>
}

const page: React.FC<pageProps> = async ({ params }) => {
  const { id, locale } = await params
  const { t } = await getTranslations(locale)
  const dealProData = await getDealPro(id)
  
  return (
    <>
      <MobileHeader header={t('dealPro.pageTitle')} />
      {!dealProData ? (
        <Error />
      ) : id == 'create' ? (
        <CreatDealPro id={''} dealPro={dealProData} />
      ) : (
        <DetailsDealPro
          id={id}
          dealPro={
            dealProData || {
              id: 'create',
              title: '',
              description: '',
              category: '',
              type: '',
              productImages: [''],
              prixLot: 0,
              deliveryCost: 0,
              paymentMethod: '',
              consumptionMethods: [],
              defaultUnity: {
                unity: '',
                x30: 0,
                x60: 0,
                x120: 0,
              },
              customUnity: {
                unity: '',
                global: {
                  quantity: 0,
                  price: 0,
                },
                min: {
                  quantity: 0,
                  price: 0,
                },
              },
              typeProduct: 'product',
            }
          }
        />
      )}
    </>
  )
}

export default page
