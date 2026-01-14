'use client'
import React, { useEffect, useState } from 'react'
import OffersList from './OffersList'
import OffersTabs from './OffersTabs'
import ListItemsNumberFiltersTriggers from '@/components/tools/ListItemsNumberFiltersTriggers'
import { useGetOffersBySelectedTab } from '@/hooks/pro-market/queries/offrers-queries'
import { TotalValueProps, TotalValues } from '@/types/GlobalType'
import PaginationData from '@/components/tools/PaginationData'
import { useOffersTranslations } from '@/hooks/useTranslations'

export default function OfferPageWrapper() {
  const [totals, setTotals] = useState<TotalValueProps>(TotalValues)
  const t = useOffersTranslations()
  
  const { isLoading, filteredOffers, isRefetching } = useGetOffersBySelectedTab(
    {
      pageNum: totals.currentPage,
      pageSize: totals.pageSize,
      isHistory: false,
    }
  )
  console.log('totalsPages: ', totals.totalPages)

  useEffect(() => {
    // if (isLoading || isRefetching) return
    setTotals((prev) => ({ ...prev, totalPages: filteredOffers.totalPages }))
  }, [filteredOffers.totalPages])
  // console.log(filteredOffers)

  return (
    <div className='flex min-h-full flex-col gap-4 max-lg:px-2'>
      <OffersTabs />
      <ListItemsNumberFiltersTriggers
        title={t('title')}
        numberOfitems={filteredOffers.content?.length || 0}
      />

      <OffersList
        offersListData={filteredOffers.content}
        isLoading={isLoading || isRefetching}
      />
      <PaginationData
        pageSize={totals.pageSize}
        currentPage={totals.currentPage}
        setCurrentPage={(page) => setTotals({ ...totals, currentPage: page })}
        totalPages={totals.totalPages}
      />
    </div>
  )
}
