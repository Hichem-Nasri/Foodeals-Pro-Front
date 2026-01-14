'use client'
import ListItemsNumberFiltersTriggers from '@/components/tools/ListItemsNumberFiltersTriggers'
import OrdersHistoryTabs from './OrdersHistoryTabs'
import Grid from '@/components/utils/Grid'
import OrderCard from '@/containers/market/dashboard/OrderDealCard'
import { useGetOrderHistoryList } from '@/hooks/pro-market/queries/orders-history-queries'
import { useHistoriqueTranslations } from '@/hooks/useTranslations'

export default function HistoriqueOrdersPageWrapper() {
  const t = useHistoriqueTranslations()
  const { data: orders = [], isLoading } = useGetOrderHistoryList()
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex w-full items-center justify-center rounded-none bg-transparent p-2 lg:justify-start lg:rounded-[18px] lg:bg-white'>
        <OrdersHistoryTabs />
      </div>
      <ListItemsNumberFiltersTriggers
        title={t('orders.title')}
        numberOfitems={8}
      />
      <Grid isLoading={isLoading}>
        {orders.map((order) => (
          <OrderCard key={order.id} {...order} />
        ))}
      </Grid>
    </div>
  )
}
