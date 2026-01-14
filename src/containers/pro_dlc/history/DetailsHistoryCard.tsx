import { HistoryType } from '@/app/[locale]/pro-dlc/details/[detail_id]/history/[history_id]'
import HistoryCard from '@/components/custom/HistoryCard'
import { ShoppingBag, BadgePercent } from 'lucide-react'
import React from 'react'

interface DetailsHistoryCardProps {
  history: HistoryType
  isLoading?: boolean
}

const DetailsHistoryCard: React.FC<DetailsHistoryCardProps> = ({
  history,
  isLoading,
}) => {
  return (
    <div className='grid w-full grid-cols-2 gap-4 lg:grid-cols-4'>
      <HistoryCard
        isLoading={isLoading}
        Icon={ShoppingBag}
        title='Ancien QTE'
        value={'x' + history.oldQuantity}
        color='#B1BBC8'
      />
      <HistoryCard
        isLoading={isLoading}
        Icon={ShoppingBag}
        title='QTE modifier'
        value={'x' + history.newQuantity}
        color='#FAC215'
      />
      <HistoryCard
        isLoading={isLoading}
        Icon={BadgePercent}
        title='Ancien Modifier'
        value={'x' + history.oldDiscount}
        color='#B1BBC8'
      />
      <HistoryCard
        isLoading={isLoading}
        Icon={BadgePercent}
        title='Reduction modifier'
        value={'x' + history.newDiscount}
        color='#FAC215'
      />
    </div>
  )
}

export default DetailsHistoryCard
