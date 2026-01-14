
import MobileHeader from '@/components/utils/MobileHeader'
import DonateCreation from '@/containers/donate/doante/detailsDonate'
import {
  DonateType,
  MultiProductType,
} from '@/schemas/donate-schema'
import api from '@/utils/api'
import React from 'react'
import Error from '@/app/[locale]/error'
import { getTranslations } from '@/i18n/config'

interface pageProps {
  params: Promise<{
    id: string
    locale: string
  }>
}

const dummyData: DonateType = {
  productImages: '',
  title: '',
  description: '',
  type: '',
  unity: '',
  quantity: 0,
  barCode: '',
  id: '',
  consumptionMethods: '',
  deliveryCost: 0,
  startDate: new Date(),
  endDate: new Date(),
  startTime: '',
  endTime: '',
  expirationDate: new Date(),
  relaunchModifyResponse: {
    organizationNameRelaunch: '',
    relaunchDate: '',
    organizationNameModifiy: '',
    modifiyDate: '',
  },
}

export interface DonateBackendRes {
  id: string
  donationType: string
  donationUnity: string
  deliveryFee: number
  donateDelivryMethod: string
  openTimes: OpenTime[]
  productsDonateResponse: ProductsDonateResponse[]
}

export interface OpenTime {
  id: string
  day: string
  from: string
  to: string
}

export interface ProductsDonateResponse {
  id: string
  avatarPath: string
  name: string
  description: string
  expirationDate: Date
  quantity: number
}
async function getMyDonation(
  id: string
): Promise<DonateType | null> {
  try {
    if (id == 'create') {
      return dummyData
    }
    const res = await api.get(
      `/donates/my-donation/${id}`
    )
    if (res.status === 200) {
      const data =
        res.data as DonateBackendRes
      const multiProduct: MultiProductType[] =
        data.donationType === 'MULTIPLE'
          ? data.productsDonateResponse.map(
              (product) => ({
                id: product.id,
                title: product.name,
                description:
                  product.description,
                productImages:
                  product.avatarPath,
                type: data.donationType,
                quantity:
                  product.quantity,
                expirationDate:
                  product.expirationDate,
                unity:
                  data.donationUnity,
              })
            )
          : []
      const donate =
        data.donationType === 'MULTIPLE'
          ? {
              title: '',
              description: '',
              productImages: '',
              type: '',
              quantity: 0,
              unity: '',
            }
          : {
              title:
                data
                  .productsDonateResponse[0]
                  .name,
              description:
                data
                  .productsDonateResponse[0]
                  .description,
              productImages:
                data
                  .productsDonateResponse[0]
                  .avatarPath,
              type: data.donationType,
              quantity:
                data
                  .productsDonateResponse[0]
                  .quantity,
              unity: data.donationUnity,
            }
      return {
        ...donate,
        id: data.id,
        type:
          data.donationType ===
          'MULTIPLE'
            ? 'MULTIPLE'
            : 'UN_PRODUIT',
        consumptionMethods:
          data.donateDelivryMethod,
        deliveryCost: data.deliveryFee,
        startDate: new Date(
          data.openTimes[0]?.day
        ),
        endDate: new Date(
          data.openTimes[1]?.day
        ),
        startTime: data.openTimes.length
          ? data.openTimes[0].from
          : '',
        endTime: data.openTimes.length
          ? data.openTimes[0].to
          : '',
        expirationDate:
          data.productsDonateResponse[0]
            .expirationDate,
        MultiProductSchema:
          multiProduct,
        relaunchModifyResponse:
          dummyData.relaunchModifyResponse,
      }
    }
    return null
  } catch (error) {
    console.error(error)
    return null
  }
}

const page: React.FC<
  pageProps
> = async ({ params }) => {
  const { id, locale } = await params
  const { t } = await getTranslations(locale)
  const data = await getMyDonation(id)
  console.log('data: ', data)
  return (
    <>
      <MobileHeader
        header={
          id == 'create'
            ? t('donate.createDonate')
            : t('donate.donateDetails')
        }
      />
      {data ? (
        <DonateCreation
          id={id == 'create' ? '' : id}
          donate={data}
        />
      ) : (
        <Error message={t('donate.errorDonateNotExist')} />
      )}
    </>
  )
}

export default page
