import TopTabs from '@/components/custom/TopTabs'
import DeliveryMenList from './components/DeliveryMenList'
import { Suspense } from 'react'
import { DeliveryHeaderMobile } from '../components/DeliveryHeader';
import { Roles } from '@/types/GlobalType';

export default async function LivreursPage({
  searchParams,
}: {
  searchParams: Promise<{
    orderId: string
  }>
}) {
  const { orderId } = await searchParams
  return (
    <div className='flex flex-col gap-3 max-lg:px-2'>
      <DeliveryMenList
        orderId={orderId}
      />
    </div>
  )
}
