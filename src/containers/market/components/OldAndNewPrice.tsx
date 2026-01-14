import { PriceType } from '@/types/GlobalType'
import { ColorsT } from '@/utils/getActiveColorClassName'
import React from 'react'

interface OldAndNewPriceProps {
  color: ColorsT
  oldPrice: PriceType
  newPrice: PriceType
  displayOld?: boolean
}

const OldAndNewPrice: React.FC<OldAndNewPriceProps> = ({
  color,
  oldPrice,
  newPrice,
  displayOld = true,
}) => {
  return (
    <div className='flex-col-center'>
      <div className={`flex gap-1 text-lg font-semibold text-primary`}>
        {newPrice.amount} {newPrice.currency}
      </div>
      {displayOld && (
        <div
          className={`flex gap-1 text-sm font-semibold text-lynch-300 line-through`}
        >
          <span>
            {oldPrice.amount} {oldPrice.currency}
          </span>
        </div>
      )}
    </div>
  )
}

export default OldAndNewPrice
