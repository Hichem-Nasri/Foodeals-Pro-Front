import { Separator } from '@/components/ui/separator'
import { CartType } from '@/types/market-pro-type'
import React from 'react'
import { useBasketTranslations } from '@/hooks/useTranslations'

type TotalOrderProps = Omit<CartType, 'deals'>

const TotalOrder: React.FC<TotalOrderProps> = ({
  priceHt,
  priceTva,
  priceTotalTTc,
  commissionFoodeals,
  totalOfProducts,
}) => {
  const bt = useBasketTranslations()
  
  return (
    <div className='item-center flex w-full flex-col gap-3 rounded-[30px] bg-white p-4'>
      <div className='w-full flex-center-between'>
        <h1 className='text-base font-semibold text-lynch-950'>
          {bt('total.totalProducts')}
        </h1>
        <h1 className='text-lg font-semibold text-lynch-950'>
          {' '}
          {totalOfProducts}P
        </h1>
      </div>
      <Separator className='h-[0.5px] bg-lynch-200' />
      <div className='w-full flex-center-between'>
        <h1 className='text-sm font-medium text-lynch-950'>{bt('total.priceHT')}</h1>
        <h1 className='text-xl font-semibold text-mountain-500'>
          {priceHt.amount} {priceHt.currency}
        </h1>
      </div>
      <div className='w-full flex-center-between'>
        <h1 className='text-sm font-medium text-lynch-950'>{bt('total.priceTVA')}</h1>
        <h1 className='text-lg font-semibold text-coral-500'>
          {priceTva.amount} {priceTva.currency}
        </h1>
      </div>
      <Separator className='h-[0.5px] bg-lynch-200' />
      <div className='w-full flex-center-between'>
        <h1 className='text-sm font-medium text-lynch-950'>{bt('total.priceTotalTTC')}</h1>
        <h1 className='text-xl font-semibold text-mountain-500'>
          {priceTotalTTc.amount} {priceTotalTTc.currency}
        </h1>
      </div>
    </div>
  )
}

export default TotalOrder
