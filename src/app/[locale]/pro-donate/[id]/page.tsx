import {
  RecoveryDetailsT,
} from '@/containers/donate/home/details'
import api from '@/utils/api'
import React from 'react'
import DetailsDonate from './DetailsDonate'
import { getTranslations } from '@/i18n/config'

interface pageProps {
  params: Promise<{
    id: string
    locale: string
  }>
}


{
  /**
{
    "id": "4c194d23-7fab-4495-a188-86216640db59",
    "managerDonorName": "Hela Landolsi",
    "donorName": "Food Bank",
    "donorAvatar": "food-bank-logo.jpg",
    "adressDonor": null,
    "deliveryPartenerName": null,
    "deliveryBoyName": null,
    "modalityDelivery": "Livraison",
    "deliveryAdress": null,
    "productsDonateResponse": [
        {
            "id": "dd8488ab-e4ba-4c54-a9b9-3021f3b8f91b",
            "avatarPath": "pizza-viande-haché.jpg",
            "name": null,
            "description": "pizza-viande-haché"
        }
    ]
}
   */
}
const getDetailsProduct = async (
  id: string
): Promise<RecoveryDetailsT | null> => {
  try {
    const res = await api.get(
      '/donates/' + id
    )
    if (res.status !== 200)
      throw new Error(
        'Erreur lors de la récupération'
      )
    return res.data
  } catch (error) {
    return null
  }
}

const page: React.FC<
  pageProps
> = async ({ params }) => {
  const { id, locale } = await params
  const { t } = await getTranslations(locale)
  const data =
    await getDetailsProduct(id)
  return (
    <>
      {!data ? (
        <div>{t('common.loading')}</div>
      ) : (
        <DetailsDonate data={data} />
      )}
    </>
  )
}

export default page
