'use client'
import ProductDetailCard, {
  getOrderCardProps,
  OrdersListLoading,
} from '@/components/utils/ProductDetailCard'
import TopTabs, { Tab } from '@/components/custom/TopTabs'
import { useGetDelivOrders } from '@/hooks/delivery/queries/orders-queries'
import { useSearchParams } from 'next/navigation'
import ListItemsNumberFiltersTriggers from '@/components/tools/ListItemsNumberFiltersTriggers'
import { useMemo, useState } from 'react'
import EmptyListPlaceholder from '@/components/utils/EmptyListPlaceholder'
import Grid from '@/components/utils/Grid'
import { useDeliveryTranslations } from '@/hooks/useTranslations'

export default function OrderPage() {
  const { data, error, isLoading, isError } = useGetDelivOrders()
  const t = useDeliveryTranslations()

  const searchPramsTab = useSearchParams()?.get('tab')

  const tabs: Tab[] = [
    { label: t('tabs.inProgress'), query: 'in_progress' },
    { label: t('tabs.delivered'), query: 'delivered' },
    { label: t('tabs.cancelled'), query: 'canceled' },
  ]

  const filteredProducts =
    searchPramsTab === 'in_progress' || !searchPramsTab
      ? data
      : data?.filter((order) => {
          if (searchPramsTab === 'canceled') {
            return order.status === 'CANCELED'
          }
          if (searchPramsTab === 'delivered') {
            return order.status === 'COMPLETED'
          }

          return order
        })

  const getTitle = useMemo(() => {
    if (searchPramsTab === 'canceled') {
      return t('tabs.cancelled')
    } else if (searchPramsTab === 'delivered') {
      return t('tabs.delivered')
    }
    return t('tabs.inProgress')
  }, [searchPramsTab, t])

  return (
    <div className='flex flex-col gap-3 max-lg:px-2'>
      <TopTabs
        tabs={tabs}
        activeColor='purple'
        selectedTab={searchPramsTab || ''}
      />
      <ListItemsNumberFiltersTriggers
        numberOfitems={filteredProducts?.length || 0}
        title={getTitle}
        color='purple'
        archiveTriggerFn={() => {}}
        filterTriggerFn={() => {}}
      />
      {/* <div className='flex flex-wrap justify-center gap-3'> */}
      {!isLoading && filteredProducts?.length ? (
        <Grid>
          {isLoading && <OrdersListLoading />}
          {!isLoading && error && <pre>{error.message!}</pre>}

          {filteredProducts?.map((order) => (
            <ProductDetailCard key={order.id} {...getOrderCardProps(order)} />
          ))}
        </Grid>
      ) : (
        <EmptyListPlaceholder
          title={t('empty.noOrders')}
          description={t('empty.noOrdersDescription')}
        />
      )}
    </div>
  )
}
