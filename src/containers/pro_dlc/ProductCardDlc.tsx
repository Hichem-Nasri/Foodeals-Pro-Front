import React, { FC } from 'react'
import { Calendar, CalendarClock, Eye, PencilLine } from 'lucide-react'
import { AppRoutes } from '@/lib/routes'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ProductsType } from '@/types/product-type'
import DLCProduct from '@/types/DlcProduct'
import { Checkbox } from './checkedbox'
import { cn } from '@/lib/utils'

interface ProductCardDlcProps {
  product: DLCProduct
  isSelectionMode?: boolean
  isSelected?: boolean
  onSelect?: (id: string) => void
  borderColor?: string
}

const ProductCardDlc: FC<ProductCardDlcProps> = ({
  product,
  isSelectionMode,
  isSelected,
  onSelect,
  borderColor,
}) => {
  // Format date to DD/MM/YYYY
  const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case 'urgente':
        return 'bg-[#FEE2E2]'
      case 'exigée':
        return 'bg-[#FEF0C3]'
      case 'souhaitable':
        return 'bg-[#D1FAEC]'
      default:
        return 'bg-[#FEE2E2]'
    }
  }

  const getTextColor = (type: string) => {
    switch (type) {
      case 'urgente':
        return 'text-coral-500'
      case 'exigée':
        return 'text-tulip-400'
      case 'souhaitable':
        return 'text-mountain-400'
      default:
        return 'text-coral-500'
    }
  }

  const getBorderColor = () => {
    if (isSelectionMode && isSelected) {
      return 'border-[#FAC215]'
    }
    if (borderColor) {
      return `border-[${borderColor}]`
    }
    return 'border-transparent'
  }
  const colors = getTextColor(product?.type).replace('text-', 'border-')
  console.log('colors:', colors)
  return (
    <div
      className={cn(
        `relative flex h-auto min-w-full max-w-[400px] flex-col gap-3 rounded-[20px] border-2 border-mountain-400 bg-white p-6`,
        colors
      )}
    >
      <div className='flex h-full w-full'>
        {/* Left side - Main content */}
        <div className='flex flex-1 flex-col'>
          <div className='flex items-start justify-start space-x-2 justify-self-start'>
            <Avatar className='h-[46px] w-[46px] border border-lynch-100'>
              <AvatarImage src={product?.imageUrl} sizes='46px' />
              <AvatarFallback>
                {product?.title && product?.title[0]}
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <h1 className='font-montserrat text-[14px] font-normal leading-[17.07px] text-[#343A46]'>
                {product?.name}
              </h1>
              <h3 className='font-montserrat text-[12px] font-medium leading-[14.63px] text-[#CA9A04]'>
                {product?.category?.name}
              </h3>
              <div className='mt-2 flex items-center space-x-1.5 font-medium text-lynch-500'>
                {isSelectionMode && (
                  <div className='mr-6'>
                    <Checkbox
                      checked={isSelected !== undefined ? isSelected : false}
                      onChange={() => {
                        if (onSelect !== undefined) onSelect(product.id)
                      }}
                    />
                  </div>
                )}
                <CalendarClock size={18} />
                <h3 className='text-sm'>{formatDate(product?.creationDate)}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Status elements */}
        <div className='ml-4 flex flex-col items-end gap-2'>
          <div
            className={`flex h-[30px] w-[74px] items-center justify-center rounded-full ${getBgColor(product?.type)}`}
          >
            <span
              className={`font-montserrat text-xs font-medium leading-[14.63px] ${getTextColor(product?.type)}`}
            >
              {product?.life_time}
            </span>
          </div>
          <span className='font-montserrat text-[14px] font-medium leading-[17.07px] text-[#64748B]'>
            x{product?.quantity}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProductCardDlc
