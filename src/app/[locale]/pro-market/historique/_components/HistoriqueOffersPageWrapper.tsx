'use client'
import OffersTabs from '../../offres/components/OffersTabs'
import OffersList from '../../offres/components/OffersList'
import ListItemsNumberFiltersTriggers from '@/components/tools/ListItemsNumberFiltersTriggers'
import { useGetOffersBySelectedTab } from '@/hooks/pro-market/queries/offrers-queries'
import { TotalValueProps, TotalValues } from '@/types/GlobalType'
import { useState, useEffect } from 'react'
import PaginationData from '@/components/tools/PaginationData'
import { useHistoriqueTranslations } from '@/hooks/useTranslations'

export default function HistoriqueOffersPageWrapper() {
  const t = useHistoriqueTranslations()
  const [totals, setTotals] = useState<TotalValueProps>(TotalValues)
  const { filteredOffers, isLoading, error, isRefetching } =
    useGetOffersBySelectedTab({
      pageNum: totals.currentPage,
      pageSize: totals.pageSize,
      isHistory: true,
    })
  console.log('totalPages: ', totals.totalPages)
  useEffect(() => {
    if (isLoading || isRefetching) return
    setTotals((prev) => ({ ...prev, totalPages: filteredOffers.totalPages }))
  }, [filteredOffers.totalPages])
  return (
    <div className='flex min-h-full flex-col gap-4'>
      <OffersTabs />
      <ListItemsNumberFiltersTriggers
        title={t('offers.title')}
        numberOfitems={filteredOffers.content?.length || 0}
      />
      <OffersList
        offersListData={filteredOffers.content}
        isLoading={isLoading}
        isHistory
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
