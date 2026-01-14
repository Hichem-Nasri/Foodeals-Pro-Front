import React from 'react'
import OfferCard, { getCardProps, OfferCardSkelaton } from './OfferCard'
import {
  BoxType,
  // OfferRes,
  OfferT,
} from '@/hooks/pro-market/queries/offrers-queries'
import EmptyListPlaceholder from '@/components/utils/EmptyListPlaceholder'
import { DealType } from '@/types/market-pro-type'
import { useOffersTranslations } from '@/hooks/useTranslations'

interface OffersListProps {
  isLoading?: boolean
  offersListData: OfferT[]
  isHistory?: boolean
}

export default function OffersList({
  isLoading = false,
  offersListData,
  isHistory = false,
}: OffersListProps) {
  const t = useOffersTranslations()
  
  return (
    <div className='flex h-full flex-col gap-2.5'>
      {isLoading && <LoadingOffersList />}

      {!isLoading && offersListData.length === 0 && (
        <EmptyListPlaceholder
          title={t('noOffers')}
          description={t('noOffersDescription')}
        />
      )}
      <div className='grid w-full grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3'>
        {!isLoading &&
          offersListData &&
          offersListData.map((offer) => (
            <OfferCard key={offer.id} {...getCardProps(offer, isHistory)} />
          ))}
      </div>
    </div>
  )
}

function LoadingOffersList() {
  return (
    <>
      {Array.from({ length: 16 }, (_, i) => (
        <OfferCardSkelaton key={i} />
      ))}
    </>
  )
}
