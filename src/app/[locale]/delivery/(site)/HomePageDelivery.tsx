'use client'

import ProductDetailCard, {
  getOrderCardProps,
  OrdersListLoading,
} from '@/components/utils/ProductDetailCard'
import TopTabs, {
  Tab,
} from '@/components/custom/TopTabs'
import { Button } from '@/components/ui/button'
import {
  Archive,
  ListFilter,
} from 'lucide-react'
import {
  OrderType,
  useGetDelivOrders,
} from '@/hooks/delivery/queries/orders-queries'
import ListItemsNumberFiltersTriggers from '@/components/tools/ListItemsNumberFiltersTriggers'
import { useUserRole } from '@/context/UserRoleContext'
import { Roles } from '@/types/GlobalType'
import EmptyListPlaceholder from '@/components/utils/EmptyListPlaceholder'
import Grid from '@/components/utils/Grid'
import { CustomButton } from '@/components/custom/CustomButton'
import { useSearchParams } from 'next/navigation'
import { useDeliveryTranslations } from '@/hooks/useTranslations'

export default function HomePageDelivery() {
  const searchPramsTab =
    useSearchParams().get('tab') ||
    'all'
  const { data, error, isLoading } =
    useGetDelivOrders()
  const { role } = useUserRole()
  const t = useDeliveryTranslations()

  const tabs: Tab[] = [
    { label: t('tabs.all'), query: 'all' },
    {
      label: t('tabs.dealPro'),
      query: 'deal_pro',
    },
    {
      label: t('tabs.clientMarket'),
      query: 'client_market',
    },
  ]

  const allOrders = data || []
  const dealProOrders =
    allOrders.filter(
      (order) =>
        order.orderSource === 'DEAL_PRO'
    )
  const proMarketOrders =
    allOrders.filter(
      (order) =>
        order.orderSource ===
        'PRO_MARKET'
    )
  const getFilteredOrders = () => {
    switch (searchPramsTab) {
      case 'deal_pro':
        return dealProOrders
      case 'client_market':
        return proMarketOrders
      default:
        return allOrders
    }
  }
  return (
    <div className='flex flex-col gap-3 max-lg:px-2 max-lg:pt-4'>
      {role !== Roles.DELIVERY_MAN && (
        <TopTabs
          tabs={tabs}
          activeColor='purple'
          selectedTab={
            searchPramsTab || 'all'
          }
        />
      )}
      {role === Roles.DELIVERY_MAN && (
        <div className='sticky left-0 top-0 hidden w-full items-center justify-between rounded-[18px] bg-white p-3 shadow-[0px_5px_5px_2px_#00000005] lg:flex'>
          <div className='flex items-center gap-2'>
            <CustomButton
              label={t('actions.filterBy')}
              IconRight={ListFilter}
              onClick={() => {}}
              variant='outline'
              size={'sm'}
            />
            <CustomButton
              size={'sm'}
              label={t('actions.archive')}
              IconRight={Archive}
              onClick={() => {}}
              variant='outline'
            />
          </div>
        </div>
      )}
      <ListItemsNumberFiltersTriggers
        numberOfitems={
          getFilteredOrders()?.length
        }
        title={
          role === Roles.DELIVERY_MAN
            ? t('status.new')
            : getFilteredOrders()
                  ?.length === 1
              ? t('orders.command')
              : t('orders.commands')
        }
        color='purple'
        archiveTriggerFn={() => {}}
        filterTriggerFn={() => {}}
      />

      <>
        {!isLoading && error && (
          <pre>{error.message}</pre>
        )}
        {!isLoading &&
        !error &&
        getFilteredOrders().length ? (
          <Grid>
            {isLoading ? (
              <OrdersListLoading />
            ) : (
              <>
                {getFilteredOrders()?.map(
                  (order) => (
                    <ProductDetailCard
                      key={order.id}
                      {...getOrderCardProps(
                        order
                      )}
                    />
                  )
                )}
              </>
            )}
          </Grid>
        ) : (
          !isLoading &&
          !error && (
            <EmptyListPlaceholder
              title={t('empty.noOrders')}
              description={t('empty.noOrdersDescription')}
            />
          )
        )}
      </>
    </div>
  )
}
